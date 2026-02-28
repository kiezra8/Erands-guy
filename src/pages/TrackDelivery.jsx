import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LiveMap from '../components/LiveMap'
import '../App.css'

const KAMPALA = { lat: -0.3476, lng: 32.5825 }
const CUSTOMER_POS = [KAMPALA.lat - 0.012, KAMPALA.lng + 0.018]
const PICKUP_POS = [KAMPALA.lat + 0.015, KAMPALA.lng - 0.008]

// Initial rider position – near pickup
const RIDER_START = [KAMPALA.lat + 0.014, KAMPALA.lng - 0.007]

const TIMELINE_STEPS = [
    { label: 'Order Placed', desc: 'Your delivery request was confirmed', status: 'done' },
    { label: 'Rider Assigned', desc: 'Patrick O. accepted your order', status: 'done' },
    { label: 'Picking Up', desc: 'Rider is at the pickup location', status: 'active' },
    { label: 'On the Way', desc: 'Heading to your location', status: 'pending' },
    { label: 'Delivered', desc: 'Package handed over', status: 'pending' },
]

export default function TrackDelivery() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [riderPos, setRiderPos] = useState(RIDER_START)
    const [eta, setEta] = useState(14)

    // Animate rider smoothly toward customer
    useEffect(() => {
        const interval = setInterval(() => {
            setRiderPos(prev => {
                const dlat = (CUSTOMER_POS[0] - prev[0]) * 0.015
                const dlng = (CUSTOMER_POS[1] - prev[1]) * 0.015
                if (Math.abs(dlat) < 0.00005) { clearInterval(interval); return prev }
                return [prev[0] + dlat, prev[1] + dlng]
            })
            setEta(prev => (prev > 1 ? prev - 0.05 : prev))
        }, 200)
        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            <Navbar />
            <div style={{ paddingTop: 72 }}>
                <div className="track-layout">
                    {/* Sidebar */}
                    <div className="track-sidebar">
                        {/* Order ID */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h1 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Tracking Order</h1>
                                <span className="badge badge-green" style={{ marginTop: 6 }}>
                                    <span className="pulse-dot" />
                                    Live Tracking
                                </span>
                            </div>
                            <div style={{
                                background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                                borderRadius: 'var(--radius-md)', padding: '8px 14px',
                                fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)'
                            }}>
                                #{id?.toUpperCase() || 'EG-001'}
                            </div>
                        </div>

                        {/* ETA Card */}
                        <div style={{
                            background: 'linear-gradient(135deg,rgba(0,229,160,0.1),rgba(0,184,128,0.05))',
                            border: '1px solid rgba(0,229,160,0.25)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                                Estimated Arrival
                            </p>
                            <p style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
                                {Math.max(1, Math.ceil(eta))}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>minutes away</p>
                        </div>

                        {/* Rider info */}
                        <div className="rider-info-card">
                            <h3>Your Rider</h3>
                            <div className="rider-profile">
                                <div className="rider-avatar">P</div>
                                <div className="rider-details">
                                    <h4>Patrick Olusegun</h4>
                                    <p>🏍️ Boda Boda · UGT 248B</p>
                                    <div className="rider-rating">
                                        {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                                        <span style={{ color: 'var(--text-secondary)', fontWeight: 400, marginLeft: 4 }}>4.87</span>
                                    </div>
                                </div>
                            </div>
                            <div className="rider-actions">
                                <button className="icon-btn" id="call-rider-btn">
                                    📞 Call
                                </button>
                                <button className="icon-btn" id="message-rider-btn">
                                    💬 Message
                                </button>
                                <button className="icon-btn" id="sos-btn" style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--accent-red)' }}>
                                    🚨 SOS
                                </button>
                            </div>
                        </div>

                        {/* Route summary */}
                        <div className="rider-info-card">
                            <h3>Route</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <span style={{ color: 'var(--accent)', fontSize: '1.1rem', marginTop: 2 }}>📦</span>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Nakasero Market</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Pickup point</p>
                                    </div>
                                </div>
                                <div style={{ width: 2, height: 20, background: 'linear-gradient(to bottom,var(--accent),var(--primary))', marginLeft: 9 }} />
                                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <span style={{ color: 'var(--primary)', fontSize: '1.1rem', marginTop: 2 }}>📍</span>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ntinda Village</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Your location</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--bg-glass-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Distance</span>
                                <span style={{ fontWeight: 700 }}>4.2 km</span>
                            </div>
                            <div style={{ paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Fare</span>
                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>UGX 5,500</span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="rider-info-card">
                            <h3>Delivery Progress</h3>
                            <div className="timeline">
                                {TIMELINE_STEPS.map((step, i) => (
                                    <div className={`timeline-item ${step.status === 'done' ? 'completed' : ''}`} key={i}>
                                        {i < TIMELINE_STEPS.length - 1 && <div className="timeline-line" />}
                                        <div className={`timeline-dot ${step.status}`}>
                                            {step.status === 'done' ? '✓' : step.status === 'active' ? '●' : '○'}
                                        </div>
                                        <div className="timeline-content">
                                            <h4 style={{ color: step.status === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                                {step.label}
                                            </h4>
                                            <p>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className="btn btn-ghost"
                            style={{ justifyContent: 'center' }}
                            onClick={() => navigate('/customer')}
                        >
                            ← Back to Dashboard
                        </button>
                    </div>

                    {/* Full-screen map */}
                    <div className="track-map-area">
                        <LiveMap
                            center={riderPos}
                            zoom={15}
                            riderPosition={riderPos}
                            customerPosition={CUSTOMER_POS}
                            pickupPosition={PICKUP_POS}
                            showRoute={true}
                            height="100%"
                        />
                        {/* Floating overlay */}
                        <div style={{
                            position: 'absolute', bottom: 24, left: 24, right: 24,
                            background: 'rgba(13,17,32,0.92)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid var(--bg-glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '16px 20px',
                            display: 'flex', alignItems: 'center', gap: 16,
                            zIndex: 500,
                        }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                                background: 'rgba(0,229,160,0.12)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
                            }}>🏍️</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Patrick is on his way</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Moving through Kampala traffic</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1 }}>
                                    {Math.max(1, Math.ceil(eta))} min
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ETA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
