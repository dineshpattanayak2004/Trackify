# Vercel Deployment Guide - Trackify App

## Overview
Yeh guide Trackify application ko Vercel pe deploy karne ke liye hai. Isme backend (Express/Node.js) aur frontend (React/Vite) dono ko properly configure karne ke steps bataye gaye hain.

## Architecture
- **Frontend**: React + Vite (deployed on Vercel)
- **Backend**: Express.js + Prisma + SQLite (needs separate hosting or Vercel serverless functions)
- **Database**: SQLite (for production, consider PostgreSQL)

---

## Important Note
Vercel primarily hosts frontend applications. For full-stack apps with Express backend, you have 2 options:

### Option 1: Vercel Serverless Functions (Recommended)
- Backend API routes convert to Vercel serverless functions
- Database needs to be external (PostgreSQL on Supabase/Railway)
- Single deployment on Vercel

### Option 2: Separate Hosting
- Frontend on Vercel
- Backend on Railway/Render/Fly.io
- Database on Supabase/Railway

---

## Option 1: Vercel Serverless Functions (Step by Step)

### Prerequisites
- Vercel account
- GitHub repository with your code
- Supabase/Railway account for PostgreSQL database

### Step 1: Prepare Backend for Vercel

#### 1.1 Create `vercel.json` in root directory
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server/src/index.js"
    }
  ]
}
```

#### 1.2 Update `server/src/index.js`
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import distributorRoutes from './routes/distributor.js';
import orderRoutes from './routes/orders.js';
import productsPublicRoutes from './routes/distributors-public.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/distributor', distributorRoutes);
app.use('/orders', orderRoutes);
app.use('/public', productsPublicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export for Vercel
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```

#### 1.3 Update `package.json` in server folder
```json
{
  "name": "trackify-server",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "vercel-build": "echo 'Build complete'"
  }
}
```

### Step 2: Migrate from SQLite to PostgreSQL

#### 2.1 Update `server/prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Rest of your schema remains the same
```

#### 2.2 Update `server/.env`
```env
# Remove this:
# DATABASE_URL="file:./dev.db"

# Add this (from Supabase/Railway):
DATABASE_URL="postgresql://user:password@host:5432/database_name"

# Keep other env vars
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

#### 2.3 Run Prisma migration
```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

### Step 3: Prepare Frontend for Vercel

#### 3.1 Update `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
```

#### 3.2 Update API base URL in frontend
Create `src/config/api.js`:
```javascript
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-vercel-app.vercel.app/api'
  : 'http://localhost:4000';
```

Update all API calls to use this base URL.

#### 3.3 Create `vercel.json` in root (for frontend)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Step 4: Deploy to Vercel

#### 4.1 Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# For production
vercel --prod
```

#### 4.2 Using GitHub Integration (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Root Directory**: `./` (if monorepo) or leave empty
   - **Build Command**: `npm run build` (for frontend)
   - **Output Directory**: `dist`
   - **Environment Variables**: Add all from `.env`
6. Click "Deploy"

### Step 5: Environment Variables on Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Backend
JWT_SECRET=your_secure_jwt_secret_key_here
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NODE_ENV=production

# Frontend
VITE_API_URL=https://your-app.vercel.app/api
```

---

## Option 2: Separate Hosting (Easier)

### Frontend on Vercel
1. Deploy only the frontend (React app) to Vercel
2. Build command: `npm run build`
3. Output directory: `dist`

### Backend on Railway/Render

#### Deploy to Railway:
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select your repository
4. Set root directory to `server`
5. Add environment variables
6. Railway will auto-detect and deploy

#### Deploy to Render:
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy

### Database on Supabase:
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get PostgreSQL connection string
4. Update `DATABASE_URL` in backend
5. Run migrations: `npx prisma migrate deploy`

---

## Required Files/Folders for Deployment

### Essential Files:
```
trackify/
├── server/
│   ├── src/
│   │   ├── index.js          ✅ Main server file
│   │   ├── routes/
│   │   │   ├── auth.js       ✅ Auth routes
│   │   │   ├── distributor.js ✅ Distributor routes
│   │   │   ├── orders.js     ✅ Order routes
│   │   │   └── distributors-public.js ✅ Public routes
│   │   └── middleware/
│   │       └── auth.js       ✅ Auth middleware
│   ├── prisma/
│   │   ├── schema.prisma     ✅ Database schema
│   │   └── seed.js           ✅ Database seeder
│   ├── package.json          ✅ Dependencies
│   └── .env                  ✅ Environment variables
├── src/
│   ├── main.jsx              ✅ React entry point
│   ├── App.jsx               ✅ Main app component
│   ├── pages/                ✅ All page components
│   ├── components/           ✅ Reusable components
│   ├── store/                ✅ State management
│   └── utils/                ✅ Utility functions
├── package.json              ✅ Frontend dependencies
├── vite.config.js            ✅ Vite configuration
└── vercel.json               ✅ Vercel configuration (if using serverless)
```

### Files to Include in `.gitignore`:
```
node_modules/
dist/
build/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.db
*.sqlite
*.db-journal
```

---

## Environment Variables Required

### Backend (.env):
```env
# Database
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Authentication
JWT_SECRET=your_very_secure_jwt_secret_key_here

# Server
PORT=4000
NODE_ENV=production
```

### Frontend (.env):
```env
# API URL (update based on deployment)
VITE_API_URL=https://your-backend-url.com/api
```

---

## Post-Deployment Checklist

### ✅ Backend:
- [ ] Database migrated to PostgreSQL
- [ ] Environment variables set
- [ ] Server running without errors
- [ ] All API endpoints accessible
- [ ] CORS configured correctly
- [ ] Authentication working

### ✅ Frontend:
- [ ] Build successful
- [ ] Environment variables set
- [ ] API calls working
- [ ] Authentication working
- [ ] All pages loading correctly
- [ ] Images/assets loading

### ✅ Database:
- [ ] PostgreSQL database created
- [ ] Migrations run successfully
- [ ] Seed data inserted (if needed)
- [ ] Database connection working

### ✅ Testing:
- [ ] User can login
- [ ] Distributor can login
- [ ] User can select distributor
- [ ] User can place order
- [ ] Distributor can see only their orders
- [ ] Products are unique per distributor
- [ ] Order status updates working
- [ ] Payment tracking working

---

## Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Update CORS configuration in backend:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-app.vercel.app',
  credentials: true
}));
```

### Issue 2: Database Connection Errors
**Solution**: 
- Check DATABASE_URL is correct
- Ensure database is accessible from deployment
- Run `npx prisma migrate deploy` after deployment

### Issue 3: Environment Variables Not Working
**Solution**:
- Restart deployment after adding env vars
- Check variable names match exactly
- Use `process.env.VAR_NAME` in backend
- Use `import.meta.env.VAR_NAME` in frontend

### Issue 4: Build Failures
**Solution**:
- Check Node.js version (use 18+)
- Clear cache and rebuild
- Check for missing dependencies

---

## Cost Estimation

### Free Tier (Development):
- **Vercel**: Free (Frontend)
- **Railway**: Free trial credits
- **Supabase**: Free tier (500MB database)
- **Total**: $0/month

### Production (Small Scale):
- **Vercel Pro**: $20/month (if needed)
- **Railway**: ~$5-10/month
- **Supabase Pro**: $25/month
- **Total**: ~$30-55/month

---

## Recommended Stack for Production

### Option A: All-in-One (Vercel)
- **Frontend + Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **Cost**: ~$25-45/month

### Option B: Best Performance
- **Frontend**: Vercel
- **Backend**: Railway/Render
- **Database**: Supabase
- **Cost**: ~$30-55/month

### Option C: Budget-Friendly
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free tier)
- **Database**: Supabase (Free tier)
- **Cost**: $0/month (with limitations)

---

## Quick Start Commands

### Local Development:
```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Setup database
cd server
npx prisma migrate dev
npx prisma db seed
cd ..

# Start development
npm run dev
```

### Production Build:
```bash
# Build frontend
npm run build

# Test production build locally
npm run preview
```

### Deploy to Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Support & Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://prisma.io/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

## Summary

**Minimum Files Needed for Deployment:**
1. ✅ All source code files (src/, server/src/)
2. ✅ package.json (root + server/)
3. ✅ vite.config.js
4. ✅ vercel.json (for Vercel deployment)
5. ✅ prisma/schema.prisma
6. ✅ Environment variables (configured in Vercel dashboard)

**Database:**
- Migrate from SQLite to PostgreSQL
- Use Supabase or Railway for PostgreSQL hosting
- Run migrations before deployment

**Deployment:**
- Use Vercel for frontend
- Use Vercel serverless functions OR separate hosting for backend
- Configure environment variables in Vercel dashboard

**Testing:**
- All distributor isolation tests passing ✅
- Products unique per distributor ✅
- Orders filtered by distributor ✅
- End-to-end flow working ✅

Your app is ready for deployment! 🚀