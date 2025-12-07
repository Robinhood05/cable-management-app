# SOHEL❤️SWEET CABLE NETWORK

A comprehensive web-based billing management system for cable network businesses with support for 200+ customers across multiple villages.

## Features

### Admin Panel
- **Secure Admin Login** - JWT-based authentication
- **Customer Management** - Add, edit, delete customers
- **Monthly Billing System** - Track payments month-wise with color-coded status
- **Customer Details** - View total due, last 6-month history, payment timeline
- **Dashboard Analytics** - Total customers, total due, collections, village-wise summary
- **Payment Request Verification** - Approve/reject customer payment requests

### User Panel (Customers)
- **Simple Login** - Login using Name + Phone + Village (no password)
- **View Due Amount** - See total due and month-wise payment status
- **Submit Payment** - Submit bKash payment requests with transaction ID
- **Payment History** - View last 6 months payment history

## Tech Stack

- **Frontend**: Next.js 13, React, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd sohel-sweet-cable-network
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory (see `.env.example`):
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key_minimum_32_characters
```

4. Create the first admin user
After starting the server, create an admin user by making a POST request:
```bash
curl -X POST http://localhost:3000/api/setup/create-admin-direct \
  -H "Content-Type: application/json"
```

Or use the direct route with specific credentials:
```bash
curl -X POST http://localhost:3000/api/setup/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123","name":"Admin"}'
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Netlify

See [NETLIFY_DEPLOY.md](./NETLIFY_DEPLOY.md) for detailed deployment instructions.

Quick steps:
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

## Database Schema

### Customers Collection
```javascript
{
  "_id": ObjectId,
  "name": String,
  "phone": String (optional),
  "village": String,
  "billAmount": Number (optional),
  "createdAt": Date,
  "updatedAt": Date
}
```

### Payments Collection
```javascript
{
  "_id": ObjectId,
  "customerId": ObjectId (ref: Customer),
  "month": String (format: "2025-01"),
  "status": "paid" | "unpaid",
  "paidAt": Date,
  "transactionId": String,
  "verifiedByAdmin": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Payment Requests Collection
```javascript
{
  "_id": ObjectId,
  "name": String,
  "phone": String,
  "village": String,
  "customerId": ObjectId (ref: Customer, optional),
  "transactionId": String,
  "month": String (format: "2025-01"),
  "amount": Number,
  "screenshotURL": String (optional),
  "verified": Boolean,
  "verifiedBy": ObjectId (ref: Admin),
  "verifiedAt": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Admin Collection
```javascript
{
  "_id": ObjectId,
  "email": String (unique),
  "password": String (hashed),
  "name": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

## Usage

### Admin Login
1. Navigate to `/admin/login`
2. Enter admin email and password
3. Access dashboard, customers, and payment requests

### Customer Login
1. Navigate to `/user/login`
2. Enter name, phone, and village
3. View dashboard and submit payments

## API Routes

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/user/login` - User login

### Customers
- `GET /api/customers` - Get all customers (Admin only)
- `POST /api/customers` - Create customer (Admin only)
- `GET /api/customers/[id]` - Get customer details (Admin only)
- `PUT /api/customers/[id]` - Update customer (Admin only)
- `DELETE /api/customers/[id]` - Delete customer (Admin only)
- `GET /api/customers/[id]/payments` - Get customer payments
- `GET /api/customers/[id]/analytics` - Get customer analytics

### Payments
- `PUT /api/payments` - Update payment status (Admin only)

### Payment Requests
- `GET /api/payment-requests` - Get payment requests (Admin only)
- `POST /api/payment-requests` - Submit payment request (Public)
- `POST /api/payment-requests/[id]/verify` - Verify payment request (Admin only)

### Dashboard
- `GET /api/dashboard` - Get admin dashboard data
- `GET /api/user/dashboard` - Get user dashboard data

## Security Notes

- **IMPORTANT**: Change `JWT_SECRET` in production (use at least 32 random characters)
- Disable `/api/setup/create-admin` and `/api/setup/create-admin-direct` routes in production after creating admin
- Use HTTPS in production (Netlify provides this automatically)
- Implement rate limiting for API routes
- Add input validation and sanitization
- Never commit `.env.local` or `.env` files to Git
- Use Netlify environment variables for production secrets

## License

This project is open source and available under the MIT License.
