import client from './client'

/**
 * DELETE /answers/:id (requires login + permission)
 * Removes the answer.
 */
export const deleteAnswer = async (id) => {
  await client.delete(`/answers/${id}`)
}
