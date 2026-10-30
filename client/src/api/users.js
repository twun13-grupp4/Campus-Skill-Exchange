import client from './client'
import { clearToken, setToken } from './token'

/**
 * POST /users/register
 * Skapar konto, sparar token (= inloggad direkt) och returnerar användaren.
 * data = { name, email, password, school, program } där school/program är id:n
 */
export const register = async (data) => {
  const response = await client.post('/users/register', data)
  setToken(response.data.token)
  return response.data.user
}

/**
 * POST /users/login
 * Loggar in, sparar token och returnerar användaren.
 */
export const login = async (email, password) => {
  const response = await client.post('/users/login', { email, password })
  setToken(response.data.token)
  return response.data.user
}

/**
 * Loggar ut genom att slänga token (servern sparar inget om inloggningen).
 */
export const logout = () => clearToken()

/**
 * Returns the logged-in user's profile.
 * The shared API client automatically sends the saved token.
 */
export const getCurrentUser = async () => {
  const response = await client.get('/users/me')
  return response.data
}

/**
 * PATCH /users/me
 * Updates name/school/program and returns the updated user.
 */
export const updateCurrentUser = async (data) => {
  const response = await client.patch('/users/me', data)
  return response.data
}
