import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="app-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>🚗 UseMe</h3>
                        <p>Hire reliable, verified drivers on an hourly or daily basis. Safe, secure, and transparent — always.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <ul>
                            <li><Link to="/search">Find Drivers</Link></li>
                            <li><Link to="/driver/register">Become a Driver</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Safety</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 UseMe. All rights reserved.</p>
                    <p>Built with ❤️ for drivers everywhere</p>
                </div>
            </div>
        </footer>
    );
}
