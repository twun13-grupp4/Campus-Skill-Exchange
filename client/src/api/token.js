//nyckeln vi sparar token under i webbläsaren
const TOKEN_KEY = 'token'

/**
 * Hämtar sparad token, eller null om ingen är inloggad
 */
export const getToken = () => localStorage.getItem(TOKEN_KEY)

/**
 * sparar token efter login/register, ligger klar efter refresh
 */
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

/**
 * Tar bort token, tex vid logout eller om den gått ut
 */
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)
