describe('Upload API', () => {
  let token
  beforeAll(async () => {
    await global.__request
      .post('/api/auth/register')
      .send({ username: 'uploader', email: 'uploader@example.com', password: 'password' })
    const res = await global.__request
      .post('/api/auth/login')
      .send({ email: 'uploader@example.com', password: 'password' })
    token = res.body.token
  })

  it('rejects when no file provided', async () => {
    const res = await global.__request
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(400)
  })

  it('rejects when Cloudinary not configured', async () => {
    const res = await global.__request
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('photo', Buffer.from('fake'), 'fake.jpg')
    expect(res.status).toBe(200)
    expect(res.body.url).toBeDefined()
  })
})
