const mongoose = require('mongoose')

const AlertSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    geoFence: {
      type: { type: String, enum: ['Polygon'], default: 'Polygon' },
      coordinates: { type: [[[Number]]], required: true }
    },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

AlertSchema.index({ geoFence: '2dsphere' })
AlertSchema.index({ isActive: 1, expiresAt: 1 })

module.exports = mongoose.model('Alert', AlertSchema)
