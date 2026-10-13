const mongoose = require('mongoose')
const School = require('../models/School')
const Program = require('../models/Program')
const Course = require('../models/Course')

/**
 * Shape sent to the client for a school.
 */
const toPublicSchool = (school) => ({
  _id: school._id,
  name: school.name,
})

/**
 * Shape sent to the client for a program. Expects `schools` to be populated.
 * A program is shared: the same program can be offered at several schools.
 */
const toPublicProgram = (program) => ({
  _id: program._id,
  name: program.name,
  schools: program.schools.map(toPublicSchool),
})

/**
 * Shape sent to the client for a course. Expects `school` to be populated.
 */
const toPublicCourse = (course) => ({
  _id: course._id,
  name: course.name,
  school: toPublicSchool(course.school),
})

/**
 * All schools, sorted by name.
 */
const listSchools = async () => {
  const schools = await School.find().sort({ name: 1 }).lean()
  return schools.map(toPublicSchool)
}

/**
 * All programs, optionally only the ones offered at one school, sorted by name.
 * An invalid school id gives an empty list instead of an error.
 */
const listPrograms = async ({ school } = {}) => {
  const filter = {}
  if (school) {
    if (!mongoose.isValidObjectId(school)) return []
    // matches programs whose schools list contains this school
    filter.schools = school
  }

  const programs = await Program.find(filter)
    .populate('schools', 'name')
    .sort({ name: 1 })
    .lean()
  return programs.map(toPublicProgram)
}

/**
 * All courses, optionally only the ones at one school and/or in one program,
 * sorted by name. An invalid id gives an empty list instead of an error.
 */
const listCourses = async ({ school, program } = {}) => {
  const filter = {}
  if (school) {
    if (!mongoose.isValidObjectId(school)) return []
    filter.school = school
  }
  if (program) {
    if (!mongoose.isValidObjectId(program)) return []
    // matches courses whose programs list contains this program
    filter.programs = program
  }

  const courses = await Course.find(filter)
    .populate('school', 'name')
    .sort({ name: 1 })
    .lean()
  return courses.map(toPublicCourse)
}

/**
 * True if the program exists and is offered at the school.
 */
const isValidSchoolProgram = async (schoolId, programId) => {
  if (
    !mongoose.isValidObjectId(schoolId) ||
    !mongoose.isValidObjectId(programId)
  ) {
    return false
  }
  const match = await Program.exists({ _id: programId, schools: schoolId })
  return Boolean(match)
}

module.exports = {
  listSchools,
  listPrograms,
  listCourses,
  isValidSchoolProgram,
}
