import express from 'express';
import store from '../store.js';
import { authMiddleware } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Submit rating
router.post('/', authMiddleware, (req, res) => {
    const { bookingId, toDriverId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const booking = store.bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.rated = true;
    }

    const newRating = {
        id: `rating-${uuidv4().slice(0, 8)}`,
        bookingId,
        fromUserId: req.user.id,
        toDriverId,
        rating: parseInt(rating),
        comment: comment || '',
        createdAt: new Date().toISOString()
    };

    store.ratings.push(newRating);

    // Update driver average rating
    const driver = store.drivers.find(d => d.id === toDriverId);
    if (driver) {
        const driverRatings = store.ratings.filter(r => r.toDriverId === toDriverId);
        const avgRating = driverRatings.reduce((sum, r) => sum + r.rating, 0) / driverRatings.length;
        driver.rating = Math.round(avgRating * 100) / 100;
    }

    res.status(201).json(newRating);
});

// Get ratings for a driver
router.get('/driver/:id', (req, res) => {
    const ratings = store.ratings.filter(r => r.toDriverId === req.params.id);
    res.json(ratings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

export default router;
