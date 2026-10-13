const mongoose = require('mongoose')
const Question = require('../models/Question')
const Course = require('../models/Course')
require('../models/School') // registers the models so populate() can find them
require('../models/User')

// the referenced documents to fill in, and which of their fields to include
const POPULATE = [
  { path: 'school', select: 'name' },
  { path: 'course', select: 'name' },
  { path: 'author', select: 'name' },
]

const STATUSES = ['unanswered', 'answered']

/**
 * { _id, name } for a populated reference, or null if it no longer exists.
 */
const toRef = (doc) => (doc ? { _id: doc._id, name: doc.name } : null)

/**
 * Shape sent to the client for a question. Expects school, course and author to be populated.
 */
const toPublicQuestion = (question) => ({
  _id: question._id,
  title: question.title,
  description: question.description,
  status: question.status,
  acceptedAnswer: question.acceptedAnswer,
  school: toRef(question.school),
  course: toRef(question.course),
  author: toRef(question.author),
  createdAt: question.createdAt,
  updatedAt: question.updatedAt,
})

/**
 * Escapes characters that have a special meaning in a regular expression,
 * so the user's search text is matched literally.
 */
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Questions matching ALL given filters, newest first.
 * `search` matches every word anywhere in the title or description, also inside words.
 * `program` matches questions in any course that is part of that program.
 * An invalid id or status gives an empty list instead of an error.
 */
const listQuestions = async ({
  school,
  program,
  course,
  status,
  search,
} = {}) => {
  const filter = {}

  if (school) {
    if (!mongoose.isValidObjectId(school)) return []
    filter.school = school
  }
  if (course) {
    if (!mongoose.isValidObjectId(course)) return []
    filter.course = course
  }
  if (status) {
    if (!STATUSES.includes(status)) return []
    filter.status = status
  }
  if (program) {
    if (!mongoose.isValidObjectId(program)) return []
    // questions have no program field, so filter on the program's courses
    const courseIds = await Course.distinct('_id', { programs: program })
    if (course) {
      // both given: the chosen course has to be part of the program
      if (!courseIds.some((id) => id.equals(course))) return []
    } else {
      filter.course = { $in: courseIds }
    }
  }

  if (typeof search === 'string' && search.trim()) {
    // every word must appear in the title or description, in any case,
    // and also inside longer words ("use" finds "useEffect")
    filter.$and = search
      .trim()
      .split(/\s+/)
      .map((word) => {
        const pattern = new RegExp(escapeRegex(word), 'i')
        return { $or: [{ title: pattern }, { description: pattern }] }
      })
  }

  const questions = await Question.find(filter)
    .sort({ createdAt: -1 })
    .populate(POPULATE)
    .lean()
  return questions.map(toPublicQuestion)
}

/**
 * One question, or null if the id is invalid or no question has it.
 */
const getQuestion = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null

  const question = await Question.findById(id).populate(POPULATE).lean()
  return question ? toPublicQuestion(question) : null
}

/**
 * Creates a question by the logged-in user. The school is copied from the course.
 * Returns null if the course does not exist.
 */
const createQuestion = async ({ title, description, course }, user) => {
  if (!mongoose.isValidObjectId(course)) return null

  const found = await Course.findById(course).select('school')
  if (!found) return null

  const question = await Question.create({
    title,
    description,
    course: found._id,
    school: found.school,
    author: user._id,
  })
  await question.populate(POPULATE)
  return toPublicQuestion(question)
}

module.exports = { listQuestions, getQuestion, createQuestion }
