import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../App.css'

const navCustomer = [
    { icon: '🏠', label: 'Overview', path: '/customer' },
    { icon: '📦', label: 'Book delivery', path: '/book' },
    { icon: '🗺️', label: 'Track order', path: '/track/eg-001' },
    { icon: '📋', label: 'My orders', path: '#' },
    { icon: '💳', label: 'Payments', path: '#' },
]

const navRider = [
    { icon: '🏠', label: 'Dashboard', path: '/rider' },
    { icon: '📍', label: 'Live map', path: '#' },
    { icon: '📋', label: 'Deliveries', path: '#' },
    { icon: '💰', label: 'Earnings', path: '#' },
    { icon: '⭐', label: 'Ratings', path: '#' },
]

export default function Sidebar({ role = 'customer' }) {
    const { currentUser, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const links = role === 'rider' ? navRider : navCustomer

    const displayName = currentUser?.displayName ||
        (currentUser?.email ? currentUser.email.split('@')[0] : 'User')
    const avatar = displayName.charAt(0).toUpperCase()

    async function handleLogout() {
        await logout()
        navigate('/login')
    }

    return (
        <aside className="app-sidebar">
            <div className="sidebar-header">
                <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
                    <div className="nav-logo-mark" style={{ width: 30, height: 30, fontSize: '0.85rem' }}>E</div>
                    <span className="nav-logo-text" style={{ fontSize: '1rem' }}>Erands<em>Guy</em></span>
                </Link>
            </div>

            <p className="sidebar-section-label">Navigate</p>
            <nav className="sidebar-nav">
                {links.map(link => (
                    <Link
                        key={link.label}
                        to={link.path}
                        className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        <span className="sl-icon">{link.icon}</span>
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div style={{ flex: 1 }} />

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">{avatar}</div>
                    <div className="sidebar-user-text">
                        <p>{displayName}</p>
                        <p style={{ textTransform: 'capitalize' }}>{role}</p>
                    </div>
                </div>
                <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                    onClick={handleLogout}
                >
                    Sign out
                </button>
            </div>
        </aside>
    )
}
