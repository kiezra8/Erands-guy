import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import LiveMap from '../components/LiveMap'
import '../App.css'

const KAMPALA = [-0.3476, 32.5825]
const RIDER_POS = [KAMPALA[0] + 0.008, KAMPALA[1] - 0.01]
const CUSTOMER_POS = [KAMPALA[0] - 0.005, KAMPALA[1] + 0.012]

const STATS = [
    { val: '24', label: 'Total deliveries', change: '+3 today' },
    { val: '1', label: 'Active orders', change: 'In transit' },
    { val: 'UGX 87K', label: 'Total spent', change: 'This month' },
    { val: '4.9 ★', label: 'Avg rider rating', change: 'Excellent' },
]

const ORDERS = [
    { id: 'EG-001', icon: '🏍️', route: 'Nakasero Market → Ntinda', status: 'In Transit', price: 'UGX 5,500', time: '12 min ago', color: '#F5A623' },
    { id: 'EG-002', icon: '🚗', route: 'Entebbe Road → Kololo Hill', status: 'Delivered', price: 'UGX 18,000', time: '1 hr ago', color: '#06C167' },
    { id: 'EG-003', icon: '🏍️', route: 'Owino Market → Bukoto', status: 'Delivered', price: 'UGX 4,000', time: 'Yesterday', color: '#06C167' },
    { id: 'EG-004', icon: '🚗', route: 'Garden City → Muyenga', status: 'Cancelled', price: 'UGX 0', time: '2 days ago', color: '#E53935' },
]

export default function CustomerDashboard() {
    const navigate = useNavigate()
    const [filter, setFilter] = useState('all')

    return (
        <div className="app-shell">
            <Sidebar role="customer" userName="Sarah K." userRole="Customer" />

            <div className="app-main">
                {/* Top bar */}
                <div className="app-topbar">
                    <div>
                        <span className="topbar-title">Good morning, Sarah 👋</span>
                    </div>
                    <div className="topbar-right">
                        <div className="chip chip-green">
                            <div className="live-dot" />
                            1 active order
                        </div>
                        <button className="btn btn-brand btn-sm" onClick={() => navigate('/book')}>
                            + New delivery
                        </button>
                    </div>
                </div>

                {/* Full-height map in background */}
                <div className="dashboard-map" style={{ top: 60 }}>
                    <LiveMap
                        center={KAMPALA}
                        zoom={14}
                        riderPosition={RIDER_POS}
                        customerPosition={CUSTOMER_POS}
                        showRoute
                        height="100%"
                    />
                </div>

                {/* Top-right status chip */}
                <div className="panel-topright" style={{ top: 76 }}>
                    <div className="live-dot-ring"><div className="live-dot" /></div>
                    <span>EG-001 · Patrick O. · 8 min</span>
                </div>

                {/* Left floating panel */}
                <div className="panel panel-left" style={{ top: 76 }}>

                    {/* Stats */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                    }}>
                        {STATS.map(s => (
                            <div key={s.label} style={{
                                background: 'var(--gray-800)', borderRadius: 'var(--r-lg)',
                                padding: '14px 14px', border: '1px solid var(--border)'
                            }}>
                                <div style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1 }}>{s.val}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--brand)', fontWeight: 700, marginTop: 4 }}>{s.change}</div>
                            </div>
                        ))}
                    </div>

                    <div className="divider" />

                    {/* Orders heading + filter */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <span className="sub-heading">Recent orders</span>
                            <div style={{ display: 'flex', gap: 4 }}>
                                {['all', 'active', 'done'].map(f => (
                                    <button
                                        key={f}
                                        className="btn btn-ghost"
                                        style={{
                                            fontSize: '0.7rem', padding: '4px 10px', borderRadius: 'var(--r-full)',
                                            ...(filter === f ? { background: 'var(--brand-dim)', color: 'var(--brand)' } : {})
                                        }}
                                        onClick={() => setFilter(f)}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {ORDERS.map(o => (
                                <div className="order-row" key={o.id} onClick={() => navigate('/track/eg-001')}>
                                    <div className="order-icon">{o.icon}</div>
                                    <div className="order-body">
                                        <h4>{o.route}</h4>
                                        <p>#{o.id}</p>
                                    </div>
                                    <div className="order-right">
                                        <div className="order-price">{o.price}</div>
                                        <div style={{
                                            fontSize: '0.68rem', fontWeight: 700, color: o.color,
                                            marginTop: 4
                                        }}>{o.status}</div>
                                        <div className="order-time">{o.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Track full button */}
                    <button
                        className="btn btn-brand"
                        style={{ width: '100%', padding: '14px', fontSize: '0.9rem' }}
                        onClick={() => navigate('/track/eg-001')}
                    >
                        📡 Open live tracker
                    </button>
                </div>
            </div>
        </div>
    )
}
