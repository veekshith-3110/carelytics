# Deployment Guide for Carelytics

This guide will help you deploy the Carelytics application to production.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository access
- Google OAuth credentials (for Google login feature)

## Build Verification

Before deploying, ensure the build passes:

```bash
npm run build
```

This should complete without errors. If you see any errors, fix them before proceeding with deployment.

## Environment Variables

Create a `.env.local` file (or set environment variables in your deployment platform) with:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure the OAuth consent screen
6. Add authorized JavaScript origins and redirect URIs
7. Copy the Client ID to your environment variables

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

Vercel is the easiest way to deploy Next.js applications.

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```

3. **Or deploy via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in the Vercel dashboard
   - Deploy

4. **Configure Environment Variables**:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` with your Google Client ID

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18.x`

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Add environment variables** in Netlify dashboard

### Option 3: Self-Hosted (VPS/Server)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

3. **Use a process manager** (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start npm --name "carelytics" -- start
   pm2 save
   pm2 startup
   ```

4. **Set up reverse proxy** (Nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set up SSL** with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Post-Deployment Checklist

- [ ] Verify the build completes successfully
- [ ] Set all required environment variables
- [ ] Test Google OAuth login
- [ ] Test all major features (symptom checker, BMI calculator, etc.)
- [ ] Verify responsive design on mobile devices
- [ ] Check browser console for errors
- [ ] Test login/logout functionality
- [ ] Verify data persistence (localStorage)
- [ ] Check performance and loading times

## Troubleshooting

### Build Errors

If you encounter build errors:

1. **Type errors**: Run `npm run build` locally to see detailed error messages
2. **Missing dependencies**: Run `npm install` to ensure all packages are installed
3. **Environment variables**: Ensure all required env vars are set

### Runtime Errors

1. **Google OAuth not working**: 
   - Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
   - Check authorized domains in Google Console
   - Ensure redirect URIs are configured

2. **API routes not working**:
   - Verify Next.js API routes are properly configured
   - Check server logs for errors

### Performance Issues

1. **Slow loading**: 
   - Enable Next.js Image Optimization
   - Use CDN for static assets
   - Optimize bundle size

2. **Large bundle size**:
   - Use dynamic imports for heavy components
   - Enable code splitting
   - Remove unused dependencies

## Support

For deployment issues, check:
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- Project GitHub Issues

---

**Note**: This application uses client-side storage (localStorage) for data persistence. For production use with multiple users, consider implementing a backend API and database.

