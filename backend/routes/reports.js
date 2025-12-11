const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validate = require('../middleware/validate')
const { reportLimiter } = require('../middleware/rateLimiter')
const { createReport, getReports, getReportById, verifyReport, deleteReport, nearbyReports } = require('../controllers/reportController')

const router = express.Router()

router.post('/', auth, reportLimiter, validate([{ field: 'incidentType', required: true }, { field: 'severity', required: true }, { field: 'lat', required: true }, { field: 'lng', required: true }]), createReport)
router.get('/', getReports)
router.get('/nearby', nearbyReports)
router.get('/:id', getReportById)
router.put('/:id/verify', auth, validate([{ field: 'vote', required: true }]), verifyReport)
router.delete('/:id', auth, admin, deleteReport)

module.exports = router
