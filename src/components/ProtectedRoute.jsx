import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ── Generic protected route ──────────────────────────────────
export function RequireAuth({ children }) {
    const { currentUser } = useAuth()
    return currentUser ? children : <Navigate to="/login" replace />
}

// ── Only admins ───────────────────────────────────────────────
export function RequireAdmin({ children }) {
    const { currentUser, isAdmin } = useAuth()
    if (!currentUser) return <Navigate to="/login" replace />
    if (!isAdmin) return <Navigate to="/" replace />
    return children
}

// ── Only drivers ──────────────────────────────────────────────
export function RequireDriver({ children }) {
    const { currentUser, isDriver } = useAuth()
    if (!currentUser) return <Navigate to="/login" replace />
    if (!isDriver) return <Navigate to="/" replace />
    return children
}

// ── Redirect if already logged in ────────────────────────────
export function RedirectIfLoggedIn({ children }) {
    const { currentUser, role } = useAuth()
    if (!currentUser) return children
    if (role === 'admin') return <Navigate to="/admin" replace />
    if (role === 'driver') return <Navigate to="/rider" replace />
    return <Navigate to="/customer" replace />
}
