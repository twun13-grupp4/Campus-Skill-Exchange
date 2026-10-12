import axios from 'axios'
import { clearToken, getToken } from './token'

/**
 * Gemensamma Axios-instans som alla API-anrop går via
 * baseURL gör att vi bara skrivet t.ex '/questions istället för hela adressen
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
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
    if (error.response?.status === 401) {
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
