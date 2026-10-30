const mongoose = require('mongoose')

/**
 * Middleware factory: only lets the resource's author or a moderator through.
 * loadResource(id) must resolve to a document with an `author` field, or
 * null/undefined if it doesn't exist. Must run after requireAuth.
 * Attaches the loaded resource to req.resource so the route handler
 * doesn't have to fetch it again.
 */
const requireOwnerOrModerator = (loadResource) => async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Not found' })
    }

    const resource = await loadResource(id)
    if (!resource) {
      return res.status(404).json({ message: 'Not found' })
    }

    const isAuthor = resource.author.toString() === req.user._id.toString()
    const isModerator = req.user.role === 'moderator'

    if (!isAuthor && !isModerator) {
      return res.status(403).json({ message: 'Not allowed to delete this' })
    }

    req.resource = resource
    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not check permissions' })
  }
}

module.exports = requireOwnerOrModerator
