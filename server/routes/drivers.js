import express from 'express';
import store from '../store.js';
import { authMiddleware } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Search drivers (public)
router.get('/search', (req, res) => {
    const { vehicleType, location, minRating, maxRate, available } = req.query;

    let drivers = store.drivers.filter(d => d.validated && !d.blocked);

    if (vehicleType && vehicleType !== 'all') {
        drivers = drivers.filter(d => d.vehicleType.toLowerCase() === vehicleType.toLowerCase());
    }
    if (location) {
        drivers = drivers.filter(d => d.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (minRating) {
        drivers = drivers.filter(d => d.rating >= parseFloat(minRating));
    }
    if (maxRate) {
        drivers = drivers.filter(d => d.hourlyRate <= parseFloat(maxRate));
    }
    if (available === 'true') {
        drivers = drivers.filter(d => d.available);
    }

    const safeDrivers = drivers.map(({ password, ...d }) => d);
    res.json(safeDrivers);
});

// Get driver by ID (public)
router.get('/:id', (req, res) => {
    const driver = store.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const { password, ...safeDriver } = driver;

    // Get driver ratings
    const ratings = store.ratings.filter(r => r.toDriverId === driver.id);

    res.json({ ...safeDriver, ratings });
});

// Update driver profile (auth required)
router.put('/profile', authMiddleware, (req, res) => {
    const driver = store.drivers.find(d => d.id === req.user.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const allowedFields = ['phone', 'vehicleType', 'vehicleModel', 'licensePlate', 'experience',
        'hourlyRate', 'dailyRate', 'location', 'bio', 'available'];

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            driver[field] = req.body[field];
        }
    });

    const { password, ...safeDriver } = driver;
    res.json(safeDriver);
});

// Upload documents (mock)
router.post('/documents', authMiddleware, (req, res) => {
    const driver = store.drivers.find(d => d.id === req.user.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const { type } = req.body; // 'license', 'insurance', 'backgroundCheck'
    if (driver.documents[type]) {
        driver.documents[type].uploaded = true;
        driver.documents[type].name = `${type}_${driver.id}.pdf`;
        driver.validationStatus = 'pending';
    }

    res.json({ message: 'Document uploaded successfully', documents: driver.documents });
});

// Get driver dashboard data
router.get('/dashboard/stats', authMiddleware, (req, res) => {
    const driver = store.drivers.find(d => d.id === req.user.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const bookings = store.bookings.filter(b => b.driverId === driver.id);
    const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'pending');
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const driverPayments = store.payments.filter(p => p.driverId === driver.id);
    const notifications = store.notifications.filter(n => n.userId === driver.id);

    res.json({
        totalTrips: driver.totalTrips,
        totalEarnings: driver.totalEarnings,
        rating: driver.rating,
        activeBookings,
        completedBookings,
        recentPayments: driverPayments.slice(-10),
        notifications,
        validationStatus: driver.validationStatus
    });
});

export default router;
