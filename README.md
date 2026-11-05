# NOVARA — MERN E-Commerce Starter

A responsive full-stack commerce application built with React + Vite, Express, MongoDB and Mongoose.

## Requirements
- Node.js 18.18+ (Node 20 LTS recommended)
- MongoDB local service or MongoDB Atlas database
- npm

## 1. Configure the backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set `MONGO_URI`, a long random `JWT_SECRET`, and your admin credentials. For local MongoDB, use `mongodb://127.0.0.1:27017/novara`.

## 2. Add sample data and admin

```bash
npm run seed
npm run create-admin
```

The seed creates demo products and the `WELCOME10` coupon. Admin credentials are read from backend `.env`; change the example password before using the app.

## 3. Start backend

```bash
npm run dev
```

API: http://localhost:5000/api/health

## 4. Start frontend (new terminal)

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env`, then run:

```bash
npm run dev
```

Open http://localhost:5173.

## Demo flows
- Register a normal account, browse products, add to bag, and checkout using Cash on Delivery.
- Sign in with the admin credentials from backend `.env` to access `/admin`.
- Admin can add/edit/delete products, update order status and manage user roles.
- Coupon: `WELCOME10` (10% off; minimum order ₹500).

## API overview
- `/api/auth`: register, login, profile
- `/api/products`: product list, details, admin CRUD, categories
- `/api/orders`: create, own orders, admin list, order status
- `/api/admin`: analytics and user role management
- `/api/wishlist`: persistent wishlist API
- `/api/coupons`: coupon validation

## Notes / production hardening
- Checkout currently supports Cash on Delivery. Online payments are deliberately disabled until a real gateway (for example Razorpay or Stripe) is configured with server-side order creation, signature/webhook verification and secrets. Do not mark an online payment successful from the browser.
- Product images are stored as image URLs in this starter. For production, add an authenticated image upload service such as Cloudinary or S3.
- Cart and the visible wishlist are persisted in browser localStorage. A wishlist REST API is included for account-synced wishlist integration.
- Before deployment, use a strong unique JWT secret, restrict CORS to your deployed frontend, enable MongoDB network restrictions, add HTTPS, logging, backups, request validation, and payment-provider verification.

## Responsive layout
The UI includes mobile navigation, responsive product grids, mobile checkout and cart layouts, and horizontally scrollable admin tables. Test at 375, 425, 768, 1024 and 1440px.
