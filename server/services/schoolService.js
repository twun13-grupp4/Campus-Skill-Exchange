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
 * Shape sent to the client for a program or course. Expects `school` to be populated.
 */
const toPublicSchoolItem = (item) => ({
  _id: item._id,
  name: item.name,
  school: { _id: item.school._id, name: item.school.name },
})

/**
 * Filter for programs/courses, optionally limited to one school.
 * Returns null for an invalid school id, so the caller can answer with an empty list.
 */
const schoolFilter = (school) => {
  if (!school) return {}
  if (!mongoose.isValidObjectId(school)) return null
  return { school }
}

/**
 * All schools, sorted by name.
 */
const listSchools = async () => {
  const schools = await School.find().sort({ name: 1 }).lean()
  return schools.map(toPublicSchool)
}

/**
 * All programs, optionally only the ones at one school, sorted by name.
 */
const listPrograms = async ({ school } = {}) => {
  const filter = schoolFilter(school)
  if (!filter) return []

  const programs = await Program.find(filter)
    .populate('school', 'name')
    .sort({ name: 1 })
    .lean()
  return programs.map(toPublicSchoolItem)
}

/**
 * All courses, optionally only the ones at one school and/or in one program,
 * sorted by name.
 */
const listCourses = async ({ school, program } = {}) => {
  const filter = schoolFilter(school)
  if (!filter) return []

  if (program) {
    if (!mongoose.isValidObjectId(program)) return []
    // matches courses whose programs list contains this program
    filter.programs = program
  }

  const courses = await Course.find(filter)
    .populate('school', 'name')
    .sort({ name: 1 })
    .lean()
  return courses.map(toPublicSchoolItem)
}

/**
 * True if the program exists and belongs to the school.
 */
const isValidSchoolProgram = async (schoolId, programId) => {
  if (
    !mongoose.isValidObjectId(schoolId) ||
    !mongoose.isValidObjectId(programId)
  ) {
    return false
  }
  const match = await Program.exists({ _id: programId, school: schoolId })
  return Boolean(match)
}

module.exports = {
  listSchools,
  listPrograms,
  listCourses,
  isValidSchoolProgram,
}
