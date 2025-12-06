# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 3. Create First Admin User

**Option 1: Using API Endpoint (Recommended for first setup)**
```bash
curl -X POST http://localhost:3000/api/setup/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin"
  }'
```

**Option 2: Using Script (if ES modules are configured)**
```bash
node scripts/createAdmin.js admin@example.com admin123 Admin
```

**Option 3: Using MongoDB Compass or MongoDB Shell**
```javascript
use your_database_name
db.admins.insertOne({
  email: "admin@example.com",
  password: "$2a$10$hashed_password_here", // Use bcrypt to hash
  name: "Admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access the Application
- Home: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- User Login: http://localhost:3000/user/login

## First Steps After Setup

1. **Login as Admin**
   - Use the credentials you created in step 3
   - Navigate to `/admin/login`

2. **Add Customers**
   - Go to Customers page
   - Click "Add Customer"
   - Fill in customer details (Name, Phone, Village, Monthly Bill Amount)

3. **Set Up Monthly Payments**
   - Go to a customer's detail page
   - Use the payment timeline to mark months as paid/unpaid
   - Payments are tracked month-wise (format: YYYY-MM)

4. **Customer Login**
   - Customers can login using their Name, Phone, and Village
   - They can view their due amount and submit payment requests

5. **Verify Payment Requests**
   - Admin can view pending payment requests in the Payment Requests page
   - Approve or reject customer payment submissions
   - Approved payments automatically mark the customer's month as paid

## Important Notes

- **Security**: After creating the admin, disable or secure the `/api/setup/create-admin` route in production
- **JWT Secret**: Use a strong, random JWT secret in production
- **MongoDB**: Ensure your MongoDB connection string is correct and the database is accessible
- **HTTPS**: Use HTTPS in production for secure authentication

## Troubleshooting

### Admin Login Not Working
- Verify admin was created successfully in MongoDB
- Check JWT_SECRET is set in `.env.local`
- Ensure MongoDB connection is working

### Customer Login Not Working
- Verify customer exists in database
- Check that Name, Phone, and Village match exactly (case-insensitive for name and village)

### Payment Not Updating
- Check admin authentication token is valid
- Verify customer ID and month format (YYYY-MM)
- Check MongoDB connection

## Production Deployment

1. Set environment variables in your hosting platform
2. Disable `/api/setup/create-admin` route
3. Use strong JWT_SECRET
4. Enable HTTPS
5. Set up MongoDB Atlas with proper security (IP whitelist, authentication)
6. Build the application: `npm run build`
7. Start production server: `npm start`

