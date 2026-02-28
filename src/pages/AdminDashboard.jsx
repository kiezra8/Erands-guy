import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    collection, getDocs, doc, setDoc, updateDoc,
    deleteDoc, serverTimestamp, query, where, orderBy,
} from 'firebase/firestore'
import {
    createUserWithEmailAndPassword,
} from 'firebase/auth'
import { db, secondaryAuth, ADMIN_EMAIL } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import '../App.css'
import './Auth.css'

// ── Sub pages ───────────────────────────────────────────────
const PAGES = ['drivers', 'customers', 'orders', 'settings']

export default function AdminDashboard() {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const [page, setPage] = useState('drivers')
    const [drivers, setDrivers] = useState([])
    const [customers, setCustomers] = useState([])
    const [orders, setOrders] = useState([])
    const [stats, setStats] = useState({ drivers: 0, customers: 0, orders: 0, active: 0 })
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // new driver form
    const [dName, setDName] = useState('')
    const [dEmail, setDEmail] = useState('')
    const [dPhone, setDPhone] = useState('')
    const [dPass, setDPass] = useState('')
    const [dVehicle, setDVehicle] = useState('boda')
    const [dPlate, setDPlate] = useState('')

    // ── load data ──
    useEffect(() => { loadAll() }, [])

    async function loadAll() {
        try {
            const usersSnap = await getDocs(collection(db, 'users'))
            const driversArr = []
            const customersArr = []
            usersSnap.forEach(d => {
                const data = { id: d.id, ...d.data() }
                if (data.role === 'driver') driversArr.push(data)
                if (data.role === 'customer') customersArr.push(data)
            })
            setDrivers(driversArr)
            setCustomers(customersArr)

            // orders (may not exist yet)
            try {
                const ordersSnap = await getDocs(collection(db, 'orders'))
                const ordersArr = []
                ordersSnap.forEach(d => ordersArr.push({ id: d.id, ...d.data() }))
                setOrders(ordersArr)
                const active = ordersArr.filter(o => o.status === 'in-transit').length
                setStats({ drivers: driversArr.length, customers: customersArr.length, orders: ordersArr.length, active })
            } catch {
                setStats({ drivers: driversArr.length, customers: customersArr.length, orders: 0, active: 0 })
            }
        } catch (e) {
            setError('Failed to load data: ' + e.message)
        }
    }

    // ── Add driver ──────────────────────────────────────────────
    async function handleAddDriver(e) {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            // Create Firebase Auth user
            // ⚠️ Use secondaryAuth so the admin's own session is NOT affected
            const cred = await createUserWithEmailAndPassword(secondaryAuth, dEmail, dPass)
            // Immediately sign out the secondary session
            await secondaryAuth.signOut()

            // Write user doc with role=driver
            await setDoc(doc(db, 'users', cred.user.uid), {
                name: dName,
                email: dEmail,
                phone: dPhone,
                role: 'driver',
                vehicle: dVehicle,
                plate: dPlate.toUpperCase(),
                status: 'active',
                rating: 5.0,
                trips: 0,
                earnings: 0,
                createdAt: serverTimestamp(),
                createdBy: ADMIN_EMAIL,
            })

            setSuccess(`✅ Driver account created for ${dName}`)
            setShowModal(false)
            resetForm()
            loadAll()
        } catch (e) {
            setError(friendlyError(e.code) || e.message)
        } finally { setLoading(false) }
    }

    function resetForm() {
        setDName(''); setDEmail(''); setDPhone('')
        setDPass(''); setDVehicle('boda'); setDPlate('')
    }

    // ── Toggle driver status ──────────────────────────────────
    async function toggleDriverStatus(driver) {
        const newStatus = driver.status === 'active' ? 'suspended' : 'active'
        await updateDoc(doc(db, 'users', driver.id), { status: newStatus })
        setDrivers(prev => prev.map(d => d.id === driver.id ? { ...d, status: newStatus } : d))
    }

    // ── Delete driver ─────────────────────────────────────────
    async function deleteDriver(driver) {
        if (!confirm(`Remove ${driver.name} as a driver? This cannot be undone.`)) return
        await deleteDoc(doc(db, 'users', driver.id))
        setDrivers(prev => prev.filter(d => d.id !== driver.id))
        setSuccess(`Removed driver: ${driver.name}`)
    }

    async function handleLogout() {
        await logout()
        navigate('/login')
    }

    return (
        <div className="admin-shell">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
                        <div className="nav-logo-mark">E</div>
                        <span className="nav-logo-text">Erands<em>Guy</em></span>
                    </Link>
                </div>

                <p className="sidebar-section-label">Admin panel</p>
                <nav className="sidebar-nav">
                    {[
                        { key: 'drivers', icon: '🏍️', label: 'Drivers' },
                        { key: 'customers', icon: '👤', label: 'Customers' },
                        { key: 'orders', icon: '📦', label: 'Orders' },
                        { key: 'settings', icon: '⚙️', label: 'Settings' },
                    ].map(p => (
                        <button
                            key={p.key}
                            className={`sidebar-link ${page === p.key ? 'active' : ''}`}
                            onClick={() => setPage(p.key)}
                        >
                            <span className="sl-icon">{p.icon}</span>
                            {p.label}
                        </button>
                    ))}
                </nav>

                <div style={{ flex: 1 }} />
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar" style={{ background: 'linear-gradient(135deg,#06C167,#048a48)' }}>I</div>
                        <div className="sidebar-user-text">
                            <p>Israel E.</p>
                            <p style={{ color: 'var(--brand)' }}>Admin</p>
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

            {/* Main */}
            <main className="admin-main">
                <div className="admin-topbar">
                    <h1 style={{ fontSize: '1rem', fontWeight: 700 }}>
                        {page === 'drivers' && '🏍️ Driver Management'}
                        {page === 'customers' && '👤 Customer Accounts'}
                        {page === 'orders' && '📦 All Orders'}
                        {page === 'settings' && '⚙️ Settings'}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="chip chip-green">
                            <div className="live-dot" />
                            Admin
                        </span>
                    </div>
                </div>

                <div className="admin-page">
                    {/* Flash messages */}
                    {success && (
                        <div style={{ background: 'rgba(6,193,103,0.1)', border: '1px solid rgba(6,193,103,0.25)', color: 'var(--brand)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 20, fontSize: '0.88rem', fontWeight: 600 }}
                            onClick={() => setSuccess('')}>
                            {success} <span style={{ float: 'right', cursor: 'pointer', opacity: 0.5 }}>✕</span>
                        </div>
                    )}
                    {error && (
                        <div className="auth-error" style={{ marginBottom: 20 }} onClick={() => setError('')}>
                            {error} <span style={{ float: 'right', cursor: 'pointer', opacity: 0.5 }}>✕</span>
                        </div>
                    )}

                    {/* ─ Stats ─ */}
                    <div className="admin-stats">
                        {[
                            { val: stats.drivers, label: 'Total drivers', sub: 'Registered', color: 'var(--brand)' },
                            { val: stats.customers, label: 'Customers', sub: 'Registered', color: '#A78BFA' },
                            { val: stats.orders, label: 'Total orders', sub: 'All time', color: '#F5A623' },
                            { val: stats.active, label: 'Active deliveries', sub: 'Right now', color: '#06C167' },
                        ].map(s => (
                            <div className="admin-stat" key={s.label}>
                                <div className="admin-stat-val" style={{ color: s.color }}>{s.val}</div>
                                <div className="admin-stat-label">{s.label}</div>
                                <div className="admin-stat-sub">{s.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* ═══ DRIVERS PAGE ═══ */}
                    {page === 'drivers' && (
                        <div>
                            <div className="admin-table-wrap">
                                <div className="admin-table-header">
                                    <div>
                                        <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>Registered Drivers</h2>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: 3 }}>
                                            Only accounts you create here can access the rider dashboard.
                                        </p>
                                    </div>
                                    <button
                                        className="btn btn-brand btn-sm"
                                        id="add-driver-btn"
                                        onClick={() => { setShowModal(true); setError('') }}
                                    >
                                        + Add driver
                                    </button>
                                </div>

                                {drivers.length === 0 ? (
                                    <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🏍️</div>
                                        <p style={{ fontWeight: 700, marginBottom: 4 }}>No drivers yet</p>
                                        <p style={{ fontSize: '0.85rem' }}>Click "Add driver" to create the first rider account.</p>
                                    </div>
                                ) : (
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Driver</th>
                                                <th>Vehicle</th>
                                                <th>Phone</th>
                                                <th>Trips</th>
                                                <th>Rating</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {drivers.map(d => (
                                                <tr key={d.id}>
                                                    <td>
                                                        <div className="user-cell">
                                                            <div className="user-av-sm">{(d.name || 'D').charAt(0).toUpperCase()}</div>
                                                            <div>
                                                                <div className="user-cell-name">{d.name}</div>
                                                                <div className="user-cell-email">{d.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontSize: '0.88rem' }}>
                                                            {d.vehicle === 'boda' ? '🏍️ Boda Boda' : '🚗 Car'}
                                                            {d.plate && <span style={{ color: 'var(--text-3)', marginLeft: 6, fontSize: '0.78rem' }}>{d.plate}</span>}
                                                        </span>
                                                    </td>
                                                    <td style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>{d.phone || '—'}</td>
                                                    <td style={{ fontWeight: 700 }}>{d.trips || 0}</td>
                                                    <td>
                                                        <span style={{ color: 'var(--amber)', fontWeight: 700 }}>
                                                            ★ {(d.rating || 5.0).toFixed(1)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`chip ${d.status === 'active' ? 'chip-green' : 'chip-red'}`}>
                                                            {d.status === 'active' ? '● Active' : '● Suspended'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: 6 }}>
                                                            <button
                                                                className={`action-btn ${d.status === 'active' ? 'action-btn-gray' : 'action-btn-green'}`}
                                                                onClick={() => toggleDriverStatus(d)}
                                                            >
                                                                {d.status === 'active' ? 'Suspend' : 'Restore'}
                                                            </button>
                                                            <button
                                                                className="action-btn action-btn-red"
                                                                onClick={() => deleteDriver(d)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═══ CUSTOMERS PAGE ═══ */}
                    {page === 'customers' && (
                        <div className="admin-table-wrap">
                            <div className="admin-table-header">
                                <div>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>Customer Accounts</h2>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: 3 }}>Read-only view of registered customers.</p>
                                </div>
                            </div>
                            {customers.length === 0 ? (
                                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>👤</div>
                                    <p style={{ fontWeight: 700, marginBottom: 4 }}>No customers yet</p>
                                    <p style={{ fontSize: '0.85rem' }}>Customers appear here when they sign up.</p>
                                </div>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Joined</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map(c => (
                                            <tr key={c.id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-av-sm" style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)' }}>
                                                            {(c.name || 'C').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="user-cell-name">{c.name || 'Anonymous'}</div>
                                                            <div className="user-cell-email">{c.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>
                                                    {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : '—'}
                                                </td>
                                                <td><span className="chip chip-green">Active</span></td>
                                                <td>
                                                    <button className="action-btn action-btn-red" onClick={async () => {
                                                        if (!confirm(`Suspend ${c.name}?`)) return
                                                        await updateDoc(doc(db, 'users', c.id), { status: 'suspended' })
                                                    }}>
                                                        Suspend
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* ═══ ORDERS PAGE ═══ */}
                    {page === 'orders' && (
                        <div className="admin-table-wrap">
                            <div className="admin-table-header">
                                <div>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>All Orders</h2>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: 3 }}>Every delivery request made on the platform.</p>
                                </div>
                            </div>
                            {orders.length === 0 ? (
                                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📦</div>
                                    <p style={{ fontWeight: 700, marginBottom: 4 }}>No orders yet</p>
                                    <p style={{ fontSize: '0.85rem' }}>Orders will appear here once customers start booking.</p>
                                </div>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Route</th>
                                            <th>Driver</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o.id}>
                                                <td style={{ fontWeight: 700, color: 'var(--brand)', fontFamily: 'monospace' }}>#{o.id.slice(0, 8).toUpperCase()}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{o.customerName || '—'}</td>
                                                <td style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>{o.pickup} → {o.dropoff}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{o.driverName || 'Unassigned'}</td>
                                                <td style={{ fontWeight: 700 }}>{o.price ? `UGX ${o.price.toLocaleString()}` : '—'}</td>
                                                <td>
                                                    <span className={`chip ${o.status === 'delivered' ? 'chip-green' :
                                                        o.status === 'in-transit' ? 'chip-amber' :
                                                            o.status === 'cancelled' ? 'chip-red' : 'chip-gray'
                                                        }`}>
                                                        {o.status || 'pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* ═══ SETTINGS ═══ */}
                    {page === 'settings' && (
                        <div style={{ maxWidth: 540 }}>
                            <div className="admin-table-wrap" style={{ padding: 28 }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 6 }}>Admin Account</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginBottom: 20 }}>
                                    You are signed in as the super-admin of Erands Guy.
                                </p>
                                {[
                                    { label: 'Email', val: currentUser?.email },
                                    { label: 'Role', val: 'Super Admin' },
                                    { label: 'Access', val: 'Full platform control' },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                                        <span style={{ color: 'var(--text-3)' }}>{r.label}</span>
                                        <span style={{ fontWeight: 700, color: r.label === 'Role' ? 'var(--brand)' : 'var(--text-1)' }}>{r.val}</span>
                                    </div>
                                ))}
                                <button
                                    className="btn btn-ghost"
                                    style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}
                                    onClick={handleLogout}
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ═══ ADD DRIVER MODAL ═══ */}
            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <h2 className="modal-title">Add new driver</h2>
                        <p className="modal-sub">
                            This creates a login account for the driver. They'll use the email and password you set here to sign in.
                        </p>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleAddDriver}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="d-name">Full name *</label>
                                    <input className="input" id="d-name" placeholder="Patrick Olusegun"
                                        value={dName} onChange={e => setDName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="d-phone">Phone number</label>
                                    <input className="input" id="d-phone" placeholder="+256 700 000 000"
                                        value={dPhone} onChange={e => setDPhone(e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="d-email">Email address *</label>
                                <input className="input" id="d-email" type="email" placeholder="driver@example.com"
                                    value={dEmail} onChange={e => setDEmail(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="d-pass">Temporary password *</label>
                                <input className="input" id="d-pass" type="password" placeholder="Min. 6 characters"
                                    value={dPass} onChange={e => setDPass(e.target.value)} required minLength={6} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="d-vehicle">Vehicle type *</label>
                                    <select className="input" id="d-vehicle"
                                        value={dVehicle} onChange={e => setDVehicle(e.target.value)}
                                        style={{ appearance: 'none', cursor: 'pointer' }}>
                                        <option value="boda">🏍️ Boda Boda</option>
                                        <option value="car">🚗 Car</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="d-plate">Number plate</label>
                                    <input className="input" id="d-plate" placeholder="UGT 248B"
                                        value={dPlate} onChange={e => setDPlate(e.target.value)} />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost"
                                    style={{ flex: 1, justifyContent: 'center', padding: 14 }}
                                    onClick={() => { setShowModal(false); resetForm(); setError('') }}>
                                    Cancel
                                </button>
                                <button type="submit" id="save-driver-btn"
                                    className="btn btn-brand"
                                    disabled={loading}
                                    style={{ flex: 2, justifyContent: 'center', padding: 14, fontSize: '0.95rem', borderRadius: 'var(--r-md)' }}>
                                    {loading ? 'Creating…' : 'Create driver account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function friendlyError(code) {
    const map = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
    }
    return map[code]
}
