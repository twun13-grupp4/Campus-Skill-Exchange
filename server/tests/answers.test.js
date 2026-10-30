/**
 * Posting answers and the notifications they create
 * (/api/questions/:id/answers and /api/notifications).
 */
const request = require('supertest')
const app = require('../app')
const { seed, authFor, createQuestion } = require('./helpers')

let data
let question

beforeEach(async () => {
  data = await seed()
  question = await createQuestion(data.anna, data.course)
})

/** Posts an answer to the question as the given user. */
const postAnswer = (user) =>
  request(app)
    .post(`/api/questions/${question._id}/answers`)
    .set('Authorization', authFor(user))
    .send({ description: 'It runs after render.' })

/** Gets the notifications of the given user. */
const getNotifications = (user) =>
  request(app).get('/api/notifications').set('Authorization', authFor(user))

describe('POST /api/questions/:id/answers', () => {
  test('requires login', async () => {
    const res = await request(app)
      .post(`/api/questions/${question._id}/answers`)
      .send({ description: 'Hello' })

    expect(res.status).toBe(401)
  })

  test('adds the answer to the question', async () => {
    const res = await postAnswer(data.erik)
    expect(res.status).toBe(201)

    const list = await request(app).get(
      `/api/questions/${question._id}/answers`,
    )
    expect(list.body).toHaveLength(1)
    expect(list.body[0].description).toBe('It runs after render.')
  })
})

describe('notifications', () => {
  test("an answer notifies the question's author, and only them", async () => {
    await postAnswer(data.erik)

    const anna = await getNotifications(data.anna)
    expect(anna.status).toBe(200)
    expect(anna.body).toHaveLength(1)
    expect(anna.body[0].question.title).toBe(question.title)
    expect(anna.body[0].read).toBe(false)

    const erik = await getNotifications(data.erik)
    expect(erik.body).toHaveLength(0)
  })

  test('answering your own question gives no notification', async () => {
    await postAnswer(data.anna)

    const res = await getNotifications(data.anna)
    expect(res.body).toHaveLength(0)
  })

  test('only the recipient can mark a notification as read', async () => {
    await postAnswer(data.erik)
    const [notification] = (await getNotifications(data.anna)).body
    const url = `/api/notifications/${notification._id}/read`

    const other = await request(app)
      .patch(url)
      .set('Authorization', authFor(data.erik))
    expect(other.status).toBe(404)

    const own = await request(app)
      .patch(url)
      .set('Authorization', authFor(data.anna))
    expect(own.status).toBe(200)
    expect(own.body.read).toBe(true)
  })
})
