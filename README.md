# Pizza Delivery App — OIBSIP Level 3

A beginner-friendly full-stack starter for a pizza delivery application using:
- React (Vite) frontend
- Node.js + Express backend
- MongoDB via Mongoose
- Razorpay test-mode integration scaffold (optional; requires your own test credentials)

## Features
- Browse a sample menu
- Add/remove items from a cart
- Place an order through the API
- Store orders in MongoDB
- Simple admin-style order listing endpoint

> This is a learning starter, not a production-ready food ordering system. Add authentication, validation, rate limiting, payment verification, and security review before deployment.

## Requirements
- Node.js 18+
- MongoDB local installation or MongoDB Atlas connection string

## 1. Backend setup
Open a terminal in `server/`:

```bash
npm install
```

Copy `.env.example` to `.env`, then set `MONGODB_URI`. Razorpay credentials are optional unless testing payments.

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Frontend setup
Open another terminal in `client/`:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## 3. API endpoints
- `GET /api/health` — health check
- `GET /api/menu` — sample menu
- `POST /api/orders` — create an order in MongoDB
- `GET /api/orders` — list orders (development demo only; protect this before deployment)
- `POST /api/payments/order` — create a Razorpay test order if credentials are configured

## Important payment note
This starter only creates a Razorpay order. A real payment integration also needs server-side signature verification using the Razorpay secret and careful order reconciliation. Never put secret keys in React code or commit `.env` files. Do not use real payment credentials in this student demo.
