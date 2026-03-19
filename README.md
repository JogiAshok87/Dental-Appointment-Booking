# 🦷 DentCare — Dental Appointment Booking Platform

A full-stack MERN application for booking dental appointments. Patients browse dentists and book appointments; admins manage everything through a protected dashboard.

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:5000/api` |

**Admin credentials:** `admin` / `admin123`

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS, Fetch API |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Validation | express-validator |

---

## 📁 Project Structure

```
dentist-app/
├── backend/
│   ├── models/
│   │   ├── Dentist.js          # Dentist schema
│   │   ├── Appointment.js      # Appointment schema
│   │   └── Admin.js            # Admin/auth schema
│   ├── routes/
│   │   ├── dentists.js         # GET/POST/PUT/DELETE /api/dentists
│   │   ├── appointments.js     # GET/POST/PUT/DELETE /api/appointments
│   │   └── auth.js             # POST /api/auth/login, GET /api/auth/me
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── errorHandler.js     # Global error handler
│   ├── seed/
│   │   └── seed.js             # Seed dentists + admin user
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js           # Sticky responsive navigation
    │   │   ├── DentistCard.js      # Dentist listing card
    │   │   ├── BookingModal.js     # Appointment booking form + success
    │   │   ├── AddDentistModal.js  # Admin: add dentist form
    │   │   ├── StatusBadge.js      # Appointment status pill
    │   │   ├── Pagination.js       # Reusable paginator
    │   │   └── LoadingSpinner.js   # Spinner + skeleton card
    │   ├── pages/
    │   │   ├── DentistListPage.js  # Public: browse + search dentists
    │   │   ├── AdminPage.js        # Protected: admin dashboard
    │   │   └── AdminLoginPage.js   # Admin login
    │   ├── context/
    │   │   └── AuthContext.js      # JWT auth state + login/logout
    │   ├── hooks/
    │   │   └── useData.js          # useDentists, useAppointments, useStats
    │   ├── utils/
    │   │   └── api.js              # Centralized Fetch API wrapper
    │   ├── App.js                  # Routes + ProtectedRoute
    │   ├── index.js
    │   └── index.css               # Tailwind directives + custom utilities
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/JogiAshok87/Dental-Appointment-Booking.git
cd dentist-app

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env:
#   MONGODB_URI=''
#   JWT_SECRET=''
#   PORT=5000
#   FRONTEND_URL=http://localhost:3000

# Frontend
cp frontend/.env.example frontend/.env
# REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd backend
npm run seed
# Creates 8 sample dentists + admin user (admin/admin123)
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm start
```

App opens at **http://localhost:3000**

---

## 🗄️ MongoDB Schema Design

### Dentist
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| photo | String | URL |
| qualification | String | e.g. BDS, MDS |
| specialization | String | e.g. Orthodontics |
| yearsOfExperience | Number | required |
| clinicName | String | required |
| address | String | required |
| location | String | city, indexed |
| consultationFee | Number | default 500 |
| rating | Number | 0–5 |
| availableDays | [String] | days array |
| isActive | Boolean | soft-delete flag |

### Appointment
| Field | Type | Notes |
|-------|------|-------|
| patientName | String | required |
| age | Number | 1–120 |
| gender | String | Male/Female/Other |
| appointmentDate | Date | must be future |
| dentist | ObjectId | ref: Dentist |
| phone | String | optional |
| email | String | optional |
| reason | String | visit reason |
| notes | String | max 500 chars |
| status | String | Booked/Confirmed/Completed/Cancelled |

### Admin
| Field | Type | Notes |
|-------|------|-------|
| username | String | unique |
| password | String | bcrypt hashed |
| role | String | admin/superadmin |
| isActive | Boolean | account status |

---

## 📡 API Reference

### Dentists
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dentists` | — | List with search/filter/pagination |
| GET | `/api/dentists/:id` | — | Single dentist |
| POST | `/api/dentists` | ✅ Admin | Add dentist |
| PUT | `/api/dentists/:id` | ✅ Admin | Update dentist |
| DELETE | `/api/dentists/:id` | ✅ Admin | Soft-delete |
| GET | `/api/dentists/meta/locations` | — | Unique locations |

#### Query params for GET /api/dentists
- `search` — text search
- `location` — filter by city
- `page` — default 1
- `limit` — default 12

### Appointments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/appointments` | ✅ Admin | List with filters |
| GET | `/api/appointments/stats` | ✅ Admin | Counts by status |
| POST | `/api/appointments` | — | Create appointment |
| PUT | `/api/appointments/:id/status` | ✅ Admin | Change status |
| DELETE | `/api/appointments/:id` | ✅ Admin | Delete |

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Get JWT token |
| GET | `/api/auth/me` | ✅ Admin | Current user |

---

## ✨ Features Implemented

### Core
- [x] Dentist listing with photo, name, qualification, experience, clinic, location
- [x] Responsive grid layout (1/2/3 columns)
- [x] Book appointment flow with form validation
- [x] Appointment stored in MongoDB, success confirmation shown
- [x] Admin panel: all appointments in table + mobile cards
- [x] Admin panel: dentist management table

### Bonus
- [x] Admin authentication (JWT)
- [x] Dentist search by name/specialization
- [x] Location filter with pill UI
- [x] Appointment status management (Booked / Confirmed / Completed / Cancelled)
- [x] Pagination (both dentists and appointments)
- [x] Full form validation (frontend + backend)
- [x] Loading states (skeleton cards + spinners)
- [x] Error states with clear messaging
- [x] Responsive design (mobile-first)
- [x] Appointment statistics dashboard

---

## 🏗 Architecture

```
Client (React)
    │
    ├── AuthContext (JWT stored in localStorage)
    ├── Custom Hooks (useDentists, useAppointments)
    └── Fetch API → REST API
                        │
                    Express.js
                        │
                    ├── Routes (dentists, appointments, auth)
                    ├── Middleware (JWT protect, error handler, validation)
                    └── Mongoose ODM
                                │
                            MongoDB
```

**Key design decisions:**
- Centralized `api.js` utility — all fetch calls in one place, token injection automatic
- Custom hooks abstract data fetching with loading/error/refetch pattern
- JWT stored in localStorage; every admin API call auto-injects Bearer token
- Soft-delete for dentists (isActive flag) preserves appointment history
- Backend validation with `express-validator` + Mongoose schema validation
- Global error handler normalizes all error responses
