import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useLocationSharing } from '../hooks/useLocationSharing'
import LiveMap from '../components/LiveMap'
import '../App.css'

const KAMPALA = [-0.3476, 32.5825]

// ── Permission Banner ─────────────────────────────────────────────────────────
function PermissionBanner({ state, error, onRequest }) {
    if (state === 'granted') return null
    return (
        <div className="location-banner" style={{
            background: state === 'denied' ? 'rgba(229,57,53,0.12)' : 'rgba(6,193,103,0.1)',
            border: `1px solid ${state === 'denied' ? 'rgba(229,57,53,0.35)' : 'rgba(6,193,103,0.35)'}`,
        }}>
            <span>{state === 'denied' ? '🚫' : '📍'}</span>
            <div style={{ flex: 1 }}>
                <strong>{state === 'denied' ? 'Location blocked' : 'Share your location'}</strong>
                <p>{error || 'Allow location access so your rider can find you and you can see them on the map.'}</p>
            </div>
            {state !== 'denied' && (
                <button className="btn btn-brand btn-sm" onClick={onRequest} id="allow-location-btn">
                    Allow GPS
                </button>
            )}
        </div>
    )
}

// ── No order empty state ──────────────────────────────────────────────────────
function NoOrderState({ navigate }) {
    return (
        <div className="no-order-shell">
            <div className="no-order-card">
                <div className="no-order-icon">📭</div>
                <h2 className="no-order-title">No active order</h2>
                <p className="no-order-sub">
                    You haven't placed a delivery order yet. Tap below to send something — it only takes a minute.
                </p>
                <button
                    className="btn btn-brand"
                    style={{ width: '100%', padding: '16px', fontSize: '1rem', marginTop: 8 }}
                    onClick={() => navigate('/book')}
                    id="start-order-btn"
                >
                    Place an order now
                </button>
                <button
                    className="btn btn-ghost"
                    style={{ width: '100%', padding: '14px', fontSize: '0.9rem', marginTop: 10 }}
                    onClick={() => navigate('/')}
                    id="go-home-btn"
                >
                    ← Back to home
                </button>
                <div className="no-order-tips">
                    <div className="no-order-tip"><span>🏍️</span><span>Boda orders matched in under 60 seconds</span></div>
                    <div className="no-order-tip"><span>📡</span><span>Track your rider live on a real-time map</span></div>
                    <div className="no-order-tip"><span>📱</span><span>Get SMS & call updates when rider is near</span></div>
                </div>
            </div>
        </div>
    )
}

// STATUS steps display
const STATUS_STEPS = [
    { key: 'searching', label: 'Searching for rider', icon: '🔍' },
    { key: 'assigned', label: 'Rider assigned', icon: '🏍️' },
    { key: 'pickup', label: 'Picking up', icon: '📦' },
    { key: 'transit', label: 'On the way', icon: '🚀' },
    { key: 'delivered', label: 'Delivered', icon: '🎉' },
]
const STATUS_ORDER = ['searching', 'assigned', 'pickup', 'transit', 'delivered']

// ── Main tracking view ────────────────────────────────────────────────────────
export default function TrackDelivery() {
    const { id } = useParams()
    const navigate = useNavigate()

    // Firestore order document
    const [order, setOrder] = useState(null)
    const [orderLoading, setOrderLoading] = useState(true)

    // GPS sharing — customer shares location, sees rider location
    const {
        myPos: customerPos,
        partnerPos: riderPos,
        permissionState,
        error: gpsError,
    } = useLocationSharing(id, 'customerLocation', 'riderLocation')

    // ETA countdown (simulated from rider position)
    const [eta, setEta] = useState(null)

    // Listen to order document in Firestore
    useEffect(() => {
        if (!id) return
        const unsub = onSnapshot(doc(db, 'orders', id), (snap) => {
            setOrderLoading(false)
            if (snap.exists()) {
                setOrder(snap.data())
            } else {
                setOrder(null)
            }
        }, () => {
            setOrderLoading(false)
        })
        return unsub
    }, [id])

    // Derive ETA from distance (when we have both positions)
    useEffect(() => {
        if (!riderPos || !customerPos) return
        const dlat = riderPos[0] - customerPos[0]
        const dlng = riderPos[1] - customerPos[1]
        const distKm = Math.sqrt(dlat * dlat + dlng * dlng) * 111
        const minutes = Math.max(1, Math.round(distKm / 0.4)) // ~24km/h average
        setEta(minutes)
    }, [riderPos, customerPos])

    // No ID → empty state
    if (!id) return <NoOrderState navigate={navigate} />

    // Map center: prefer rider's live position, fall back to customer, then Kampala
    const mapCenter = riderPos || customerPos || KAMPALA
    const mapZoom = riderPos ? 15 : 13

    // Status
    const currentStatus = order?.status || 'searching'
    const currentStatusIdx = STATUS_ORDER.indexOf(currentStatus)
    const vehicleEmoji = { boda: '🏍️', car: '🚗', pickup: '🛻', bigcar: '🚛' }[order?.vehicle] || '🏍️'

    return (
        <div className="track-shell">
            {/* ── Map pane ── */}
            <div className="track-map-pane">
                <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 500 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')} id="back-btn">
                        ← Home
                    </button>
                </div>

                {/* Permission banner floats over map */}
                {permissionState !== 'granted' && (
                    <div style={{ position: 'absolute', bottom: 100, left: 12, right: 12, zIndex: 500 }}>
                        <PermissionBanner
                            state={permissionState}
                            error={gpsError}
                            onRequest={() => {/* browser will re-trigger on next watchPosition */ }}
                        />
                    </div>
                )}

                <LiveMap
                    center={mapCenter}
                    zoom={mapZoom}
                    riderPosition={riderPos || undefined}
                    customerPosition={customerPos || undefined}
                    showRoute={!!(riderPos && customerPos)}
                    height="100%"
                />

                {/* Bottom overlay — only show when rider is assigned */}
                {order?.riderName && (
                    <div className="track-map-overlay">
                        <div className="tmo-icon">{vehicleEmoji}</div>
                        <div className="tmo-body">
                            <h4>{order.riderName} is on the way</h4>
                            <p>{order.pickup} → {order.dropoff}</p>
                        </div>
                        {eta && (
                            <div className="tmo-eta">
                                <div className="num">{eta}</div>
                                <div className="unit">min</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Sidebar ── */}
            <div className="track-sidebar-pane">

                {/* Order status / ETA hero */}
                <div className="eta-hero">
                    {eta ? (
                        <>
                            <div className="eta-num">{eta}</div>
                            <div className="eta-unit">minutes away</div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '2.5rem', marginBottom: 4 }}>
                                {STATUS_STEPS.find(s => s.key === currentStatus)?.icon || '📡'}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)' }}>
                                {STATUS_STEPS.find(s => s.key === currentStatus)?.label || 'Processing'}
                            </div>
                        </>
                    )}
                    <div className="eta-sub">Order #{(id || '').toUpperCase()}</div>
                </div>

                {/* GPS status */}
                <div style={{ padding: '0 24px 12px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 14px', borderRadius: 'var(--r-lg)',
                        background: permissionState === 'granted' ? 'var(--brand-dim)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${permissionState === 'granted' ? 'rgba(6,193,103,0.25)' : 'var(--border)'}`,
                        fontSize: '0.82rem', fontWeight: 600,
                    }}>
                        <div className={permissionState === 'granted' ? 'live-dot' : undefined}
                            style={permissionState !== 'granted' ? { width: 8, height: 8, borderRadius: '50%', background: 'var(--text-3)' } : undefined} />
                        <span style={{ color: permissionState === 'granted' ? 'var(--brand)' : 'var(--text-3)' }}>
                            {permissionState === 'granted'
                                ? 'GPS sharing active — rider can see you'
                                : permissionState === 'denied'
                                    ? 'Location blocked — enable in browser settings'
                                    : 'Waiting for location permission…'}
                        </span>
                    </div>
                </div>

                {/* Rider info */}
                {order?.riderName ? (
                    <div className="rider-card">
                        <p className="sub-heading" style={{ marginBottom: 14 }}>Your rider</p>
                        <div className="rider-row">
                            <div className="rider-av">{order.riderName[0]}</div>
                            <div className="rider-info">
                                <h3>{order.riderName}</h3>
                                <p>{vehicleEmoji} {order.vehicle} · {order.plate || 'UGT 000X'}</p>
                                <div className="rider-stars">★★★★★ <span style={{ color: 'var(--text-3)', fontWeight: 400, marginLeft: 4 }}>{order.riderRating || '4.8'}</span></div>
                            </div>
                        </div>
                        <div className="rider-btns">
                            <button className="rider-btn" id="call-btn" onClick={() => window.open(`tel:${order.riderPhone}`)}>
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
                ) : (
                    <div className="rider-card" style={{ textAlign: 'center', padding: '28px 24px' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-3)', fontWeight: 600 }}>
                            {orderLoading ? 'Loading order…' : '🔍 Finding a rider nearby…'}
                        </div>
                        {!orderLoading && (
                            <div style={{ marginTop: 12, height: 4, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: '40%', background: 'var(--brand)', borderRadius: 4, animation: 'searching-bar 1.5s ease-in-out infinite alternate' }} />
                            </div>
                        )}
                    </div>
                )}

                {/* Route */}
                {order && (
                    <div className="route-card">
                        <p className="sub-heading" style={{ marginBottom: 14 }}>Route</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <div className="route-line-item">
                                <div className="route-dot-col">
                                    <div className="route-dot-sm green" />
                                    <div className="route-connector" />
                                </div>
                                <div className="route-text" style={{ paddingLeft: 12, paddingBottom: 14 }}>
                                    <h4>{order.pickup}</h4>
                                    <p>Pickup point</p>
                                </div>
                            </div>
                            <div className="route-line-item">
                                <div className="route-dot-col">
                                    <div className="route-dot-sm red" />
                                </div>
                                <div className="route-text" style={{ paddingLeft: 12 }}>
                                    <h4>{order.dropoff}</h4>
                                    <p>Delivery address</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delivery status timeline */}
                <div className="timeline">
                    <p className="sub-heading" style={{ marginBottom: 16 }}>Delivery status</p>
                    {STATUS_STEPS.map((s, i) => {
                        const done = i < currentStatusIdx
                        const active = i === currentStatusIdx
                        return (
                            <div className={`tl-item ${done ? 'done' : active ? 'active' : ''}`} key={s.key}>
                                <div className="tl-col">
                                    <div className={`tl-dot ${done ? 'done' : active ? 'active' : ''}`}>
                                        {done ? '✓' : active ? '●' : ''}
                                    </div>
                                </div>
                                <div className="tl-body">
                                    <h4>{s.label}</h4>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}
