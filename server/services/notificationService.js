const mongoose = require('mongoose')
const Notification = require('../models/Notification')
require('../models/Question') //laddar question modellen för populate

/**
 * Picks the fields the client is allowed to see for a notification.
 * question must be populated with title first.
 */
const toPublicNotification = (n) => ({
  _id: n._id,
  type: n.type,
  question: n.question
    ? { _id: n.question._id, title: n.question.title }
    : null,
  answer: n.answer,
  read: n.read,
  createdAt: n.createdAt,
})

/**
 * Returns the logged-in user's notifications, newest first (max 20).
 */
const listNotifications = async (user) => {
  const notifications = await Notification.find({ recipient: user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('question', 'title') //frågans titel så navbaren kan visa den
    .lean()
  return notifications.map(toPublicNotification)
}

/**
 * Marks one notification as read.
 * Returns null if it does not exist or belongs to another user (-> 404).
 */
const markAsRead = async (id, user) => {
  if (!mongoose.isValidObjectId(id)) return null

  //recipient i filtret = man kan bara ändra sina egna notiser
  const notification = await Notification.findOne({
    _id: id,
    recipient: user._id,
  })
  if (!notification) return null

  notification.read = true
  await notification.save()
  await notification.populate('question', 'title')
  return toPublicNotification(notification)
}

module.exports = { listNotifications, markAsRead }
