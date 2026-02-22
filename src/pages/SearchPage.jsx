import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import Stars from '../components/Stars';

export default function SearchPage() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        location: searchParams.get('location') || '',
        vehicleType: searchParams.get('vehicleType') || 'all',
        minRating: '',
        maxRate: '',
        available: 'true',
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async (overrideFilters) => {
        setLoading(true);
        try {
            const params = overrideFilters || filters;
            const cleanParams = {};
            Object.entries(params).forEach(([k, v]) => {
                if (v && v !== 'all') cleanParams[k] = v;
            });
            const data = await api.searchDrivers(cleanParams);
            setDrivers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDrivers();
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) var(--space-lg)' }}>
            <div className="page-header">
                <h1>Find Your <span className="gradient-text">Perfect Driver</span></h1>
                <p>Browse our verified, professional drivers and book instantly</p>
            </div>

            {/* Filters */}
            <form className="glass-card" style={{ marginBottom: 'var(--space-xl)' }} onSubmit={handleSearch}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Location</label>
                        <input
                            className="form-input"
                            placeholder="e.g. New York"
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Vehicle Type</label>
                        <select className="form-select" value={filters.vehicleType} onChange={(e) => handleFilterChange('vehicleType', e.target.value)}>
                            <option value="all">All Types</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="luxury">Luxury</option>
                            <option value="van">Van</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Min Rating</label>
                        <select className="form-select" value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)}>
                            <option value="">Any</option>
                            <option value="4">4+ Stars</option>
                            <option value="4.5">4.5+ Stars</option>
                            <option value="4.8">4.8+ Stars</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Max Rate ($/hr)</label>
                        <input
                            className="form-input"
                            type="number"
                            placeholder="e.g. 40"
                            value={filters.maxRate}
                            onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: 48 }}>
                        🔍 Search
                    </button>
                </div>
            </form>

            {/* Results */}
            <div style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {loading ? 'Searching...' : `${drivers.length} driver${drivers.length !== 1 ? 's' : ''} found`}
            </div>

            {loading ? (
                <div className="loading-spinner"></div>
            ) : drivers.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>No drivers found</h3>
                    <p>Try adjusting your filters or search in a different location</p>
                </div>
            ) : (
                <div className="drivers-grid">
                    {drivers.map(driver => (
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
                                <span className="badge badge-purple">{driver.experience} yrs</span>
                                <span className="badge badge-green">{driver.vehicleModel}</span>
                            </div>
                            <div className="driver-card-footer">
                                <div className="driver-rate">
                                    ${driver.hourlyRate}<span>/hr</span>
                                </div>
                                <span className="btn btn-primary btn-sm">Book Now</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
