import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CustomerDashboard from './pages/CustomerDashboard'
import RiderDashboard from './pages/RiderDashboard'
import BookDelivery from './pages/BookDelivery'
import TrackDelivery from './pages/TrackDelivery'
import './index.css'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/customer" element={<CustomerDashboard />} />
                <Route path="/rider" element={<RiderDashboard />} />
                <Route path="/book" element={<BookDelivery />} />
                <Route path="/track/:id" element={<TrackDelivery />} />
            </Routes>
        </BrowserRouter>
    )
}
