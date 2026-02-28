import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LiveMap from '../components/LiveMap'
import '../App.css'

const KAMPALA = [-0.3476, 32.5825]
const CUSTOMER_POS = [KAMPALA[0] - 0.012, KAMPALA[1] + 0.018]
const PICKUP_POS = [KAMPALA[0] + 0.015, KAMPALA[1] - 0.008]
const RIDER_START = [KAMPALA[0] + 0.014, KAMPALA[1] - 0.007]

const TL = [
    { label: 'Order placed', desc: 'Confirmed at 09:14 AM', status: 'done' },
    { label: 'Rider assigned', desc: 'Patrick O. accepted', status: 'done' },
    { label: 'Picking up', desc: 'Rider at Nakasero Market', status: 'active' },
    { label: 'On the way', desc: 'Heading to your location', status: 'pending' },
    { label: 'Delivered', desc: 'Package handed over', status: 'pending' },
]

export default function TrackDelivery() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [riderPos, setRiderPos] = useState(RIDER_START)
    const [eta, setEta] = useState(14)

    useEffect(() => {
        const t = setInterval(() => {
            setRiderPos(prev => {
                const dlat = (CUSTOMER_POS[0] - prev[0]) * 0.012
                const dlng = (CUSTOMER_POS[1] - prev[1]) * 0.012
                if (Math.abs(dlat) < 0.00003) { clearInterval(t); return prev }
                return [prev[0] + dlat, prev[1] + dlng]
            })
            setEta(prev => Math.max(1, prev - 0.04))
        }, 200)
        return () => clearInterval(t)
    }, [])

    return (
        <div className="track-shell">
            {/* Full map */}
            <div className="track-map-pane">
                {/* Back button */}
                <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 500 }}>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate('/customer')}
                        id="back-btn"
                    >
                        ← Dashboard
                    </button>
                </div>

                <LiveMap
                    center={riderPos}
                    zoom={15}
                    riderPosition={riderPos}
                    customerPosition={CUSTOMER_POS}
                    pickupPosition={PICKUP_POS}
                    showRoute
                    height="100%"
                />

                {/* Bottom overlay */}
                <div className="track-map-overlay">
                    <div className="tmo-icon">🏍️</div>
                    <div className="tmo-body">
                        <h4>Patrick is on the way</h4>
                        <p>Picking up from Nakasero · dropping at Ntinda</p>
                    </div>
                    <div className="tmo-eta">
                        <div className="num">{Math.max(1, Math.ceil(eta))}</div>
                        <div className="unit">min away</div>
                    </div>
                </div>
            </div>

            {/* Right sidebar */}
            <div className="track-sidebar-pane">
                {/* ETA hero */}
                <div className="eta-hero">
                    <div className="eta-num">{Math.max(1, Math.ceil(eta))}</div>
                    <div className="eta-unit">minutes away</div>
                    <div className="eta-sub">Order #{(id || 'eg-001').toUpperCase()}</div>
                </div>

                {/* Rider info */}
                <div className="rider-card">
                    <p className="sub-heading" style={{ marginBottom: 14 }}>Your rider</p>
                    <div className="rider-row">
                        <div className="rider-av">P</div>
                        <div className="rider-info">
                            <h3>Patrick Olusegun</h3>
                            <p>🏍️ Boda · Plate UGT 248B</p>
                            <div className="rider-stars">★★★★★ <span style={{ color: 'var(--text-3)', fontWeight: 400, marginLeft: 4 }}>4.87</span></div>
                        </div>
                    </div>
                    <div className="rider-btns">
                        <button className="rider-btn" id="call-btn">
                            <span className="rb-icon">📞</span>Call
                        </button>
                        <button className="rider-btn" id="chat-btn">
                            <span className="rb-icon">💬</span>Message
                        </button>
                        <button className="rider-btn" id="sos-btn" style={{ color: 'var(--red)' }}>
                            <span className="rb-icon">🚨</span>SOS
                        </button>
                    </div>
                </div>

                {/* Route */}
                <div className="route-card">
                    <p className="sub-heading" style={{ marginBottom: 14 }}>Route</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <div className="route-line-item">
                            <div className="route-dot-col">
                                <div className="route-dot-sm green" />
                                <div className="route-connector" />
                            </div>
                            <div className="route-text" style={{ paddingLeft: 12, paddingBottom: 14 }}>
                                <h4>Nakasero Market</h4>
                                <p>Pickup point</p>
                            </div>
                        </div>
                        <div className="route-line-item">
                            <div className="route-dot-col">
                                <div className="route-dot-sm red" />
                            </div>
                            <div className="route-text" style={{ paddingLeft: 12 }}>
                                <h4>Ntinda Village</h4>
                                <p>Your location</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>
                            4.2 km · Boda Boda
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand)' }}>
                            UGX 5,500
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="timeline">
                    <p className="sub-heading" style={{ marginBottom: 16 }}>Delivery status</p>
                    {TL.map((item, i) => (
                        <div className={`tl-item ${item.status}`} key={i}>
                            <div className="tl-col">
                                <div className={`tl-dot ${item.status}`}>
                                    {item.status === 'done' ? '✓' : item.status === 'active' ? '●' : ''}
                                </div>
                            </div>
                            <div className="tl-body">
                                <h4>{item.label}</h4>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment row */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>Payment method</span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>💛 MTN MoMo</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>Fare</span>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand)' }}>UGX 5,500</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
