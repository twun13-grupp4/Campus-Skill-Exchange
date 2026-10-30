const express = require('express')
const requireAuth = require('../middleware/requireAuth') //kollar inlogg
const {
  getNotifications,
  markNotificationRead,
} = require('../controllers/notificationController')

const router = express.Router()

router.get('/', requireAuth, getNotifications)
router.patch('/:id/read', requireAuth, markNotificationRead)

module.exports = router
