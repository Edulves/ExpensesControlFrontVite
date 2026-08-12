import { Navigate, Outlet } from 'react-router-dom'
import { getCookie } from '../utils/cookies'

export default function ProtectedRoute() {
  const token = getCookie('authToken')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}