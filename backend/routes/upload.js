const express = require('express')
const auth = require('../middleware/auth')
const { upload, uploadPhoto } = require('../controllers/uploadController')

const router = express.Router()

router.post('/', auth, upload.single('photo'), uploadPhoto)

module.exports = router
