const mongoose = require('mongoose')

const VerificationSchema = new mongoose.Schema(
  {
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vote: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Verification', VerificationSchema)
