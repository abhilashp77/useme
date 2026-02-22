# 🚗 UseMe — Driver Hiring App

A full-stack web application where users can hire verified, professional drivers on an hourly or daily basis. Features driver validation, secure payments, a mutual rating system, and a comprehensive admin dashboard.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | `sarah@example.com` | `customer123` |
| Driver | `james@example.com` | `driver123` |
| Admin | `admin@useme.com` | `admin123` |

> **Note:** Data is stored in-memory and resets on server restart. No external database setup required.

---

## 📐 Architecture Overview

```
UseMe/
├── server/                 # Express.js Backend (port 3001)
│   ├── index.js            # Server entry point
│   ├── store.js            # In-memory data store with seed data
│   ├── middleware/
│   │   └── auth.js         # JWT auth & admin middleware
│   └── routes/
│       ├── auth.js         # Register, login, current user
│       ├── drivers.js      # Search, profiles, documents, dashboard
│       ├── bookings.js     # Create, manage, complete bookings
│       ├── payments.js     # Mock payment processing & history
│       ├── ratings.js      # Submit & retrieve ratings
│       └── admin.js        # Dashboard, validation, user mgmt
├── src/                    # Vite + React Frontend (port 5173)
│   ├── App.jsx             # React Router setup
│   ├── main.jsx            # Entry point
│   ├── index.css           # Global design system (dark theme)
│   ├── api/
│   │   └── client.js       # API client with JWT injection
│   ├── context/
│   │   └── AuthContext.jsx # Auth state management
│   ├── components/
│   │   ├── Header.jsx      # Role-based navigation
│   │   ├── Footer.jsx      # App footer
│   │   └── Stars.jsx       # Star rating component
│   └── pages/
│       ├── LandingPage.jsx       # Hero, search, features, top drivers
│       ├── LoginPage.jsx         # Login/register with tabs
│       ├── SearchPage.jsx        # Driver search with filters
│       ├── DriverProfilePage.jsx # Driver details & booking form
│       ├── BookingsPage.jsx      # Customer booking management
│       ├── DriverDashboard.jsx   # Driver earnings & trip mgmt
│       ├── DriverRegisterPage.jsx# Multi-step driver signup
│       └── AdminDashboard.jsx    # Admin panel with all sections
├── package.json
├── vite.config.js          # Vite config with API proxy
└── index.html              # HTML entry with Inter font & SEO
```

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Vite + React 18 | SPA with React Router, vanilla CSS |
| Backend | Express.js | RESTful API, JWT auth |
| Database | In-memory JSON store | Simulates MongoDB; easily swappable |
| Auth | JWT tokens | Bcrypt password hashing |
| Payments | Mock Stripe integration | Simulates payment flow |

---

## 🔌 API Reference

| Route Group | Endpoints | Purpose |
|-------------|-----------|---------|
| `/api/auth` | `POST /register`, `POST /login`, `GET /me` | User registration, login, and session |
| `/api/drivers` | `GET /search`, `GET /:id`, `PUT /profile`, `POST /documents`, `GET /dashboard/stats` | Driver search, profiles, document upload, dashboard |
| `/api/bookings` | `POST /`, `GET /`, `PUT /:id/status`, `POST /:id/complete` | Create/manage bookings |
| `/api/payments` | `POST /process`, `GET /history` | Mock payment processing |
| `/api/ratings` | `POST /`, `GET /driver/:id` | Rate drivers & fetch reviews |
| `/api/admin` | `GET /dashboard`, `GET /drivers`, `PUT /drivers/:id/validate`, `GET /users`, `PUT /users/:id/block`, `GET /payments` | Admin operations |

---

## 🎨 Design System

The app uses a premium **dark-theme** design with:

- **Colors**: Deep navy backgrounds (`#0a0e1a`), electric blue accents, warm amber highlights
- **Typography**: [Inter](https://fonts.google.com/specimen/Inter) from Google Fonts
- **Effects**: Glassmorphism cards, subtle gradients, smooth micro-animations
- **Responsive**: Mobile-first with breakpoints at 768px and 1024px

---

## 🧭 Feature Map

### Customer Portal
- **Landing Page** — Hero section with search bar, feature highlights, top-rated drivers
- **Login / Register** — Tabbed forms with social login placeholders
- **Search Results** — Driver cards with filters (vehicle type, rating, price, location)
- **Driver Profile** — Detailed view with reviews and sticky booking form
- **My Bookings** — Active & past bookings with status tracking and cancellation
- **Rate Driver** — Star rating + text feedback modal after trip completion

### Driver Portal
- **Driver Registration** — Multi-step form: personal info → vehicle details → document upload
- **Driver Dashboard** — Earnings summary, active/completed bookings, notifications
- **Earnings** — Payment history with per-trip breakdown
- **Trip Management** — Accept pending bookings, mark trips as complete

### Admin Dashboard
- **Overview** — KPI cards (total drivers, bookings, revenue, platform earnings)
- **Driver Validation** — Pending applications with document status, approve/reject actions
- **User Management** — All users with block/unblock capabilities
- **Payment Oversight** — Full transaction history with fee breakdown
- **Analytics** — Completion rate, avg booking value, driver approval rate, top performers

---

## ✅ Verification Results

- ✅ Landing page renders with hero, search, features, and driver cards
- ✅ Login/Register flow works with JWT authentication
- ✅ Admin dashboard displays KPIs, recent bookings, and sidebar navigation
- ✅ Driver validation workflow (approve/reject) functional
- ✅ Customer booking flow works end-to-end
- ✅ Both Vite (5173) and Express (3001) servers run without errors

---

## 🔮 Future Enhancements

### Database Integration
- [ ] Replace in-memory store with MongoDB or PostgreSQL
- [ ] Add Prisma or Mongoose ORM for schema management
- [ ] Implement data migrations and seeding scripts

### Authentication & Security
- [x] Add OAuth2 integration (Google, Facebook sign-in) via Firebase Auth
- [ ] Implement refresh token rotation for session persistence
- [ ] Add rate limiting and request throttling
- [ ] Implement CSRF protection
- [ ] Add input sanitization and validation (e.g., Joi, Zod)

### Payment System
- [ ] Integrate Stripe or Razorpay for real payment processing
- [ ] Add wallet/balance system for drivers
- [ ] Implement refund and dispute resolution workflows
- [ ] Add invoice generation (PDF)

### Real-Time Features
- [ ] Add WebSocket (Socket.IO) for live booking status updates
- [ ] Real-time notifications for drivers (new booking, status changes)
- [ ] Live chat between customer and driver
- [ ] GPS-based driver tracking during active trips

### Driver Management
- [ ] Implement actual file upload (S3 / Cloudinary) for documents
- [ ] Add automated background check API integration
- [ ] Driver scheduling and availability calendar
- [ ] Multi-vehicle support per driver

### Customer Experience
- [ ] Saved/favorite drivers list
- [ ] Booking scheduling (advance booking with calendar picker)
- [ ] Push notifications (web push / FCM)
- [ ] In-app customer support / help desk
- [ ] Ride history export (CSV/PDF)

### Admin & Analytics
- [ ] Interactive charts (Chart.js / Recharts) for trends over time
- [ ] Export reports (CSV/PDF) for bookings, payments, users
- [ ] Audit logs for admin actions
- [ ] Configurable platform fee percentage
- [ ] Email notification system (SendGrid / Nodemailer)

### Mobile & Cross-Platform
- [ ] React Native or Flutter for iOS/Android apps
- [ ] Progressive Web App (PWA) with offline support
- [ ] Responsive improvements for tablet breakpoints

### DevOps & Quality
- [ ] Add unit tests (Vitest) and integration tests (Supertest)
- [ ] End-to-end testing with Playwright or Cypress
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker containerization
- [ ] Deploy to cloud (Firebase Hosting, Vercel, Railway, or AWS)
- [ ] Environment variable management (.env files)
- [ ] Logging and monitoring (Winston, Sentry)

### Performance
- [ ] Implement API response caching (Redis)
- [ ] Add lazy loading and code splitting for frontend routes
- [ ] Image optimization and CDN integration
- [ ] Database indexing and query optimization

---

## 📄 License

MIT
