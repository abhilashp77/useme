import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import store from '../store.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if user exists
        const existing = store.users.find(u => u.email === email);
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check drivers too
        const existingDriver = store.drivers.find(d => d.email === email);
        if (existingDriver) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const userRole = role || 'customer';

        if (userRole === 'driver') {
            const driver = {
                id: `driver-${uuidv4().slice(0, 8)}`,
                userId: `driver-user-${uuidv4().slice(0, 8)}`,
                name,
                email,
                password: hashedPassword,
                role: 'driver',
                phone: phone || '',
                avatar: null,
                vehicleType: req.body.vehicleType || 'Sedan',
                vehicleModel: req.body.vehicleModel || '',
                licensePlate: req.body.licensePlate || '',
                experience: req.body.experience || 0,
                hourlyRate: req.body.hourlyRate || 20,
                dailyRate: req.body.dailyRate || 150,
                rating: 0,
                totalTrips: 0,
                totalEarnings: 0,
                location: req.body.location || '',
                lat: 40.7128,
                lng: -74.0060,
                available: false,
                validated: false,
                validationStatus: 'pending',
                documents: {
                    license: { uploaded: false, verified: false, name: null },
                    insurance: { uploaded: false, verified: false, name: null },
                    backgroundCheck: { uploaded: false, verified: false, name: null }
                },
                bio: req.body.bio || '',
                createdAt: new Date().toISOString(),
                blocked: false
            };
            store.drivers.push(driver);

            const token = jwt.sign(
                { id: driver.id, email: driver.email, role: 'driver', name: driver.name },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.status(201).json({
                token,
                user: { id: driver.id, name: driver.name, email: driver.email, role: 'driver' }
            });
        }

        const user = {
            id: `${userRole}-${uuidv4().slice(0, 8)}`,
            name,
            email,
            password: hashedPassword,
            role: userRole,
            phone: phone || '',
            avatar: null,
            createdAt: new Date().toISOString(),
            blocked: false
        };
        store.users.push(user);

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check users
        let user = store.users.find(u => u.email === email);
        let role = user?.role;

        // Check drivers
        if (!user) {
            user = store.drivers.find(d => d.email === email);
            role = 'driver';
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (user.blocked) {
            return res.status(403).json({ error: 'Account has been blocked' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Not authenticated' });

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        let user = store.users.find(u => u.id === decoded.id);
        if (!user) {
            user = store.drivers.find(d => d.id === decoded.id);
        }

        if (!user) return res.status(404).json({ error: 'User not found' });

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Firebase bridge
router.post('/firebase', async (req, res) => {
    try {
        const { uid, email, name, role = 'customer' } = req.body;

        if (!uid || !email) {
            return res.status(400).json({ error: 'UID and email are required' });
        }

        // Check users
        let user = store.users.find(u => u.email === email);
        let currentRole = user?.role;

        // Check drivers
        if (!user) {
            user = store.drivers.find(d => d.email === email);
            currentRole = 'driver';
        }

        if (user && user.blocked) {
            return res.status(403).json({ error: 'Account has been blocked' });
        }

        // Create user if they don't exist
        if (!user) {
            if (!role) {
                return res.status(409).json({ error: 'needs_role' });
            }

            currentRole = role;
            if (role === 'driver') {
                user = {
                    id: `driver-${uuidv4().slice(0, 8)}`,
                    userId: `driver-user-${uuidv4().slice(0, 8)}`,
                    name: name || email.split('@')[0],
                    email,
                    password: '', // Firebase handles auth
                    role: 'driver',
                    phone: '',
                    avatar: null,
                    vehicleType: 'Sedan',
                    vehicleModel: '',
                    licensePlate: '',
                    experience: 0,
                    hourlyRate: 20,
                    dailyRate: 150,
                    rating: 0,
                    totalTrips: 0,
                    totalEarnings: 0,
                    location: '',
                    lat: 40.7128,
                    lng: -74.0060,
                    available: false,
                    validated: false,
                    validationStatus: 'pending',
                    documents: {
                        license: { uploaded: false, verified: false, name: null },
                        insurance: { uploaded: false, verified: false, name: null },
                        backgroundCheck: { uploaded: false, verified: false, name: null }
                    },
                    bio: '',
                    createdAt: new Date().toISOString(),
                    blocked: false
                };
                store.drivers.push(user);
            } else {
                user = {
                    id: `customer-${uuidv4().slice(0, 8)}`,
                    name: name || email.split('@')[0],
                    email,
                    password: '',
                    role: 'customer',
                    phone: '',
                    avatar: null,
                    createdAt: new Date().toISOString(),
                    blocked: false
                };
                store.users.push(user);
            }
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: currentRole, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: currentRole }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
