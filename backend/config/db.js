const mongoose = require('mongoose')

const connectDB = async (uri) => {
  return mongoose.connect(uri, { serverSelectionTimeoutMS: 60000 })
}

module.exports = connectDB
