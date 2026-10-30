/**
 * Who may delete questions and answers: the author or a moderator.
 */
const request = require('supertest')
const app = require('../app')
const Question = require('../models/Question')
const Answer = require('../models/Answer')
const { seed, authFor, createQuestion, createAnswer } = require('./helpers')

let data
let question
let answer

beforeEach(async () => {
  data = await seed()
  question = await createQuestion(data.anna, data.course)
  answer = await createAnswer(data.erik, question)
})

/** Sends a DELETE as the given user (or without login). */
const del = (url, user) => {
  const req = request(app).delete(url)
  return user ? req.set('Authorization', authFor(user)) : req
}

describe('DELETE /api/questions/:id', () => {
  test('requires login', async () => {
    const res = await del(`/api/questions/${question._id}`)
    expect(res.status).toBe(401)
  })

  test("another student can't delete it", async () => {
    const res = await del(`/api/questions/${question._id}`, data.erik)

    expect(res.status).toBe(403)
    expect(await Question.exists({ _id: question._id })).toBeTruthy()
  })

  test('the author can delete it, and its answers go with it', async () => {
    const res = await del(`/api/questions/${question._id}`, data.anna)

    expect(res.status).toBe(204)
    expect(await Question.exists({ _id: question._id })).toBeNull()
    expect(await Answer.countDocuments({ question: question._id })).toBe(0)
  })

  test("a moderator can delete anyone's question", async () => {
    const res = await del(`/api/questions/${question._id}`, data.moa)
    expect(res.status).toBe(204)
  })
})

describe('DELETE /api/answers/:id', () => {
  test("the question's author can't delete someone else's answer", async () => {
    const res = await del(`/api/answers/${answer._id}`, data.anna)
    expect(res.status).toBe(403)
  })

  test('the author can delete it', async () => {
    const res = await del(`/api/answers/${answer._id}`, data.erik)

    expect(res.status).toBe(204)
    expect(await Answer.exists({ _id: answer._id })).toBeNull()
  })

  test("a moderator can delete anyone's answer", async () => {
    const res = await del(`/api/answers/${answer._id}`, data.moa)
    expect(res.status).toBe(204)
  })
})
