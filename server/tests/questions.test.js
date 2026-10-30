/**
 * Listing, filtering, searching and creating questions (/api/questions).
 */
const request = require('supertest')
const app = require('../app')
const { seed, authFor, createQuestion } = require('./helpers')

let data

beforeEach(async () => {
  data = await seed()
})

describe('GET /api/questions', () => {
  beforeEach(async () => {
    await createQuestion(data.anna, data.course)
    await createQuestion(data.erik, data.otherCourse, {
      title: 'Separable differential equations',
      description: 'Step by step please',
    })
  })

  test('lists all questions', async () => {
    const res = await request(app).get('/api/questions')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })

  test('filters by course', async () => {
    const res = await request(app).get(
      `/api/questions?course=${data.otherCourse._id}`,
    )

    expect(res.body).toHaveLength(1)
    expect(res.body[0].course.name).toBe('Calculus')
  })

  test('search matches part of a word', async () => {
    const res = await request(app).get('/api/questions?search=use')

    expect(res.body).toHaveLength(1)
    expect(res.body[0].title).toBe('How does useEffect work?')
  })
})

describe('GET /api/questions/:id', () => {
  test('returns 404 for an invalid or unknown id', async () => {
    const invalid = await request(app).get('/api/questions/abc')
    const unknown = await request(app).get(
      `/api/questions/${data.anna._id}`, // giltigt id, men ingen fråga
    )

    expect(invalid.status).toBe(404)
    expect(unknown.status).toBe(404)
  })
})

describe('POST /api/questions', () => {
  const body = () => ({
    title: 'What is a closure?',
    description: 'Explain like I am five',
    course: data.course._id,
  })

  test('requires login', async () => {
    const res = await request(app).post('/api/questions').send(body())
    expect(res.status).toBe(401)
  })

  test('takes the author from the token, not the body', async () => {
    const res = await request(app)
      .post('/api/questions')
      .set('Authorization', authFor(data.anna))
      .send({ ...body(), author: data.erik._id })

    expect(res.status).toBe(201)
    expect(res.body.author.name).toBe('Anna')
    expect(res.body.school.name).toBe('Test University') // kopierad från kursen
  })

  test('rejects an unknown course', async () => {
    const res = await request(app)
      .post('/api/questions')
      .set('Authorization', authFor(data.anna))
      .send({ ...body(), course: data.anna._id })

    expect(res.status).toBe(400)
  })
})
