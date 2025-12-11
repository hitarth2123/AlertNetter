require('dotenv').config()
const path = require('path')
const fs = require('fs')
const express = require('express')
const http = require('http')
const cors = require('cors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { cors: { origin: '*' } })

const log = (...args) => { if (process.env.NODE_ENV !== 'test') console.log(...args) }
log('Starting server')

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    log('Port in use, selecting a free port')
    server.close(() => {
      server.listen(0, () => {})
    })
  }
})

if (!fs.existsSync(path.join(__dirname, 'uploads'))) fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true })

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  req.io = io
  next()
})

io.on('connection', (socket) => {
  app.locals.activeUsers = (app.locals.activeUsers || 0) + 1
  io.emit('userCountUpdate', app.locals.activeUsers)
  socket.on('joinLocation', (payload) => {
    const room = `loc:${payload.lat}:${payload.lng}`
    socket.join(room)
  })
  socket.on('leaveLocation', (payload) => {
    const room = `loc:${payload.lat}:${payload.lng}`
    socket.leave(room)
  })
  socket.on('updateLocation', (payload) => {
    const room = `loc:${payload.lat}:${payload.lng}`
    socket.rooms.forEach(r => socket.leave(r))
    socket.join(room)
  })
  socket.on('disconnect', () => {
    app.locals.activeUsers = Math.max((app.locals.activeUsers || 1) - 1, 0)
    io.emit('userCountUpdate', app.locals.activeUsers)
  })
})

const authRoutes = require('./routes/auth')
const reportRoutes = require('./routes/reports')
const alertRoutes = require('./routes/alerts')
const responderRoutes = require('./routes/responders')
const uploadRoutes = require('./routes/upload')

app.use('/api/auth', authRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/responders', responderRoutes)
app.use('/api/upload', uploadRoutes)

app.use(errorHandler)

const port = process.env.PORT || 5000
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/alertnet_db'

log('Connecting to database')
connectDB(uri)
  .then(() => {
    log('Database connected')
    server.listen(port, () => {
      const addr = server.address()
      const p = typeof addr === 'string' ? addr : addr.port
      log(`HTTP server listening on port ${p}`)
    })
  })
  .catch(() => {
    log('Database connection failed')
    if (process.env.NODE_ENV !== 'test') process.exit(1)
  })

module.exports = { app, server }
