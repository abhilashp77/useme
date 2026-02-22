import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import DriverProfilePage from './pages/DriverProfilePage';
import BookingsPage from './pages/BookingsPage';
import DriverDashboard from './pages/DriverDashboard';
import DriverRegisterPage from './pages/DriverRegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

function App() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <main style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/driver/:id" element={<DriverProfilePage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                    <Route path="/driver/dashboard" element={<DriverDashboard />} />
                    <Route path="/driver/register" element={<DriverRegisterPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;
