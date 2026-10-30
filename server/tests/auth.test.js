/**
 * Registration, login and the logged-in user's profile (/api/users).
 */
const request = require('supertest')
const app = require('../app')
const { PASSWORD, seed, authFor } = require('./helpers')

let data

beforeEach(async () => {
  data = await seed()
})

describe('POST /api/users/register', () => {
  test('creates an account and returns a token without the password', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'Lina',
      email: 'lina@test.se',
      password: PASSWORD,
      school: data.school._id,
      program: data.program._id,
    })

    expect(res.status).toBe(201)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.user.email).toBe('lina@test.se')
    expect(res.body.user.role).toBe('student')
    expect(res.body.user.password).toBeUndefined()
  })

  test('rejects an email that is already registered', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'Anna 2',
      email: 'anna@test.se',
      password: PASSWORD,
      school: data.school._id,
      program: data.program._id,
    })

    expect(res.status).toBe(409)
  })

  test('rejects a program the school does not offer', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'Lina',
      email: 'lina@test.se',
      password: PASSWORD,
      school: data.otherSchool._id,
      program: data.program._id,
    })

    expect(res.status).toBe(400)
  })
})

describe('POST /api/users/login', () => {
  test('logs in with the right password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'anna@test.se', password: PASSWORD })

    expect(res.status).toBe(200)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.user.name).toBe('Anna')
  })

  test('rejects a wrong password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'anna@test.se', password: 'wrong' })

    expect(res.status).toBe(401)
  })
})

describe('GET /api/users/me', () => {
  test('requires login', async () => {
    const res = await request(app).get('/api/users/me')
    expect(res.status).toBe(401)
  })

  test('returns the logged-in user', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', authFor(data.anna))

    expect(res.status).toBe(200)
    expect(res.body.email).toBe('anna@test.se')
    expect(res.body.password).toBeUndefined()
  })
})
