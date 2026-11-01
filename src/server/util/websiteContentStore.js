import { randomUUID } from 'node:crypto'
import WebsiteContent from '../model/website-content.model.js'
import WebsiteContentRevision from '../model/website-content-revision.model.js'
import { getContentField, validateContentValue, validateExpectedRevision } from './websiteContentPolicy.js'
import { TryError } from './error.js'

// A journaled single-document reservation is the durable outbox. It works on
// the existing standalone MongoDB deployment; no replica-set change is needed.
const writeConcern = { w: 'majority', j: true }
const indexesByDatabase = new WeakMap()
const committedProjection = { _id: 0, key: 1, scope: 1, pagePath: 1, contentType: 1, value: 1, hasOverride: 1, revision: 1, updatedAt: 1 }
const historyProjection = { _id: 0, key: 1, previousValue: 1, newValue: 1, revision: 1, administrator: 1, changedAt: 1, action: 1, previousOverride: 1, hasOverride: 1, restoredFromRevision: 1 }

function validateCommittedState(state) {
    const field = getContentField(state.key, { editable: true })
    if (state.scope !== field.scope || state.pagePath !== field.pagePath || state.contentType !== field.contentType || !Number.isSafeInteger(state.revision) || state.revision < 0 || typeof state.hasOverride !== 'boolean' || !state.hasOverride && state.value !== undefined) throw TryError('Stored content state is invalid', 503)
    if (state.hasOverride) {
        try { validateContentValue(field, state.value) }
        catch { throw TryError('Stored content state is invalid', 503) }
    }
}

export async function ensureWebsiteContentIndexes() {
    const database = WebsiteContent.db.db
    if (!database) throw TryError('Database unavailable', 503)
    let pending = indexesByDatabase.get(database)
    if (!pending) {
        pending = Promise.all([WebsiteContent.createIndexes(), WebsiteContentRevision.createIndexes()]).catch(error => {
            indexesByDatabase.delete(database)
            throw error
        })
        indexesByDatabase.set(database, pending)
    }
    await pending
}

// Public reads deliberately perform no recovery, collection initialization or
// other writes. An interrupted save remains at its last committed value.
export async function readContentState(key) {
    getContentField(key)
    return WebsiteContent.findOne({ key }, committedProjection).lean()
}

export async function readContentStates(keys) {
    if (!Array.isArray(keys)) throw TryError('Invalid content keys', 400)
    for (const key of keys) getContentField(key)
    return WebsiteContent.find({ key: { $in: [...new Set(keys)] } }, committedProjection).lean()
}

const eventFromPending = (key, pending) => ({
    key,
    previousValue: pending.previousValue,
    newValue: pending.newValue,
    revision: pending.revision,
    administrator: pending.administrator,
    changedAt: pending.changedAt,
    action: pending.action,
    previousOverride: pending.previousOverride,
    hasOverride: pending.hasOverride,
    restoredFromRevision: pending.restoredFromRevision ?? null,
})

const sameEvent = (actual, expected) => actual &&
    actual.key === expected.key && actual.revision === expected.revision &&
    actual.previousValue === expected.previousValue && actual.newValue === expected.newValue &&
    String(actual.administrator) === String(expected.administrator) &&
    new Date(actual.changedAt).getTime() === new Date(expected.changedAt).getTime() &&
    actual.action === expected.action && actual.previousOverride === expected.previousOverride &&
    actual.hasOverride === expected.hasOverride && (actual.restoredFromRevision ?? null) === expected.restoredFromRevision

async function persistPendingRevision(key, pending) {
    const event = eventFromPending(key, pending)
    await new WebsiteContentRevision(event).validate()
    let stored
    try {
        stored = await WebsiteContentRevision.findOneAndUpdate(
            { key, revision: pending.revision },
            { $setOnInsert: event },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: false, writeConcern }
        ).lean()
    } catch (error) {
        if (error?.code !== 11000) throw error
        stored = await WebsiteContentRevision.findOne({ key, revision: pending.revision }).lean()
    }
    // Recovery may race another worker for the same reservation, but may never
    // accept a different audit event with the same key/revision.
    if (!sameEvent(stored, event)) throw TryError('Content revision recovery failed', 503)
}

async function finishPendingState(state) {
    const field = getContentField(state.key, { editable: true })
    await new WebsiteContent(state).validate()
    const pending = state.pending
    await persistPendingRevision(state.key, pending)
    const set = {
        hasOverride: pending.hasOverride,
        revision: pending.revision,
        updatedBy: pending.administrator,
        updatedAt: pending.changedAt,
        pending: null,
    }
    if (pending.hasOverride) set.value = validateContentValue(field, pending.newValue)
    const update = { $set: set }
    if (!pending.hasOverride) update.$unset = { value: 1 }
    return WebsiteContent.findOneAndUpdate(
        { key: state.key, revision: state.revision, 'pending.token': pending.token },
        update,
        { new: true, runValidators: true, projection: committedProjection, writeConcern }
    ).lean()
}

export async function recoverContentState(key) {
    getContentField(key, { editable: true })
    await ensureWebsiteContentIndexes()
    // Another process may finish the pending event while this worker is doing
    // the same recovery. Re-read instead of overwriting its later revision.
    for (let attempt = 0; attempt < 16; attempt++) {
        const state = await WebsiteContent.findOne({ key }).select('+pending').lean()
        if (!state) return null
        validateCommittedState(state)
        if (!state.pending) return readContentState(key)
        const committed = await finishPendingState(state)
        if (committed) return committed
    }
    throw TryError('Content is busy; please retry', 409)
}

export async function recoverContentStates(keys) {
    if (!Array.isArray(keys)) throw TryError('Invalid content keys', 400)
    for (const key of keys) getContentField(key, { editable: true })
    await ensureWebsiteContentIndexes()
    const rows = await WebsiteContent.find({ key: { $in: [...new Set(keys)] } }).select('+pending').lean()
    const states = []
    for (const row of rows) {
        validateCommittedState(row)
        if (row.pending) {
            const state = await finishPendingState(row) || await recoverContentState(row.key)
            if (state) states.push(state)
        } else {
            // This batch selected private recovery data internally. Project
            // every returned row explicitly, including ordinary committed rows.
            const state = {}
            for (const [name, included] of Object.entries(committedProjection)) {
                if (included && Object.hasOwn(row, name)) state[name] = row[name]
            }
            states.push(state)
        }
    }
    return states
}

export async function changeWebsiteContent(field, { expectedRevision, value, hasOverride = true, action = 'save', administrator, restoredFromRevision = null }) {
    field = getContentField(field?.key, { editable: true })
    expectedRevision = validateExpectedRevision(expectedRevision)
    if (!['save', 'restore', 'reset'].includes(action) || typeof hasOverride !== 'boolean') throw TryError('Invalid content action', 400)
    if (typeof administrator !== 'string' || !/^[a-f\d]{24}$/i.test(administrator)) throw TryError('Invalid administrator reference', 400)
    const newValue = hasOverride ? validateContentValue(field, value) : field.defaultValue
    const state = await recoverContentState(field.key)
    const revision = state?.revision ?? 0
    if (revision !== expectedRevision) throw TryError('Content has changed; reload before saving', 409)
    const pending = {
        token: randomUUID(),
        previousValue: state?.hasOverride ? state.value : field.defaultValue,
        newValue,
        revision: revision + 1,
        administrator,
        changedAt: new Date(),
        action,
        previousOverride: state?.hasOverride ?? false,
        hasOverride,
        restoredFromRevision,
    }
    const metadata = { key: field.key, scope: field.scope, pagePath: field.pagePath, contentType: field.contentType }
    await new WebsiteContent({
        ...metadata,
        value: state?.hasOverride ? state.value : undefined,
        hasOverride: state?.hasOverride ?? false,
        revision,
        updatedAt: state?.updatedAt ?? null,
        pending,
    }).validate()
    let reserved
    try {
        const update = { $set: { pending } }
        if (!state) update.$setOnInsert = { ...metadata, hasOverride: false, revision: 0 }
        reserved = await WebsiteContent.findOneAndUpdate(
            { key: field.key, revision, pending: null },
            update,
            { upsert: !state, new: true, runValidators: true, setDefaultsOnInsert: false, writeConcern }
        ).select('+pending').lean()
    } catch (error) {
        if (error?.code === 11000) throw TryError('Content has changed; reload before saving', 409)
        throw error
    }
    if (!reserved) throw TryError('Content has changed; reload before saving', 409)
    const committed = await finishPendingState(reserved)
    if (!committed) {
        const latest = await readContentState(field.key)
        if (!latest || latest.revision < pending.revision) throw TryError('Content revision recovery failed', 503)
    }
    // Return this operation, even if another administrator has committed a
    // later revision before the response reaches this worker.
    return { key: field.key, value: newValue, hasOverride, revision: pending.revision, updatedAt: pending.changedAt }
}

export async function getWebsiteContentHistory(field, { before = null, limit = 25 } = {}) {
    field = getContentField(field?.key, { editable: true })
    if (before !== null && (!Number.isSafeInteger(before) || before < 1)) throw TryError('Invalid history cursor', 400)
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw TryError('Invalid history limit', 400)
    const state = await recoverContentState(field.key)
    const range = { $lte: state?.revision ?? 0 }
    if (before !== null) range.$lt = before
    const rows = await WebsiteContentRevision.find({ key: field.key, revision: range }, historyProjection).sort({ revision: -1 }).limit(limit + 1).lean()
    const hasMore = rows.length > limit
    const entries = rows.slice(0, limit)
    return { revision: state?.revision ?? 0, entries, hasMore, nextBefore: hasMore ? entries.at(-1).revision : null }
}

export async function findWebsiteContentRevision(field, revision) {
    field = getContentField(field?.key, { editable: true })
    if (!Number.isSafeInteger(revision) || revision < 1) throw TryError('Invalid content revision', 400)
    const state = await recoverContentState(field.key)
    if (!state || revision > state.revision) return null
    return WebsiteContentRevision.findOne({ key: field.key, revision }, historyProjection).lean()
}
