import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LiveMap from '../components/LiveMap'
import '../App.css'

const KAMPALA = [-0.3476, 32.5825]

const PLACES = [
    'Nakasero Market', 'Owino Market', 'Garden City Mall', 'Acacia Mall', 'Ntinda',
    'Bukoto', 'Kololo', 'Muyenga', 'Kisaasi', 'Wandegeya', 'Makerere University',
    'Entebbe Road', 'Jinja Road', 'Old Kampala', 'Katwe',
]

function estPrice(vehicle, km) {
    const base = vehicle === 'boda' ? 3000 : 10000
    const rate = vehicle === 'boda' ? 500 : 1500
    return base + Math.round(km * rate)
}

const VEHICLE_OPTS = [
    { id: 'boda', emoji: '🏍️', label: 'Boda Boda', sub: 'UGX 5.5K' },
    { id: 'car', emoji: '🚗', label: 'Car', sub: 'UGX 16K' },
]

const PARCEL_TYPES = [
    { val: 'documents', label: '📄 Documents' },
    { val: 'food', label: '🍱 Food / Groceries' },
    { val: 'electronics', label: '💻 Electronics' },
    { val: 'clothing', label: '👕 Clothing' },
    { val: 'medicine', label: '💊 Medicine' },
    { val: 'other', label: '📦 Other' },
]

export default function BookDelivery() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [vehicle, setVehicle] = useState('boda')
    const [pickup, setPickup] = useState('')
    const [dropoff, setDropoff] = useState('')
    const [parcel, setParcel] = useState('documents')
    const [note, setNote] = useState('')
    const [pickupPos] = useState([KAMPALA[0] + 0.01, KAMPALA[1] - 0.01])
    const [dropoffPos] = useState([KAMPALA[0] - 0.01, KAMPALA[1] + 0.015])

    const KM = 4.2
    const price = estPrice(vehicle, KM)
    const priceStr = `UGX ${price.toLocaleString()}`

    return (
        <div className="book-shell">
            {/* Map pane (left) */}
            <div className="book-map-pane">
                {/* tiny top-left back */}
                <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 500 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/customer')} style={{ gap: 6 }}>
                        ← Back
                    </button>
                </div>
                <LiveMap
                    center={KAMPALA}
                    zoom={13}
                    riderPosition={pickupPos}
                    customerPosition={dropoffPos}
                    showRoute
                    height="100%"
                />
                {/* Map legend */}
                <div style={{
                    position: 'absolute', bottom: 20, left: 20,
                    display: 'flex', gap: 8, zIndex: 200
                }}>
                    <div style={{
                        background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)',
                        border: '1px solid var(--border-strong)', borderRadius: 'var(--r-xl)',
                        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 700
                    }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand)' }} />
                        Pickup point
                    </div>
                    <div style={{
                        background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)',
                        border: '1px solid var(--border-strong)', borderRadius: 'var(--r-xl)',
                        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 700
                    }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--red)' }} />
                        Dropoff
                    </div>
                </div>
            </div>

            {/* Form pane (right) */}
            <div className="book-form-pane">
                <div className="book-form-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <h1>Book delivery</h1>
                        {/* Step dots */}
                        <div className="step-dots">
                            {[1, 2].map(s => (
                                <div key={s} className={`step-dot ${step === s ? 'active' : (step > s ? 'active' : '')}`} />
                            ))}
                        </div>
                    </div>
                    <p>{step === 1 ? 'Enter route & parcel details' : 'Review and confirm your order'}</p>
                </div>

                <div className="book-form-body">
                    {step === 1 ? (
                        <>
                            {/* Vehicle selector */}
                            <div className="form-group">
                                <label className="form-label">Vehicle</label>
                                <div className="vehicle-chips">
                                    {VEHICLE_OPTS.map(v => (
                                        <button
                                            key={v.id}
                                            className={`vehicle-chip ${vehicle === v.id ? 'selected' : ''}`}
                                            onClick={() => setVehicle(v.id)}
                                            type="button"
                                            id={`vehicle-${v.id}`}
                                        >
                                            <span className="vc-emoji">{v.emoji}</span>
                                            <span className="vc-name">{v.label}</span>
                                            <span className="vc-price">{v.sub}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Route stack */}
                            <div className="form-group">
                                <label className="form-label">Route</label>
                                <div className="route-stack">
                                    <div className="route-input-row">
                                        <div className="route-dot pickup" />
                                        <input
                                            className="route-input"
                                            id="pickup-input"
                                            placeholder="Pickup location"
                                            value={pickup}
                                            onChange={e => setPickup(e.target.value)}
                                            list="places-list"
                                        />
                                    </div>
                                    <div className="route-divider" />
                                    <div className="route-input-row">
                                        <div className="route-dot dropoff" />
                                        <input
                                            className="route-input"
                                            id="dropoff-input"
                                            placeholder="Dropoff location"
                                            value={dropoff}
                                            onChange={e => setDropoff(e.target.value)}
                                            list="places-list"
                                        />
                                    </div>
                                </div>
                                <datalist id="places-list">
                                    {PLACES.map(p => <option key={p} value={p} />)}
                                </datalist>
                            </div>

                            {/* Parcel type */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="parcel-type">Parcel type</label>
                                <select
                                    className="input"
                                    id="parcel-type"
                                    value={parcel}
                                    onChange={e => setParcel(e.target.value)}
                                    style={{ appearance: 'none', cursor: 'pointer' }}
                                >
                                    {PARCEL_TYPES.map(p => (
                                        <option key={p.val} value={p.val}>{p.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Note */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="note-input">Instructions (optional)</label>
                                <input
                                    className="input"
                                    id="note-input"
                                    placeholder="E.g. Handle with care, call on arrival"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </div>
                        </>
                    ) : (
                        /* Step 2 — confirm */
                        <div>
                            {[
                                { label: 'Vehicle', val: vehicle === 'boda' ? '🏍️ Boda Boda' : '🚗 Courier Car' },
                                { label: 'Pickup', val: pickup || 'Nakasero Market' },
                                { label: 'Dropoff', val: dropoff || 'Ntinda Village' },
                                { label: 'Parcel', val: parcel },
                                { label: 'Distance', val: `${KM} km` },
                                { label: 'Payment', val: 'MTN Mobile Money' },
                            ].map(row => (
                                <div className="confirm-row" key={row.label}>
                                    <span className="cr-label">{row.label}</span>
                                    <span className="cr-val">{row.val}</span>
                                </div>
                            ))}

                            <div style={{
                                background: 'var(--brand-dim)', border: '1px solid rgba(6,193,103,0.25)',
                                borderRadius: 'var(--r-lg)', padding: '16px 20px', marginTop: 20,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                            }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: 600 }}>Total to pay</span>
                                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--brand)' }}>{priceStr}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Estimate bar always visible */}
                <div style={{ padding: '0 24px' }}>
                    <div className="estimate-card">
                        <div className="estimate-left">
                            <div className="est-label">Estimate</div>
                            <div className="est-dist">{KM} km · {vehicle === 'boda' ? 'Boda Boda' : 'Car'}</div>
                        </div>
                        <div className="estimate-price">{priceStr}</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="book-form-footer">
                    {step === 1 ? (
                        <button
                            className="btn btn-brand"
                            id="continue-btn"
                            style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
                            onClick={() => setStep(2)}
                        >
                            Continue →
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                className="btn btn-ghost"
                                id="back-btn"
                                style={{ flex: 1, padding: '14px', justifyContent: 'center' }}
                                onClick={() => setStep(1)}
                            >
                                ← Edit
                            </button>
                            <button
                                className="btn btn-brand"
                                id="confirm-btn"
                                style={{ flex: 2, padding: '14px', justifyContent: 'center', fontSize: '1rem' }}
                                onClick={() => navigate('/track/eg-new')}
                            >
                                Confirm & pay
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
