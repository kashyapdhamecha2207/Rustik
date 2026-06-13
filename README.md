# Rustik Academy Salon Management & Portfolio Platform

A premium, modern, and production-ready Salon Management & Portfolio Platform designed for **Rustik Academy** (luxury salon/barber studio).

The platform serves two purposes:
1. **Elegant Customer Portfolio Website**: Interactive grooming menu, master barber portfolios, filterable cuts gallery, before & after sliders, video reels, and an online booking form.
2. **Business Management System**: Secure role-based dashboard for Owners, Managers, Barbers, and Staff. Track today's revenue/customers, view charts, schedule appointments, log expenses, manage employees/attendance, update website copy via CMS, and download audited reports (PDF/Excel).

---

## 🎨 Brand Identity & Styling
- **Primary**: Deep Forest Green (`#0F2E16`)
- **Secondary**: Luxury Gold (`#C8A96B` / Linear Gold Gradient)
- **Accent**: Rich Black (`#080C09` / Obsidian Green Dark Themes)
- **Background**: Luxury Off White (`#F8F8F8`)
- **Typography**: Google Fonts - *Playfair Display* (luxury headers) and *Inter* / *Outfit* (sleek dashboard counters).
- **Aesthetics**: Custom glassmorphism cards, glowing elements, custom scrollbars, and premium hover translations.

---

## 🏗️ Monorepo Directory Structure

```
Rustik/
├── backend/
│   ├── .db/                    # Auto-generated JSON files (database fallback)
│   ├── config/
│   │   └── db.js               # MongoDB connector & mock switcher
│   ├── middleware/
│   │   └── auth.js             # JWT & Role-based authentication middleware
│   ├── models/                 # Mongoose schemas (wrapped for JSON fallback)
│   │   ├── User.js, Customer.js, Appointment.js, Service.js, Expense.js, CMS.js
│   ├── routes/                 # Express API routes
│   │   ├── auth.js, appointments.js, services.js, customers.js, finance.js, cms.js, reports.js
│   ├── utils/
│   │   ├── mockDb.js           # JSON filesystem database CRUD engine
│   │   └── seeder.js           # Default data seeder (users, CMS copy, analytics)
│   ├── server.js               # Express server entry point (Port 5001)
│   └── .env                    # Server environment variables
├── frontend/
│   ├── src/
│   │   ├── components/         # Premium UI & Layouts (Customer, Dashboard)
│   │   ├── context/            # AuthContext (sessions, login, logout)
│   │   ├── pages/
│   │   │   ├── Login.tsx       # Secure gatekeeper page
│   │   │   ├── website/        # Home, Services, Gallery, Artists, Locations, Contact
│   │   │   └── dashboard/      # Overview, Appointments, Customers, Employees, Finance, CMS, Reports
│   │   └── utils/
│   │       └── api.ts          # API client fetch wrapper (injects bearer JWT)
│   └── package.json            # Vite, React 19, Tailwind v4 configurations
├── package.json                # Monorepo scripts (concurrent dev mode)
└── README.md                   # System documentation
```

---

## ⚡ Quick Start (Local Launch)

The backend features a **zero-config database fallback**. If no `MONGO_URI` is provided in `.env`, the server automatically initializes a local JSON database inside `backend/.db/` and seeds mock metrics.

### 1. Install Dependencies
Run the installation script at the root directory:
```bash
npm run install:all
```
*This installs node modules for both `backend` and `frontend` folders.*

### 2. Start Services
Run the concurrent dev script:
```bash
npm run dev
```
- **Frontend client**: http://localhost:5173
- **Backend API server**: http://localhost:5001 (Health check: http://localhost:5001/api/health)

---

## 🔐 Credentials for Verification (Mocked Accounts)

All accounts default to password `password123`:
1. **Studio Owner**: `owner@rustik.com` (full access to finances, employee performance, CMS, and reports)
2. **Studio Manager**: `manager@rustik.com` (full access to finances, employees, CMS, and reports)
3. **Desk Staff**: `staff@rustik.com` (access to bookings, client directory, and attendance rosters)
4. **Master Barber**: `marcus@rustik.com` (access to personal schedule and appointment completion logs)

---

## 🛠️ API Routes Directory

### Auth & Staff (`/api/auth`)
- `POST /login` - Public. Checks password and returns JWT.
- `POST /register` - Protected (Owner/Manager). Add new employee.
- `GET /profile` - Protected. Returns logged-in profile.
- `GET /barbers` - Public. List active barbers for booking widgets.
- `GET /employees` - Protected (Owner/Manager). List employee roster.
- `PATCH /employees/:id/status` - Protected. Deactivate/Activate staff.
- `POST /employees/:id/attendance` - Protected. Log shifts status.

### Appointments (`/api/appointments`)
- `GET /` - Protected. Retrieves bookings list (barbers are constrained to self-only).
- `POST /` - Public. Client online booking. Searches customer phone; if not present, registers customer profile automatically.
- `PATCH /:id/status` - Protected. Update status (`pending`, `confirmed`, `completed`, `cancelled`). *Completing appends visitor history logs.*
- `PUT /:id` - Protected. Edit details.
- `DELETE /:id` - Protected (Owner/Manager). Remove booking.

### Services Catalog (`/api/services`)
- `GET /` - Public. List prices.
- `POST /` - Protected (Owner/Manager). Create styling service.
- `DELETE /:id` - Protected. Delete service.

### Customer Database (`/api/customers`)
- `GET /` - Protected. List & search client directory.
- `POST /` - Protected. Manually log phone walk-in customer.
- `PUT /:id` - Protected. Update preferences & styling notes.

### Cashflow & Ledger (`/api/finance`)
- `GET /analytics` - Protected (Owner/Manager). Calculates 6-month growth charts, top services pie ratios, and barber sales commissions.
- `GET /expenses` - Protected. List expense ledger.
- `POST /expenses` - Protected. Record business expenses.

### Report Generator (`/api/reports`)
- `GET /pdf?type=<daily|weekly|monthly|yearly>` - Protected. Download branded PDF summaries.
- `GET /excel?type=<daily|weekly|monthly|yearly>` - Protected. Download audited transaction/expense spreadsheets.

---

## 🚀 Production Deployment Guidelines

### 1. MongoDB Setup
Update `backend/.env` with your MongoDB connection string:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/rustik
```
*The app automatically transitions from files fallback to your MongoDB cluster.*

### 2. Cloudinary Setup (Optional)
To support live photo uploads in CMS, register a Cloudinary bucket and configure the credentials in `backend/.env` to pipe the files.

### 3. Build & Deploy
- **Frontend (Vite/React)**: Deploy on **Vercel** or Netlify. Set up build script `npm run build` and output directory `dist/`.
- **Backend (Express)**: Deploy on **Render** or Railway. Set environment variables (`PORT`, `JWT_SECRET`, `MONGO_URI`) in the host platform settings.
- **CORS Configuration**: In `backend/server.js`, configure `cors` origin list to match your Vercel deployment URL:
  ```javascript
  origin: 'https://rustik-salon.vercel.app'
  ```
