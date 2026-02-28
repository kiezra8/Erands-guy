import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import LiveMap from '../components/LiveMap'
import '../App.css'

const KAMPALA = { lat: -0.3476, lng: 32.5825 }

// Estimate price
function estimatePrice(vehicle, distance) {
    if (!distance) return 0
    const base = vehicle === 'boda' ? 3000 : 10000
    const perKm = vehicle === 'boda' ? 500 : 1500
    return base + Math.round(distance * perKm)
}

const POPULAR_PLACES = [
    'Nakasero Market', 'Owino Market', 'Garden City Mall', 'Acacia Mall', 'Ntinda',
    'Bukoto', 'Kololo', 'Muyenga', 'Kisaasi', 'Wandegeya', 'Makerere University',
    'Entebbe Road', 'Jinja Road', 'Old Kampala', 'Katwe',
]

export default function BookDelivery() {
    const navigate = useNavigate()
    const [vehicle, setVehicle] = useState('boda')
    const [pickup, setPickup] = useState('')
    const [dropoff, setDropoff] = useState('')
    const [parcelType, setParcelType] = useState('documents')
    const [mapPickup, setMapPickup] = useState([KAMPALA.lat + 0.01, KAMPALA.lng - 0.01])
    const [mapDropoff, setMapDropoff] = useState([KAMPALA.lat - 0.01, KAMPALA.lng + 0.015])
    const [step, setStep] = useState(1) // 1 = form, 2 = confirm

    const distance = 4.2 // simulated
    const price = estimatePrice(vehicle, distance)
    const formatted = `UGX ${price.toLocaleString()}`

    const handleBooking = (e) => {
        e.preventDefault()
        if (step === 1) { setStep(2); return }
        navigate('/track/eg-new')
    }

    return (
        <div>
            <Navbar />
            <div className="dashboard">
                <Sidebar role="customer" userName="Sarah K." userRole="Customer" />
                <main className="main-content">
                    <div className="page-header">
                        <div>
                            <h1>Book a Delivery 📦</h1>
                            <p>Fill in the details and we'll find you the perfect rider.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[1, 2].map(s => (
                                <div key={s} style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: step >= s ? 'var(--primary)' : 'var(--bg-card)',
                                    border: step >= s ? 'none' : '1px solid var(--bg-glass-border)',
                                    color: step >= s ? '#000' : 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '0.85rem'
                                }}>{s}</div>
                            ))}
                        </div>
                    </div>

                    <div className="book-layout">
                        {/* Form */}
                        <div className="book-form-panel">
                            {step === 1 ? (
                                <>
                                    <h2>Delivery Details</h2>
                                    <p>Tell us where to pick up and where to deliver</p>

                                    {/* Vehicle selector */}
                                    <div className="form-group">
                                        <label>Vehicle Type</label>
                                        <div className="vehicle-selector">
                                            <button
                                                type="button"
                                                className={`vehicle-option ${vehicle === 'boda' ? 'selected' : ''}`}
                                                onClick={() => setVehicle('boda')}
                                                id="vehicle-boda"
                                            >
                                                <span className="vo-emoji">🏍️</span>
                                                <div className="vo-name">Boda Boda</div>
                                                <div className="vo-price">From UGX 3,000</div>
                                            </button>
                                            <button
                                                type="button"
                                                className={`vehicle-option ${vehicle === 'car' ? 'selected' : ''}`}
                                                onClick={() => setVehicle('car')}
                                                id="vehicle-car"
                                            >
                                                <span className="vo-emoji">🚗</span>
                                                <div className="vo-name">Courier Car</div>
                                                <div className="vo-price">From UGX 10,000</div>
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleBooking}>
                                        <div className="form-group">
                                            <label>📍 Pickup Location</label>
                                            <input
                                                className="input"
                                                id="pickup-input"
                                                placeholder="e.g. Nakasero Market, Kampala"
                                                value={pickup}
                                                onChange={e => setPickup(e.target.value)}
                                                list="places-list"
                                                required
                                            />
                                            <datalist id="places-list">
                                                {POPULAR_PLACES.map(p => <option key={p} value={p} />)}
                                            </datalist>
                                        </div>

                                        <div className="form-group">
                                            <label>🏁 Drop-off Location</label>
                                            <input
                                                className="input"
                                                id="dropoff-input"
                                                placeholder="e.g. Ntinda, Kampala"
                                                value={dropoff}
                                                onChange={e => setDropoff(e.target.value)}
                                                list="places-list"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>📦 Parcel Type</label>
                                            <select
                                                className="input"
                                                id="parcel-type"
                                                value={parcelType}
                                                onChange={e => setParcelType(e.target.value)}
                                            >
                                                <option value="documents">📄 Documents</option>
                                                <option value="food">🍱 Food / Groceries</option>
                                                <option value="electronics">💻 Electronics</option>
                                                <option value="clothing">👕 Clothing</option>
                                                <option value="medicine">💊 Medicine</option>
                                                <option value="other">📦 Other</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>📝 Special Instructions (optional)</label>
                                            <input
                                                className="input"
                                                id="instructions-input"
                                                placeholder="Handle with care, call on arrival..."
                                            />
                                        </div>

                                        {/* Price estimate */}
                                        <div className="price-estimate">
                                            <div>
                                                <div className="est-label">Estimated Price</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                    {distance} km · {vehicle === 'boda' ? 'Boda Boda' : 'Courier Car'}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="est-price">{formatted}</span>
                                                <span className="est-currency">UGX</span>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px' }}
                                            id="continue-btn"
                                        >
                                            Continue to Confirm →
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <h2>Confirm Booking</h2>
                                    <p>Review your delivery details before placing the order</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                                        {[
                                            { label: 'Vehicle', value: vehicle === 'boda' ? '🏍️ Boda Boda' : '🚗 Courier Car' },
                                            { label: 'Pickup', value: pickup || 'Nakasero Market' },
                                            { label: 'Drop-off', value: dropoff || 'Ntinda Village' },
                                            { label: 'Parcel', value: parcelType },
                                            { label: 'Distance', value: `${distance} km` },
                                            { label: 'Payment', value: 'MTN Mobile Money' },
                                        ].map(item => (
                                            <div key={item.label} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '12px 0', borderBottom: '1px solid var(--bg-glass-border)',
                                                fontSize: '0.92rem'
                                            }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                                                <span style={{ fontWeight: 600 }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="price-estimate" style={{ marginBottom: 24 }}>
                                        <div>
                                            <div className="est-label">Total to Pay</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Inclusive of all fees</div>
                                        </div>
                                        <span className="est-price">{formatted}</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
                                            onClick={() => setStep(1)}
                                            id="back-btn"
                                        >
                                            ← Edit
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            style={{ flex: 2, justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
                                            onClick={handleBooking}
                                            id="confirm-btn"
                                        >
                                            ✓ Confirm & Pay
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Map */}
                        <div className="book-map-panel">
                            <div className="map-panel-header" style={{ top: 16, left: 16, right: 16, zIndex: 500, display: 'flex', justifyContent: 'space-between', position: 'absolute' }}>
                                <div className="map-overlay-card">
                                    🗺️ Click map to set points
                                </div>
                            </div>
                            <LiveMap
                                center={[KAMPALA.lat, KAMPALA.lng]}
                                zoom={13}
                                riderPosition={mapPickup}
                                customerPosition={mapDropoff}
                                showRoute={true}
                                height="100%"
                                onMapClick={(latlng) => {
                                    if (!pickup) {
                                        setMapPickup([latlng.lat, latlng.lng])
                                    } else {
                                        setMapDropoff([latlng.lat, latlng.lng])
                                    }
                                }}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
