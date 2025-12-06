# Deployment Checklist

## Pre-Deployment

- [ ] All unnecessary files removed
- [ ] Environment variables documented in `.env.example`
- [ ] `.env.local` added to `.gitignore`
- [ ] All dependencies in `package.json`
- [ ] No hardcoded secrets in code
- [ ] Test all features locally

## Netlify Setup

- [ ] Create Netlify account
- [ ] Connect Git repository (GitHub/GitLab/Bitbucket)
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `.next`
  - Node version: 18

## Environment Variables (Netlify)

- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong random secret (32+ characters)

## MongoDB Atlas Setup

- [ ] Create MongoDB Atlas account
- [ ] Create cluster
- [ ] Create database user
- [ ] Whitelist IP addresses (add `0.0.0.0/0` for Netlify)
- [ ] Get connection string
- [ ] Test connection

## Post-Deployment

- [ ] Create admin user via API
- [ ] Test admin login
- [ ] Test customer login
- [ ] Test all CRUD operations
- [ ] Test payment requests
- [ ] Verify analytics work
- [ ] Check mobile responsiveness

## Security

- [ ] Disable setup routes after creating admin
- [ ] Verify HTTPS is enabled (automatic on Netlify)
- [ ] Check JWT_SECRET is strong
- [ ] Review MongoDB user permissions
- [ ] Enable MongoDB Atlas IP whitelist

## Performance

- [ ] Check build time
- [ ] Verify caching works
- [ ] Test page load speeds
- [ ] Monitor API response times

## Documentation

- [ ] Update README with production URL
- [ ] Document admin credentials securely
- [ ] Create backup of MongoDB connection string

