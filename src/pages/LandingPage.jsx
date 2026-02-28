import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../App.css'

const features = [
    { icon: '📡', title: 'Live GPS Tracking', desc: 'Watch your rider move in real-time on an interactive map. Know exactly where your parcel is.' },
    { icon: '⚡', title: 'Lightning Fast', desc: 'Boda-bodas weave through Kampala traffic in record time. Your package arrives when you need it.' },
    { icon: '🔒', title: 'Secure & Verified', desc: 'Every rider is background-checked and trained. Your goods are in safe hands.' },
    { icon: '💬', title: 'In-App Chat', desc: 'Talk directly to your delivery rider through the app. No need to share your personal number.' },
    { icon: '💳', title: 'Mobile Money', desc: 'Pay via MTN Mobile Money, Airtel Money, or card. Seamlessly built for Uganda.' },
    { icon: '📊', title: 'Smart Pricing', desc: 'Fair, transparent pricing based on distance. No hidden charges. What you see is what you pay.' },
]

const steps = [
    { num: '01', icon: '📍', title: 'Enter Locations', desc: 'Set your pickup and delivery addresses anywhere in Uganda. Our smart search understands local landmarks.' },
    { num: '02', icon: '🏍️', title: 'Choose Vehicle', desc: 'Pick a speedy boda-boda for small parcels or a car for larger deliveries. You decide the right fit.' },
    { num: '03', icon: '🗺️', title: 'Track Live', desc: 'Watch your rider navigate in real-time. Receive updates as your delivery moves from pickup to you.' },
]

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="landing">
            <Navbar />

            {/* HERO */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="hero-grid" />
                <div className="hero-content">
                    <div className="hero-text fade-in-up">
                        <span className="badge badge-green">
                            <span className="pulse-dot" />
                            Live in Kampala, Uganda 🇺🇬
                        </span>
                        <h1 className="hero-heading">
                            Deliveries Done<br />
                            <span className="gradient-text">Differently.</span>
                        </h1>
                        <p className="hero-sub">
                            Erands Guy connects you with verified boda-boda riders and car couriers across Uganda.
                            Real-time GPS tracking, instant booking, and lightning-fast delivery.
                        </p>
                        <div className="hero-cta">
                            <button className="btn btn-primary" onClick={() => navigate('/book')}>
                                📦 Send a Parcel
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate('/customer')}>
                                🗺️ Track an Order
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <h3>2,400+</h3>
                                <p>Active Riders</p>
                            </div>
                            <div className="stat-item">
                                <h3>98%</h3>
                                <p>On-Time Rate</p>
                            </div>
                            <div className="stat-item">
                                <h3>45 min</h3>
                                <p>Avg Delivery</p>
                            </div>
                        </div>
                    </div>

                    {/* Phone Mockup */}
                    <div className="hero-visual fade-in-up delay-2">
                        <div className="floating-badge badge-tl">
                            <div className="fb-icon green">🏍️</div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Rider Nearby</p>
                                <p style={{ color: 'var(--primary)', fontWeight: 700 }}>2 min away</p>
                            </div>
                        </div>

                        <div className="phone-mockup">
                            <div className="phone-notch" />
                            <div className="phone-screen">
                                <div className="phone-map-area">
                                    <div className="phone-map-route" />
                                    <div className="phone-map-dot" />
                                    <div className="phone-map-rider">🏍️</div>
                                    <div style={{
                                        position: 'absolute', bottom: 12, left: 12, right: 12,
                                        background: 'rgba(13,17,32,0.8)', borderRadius: 10, padding: '8px 10px',
                                        backdropFilter: 'blur(8px)', fontSize: '0.65rem', color: 'var(--text-secondary)'
                                    }}>
                                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Kampala, Uganda</span>
                                    </div>
                                </div>
                                <div className="phone-status-bar">
                                    <div className="phone-status-icon">🏍️</div>
                                    <div className="phone-status-text">
                                        <p>Patrick O. is on the way</p>
                                        <p>Heading to Ntinda, Kampala</p>
                                    </div>
                                    <div className="phone-eta">8 min</div>
                                </div>
                            </div>
                        </div>

                        <div className="floating-badge badge-br">
                            <div className="fb-icon purple">✅</div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Delivered!</p>
                                <p style={{ color: '#A78BFA', fontWeight: 700 }}>Package safe</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <div id="how-it-works">
                <div className="section">
                    <div className="section-header fade-in-up">
                        <span className="badge badge-purple" style={{ marginBottom: 16 }}>Simple Process</span>
                        <h2>How <span className="gradient-text">Erands Guy</span> Works</h2>
                        <p>From booking to delivery in three simple steps. No fuss, just fast.</p>
                    </div>
                    <div className="steps-grid">
                        {steps.map((s, i) => (
                            <div className={`step-card fade-in-up delay-${i + 1}`} key={s.num}>
                                <div className="step-number">{s.num}</div>
                                <div className="step-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* VEHICLE TYPES */}
            <div id="vehicles" style={{ background: 'var(--bg-surface)', padding: '0' }}>
                <div className="section">
                    <div className="section-header">
                        <span className="badge badge-amber" style={{ marginBottom: 16 }}>Fleet</span>
                        <h2>Choose Your <span className="gradient-text">Vehicle</span></h2>
                        <p>The right vehicle for every delivery. Speed or capacity — you choose.</p>
                    </div>
                    <div className="vehicles-grid">
                        {/* BODA BODA */}
                        <div className="vehicle-card boda">
                            <span className="vehicle-emoji">🏍️</span>
                            <h3 style={{ color: 'var(--primary)' }}>Boda Boda</h3>
                            <p>Uganda's iconic motorcycle taxis, now delivering your parcels faster than traffic allows. Perfect for small packages.</p>
                            <div className="vehicle-features">
                                {['Small-medium parcels', 'Beats Kampala traffic', 'Fastest option'].map(f => (
                                    <div className="vehicle-feature" key={f}>{f}</div>
                                ))}
                            </div>
                            <div className="vehicle-price">
                                From UGX 3,000 <span>/ delivery</span>
                            </div>
                            <div className="vehicle-bg-emoji">🏍️</div>
                            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/book')}>
                                Book Boda
                            </button>
                        </div>

                        {/* CAR */}
                        <div className="vehicle-card car">
                            <span className="vehicle-emoji">🚗</span>
                            <h3 style={{ color: '#A78BFA' }}>Courier Car</h3>
                            <p>Spacious cars for larger, sensitive, or multiple packages. Ideal when you need careful handling and more room.</p>
                            <div className="vehicle-features">
                                {['Large & fragile parcels', 'Climate controlled', 'Multiple stops'].map(f => (
                                    <div className="vehicle-feature" key={f} style={{ '--primary': '#A78BFA' }}>{f}</div>
                                ))}
                            </div>
                            <div className="vehicle-price">
                                From UGX 10,000 <span>/ delivery</span>
                            </div>
                            <div className="vehicle-bg-emoji">🚗</div>
                            <button className="btn btn-secondary" style={{ marginTop: 24, borderColor: '#A78BFA', color: '#A78BFA' }} onClick={() => navigate('/book')}>
                                Book Car
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FEATURES */}
            <div id="features">
                <div className="section">
                    <div className="section-header">
                        <span className="badge badge-green" style={{ marginBottom: 16 }}>Capabilities</span>
                        <h2>Built for <span className="gradient-text">Uganda</span></h2>
                        <p>Every feature designed with Ugandan roads, mobile money, and local needs in mind.</p>
                    </div>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div className={`feature-card fade-in-up delay-${(i % 4) + 1}`} key={f.title}>
                                <span className="feature-icon">{f.icon}</span>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA BANNER */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(0,229,160,0.08), rgba(124,58,237,0.08))',
                borderTop: '1px solid var(--bg-glass-border)',
                borderBottom: '1px solid var(--bg-glass-border)',
            }}>
                <div className="section" style={{ textAlign: 'center', padding: '80px 40px' }}>
                    <span className="badge badge-green" style={{ marginBottom: 20 }}>Ready?</span>
                    <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
                        Start Your First Delivery Today
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
                        Join thousands of Ugandans already trusting Erands Guy with their deliveries every day.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '16px 40px' }} onClick={() => navigate('/book')}>
                            📦 Book a Delivery
                        </button>
                        <button className="btn btn-ghost" onClick={() => navigate('/rider')}>
                            🏍️ Become a Rider
                        </button>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer id="about" className="footer">
                <div className="footer-content">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <div className="nav-logo">
                                <div className="nav-logo-icon">⚡</div>
                                <span className="nav-logo-text">Erands <span>Guy</span></span>
                            </div>
                            <p>Uganda's smartest delivery platform. Real-time GPS, verified riders, and lightning-fast deliveries across Kampala and beyond.</p>
                        </div>
                        <div className="footer-col">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Press</a></li>
                                <li><a href="#">Blog</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Services</h4>
                            <ul>
                                <li><a href="#">Boda Delivery</a></li>
                                <li><a href="#">Car Courier</a></li>
                                <li><a href="#">Business</a></li>
                                <li><a href="#">API</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Safety</a></li>
                                <li><a href="#">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="footer-flag">
                            🇺🇬 <span>Made with pride in Uganda</span>
                        </div>
                        <span>© 2026 Erands Guy Limited. All rights reserved.</span>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</a>
                            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms</a>
                            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
