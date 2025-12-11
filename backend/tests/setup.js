const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  process.env.MONGO_URI = mongoServer.getUri()
  process.env.JWT_SECRET = 'testsecret'
  process.env.PORT = '0'
  process.env.NODE_ENV = 'test'
  process.env.CLOUDINARY_CLOUD_NAME = ''
  const { server } = require('../server')
  global.__server = server
  global.__request = require('supertest')(server)
})

afterAll(async () => {
  try {
    await mongoose.disconnect()
  } catch {}
  if (global.__server && global.__server.close) {
    await new Promise((resolve) => global.__server.close(resolve))
  }
  if (mongoServer) await mongoServer.stop()
})
