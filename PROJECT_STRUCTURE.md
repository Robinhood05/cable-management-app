# Project Structure

```
sohel-sweet-cable-network/
│
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel pages
│   │   ├── change-password/     # Change password page
│   │   ├── customers/           # Customer management
│   │   │   ├── [id]/            # Customer details & edit
│   │   │   └── add/              # Add new customer
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── forgot-password/     # Forgot password page
│   │   ├── login/               # Admin login
│   │   ├── payment-requests/    # Payment request management
│   │   └── reset-password/      # Reset password page
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/                # Authentication routes
│   │   │   ├── admin/           # Admin auth (login, password management)
│   │   │   └── user/            # User auth (login)
│   │   ├── customers/           # Customer CRUD operations
│   │   ├── dashboard/           # Dashboard analytics
│   │   ├── payment-requests/    # Payment request handling
│   │   ├── payments/            # Payment management
│   │   ├── setup/               # Setup routes (create admin)
│   │   └── user/                # User dashboard data
│   │
│   ├── user/                     # User panel pages
│   │   ├── dashboard/           # User dashboard
│   │   └── login/               # User login
│   │
│   ├── favicon.ico              # Site favicon
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── page.jsx                 # Home page
│
├── components/                   # React components
│   ├── AdminNavbar.jsx          # Admin navigation bar
│   └── UserNavbar.jsx           # User navigation bar
│
├── libs/                         # Utility libraries
│   ├── api.js                   # API helper functions
│   ├── auth.js                  # JWT authentication utilities
│   ├── middleware.js            # Auth middleware
│   └── mongodb.js               # MongoDB connection (with caching)
│
├── models/                       # MongoDB Mongoose models
│   ├── admin.js                 # Admin model
│   ├── customer.js              # Customer model
│   ├── payment.js               # Payment model
│   └── paymentRequest.js        # Payment request model
│
├── public/                       # Static assets
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore file
├── jsconfig.json                # JavaScript configuration
├── netlify.toml                 # Netlify configuration
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
│
├── NETLIFY_DEPLOY.md            # Netlify deployment guide
├── PERFORMANCE.md               # Performance optimizations
├── PROJECT_STRUCTURE.md         # This file
├── README.md                    # Main documentation
└── SETUP.md                     # Setup instructions
```

## Key Files

### Configuration Files
- `netlify.toml` - Netlify deployment configuration
- `next.config.js` - Next.js build and runtime configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.gitignore` - Files to exclude from Git

### Environment Variables
- `.env.local` - Local development environment variables (not in Git)
- `.env.example` - Template for environment variables

### Documentation
- `README.md` - Main project documentation
- `NETLIFY_DEPLOY.md` - Netlify deployment guide
- `PERFORMANCE.md` - Performance optimization details
- `SETUP.md` - Setup instructions

## Important Notes

1. **Never commit** `.env.local` or `.env` files
2. **Remove setup routes** after creating admin in production
3. All API routes are in `app/api/` directory
4. All pages use Next.js App Router (app directory)
5. Components are reusable React components
6. Models define MongoDB schemas with indexes

