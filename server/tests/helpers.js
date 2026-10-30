/**
 * Shared test data and helpers.
 * seed() creates a minimal dataset: two schools, one program, two courses,
 * two students (Anna, Erik) and a moderator (Moa).
 */
const jwt = require('jsonwebtoken')
const School = require('../models/School')
const Program = require('../models/Program')
const Course = require('../models/Course')
const User = require('../models/User')
const Question = require('../models/Question')
const Answer = require('../models/Answer')

const PASSWORD = 'password123'

/** Creates the base dataset and returns the created documents. */
const seed = async () => {
  const school = await School.create({ name: 'Test University' })
  const otherSchool = await School.create({ name: 'Other University' })
  const program = await Program.create({
    name: 'Computer Science',
    schools: [school._id],
  })
  const course = await Course.create({
    name: 'Web Development',
    school: school._id,
    programs: [program._id],
  })
  const otherCourse = await Course.create({
    name: 'Calculus',
    school: school._id,
    programs: [program._id],
  })

  const base = { password: PASSWORD, school: school._id, program: program._id }
  const anna = await User.create({
    ...base,
    name: 'Anna',
    email: 'anna@test.se',
  })
  const erik = await User.create({
    ...base,
    name: 'Erik',
    email: 'erik@test.se',
  })
  const moa = await User.create({
    ...base,
    name: 'Moa',
    email: 'moa@test.se',
    role: 'moderator',
  })

  return { school, otherSchool, program, course, otherCourse, anna, erik, moa }
}

/** Authorization header value for a user, same format as the client sends. */
const authFor = (user) =>
  `Bearer ${jwt.sign({ id: user._id }, process.env.JWT_SECRET)}`

/** Creates a question directly in the database. */
const createQuestion = (author, course, overrides = {}) =>
  Question.create({
    title: 'How does useEffect work?',
    description: 'When does it run?',
    course: course._id,
    school: course.school,
    author: author._id,
    ...overrides,
  })

/** Creates an answer directly in the database. */
const createAnswer = (author, question) =>
  Answer.create({
    question: question._id,
    description: 'It runs after render.',
    author: author._id,
  })

module.exports = { PASSWORD, seed, authFor, createQuestion, createAnswer }
