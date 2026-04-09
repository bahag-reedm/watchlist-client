import { Routes, Route, Navigate } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import NavBar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SearchMovies from './pages/SearchMovies'
import MovieDetail from './pages/MovieDetail'

const AppRouter = () => {
    return (
        <AuthProvider>
            <NavBar />
            <div className="min-h-screen bg-gray-900">
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/search" element={<SearchMovies />} />
                        <Route path="/movie/:id" element={<MovieDetail />} />
                    </Route>

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </div>
        </AuthProvider>
    )
}

export default AppRouter