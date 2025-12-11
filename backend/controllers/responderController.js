const getHeatmap = async (req, res) => {
  const count = req.app.locals.activeUsers || 0
  res.json({ activeUsers: count, points: [] })
}

const getStatistics = async (req, res) => {
  res.json({ incidents: 0, alerts: 0 })
}

module.exports = { getHeatmap, getStatistics }
