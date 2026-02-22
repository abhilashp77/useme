import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Stars from '../components/Stars';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashData, setDashData] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [driverFilter, setDriverFilter] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/login'); return; }
        loadData();
    }, [user]);

    const loadData = async () => {
        try {
            const [dash, drvs, users, pays] = await Promise.all([
                api.getAdminDashboard(),
                api.getAdminDrivers(),
                api.getAdminUsers(),
                api.getAdminPayments(),
            ]);
            setDashData(dash);
            setDrivers(drvs);
            setAllUsers(users);
            setPayments(pays);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleValidateDriver = async (id, action) => {
        try {
            await api.validateDriver(id, action);
            const drvs = await api.getAdminDrivers();
            setDrivers(drvs);
            const dash = await api.getAdminDashboard();
            setDashData(dash);
        } catch (err) { console.error(err); }
    };

    const handleToggleBlock = async (id) => {
        try {
            await api.toggleBlockUser(id);
            const users = await api.getAdminUsers();
            setAllUsers(users);
        } catch (err) { console.error(err); }
    };

    const filteredDrivers = driverFilter
        ? drivers.filter(d => d.validationStatus === driverFilter)
        : drivers;

    if (loading) return <div className="loading-spinner"></div>;
    if (!dashData) return null;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ padding: '0 var(--space-lg) var(--space-lg)', borderBottom: '1px solid var(--border-primary)', marginBottom: 'var(--space-md)' }}>
                    <div className="user-avatar" style={{ width: 48, height: 48, fontSize: 'var(--font-size-lg)', margin: '0 auto var(--space-sm)' }}>
                        AD
                    </div>
                    <p style={{ textAlign: 'center', fontWeight: 600 }}>Admin Panel</p>
                    <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>UseMe Management</p>
                </div>

                <div className="sidebar-section-title">Management</div>
                <ul className="sidebar-nav">
                    <li><a href="#" className={activeTab === 'overview' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>
                        <span className="nav-icon">📊</span> Dashboard
                    </a></li>
                    <li><a href="#" className={activeTab === 'drivers' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('drivers'); }}>
                        <span className="nav-icon">🚗</span> Driver Validation
                        {dashData.pendingDrivers > 0 && <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>{dashData.pendingDrivers}</span>}
                    </a></li>
                    <li><a href="#" className={activeTab === 'users' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('users'); }}>
                        <span className="nav-icon">👥</span> User Management
                    </a></li>
                    <li><a href="#" className={activeTab === 'payments' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('payments'); }}>
                        <span className="nav-icon">💳</span> Payments
                    </a></li>
                    <li><a href="#" className={activeTab === 'analytics' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('analytics'); }}>
                        <span className="nav-icon">📈</span> Analytics
                    </a></li>
                </ul>
            </aside>

            {/* Main */}
            <main className="dashboard-main">
                {activeTab === 'overview' && (
                    <>
                        <div className="page-header">
                            <h1>Admin <span className="gradient-text">Dashboard</span></h1>
                            <p>Platform overview and key metrics</p>
                        </div>

                        <div className="kpi-grid">
                            <div className="kpi-card">
                                <div className="kpi-icon">🚗</div>
                                <div className="kpi-value">{dashData.totalDrivers}</div>
                                <div className="kpi-label">Total Drivers</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">✅</div>
                                <div className="kpi-value">{dashData.validatedDrivers}</div>
                                <div className="kpi-label">Verified Drivers</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">⏳</div>
                                <div className="kpi-value">{dashData.pendingDrivers}</div>
                                <div className="kpi-label">Pending Approval</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">👥</div>
                                <div className="kpi-value">{dashData.totalCustomers}</div>
                                <div className="kpi-label">Total Customers</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">📋</div>
                                <div className="kpi-value">{dashData.totalBookings}</div>
                                <div className="kpi-label">Total Bookings</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">🟢</div>
                                <div className="kpi-value">{dashData.activeBookings}</div>
                                <div className="kpi-label">Active Bookings</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">💰</div>
                                <div className="kpi-value">${dashData.totalRevenue.toLocaleString()}</div>
                                <div className="kpi-label">Total Revenue</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">🏦</div>
                                <div className="kpi-value">${dashData.platformEarnings.toLocaleString()}</div>
                                <div className="kpi-label">Platform Earnings</div>
                            </div>
                        </div>

                        {/* Recent Bookings */}
                        <h2 style={{ fontSize: 'var(--font-size-xl)', margin: 'var(--space-xl) 0 var(--space-md)' }}>Recent Bookings</h2>
                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Driver</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashData.recentBookings.map(b => (
                                        <tr key={b.id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{b.id}</td>
                                            <td>{b.customerName}</td>
                                            <td>{b.driverName}</td>
                                            <td><span className="badge badge-blue">{b.type}</span></td>
                                            <td style={{ fontWeight: 700 }}>${b.totalAmount}</td>
                                            <td>
                                                <span className={`badge ${b.status === 'completed' ? 'badge-green' : b.status === 'active' ? 'badge-blue' : b.status === 'pending' ? 'badge-amber' : 'badge-red'}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'drivers' && (
                    <>
                        <div className="page-header">
                            <h1>Driver <span className="gradient-text">Validation</span></h1>
                            <p>Review and approve driver applications</p>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
                            {['', 'pending', 'approved', 'rejected'].map(f => (
                                <button
                                    key={f}
                                    className={`btn ${driverFilter === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                    onClick={() => setDriverFilter(f)}
                                >
                                    {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                                    {' '}({f === '' ? drivers.length : drivers.filter(d => d.validationStatus === f).length})
                                </button>
                            ))}
                        </div>

                        {filteredDrivers.map(driver => (
                            <div key={driver.id} className="glass-card" style={{ marginBottom: 'var(--space-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                                        <div className="driver-avatar" style={{ width: 48, height: 48 }}>
                                            {driver.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>
                                                {driver.name}
                                                <span style={{ marginLeft: 'var(--space-sm)' }}>
                                                    <span className={`badge ${driver.validationStatus === 'approved' ? 'badge-green' : driver.validationStatus === 'pending' ? 'badge-amber' : 'badge-red'}`}>
                                                        {driver.validationStatus}
                                                    </span>
                                                </span>
                                            </h3>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                                                {driver.email} · {driver.phone} · {driver.vehicleType} · {driver.vehicleModel}
                                            </p>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 4 }}>
                                                📍 {driver.location} · {driver.experience} yrs exp · ${driver.hourlyRate}/hr
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        {/* Documents */}
                                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                                            <span className={`badge ${driver.documents.license.verified ? 'badge-green' : driver.documents.license.uploaded ? 'badge-amber' : 'badge-red'}`}>
                                                🪪 License {driver.documents.license.verified ? '✓' : driver.documents.license.uploaded ? '⏳' : '✕'}
                                            </span>
                                            <span className={`badge ${driver.documents.insurance.verified ? 'badge-green' : driver.documents.insurance.uploaded ? 'badge-amber' : 'badge-red'}`}>
                                                📋 Insurance {driver.documents.insurance.verified ? '✓' : driver.documents.insurance.uploaded ? '⏳' : '✕'}
                                            </span>
                                            <span className={`badge ${driver.documents.backgroundCheck.verified ? 'badge-green' : driver.documents.backgroundCheck.uploaded ? 'badge-amber' : 'badge-red'}`}>
                                                🔍 Background {driver.documents.backgroundCheck.verified ? '✓' : driver.documents.backgroundCheck.uploaded ? '⏳' : '✕'}
                                            </span>
                                        </div>

                                        {driver.validationStatus === 'pending' && (
                                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                                <button className="btn btn-green btn-sm" onClick={() => handleValidateDriver(driver.id, 'approve')}>✓ Approve</button>
                                                <button className="btn btn-red btn-sm" onClick={() => handleValidateDriver(driver.id, 'reject')}>✕ Reject</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'users' && (
                    <>
                        <div className="page-header">
                            <h1>User <span className="gradient-text">Management</span></h1>
                            <p>Manage customer and driver accounts</p>
                        </div>

                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.filter(u => u.role !== 'admin').map(u => (
                                        <tr key={u.id}>
                                            <td style={{ fontWeight: 600 }}>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td><span className={`badge ${u.role === 'driver' ? 'badge-blue' : 'badge-purple'}`}>{u.role}</span></td>
                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td>{u.blocked ? <span className="badge badge-red">Blocked</span> : <span className="badge badge-green">Active</span>}</td>
                                            <td>
                                                <button
                                                    className={`btn ${u.blocked ? 'btn-green' : 'btn-red'} btn-sm`}
                                                    onClick={() => handleToggleBlock(u.id)}
                                                >
                                                    {u.blocked ? 'Unblock' : 'Block'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'payments' && (
                    <>
                        <div className="page-header">
                            <h1>Payment <span className="gradient-text">Oversight</span></h1>
                            <p>View transaction history and earnings</p>
                        </div>

                        <div className="kpi-grid" style={{ marginBottom: 'var(--space-xl)' }}>
                            <div className="kpi-card">
                                <div className="kpi-icon">💰</div>
                                <div className="kpi-value">${dashData.totalRevenue.toLocaleString()}</div>
                                <div className="kpi-label">Total Revenue</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">🏦</div>
                                <div className="kpi-value">${dashData.platformEarnings.toLocaleString()}</div>
                                <div className="kpi-label">Platform Earnings (10%)</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">💸</div>
                                <div className="kpi-value">${(dashData.totalRevenue - dashData.platformEarnings).toLocaleString()}</div>
                                <div className="kpi-label">Driver Payouts</div>
                            </div>
                        </div>

                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Booking</th>
                                        <th>Amount</th>
                                        <th>Platform Fee</th>
                                        <th>Driver Earnings</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(p => (
                                        <tr key={p.id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{p.id}</td>
                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                            <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{p.bookingId}</td>
                                            <td style={{ fontWeight: 700 }}>${p.amount}</td>
                                            <td>${p.platformFee.toFixed(2)}</td>
                                            <td style={{ color: 'var(--accent-green-light)' }}>${p.driverEarnings.toFixed(2)}</td>
                                            <td><span className="badge badge-blue">{p.method}</span></td>
                                            <td><span className="badge badge-green">{p.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'analytics' && (
                    <>
                        <div className="page-header">
                            <h1>Analytics & <span className="gradient-text">Reporting</span></h1>
                            <p>Performance insights and platform metrics</p>
                        </div>

                        <div className="kpi-grid" style={{ marginBottom: 'var(--space-xl)' }}>
                            <div className="kpi-card">
                                <div className="kpi-icon">⭐</div>
                                <div className="kpi-value">{dashData.avgRating}</div>
                                <div className="kpi-label">Avg Driver Rating</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">✅</div>
                                <div className="kpi-value">{dashData.completedBookings}</div>
                                <div className="kpi-label">Completed Trips</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">📊</div>
                                <div className="kpi-value">
                                    {dashData.totalBookings > 0 ? ((dashData.completedBookings / dashData.totalBookings) * 100).toFixed(0) : 0}%
                                </div>
                                <div className="kpi-label">Completion Rate</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">💵</div>
                                <div className="kpi-value">
                                    ${dashData.totalBookings > 0 ? (dashData.totalRevenue / dashData.totalBookings).toFixed(0) : 0}
                                </div>
                                <div className="kpi-label">Avg Booking Value</div>
                            </div>
                        </div>

                        {/* Performance Summary */}
                        <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ marginBottom: 'var(--space-md)' }}>Platform Summary</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
                                <div>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Driver Approval Rate</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                                        <div style={{ flex: 1, height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{ width: `${dashData.totalDrivers > 0 ? (dashData.validatedDrivers / dashData.totalDrivers * 100) : 0}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: 4 }}></div>
                                        </div>
                                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>
                                            {dashData.totalDrivers > 0 ? (dashData.validatedDrivers / dashData.totalDrivers * 100).toFixed(0) : 0}%
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Booking Completion</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                                        <div style={{ flex: 1, height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{ width: `${dashData.totalBookings > 0 ? (dashData.completedBookings / dashData.totalBookings * 100) : 0}%`, height: '100%', background: 'var(--accent-green)', borderRadius: 4 }}></div>
                                        </div>
                                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>
                                            {dashData.totalBookings > 0 ? (dashData.completedBookings / dashData.totalBookings * 100).toFixed(0) : 0}%
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Revenue Efficiency</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                                        <div style={{ flex: 1, height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{ width: '90%', height: '100%', background: 'var(--accent-amber)', borderRadius: 4 }}></div>
                                        </div>
                                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>90%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Drivers */}
                        <div className="glass-card">
                            <h3 style={{ marginBottom: 'var(--space-md)' }}>Top Performing Drivers</h3>
                            <div className="table-wrapper" style={{ border: 'none' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Driver</th>
                                            <th>Rating</th>
                                            <th>Trips</th>
                                            <th>Earnings</th>
                                            <th>Vehicle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {drivers.filter(d => d.validated).sort((a, b) => b.rating - a.rating).slice(0, 5).map(d => (
                                            <tr key={d.id}>
                                                <td style={{ fontWeight: 600 }}>{d.name}</td>
                                                <td><Stars rating={Math.round(d.rating)} size={14} /> {d.rating}</td>
                                                <td>{d.totalTrips}</td>
                                                <td style={{ color: 'var(--accent-green-light)', fontWeight: 700 }}>${d.totalEarnings.toLocaleString()}</td>
                                                <td><span className="badge badge-blue">{d.vehicleType}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
