/**
 * True if the logged-in user can delete something authored by authorId -
 * its own author, or a moderator. authorId can be an id string or the
 * {_id, name} shape the API returns for a populated author.
 */
export const canDelete = (user, authorId) => {
  if (!user) return false
  if (user.role === 'moderator') return true

  const id = typeof authorId === 'object' ? authorId?._id : authorId
  return id === user._id
}
