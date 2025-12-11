require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const path = require('path')
const mongoose = require('mongoose')
const User = require('../models/User')
const Report = require('../models/Report')
const Alert = require('../models/Alert')
const Verification = require('../models/Verification')

;(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/alertnet_db'
  await mongoose.connect(uri)
  await User.deleteMany({})
  await Report.deleteMany({})
  await Alert.deleteMany({})
  await Verification.deleteMany({})

  const admin = await User.create({ username: 'admin', email: 'admin@example.com', password: '$2a$10$WqZkqv9GmWQbKx6QO5EoBeEoM7I6Aq2fA5qR1mYbR6qIhD6Qn3WfO', role: 'admin' })
  const user1 = await User.create({ username: 'alice', email: 'alice@example.com', password: '$2a$10$WqZkqv9GmWQbKx6QO5EoBeEoM7I6Aq2fA5qR1mYbR6qIhD6Qn3WfO', role: 'citizen' })
  const user2 = await User.create({ username: 'bob', email: 'bob@example.com', password: '$2a$10$WqZkqv9GmWQbKx6QO5EoBeEoM7I6Aq2fA5qR1mYbR6qIhD6Qn3WfO', role: 'citizen' })

  const sampleReports = [
    { incidentType: 'fire', severity: 'high', description: 'Wildfire', coords: [77.5946, 12.9716] },
    { incidentType: 'flood', severity: 'medium', description: 'Street flood', coords: [72.8777, 19.0760] },
    { incidentType: 'earthquake', severity: 'critical', description: 'Aftershock', coords: [-118.2437, 34.0522] },
    { incidentType: 'accident', severity: 'low', description: 'Minor crash', coords: [-0.1276, 51.5074] },
    { incidentType: 'storm', severity: 'high', description: 'Heavy storm', coords: [139.6917, 35.6895] }
  ]

  for (const r of sampleReports) {
    await Report.create({ location: { type: 'Point', coordinates: r.coords }, incidentType: r.incidentType, severity: r.severity, description: r.description, reportedBy: user1._id })
  }

  const sampleAlerts = [
    {
      message: 'Evacuate area',
      severity: 'critical',
      polygon: [[[77.5, 12.9], [77.7, 12.9], [77.7, 13.1], [77.5, 13.1], [77.5, 12.9]]]
    },
    {
      message: 'Flood warning',
      severity: 'high',
      polygon: [[[72.8, 19.0], [72.95, 19.0], [72.95, 19.15], [72.8, 19.15], [72.8, 19.0]]]
    }
  ]

  for (const a of sampleAlerts) {
    await Alert.create({ message: a.message, severity: a.severity, geoFence: { type: 'Polygon', coordinates: a.polygon }, issuedBy: admin._id, expiresAt: new Date(Date.now() + 24 * 3600 * 1000) })
  }

  await mongoose.disconnect()
  process.exit(0)
})()
