import mongoose, { Schema, model } from 'mongoose'
import { getContentField, validateContentValue } from '../util/websiteContentPolicy.js'

const safeRevision = value => Number.isSafeInteger(value) && value >= 0

const pendingContentChangeSchema = new Schema({
    token: { type: String, required: true, match: /^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i },
    previousValue: { type: Schema.Types.Mixed, required: true },
    newValue: { type: Schema.Types.Mixed, required: true },
    revision: { type: Number, required: true, validate: value => safeRevision(value) && value > 0 },
    administrator: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
    changedAt: { type: Date, required: true },
    action: { type: String, enum: ['save', 'restore', 'reset'], required: true },
    previousOverride: { type: Boolean, required: true },
    hasOverride: { type: Boolean, required: true },
    restoredFromRevision: { type: Number, default: null, validate: value => value === null || safeRevision(value) && value > 0 },
}, { _id: false, strict: 'throw', versionKey: false })

const websiteContentSchema = new Schema({
    key: { type: String, required: true, maxlength: 256 },
    scope: { type: String, enum: ['global', 'page'], required: true },
    pagePath: { type: String, default: null },
    contentType: { type: String, enum: ['text', 'number', 'image', 'url'], required: true },
    value: { type: Schema.Types.Mixed, default: undefined },
    hasOverride: { type: Boolean, required: true, default: false },
    revision: { type: Number, required: true, default: 0, validate: safeRevision },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Auth', default: null },
    updatedAt: { type: Date, default: null },
    // One durable operation at a time. This is private recovery state, never a
    // second published value or a public API field.
    pending: { type: pendingContentChangeSchema, default: null, select: false },
}, { strict: 'throw', versionKey: false, autoCreate: false, autoIndex: false })

websiteContentSchema.index({ key: 1 }, { unique: true, name: 'website_content_key_unique' })
websiteContentSchema.index({ scope: 1, pagePath: 1, hasOverride: 1 }, { name: 'website_content_page' })

websiteContentSchema.pre('validate', function () {
    const field = getContentField(this.key, { editable: true })
    if (this.scope !== field.scope) this.invalidate('scope', 'Scope does not match the content registry')
    if (this.pagePath !== field.pagePath) this.invalidate('pagePath', 'Page does not match the content registry')
    if (this.contentType !== field.contentType) this.invalidate('contentType', 'Type does not match the content registry')
    if (this.hasOverride) validateContentValue(field, this.value)
    else if (this.value !== undefined) this.invalidate('value', 'Reset content cannot retain an override value')
    if (this.pending) {
        validateContentValue(field, this.pending.previousValue)
        validateContentValue(field, this.pending.newValue)
        if (this.pending.revision !== this.revision + 1) this.invalidate('pending.revision', 'Pending revision must follow committed revision')
        if (this.pending.previousOverride !== this.hasOverride) this.invalidate('pending.previousOverride', 'Pending source state does not match')
        const previousValue = this.hasOverride ? this.value : field.defaultValue
        if (this.pending.previousValue !== previousValue) this.invalidate('pending.previousValue', 'Pending source value does not match')
        if (!this.pending.hasOverride && this.pending.newValue !== field.defaultValue) this.invalidate('pending.newValue', 'Reset value must match the original content')
        if (this.pending.action === 'save' && !this.pending.hasOverride) this.invalidate('pending.hasOverride', 'Save requires an override')
        if (this.pending.action === 'reset' && this.pending.hasOverride) this.invalidate('pending.hasOverride', 'Reset cannot retain an override')
        if (this.pending.action === 'restore' && !(Number.isSafeInteger(this.pending.restoredFromRevision) && this.pending.restoredFromRevision > 0)) this.invalidate('pending.restoredFromRevision', 'Restore requires a source revision')
        if (this.pending.action !== 'restore' && this.pending.restoredFromRevision !== null) this.invalidate('pending.restoredFromRevision', 'Source revision is only valid for restore')
    }
})

const WebsiteContent = mongoose.models.WebsiteContent || model('WebsiteContent', websiteContentSchema)
export default WebsiteContent
