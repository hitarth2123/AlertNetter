const validate = (rules) => {
  return (req, res, next) => {
    for (const rule of rules) {
      const { field, required } = rule
      if (required && (req.body[field] === undefined || req.body[field] === null || req.body[field] === '')) {
        return res.status(400).json({ message: `Invalid ${field}` })
      }
    }
    next()
  }
}

module.exports = validate
