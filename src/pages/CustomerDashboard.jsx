import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import LiveMap from '../components/LiveMap'
import '../App.css'

// Kampala coordinates
const KAMPALA = { lat: -0.3476, lng: 32.5825 }

const MOCK_ORDERS = [
    { id: 'EG-001', vehicle: '🏍️', from: 'Nakasero Market', to: 'Ntinda', status: 'In Transit', price: 'UGX 5,500', time: '12 min ago', statusColor: '#F59E0B' },
    { id: 'EG-002', vehicle: '🚗', from: 'Entebbe Road', to: 'Kololo Hill', status: 'Delivered', price: 'UGX 18,000', time: '1 hr ago', statusColor: '#00E5A0' },
    { id: 'EG-003', vehicle: '🏍️', from: 'Owino Market', to: 'Bukoto', status: 'Delivered', price: 'UGX 4,000', time: 'Yesterday', statusColor: '#00E5A0' },
    { id: 'EG-004', vehicle: '🚗', from: 'Garden City', to: 'Muyenga', status: 'Cancelled', price: 'UGX 0', time: '2 days ago', statusColor: '#EF4444' },
]

export default function CustomerDashboard() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('overview')

    // Simulate live rider near Kampala centre
    const riderPos = [KAMPALA.lat + 0.008, KAMPALA.lng - 0.01]
    const customerPos = [KAMPALA.lat - 0.005, KAMPALA.lng + 0.012]

    return (
        <div>
            <Navbar />
            <div className="dashboard">
                <Sidebar role="customer" userName="Sarah K." userRole="Customer" />
                <main className="main-content">
                    {/* Header */}
                    <div className="page-header">
                        <div>
                            <h1>Good morning, Sarah 👋</h1>
                            <p>Here's what's happening with your deliveries today</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/book')}>
                            + New Delivery
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon icon-green">📦</div>
                                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>+12%</span>
                            </div>
                            <h2>24</h2>
                            <p>Total Deliveries</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon icon-amber">🚀</div>
                                <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Live</span>
                            </div>
                            <h2>1</h2>
                            <p>Active Orders</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon icon-purple">💳</div>
                            </div>
                            <h2>UGX 87K</h2>
                            <p>Total Spent</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon icon-green">⭐</div>
                            </div>
                            <h2>4.9</h2>
                            <p>Avg Rider Rating</p>
                        </div>
                    </div>

                    {/* Live Map */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📍 Live Tracking</h2>
                            <button
                                className="btn btn-ghost"
                                style={{ fontSize: '0.82rem' }}
                                onClick={() => navigate('/track/eg-001')}
                            >
                                Full View →
                            </button>
                        </div>
                        <div className="map-panel">
                            <div className="map-panel-header">
                                <div className="map-overlay-card">
                                    <span className="pulse-dot" />
                                    EG-001 · In Transit
                                </div>
                                <div className="map-overlay-card">
                                    🏍️ Patrick · 8 min away
                                </div>
                            </div>
                            <LiveMap
                                center={[KAMPALA.lat, KAMPALA.lng]}
                                zoom={14}
                                riderPosition={riderPos}
                                customerPosition={customerPos}
                                showRoute={true}
                                height="430px"
                            />
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Orders</h2>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {['overview', 'in-transit', 'delivered'].map(t => (
                                    <button
                                        key={t}
                                        className={`btn btn-ghost ${activeTab === t ? 'active' : ''}`}
                                        style={{
                                            fontSize: '0.78rem', padding: '6px 14px',
                                            ...(activeTab === t ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : {})
                                        }}
                                        onClick={() => setActiveTab(t)}
                                    >
                                        {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="orders-list">
                            {MOCK_ORDERS.map(order => (
                                <div
                                    className="order-item"
                                    key={order.id}
                                    onClick={() => navigate('/track/eg-001')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="order-vehicle-icon">{order.vehicle}</div>
                                    <div className="order-info">
                                        <h4>{order.from} → {order.to}</h4>
                                        <p>Order #{order.id}</p>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{
                                            background: `${order.statusColor}15`,
                                            color: order.statusColor,
                                            border: `1px solid ${order.statusColor}30`,
                                            borderRadius: '99px',
                                            padding: '4px 12px',
                                            fontSize: '0.78rem',
                                            fontWeight: 600,
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="order-meta">
                                        <div className="price">{order.price}</div>
                                        <div className="time">{order.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
