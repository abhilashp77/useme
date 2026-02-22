import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DriverRegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '',
        vehicleType: 'Sedan', vehicleModel: '', licensePlate: '',
        experience: '', hourlyRate: '', dailyRate: '',
        location: '', bio: '',
        role: 'driver',
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            await register({
                ...formData,
                experience: parseInt(formData.experience) || 0,
                hourlyRate: parseInt(formData.hourlyRate) || 20,
                dailyRate: parseInt(formData.dailyRate) || 150,
            });
            navigate('/driver/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, label: 'Personal Info' },
        { num: 2, label: 'Vehicle Details' },
        { num: 3, label: 'Documents' },
    ];

    return (
        <div className="auth-page">
            <div style={{ maxWidth: 560, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                    <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                        <div className="logo-icon">🚗</div>
                        <span>UseMe</span>
                    </Link>
                    <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Become a <span className="gradient-text">Driver</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Join our platform and start earning today</p>
                </div>

                {/* Progress Steps */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                    {steps.map(s => (
                        <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 'var(--radius-full)',
                                background: step >= s.num ? 'var(--accent-gradient)' : 'var(--bg-card)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 'var(--font-size-sm)', fontWeight: 700,
                                border: step >= s.num ? 'none' : '1px solid var(--border-primary)',
                                color: step >= s.num ? 'white' : 'var(--text-muted)',
                            }}>
                                {step > s.num ? '✓' : s.num}
                            </div>
                            <span style={{ fontSize: 'var(--font-size-sm)', color: step >= s.num ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="auth-card">
                    {error && <div className="error-message">⚠️ {error}</div>}

                    {step === 1 && (
                        <>
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Personal Information</h3>
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input className="form-input" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input className="form-input" type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password *</label>
                                <input className="form-input" type="password" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input className="form-input" type="tel" name="phone" placeholder="+1-555-0100" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input className="form-input" name="location" placeholder="e.g. New York, NY" value={formData.location} onChange={handleChange} />
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => {
                                if (!formData.name || !formData.email || !formData.password) {
                                    setError('Please fill in all required fields');
                                    return;
                                }
                                setError('');
                                setStep(2);
                            }}>
                                Continue →
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Vehicle Details</h3>
                            <div className="form-group">
                                <label className="form-label">Vehicle Type</label>
                                <select className="form-select" name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Luxury">Luxury</option>
                                    <option value="Van">Van</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Vehicle Model</label>
                                <input className="form-input" name="vehicleModel" placeholder="e.g. Toyota Camry 2024" value={formData.vehicleModel} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">License Plate</label>
                                <input className="form-input" name="licensePlate" placeholder="e.g. ABC-1234" value={formData.licensePlate} onChange={handleChange} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
                                <div className="form-group">
                                    <label className="form-label">Experience (years)</label>
                                    <input className="form-input" type="number" name="experience" placeholder="e.g. 5" value={formData.experience} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Hourly Rate ($)</label>
                                    <input className="form-input" type="number" name="hourlyRate" placeholder="25" value={formData.hourlyRate} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Daily Rate ($)</label>
                                    <input className="form-input" type="number" name="dailyRate" placeholder="180" value={formData.dailyRate} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bio / About You</label>
                                <textarea className="form-textarea" name="bio" placeholder="Tell customers about your driving experience..." value={formData.bio} onChange={handleChange} />
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>Continue →</button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Document Upload</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-lg)' }}>
                                Upload the following documents for verification. Our admin team will review and approve your application.
                            </p>

                            {[
                                { label: "Driver's License", icon: '🪪', desc: 'Valid government-issued driver\'s license' },
                                { label: 'Insurance Certificate', icon: '📋', desc: 'Current vehicle insurance documentation' },
                                { label: 'Background Check', icon: '🔍', desc: 'Background check authorization or results' },
                            ].map((doc, i) => (
                                <div key={i} style={{
                                    padding: 'var(--space-md)', background: 'var(--bg-input)',
                                    borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)',
                                    border: '1px dashed var(--border-light)',
                                    display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                                }}>
                                    <span style={{ fontSize: 28 }}>{doc.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{doc.label}</p>
                                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{doc.desc}</p>
                                    </div>
                                    <button className="btn btn-secondary btn-sm">Upload</button>
                                </div>
                            ))}

                            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--accent-amber-light)' }}>
                                    ⚠️ <strong>Note:</strong> Documents will be reviewed by our admin team. You&apos;ll be able to start accepting bookings once approved.
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Complete Registration'}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <p className="auth-footer" style={{ marginTop: 'var(--space-lg)' }}>
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}
