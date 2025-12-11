describe('Alert APIs', () => {
  let adminToken
  let alertId
  beforeAll(async () => {
    await global.__request
      .post('/api/auth/register')
      .send({ username: 'admin', email: 'admin@example.com', password: 'password', role: 'admin' })
    const res = await global.__request
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password' })
    adminToken = res.body.token
  })

  it('creates a new alert (admin)', async () => {
    const polygon = [[[77.5, 12.9], [77.7, 12.9], [77.7, 13.1], [77.5, 13.1], [77.5, 12.9]]]
    const res = await global.__request
      .post('/api/alerts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ message: 'Evacuate', severity: 'critical', geoFence: { type: 'Polygon', coordinates: polygon }, expiresAt: new Date(Date.now() + 3600_000).toISOString() })
    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Evacuate')
    alertId = res.body._id
  })

  it('lists active alerts', async () => {
    const res = await global.__request.get('/api/alerts')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(1)
  })

  it('gets alerts for location', async () => {
    const res = await global.__request.get('/api/alerts/location?lat=12.95&lng=77.6')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('updates an alert (admin)', async () => {
    const res = await global.__request
      .put(`/api/alerts/${alertId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ message: 'Evacuate now' })
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Evacuate now')
  })

  it('deletes an alert (admin)', async () => {
    const res = await global.__request
      .delete(`/api/alerts/${alertId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Deleted')
  })
})
