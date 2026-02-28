import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import LiveMap from '../components/LiveMap'
import '../App.css'

const KAMPALA = { lat: -0.3476, lng: 32.5825 }

const COMPLETED_DELIVERIES = [
    { id: 'EG-091', vehicle: '🏍️', customer: 'Sarah K.', from: 'Nakasero', to: 'Ntinda', earn: 'UGX 4,400', time: '2 hrs ago' },
    { id: 'EG-087', vehicle: '🏍️', customer: 'Moses T.', from: 'Owino Market', to: 'Bukoto', earn: 'UGX 3,200', time: 'Yesterday' },
    { id: 'EG-080', vehicle: '🏍️', customer: 'Grace N.', from: 'Garden City', to: 'Kisaasi', earn: 'UGX 5,800', time: 'Yesterday' },
]

export default function RiderDashboard() {
    const [online, setOnline] = useState(true)
    const [hasRequest, setHasRequest] = useState(true)
    const [requestAccepted, setRequestAccepted] = useState(false)

    // Rider starts near Kampala center, slightly offset
    const [riderPos, setRiderPos] = useState([KAMPALA.lat + 0.002, KAMPALA.lng + 0.003])
    const customerPos = [KAMPALA.lat - 0.01, KAMPALA.lng + 0.015]

    // Animate rider marker toward customer when request accepted
    useEffect(() => {
        if (!requestAccepted) return
        const interval = setInterval(() => {
            setRiderPos(prev => {
                const dlat = (customerPos[0] - prev[0]) * 0.04
                const dlng = (customerPos[1] - prev[1]) * 0.04
                if (Math.abs(dlat) < 0.00005 && Math.abs(dlng) < 0.00005) {
                    clearInterval(interval)
                    return prev
                }
                return [prev[0] + dlat, prev[1] + dlng]
            })
        }, 300)
        return () => clearInterval(interval)
    }, [requestAccepted])

    return (
        <div>
            <Navbar />
            <div className="dashboard">
                <Sidebar role="rider" userName="Patrick O." userRole="Boda Rider" />
                <main className="main-content">
                    {/* Header */}
                    <div className="page-header">
                        <div>
                            <h1>Rider Dashboard 🏍️</h1>
                            <p>Welcome back, Patrick. You're in {online ? 'active' : 'offline'} mode.</p>
                        </div>
                        <div className="map-overlay-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-full)', padding: '8px 20px' }}>
                            {online
                                ? <><span className="pulse-dot" style={{ display: 'inline-block', marginRight: 8 }} /> Online</>
                                : <><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-red)', marginRight: 8 }} />Offline</>
                            }
                        </div>
                    </div>

                    {/* Online toggle */}
                    <div className="rider-online-toggle">
                        <div>
                            <h3>{online ? '🟢 You are Online' : '🔴 You are Offline'}</h3>
                            <p>{online ? 'You can receive delivery requests right now.' : 'Toggle on to start accepting deliveries.'}</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={online} onChange={e => setOnline(e.target.checked)} />
                            <span className="toggle-slider" />
                        </label>
                    </div>

                    {/* Stats */}
                    <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon icon-green">📦</div>
                            </div>
                            <h2>7</h2>
                            <p>Today's Deliveries</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon icon-amber">💰</div>
                            </div>
                            <h2>UGX 42K</h2>
                            <p>Today's Earnings</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon icon-purple">⭐</div>
                            </div>
                            <h2>4.87</h2>
                            <p>Rating</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon icon-green">🏆</div>
                            </div>
                            <h2>348</h2>
                            <p>Total Trips</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24 }}>
                        {/* Left panel */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Incoming Request */}
                            {hasRequest && !requestAccepted && (
                                <div className="incoming-request">
                                    <h3>
                                        <span className="pulse-dot" style={{ display: 'inline-block' }} />
                                        New Delivery Request
                                    </h3>
                                    <div className="request-route">
                                        <div className="from-to">
                                            <div className="location-row">
                                                <span className="dot-from">●</span>
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Nakasero Market</p>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Pickup point</p>
                                                </div>
                                            </div>
                                            <div style={{ width: 2, height: 20, background: 'var(--bg-glass-border)', marginLeft: 7 }} />
                                            <div className="location-row">
                                                <span className="dot-to">●</span>
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ntinda Village</p>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Drop-off</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="request-details">
                                        <div className="request-detail-item">
                                            <div className="rd-value">4.2 km</div>
                                            <div className="rd-label">Distance</div>
                                        </div>
                                        <div className="request-detail-item">
                                            <div className="rd-value">UGX 5.5K</div>
                                            <div className="rd-label">Earnings</div>
                                        </div>
                                        <div className="request-detail-item">
                                            <div className="rd-value">~18 min</div>
                                            <div className="rd-label">Estimate</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                        <span style={{
                                            background: 'rgba(245,158,11,0.12)', color: 'var(--accent)',
                                            border: '1px solid rgba(245,158,11,0.25)', borderRadius: '99px',
                                            padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600
                                        }}>📦 Small Parcel</span>
                                        <span style={{
                                            background: 'rgba(0,229,160,0.1)', color: 'var(--primary)',
                                            border: '1px solid rgba(0,229,160,0.2)', borderRadius: '99px',
                                            padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600
                                        }}>Sarah K. ⭐ 4.9</span>
                                    </div>
                                    <div className="request-actions">
                                        <button className="btn-accept" onClick={() => { setRequestAccepted(true); setHasRequest(false); }}>
                                            ✓ Accept
                                        </button>
                                        <button className="btn-decline" onClick={() => setHasRequest(false)}>
                                            ✕ Decline
                                        </button>
                                    </div>
                                </div>
                            )}

                            {requestAccepted && (
                                <div className="rider-info-card" style={{ borderColor: 'rgba(0,229,160,0.3)', background: 'rgba(0,229,160,0.05)' }}>
                                    <h3>Active Delivery</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                        <span style={{ fontSize: '1.5rem' }}>📦</span>
                                        <div>
                                            <p style={{ fontWeight: 700 }}>Nakasero → Ntinda</p>
                                            <p style={{ color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600 }}>Head to pickup point</p>
                                        </div>
                                    </div>
                                    <div className="rider-actions">
                                        <button className="icon-btn">📞 Call Customer</button>
                                        <button className="icon-btn">💬 Message</button>
                                    </div>
                                </div>
                            )}

                            {!hasRequest && !requestAccepted && (
                                <div className="rider-info-card" style={{ textAlign: 'center', padding: 32 }}>
                                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}>🔍</span>
                                    <p style={{ fontWeight: 600, marginBottom: 4 }}>Looking for requests...</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Stay online to receive delivery requests near you.</p>
                                </div>
                            )}

                            {/* Today's completed */}
                            <div>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 14 }}>Today's Deliveries</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {COMPLETED_DELIVERIES.map(d => (
                                        <div key={d.id} className="order-item" style={{ padding: '14px 16px' }}>
                                            <div className="order-vehicle-icon" style={{ width: 38, height: 38, fontSize: '1.1rem' }}>{d.vehicle}</div>
                                            <div className="order-info">
                                                <h4 style={{ fontSize: '0.85rem' }}>{d.from} → {d.to}</h4>
                                                <p style={{ fontSize: '0.75rem' }}>{d.customer}</p>
                                            </div>
                                            <div className="order-meta">
                                                <div className="price" style={{ fontSize: '0.88rem' }}>{d.earn}</div>
                                                <div className="time">{d.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Live Map */}
                        <div className="map-panel" style={{ height: 'auto', minHeight: 520 }}>
                            <div className="map-panel-header">
                                <div className="map-overlay-card">
                                    <span className="pulse-dot" />
                                    Your Location · Kampala
                                </div>
                                {requestAccepted && (
                                    <div className="map-overlay-card" style={{ borderColor: 'rgba(0,229,160,0.3)' }}>
                                        🏁 Navigating to pickup
                                    </div>
                                )}
                            </div>
                            <LiveMap
                                center={riderPos}
                                zoom={14}
                                riderPosition={riderPos}
                                customerPosition={requestAccepted ? customerPos : undefined}
                                showRoute={requestAccepted}
                                height="520px"
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
