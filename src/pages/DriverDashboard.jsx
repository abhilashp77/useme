import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Stars from '../components/Stars';

export default function DriverDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!user || user.role !== 'driver') { navigate('/login'); return; }
        api.getDriverDashboard()
            .then(setDashData)
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [user]);

    const handleAcceptBooking = async (id) => {
        try {
            await api.updateBookingStatus(id, 'active');
            const data = await api.getDriverDashboard();
            setDashData(data);
        } catch (err) { console.error(err); }
    };

    const handleCompleteBooking = async (id) => {
        try {
            await api.completeBooking(id);
            const data = await api.getDriverDashboard();
            setDashData(data);
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="loading-spinner"></div>;
    if (!dashData) return null;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ padding: '0 var(--space-lg) var(--space-lg)', borderBottom: '1px solid var(--border-primary)', marginBottom: 'var(--space-md)' }}>
                    <div className="user-avatar" style={{ width: 48, height: 48, fontSize: 'var(--font-size-lg)', margin: '0 auto var(--space-sm)' }}>
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <p style={{ textAlign: 'center', fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Driver</p>
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-sm)' }}>
                        {dashData.validationStatus === 'approved' ? (
                            <span className="badge badge-green">Verified ✓</span>
                        ) : dashData.validationStatus === 'pending' ? (
                            <span className="badge badge-amber">Pending Review</span>
                        ) : (
                            <span className="badge badge-red">Rejected</span>
                        )}
                    </div>
                </div>

                <div className="sidebar-section-title">Menu</div>
                <ul className="sidebar-nav">
                    <li><a href="#" className={activeTab === 'overview' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>
                        <span className="nav-icon">📊</span> Overview
                    </a></li>
                    <li><a href="#" className={activeTab === 'bookings' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('bookings'); }}>
                        <span className="nav-icon">📋</span> My Bookings
                    </a></li>
                    <li><a href="#" className={activeTab === 'earnings' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('earnings'); }}>
                        <span className="nav-icon">💰</span> Earnings
                    </a></li>
                    <li><a href="#" className={activeTab === 'notifications' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('notifications'); }}>
                        <span className="nav-icon">🔔</span> Notifications
                        {dashData.notifications.filter(n => !n.read).length > 0 && (
                            <span className="badge badge-red" style={{ marginLeft: 'auto' }}>{dashData.notifications.filter(n => !n.read).length}</span>
                        )}
                    </a></li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {activeTab === 'overview' && (
                    <>
                        <div className="page-header">
                            <h1>Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span></h1>
                            <p>Here&apos;s your driver dashboard overview</p>
                        </div>

                        <div className="kpi-grid">
                            <div className="kpi-card">
                                <div className="kpi-icon">🚗</div>
                                <div className="kpi-value">{dashData.totalTrips}</div>
                                <div className="kpi-label">Total Trips</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">💰</div>
                                <div className="kpi-value">${dashData.totalEarnings.toLocaleString()}</div>
                                <div className="kpi-label">Total Earnings</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">⭐</div>
                                <div className="kpi-value">{dashData.rating || 'N/A'}</div>
                                <div className="kpi-label">Rating</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">📋</div>
                                <div className="kpi-value">{dashData.activeBookings.length}</div>
                                <div className="kpi-label">Active Bookings</div>
                            </div>
                        </div>

                        {/* Active Bookings */}
                        {dashData.activeBookings.length > 0 && (
                            <div style={{ marginTop: 'var(--space-xl)' }}>
                                <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-md)' }}>Active Bookings</h2>
                                {dashData.activeBookings.map(booking => (
                                    <div key={booking.id} className="booking-card">
                                        <div className="booking-details">
                                            <h3>
                                                {booking.customerName}
                                                <span style={{ marginLeft: 'var(--space-sm)' }}>
                                                    <span className={`badge ${booking.status === 'pending' ? 'badge-amber' : 'badge-blue'}`}>{booking.status}</span>
                                                </span>
                                            </h3>
                                            <div className="booking-meta">
                                                <span>📍 {booking.location}</span>
                                                <span>⏱️ {booking.duration} {booking.type === 'daily' ? 'day(s)' : 'hour(s)'}</span>
                                                <span>📅 {new Date(booking.startTime).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="booking-actions">
                                            <div className="booking-amount">${booking.totalAmount}</div>
                                            {booking.status === 'pending' && (
                                                <button className="btn btn-green btn-sm" onClick={() => handleAcceptBooking(booking.id)}>Accept</button>
                                            )}
                                            {booking.status === 'active' && (
                                                <button className="btn btn-primary btn-sm" onClick={() => handleCompleteBooking(booking.id)}>Complete</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Recent Notifications */}
                        {dashData.notifications.length > 0 && (
                            <div style={{ marginTop: 'var(--space-xl)' }}>
                                <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-md)' }}>Recent Notifications</h2>
                                {dashData.notifications.slice(0, 5).map(notif => (
                                    <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                        {!notif.read && <div className="notification-dot"></div>}
                                        <div className="notification-content">
                                            <h4>{notif.title}</h4>
                                            <p>{notif.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'bookings' && (
                    <>
                        <div className="page-header">
                            <h1>My <span className="gradient-text">Bookings</span></h1>
                            <p>View and manage your trip requests</p>
                        </div>
                        {[...dashData.activeBookings, ...dashData.completedBookings].length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <h3>No bookings yet</h3>
                                <p>You don&apos;t have any bookings. Make sure your profile is complete and you&apos;re set as available.</p>
                            </div>
                        ) : (
                            [...dashData.activeBookings, ...dashData.completedBookings].map(booking => (
                                <div key={booking.id} className="booking-card">
                                    <div className="booking-details">
                                        <h3>
                                            {booking.customerName}
                                            <span style={{ marginLeft: 'var(--space-sm)' }}>
                                                <span className={`badge ${booking.status === 'pending' ? 'badge-amber' : booking.status === 'active' ? 'badge-blue' : 'badge-green'}`}>{booking.status}</span>
                                            </span>
                                        </h3>
                                        <div className="booking-meta">
                                            <span>📍 {booking.location}</span>
                                            <span>⏱️ {booking.duration} {booking.type === 'daily' ? 'day(s)' : 'hour(s)'}</span>
                                            <span>📅 {new Date(booking.startTime).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="booking-actions">
                                        <div className="booking-amount">${booking.totalAmount}</div>
                                        {booking.status === 'pending' && (
                                            <button className="btn btn-green btn-sm" onClick={() => handleAcceptBooking(booking.id)}>Accept</button>
                                        )}
                                        {booking.status === 'active' && (
                                            <button className="btn btn-primary btn-sm" onClick={() => handleCompleteBooking(booking.id)}>Complete Trip</button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}

                {activeTab === 'earnings' && (
                    <>
                        <div className="page-header">
                            <h1>My <span className="gradient-text">Earnings</span></h1>
                            <p>Track your income and payment history</p>
                        </div>

                        <div className="kpi-grid" style={{ marginBottom: 'var(--space-xl)' }}>
                            <div className="kpi-card">
                                <div className="kpi-icon">💵</div>
                                <div className="kpi-value">${dashData.totalEarnings.toLocaleString()}</div>
                                <div className="kpi-label">Total Earnings</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">🚗</div>
                                <div className="kpi-value">{dashData.totalTrips}</div>
                                <div className="kpi-label">Completed Trips</div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-icon">📊</div>
                                <div className="kpi-value">${dashData.totalTrips > 0 ? (dashData.totalEarnings / dashData.totalTrips).toFixed(0) : 0}</div>
                                <div className="kpi-label">Avg per Trip</div>
                            </div>
                        </div>

                        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-md)' }}>Recent Payments</h2>
                        {dashData.recentPayments.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No payments yet</p>
                        ) : (
                            <div className="table-wrapper">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Booking</th>
                                            <th>Amount</th>
                                            <th>Platform Fee</th>
                                            <th>Your Earnings</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashData.recentPayments.map(p => (
                                            <tr key={p.id}>
                                                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                                <td>{p.bookingId}</td>
                                                <td>${p.amount}</td>
                                                <td style={{ color: 'var(--accent-red-light)' }}>-${p.platformFee.toFixed(2)}</td>
                                                <td style={{ fontWeight: 700, color: 'var(--accent-green-light)' }}>${p.driverEarnings.toFixed(2)}</td>
                                                <td><span className="badge badge-green">{p.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'notifications' && (
                    <>
                        <div className="page-header">
                            <h1><span className="gradient-text">Notifications</span></h1>
                            <p>Stay updated with your latest activity</p>
                        </div>
                        {dashData.notifications.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🔔</div>
                                <h3>No notifications</h3>
                                <p>You&apos;re all caught up!</p>
                            </div>
                        ) : (
                            dashData.notifications.map(notif => (
                                <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                    {!notif.read && <div className="notification-dot"></div>}
                                    <div className="notification-content">
                                        <h4>{notif.title}</h4>
                                        <p>{notif.message}</p>
                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
