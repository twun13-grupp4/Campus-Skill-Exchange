const {
  listSchools,
  listPrograms,
  listCourses,
} = require('../services/schoolService')

/**
 * GET /api/schools
 * All schools, used by the signup form and the filter.
 */
const getSchools = async (req, res) => {
  try {
    res.json(await listSchools())
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not fetch schools' })
  }
}

/**
 * GET /api/programs?school=<schoolId>
 * All programs, or only the ones at one school if `school` is given.
 */
const getPrograms = async (req, res) => {
  try {
    res.json(await listPrograms({ school: req.query.school }))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not fetch programs' })
  }
}

/**
 * GET /api/courses?school=<schoolId>&program=<programId>
 * All courses, or only the ones at one school and/or in one program.
 */
const getCourses = async (req, res) => {
  try {
    const { school, program } = req.query
    res.json(await listCourses({ school, program }))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not fetch courses' })
  }
}

module.exports = { getSchools, getPrograms, getCourses }
