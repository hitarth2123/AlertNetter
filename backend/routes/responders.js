const express = require('express')
const { getHeatmap, getStatistics } = require('../controllers/responderController')

const router = express.Router()

router.get('/heatmap', getHeatmap)
router.get('/statistics', getStatistics)

module.exports = router
