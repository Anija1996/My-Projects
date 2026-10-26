# ATELIER — MERN Stack E-Commerce Application

This project preserves the existing ATELIER React storefront and adds a Node.js + Express API backed by MongoDB.

## Stack
- **Frontend:** React, Vite, React Router, Bootstrap, Axios
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Authentication:** bcrypt password hashing + JWT
- **Persistence:** MongoDB for users, products, and orders; browser storage remains for the cart and wishlist UI state

## Main features
- Existing ATELIER home page, product catalogue, category filters, search, product details, cart, delivery, checkout confirmation, profile, wishlist, and invoice pages.
- Product catalogue served from MongoDB through REST endpoints.
- User registration and sign-in backed by MongoDB. Passwords are hashed with bcrypt; the API returns a JWT on sign-in.
- Orders are validated and stored in MongoDB for the signed-in user.
- Backend product CRUD endpoints. Product creation, update, and archive require a signed-in account whose email matches `ADMIN_EMAIL`.
- Seed script imports the 24 existing catalogue products into MongoDB.
- Product images are served by the backend from `server/public/products`.
- Existing local catalogue remains as a frontend fallback so the storefront can still be previewed if the API is not configured.

## Requirements
- Node.js 20+ recommended
- npm
- MongoDB running locally **or** a MongoDB Atlas connection string

## Setup

### 1. Configure MongoDB and backend environment
Copy `server/.env.example` to `server/.env` and set values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/atelier
JWT_SECRET=replace-this-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
ADMIN_EMAIL=your-admin-email@example.com
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string. Use a long, private `JWT_SECRET`. Set `ADMIN_EMAIL` to the email address you intend to use for the product-management endpoints.

### 2. Configure frontend API URL
Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install dependencies
Run these commands from the project root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 4. Seed the product catalogue
Make sure MongoDB is running and the server environment is configured, then run:

```bash
npm run seed
```

Expected message: `Seeded 24 ATELIER products.`

You can run the seed command again; it updates existing products by numeric product ID instead of creating duplicates.

### 5. Start frontend and backend
From the project root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API health check: http://localhost:5000/api/health

If you prefer separate terminals:
- Terminal 1: `npm --prefix server run dev`
- Terminal 2: `npm --prefix client run dev`

## API overview

### Authentication
- `POST /api/auth/register` — `{ "name", "email", "password" }`
- `POST /api/auth/login` — `{ "email", "password" }`, returns `{ "token", "user" }`
- `GET /api/auth/me` — current signed-in user (Bearer token required)

### Products
- `GET /api/products` — list active products
- `GET /api/products?category=Outerwear` — filter by category
- `GET /api/products?search=linen` — search product names
- `GET /api/products/:id` — product details
- `POST /api/products` — create a product (admin token required)
- `PUT /api/products/:id` — update a product (admin token required)
- `DELETE /api/products/:id` — archive a product (admin token required)

### Orders
All order endpoints require `Authorization: Bearer <token>`.
- `GET /api/orders` — list orders for the signed-in user
- `GET /api/orders/:id` — get one of that user's orders
- `POST /api/orders` — create an order using `{ "items", "delivery", "discountCode" }`

The API recalculates prices from the database when placing an order rather than trusting client-submitted prices. Supported discount codes: `ATELIER10` and `ATELIER20`.

## Important notes
- This is a learning/demo project, not a production-ready payment system. Checkout records an order; it does **not** process real payments.
- Do not commit `.env` files or expose MongoDB credentials/JWT secrets.
- The current cart and wishlist remain in browser storage. Accounts and orders are database-backed. Do not store sensitive payment credentials in localStorage.
- Product mutations are restricted to the email configured in `ADMIN_EMAIL`.
