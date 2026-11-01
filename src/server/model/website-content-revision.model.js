import mongoose, { Schema, model } from 'mongoose'
import { getContentField, validateContentValue } from '../util/websiteContentPolicy.js'

const safeRevision = value => Number.isSafeInteger(value) && value > 0

const websiteContentRevisionSchema = new Schema({
    key: { type: String, required: true, maxlength: 256 },
    previousValue: { type: Schema.Types.Mixed, required: true },
    newValue: { type: Schema.Types.Mixed, required: true },
    revision: { type: Number, required: true, validate: safeRevision },
    administrator: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
    changedAt: { type: Date, required: true },
    action: { type: String, enum: ['save', 'restore', 'reset'], required: true },
    previousOverride: { type: Boolean, required: true },
    hasOverride: { type: Boolean, required: true },
    restoredFromRevision: { type: Number, default: null, validate: value => value === null || safeRevision(value) },
}, { strict: 'throw', versionKey: false, autoCreate: false, autoIndex: false })

websiteContentRevisionSchema.index({ key: 1, revision: 1 }, { unique: true, name: 'website_content_revision_unique' })

websiteContentRevisionSchema.pre('validate', function () {
    const field = getContentField(this.key, { editable: true })
    validateContentValue(field, this.previousValue)
    validateContentValue(field, this.newValue)
    if (!this.hasOverride && this.newValue !== field.defaultValue) this.invalidate('newValue', 'Reset value must match the original content')
    if (this.action === 'save' && !this.hasOverride) this.invalidate('hasOverride', 'Save requires an override')
    if (this.action === 'reset' && this.hasOverride) this.invalidate('hasOverride', 'Reset cannot retain an override')
    if (this.action === 'restore' && !safeRevision(this.restoredFromRevision)) this.invalidate('restoredFromRevision', 'Restore requires a source revision')
    if (this.action !== 'restore' && this.restoredFromRevision !== null) this.invalidate('restoredFromRevision', 'Source revision is only valid for restore')
})

const WebsiteContentRevision = mongoose.models.WebsiteContentRevision || model('WebsiteContentRevision', websiteContentRevisionSchema)
export default WebsiteContentRevision
