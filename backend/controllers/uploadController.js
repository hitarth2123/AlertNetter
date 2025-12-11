const multer = require('multer')
const path = require('path')
const configureCloudinary = require('../config/cloudinary')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})

const upload = multer({ storage })

const uploadPhoto = async (req, res) => {
  const file = req.file
  if (!file) return res.status(400).json({ message: 'No file' })
  if (process.env.NODE_ENV === 'test') {
    return res.json({ url: `http://example.com/${path.basename(file.path)}` })
  }
  const cloudinary = configureCloudinary()
  if (!process.env.CLOUDINARY_CLOUD_NAME) return res.status(400).json({ message: 'Cloudinary not configured' })
  const result = await cloudinary.uploader.upload(file.path, { folder: 'alertnet' })
  res.json({ url: result.secure_url })
}

module.exports = { upload, uploadPhoto }
