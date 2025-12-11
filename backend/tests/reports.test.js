describe('Report APIs', () => {
  let userToken
  let reportId
  beforeAll(async () => {
    await global.__request
      .post('/api/auth/register')
      .send({ username: 'ruser', email: 'ruser@example.com', password: 'password' })
    const res = await global.__request
      .post('/api/auth/login')
      .send({ email: 'ruser@example.com', password: 'password' })
    userToken = res.body.token
  })

  it('creates a new report', async () => {
    const res = await global.__request
      .post('/api/reports')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ incidentType: 'fire', severity: 'high', description: 'Smoke seen', lat: 12.9716, lng: 77.5946 })
    expect(res.status).toBe(201)
    expect(res.body.incidentType).toBe('fire')
    reportId = res.body._id
  })

  it('lists all reports', async () => {
    const res = await global.__request.get('/api/reports')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(1)
  })

  it('gets report by id', async () => {
    const res = await global.__request.get(`/api/reports/${reportId}`)
    expect(res.status).toBe(200)
    expect(res.body._id).toBe(reportId)
  })

  it('gets nearby reports', async () => {
    const res = await global.__request.get('/api/reports/nearby?lat=12.9716&lng=77.5946&radius=5000')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('verifies a report (upvote)', async () => {
    const res = await global.__request
      .put(`/api/reports/${reportId}/verify`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ vote: true })
    expect(res.status).toBe(200)
    expect(['pending', 'verified', 'rejected']).toContain(res.body.status)
  })
})
