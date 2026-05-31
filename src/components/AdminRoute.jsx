import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ADMIN_EMAIL = 'chaurasiyavikas1234@gmail.com'

export default function AdminRoute({ children }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" />
  if (user.email !== ADMIN_EMAIL) return <Navigate to="/" />

  return children
}