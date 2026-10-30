import client from './client'

/**
 * GET /questions
 * Frågor, nyast först. search matchar alla ord, även delar av ord, i titel och beskrivning.
 * params = valfria filter som kombineras (AND): { school, program, course, status, search }
 * school, program och course är id:n, status är 'unanswered' eller 'answered'
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

/**
 * POST /questions/:id/answers (kräver inloggning, token läggs på automatiskt)
 * Skapar ett svar på frågan och returnerar det sparade svaret.
 */
export const createAnswer = async (questionId, description) => {
  const response = await client.post(`/questions/${questionId}/answers`, {
    description,
  })
  return response.data
}

/**
 * DELETE /questions/:id (kräver inloggning + rättighet)
 * Tar bort frågan och dess svar.
 */
export const deleteQuestion = async (id) => {
  await client.delete(`/questions/${id}`)
}
