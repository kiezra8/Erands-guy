import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../App.css'
import './Auth.css'

export default function LoginPage() {
    const { loginWithGoogle, loginWithEmail } = useAuth()
    const navigate = useNavigate()

    const [tab, setTab] = useState('login')   // 'login' | 'register'
    const [email, setEmail] = useState('')
    const [password, setPass] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { registerCustomer } = useAuth()

    async function handleGoogle() {
        setError(''); setLoading(true)
        try {
            const { role } = await loginWithGoogle()
            redirect(role)
        } catch (e) {
            setError(e.message)
        } finally { setLoading(false) }
    }

    async function handleEmail(e) {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            if (tab === 'register') {
                await registerCustomer(email, password, name)
                navigate('/customer')
            } else {
                const { role } = await loginWithEmail(email, password)
                redirect(role)
            }
        } catch (e) {
            setError(friendlyError(e.code))
        } finally { setLoading(false) }
    }

    function redirect(role) {
        if (role === 'admin') navigate('/admin')
        else if (role === 'driver') navigate('/rider')
        else navigate('/customer')
    }

    return (
        <div className="auth-shell">
            {/* Left brand panel */}
            <div className="auth-brand">
                <Link to="/" className="auth-logo">
                    <div className="nav-logo-mark">E</div>
                    <span className="nav-logo-text">Erands<em>Guy</em></span>
                </Link>
                <div className="auth-brand-body">
                    <h1 className="auth-brand-heading">
                        Uganda's fastest<br />delivery platform.
                    </h1>
                    <p className="auth-brand-sub">
                        Real-time GPS tracking, verified boda-boda riders, and instant booking — all in one place.
                    </p>
                    <div className="auth-stats">
                        {[
                            { num: '2,400+', label: 'Active riders' },
                            { num: '98%', label: 'On-time rate' },
                            { num: 'UGX 3K', label: 'Starting fare' },
                        ].map(s => (
                            <div key={s.label} className="auth-stat">
                                <div className="auth-stat-num">{s.num}</div>
                                <div className="auth-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* decorative map dots */}
                <div className="auth-brand-deco" aria-hidden>
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="deco-dot" style={{
                            top: `${Math.random() * 90}%`,
                            left: `${Math.random() * 90}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            opacity: Math.random() * 0.4 + 0.1,
                        }} />
                    ))}
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-panel">
                <div className="auth-form-wrap">
                    {/* Tabs */}
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                            onClick={() => { setTab('login'); setError('') }}
                        >
                            Sign in
                        </button>
                        <button
                            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                            onClick={() => { setTab('register'); setError('') }}
                        >
                            Create account
                        </button>
                    </div>

                    <h2 className="auth-form-title">
                        {tab === 'login' ? 'Welcome back' : 'Join Erands Guy'}
                    </h2>
                    <p className="auth-form-sub">
                        {tab === 'login'
                            ? 'Sign in to book deliveries or access your dashboard.'
                            : 'Create a free account to start sending parcels today.'}
                    </p>

                    {/* Google sign in */}
                    <button
                        className="btn-google"
                        onClick={handleGoogle}
                        disabled={loading}
                        id="google-signin-btn"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
                            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
                            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
                            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    {error && (
                        <div className="auth-error" role="alert">{error}</div>
                    )}

                    <form onSubmit={handleEmail}>
                        {tab === 'register' && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="name-input">Full name</label>
                                <input
                                    className="input" id="name-input" placeholder="Your name"
                                    value={name} onChange={e => setName(e.target.value)} required
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label" htmlFor="email-input">Email address</label>
                            <input
                                className="input" id="email-input" type="email" placeholder="you@example.com"
                                value={email} onChange={e => setEmail(e.target.value)} required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password-input">Password</label>
                            <input
                                className="input" id="password-input" type="password"
                                placeholder={tab === 'register' ? 'At least 6 characters' : 'Your password'}
                                value={password} onChange={e => setPass(e.target.value)} required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-brand"
                            id="submit-btn"
                            disabled={loading}
                            style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', borderRadius: 'var(--r-md)', marginTop: 8 }}
                        >
                            {loading ? 'Please wait…' : (tab === 'login' ? 'Sign in' : 'Create account')}
                        </button>
                    </form>

                    {tab === 'login' && (
                        <p className="auth-hint">
                            Driver accounts are created by the admin. Contact{' '}
                            <a href="mailto:israelezrakisakye@gmail.com" style={{ color: 'var(--brand)' }}>
                                Erands Guy admin
                            </a>{' '}
                            to get access.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

function friendlyError(code) {
    const map = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Try again.',
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
        'auth/network-request-failed': 'Network error. Check your connection.',
    }
    return map[code] || 'Something went wrong. Please try again.'
}
