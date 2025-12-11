describe('Responder APIs', () => {
  it('gets heatmap data', async () => {
    const res = await global.__request.get('/api/responders/heatmap')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('activeUsers')
  })

  it('gets statistics', async () => {
    const res = await global.__request.get('/api/responders/statistics')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('incidents')
  })
})
