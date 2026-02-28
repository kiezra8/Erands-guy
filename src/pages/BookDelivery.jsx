import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LiveMap from '../components/LiveMap'
import '../App.css'

const KAMPALA = [-0.3476, 32.5825]

const PLACES = [
    'Nakasero Market', 'Owino Market', 'Garden City Mall', 'Acacia Mall', 'Ntinda',
    'Bukoto', 'Kololo', 'Muyenga', 'Kisaasi', 'Wandegeya', 'Makerere University',
    'Entebbe Road', 'Jinja Road', 'Old Kampala', 'Katwe', 'Kabalagala', 'Munyonyo',
]

const VEHICLE_OPTS = [
    { id: 'boda', emoji: '🏍️', label: 'Boda Boda', sub: 'Small & fast' },
    { id: 'car', emoji: '🚗', label: 'Courier Car', sub: 'Medium load' },
    { id: 'pickup', emoji: '🛻', label: 'Pickup Truck', sub: 'Bulk load' },
    { id: 'bigcar', emoji: '🚛', label: 'Big Truck', sub: 'Heavy cargo' },
]

const PARCEL_TYPES = [
    { val: 'documents', label: '📄 Documents' },
    { val: 'food', label: '🍱 Food / Groceries' },
    { val: 'electronics', label: '💻 Electronics' },
    { val: 'clothing', label: '👕 Clothing' },
    { val: 'medicine', label: '💊 Medicine' },
    { val: 'furniture', label: '🛋️ Furniture' },
    { val: 'other', label: '📦 Other' },
]

// Try to get the user's real GPS position
function useGeolocation() {
    const [pos, setPos] = useState(null)
    useEffect(() => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition(
            p => setPos([p.coords.latitude, p.coords.longitude]),
            () => setPos(KAMPALA) // fallback to Kampala centre
        )
    }, [])
    return pos || KAMPALA
}

export default function BookDelivery() {
    const navigate = useNavigate()
    const userPos = useGeolocation()

    const [vehicle, setVehicle] = useState('boda')
    const [pickup, setPickup] = useState('')
    const [dropoff, setDropoff] = useState('')
    const [parcel, setParcel] = useState('documents')
    const [phone, setPhone] = useState('')
    const [note, setNote] = useState('')
    const [step, setStep] = useState(1) // 1=details, 2=confirm

    const pickupPos = [userPos[0] + 0.008, userPos[1] - 0.008]
    const dropoffPos = [userPos[0] - 0.010, userPos[1] + 0.012]

    const handleConfirm = () => {
        // Generate a simple order ID and go straight to tracking
        const orderId = 'EG-' + Math.floor(Math.random() * 9000 + 1000)
        navigate(`/track/${orderId}`)
    }

    return (
        <div className="book-fullpage">
            {/* ── TOP BAR ── */}
            <div className="book-topbar">
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => step === 2 ? setStep(1) : navigate('/')}
                    style={{ gap: 6 }}
                >
                    ← {step === 2 ? 'Edit' : 'Back'}
                </button>
                <div className="book-topbar-title">
                    {step === 1 ? 'Route & parcel details' : 'Confirm order'}
                </div>
                {/* Step indicator */}
                <div className="step-dots" style={{ marginRight: 4 }}>
                    {[1, 2].map(s => (
                        <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />
                    ))}
                </div>
            </div>

            {/* ── CONTENT ── */}
            <div className="book-body">
                {/* LEFT — Map (full height) */}
                <div className="book-map-col">
                    <LiveMap
                        center={userPos}
                        zoom={13}
                        riderPosition={pickupPos}
                        customerPosition={dropoffPos}
                        showRoute
                        height="100%"
                    />
                    {/* GPS live badge */}
                    <div className="book-gps-badge">
                        <div className="live-dot" />
                        <span>GPS active</span>
                    </div>
                </div>

                {/* RIGHT — Form */}
                <div className="book-form-col">
                    {step === 1 ? (
                        <>
                            {/* Vehicle chips */}
                            <div className="bform-section">
                                <div className="bform-label">Vehicle type</div>
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

                            {/* Route */}
                            <div className="bform-section">
                                <div className="bform-label">Route</div>
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
                            <div className="bform-section">
                                <div className="bform-label">What are you sending?</div>
                                <div className="parcel-chips">
                                    {PARCEL_TYPES.map(p => (
                                        <button
                                            key={p.val}
                                            type="button"
                                            className={`parcel-chip ${parcel === p.val ? 'selected' : ''}`}
                                            onClick={() => setParcel(p.val)}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Phone number */}
                            <div className="bform-section">
                                <div className="bform-label">Your phone number</div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span style={{
                                        padding: '0 14px', height: 48, display: 'flex', alignItems: 'center',
                                        background: 'var(--surface)', border: '1px solid var(--border)',
                                        borderRadius: 'var(--r-lg)', fontSize: '0.9rem', fontWeight: 700,
                                        color: 'var(--text-2)', flexShrink: 0
                                    }}>🇺🇬 +256</span>
                                    <input
                                        className="input"
                                        id="phone-input"
                                        type="tel"
                                        placeholder="7XX XXX XXX"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 6 }}>
                                    We'll call or SMS you when your rider is assigned.
                                </p>
                            </div>

                            <div className="bform-section">
                                <div className="bform-label">Special instructions <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></div>
                                <input
                                    className="input"
                                    id="note-input"
                                    placeholder="e.g. Handle with care, call on arrival"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </div>
                        </>
                    ) : (
                        /* Step 2 — Confirm */
                        <>
                            <div className="bform-section">
                                <div className="bform-label">Order summary</div>
                                <div className="confirm-card">
                                    {[
                                        { label: 'Vehicle', val: VEHICLE_OPTS.find(v => v.id === vehicle)?.emoji + ' ' + VEHICLE_OPTS.find(v => v.id === vehicle)?.label },
                                        { label: 'Pickup', val: pickup || 'Nakasero Market' },
                                        { label: 'Dropoff', val: dropoff || 'Ntinda' },
                                        { label: 'Phone', val: phone ? `+256 ${phone}` : 'Not provided' },
                                        { label: 'Parcel', val: PARCEL_TYPES.find(p => p.val === parcel)?.label },
                                        { label: 'Payment', val: 'MTN / Airtel Mobile Money' },
                                    ].map(row => (
                                        <div className="confirm-row" key={row.label}>
                                            <span className="cr-label">{row.label}</span>
                                            <span className="cr-val">{row.val}</span>
                                        </div>
                                    ))}
                                    {note && (
                                        <div className="confirm-row">
                                            <span className="cr-label">Note</span>
                                            <span className="cr-val">{note}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bform-info">
                                🏍️ A rider will be assigned within <strong>60 seconds</strong> of confirmation. You'll track them live on the map.
                            </div>
                        </>
                    )}

                    {/* CTA button — always visible at bottom */}
                    <div className="book-form-cta">
                        {step === 1 ? (
                            <button
                                className="btn btn-brand"
                                id="continue-btn"
                                style={{ width: '100%', padding: '18px', fontSize: '1.05rem' }}
                                onClick={() => setStep(2)}
                            >
                                Continue →
                            </button>
                        ) : (
                            <button
                                className="btn btn-brand"
                                id="confirm-btn"
                                style={{ width: '100%', padding: '18px', fontSize: '1.05rem', background: '#06C167' }}
                                onClick={handleConfirm}
                            >
                                ✅ Confirm — track my order
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
