import React, { useState } from 'react'
import LiveMap from '../components/LiveMap'
import { useLocationSharing } from '../hooks/useLocationSharing'
import '../App.css'

const KAMPALA = [-0.3476, 32.5825]

const DONE = [
    { id: 'EG-091', icon: '🏍️', route: 'Nakasero → Ntinda', earn: 'UGX 4,400', time: '2 hrs ago' },
    { id: 'EG-087', icon: '🏍️', route: 'Owino → Bukoto', earn: 'UGX 3,200', time: 'Yesterday' },
    { id: 'EG-080', icon: '🏍️', route: 'Garden City → Kisaasi', earn: 'UGX 5,800', time: 'Yesterday' },
]

export default function RiderDashboard() {
    const [online, setOnline] = useState(true)
    const [hasReq, setHasReq] = useState(true)
    const [accepted, setAccepted] = useState(false)
    // The order ID the rider is currently delivering — enables GPS sharing
    const [activeOrderId, setActiveOrderId] = useState(null)

    // Real GPS: rider broadcasts riderLocation, sees customerLocation
    const {
        myPos: riderPos,
        partnerPos: customerPos,
        permissionState,
    } = useLocationSharing(activeOrderId, 'riderLocation', 'customerLocation')

    // Map center: real rider GPS → fallback to Kampala
    const mapCenter = riderPos || KAMPALA

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Thin left sidebar */}
            <aside className="rider-side">
                {/* Header */}
                <div className="rider-side-header">
                    <div className="sidebar-avatar">P</div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Patrick O.</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>🏍️ Boda Rider · UGT 248B</div>
                    </div>
                </div>

                {/* Online toggle */}
                <div className="availability-bar">
                    <div>
                        <h3>{online ? '🟢 Online' : '🔴 Offline'}</h3>
                        <p>{online ? 'Accepting requests' : 'Go online to earn'}</p>
                    </div>
                    <label className="toggle">
                        <input type="checkbox" checked={online} onChange={e => setOnline(e.target.checked)} />
                        <span className="toggle-track" />
                        <span className="toggle-thumb" />
                    </label>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
                    background: 'var(--border)', margin: '0'
                }}>
                    {[
                        { val: '7', label: 'Trips today' },
                        { val: 'UGX 42K', label: 'Earnings' },
                        { val: '4.87 ★', label: 'Rating' },
                        { val: '348', label: 'All-time trips' },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: 'var(--gray-900)', padding: '14px 16px'
                        }}>
                            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{s.val}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Incoming request */}
                {online && hasReq && !accepted && (
                    <div className="request-card">
                        <div className="request-header">
                            <div className="live-dot-ring"><div className="live-dot" /></div>
                            <span>New request</span>
                        </div>
                        <div className="request-body">
                            <div className="req-route">
                                <div className="req-loc">
                                    <div className="req-loc-dot" style={{ background: 'var(--brand)' }} />
                                    <div className="req-loc-text">
                                        <h4>Nakasero Market</h4>
                                        <p>Pickup point</p>
                                    </div>
                                </div>
                                <div className="req-connector" style={{ marginLeft: 4 }} />
                                <div className="req-loc">
                                    <div className="req-loc-dot" style={{ background: 'var(--red)' }} />
                                    <div className="req-loc-text">
                                        <h4>Ntinda Village</h4>
                                        <p>Dropoff</p>
                                    </div>
                                </div>
                            </div>

                            <div className="req-meta">
                                <div className="req-meta-cell">
                                    <div className="req-meta-val">4.2 km</div>
                                    <div className="req-meta-label">Distance</div>
                                </div>
                                <div className="req-meta-cell">
                                    <div className="req-meta-val">UGX 5.5K</div>
                                    <div className="req-meta-label">Earnings</div>
                                </div>
                                <div className="req-meta-cell">
                                    <div className="req-meta-val">~18 min</div>
                                    <div className="req-meta-label">ETA</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                                <span className="chip chip-gray">📦 Small parcel</span>
                                <span className="chip chip-green">Sarah K. ★ 4.9</span>
                            </div>

                            <div className="req-actions">
                                <button className="req-btn-decline" id="decline-btn" onClick={() => setHasReq(false)}>
                                    Decline
                                </button>
                                <button className="req-btn-accept" id="accept-btn"
                                    onClick={() => {
                                        setAccepted(true)
                                        setHasReq(false)
                                        // In production, set to the real order ID from Firestore
                                        setActiveOrderId('EG-DEMO')
                                    }}>
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Accepted state */}
                {accepted && (
                    <div style={{ margin: 12 }}>
                        <div style={{
                            background: 'var(--brand-dim)', border: '1px solid rgba(6,193,103,0.3)',
                            borderRadius: 'var(--r-xl)', padding: 16
                        }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                                <span style={{ fontSize: '1.4rem' }}>📦</span>
                                <div>
                                    <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>Nakasero → Ntinda</p>
                                    <p style={{ color: 'var(--brand)', fontSize: '0.78rem', fontWeight: 600, marginTop: 2 }}>
                                        Navigating to pickup
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                <button className="rider-btn"><span className="rb-icon">📞</span>Call</button>
                                <button className="rider-btn"><span className="rb-icon">💬</span>Message</button>
                            </div>
                        </div>
                    </div>
                )}

                {!hasReq && !accepted && online && (
                    <div style={{ margin: 12, textAlign: 'center', padding: '28px 16px', background: 'var(--gray-900)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Finding requests...</p>
                        <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', marginTop: 6 }}>Stay online to receive orders nearby.</p>
                    </div>
                )}

                {/* Recent deliveries */}
                <div style={{ padding: '0 12px 12px', flex: 1 }}>
                    <p className="sidebar-section-label" style={{ paddingLeft: 4, marginTop: 8 }}>Today's deliveries</p>
                    <div className="delivery-list" style={{ padding: 0 }}>
                        {DONE.map(d => (
                            <div className="order-row" key={d.id} style={{ padding: '12px 14px' }}>
                                <div className="order-icon" style={{ width: 38, height: 38, fontSize: '1.1rem' }}>{d.icon}</div>
                                <div className="order-body">
                                    <h4 style={{ fontSize: '0.82rem' }}>{d.route}</h4>
                                    <p>{d.time}</p>
                                </div>
                                <div className="order-right">
                                    <div className="order-price" style={{ fontSize: '0.82rem' }}>{d.earn}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Map fills rest */}
            <div className="rider-main">
                {/* Map top bar */}
                <div className="app-topbar" style={{ left: 0 }}>
                    <div className="topbar-title">🗺️ Live Map · Kampala</div>
                    <div className="topbar-right">
                        <span className="chip chip-green">
                            <div className="live-dot" />
                            {online ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>

                <LiveMap
                    center={mapCenter}
                    zoom={14}
                    riderPosition={riderPos || undefined}
                    customerPosition={accepted && customerPos ? customerPos : undefined}
                    showRoute={!!(accepted && riderPos && customerPos)}
                    height="100%"
                />

                {/* GPS status badge */}
                <div style={{ position: 'absolute', top: 64, right: 16, zIndex: 500 }}>
                    <div style={{
                        background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)',
                        border: `1px solid ${permissionState === 'granted' ? 'rgba(6,193,103,0.4)' : 'var(--border)'}`,
                        borderRadius: 'var(--r-full)', padding: '8px 14px',
                        display: 'flex', alignItems: 'center', gap: 8,
                        fontSize: '0.78rem', fontWeight: 700,
                        color: permissionState === 'granted' ? 'var(--brand)' : 'var(--text-3)',
                    }}>
                        <div className={permissionState === 'granted' ? 'live-dot' : undefined}
                            style={permissionState !== 'granted' ? { width: 8, height: 8, borderRadius: '50%', background: 'var(--text-3)' } : undefined} />
                        {permissionState === 'granted' ? 'GPS live' : 'GPS off'}
                    </div>
                </div>

                {/* Bottom overlay when active */}
                {accepted && (
                    <div className="track-map-overlay">
                        <div className="tmo-icon">🧭</div>
                        <div className="tmo-body">
                            <h4>Navigating to Nakasero Market</h4>
                            <p>Then drop at Ntinda Village · 4.2 km total</p>
                        </div>
                        <div className="tmo-eta">
                            <div className="num">5</div>
                            <div className="unit">min</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
