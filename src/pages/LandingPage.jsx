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
        desc: "Uganda's iconic motorcycle. Fastest through Kampala traffic for documents, small parcels & food.",
        tags: ['Documents', 'Small parcels', 'Food', 'Fast'],
        price: 'From UGX 3,000',
        color: '#06C167',
        idealFor: 'Light items under 5 kg',
        guide: {
            title: 'How to Order a Boda Boda',
            steps: [
                { icon: '📍', step: 'Enter your pickup location', detail: 'Type or select your pickup point on the map. We know all Kampala landmarks!' },
                { icon: '🏠', step: 'Enter your dropoff location', detail: 'Where should the parcel go? You can also let the receiver enter their address.' },
                { icon: '📦', step: 'Describe your parcel', detail: 'Select parcel type (e.g. documents, food, clothing). Note any fragile items.' },
                { icon: '💰', step: 'See the price instantly', detail: 'No hidden fees. The exact fare is shown before you confirm.' },
                { icon: '✅', step: 'Confirm & pay', detail: 'Pay via MTN MoMo or Airtel Money. Your boda is matched within 60 seconds!' },
                { icon: '📡', step: 'Track in real time', detail: 'Watch your rider live on the map. You\'ll be notified when they\'re close.' },
            ]
        }
    },
    {
        id: 'car',
        emoji: '🚗',
        name: 'Courier Car',
        tagline: 'Medium Load',
        desc: 'Spacious sedan for mid-size deliveries. Ideal for electronics, clothing hauls, and multi-stop routes.',
        tags: ['Electronics', 'Clothing', 'Multi-stop', 'Fragile'],
        price: 'From UGX 10,000',
        color: '#276EF1',
        idealFor: 'Items 5 – 50 kg',
        guide: {
            title: 'How to Order a Courier Car',
            steps: [
                { icon: '📍', step: 'Set your pickup & dropoff', detail: 'Enter your locations. Cars can handle multi-stop routes — add up to 3 stops.' },
                { icon: '📦', step: 'Describe your items', detail: 'Tell us what you\'re sending — electronics, furniture pieces, or clothing bundles.' },
                { icon: '🗓️', step: 'Choose schedule', detail: 'Book now for immediate pickup, or schedule for later at your convenience.' },
                { icon: '💰', step: 'Get instant pricing', detail: 'Pricing is distance-based. See the fare before confirming — no surprises.' },
                { icon: '✅', step: 'Confirm & pay', detail: 'Pay via Mobile Money. Your driver will be assigned and en route shortly.' },
                { icon: '📡', step: 'Track your delivery', detail: 'Follow the car on a live map with real-time ETA updates.' },
            ]
        }
    },
    {
        id: 'pickup',
        emoji: '🛻',
        name: 'Pickup Truck',
        tagline: 'Bulk Load',
        desc: 'Open-bed truck for furniture, appliances, and market goods. The workhorse for moving bigger things.',
        tags: ['Furniture', 'Appliances', 'Market goods', 'Moving'],
        price: 'From UGX 25,000',
        color: '#F5A623',
        idealFor: 'Items 50 – 500 kg',
        guide: {
            title: 'How to Order a Pickup Truck',
            steps: [
                { icon: '📍', step: 'Enter pickup & delivery address', detail: 'Full address or landmark. Our drivers know Kampala\'s every corner.' },
                { icon: '📋', step: 'List your items', detail: 'Let us know what you\'re moving — furniture, market produce, appliances, etc.' },
                { icon: '⚖️', step: 'Estimate the load', detail: 'Give us rough weight/volume so we assign the right sized truck.' },
                { icon: '🧑‍🤝‍🧑', step: 'Request loading help (optional)', detail: 'Need hands on deck? Add loading/offloading helpers for a small extra fee.' },
                { icon: '💰', step: 'Confirm the price', detail: 'Pickup truck pricing is upfront. Pay via Mobile Money after confirming.' },
                { icon: '📡', step: 'Track your load', detail: 'Live map tracking so you know exactly when your goods arrive.' },
            ]
        }
    },
    {
        id: 'bigcar',
        emoji: '🚛',
        name: 'Big Truck',
        tagline: 'Heavy Cargo',
        desc: 'Large lorry for full-scale moves, factory goods, or construction materials. Handles the heaviest loads.',
        tags: ['Full moves', 'Factory goods', 'Construction', 'Heavy'],
        price: 'From UGX 80,000',
        color: '#E53935',
        idealFor: 'Items over 500 kg',
        guide: {
            title: 'How to Order a Big Truck',
            steps: [
                { icon: '📍', step: 'Provide full route details', detail: 'Enter origin and destination. Long-distance intercity deliveries also supported.' },
                { icon: '📋', step: 'Describe the cargo', detail: 'Type, weight, dimensions. For sensitive goods, add special handling notes.' },
                { icon: '🏭', step: 'Arrange loading access', detail: 'Let us know if loading docks or cranes are needed at either end.' },
                { icon: '📅', step: 'Schedule ahead', detail: 'Big truck bookings are best made 2–24 hours in advance for best availability.' },
                { icon: '💰', step: 'Receive a quote', detail: 'Our team will send a final quote based on cargo type, weight, and distance.' },
                { icon: '📡', step: 'Track shipment live', detail: 'Full GPS tracking on every large freight run. Know exactly where your goods are.' },
            ]
        }
    },
]

const FEATURES = [
    { icon: '📡', title: 'Real-time GPS', desc: 'Every delivery tracked on a live map. Both rider and customer see each other moving.' },
    { icon: '⚡', title: 'Instant matching', desc: 'Get matched with a verified rider in under 60 seconds, 7 days a week.' },
    { icon: '🔒', title: 'Verified riders', desc: 'Background-checked, rated, and trained. Your parcels are in safe hands.' },
    { icon: '💬', title: 'In-app messaging', desc: 'Chat directly with your rider — no need to share personal numbers.' },
    { icon: '📱', title: 'Mobile Money', desc: 'Pay via MTN MoMo or Airtel Money. Built for how Uganda actually pays.' },
    { icon: '🧾', title: 'Clear pricing', desc: 'See the price before you book. No hidden fees. What you see is what you pay.' },
]

// ── Order Guide Modal ──────────────────────────────────────────────────────
function OrderGuideModal({ vehicle, onClose, onBook }) {
    if (!vehicle) return null
    const { guide, emoji, name, color } = vehicle
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
                <div className="modal-header">
                    <div className="modal-emoji" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                        {emoji}
                    </div>
                    <div>
                        <h2 className="modal-title">{guide.title}</h2>
                        <p className="modal-sub">Follow these steps to send with {name}</p>
                    </div>
                </div>
                <div className="modal-steps">
                    {guide.steps.map((s, i) => (
                        <div className="modal-step" key={i}>
                            <div className="modal-step-left">
                                <div className="modal-step-num" style={{ background: `${color}22`, color }}>{i + 1}</div>
                                {i < guide.steps.length - 1 && <div className="modal-step-line" style={{ background: `${color}33` }} />}
                            </div>
                            <div className="modal-step-body">
                                <div className="modal-step-icon">{s.icon}</div>
                                <h4>{s.step}</h4>
                                <p>{s.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className="btn btn-brand"
                    style={{ width: '100%', padding: '16px', fontSize: '1rem', background: color }}
                    onClick={onBook}
                >
                    Book {name} Now →
                </button>
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
                            riderPosition={[KAMPALA[0] + 0.009, KAMPALA[1] - 0.01]}
                            customerPosition={[KAMPALA[0] - 0.006, KAMPALA[1] + 0.013]}
                            showRoute
                            height="100%"
                        />
                        {/* Live overlay */}
                        <div className="track-map-pill">
                            <div className="live-dot-ring"><div className="live-dot" /></div>
                            <span>Live tracking active</span>
                        </div>
                        <div className="track-map-eta">
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>ETA</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--brand)', lineHeight: 1 }}>12 min</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 2 }}>Ntinda · Patrick O.</div>
                        </div>
                    </div>

                    {/* Right: tracking form */}
                    <div className="track-form-side">
                        <div className="section-label">Track delivery</div>
                        <h2 className="section-title">Where's my order?</h2>
                        <p className="section-sub" style={{ marginBottom: 36 }}>
                            Enter your order ID to see your rider's live location, ETA, and full delivery status.
                        </p>

                        {/* Input */}
                        <div className={`track-input-wrap ${shake ? 'shake' : ''}`}>
                            <span className="track-input-icon">📦</span>
                            <input
                                className="track-input-field"
                                id="track-order-id"
                                placeholder="Enter order ID e.g. EG-001"
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

                        {/* Status breakdown */}
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

                        <div style={{ marginTop: 24, padding: '14px 18px', background: 'var(--brand-dim)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(6,193,103,0.2)', fontSize: '0.83rem', color: 'var(--text-2)' }}>
                            💡 <strong>Tip:</strong> Your order ID is in the confirmation SMS or email after booking.
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
    const [activeGuide, setActiveGuide] = useState(null)

    return (
        <div className="landing">
            <Navbar />

            {/* ── HERO IMAGE ── fills viewport right after navbar ── */}
            <section className="hero-image-section">
                <div className="hero-image-bg" aria-hidden="true" />
                <div className="hero-image-overlay" aria-hidden="true" />

                {/* Content on top of image */}
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
                        Erands Guy connects you with verified boda-boda riders, car couriers,
                        pickup trucks and big lorries across Uganda. Book in seconds, watch
                        your delivery move in real time.
                    </p>
                    <div className="hero-actions">
                        <button
                            className="btn btn-brand"
                            style={{ padding: '16px 36px', fontSize: '1.05rem' }}
                            onClick={() => navigate('/book')}
                            id="hero-book-btn"
                        >
                            Book a delivery
                        </button>
                        <button
                            className="btn btn-outline hero-track-btn"
                            style={{ padding: '15px 28px', fontSize: '1rem' }}
                            onClick={() => document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' })}
                            id="hero-track-btn"
                        >
                            Track an order
                        </button>
                    </div>
                </div>
            </section>

            {/* ── ORDER TYPE SELECTION ── */}
            <section className="order-section" id="order">
                <div className="section">
                    <div className="section-label">Choose your ride</div>
                    <h2 className="section-title">What are you sending?</h2>
                    <p className="section-sub">
                        Pick the vehicle that fits your load — from a quick boda run to a full lorry haul.
                        Tap any option to see exactly how to order.
                    </p>

                    <div className="order-grid">
                        {ORDER_TYPES.map(v => (
                            <div
                                className="order-tile"
                                key={v.id}
                                id={`order-tile-${v.id}`}
                                onClick={() => setActiveGuide(v)}
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

                                <div className="order-tile-footer">
                                    <div>
                                        <div className="order-tile-ideal">{v.idealFor}</div>
                                        <div className="order-tile-price">{v.price}</div>
                                    </div>
                                    <button
                                        className="order-tile-cta"
                                        style={{ background: v.color, color: '#000' }}
                                        onClick={e => { e.stopPropagation(); setActiveGuide(v) }}
                                        id={`order-btn-${v.id}`}
                                    >
                                        Order →
                                    </button>
                                </div>

                                {/* Hover glow */}
                                <div className="order-tile-glow" style={{ background: `radial-gradient(ellipse at top left, ${v.color}18 0%, transparent 70%)` }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TRACKING SECTION ── */}
            <TrackSection navigate={navigate} />

            {/* ── HOW IT WORKS ── */}
            <div id="how">
                <div className="section">
                    <div className="section-label">Process</div>
                    <h2 className="section-title">Three steps, one delivery</h2>
                    <p className="section-sub">No app download needed. Open, book, and track right from your browser.</p>

                    <div className="steps-grid">
                        {[
                            { num: '01', icon: '📍', title: 'Set locations', desc: 'Enter pickup and dropoff anywhere in Uganda. We recognise Kampala landmarks and town names.' },
                            { num: '02', icon: '🏍️', title: 'Choose vehicle', desc: 'Pick boda, car, pickup or big truck. Live pricing shown instantly before you confirm.' },
                            { num: '03', icon: '📡', title: 'Track live', desc: 'Follow your rider on a real-time map. ETA updates as they move. No guessing, ever.' },
                        ].map(s => (
                            <div className="step-block" key={s.num}>
                                <div className="step-num">{s.num}</div>
                                <div className="step-block-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FEATURES ── */}
            <section style={{ background: 'var(--surface)' }} id="features">
                <div className="section">
                    <div className="section-label">Built for Uganda</div>
                    <h2 className="section-title">Everything you need</h2>
                    <p className="section-sub">Designed with Kampala's roads, mobile money, and local life in mind from day one.</p>

                    <div className="features-grid">
                        {FEATURES.map(f => (
                            <div className="feature-block" key={f.title}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Band ── */}
            <div className="cta-band">
                <div style={{ maxWidth: 560, margin: '0 auto' }}>
                    <h2>Start delivering today.</h2>
                    <p>Join thousands of Ugandans already trusting Erands Guy every day.</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-white" style={{ padding: '16px 32px', fontSize: '1rem' }} onClick={() => navigate('/book')}>
                            Send a parcel
                        </button>
                        <button className="btn btn-outline" style={{ padding: '15px 28px', fontSize: '1rem', borderColor: 'rgba(0,0,0,0.25)', color: '#000' }} onClick={() => navigate('/rider')}>
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
                            { title: 'Company', links: ['About us', 'Careers', 'Press', 'Blog'] },
                            { title: 'Services', links: ['Boda delivery', 'Car courier', 'Pickup truck', 'Big lorry'] },
                            { title: 'Support', links: ['Help center', 'Contact', 'Safety', 'Privacy'] },
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
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── Order Guide Modal ── */}
            <OrderGuideModal
                vehicle={activeGuide}
                onClose={() => setActiveGuide(null)}
                onBook={() => { setActiveGuide(null); navigate('/book') }}
            />
        </div>
    )
}
