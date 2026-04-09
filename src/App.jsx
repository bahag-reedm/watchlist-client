import {StrictMode, useEffect, useState} from 'react'
import './App.css'
import axios from "axios";

function App() {
  const [movies, setMovies] = useState([])

  const searchMovies = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/movies/search?q=inception`)
      console.log(res)
      setMovies(res.data.results)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    searchMovies()
  }, [])

  return (<>
    {movies && movies.map(movie => {
        return (
            <div key={movie.id}>
              {movie.name}
        </div>
      )

        }
    )}
    </>)
}

export default App
