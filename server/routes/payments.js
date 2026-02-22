import express from 'express';
import store from '../store.js';
import { authMiddleware } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Process payment (mock)
router.post('/process', authMiddleware, (req, res) => {
    const { bookingId, method } = req.body;

    const booking = store.bookings.find(b => b.id === bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const platformFee = booking.totalAmount * 0.10;
    const payment = {
        id: `payment-${uuidv4().slice(0, 8)}`,
        bookingId: booking.id,
        customerId: booking.customerId,
        driverId: booking.driverId,
        amount: booking.totalAmount,
        platformFee,
        driverEarnings: booking.totalAmount - platformFee,
        status: 'completed',
        method: method || 'card',
        createdAt: new Date().toISOString()
    };

    store.payments.push(payment);
    res.json(payment);
});

// Get payment history
router.get('/history', authMiddleware, (req, res) => {
    let payments;

    if (req.user.role === 'admin') {
        payments = store.payments;
    } else if (req.user.role === 'driver') {
        payments = store.payments.filter(p => p.driverId === req.user.id);
    } else {
        payments = store.payments.filter(p => p.customerId === req.user.id);
    }

    res.json(payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

export default router;
