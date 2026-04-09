import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline'
import api from '../api/api'

export default function Dashboard() {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchWatchlist = async () => {
    try {
      const res = await api.get('/movies/watchlist')
      setWatchlist(res.data.watchlist)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load watchlist')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const toggleWatched = async (id, currentStatus) => {
    try {
      await api.patch(`/movies/${id}`, { watched: !currentStatus })
      setWatchlist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, watched: !currentStatus } : item))
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update')
    }
  }

  const removeFromWatchlist = async (id) => {
    try {
      await api.delete(`/movies/${id}`)
      setWatchlist((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        <Link
          to="/search"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          + Add Movies
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/50 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Your watchlist is empty.</p>
          <Link to="/search" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">
            Search for movies to add
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlist.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-white/10 flex flex-col"
            >
              <Link to={`/movie/${item.Movie.id}`} state={{ movie: item.Movie, watchlistId: item.id }}>
                <img
                  src={item.Movie.poster_url}
                  alt={item.Movie.name}
                  className="w-full h-72 object-cover hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-white font-semibold text-lg truncate">{item.Movie.name}</h3>
                {item.Movie.genre && (
                  <p className="text-gray-400 text-sm mt-1">{item.Movie.genre}</p>
                )}
                {item.Movie.overall_rating && (
                  <p className="text-yellow-400 text-sm mt-1">⭐ {item.Movie.overall_rating}/10</p>
                )}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <button
                    onClick={() => toggleWatched(item.id, item.watched)}
                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                      item.watched
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {item.watched ? (
                      <>
                        <EyeIcon className="h-4 w-4" /> Watched
                      </>
                    ) : (
                      <>
                        <EyeSlashIcon className="h-4 w-4" /> Unwatched
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => removeFromWatchlist(item.id)}
                    className="rounded-md p-1.5 text-red-400 hover:bg-red-500/20"
                    title="Remove from watchlist"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
