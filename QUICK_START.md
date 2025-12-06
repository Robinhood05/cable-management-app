# Quick Start Guide

## For Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your MongoDB connection string
   - Add a strong JWT secret

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Create admin user**
   ```bash
   curl -X POST http://localhost:3000/api/setup/create-admin-direct
   ```

5. **Access the application**
   - Home: http://localhost:3000
   - Admin: http://localhost:3000/admin/login
   - User: http://localhost:3000/user/login

## For Netlify Deployment

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

4. **Set Environment Variables**
   In Netlify Dashboard → Site settings → Environment variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = strong random string (32+ characters)

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

6. **Create Admin User**
   After deployment, visit:
   ```
   https://your-site.netlify.app/api/setup/create-admin-direct
   ```

7. **Secure Production**
   - Disable setup routes after creating admin
   - Test all functionality
   - Monitor performance

## Important Notes

- ⚠️ Never commit `.env.local` to Git
- ⚠️ Use strong JWT_SECRET in production
- ⚠️ Disable setup routes after creating admin
- ✅ Netlify provides HTTPS automatically
- ✅ MongoDB Atlas IP whitelist: Add `0.0.0.0/0` for Netlify

## Need Help?

- See `NETLIFY_DEPLOY.md` for detailed deployment guide
- See `DEPLOYMENT_CHECKLIST.md` for pre-deployment checklist
- See `PROJECT_STRUCTURE.md` for project structure

