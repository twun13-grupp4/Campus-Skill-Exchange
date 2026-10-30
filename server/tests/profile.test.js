/**
 * Editing your own profile (PATCH /api/users/me).
 */
const request = require('supertest')
const app = require('../app')
const School = require('../models/School')
const Program = require('../models/Program')
const { seed, authFor } = require('./helpers')

let data

beforeEach(async () => {
  data = await seed()
})

/** Sends a profile update as Anna. */
const update = (body) =>
  request(app)
    .patch('/api/users/me')
    .set('Authorization', authFor(data.anna))
    .send(body)

describe('PATCH /api/users/me', () => {
  test('updates name, school and program', async () => {
    const school = await School.create({ name: 'New University' })
    const program = await Program.create({
      name: 'Mathematics',
      schools: [school._id],
    })

    const res = await update({
      name: 'Anna Svensson',
      school: school._id,
      program: program._id,
    })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Anna Svensson')
    expect(res.body.school.name).toBe('New University')
    expect(res.body.program.name).toBe('Mathematics')
  })

  test("can't change role or email", async () => {
    const res = await update({
      name: 'Anna',
      school: data.school._id,
      program: data.program._id,
      role: 'moderator',
      email: 'hacker@test.se',
    })

    expect(res.status).toBe(200)
    expect(res.body.role).toBe('student')
    expect(res.body.email).toBe('anna@test.se')
  })

  test('rejects a program the school does not offer', async () => {
    const res = await update({
      name: 'Anna',
      school: data.otherSchool._id,
      program: data.program._id,
    })

    expect(res.status).toBe(400)
  })
})
