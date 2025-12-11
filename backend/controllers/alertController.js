const Alert = require('../models/Alert')

const createAlert = async (req, res) => {
  const { message, severity, geoFence, expiresAt } = req.body
  const alert = await Alert.create({ message, severity, geoFence, issuedBy: req.user._id, expiresAt, isActive: true })
  req.io.emit('newAlert', alert)
  res.status(201).json(alert)
}

const getAlerts = async (req, res) => {
  const alerts = await Alert.find({ isActive: true }).sort({ timestamp: -1 })
  res.json(alerts)
}

const getAlertsForLocation = async (req, res) => {
  const { lat, lng } = req.query
  if (!lat || !lng) return res.status(400).json({ message: 'Invalid query' })
  const alerts = await Alert.find({
    isActive: true,
    geoFence: { $geoIntersects: { $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] } } }
  }).sort({ timestamp: -1 })
  res.json(alerts)
}

const updateAlert = async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!alert) return res.status(404).json({ message: 'Not found' })
  res.json(alert)
}

const deleteAlert = async (req, res) => {
  const alert = await Alert.findByIdAndDelete(req.params.id)
  if (!alert) return res.status(404).json({ message: 'Not found' })
  res.json({ message: 'Deleted' })
}

module.exports = { createAlert, getAlerts, getAlertsForLocation, updateAlert, deleteAlert }
