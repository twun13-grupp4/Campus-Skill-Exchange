//nyckeln vi sparar token under i webbläsaren
const TOKEN_KEY = 'token'

// Notify the current browser tab when its session is cleared.
export const SESSION_CLEARED_EVENT = 'auth:session-cleared'

/**
 * Hämtar sparad token, eller null om ingen är inloggad
 */
export const getToken = () => localStorage.getItem(TOKEN_KEY)

/**
 * sparar token efter login/register, ligger klar efter refresh
 */
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

/**
 * Removes the saved token and notifies the shared authentication state.
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  window.dispatchEvent(new Event(SESSION_CLEARED_EVENT))
}
