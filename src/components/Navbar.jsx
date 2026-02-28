import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <Link to="/" className="nav-logo">
                <div className="nav-logo-icon">⚡</div>
                <span className="nav-logo-text">Erands <span>Guy</span></span>
            </Link>

            <ul className="nav-links">
                <li><a href="#how-it-works">How it Works</a></li>
                <li><a href="#vehicles">Vehicles</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
            </ul>

            <div className="nav-actions">
                <button className="btn btn-ghost" onClick={() => navigate('/rider')}>
                    Rider Login
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/customer')}>
                    Get Started
                </button>
            </div>

            <button className="nav-hamburger">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
            </button>
        </nav>
    )
}
