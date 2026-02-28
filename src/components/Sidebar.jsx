import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../App.css'

const customerLinks = [
    { icon: '🏠', label: 'Home', path: '/customer' },
    { icon: '📦', label: 'Book Delivery', path: '/book' },
    { icon: '🗺️', label: 'Track Order', path: '/track/eg-001' },
    { icon: '📋', label: 'My Orders', path: '/customer#orders' },
    { icon: '💳', label: 'Payments', path: '/customer#payments' },
    { icon: '⚙️', label: 'Settings', path: '/customer#settings' },
]

const riderLinks = [
    { icon: '🏠', label: 'Dashboard', path: '/rider' },
    { icon: '📍', label: 'Live Map', path: '/rider#map' },
    { icon: '📋', label: 'My Deliveries', path: '/rider#deliveries' },
    { icon: '💰', label: 'Earnings', path: '/rider#earnings' },
    { icon: '⭐', label: 'Ratings', path: '/rider#ratings' },
    { icon: '⚙️', label: 'Settings', path: '/rider#settings' },
]

export default function Sidebar({ role = 'customer', userName = 'John D.', userRole = 'Customer' }) {
    const location = useLocation()
    const links = role === 'rider' ? riderLinks : customerLinks

    return (
        <aside className="sidebar">
            <div style={{ padding: '0 12px 20px' }}>
                <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
                    <div className="nav-logo-icon" style={{ width: 36, height: 36, fontSize: '1rem' }}>⚡</div>
                    <span className="nav-logo-text" style={{ fontSize: '1rem' }}>
                        Erands <span>Guy</span>
                    </span>
                </Link>
            </div>

            <p className="sidebar-section-title">Navigation</p>
            <nav className="sidebar-nav">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        <span className="link-icon">{link.icon}</span>
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div style={{ flex: 1 }} />

            <div style={{ padding: '0 0 12px' }}>
                <div className="sidebar-profile">
                    <div className="sidebar-avatar">
                        {userName.charAt(0)}
                    </div>
                    <div className="sidebar-user-info">
                        <p>{userName}</p>
                        <p>{userRole}</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
