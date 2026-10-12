import client from './client'

/**
 * GET /questions
 * Alla frågor, nyast först. params = valfria filter, t.ex. { school, courseTag, status }
 */
export const getQuestions = async (params = {}) => {
  const response = await client.get('/questions', { params }) // params blir ?school=...&status=...
  return response.data
}

/**
 * GET /questions/:id
 * En enskild fråga.
 */
export const getQuestion = async (id) => {
  const response = await client.get(`/questions/${id}`)
  return response.data
}

/**
 * GET /questions/:id/answers
 * Svaren till en fråga, flest upvotes först.
 */
export const getAnswers = async (questionId) => {
  const response = await client.get(`/questions/${questionId}/answers`)
  return response.data
}

/**
 * POST /questions (kräver inloggning, token läggs på automatiskt)
 * data = { title, description, courseTag, school }
 */
export const createQuestion = async (data) => {
  const response = await client.post('/questions', data)
  return response.data
}
