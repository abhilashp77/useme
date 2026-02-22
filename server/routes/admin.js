import express from 'express';
import store from '../store.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Dashboard stats
router.get('/dashboard', authMiddleware, adminMiddleware, (req, res) => {
    const totalDrivers = store.drivers.length;
    const validatedDrivers = store.drivers.filter(d => d.validated).length;
    const pendingDrivers = store.drivers.filter(d => d.validationStatus === 'pending').length;
    const totalCustomers = store.users.filter(u => u.role === 'customer').length;
    const totalBookings = store.bookings.length;
    const activeBookings = store.bookings.filter(b => b.status === 'active').length;
    const completedBookings = store.bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = store.payments.reduce((sum, p) => sum + p.amount, 0);
    const platformEarnings = store.payments.reduce((sum, p) => sum + p.platformFee, 0);
    const avgRating = store.drivers
        .filter(d => d.rating > 0)
        .reduce((sum, d) => sum + d.rating, 0) / (store.drivers.filter(d => d.rating > 0).length || 1);

    res.json({
        totalDrivers,
        validatedDrivers,
        pendingDrivers,
        totalCustomers,
        totalBookings,
        activeBookings,
        completedBookings,
        totalRevenue,
        platformEarnings,
        avgRating: Math.round(avgRating * 100) / 100,
        recentBookings: store.bookings.slice(-5).reverse(),
        recentPayments: store.payments.slice(-5).reverse()
    });
});

// Get all drivers (admin)
router.get('/drivers', authMiddleware, adminMiddleware, (req, res) => {
    const { status } = req.query;
    let drivers = store.drivers;

    if (status) {
        drivers = drivers.filter(d => d.validationStatus === status);
    }

    const safeDrivers = drivers.map(({ password, ...d }) => d);
    res.json(safeDrivers);
});

// Validate driver
router.put('/drivers/:id/validate', authMiddleware, adminMiddleware, (req, res) => {
    const driver = store.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const { action } = req.body; // 'approve' or 'reject'

    if (action === 'approve') {
        driver.validated = true;
        driver.validationStatus = 'approved';
        driver.available = true;
        driver.documents.license.verified = true;
        driver.documents.insurance.verified = true;
        driver.documents.backgroundCheck.verified = true;

        store.notifications.push({
            id: `notif-${Date.now()}`,
            userId: driver.id,
            type: 'validation',
            title: 'Application Approved!',
            message: 'Congratulations! Your application has been approved. You can now receive booking requests.',
            read: false,
            createdAt: new Date().toISOString()
        });
    } else if (action === 'reject') {
        driver.validated = false;
        driver.validationStatus = 'rejected';

        store.notifications.push({
            id: `notif-${Date.now()}`,
            userId: driver.id,
            type: 'validation',
            title: 'Application Rejected',
            message: 'Your application has been rejected. Please review your documents and resubmit.',
            read: false,
            createdAt: new Date().toISOString()
        });
    }

    const { password, ...safeDriver } = driver;
    res.json(safeDriver);
});

// Get all users (admin)
router.get('/users', authMiddleware, adminMiddleware, (req, res) => {
    const allUsers = [
        ...store.users.map(({ password, ...u }) => u),
        ...store.drivers.map(({ password, ...d }) => d)
    ];
    res.json(allUsers);
});

// Block/unblock user
router.put('/users/:id/block', authMiddleware, adminMiddleware, (req, res) => {
    let user = store.users.find(u => u.id === req.params.id);
    if (!user) {
        user = store.drivers.find(d => d.id === req.params.id);
    }
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.blocked = !user.blocked;
    const { password, ...safeUser } = user;
    res.json(safeUser);
});

// Get all payments (admin)
router.get('/payments', authMiddleware, adminMiddleware, (req, res) => {
    res.json(store.payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

export default router;
