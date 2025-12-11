const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema(
  {
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    },
    incidentType: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    description: { type: String },
    photoUrl: { type: String },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    verifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Verification' }],
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

ReportSchema.index({ location: '2dsphere' })
ReportSchema.index({ timestamp: -1 })

module.exports = mongoose.model('Report', ReportSchema)
