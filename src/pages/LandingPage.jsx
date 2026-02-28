import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LiveMap from '../components/LiveMap'
import '../App.css'

const KAMPALA = [-0.3476, 32.5825]

// ── Vehicle / Order types ──────────────────────────────────────────────────
const ORDER_TYPES = [
    {
        id: 'boda',
        emoji: '🏍️',
        name: 'Boda Boda',
        tagline: 'Small & Fast',
        desc: "Fastest through Kampala traffic. Perfect for documents, small parcels & food.",
        tags: ['Documents', 'Small parcels', 'Food'],
        color: '#06C167',
        idealFor: 'Light items under 5 kg',
    },
    {
        id: 'car',
        emoji: '🚗',
        name: 'Courier Car',
        tagline: 'Medium Load',
        desc: 'Spacious sedan for mid-size deliveries — electronics, clothing hauls & multi-stop routes.',
        tags: ['Electronics', 'Clothing', 'Multi-stop'],
        color: '#276EF1',
        idealFor: 'Items 5 – 50 kg',
    },
    {
        id: 'pickup',
        emoji: '🛻',
        name: 'Pickup Truck',
        tagline: 'Bulk Load',
        desc: 'Open-bed truck for furniture, appliances & market goods.',
        tags: ['Furniture', 'Appliances', 'Market goods'],
        color: '#F5A623',
        idealFor: 'Items 50 – 500 kg',
    },
    {
        id: 'bigcar',
        emoji: '🚛',
        name: 'Big Truck',
        tagline: 'Heavy Cargo',
        desc: 'Large lorry for full-scale moves, factory goods or construction materials.',
        tags: ['Full moves', 'Factory goods', 'Construction'],
        color: '#E53935',
        idealFor: 'Items over 500 kg',
    },
]

// ── Account prompt modal — shown when tapping Order ───────────────────────
function AccountPromptModal({ vehicle, onClose, onSkip, onCreateAccount }) {
    if (!vehicle) return null
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="acct-prompt-box" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

                {/* Icon */}
                <div className="acct-prompt-icon" style={{ background: `${vehicle.color}18`, border: `2px solid ${vehicle.color}44` }}>
                    {vehicle.emoji}
                </div>

                <h2 className="acct-prompt-title">
                    Order a {vehicle.name}
                </h2>
                <p className="acct-prompt-sub">
                    Save your order history and get updates by creating a free account — or just skip and order now.
                </p>

                <div className="acct-prompt-actions">
                    <button
                        className="btn btn-brand"
                        style={{ width: '100%', padding: '15px', fontSize: '1rem', background: vehicle.color }}
                        onClick={onCreateAccount}
                        id="acct-prompt-create"
                    >
                        Create free account
                    </button>
                    <button
                        className="btn btn-ghost"
                        style={{ width: '100%', padding: '14px', fontSize: '0.95rem', marginTop: 8 }}
                        onClick={onSkip}
                        id="acct-prompt-skip"
                    >
                        Skip, order as guest →
                    </button>
                </div>

                <p className="acct-prompt-note">No credit card needed · Free forever</p>
            </div>
        </div>
    )
}

// ── Tracking Section ───────────────────────────────────────────────────────
function TrackSection({ navigate }) {
    const [trackId, setTrackId] = useState('')
    const [shake, setShake] = useState(false)

    const handleTrack = () => {
        if (!trackId.trim()) {
            setShake(true)
            setTimeout(() => setShake(false), 600)
            return
        }
        navigate(`/track/${trackId.trim()}`)
    }

    return (
        <section className="track-section" id="track">
            <div className="section">
                <div className="track-inner">
                    {/* Left: map preview */}
                    <div className="track-map-preview">
                        <LiveMap
                            center={KAMPALA}
                            zoom={13}
                            markers={[{ position: KAMPALA, label: 'Your rider', color: '#06C167' }]}
                            style={{ width: '100%', height: '100%', borderRadius: 'var(--r-xl)' }}
                        />
                        {/* Live badge */}
                        <div className="track-live-badge">
                            <div className="live-dot" />
                            <span>Live tracking</span>
                        </div>
                    </div>

                    {/* Right: form */}
                    <div className="track-form-side">
                        <div className="section-label">Track order</div>
                        <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 8 }}>
                            Where's your delivery?
                        </h2>
                        <p className="section-sub" style={{ marginBottom: 24 }}>
                            Enter your order ID to see your rider's live location and ETA.
                        </p>

                        {/* Input */}
                        <div className={`track-input-wrap ${shake ? 'shake' : ''}`}>
                            <span className="track-input-icon">📦</span>
                            <input
                                className="track-input-field"
                                id="track-order-id"
                                placeholder="e.g. EG-001"
                                value={trackId}
                                onChange={e => setTrackId(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                            />
                            <button
                                className="btn btn-brand"
                                id="track-btn"
                                style={{ borderRadius: 'var(--r-full)', padding: '12px 24px', fontSize: '0.9rem', flexShrink: 0 }}
                                onClick={handleTrack}
                            >
                                Track →
                            </button>
                        </div>

                        {/* Status steps */}
                        <div className="track-status-steps">
                            {[
                                { icon: '✅', label: 'Order placed', done: true },
                                { icon: '🏍️', label: 'Rider assigned', done: true },
                                { icon: '📦', label: 'Picking up', active: true },
                                { icon: '🚀', label: 'On the way', done: false },
                                { icon: '🎉', label: 'Delivered', done: false },
                            ].map((s, i) => (
                                <div className={`tss-item ${s.done ? 'done' : s.active ? 'active' : ''}`} key={i}>
                                    <div className="tss-dot">{s.done ? '✓' : s.active ? '●' : ''}</div>
                                    <span>{s.label}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--brand-dim)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(6,193,103,0.2)', fontSize: '0.82rem', color: 'var(--text-2)' }}>
                            💡 <strong>Tip:</strong> Your order ID is in the SMS you receive after booking.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function LandingPage() {
    const navigate = useNavigate()
    // selectedVehicle drives the account prompt modal
    const [selectedVehicle, setSelectedVehicle] = useState(null)

    const handleOrderTap = (vehicle) => {
        setSelectedVehicle(vehicle)
    }

    const handleSkip = () => {
        setSelectedVehicle(null)
        navigate('/book')
    }

    const handleCreateAccount = () => {
        setSelectedVehicle(null)
        navigate('/login')
    }

    return (
        <div className="landing">
            <Navbar />

            {/* ── HERO IMAGE ── */}
            <section className="hero-image-section">
                <div className="hero-image-bg" aria-hidden="true" />
                <div className="hero-image-overlay" aria-hidden="true" />

                <div className="hero-image-content">
                    <div className="hero-eyebrow">
                        <div className="live-dot-ring"><div className="live-dot" /></div>
                        <span>Live in Kampala, Uganda 🇺🇬</span>
                    </div>
                    <h1 className="display hero-title">
                        Delivered fast.<br />
                        Tracked <strong>live.</strong>
                    </h1>
                    <p className="hero-desc">
                        Book a boda-boda, courier car, pickup or big truck across Uganda.
                        No app needed — just tap, order & track in real time.
                    </p>
                </div>
            </section>

            {/* ── ORDER TYPE SELECTION ── */}
            <section className="order-section" id="order">
                <div className="section">
                    <div className="section-label">What are you sending?</div>
                    <h2 className="section-title">Choose your vehicle</h2>
                    <p className="section-sub">
                        Tap the right vehicle for your load and we'll walk you through the rest.
                    </p>

                    <div className="order-grid">
                        {ORDER_TYPES.map(v => (
                            <div
                                className="order-tile"
                                key={v.id}
                                id={`order-tile-${v.id}`}
                                onClick={() => handleOrderTap(v)}
                                style={{ '--tile-color': v.color }}
                            >
                                <div className="order-tile-top">
                                    <div className="order-tile-emoji-wrap" style={{ background: `${v.color}18`, border: `1px solid ${v.color}33` }}>
                                        <span className="order-tile-emoji">{v.emoji}</span>
                                    </div>
                                    <div className="order-tile-badge" style={{ color: v.color, background: `${v.color}15`, border: `1px solid ${v.color}30` }}>
                                        {v.tagline}
                                    </div>
                                </div>

                                <h3 className="order-tile-name">{v.name}</h3>
                                <p className="order-tile-desc">{v.desc}</p>

                                <div className="order-tile-tags">
                                    {v.tags.map(t => (
                                        <span className="order-tag" key={t} style={{ background: `${v.color}10`, color: v.color, border: `1px solid ${v.color}25` }}>{t}</span>
                                    ))}
                                </div>

                                <div className="order-tile-footer" style={{ marginTop: 'auto' }}>
                                    <div className="order-tile-ideal">{v.idealFor}</div>
                                    <button
                                        className="order-tile-cta"
                                        style={{ background: v.color, color: '#000' }}
                                        onClick={e => { e.stopPropagation(); handleOrderTap(v) }}
                                        id={`order-btn-${v.id}`}
                                    >
                                        Order →
                                    </button>
                                </div>

                                <div className="order-tile-glow" style={{ background: `radial-gradient(ellipse at top left, ${v.color}18 0%, transparent 70%)` }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TRACKING SECTION ── */}
            <TrackSection navigate={navigate} />

            {/* ── CTA Band ── */}
            <div className="cta-band">
                <div style={{ maxWidth: 480, margin: '0 auto' }}>
                    <h2>Ready to send something?</h2>
                    <p>Thousands of Ugandans trust Erands Guy every day.</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-white" style={{ padding: '14px 32px', fontSize: '1rem' }} onClick={() => navigate('/book')}>
                            Send a parcel
                        </button>
                        <button className="btn btn-outline" style={{ padding: '13px 28px', fontSize: '1rem', borderColor: 'rgba(0,0,0,0.25)', color: '#000' }} onClick={() => navigate('/rider')}>
                            Become a rider
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-top">
                        <div className="footer-about">
                            <div className="nav-logo" style={{ marginBottom: 0 }}>
                                <div className="nav-logo-mark">E</div>
                                <span className="nav-logo-text">Erands<em>Guy</em></span>
                            </div>
                            <p>Uganda's real-time delivery platform. Boda-bodas, courier cars, pickup trucks, big lorries.</p>
                        </div>
                        {[
                            { title: 'Company', links: ['About us', 'Careers', 'Blog'] },
                            { title: 'Services', links: ['Boda delivery', 'Car courier', 'Pickup truck', 'Big lorry'] },
                            { title: 'Support', links: ['Help center', 'Contact', 'Safety'] },
                        ].map(col => (
                            <div key={col.title} className="footer-col">
                                <div className="footer-col-title">{col.title}</div>
                                <ul>
                                    {col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="footer-bottom">
                        <span>🇺🇬 Made in Uganda · © 2026 Erands Guy Ltd</span>
                        <div className="footer-links">
                            <a href="#">Terms</a>
                            <a href="#">Privacy</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── Account Prompt Modal ── shown when tapping any order tile ── */}
            <AccountPromptModal
                vehicle={selectedVehicle}
                onClose={() => setSelectedVehicle(null)}
                onSkip={handleSkip}
                onCreateAccount={handleCreateAccount}
            />
        </div>
    )
}
