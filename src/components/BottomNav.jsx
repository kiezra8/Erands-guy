import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../App.css'

const NAV_ITEMS = [
    {
        id: 'home',
        label: 'Home',
        path: '/',
        icon: (active) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
                    fill={active ? 'var(--brand)' : 'none'}
                    stroke={active ? 'var(--brand)' : 'var(--gray-400)'}
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        id: 'order',
        label: 'Order',
        path: '/book',
        icon: (active) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                    x="3" y="3" width="18" height="18" rx="3"
                    fill={active ? 'var(--brand)' : 'none'}
                    stroke={active ? 'var(--brand)' : 'var(--gray-400)'}
                    strokeWidth="1.8"
                />
                <path
                    d="M8 12H16M12 8V16"
                    stroke={active ? '#000' : 'var(--gray-400)'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
    {
        id: 'track',
        label: 'Tracking',
        path: '/track/eg-001',
        icon: (active) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                    cx="12" cy="12" r="9"
                    stroke={active ? 'var(--brand)' : 'var(--gray-400)'}
                    strokeWidth="1.8"
                />
                <circle
                    cx="12" cy="12" r="3"
                    fill={active ? 'var(--brand)' : 'var(--gray-400)'}
                />
                <path
                    d="M12 3V5M12 19V21M3 12H5M19 12H21"
                    stroke={active ? 'var(--brand)' : 'var(--gray-400)'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
    {
        id: 'account',
        label: 'Me',
        path: '/customer',
        icon: (active) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                    cx="12" cy="8" r="4"
                    fill={active ? 'var(--brand)' : 'none'}
                    stroke={active ? 'var(--brand)' : 'var(--gray-400)'}
                    strokeWidth="1.8"
                />
                <path
                    d="M4 20C4 17 7.6 14.5 12 14.5C16.4 14.5 20 17 20 20"
                    stroke={active ? 'var(--brand)' : 'var(--gray-400)'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
]

export default function BottomNav() {
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = (item) => {
        if (item.path === '/') return location.pathname === '/'
        if (item.id === 'track') return location.pathname.startsWith('/track')
        return location.pathname === item.path || location.pathname.startsWith(item.path)
    }

    return (
        <nav className="bottom-nav" id="bottom-nav">
            {NAV_ITEMS.map(item => {
                const active = isActive(item)
                return (
                    <button
                        key={item.id}
                        className={`bottom-nav-item ${active ? 'active' : ''}`}
                        id={`bnav-${item.id}`}
                        onClick={() => navigate(item.path)}
                        aria-label={item.label}
                    >
                        <div className="bnav-icon-wrap">
                            {item.icon(active)}
                            {active && <div className="bnav-active-dot" />}
                        </div>
                        <span className="bnav-label">{item.label}</span>
                    </button>
                )
            })}
        </nav>
    )
}
