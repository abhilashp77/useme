import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Stars from '../components/Stars';

export default function DriverProfilePage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingType, setBookingType] = useState('hourly');
    const [duration, setDuration] = useState(1);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        api.getDriver(id)
            .then(setDriver)
            .catch(() => navigate('/search'))
            .finally(() => setLoading(false));
    }, [id]);

    const totalAmount = driver
        ? bookingType === 'daily'
            ? driver.dailyRate * duration
            : driver.hourlyRate * duration
        : 0;

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        try {
            await api.createBooking({
                driverId: driver.id,
                type: bookingType,
                duration: parseInt(duration),
                location: driver.location,
                startTime: bookingDate || new Date().toISOString(),
            });
            setSuccess('Booking confirmed! Check your bookings page for details.');
            setTimeout(() => navigate('/bookings'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setBookingLoading(false);
        }
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

    if (loading) return <div className="loading-spinner"></div>;
    if (!driver) return null;

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) var(--space-lg)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                {/* Left: Driver Info */}
                <div>
                    <div className="profile-header">
                        <div className="profile-avatar-lg">{getInitials(driver.name)}</div>
                        <div className="profile-info">
                            <h1>{driver.name}</h1>
                            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
                                <Stars rating={Math.round(driver.rating)} /> <span>{driver.rating}</span>
                                <span>📍 {driver.location}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                                <span className="badge badge-blue">{driver.vehicleType}</span>
                                <span className="badge badge-purple">{driver.experience} yrs experience</span>
                                <span className="badge badge-green">{driver.vehicleModel}</span>
                                {driver.available ? (
                                    <span className="badge badge-green">Available Now</span>
                                ) : (
                                    <span className="badge badge-red">Unavailable</span>
                                )}
                            </div>

                            <div className="profile-stats">
                                <div className="profile-stat">
                                    <div className="stat-value">{driver.totalTrips}</div>
                                    <div className="stat-label">Total Trips</div>
                                </div>
                                <div className="profile-stat">
                                    <div className="stat-value">{driver.rating}</div>
                                    <div className="stat-label">Rating</div>
                                </div>
                                <div className="profile-stat">
                                    <div className="stat-value">${driver.hourlyRate}</div>
                                    <div className="stat-label">Per Hour</div>
                                </div>
                                <div className="profile-stat">
                                    <div className="stat-value">${driver.dailyRate}</div>
                                    <div className="stat-label">Per Day</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>About</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{driver.bio}</p>
                    </div>

                    {/* Vehicle */}
                    <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>Vehicle Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                            <div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</span>
                                <p style={{ fontWeight: 600 }}>{driver.vehicleType}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Model</span>
                                <p style={{ fontWeight: 600 }}>{driver.vehicleModel}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>License Plate</span>
                                <p style={{ fontWeight: 600 }}>{driver.licensePlate}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Experience</span>
                                <p style={{ fontWeight: 600 }}>{driver.experience} years</p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="glass-card">
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>Reviews ({(driver.ratings || []).length})</h3>
                        {(driver.ratings || []).length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No reviews yet</p>
                        ) : (
                            (driver.ratings || []).map(r => (
                                <div key={r.id} style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                                        <Stars rating={r.rating} size={14} />
                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{r.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Booking Form */}
                <div className="booking-form-card">
                    <h3>Book {driver.name}</h3>

                    {success && <div className="success-message">✅ {success}</div>}
                    {error && <div className="error-message">⚠️ {error}</div>}

                    <div className="form-group">
                        <label className="form-label">Booking Type</label>
                        <div className="auth-tabs">
                            <button
                                type="button"
                                className={`auth-tab ${bookingType === 'hourly' ? 'active' : ''}`}
                                onClick={() => setBookingType('hourly')}
                            >
                                Hourly
                            </button>
                            <button
                                type="button"
                                className={`auth-tab ${bookingType === 'daily' ? 'active' : ''}`}
                                onClick={() => setBookingType('daily')}
                            >
                                Daily
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            {bookingType === 'daily' ? 'Number of Days' : 'Number of Hours'}
                        </label>
                        <input
                            className="form-input"
                            type="number"
                            min="1"
                            max={bookingType === 'daily' ? 30 : 24}
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Start Date & Time</label>
                        <input
                            className="form-input"
                            type="datetime-local"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                        />
                    </div>

                    <div className="price-breakdown">
                        <div className="price-row">
                            <span>Rate</span>
                            <span>${bookingType === 'daily' ? driver.dailyRate : driver.hourlyRate}/{bookingType === 'daily' ? 'day' : 'hr'}</span>
                        </div>
                        <div className="price-row">
                            <span>Duration</span>
                            <span>{duration} {bookingType === 'daily' ? 'day(s)' : 'hour(s)'}</span>
                        </div>
                        <div className="price-row">
                            <span>Platform Fee (10%)</span>
                            <span>${(totalAmount * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="price-row total">
                            <span>Total</span>
                            <span>${(totalAmount * 1.1).toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                        onClick={handleBooking}
                        disabled={bookingLoading || !driver.available}
                    >
                        {bookingLoading ? 'Confirming...' : !driver.available ? 'Unavailable' : `Book for $${totalAmount.toFixed(2)}`}
                    </button>

                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-md)' }}>
                        🔒 Secure payment processed via encrypted gateway
                    </p>
                </div>
            </div>
        </div>
    );
}
