import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Stars from '../components/Stars';

export default function BookingsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [ratingModal, setRatingModal] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [ratingComment, setRatingComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        try {
            const data = await api.getBookings();
            setBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (id) => {
        try {
            await api.updateBookingStatus(id, 'cancelled');
            fetchBookings();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmitRating = async () => {
        if (!ratingModal) return;
        setSubmitting(true);
        try {
            await api.submitRating({
                bookingId: ratingModal.id,
                toDriverId: ratingModal.driverId,
                rating: ratingValue,
                comment: ratingComment,
            });
            setRatingModal(null);
            setRatingValue(5);
            setRatingComment('');
            fetchBookings();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            pending: 'badge-amber',
            active: 'badge-blue',
            completed: 'badge-green',
            cancelled: 'badge-red',
        };
        return <span className={`badge ${map[status] || 'badge-blue'}`}>{status}</span>;
    };

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) var(--space-lg)' }}>
            <div className="page-header">
                <h1>My <span className="gradient-text">Bookings</span></h1>
                <p>Track and manage all your driver bookings</p>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
                {['all', 'pending', 'active', 'completed', 'cancelled'].map(f => (
                    <button
                        key={f}
                        className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? `(${bookings.length})` : `(${bookings.filter(b => b.status === f).length})`}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No bookings found</h3>
                    <p>You haven&apos;t made any bookings yet. Find a driver to get started!</p>
                    <button className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }} onClick={() => navigate('/search')}>
                        Find a Driver
                    </button>
                </div>
            ) : (
                filtered.map(booking => (
                    <div key={booking.id} className="booking-card">
                        <div className="booking-details">
                            <h3>
                                {user?.role === 'driver' ? booking.customerName : booking.driverName}
                                <span style={{ marginLeft: 'var(--space-sm)' }}>{getStatusBadge(booking.status)}</span>
                            </h3>
                            <div className="booking-meta">
                                <span>📍 {booking.location}</span>
                                <span>⏱️ {booking.duration} {booking.type === 'daily' ? 'day(s)' : 'hour(s)'}</span>
                                <span>📅 {new Date(booking.startTime).toLocaleDateString()}</span>
                                <span>🕐 {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        <div className="booking-actions">
                            <div className="booking-amount">${booking.totalAmount}</div>
                            {booking.status === 'pending' && (
                                <button className="btn btn-red btn-sm" onClick={() => handleCancelBooking(booking.id)}>Cancel</button>
                            )}
                            {booking.status === 'completed' && !booking.rated && user?.role === 'customer' && (
                                <button className="btn btn-primary btn-sm" onClick={() => setRatingModal(booking)}>Rate Driver</button>
                            )}
                            {booking.status === 'completed' && booking.rated && (
                                <span className="badge badge-green">Rated ✓</span>
                            )}
                        </div>
                    </div>
                ))
            )}

            {/* Rating Modal */}
            {ratingModal && (
                <div className="modal-overlay" onClick={() => setRatingModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Rate {ratingModal.driverName}</h2>
                            <button className="modal-close" onClick={() => setRatingModal(null)}>✕</button>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                            <Stars rating={ratingValue} size={36} interactive onChange={setRatingValue} />
                            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)', fontSize: 'var(--font-size-sm)' }}>
                                {ratingValue === 5 ? 'Excellent!' : ratingValue === 4 ? 'Great!' : ratingValue === 3 ? 'Good' : ratingValue === 2 ? 'Fair' : 'Poor'}
                            </p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Your feedback</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Share your experience with this driver..."
                                value={ratingComment}
                                onChange={(e) => setRatingComment(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={handleSubmitRating}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
