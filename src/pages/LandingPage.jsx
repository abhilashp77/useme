import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Stars from '../components/Stars';

export default function LandingPage() {
    const [drivers, setDrivers] = useState([]);
    const [searchLocation, setSearchLocation] = useState('');
    const [searchType, setSearchType] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        api.searchDrivers({ available: 'true' }).then(setDrivers).catch(() => { });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchLocation) params.set('location', searchLocation);
        if (searchType !== 'all') params.set('vehicleType', searchType);
        navigate(`/search?${params.toString()}`);
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    const features = [
        { icon: '🔍', title: 'Find Drivers Instantly', desc: 'Search verified drivers by location, vehicle type, and availability. Book in seconds.' },
        { icon: '🛡️', title: 'Fully Verified', desc: 'Every driver undergoes background checks, license verification, and insurance validation.' },
        { icon: '⏱️', title: 'Flexible Booking', desc: 'Hire by the hour or full day — you choose the duration that fits your schedule.' },
        { icon: '💳', title: 'Secure Payments', desc: 'Pay securely with dynamic pricing and clear breakdowns before you confirm.' },
        { icon: '⭐', title: 'Trusted Ratings', desc: 'Mutual rating system ensures high-quality service from both drivers and customers.' },
        { icon: '📊', title: 'Track Everything', desc: 'Full trip history, payment records, and earnings dashboard for complete transparency.' },
    ];

    return (
        <div>
            {/* Hero */}
            <section className="hero">
                <div className="container">
                    <h1 className="animate-slide-up">
                        Hire Trusted Drivers<br />
                        <span className="gradient-text">On Your Schedule</span>
                    </h1>
                    <p className="animate-fade-in">
                        UseMe connects you with verified, professional drivers available by the hour or day.
                        Safe, reliable, and transparent — every time.
                    </p>
                    <div className="hero-actions animate-fade-in">
                        <Link to="/search" className="btn btn-primary btn-lg">Find a Driver</Link>
                        <Link to="/driver/register" className="btn btn-secondary btn-lg">Become a Driver</Link>
                    </div>

                    <form className="search-bar animate-slide-up" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Enter your location..."
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                        />
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                            <option value="all">All Types</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="luxury">Luxury</option>
                            <option value="van">Van</option>
                        </select>
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose <span className="gradient-text">UseMe</span>?</h2>
                    <p className="section-subtitle">Everything you need for a seamless driver hiring experience</p>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Drivers */}
            {drivers.length > 0 && (
                <section className="features-section">
                    <div className="container">
                        <h2 className="section-title">Top Rated <span className="gradient-text">Drivers</span></h2>
                        <p className="section-subtitle">Meet some of our highest-rated professionals</p>
                        <div className="drivers-grid">
                            {drivers.slice(0, 3).map(driver => (
                                <Link to={`/driver/${driver.id}`} key={driver.id} className="driver-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="driver-card-header">
                                        <div className="driver-avatar">{getInitials(driver.name)}</div>
                                        <div className="driver-card-info">
                                            <h3>{driver.name}</h3>
                                            <div className="driver-meta">
                                                <span><Stars rating={Math.round(driver.rating)} size={14} /> {driver.rating}</span>
                                                <span>📍 {driver.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="driver-card-body">
                                        <p>{driver.bio}</p>
                                    </div>
                                    <div className="driver-card-tags">
                                        <span className="badge badge-blue">{driver.vehicleType}</span>
                                        <span className="badge badge-purple">{driver.experience} yrs exp</span>
                                        {driver.available && <span className="badge badge-green">Available</span>}
                                    </div>
                                    <div className="driver-card-footer">
                                        <div className="driver-rate">
                                            ${driver.hourlyRate}<span>/hr</span>
                                        </div>
                                        <span className="btn btn-primary btn-sm">View Profile</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
                            <Link to="/search" className="btn btn-secondary btn-lg">View All Drivers →</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="features-section" style={{ paddingBottom: '80px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="glass-card" style={{ maxWidth: 700, margin: '0 auto', padding: '48px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-md)' }}>
                            Ready to <span className="gradient-text">Get Started?</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: 'var(--font-size-lg)' }}>
                            Join thousands of happy customers and drivers on our platform.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/login" className="btn btn-primary btn-lg">Create Account</Link>
                            <Link to="/driver/register" className="btn btn-secondary btn-lg">Register as Driver</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
