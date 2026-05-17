# Spec: Taxi Mouine

## Objective

A full booking platform for Taxi Mouine — a single independent taxi driver in Mönchengladbach, Germany. Customers book rides via a website or Android app; the driver receives and manages bookings through a driver app.

**Users:**
- **Customers** — Book rides, view fare estimates, track taxi on map, contact via WhatsApp, see booking history
- **Driver (Mouine)** — Receive booking requests, accept/reject rides, view navigation, manage history, get push notifications

**Success criteria:**
- Customer can book a ride in < 30 seconds
- Driver receives booking notification within 2 seconds
- Fare calculator matches typical Mönchengladbach taxi rates
- All German-language UI

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express 5 + Socket.io |
| Database | MongoDB 7 + Mongoose |
| Real-time | Socket.io (ride status, driver location) |
| Auth | JWT (access + refresh tokens) |
| Maps | Leaflet + OpenStreetMap (free, no API key) |
| Geocoding | Nominatim (free) |
| Routing | OSRM (free, self-hostable) |
| Push | Firebase Cloud Messaging |
| Website | React 18 + Tailwind CSS + Leaflet |
| Mobile apps | React Native + Expo |
| Payments | Cash / PayPal or Stripe (optional) |

## Commands

```
Backend:
  npm run dev       → nodemon src/server.js
  npm start         → node src/server.js
  npm test          → jest --coverage

Website:
  npm run dev       → vite dev
  npm run build     → vite build

Mobile:
  npx expo start    → development server
  npx expo build:android  → APK build
```

## Project Structure

```
taxi-mouine/
├── backend/
│   ├── src/
│   │   ├── server.js           # Entry point
│   │   ├── config/             # DB, FCM, env
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routes
│   │   ├── middleware/         # Auth, validation
│   │   ├── socket/             # Socket.io events
│   │   └── services/           # Maps, FCM, WhatsApp
│   ├── tests/
│   └── package.json
├── website/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
├── mobile/
│   ├── apps/
│   │   ├── customer/           # Expo app for customers
│   │   └── driver/             # Expo app for driver
│   └── shared/                 # Shared components/types
└── docs/
```

## Data Model

### Users
```
User {
  _id, name, phone, email, role (customer|driver|admin),
  passwordHash, createdAt, fcmToken
}
```

### Rides (Bookings)
```
Ride {
  _id, customerId, driverId,
  pickup: { address, lat, lng },
  dropoff: { address, lat, lng },
  status: pending|accepted|arrived|in_progress|completed|cancelled,
  estimatedFare, actualFare, distance, duration,
  bookedAt, acceptedAt, completedAt,
  paymentMethod: cash|card
}
```

### DriverLocation (in-memory via Socket.io / Redis)
```
DriverLocation {
  driverId, lat, lng, heading, isOnline, lastUpdated
}
```

## API Design

### Auth
```
POST /api/auth/register   → customer signup
POST /api/auth/login      → login (returns JWT)
POST /api/auth/refresh    → refresh token
```

### Bookings
```
POST   /api/rides              → create booking
GET    /api/rides/:id          → get ride details
PATCH  /api/rides/:id/status   → update status
GET    /api/rides/history      → customer booking history
GET    /api/rides/driver/history → driver booking history
```

### Driver
```
GET  /api/driver/location     → get current location
POST /api/driver/location     → update location (from app)
GET  /api/driver/status       → online/offline
```

### Fare
```
POST /api/fare/estimate → estimate fare (pickup → dropoff)
```

## Real-time Events (Socket.io)

### Client → Server
```
customer:request_ride    → { pickup, dropoff }
customer:cancel_ride     → { rideId }
driver:accept_ride       → { rideId }
driver:reject_ride       → { rideId }
driver:location_update   → { lat, lng, heading }
driver:status_change     → { isOnline }
```

### Server → Client
```
driver:new_booking       → { ride details }       (to driver)
customer:driver_accepted → { driver, eta }         (to customer)
customer:driver_location → { lat, lng, heading }   (to customer)
ride:status_changed      → { rideId, status }      (to both)
```

## Code Style

```javascript
// ES modules, async/await, PascalCase for models
import mongoose from 'mongoose'

const rideSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickup: {
    address: String,
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true })
```

- 2-space indent, single quotes, semicolons
- Async/await, no callbacks
- PascalCase for models, camelCase for variables
- Error-first responses: `{ success: false, error: 'message' }`

## Testing Strategy

- **Backend:** Jest + supertest (unit + integration)
- **Website:** Vitest + React Testing Library
- **Mobile:** Jest + React Native Testing Library
- Coverage target: 80% for backend routes, 70% for frontend components

## Phased Delivery Plan

### Phase 1 — Foundation (Backend + Database)
- MongoDB models, Express server, JWT auth, basic API routes
- Fare estimation via OSRM
- Socket.io setup

### Phase 2 — Website (Customer Frontend)
- React landing page with booking form
- Map with pickup/dropoff selection
- Fare display, ride tracking
- Booking history page

### Phase 3 — Customer Mobile App (Android APK)
- React Native customer app
- Same features as website + push notifications

### Phase 4 — Driver Mobile App (Android APK)
- React Native driver app
- Receive booking requests, accept/reject
- Navigation view, earnings tracking

### Phase 5 — Polish & Deploy
- German language throughout
- FCM push notifications
- Deploy backend on VPS (Hetzner — Germany-based)
- Publish APKs

## Boundaries

- **Always:** Validate all inputs, return proper error codes, German UI texts, run tests before marking done
- **Ask first:** Adding paid APIs (Google Maps), changing database, adding payment gateway, deploying
- **Never:** Hardcode credentials (use .env), expose driver location to non-customers, skip input validation

## Decisions (from Mouine's brother)

1. **Payments:** Cash only (no PayPal/Stripe)
2. **Hosting:** TBD — recommendation: Hetzner German VPS (~€5/mo)
3. **WhatsApp/Driver phone:** +49 163 3315888
4. **Scheduling:** Yes — support "book for later" with pickup time selector
