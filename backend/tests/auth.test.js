describe('Auth APIs', () => {
  let token
  it('registers a user', async () => {
    const res = await global.__request
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password' })
    expect(res.status).toBe(201)
    expect(res.body.username).toBe('testuser')
  })

  it('logs in a user and returns token', async () => {
    const res = await global.__request
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    token = res.body.token
  })

  it('gets current user with token', async () => {
    const res = await global.__request
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.email).toBe('test@example.com')
  })
})
