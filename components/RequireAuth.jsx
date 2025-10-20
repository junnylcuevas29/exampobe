import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function RequireAuth({ children, adminOnly = false }) {
  const { user } = useAuth()

  
  if (!user) {
    return <Navigate to="/login" replace />
  }

  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
