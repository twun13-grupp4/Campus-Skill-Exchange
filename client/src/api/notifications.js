import client from './client'

/**
 * GET /notifications (requires login)
 * Returns the logged-in user's notifications, newest first.
 */
export const getNotifications = async () => {
  const response = await client.get('/notifications')
  return response.data
}

/**
 * PATCH /notifications/:id/read (requires login)
 * Marks one notification as read and returns it.
 */
export const markNotificationRead = async (id) => {
  const response = await client.patch(`/notifications/${id}/read`)
  return response.data
}
