import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, logout } from './api/users'
import { getToken, SESSION_CLEARED_EVENT } from './api/token'
import { getErrorMessage } from './api/client'

const AuthContext = createContext(null)

/**
 * Shares the logged-in user throughout the app.
 * Restores their profile using the saved token when the app opens.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  // Clear the displayed user when logout or a rejected token ends the session.
  useEffect(() => {
    function handleSessionCleared() {
      setUser(null)
      setAuthError('')
    }

    window.addEventListener(SESSION_CLEARED_EVENT, handleSessionCleared)

    return () => {
      window.removeEventListener(SESSION_CLEARED_EVENT, handleSessionCleared)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function restoreSession() {
      try {
        const currentUser = getToken() ? await getCurrentUser() : null

        if (!ignore) {
          setUser(currentUser)
        }
      } catch (error) {
        if (!ignore) {
          // A rejected token means the user needs to log in again.
          // Other errors may indicate a temporary connection problem.
          if (error.response?.status !== 401) {
            setAuthError(getErrorMessage(error))
          }
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    restoreSession()

    // Ignore a pending response if this provider is removed.
    return () => {
      ignore = true
    }
  }, [])

  /** Store the user returned by a successful login or signup. */
  function startSession(currentUser) {
    setUser(currentUser)
    setAuthError('')
  }

  /** Remove the saved token and clear the shared user state. */
  function endSession() {
    logout()
    setUser(null)
    setAuthError('')
  }

  /** Replace the shared user after a profile update (no new session/token). */
  function updateUser(updatedUser) {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authError,
        startSession,
        endSession,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/** Access authentication state from a component inside AuthProvider. */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
