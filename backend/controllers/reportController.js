const Report = require('../models/Report')
const Verification = require('../models/Verification')

const createReport = async (req, res) => {
  const { incidentType, severity, description, lat, lng, photoUrl } = req.body
  if (lat === undefined || lng === undefined) return res.status(400).json({ message: 'Invalid location' })
  const report = await Report.create({
    location: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
    incidentType,
    severity,
    description,
    photoUrl,
    reportedBy: req.user._id
  })
  req.io.emit('newReport', report)
  res.status(201).json(report)
}

const getReports = async (req, res) => {
  const { lat, lng, radius } = req.query
  if (lat && lng && radius) {
    const meters = Number(radius)
    const reports = await Report.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: meters
        }
      }
    }).sort({ timestamp: -1 })
    return res.json(reports)
  }
  const reports = await Report.find().sort({ timestamp: -1 })
  res.json(reports)
}

const getReportById = async (req, res) => {
  const report = await Report.findById(req.params.id).populate('reportedBy', 'username role').populate('verifications')
  if (!report) return res.status(404).json({ message: 'Not found' })
  res.json(report)
}

const verifyReport = async (req, res) => {
  const report = await Report.findById(req.params.id)
  if (!report) return res.status(404).json({ message: 'Not found' })
  const existing = await Verification.findOne({ reportId: report._id, userId: req.user._id })
  if (existing) return res.status(409).json({ message: 'Already voted' })
  const vote = req.body.vote === true || req.body.vote === 'true'
  const verification = await Verification.create({ reportId: report._id, userId: req.user._id, vote })
  report.verifications.push(verification._id)
  const all = await Verification.find({ reportId: report._id })
  const up = all.filter(v => v.vote).length
  const down = all.length - up
  if (up >= 3 && up >= down) report.status = 'verified'
  if (down >= 3 && down > up) report.status = 'rejected'
  await report.save()
  req.io.emit('reportVerified', { reportId: report._id, status: report.status })
  res.json({ status: report.status })
}

const deleteReport = async (req, res) => {
  const report = await Report.findByIdAndDelete(req.params.id)
  if (!report) return res.status(404).json({ message: 'Not found' })
  res.json({ message: 'Deleted' })
}

const nearbyReports = async (req, res) => {
  const { lat, lng, radius } = req.query
  if (!lat || !lng || !radius) return res.status(400).json({ message: 'Invalid query' })
  const meters = Number(radius)
  const reports = await Report.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: meters
      }
    }
  }).sort({ timestamp: -1 })
  res.json(reports)
}

module.exports = { createReport, getReports, getReportById, verifyReport, deleteReport, nearbyReports }
