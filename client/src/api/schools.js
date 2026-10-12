import client from './client'

/**
 * GET /schools
 * Alla skolor, sorterade på namn.
 */
export const getSchools = async () => {
  const response = await client.get('/schools')
  return response.data
}

/**
 * GET /programs?school=<id>
 * Alla program, eller bara de på en skola om schoolId skickas.
 */
export const getPrograms = async (schoolId) => {
  const response = await client.get('/programs', {
    params: { school: schoolId },
  })
  return response.data
}

/**
 * GET /courses?school=<id>
 * Alla kurser, eller bara de på en skola om schoolId skickas.
 */
export const getCourses = async (schoolId) => {
  const response = await client.get('/courses', {
    params: { school: schoolId },
  })
  return response.data
}
