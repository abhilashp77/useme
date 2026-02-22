import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <header className="app-header">
            <div className="header-inner">
                <Link to="/" className="logo">
                    <div className="logo-icon">🚗</div>
                    <span>UseMe</span>
                </Link>

                <nav>
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/search">Find Drivers</Link></li>
                        {!user && <li><Link to="/driver/register">Drive With Us</Link></li>}
                        {user?.role === 'customer' && <li><Link to="/bookings">My Bookings</Link></li>}
                        {user?.role === 'driver' && <li><Link to="/driver/dashboard">Dashboard</Link></li>}
                        {user?.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
                    </ul>
                </nav>

                <div className="header-actions">
                    {user ? (
                        <>
                            <div className="user-avatar" onClick={() => {
                                if (user.role === 'admin') navigate('/admin');
                                else if (user.role === 'driver') navigate('/driver/dashboard');
                                else navigate('/bookings');
                            }}>
                                {getInitials(user.name)}
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
                            <Link to="/login" className="btn btn-primary btn-sm">Sign Up</Link>
                        </>
                    )}
                </div>

                <button className="mobile-menu-btn" onClick={() => { }}>☰</button>
            </div>
        </header>
    );
}
