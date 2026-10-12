import client from './client'

/**
 * GET /questions
 * Frågor, nyast först (bäst träff först vid sökning).
 * params = valfria filter som kombineras (AND): { school, course, status, search }
 * school och course är id:n, status är 'unanswered' eller 'answered'
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
 * data = { title, description, course }, course = id från getCourses()
 * skolan sätts av servern utifrån kursen
 */
export const createQuestion = async (data) => {
  const response = await client.post('/questions', data)
  return response.data
}
