import axios from 'axios'
import { clearToken, getToken } from './token'

/**
 * Gemensamma Axios-instans som alla API-anrop går via
 * baseURL gör att vi bara skrivet t.ex '/questions istället för hela adressen
 * relativ '/api' funkar både i produktion (samma server) och i dev (Vite-proxy)
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

//körs före VARJE anrop, samt lägger på token om man är inloggad
client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}` //samma format som requireAuth
  }
  return config
})

// körs efter VARJE svar, 401 = saknad token
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = getToken()
    const requestToken = error.config?.headers?.Authorization
    const requestUrl = error.config?.url

    // Failed login credentials should not clear an existing session.
    const isAccountRequest =
      requestUrl === '/users/login' || requestUrl === '/users/register'

    // Only clear the session if the rejected request used its current token.
    // An older request must not log out a newly authenticated user.
    if (
      error.response?.status === 401 &&
      !isAccountRequest &&
      token &&
      requestToken === `Bearer ${token}`
    ) {
      clearToken()
    }

    return Promise.reject(error) // skicka felet vidare så sidan kan visa medelandet
  },
)

/**
 * plockar ut felmeddelandet från servern t.ex "wrong email or password"
 * används av sidorna för att visa fel i en Alert
 */
export const getErrorMessage = (error) =>
  error.response?.data?.message ?? 'Something went wrong, try again'

export default client
