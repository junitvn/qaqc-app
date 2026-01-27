# Deploying to Vercel

This guide explains how to deploy your React Native Expo app to Vercel as a web application.

## Prerequisites

1. A Vercel account ([sign up here](https://vercel.com/signup))
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Node.js 20+ installed locally (for testing builds)

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to Git**
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push
   ```

2. **Import Project in Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `EXPO_PUBLIC_API_URL` = `https://qaqc-backend.onrender.com`
     - `EXPO_PUBLIC_ORIGIN` = `https://qaqc-frontend.vercel.app` (or your Vercel URL)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd qaqc
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add EXPO_PUBLIC_API_URL
   vercel env add EXPO_PUBLIC_ORIGIN
   ```

5. **Redeploy with environment variables**
   ```bash
   vercel --prod
   ```

## Configuration Details

The `vercel.json` file configures:

- **Build Command**: `npm run bundle:web` - Exports the Expo app for web platform
- **Output Directory**: `dist` - Where Expo exports the web build
- **SPA Routing**: All routes redirect to `index.html` for client-side routing
- **Static Assets Caching**: Optimized caching headers for static assets

## Testing Locally

Before deploying, test the web build locally:

```bash
# Build for web
npm run bundle:web

# Serve the build locally
npm run serve:web
```

Visit `http://localhost:3000` to verify everything works.

## Environment Variables

Make sure to set these in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API URL | `https://qaqc-backend.onrender.com` |
| `EXPO_PUBLIC_ORIGIN` | Frontend origin URL | `https://qaqc-frontend.vercel.app` |

**Note**: All `EXPO_PUBLIC_*` variables are exposed to the client-side code. Never put sensitive data in these variables.

## Troubleshooting

### Build Fails

1. **Check Node.js version**: Ensure Vercel uses Node.js 20+ (configured in `package.json`)
2. **Check build logs**: Review the build output in Vercel dashboard
3. **Test locally**: Run `npm run bundle:web` locally to catch errors early

### Routing Issues

- The `vercel.json` includes SPA rewrites to handle React Navigation routing
- If routes don't work, verify the rewrite rule is correct

### Environment Variables Not Working

- Ensure variables are prefixed with `EXPO_PUBLIC_` for Expo web
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

### Static Assets Not Loading

- Verify assets are in the `assets/` directory
- Check that `assetBundlePatterns` in `app.json` includes your assets
- Ensure file paths are correct in your code

## Continuous Deployment

Once connected to Git, Vercel will automatically deploy:

- **Production**: Every push to `main` or `master` branch
- **Preview**: Every push to other branches (creates preview deployments)

## Custom Domain

To add a custom domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Performance Optimization

The current setup includes:
- Static asset caching (1 year for `/static/*`)
- SPA routing optimization
- Metro bundler for optimized builds

For further optimization, consider:
- Image optimization (already using `expo-image`)
- Code splitting (handled by Metro)
- CDN caching (handled by Vercel)

## Support

- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [Vercel Documentation](https://vercel.com/docs)
- [React Native Web](https://necolas.github.io/react-native-web/)
