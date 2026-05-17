# OpenCode Session 1: Taxi Mouine

**Date:** 2026-05-17
**Goal:** Build a taxi booking platform (website + Android apps) for a single independent driver in Mönchengladbach, Germany

---

## Skills Used

- `customize-opencode` — added 66 external skills from bizzzzzzzo-fahrzeug/claude-skills
- `git-workflow-and-versioning` — cloned HubTaxi-Server for reference
- `spec-driven-development` — wrote full specification before coding
- `planning-and-task-breakdown` — decomposed into 14 tasks across 5 phases
- `incremental-implementation` — built and verified each task

## External Skills Added

66 domain-specific skills from `https://github.com/bizzzzzzzo-fahrzeug/claude-skills.git`
Copied to `~/.config/opencode/external-skills/`
Registered in `~/.config/opencode/opencode.jsonc` via `skills.paths`

---

## Reference Repo

HubTaxi-Server: `https://github.com/bizzzzzzzo-fahrzeug/HubTaxi-Server.git`
- Node.js/Express 3.x + MongoDB + Socket.io + AngularJS
- Used for data model reference only (too outdated to build on)

## Decisions Made

| Question | Decision |
|---|---|
| Target users | Both customers AND driver (Mouine) |
| Website purpose | Full web booking platform |
| Payments | Cash only |
| Hosting | Hetzner CX22 (€4/mo, German datacenter) |
| Mobile framework | React Native + Expo |
| Maps | Leaflet + OpenStreetMap (free, no API key) |
| Routing | OSRM (free, Haversine fallback) |
| Schedule/book later | Yes — date + time picker |
| Brother's phone | +49 163 3315888 |
| Business name | Taxi Mouine |
| City | Mönchengladbach, Germany |
| Driver status | Independent (no taxi central) |

---

## Project Structure

```
taxi-mouine/
├── SPEC.md                          # Project specification
├── PLAN.md                          # Implementation plan
├── docker-compose.yml               # One-command deploy
├── scripts/
│   └── deploy.sh                    # Hetzner deployment script
│
├── backend/                         # Node.js + Express + MongoDB
│   ├── Dockerfile
│   ├── .env / .env.example
│   ├── src/
│   │   ├── server.js                # Entry point + Express setup
│   │   ├── config/
│   │   │   ├── index.js             # Env config
│   │   │   └── database.js          # Mongoose connection
│   │   ├── models/
│   │   │   ├── User.js              # User schema (customer/driver/admin)
│   │   │   └── Ride.js              # Ride schema with status machine
│   │   ├── routes/
│   │   │   ├── auth.js              # Register, login, refresh, me
│   │   │   ├── fare.js              # POST /api/fare/estimate
│   │   │   ├── rides.js             # CRUD rides, status transitions
│   │   │   └── driver.js            # Driver-specific: pending rides, accept, status
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT auth, role check, token helpers
│   │   ├── services/
│   │   │   └── fare.js              # Fare calculation logic
│   │   └── socket/
│   │       └── index.js             # Socket.io: location sharing, ride events
│   └── tests/
│
├── website/                         # React + Vite + Tailwind + Leaflet
│   ├── Dockerfile
│   ├── nginx.conf                   # Reverse proxy for API + websocket
│   ├── src/
│   │   ├── main.jsx                 # Entry with BrowserRouter
│   │   ├── App.jsx                  # Routes: Home, Booking, Tracking, Login, Register, History
│   │   ├── index.css                # Tailwind + custom classes (all German)
│   │   ├── lib/
│   │   │   └── api.js               # API client with JWT handling
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Nav with auth state
│   │   │   └── Footer.jsx           # Contact, phone, copyright
│   │   └── pages/
│   │       ├── Home.jsx             # Landing: hero, why-us, CTA
│   │       ├── Booking.jsx          # Map + pickup/dropoff + fare + schedule
│   │       ├── Tracking.jsx         # Ride status + map + socket updates
│   │       ├── Login.jsx            # Phone + password auth
│   │       ├── Register.jsx         # Name + phone + password
│   │       └── History.jsx          # Past rides list
│   └── vite.config.js               # Tailwind plugin + proxy config
│
└── mobile/
    ├── shared/
    │   ├── api.js                   # Shared API client
    │   ├── colors.js                # Color constants (yellow theme)
    │   └── socket.js                # Socket.io client
    ├── customer/                    # Customer Android app
    │   ├── App.js                   # Stack navigator
    │   ├── app.json                 # Expo config
    │   ├── src/screens/
    │   │   ├── LoginScreen.js       # Phone/password login
    │   │   ├── RegisterScreen.js    # New account
    │   │   ├── BookRideScreen.js    # Map + book + fare
    │   │   ├── TrackingScreen.js    # Ride status + polling
    │   │   └── HistoryScreen.js     # Past rides
    │   └── package.json
    └── driver/                      # Driver Android app (for Mouine)
        ├── App.js                   # Stack navigator
        ├── app.json                 # Expo config
        ├── src/screens/
        │   ├── DriverLoginScreen.js # Auth (role-checked)
        │   ├── DriverHomeScreen.js  # Online/offline, pending rides, active ride
        │   ├── RideDetailScreen.js  # Map, contact, status actions, navigation
        │   └── DriverHistoryScreen.js # Earnings + ride history
        └── package.json
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/health | — | Health check |
| POST | /api/auth/register | — | Register (customer or driver) |
| POST | /api/auth/login | — | Login, returns JWT |
| POST | /api/auth/refresh | — | Refresh JWT |
| GET | /api/auth/me | JWT | Current user profile |
| POST | /api/fare/estimate | — | Fare estimate from coordinates |
| POST | /api/rides | JWT | Create booking |
| GET | /api/rides/:id | JWT | Get ride details |
| PATCH | /api/rides/:id/status | JWT | Transition ride status |
| GET | /api/rides/history | JWT | Customer ride history |
| GET | /api/driver/rides/pending | JWT+driver | Pending bookings |
| GET | /api/driver/rides/upcoming | JWT+driver | Driver's active rides |
| GET | /api/driver/rides/history | JWT+driver | Driver's completed rides |
| PATCH | /api/driver/rides/:id/accept | JWT+driver | Accept a ride |
| POST | /api/driver/status | JWT+driver | Online/offline toggle |

## Ride Status Machine

```
pending → accepted → arrived → in_progress → completed
  ↓          ↓          ↓
cancelled  cancelled  cancelled
```

---

## Fare Calculation

- Base fare: €4.00 (first 2 km included)
- Per km: €2.00
- Distance: Haversine formula (accurate fallback; OSRM ready)
- Rate configurable via env vars: `FARE_BASE`, `FARE_PER_KM`, `FARE_BASE_KM`

---

## Real-time Architecture

- Socket.io on port 6868 (same as Express)
- Driver location shared via `driver:location_update` events
- Customers listen on `ride:<rideId>` rooms for location + status
- New bookings broadcast to `drivers` room
- Fallback: 5-second polling in customer mobile app

---

## Deployment

**Target:** Hetzner CX22 (€4/mo, German datacenter)

```bash
# From project root:
./scripts/deploy.sh <hetzner-ip>
```

Or manually:
```bash
scp -r . root@<ip>:/opt/taxi-mouine
ssh root@<ip>
cd /opt/taxi-mouine
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env
docker compose up -d --build
```

**APK builds** (requires desktop with Android SDK):
```bash
cd mobile/customer && npx expo build:android
cd mobile/driver && npx expo build:android
```

---

## Cost Breakdown

| Item | Cost |
|---|---|
| Hetzner CX22 VPS | €4/month |
| Domain (taxi-mouine.de) | ~€10/year |
| SSL (via LetsEncrypt/Caddy) | Free |
| Maps (OpenStreetMap + Leaflet) | Free |
| SMS/Push | Free (FCM) |
| **Total** | **~€5/month** |

---

## Future Improvements

1. Switch to OSRM self-hosted for more accurate routing
2. Add Caddy reverse proxy for automatic SSL
3. Add Firebase Cloud Messaging integration for push notifications
4. Set up MongoDB backups (mongodump cron job)
5. Create a management dashboard for ride analytics
6. Add email notifications for booking confirmations

---

## Files Created (59 total)

- 11 backend source files
- 14 website source files
- 17 mobile source files (customer + driver + shared)
- 4 deploy/config files (Docker, docker-compose, nginx)
- 2 spec/plan documents (SPEC.md, PLAN.md)
- 1 deploy script
- 1 Dockerfile for backend
- 1 Dockerfile for website
- 1 nginx config
- 1 docker-compose.yml
- Various config files (package.json, app.json, .env, etc.)
