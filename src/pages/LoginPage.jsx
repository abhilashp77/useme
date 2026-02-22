import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', role: 'customer'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSocialLogin = async (provider) => {
        setError('');
        setLoading(true);
        try {
            const role = isLogin ? 'customer' : formData.role;
            let user;
            if (provider === 'google') user = await loginWithGoogle(role);

            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'driver') navigate('/driver/dashboard');
            else navigate('/search');
        } catch (err) {
            setError(err.message || 'Social login failed');
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Login cancelled');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let user;
            if (isLogin) {
                user = await login(formData.email, formData.password);
            } else {
                user = await register(formData);
            }

            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'driver') navigate('/driver/dashboard');
            else navigate('/search');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                        <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                            <div className="logo-icon">🚗</div>
                            <span>UseMe</span>
                        </Link>
                    </div>

                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${isLogin ? 'active' : ''}`}
                            onClick={() => { setIsLogin(true); setError(''); }}
                        >
                            Log In
                        </button>
                        <button
                            className={`auth-tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => { setIsLogin(false); setError(''); }}
                        >
                            Sign Up
                        </button>
                    </div>

                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="auth-subtitle">
                        {isLogin ? 'Log in to continue your journey' : 'Join UseMe today — it only takes a minute'}
                    </p>

                    <div className="social-login">
                        <button className="social-btn" type="button" onClick={() => handleSocialLogin('google')} disabled={loading}>
                            <span>🔵</span> Google
                        </button>
                    </div>

                    <div className="divider">or continue with email</div>

                    {error && <div className="error-message">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                className="form-input"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                className="form-input"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        className="form-input"
                                        type="tel"
                                        name="phone"
                                        placeholder="+1-555-0100"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">I want to</label>
                                    <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                                        <option value="customer">Hire a Driver</option>
                                        <option value="driver">Drive for UseMe</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        {isLogin ? (
                            <>Don&apos;t have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>Sign Up</a></>
                        ) : (
                            <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>Log In</a></>
                        )}
                    </p>

                    {isLogin && (
                        <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>Demo accounts:</p>
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                                <strong>Customer:</strong> sarah@example.com / customer123<br />
                                <strong>Driver:</strong> james@example.com / driver123<br />
                                <strong>Admin:</strong> admin@useme.com / admin123
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
