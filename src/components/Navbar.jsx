import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'

export default function Navbar() {
    const [solid, setSolid] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fn = () => setSolid(window.scrollY > 10)
        window.addEventListener('scroll', fn)
        return () => window.removeEventListener('scroll', fn)
    }, [])

    return (
        <nav className={`navbar ${solid ? 'solid' : ''}`}>
            <Link to="/" className="nav-logo">
                <div className="nav-logo-mark">E</div>
                <span className="nav-logo-text">Erands<em>Guy</em></span>
            </Link>


            <div className="nav-right">
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/rider')}>
                    Rider Login
                </button>
                <button className="btn btn-brand btn-sm" onClick={() => navigate('/customer')}>
                    Get started
                </button>
            </div>
        </nav>
    )
}
