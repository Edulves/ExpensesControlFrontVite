import { Navigate, Outlet } from 'react-router-dom'
import { getCookie } from '../utils/cookies'
import { isTokenValid } from '../services/auth'

export default function ProtectedRoute() {
  if (!isTokenValid()) {
    // Havia um token, mas expirou: avisa o usuário na tela de login.
    const hadToken = Boolean(getCookie('authToken'))
    return <Navigate to="/login" replace state={hadToken ? { sessionExpired: true } : undefined} />
  }

  return <Outlet />
}
