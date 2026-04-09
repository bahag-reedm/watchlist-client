import { useState } from 'react'
import { MagnifyingGlassIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline'
import api from '../api/api'

export default function SearchMovies() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [addedIds, setAddedIds] = useState(new Set())
  const [addingId, setAddingId] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setError('')
    setLoading(true)
    try {
      const res = await api.get(`/movies/search?q=${encodeURIComponent(query.trim())}`)
      setResults(res.data.results)
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const addToWatchlist = async (tmdbId) => {
    setAddingId(tmdbId)
    try {
      await api.post('/movies/add-to-watchlist', { tmdbId })
      setAddedIds((prev) => new Set([...prev, tmdbId]))
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add'
      if (msg.toLowerCase().includes('already')) {
        setAddedIds((prev) => new Set([...prev, tmdbId]))
      } else {
        setError(msg)
      }
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Search Movies</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie..."
            className="block w-full rounded-md bg-white/5 px-4 py-2.5 pl-10 text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
          />
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/50 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((movie) => (
            <div
              key={movie.tmdb_id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-white/10 flex flex-col"
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.name}
                  className="w-full h-72 object-cover"
                />
              ) : (
                <div className="w-full h-72 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500">No poster</span>
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-white font-semibold text-lg truncate">{movie.name}</h3>
                {movie.release_date && (
                  <p className="text-gray-400 text-sm mt-1">{movie.release_date}</p>
                )}
                {movie.overall_rating && (
                  <p className="text-yellow-400 text-sm mt-1">⭐ {movie.overall_rating}/10</p>
                )}
                {movie.overview && (
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">{movie.overview}</p>
                )}
                <div className="mt-auto pt-4">
                  {addedIds.has(movie.tmdb_id) ? (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 rounded-md bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400"
                    >
                      <CheckIcon className="h-4 w-4" /> Added
                    </button>
                  ) : (
                    <button
                      onClick={() => addToWatchlist(movie.tmdb_id)}
                      disabled={addingId === movie.tmdb_id}
                      className="w-full flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                    >
                      <PlusIcon className="h-4 w-4" />
                      {addingId === movie.tmdb_id ? 'Adding...' : 'Add to Watchlist'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <p className="text-center text-gray-400 py-10">No results found. Try a different search.</p>
      )}
    </div>
  )
}
