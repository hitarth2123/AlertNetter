const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req, res) => {
  const { username, email, password, role } = req.body
  const existing = await User.findOne({ $or: [{ email }, { username }] })
  if (existing) return res.status(409).json({ message: 'User exists' })
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const user = await User.create({ username, email, password: hash, role: role || 'citizen' })
  res.status(201).json({ id: user._id, username: user.username, email: user.email, role: user.role })
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } })
}

const me = async (req, res) => {
  const user = req.user
  res.json({ id: user._id, username: user.username, email: user.email, role: user.role })
}

module.exports = { register, login, me }
