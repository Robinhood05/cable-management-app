# Netlify Deployment Guide

## Prerequisites

1. A Netlify account (free tier works)
2. MongoDB Atlas account with connection string
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Make sure all environment variables are documented

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18 (or latest LTS)

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

## Step 3: Configure Environment Variables

In Netlify Dashboard:
1. Go to Site settings → Environment variables
2. Add the following variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key_minimum_32_characters
```

**Important**: 
- Use a strong, random JWT_SECRET (at least 32 characters)
- Never commit these to Git
- Use Netlify's environment variables feature

## Step 4: Create Admin User

After deployment, create your admin user by:

1. Using the API endpoint (one-time):
   ```bash
   curl -X POST https://your-site.netlify.app/api/setup/create-admin-direct \
     -H "Content-Type: application/json"
   ```

2. Or use MongoDB Compass/Atlas to create admin directly

## Step 5: Disable Setup Routes (Security)

After creating admin, disable or secure these routes:
- `/api/setup/create-admin`
- `/api/setup/create-admin-direct`

You can do this by:
1. Adding environment variable check
2. Removing the routes
3. Adding IP whitelist

## Build Settings

Netlify will automatically detect Next.js and use:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18 (configured in netlify.toml)

## Custom Domain

1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow DNS configuration instructions

## Continuous Deployment

Netlify automatically deploys when you push to your main branch.

## Troubleshooting

### Build Fails
- Check Node version (should be 18+)
- Verify all dependencies in package.json
- Check build logs in Netlify dashboard

### Environment Variables Not Working
- Ensure variables are set in Netlify dashboard
- Redeploy after adding variables
- Check variable names match exactly

### MongoDB Connection Issues
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Netlify)
- Ensure MongoDB user has proper permissions

### API Routes Not Working
- Check Netlify Functions logs
- Verify Next.js API routes are in `app/api/` directory
- Ensure routes are exported correctly

## Performance Tips

1. Enable Netlify's Edge Functions for better performance
2. Use Netlify's CDN for static assets
3. Enable compression in next.config.js (already enabled)
4. Monitor build times and optimize if needed

## Support

For issues:
- Check Netlify build logs
- Review Next.js documentation
- Check MongoDB Atlas connection status

