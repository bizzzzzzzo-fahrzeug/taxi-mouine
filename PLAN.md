# Implementation Plan: Taxi Mouine

## Overview

Full-stack taxi booking platform for a single independent driver in Mönchengladbach:
- Website for customer bookings
- Customer Android app (APK)
- Driver Android app (APK)
- Backend with real-time tracking, push notifications, fare estimation

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Maps | Leaflet + OpenStreetMap | Free, no API key needed, German coverage excellent |
| Routing | OSRM | Free, can self-host, accurate for Germany |
| Database | MongoDB | Flexible schema, easy to start, Socket.io+Mongo change streams |
| Real-time | Socket.io | Proven, fallback to long-polling, simple API |
| Mobile | React Native + Expo | Single codebase, built-in push, easy APK build |
| Auth | JWT (access + refresh) | Stateless, mobile-friendly |
| Hosting (recommended) | Hetzner CX22 (€4/mo) | German datacenter, GDPR compliant, cheap |

## Task List

### Phase 1: Backend Foundation

- [x] Spec & Plan approved

- [ ] **Task 1: Project scaffolding + MongoDB models**
  - Express server, Mongoose connect, User + Ride schemas
  - `npm run dev` starts the server
  - Verify: `curl localhost:6868/api/health` returns OK

- [ ] **Task 2: JWT auth (register + login)**
  - POST /api/auth/register (customer, driver)
  - POST /api/auth/login (returns JWT)
  - POST /api/auth/refresh
  - Password hashing with bcrypt
  - Verify: register + login flow works via curl

- [ ] **Task 3: Fare estimation**
  - POST /api/fare/estimate → { pickup, dropoff }
  - OSRM routing for distance + duration
  - Configurable rate: €4 base + €2/km (Mönchengladbach rates)
  - Verify: estimate returns sensible fare for known route

### Checkpoint: Backend
- [ ] All API endpoints return correct JSON
- [ ] Auth protects private routes
- [ ] Fare estimate matches expected math

### Phase 2: Customer Website

- [ ] **Task 4: React website setup + landing page**
  - Vite + React + Tailwind + react-leaflet
  - German UI: "Taxi Mouine — Ihr Taxi in Mönchengladbach"
  - Hero section with booking CTA, phone number, WhatsApp button
  - Verify: site renders at localhost:5173

- [ ] **Task 5: Booking form with map**
  - Pickup address input with autocomplete (Nominatim geocoding)
  - Dropoff address input
  - Leaflet map showing both markers
  - "Jetzt buchen" (Book now) and "Für später buchen" (Book later) buttons
  - Verify: can select pickup/dropoff on map, form shows valid data

- [ ] **Task 6: Fare display + confirm booking**
  - Show estimated fare after route calculation
  - Ride summary: pickup → dropoff, distance, duration, price
  - Confirm button creates ride via API
  - Redirect to ride tracking page
  - Verify: booking appears in database after confirm

- [ ] **Task 7: Ride tracking page + history**
  - Real-time ride status (angenommen → unterwegs → abgeschlossen)
  - Driver location on map (via Socket.io when active)
  - Booking history list for customer
  - Cancel button (if status is pending)
  - Verify: can see ride status update in real-time

### Checkpoint: Customer Website
- [ ] Full booking flow works end-to-end
- [ ] Fare calculation correct
- [ ] Status updates show in real-time

### Phase 3: Customer Mobile App

- [ ] **Task 8: React Native customer app**
  - Expo project with shared API client
  - Login/register screen
  - Booking form with map (react-native-maps)
  - Ride tracking screen
  - Booking history
  - German UI
  - Verify: runs on Expo Go on Android device

- [ ] **Task 9: Push notifications (customer)**
  - FCM setup
  - Customer gets notified when driver accepts / ride completes
  - Store FCM token on login
  - Verify: notification arrives on test device

### Checkpoint: Customer App
- [ ] Customer can book via app
- [ ] Push notifications arrive
- [ ] Same features as website

### Phase 4: Driver App

- [ ] **Task 10: Driver React Native app**
  - Login with driver credentials
  - Online/offline toggle
  - Incoming booking request screen with sound/vibration
  - Accept / reject buttons
  - Ride details: pickup, dropoff, customer phone, fare
  - Navigation button (opens Google Maps with destination)
  - German UI
  - Verify: driver sees incoming bookings

- [ ] **Task 11: Driver real-time + history**
  - Background location sharing (when online + on a ride)
  - Ride history list with earnings
  - Push notifications for new bookings
  - Status updates sync with customer
  - Verify: customer sees driver location moving on map

### Checkpoint: Driver App
- [ ] Driver receives bookings in real-time
- [ ] Location sharing works
- [ ] Full ride lifecycle: request → accept → complete

### Phase 5: Scheduling + Polish

- [ ] **Task 12: Scheduled bookings ("Für später buchen")**
  - Time/date picker in booking form
  - Backend stores scheduledAt field
  - Driver sees upcoming scheduled rides
  - Booking becomes active at scheduled time
  - Verify: scheduled booking appears at correct time

- [ ] **Task 13: German language review + error states**
  - All UI strings in German
  - Loading states, error messages, empty states
  - Input validation messages auf Deutsch
  - 404 page, network error handling
  - Verify: no English UI text remains

- [ ] **Task 14: APK builds + deploy**
  - `npx expo build:android` → APK files
  - Deploy backend on Hetzner VPS (or chosen host)
  - Docker setup for backend
  - PM2 or systemd for process management
  - Verify: both APKs install and run on Android 12+

### Final Checkpoint
- [ ] All acceptance criteria from SPEC.md met
- [ ] Customer can book via website or app
- [ ] Driver receives and manages bookings via app
- [ ] Real-time tracking works
- [ ] APKs installable
- [ ] Hosting live

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| OSRM rate limits on public instances | Med | Self-host OSRM or cache routes |
| React Native map performance on low-end Android | Med | Use lightweight map tiles, test on real device |
| Notifications delayed on Chinese/cheap Android phones | Low | FCM high-priority, test with brother's phone |
| Expo APK size large | Low | Use EAS Build with app thinning |
| German taxi rate changes | Low | Make rate configurable via env/admin API |

## Open Questions

- Hosting: I recommend Hetzner CX22 (€4/mo, German datacenter). Let me know when you decide.
