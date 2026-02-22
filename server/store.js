import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// ─── Seed Data ───────────────────────────────────────────────────
const adminPassword = bcrypt.hashSync('admin123', 10);
const driverPassword = bcrypt.hashSync('driver123', 10);
const customerPassword = bcrypt.hashSync('customer123', 10);

const store = {
    users: [
        {
            id: 'admin-001',
            name: 'Admin User',
            email: 'admin@useme.com',
            password: adminPassword,
            role: 'admin',
            phone: '+1-555-0100',
            avatar: null,
            createdAt: '2025-01-01T00:00:00Z',
            blocked: false
        },
        {
            id: 'customer-001',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            password: customerPassword,
            role: 'customer',
            phone: '+1-555-0101',
            avatar: null,
            createdAt: '2025-06-15T10:00:00Z',
            blocked: false
        },
        {
            id: 'customer-002',
            name: 'Michael Chen',
            email: 'michael@example.com',
            password: customerPassword,
            role: 'customer',
            phone: '+1-555-0102',
            avatar: null,
            createdAt: '2025-07-20T14:30:00Z',
            blocked: false
        },
        {
            id: 'customer-003',
            name: 'Emily Davis',
            email: 'emily@example.com',
            password: customerPassword,
            role: 'customer',
            phone: '+1-555-0103',
            avatar: null,
            createdAt: '2025-08-05T09:00:00Z',
            blocked: false
        }
    ],

    drivers: [
        {
            id: 'driver-001',
            userId: 'driver-user-001',
            name: 'James Wilson',
            email: 'james@example.com',
            password: driverPassword,
            role: 'driver',
            phone: '+1-555-0201',
            avatar: null,
            vehicleType: 'Sedan',
            vehicleModel: 'Toyota Camry 2024',
            licensePlate: 'ABC-1234',
            experience: 8,
            hourlyRate: 25,
            dailyRate: 180,
            rating: 4.8,
            totalTrips: 342,
            totalEarnings: 28500,
            location: 'New York, NY',
            lat: 40.7128,
            lng: -74.0060,
            available: true,
            validated: true,
            validationStatus: 'approved',
            documents: {
                license: { uploaded: true, verified: true, name: 'drivers_license.pdf' },
                insurance: { uploaded: true, verified: true, name: 'insurance_cert.pdf' },
                backgroundCheck: { uploaded: true, verified: true, name: 'bg_check.pdf' }
            },
            bio: 'Professional driver with 8 years of experience. Safe, punctual, and courteous. Specialized in city navigation and airport transfers.',
            createdAt: '2025-02-01T00:00:00Z',
            blocked: false
        },
        {
            id: 'driver-002',
            userId: 'driver-user-002',
            name: 'Maria Garcia',
            email: 'maria@example.com',
            password: driverPassword,
            role: 'driver',
            phone: '+1-555-0202',
            avatar: null,
            vehicleType: 'SUV',
            vehicleModel: 'Honda CR-V 2023',
            licensePlate: 'XYZ-5678',
            experience: 5,
            hourlyRate: 30,
            dailyRate: 220,
            rating: 4.9,
            totalTrips: 215,
            totalEarnings: 19800,
            location: 'Brooklyn, NY',
            lat: 40.6782,
            lng: -73.9442,
            available: true,
            validated: true,
            validationStatus: 'approved',
            documents: {
                license: { uploaded: true, verified: true, name: 'license_mg.pdf' },
                insurance: { uploaded: true, verified: true, name: 'insurance_mg.pdf' },
                backgroundCheck: { uploaded: true, verified: true, name: 'bgcheck_mg.pdf' }
            },
            bio: 'Experienced SUV driver, perfect for family trips and group outings. 5+ years of professional driving with a spotless record.',
            createdAt: '2025-03-15T00:00:00Z',
            blocked: false
        },
        {
            id: 'driver-003',
            userId: 'driver-user-003',
            name: 'David Kim',
            email: 'david@example.com',
            password: driverPassword,
            role: 'driver',
            phone: '+1-555-0203',
            avatar: null,
            vehicleType: 'Luxury',
            vehicleModel: 'Mercedes-Benz S-Class 2024',
            licensePlate: 'LUX-9012',
            experience: 12,
            hourlyRate: 50,
            dailyRate: 380,
            rating: 4.95,
            totalTrips: 520,
            totalEarnings: 68000,
            location: 'Manhattan, NY',
            lat: 40.7831,
            lng: -73.9712,
            available: true,
            validated: true,
            validationStatus: 'approved',
            documents: {
                license: { uploaded: true, verified: true, name: 'license_dk.pdf' },
                insurance: { uploaded: true, verified: true, name: 'insurance_dk.pdf' },
                backgroundCheck: { uploaded: true, verified: true, name: 'bgcheck_dk.pdf' }
            },
            bio: 'Premium luxury driver with 12 years of experience. Executive transportation specialist. Discrete, professional, and always on time.',
            createdAt: '2025-01-10T00:00:00Z',
            blocked: false
        },
        {
            id: 'driver-004',
            userId: 'driver-user-004',
            name: 'Aaliya Patel',
            email: 'aaliya@example.com',
            password: driverPassword,
            role: 'driver',
            phone: '+1-555-0204',
            avatar: null,
            vehicleType: 'Sedan',
            vehicleModel: 'Honda Accord 2023',
            licensePlate: 'DEF-3456',
            experience: 3,
            hourlyRate: 22,
            dailyRate: 160,
            rating: 4.6,
            totalTrips: 89,
            totalEarnings: 7200,
            location: 'Queens, NY',
            lat: 40.7282,
            lng: -73.7949,
            available: true,
            validated: true,
            validationStatus: 'approved',
            documents: {
                license: { uploaded: true, verified: true, name: 'license_ap.pdf' },
                insurance: { uploaded: true, verified: true, name: 'insurance_ap.pdf' },
                backgroundCheck: { uploaded: true, verified: true, name: 'bgcheck_ap.pdf' }
            },
            bio: 'Friendly and reliable driver. Great for daily commutes and errands. Always ensures a comfortable ride.',
            createdAt: '2025-05-20T00:00:00Z',
            blocked: false
        },
        {
            id: 'driver-005',
            userId: 'driver-user-005',
            name: 'Robert Thompson',
            email: 'robert@example.com',
            password: driverPassword,
            role: 'driver',
            phone: '+1-555-0205',
            avatar: null,
            vehicleType: 'Van',
            vehicleModel: 'Ford Transit 2023',
            licensePlate: 'VAN-7890',
            experience: 10,
            hourlyRate: 35,
            dailyRate: 260,
            rating: 4.7,
            totalTrips: 178,
            totalEarnings: 22000,
            location: 'Bronx, NY',
            lat: 40.8448,
            lng: -73.8648,
            available: false,
            validated: true,
            validationStatus: 'approved',
            documents: {
                license: { uploaded: true, verified: true, name: 'license_rt.pdf' },
                insurance: { uploaded: true, verified: true, name: 'insurance_rt.pdf' },
                backgroundCheck: { uploaded: true, verified: true, name: 'bgcheck_rt.pdf' }
            },
            bio: 'Specialized in moving and large group transportation. 10 years of van driving experience. Reliable and efficient.',
            createdAt: '2025-04-01T00:00:00Z',
            blocked: false
        },
        {
            id: 'driver-006',
            userId: 'driver-user-006',
            name: 'Lisa Martinez',
            email: 'lisa@example.com',
            password: driverPassword,
            role: 'driver',
            phone: '+1-555-0206',
            avatar: null,
            vehicleType: 'SUV',
            vehicleModel: 'Chevrolet Tahoe 2024',
            licensePlate: 'SUV-2468',
            experience: 6,
            hourlyRate: 32,
            dailyRate: 240,
            rating: 0,
            totalTrips: 0,
            totalEarnings: 0,
            location: 'Staten Island, NY',
            lat: 40.5795,
            lng: -74.1502,
            available: true,
            validated: false,
            validationStatus: 'pending',
            documents: {
                license: { uploaded: true, verified: false, name: 'license_lm.pdf' },
                insurance: { uploaded: true, verified: false, name: 'insurance_lm.pdf' },
                backgroundCheck: { uploaded: false, verified: false, name: null }
            },
            bio: 'New to the platform! 6 years of driving experience with an impeccable safety record.',
            createdAt: '2026-02-10T00:00:00Z',
            blocked: false
        },
        {
            id: 'driver-007',
            userId: 'driver-user-007',
            name: 'Chris Anderson',
            email: 'chris@example.com',
            password: driverPassword,
            role: 'driver',
            phone: '+1-555-0207',
            avatar: null,
            vehicleType: 'Sedan',
            vehicleModel: 'Nissan Altima 2023',
            licensePlate: 'SED-1357',
            experience: 2,
            hourlyRate: 20,
            dailyRate: 145,
            rating: 0,
            totalTrips: 0,
            totalEarnings: 0,
            location: 'Jersey City, NJ',
            lat: 40.7178,
            lng: -74.0431,
            available: true,
            validated: false,
            validationStatus: 'pending',
            documents: {
                license: { uploaded: true, verified: false, name: 'license_ca.pdf' },
                insurance: { uploaded: true, verified: false, name: 'insurance_ca.pdf' },
                backgroundCheck: { uploaded: true, verified: false, name: 'bgcheck_ca.pdf' }
            },
            bio: 'Eager new driver ready to provide excellent service. 2 years of driving experience.',
            createdAt: '2026-02-15T00:00:00Z',
            blocked: false
        }
    ],

    bookings: [
        {
            id: 'booking-001',
            customerId: 'customer-001',
            customerName: 'Sarah Johnson',
            driverId: 'driver-001',
            driverName: 'James Wilson',
            type: 'hourly',
            duration: 3,
            hourlyRate: 25,
            totalAmount: 75,
            status: 'completed',
            location: 'New York, NY',
            startTime: '2026-02-20T09:00:00Z',
            endTime: '2026-02-20T12:00:00Z',
            createdAt: '2026-02-19T15:00:00Z',
            rated: true
        },
        {
            id: 'booking-002',
            customerId: 'customer-002',
            customerName: 'Michael Chen',
            driverId: 'driver-003',
            driverName: 'David Kim',
            type: 'daily',
            duration: 1,
            hourlyRate: 50,
            totalAmount: 380,
            status: 'completed',
            location: 'Manhattan, NY',
            startTime: '2026-02-18T08:00:00Z',
            endTime: '2026-02-18T20:00:00Z',
            createdAt: '2026-02-17T20:00:00Z',
            rated: true
        },
        {
            id: 'booking-003',
            customerId: 'customer-001',
            customerName: 'Sarah Johnson',
            driverId: 'driver-002',
            driverName: 'Maria Garcia',
            type: 'hourly',
            duration: 5,
            hourlyRate: 30,
            totalAmount: 150,
            status: 'active',
            location: 'Brooklyn, NY',
            startTime: '2026-02-22T14:00:00Z',
            endTime: '2026-02-22T19:00:00Z',
            createdAt: '2026-02-21T10:00:00Z',
            rated: false
        },
        {
            id: 'booking-004',
            customerId: 'customer-003',
            customerName: 'Emily Davis',
            driverId: 'driver-004',
            driverName: 'Aaliya Patel',
            type: 'hourly',
            duration: 2,
            hourlyRate: 22,
            totalAmount: 44,
            status: 'pending',
            location: 'Queens, NY',
            startTime: '2026-02-23T10:00:00Z',
            endTime: '2026-02-23T12:00:00Z',
            createdAt: '2026-02-22T08:00:00Z',
            rated: false
        }
    ],

    ratings: [
        {
            id: 'rating-001',
            bookingId: 'booking-001',
            fromUserId: 'customer-001',
            toDriverId: 'driver-001',
            rating: 5,
            comment: 'Excellent driver! Very professional and punctual. Would definitely book again.',
            createdAt: '2026-02-20T13:00:00Z'
        },
        {
            id: 'rating-002',
            bookingId: 'booking-002',
            fromUserId: 'customer-002',
            toDriverId: 'driver-003',
            rating: 5,
            comment: 'Premium experience all the way. David was incredibly professional and the car was immaculate.',
            createdAt: '2026-02-18T21:00:00Z'
        }
    ],

    payments: [
        {
            id: 'payment-001',
            bookingId: 'booking-001',
            customerId: 'customer-001',
            driverId: 'driver-001',
            amount: 75,
            platformFee: 7.50,
            driverEarnings: 67.50,
            status: 'completed',
            method: 'card',
            createdAt: '2026-02-20T12:05:00Z'
        },
        {
            id: 'payment-002',
            bookingId: 'booking-002',
            customerId: 'customer-002',
            driverId: 'driver-003',
            amount: 380,
            platformFee: 38,
            driverEarnings: 342,
            status: 'completed',
            method: 'card',
            createdAt: '2026-02-18T20:10:00Z'
        }
    ],

    notifications: [
        {
            id: 'notif-001',
            userId: 'driver-001',
            type: 'booking',
            title: 'New Booking Request',
            message: 'Sarah Johnson has booked you for 3 hours on Feb 20.',
            read: true,
            createdAt: '2026-02-19T15:00:00Z'
        },
        {
            id: 'notif-002',
            userId: 'driver-004',
            type: 'booking',
            title: 'New Booking Request',
            message: 'Emily Davis wants to book you for 2 hours on Feb 23.',
            read: false,
            createdAt: '2026-02-22T08:00:00Z'
        }
    ]
};

export default store;
