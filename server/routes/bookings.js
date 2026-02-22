import express from 'express';
import store from '../store.js';
import { authMiddleware } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create booking
router.post('/', authMiddleware, (req, res) => {
    const { driverId, type, duration, location, startTime } = req.body;

    const driver = store.drivers.find(d => d.id === driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    if (!driver.validated) return res.status(400).json({ error: 'Driver not yet validated' });
    if (!driver.available) return res.status(400).json({ error: 'Driver not available' });

    const rate = type === 'daily' ? driver.dailyRate : driver.hourlyRate;
    const totalAmount = type === 'daily' ? rate * duration : rate * duration;

    const start = new Date(startTime || Date.now());
    const end = new Date(start);
    if (type === 'daily') {
        end.setDate(end.getDate() + duration);
    } else {
        end.setHours(end.getHours() + duration);
    }

    const booking = {
        id: `booking-${uuidv4().slice(0, 8)}`,
        customerId: req.user.id,
        customerName: req.user.name,
        driverId: driver.id,
        driverName: driver.name,
        type,
        duration,
        hourlyRate: driver.hourlyRate,
        totalAmount,
        status: 'pending',
        location: location || driver.location,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        createdAt: new Date().toISOString(),
        rated: false
    };

    store.bookings.push(booking);

    // Create notification for driver
    store.notifications.push({
        id: `notif-${uuidv4().slice(0, 8)}`,
        userId: driver.id,
        type: 'booking',
        title: 'New Booking Request',
        message: `${req.user.name} has booked you for ${duration} ${type === 'daily' ? 'day(s)' : 'hour(s)'}.`,
        read: false,
        createdAt: new Date().toISOString()
    });

    res.status(201).json(booking);
});

// Get bookings for current user
router.get('/', authMiddleware, (req, res) => {
    let bookings;

    if (req.user.role === 'driver') {
        bookings = store.bookings.filter(b => b.driverId === req.user.id);
    } else if (req.user.role === 'admin') {
        bookings = store.bookings;
    } else {
        bookings = store.bookings.filter(b => b.customerId === req.user.id);
    }

    const { status } = req.query;
    if (status) {
        bookings = bookings.filter(b => b.status === status);
    }

    res.json(bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// Update booking status
router.put('/:id/status', authMiddleware, (req, res) => {
    const booking = store.bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const { status } = req.body;
    const validStatuses = ['pending', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    booking.status = status;

    if (status === 'completed') {
        // Create payment
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
            method: 'card',
            createdAt: new Date().toISOString()
        };
        store.payments.push(payment);

        // Update driver stats
        const driver = store.drivers.find(d => d.id === booking.driverId);
        if (driver) {
            driver.totalTrips += 1;
            driver.totalEarnings += payment.driverEarnings;
        }
    }

    res.json(booking);
});

// Complete booking
router.post('/:id/complete', authMiddleware, (req, res) => {
    const booking = store.bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = 'completed';
    booking.endTime = new Date().toISOString();

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
        method: 'card',
        createdAt: new Date().toISOString()
    };
    store.payments.push(payment);

    const driver = store.drivers.find(d => d.id === booking.driverId);
    if (driver) {
        driver.totalTrips += 1;
        driver.totalEarnings += payment.driverEarnings;
    }

    res.json({ booking, payment });
});

export default router;
