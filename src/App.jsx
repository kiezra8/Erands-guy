import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import {
    RequireAuth,
    RequireAdmin,
    RequireDriver,
    RedirectIfLoggedIn,
} from './components/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import RiderDashboard from './pages/RiderDashboard'
import BookDelivery from './pages/BookDelivery'
import TrackDelivery from './pages/TrackDelivery'
import BottomNav from './components/BottomNav'

import './index.css'
import './App.css'

// Hide bottom nav on dashboards that have their own sidebar
function AppLayout() {
    const location = useLocation()
    const hiddenPaths = ['/rider', '/admin', '/login']
    const showBottomNav = !hiddenPaths.some(p => location.pathname.startsWith(p))

    return (
        <>
            <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth — redirect away if already logged in */}
                <Route
                    path="/login"
                    element={
                        <RedirectIfLoggedIn>
                            <LoginPage />
                        </RedirectIfLoggedIn>
                    }
                />

                {/* ── ADMIN ONLY ── israelezrakisakye@gmail.com */}
                <Route
                    path="/admin"
                    element={
                        <RequireAdmin>
                            <AdminDashboard />
                        </RequireAdmin>
                    }
                />

                {/* ── CUSTOMER ── any logged-in user who isn't admin/driver */}
                <Route
                    path="/customer"
                    element={
                        <RequireAuth>
                            <CustomerDashboard />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/book"
                    element={<BookDelivery />}
                />
                <Route
                    path="/track/:id"
                    element={<TrackDelivery />}
                />

                {/* ── DRIVER ONLY ── must have role=driver in Firestore */}
                <Route
                    path="/rider"
                    element={
                        <RequireDriver>
                            <RiderDashboard />
                        </RequireDriver>
                    }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {showBottomNav && <BottomNav />}
        </>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppLayout />
            </BrowserRouter>
        </AuthProvider>
    )
}

