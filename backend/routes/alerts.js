const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validate = require('../middleware/validate')
const { createAlert, getAlerts, getAlertsForLocation, updateAlert, deleteAlert } = require('../controllers/alertController')

const router = express.Router()

router.post('/', auth, admin, validate([{ field: 'message', required: true }, { field: 'severity', required: true }, { field: 'geoFence', required: true }, { field: 'expiresAt', required: true }]), createAlert)
router.get('/', getAlerts)
router.get('/location', getAlertsForLocation)
router.put('/:id', auth, admin, updateAlert)
router.delete('/:id', auth, admin, deleteAlert)

module.exports = router
