const express = require('express')
const { register, login, me } = require('../controllers/authController')
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')

const router = express.Router()

router.post('/register', validate([{ field: 'username', required: true }, { field: 'email', required: true }, { field: 'password', required: true }]), register)
router.post('/login', validate([{ field: 'email', required: true }, { field: 'password', required: true }]), login)
router.get('/me', auth, me)

module.exports = router
