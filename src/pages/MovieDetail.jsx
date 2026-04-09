import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ArrowLeftIcon, StarIcon, ClockIcon, FilmIcon, ChatBubbleLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'

export default function MovieDetail() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const movie = state?.movie
  const watchlistId = state?.watchlistId

  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [rating, setRating] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FilmIcon className="h-16 w-16 text-gray-600 mb-4" />
        <p className="text-gray-400 text-lg">Movie not found.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${movie.id}`)
      setComments(res.data.data)
    } catch (err) {
      console.log(`Error getting comments: ${err}`)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      await api.post('/comments', {
        userId: user.id,
        movieId: movie.id,
        comment: comment.trim(),
        ...(rating && { rating: parseInt(rating, 10) }),
      })
      setSuccess('Comment added successfully!')
      setComment('')
      setRating('')
      fetchComments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return
    try {
      await api.delete(`/comments/${commentId}`)
      setSuccess('Comment deleted successfully!')
      fetchComments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  const renderStars = (count) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(10)].map((_, i) => (
          i < count
            ? <StarSolid key={i} className="h-4 w-4 text-yellow-400" />
            : <StarIcon key={i} className="h-4 w-4 text-gray-600" />
        ))}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back to Watchlist</span>
      </button>

      {/* Hero section */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-800/50 border border-white/5">
        {/* Blurred backdrop */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={movie.poster_url}
            alt=""
            className="w-full h-full object-cover blur-3xl opacity-20 scale-110"
          />
        </div>

        <div className="relative flex flex-col md:flex-row gap-8 p-6 md:p-8">
          {/* Poster */}
          <div className="shrink-0">
            <img
              src={movie.poster_url}
              alt={movie.name}
              className="w-52 md:w-64 rounded-xl shadow-2xl shadow-black/50 mx-auto md:mx-0 ring-1 ring-white/10"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{movie.name}</h1>

            {movie.genre && (
              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genre.split(',').map((g) => (
                  <span
                    key={g.trim()}
                    className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/30"
                  >
                    {g.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 mt-6">
              {movie.overall_rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-500/15 ring-1 ring-yellow-500/30">
                    <span className="text-lg font-bold text-yellow-400">{movie.overall_rating}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Rating</p>
                    <p className="text-sm text-gray-300">out of 10</p>
                  </div>
                </div>
              )}

              {movie.runtime && (
                <div className="flex items-center gap-2 text-gray-400">
                  <ClockIcon className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Runtime</p>
                    <p className="text-sm text-gray-300">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
                  </div>
                </div>
              )}
            </div>

            {movie.overall_rating && (
              <div className="mt-4">
                {renderStars(movie.overall_rating)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-6">
          <ChatBubbleLeftIcon className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">
            Reviews & Comments
            {comments.length > 0 && (
              <span className="ml-2 text-base font-normal text-gray-500">({comments.length})</span>
            )}
          </h2>
        </div>

        {/* Existing comments */}
        {comments.length > 0 ? (
          <div className="space-y-4 mb-8">
            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded-xl bg-gray-800/50 border border-white/5 p-5 transition-colors hover:border-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <UserCircleIcon className="h-9 w-9 text-gray-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {c.User?.username || 'Anonymous'}
                      </p>
                      {c.rating && (
                        <div className="mt-0.5">{renderStars(c.rating)}</div>
                      )}
                    </div>
                  </div>
                  {c.rating && (
                    <span className="shrink-0 rounded-lg bg-yellow-500/15 px-2.5 py-1 text-sm font-bold text-yellow-400 ring-1 ring-yellow-500/30">
                      {c.rating}/10
                    </span>
                  )}
                </div>
                <p className="mt-3 text-gray-300 text-sm leading-relaxed pl-12">{c.comment}</p>
                <div className="mt-3 pl-12">
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="group relative inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 ring-1 ring-red-500/20 transition-all hover:bg-red-500/20 hover:ring-red-500/40 hover:shadow-lg hover:shadow-red-500/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5 transition-transform group-hover:scale-110">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-8 rounded-xl bg-gray-800/30 border border-dashed border-white/10">
            <ChatBubbleLeftIcon className="h-10 w-10 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        )}

        {/* Comment Form */}
        <div className="rounded-xl bg-gray-800/50 border border-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-5">Write a Review</h3>

          {success && (
            <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 p-4 flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="space-y-5">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="block w-full rounded-lg bg-gray-900/50 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
                placeholder="What did you think of this movie?"
              />
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
                Rating <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <div className="flex items-center gap-4">
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="rounded-lg bg-gray-900/50 px-4 py-2.5 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                >
                  <option value="">No rating</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} / 10
                    </option>
                  ))}
                </select>
                {rating && <div>{renderStars(parseInt(rating, 10))}</div>}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
