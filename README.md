# Eudora Premium Salon Management System

## Project Overview
Eudora Premium Salon is a full-stack, luxury-themed salon management and booking platform. The platform is designed with a high-end, dynamic user interface tailored for premium salon chains. It features two completely separate portals: a public-facing portal for customers to book appointments, and a secure internal portal for salon staff and administrators to manage outlet schedules and active slots.

## Features
- **Role-Based Access Control (RBAC):** Secure access levels for Users, Salon Staff, and System Admins.
- **Outlet-Based Scheduling:** Customers can select specific salon outlets (e.g., Wadala East, Matunga) and view available slots dynamically based on that specific outlet's schedule.
- **Dynamic Slot Management:** Salon staff can log into their designated outlet dashboard to toggle specific time slots on or off in real-time.
- **Secure Authentication:** JSON Web Tokens (JWT) stored in strict HTTP-only cookies with cross-domain support for secure production deployment.
- **Luxury UI/UX:** Built with a custom CSS design system featuring glassmorphism, smooth gradients, and micro-animations via Framer Motion.

## Tech Stack
- **Frontend:** React, Vite, Zustand (State Management), Framer Motion (Animations), Axios, CSS Modules.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB, Mongoose ORM.
- **Authentication:** JWT (JSON Web Tokens), bcryptjs.
- **Deployment:** Ready for Vercel (Frontend & Serverless Backend) and Render.

## Installation Steps

### Prerequisites
- Node.js installed on your machine
- A MongoDB Atlas account (or local MongoDB server)

### 1. Clone the Repository
```bash
git clone https://github.com/ChiragPednekar/Eudora-salon.git
cd Eudora-salon
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory (optional for local dev, required for prod):
```env
VITE_API_URL=http://localhost:5001
```
Start the frontend development server:
```bash
npm run dev
```

## Screenshots
*(Add your screenshots to a `screenshots` folder in the root directory to display them here)*

![Customer Booking Page](./screenshots/booking.png)
*Customer booking an appointment at a selected outlet.*

![Staff Dashboard](./screenshots/dashboard.png)
*Salon staff managing available time slots for their specific outlet.*

## Folder Structure
```text
Eudora-salon/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route logic (auth, appointments, outlets)
│   │   ├── middleware/      # Auth & Role-based middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   └── utils/           # Helper functions (e.g., generateToken)
│   ├── server.js            # Main backend entry point
│   └── vercel.json          # Serverless deployment config
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (Cards, Buttons)
│   │   ├── pages/           # Main views (Login, Booking, Dashboards)
│   │   ├── store/           # Zustand global state management
│   │   ├── App.jsx          # React Router setup
│   │   └── main.jsx         # Axios config and React Root
│   ├── index.html           # HTML template
│   └── vite.config.js       # Vite bundler configuration
│
└── README.md
```

## Future Improvements
- **Payment Gateway Integration:** Allow users to pay for services online via Stripe or Razorpay.
- **Automated Notifications:** Send SMS or Email reminders to customers 24 hours before their appointments using Twilio/SendGrid.
- **Admin Analytics Dashboard:** Provide graphs and metrics for total revenue and bookings across all outlets.
- **Service Selection:** Allow users to select specific services (e.g., Haircut, Spa) which dynamically adjust the required slot duration.