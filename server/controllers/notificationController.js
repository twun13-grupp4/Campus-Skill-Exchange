const notificationService = require('../services/notificationService')

/**
 * GET /api/notifications (requires login)
 * Returns the logged-in user's notifications, newest first.
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.listNotifications(req.user)
    res.json(notifications)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not fetch notifications' })
  }
}

/**
 * PATCH /api/notifications/:id/read (requires login)
 * Marks a notification as read.
 */
const markNotificationRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user,
    )

    //null = finns inte eller är någon annans
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    res.json(notification)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not update notification' })
  }
}

module.exports = { getNotifications, markNotificationRead }
