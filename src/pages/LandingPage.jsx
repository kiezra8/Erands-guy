import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LiveMap from '../components/LiveMap'
import '../App.css'

const KAMPALA = [-0.3476, 32.5825]

const VEHICLES = [
    {
        id: 'boda', emoji: '🏍️', name: 'Boda Boda',
        desc: "Uganda's iconic motorcycle couriers. Fastest through Kampala traffic for small-to-medium packages.",
        tags: ['Small parcels', 'Fastest', 'Budget-friendly'],
        price: 'From UGX 3,000',
        num: '01',
    },
    {
        id: 'car', emoji: '🚗', name: 'Courier Car',
        desc: 'Spacious cars for larger or fragile deliveries. More room, more care, multiple stops supported.',
        tags: ['Large parcels', 'Fragile items', 'Multi-stop'],
        price: 'From UGX 10,000',
        num: '02',
    },
]

const STEPS = [
    { num: '01', icon: '📍', title: 'Set locations', desc: 'Enter pickup and dropoff anywhere in Uganda. We recognise Kampala landmarks and town names.' },
    { num: '02', icon: '🏍️', title: 'Choose vehicle', desc: 'Pick boda-boda for speed or a car for bulk. Live pricing shown instantly before you confirm.' },
    { num: '03', icon: '📡', title: 'Track live', desc: 'Follow your rider on a real-time map. ETA updates as they move. No guessing, ever.' },
]

const FEATURES = [
    { icon: '📡', title: 'Real-time GPS', desc: 'Every delivery tracked on a live map. Both rider and customer see each other moving.' },
    { icon: '⚡', title: 'Instant matching', desc: 'Get matched with a verified rider in under 60 seconds, 7 days a week.' },
    { icon: '🔒', title: 'Verified riders', desc: 'Background-checked, rated, and trained. Your parcels are in safe hands.' },
    { icon: '💬', title: 'In-app messaging', desc: 'Chat directly with your rider — no need to share personal numbers.' },
    { icon: '📱', title: 'Mobile Money', desc: 'Pay via MTN MoMo or Airtel Money. Built for how Uganda actually pays.' },
    { icon: '🧾', title: 'Clear pricing', desc: 'See the price before you book. No hidden fees. What you see is what you pay.' },
]

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="landing">
            <Navbar />

            {/* ── HERO ── */}
            <section className="hero">
                {/* Left */}
                <div className="hero-left">
                    <div className="hero-eyebrow">
                        <div className="live-dot-ring"><div className="live-dot" /></div>
                        <span>Live in Kampala, Uganda 🇺🇬</span>
                    </div>

                    <h1 className="display hero-title">
                        Delivered fast.<br />
                        Tracked <strong>live.</strong>
                    </h1>

                    <p className="hero-desc">
                        Erands Guy connects you with verified boda-boda riders and car couriers
                        across Uganda. Book in seconds, watch your delivery move in real time.
                    </p>

                    <div className="hero-actions">
                        <button className="btn btn-brand" style={{ padding: '16px 32px', fontSize: '1rem' }} onClick={() => navigate('/book')}>
                            Book a delivery
                        </button>
                        <button className="btn btn-outline" style={{ padding: '15px 28px', fontSize: '1rem' }} onClick={() => navigate('/customer')}>
                            Track an order
                        </button>
                    </div>

                    <div className="hero-proof">
                        {[
                            { num: '2,400+', label: 'Active riders' },
                            { num: '98%', label: 'On-time rate' },
                            { num: '< 45min', label: 'Avg. delivery' },
                        ].map(p => (
                            <div key={p.label}>
                                <div className="proof-num">{p.num}</div>
                                <div className="proof-label">{p.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — live map */}
                <div className="hero-right">
                    <LiveMap
                        center={KAMPALA}
                        zoom={13}
                        riderPosition={[KAMPALA[0] + 0.009, KAMPALA[1] - 0.01]}
                        customerPosition={[KAMPALA[0] - 0.006, KAMPALA[1] + 0.013]}
                        showRoute
                        height="100%"
                    />
                    {/* Overlay cards */}
                    <div className="map-card map-card-top">
                        <div className="map-card-label">Active rider nearby</div>
                        <div className="map-card-value">🏍️ Patrick O.</div>
                        <div className="map-card-sub">2 min away · Boda Boda</div>
                    </div>
                    <div className="map-card map-card-bot">
                        <div className="map-card-label">Last delivery</div>
                        <div className="map-card-value">✅ Delivered</div>
                        <div className="map-card-sub">Ntinda · UGX 5,500</div>
                    </div>
                </div>
            </section>

            {/* ── VEHICLES ── */}
            <section className="vehicles-section" id="vehicles">
                <div className="section">
                    <div className="section-label">Fleet</div>
                    <h2 className="section-title">Pick your vehicle</h2>
                    <p className="section-sub">Speed or space — choose the right fit for your parcel before you even confirm.</p>

                    <div className="vehicles-grid">
                        {VEHICLES.map(v => (
                            <div className={`vehicle-tile ${v.id}`} key={v.id} onClick={() => navigate('/book')}>
                                <span className="vehicle-tile-icon">{v.emoji}</span>
                                <h3>{v.name}</h3>
                                <p>{v.desc}</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                                    {v.tags.map(t => (
                                        <span className="chip chip-gray" key={t}>{t}</span>
                                    ))}
                                </div>
                                <div className="vehicle-tile-meta">
                                    <div className="vehicle-price-block">
                                        <div className="price-from">Starting from</div>
                                        <div className="price-val">{v.price}</div>
                                    </div>
                                    <button
                                        className="btn btn-brand btn-sm"
                                        onClick={e => { e.stopPropagation(); navigate('/book') }}
                                    >
                                        Book now
                                    </button>
                                </div>
                                <div className="vehicle-bg-num">{v.num}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <div id="how">
                <div className="section">
                    <div className="section-label">Process</div>
                    <h2 className="section-title">Three steps, one delivery</h2>
                    <p className="section-sub">No app download needed. Open, book, and track right from your browser.</p>

                    <div className="steps-grid">
                        {STEPS.map(s => (
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
                            <p>Uganda's real-time delivery platform. Boda-bodas, courier cars, live GPS tracking.</p>
                        </div>
                        {[
                            { title: 'Company', links: ['About us', 'Careers', 'Press', 'Blog'] },
                            { title: 'Services', links: ['Boda delivery', 'Car courier', 'Business', 'API'] },
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
        </div>
    )
}
