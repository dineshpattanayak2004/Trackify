# Database Guide - SQLite vs PostgreSQL for Vercel

## Question: SQLite ko Vercel pe deploy kar sakte hai?

### ❌ Nahi, SQLite Vercel pe properly kaam nahi karta

**Kyun?**

1. **Vercel Serverless Functions Read-Only Filesystem**
   - Vercel ke serverless functions ka filesystem read-only hota hai (except /tmp)
   - SQLite database file ko write karne ki zarurat hoti hai
   - Har function invocation ke baad data lost ho jata hai

2. **No Persistent Storage**
   - SQLite ek file-based database hai (dev.db)
   - Vercel pe har request ke baad filesystem reset ho jata hai
   - Data persist nahi hoga

3. **Not Suitable for Production**
   - Multiple serverless functions simultaneously run kar sakte hain
   - SQLite concurrent writes handle nahi kar sakta
   - Data corruption ka risk hai

---

## ✅ Solution: PostgreSQL (Cloud Database)

### Best Options for PostgreSQL:

#### 1. **Supabase** (Recommended - Free Tier Available)
- ✅ Free tier: 500MB database
- ✅ PostgreSQL database
- ✅ Auto-backups
- ✅ Easy to use
- ✅ Prisma supported

**Steps:**
```bash
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Update DATABASE_URL in .env
5. Run: npx prisma migrate deploy
```

#### 2. **Railway** (Free Trial)
- ✅ $5 free credit monthly
- ✅ PostgreSQL database
- ✅ Easy deployment
- ✅ Prisma supported

#### 3. **Neon** (Free Tier)
- ✅ Free tier: 3GB storage
- ✅ Serverless PostgreSQL
- ✅ Branching support
- ✅ Prisma supported

#### 4. **PlanetScale** (Free Tier)
- ✅ Free tier: 5GB storage
- ✅ MySQL (not PostgreSQL)
- ✅ Serverless
- ⚠️ Prisma MySQL support needed

---

## Migration Steps: SQLite → PostgreSQL

### Step 1: Update Prisma Schema

**File: `server/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      String   @default("user")
  name      String?
  createdAt DateTime @default(now())
}

model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String?
  phone     String?
  company   String?
  createdAt DateTime @default(now())
}

model Distributor {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  company   String
  phone     String?
  address   String?
  status    String   @default("active")
  createdAt DateTime @default(now())
  
  productSelections DistributorProductSelection[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  category    String
  price       Int
  stock       Int
  rating      Float    @default(4.0)
  image       String?  @default("📦")
  description String?
  status      String   @default("in-stock")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  selections      DistributorProductSelection[]
}

model DistributorProductSelection {
  id            String    @id @default(cuid())
  distributorId String
  productId     String
  selectedAt    DateTime  @default(now())
  
  distributor   Distributor @relation(fields: [distributorId], references: [id], onDelete: Cascade)
  product       Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([distributorId, productId])
}

model Order {
  id              String    @id @default(cuid())
  userId          String
  userName        String
  productId       String
  productName     String
  qty             Int
  total           Int
  status          String    @default("pending")
  paymentStatus   String    @default("pending")
  paymentMethod   String
  date            String
  distributor     String
  tracking        String    @default("—")
  createdAt       DateTime  @default(now())
  distributorId   String?
  
  @@map("orders")
}
```

### Step 2: Update Environment Variables

**File: `server/.env`**

```env
# ❌ Remove this (SQLite):
# DATABASE_URL="file:./dev.db"

# ✅ Add this (PostgreSQL from Supabase/Railway):
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Keep these:
JWT_SECRET=your_very_secure_jwt_secret_key_here_change_this_in_production
NODE_ENV=production
PORT=4000
```

**How to get DATABASE_URL from Supabase:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → Database
4. Find "Connection string" section
5. Select "URI" format
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your database password

### Step 3: Install PostgreSQL Dependencies

```bash
cd server
npm install pg
```

### Step 4: Run Migrations

```bash
cd server

# Generate Prisma client for PostgreSQL
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# OR for production (after deployment):
npx prisma migrate deploy
```

### Step 5: Seed Database

```bash
cd server
node prisma/seed.js
```

---

## Local Development with PostgreSQL

### Option A: Use Supabase Local (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Update .env with local connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
```

### Option B: Use Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run -d \
  --name trackify-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=trackify \
  -p 5432:5432 \
  postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trackify"
```

### Option C: Continue with SQLite Locally, PostgreSQL in Production

**Use different .env files:**

**`.env.development`:**
```env
DATABASE_URL="file:./dev.db"
```

**`.env.production`:**
```env
DATABASE_URL="postgresql://..."
```

**Update `server/src/index.js`:**
```javascript
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});
```

---

## Vercel Deployment with PostgreSQL

### Complete Setup:

#### 1. **Prepare Backend for Vercel**

**File: `vercel.json` (root directory)**
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

**File: `server/src/index.js`**
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import distributorRoutes from './routes/distributor.js';
import orderRoutes from './routes/orders.js';
import productsPublicRoutes from './routes/distributors-public.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Make prisma available to routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/distributor', distributorRoutes);
app.use('/orders', orderRoutes);
app.use('/public', productsPublicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export for Vercel
export default app;

// Disconnect Prisma on serverless function shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

#### 2. **Update Routes to Use req.prisma**

**File: `server/src/routes/orders.js`**
```javascript
import express from "express";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get all orders (distributor/admin)
router.get("/", verifyToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.userId;

    let orders;
    if (userRole === "distributor") {
      orders = await req.prisma.order.findMany({
        where: { distributorId: userId },
        orderBy: { createdAt: "desc" },
      });
    } else {
      orders = await req.prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ... rest of the routes
```

#### 3. **Update Middleware to Pass Prisma**

**File: `server/src/middleware/auth.js`**
```javascript
import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

#### 4. **Deploy to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### 5. **Set Environment Variables in Vercel**

Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
# Required
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=your_very_secure_jwt_secret_key_here
NODE_ENV=production

# Optional
FRONTEND_URL=https://your-app.vercel.app
```

---

## Database Provider Comparison

| Provider | Free Tier | PostgreSQL | Prisma Support | Best For |
|----------|-----------|------------|----------------|----------|
| **Supabase** | ✅ 500MB | ✅ Yes | ✅ Yes | Beginners |
| **Neon** | ✅ 3GB | ✅ Yes | ✅ Yes | Serverless |
| **Railway** | ✅ $5 credit | ✅ Yes | ✅ Yes | Easy deploy |
| **Render** | ❌ No | ✅ Yes | ✅ Yes | Production |
| **PlanetScale** | ✅ 5GB | ❌ MySQL | ⚠️ Limited | MySQL users |

---

## Cost Breakdown (Production)

### Free Tier (Development/Testing):
- **Vercel**: Free (Frontend + Serverless Functions)
- **Supabase**: Free (500MB PostgreSQL)
- **Total**: $0/month

### Small Production (100-1000 users):
- **Vercel**: Free (Hobby) or $20/month (Pro)
- **Supabase Pro**: $25/month (8GB database)
- **Total**: $25-45/month

### Medium Production (1000-10000 users):
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month (8GB) or $599/month (100GB)
- **Total**: $45-619/month

---

## Important Notes

### ✅ DO:
1. Use PostgreSQL for production
2. Use connection pooling (PgBouncer) for serverless
3. Run migrations before deployment
4. Backup database regularly
5. Use environment variables for database URL

### ❌ DON'T:
1. Don't use SQLite in production on Vercel
2. Don't hardcode database credentials
3. Don't run migrations in serverless functions
4. Don't store sensitive data in client-side code
5. Don't forget to disconnect Prisma client

---

## Quick Reference

### SQLite (Local Development Only):
```env
DATABASE_URL="file:./dev.db"
```
✅ Good for: Local development, testing
❌ Bad for: Production, Vercel deployment

### PostgreSQL (Production):
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```
✅ Good for: Production, Vercel, scalability
❌ Bad for: None (use this!)

---

## Summary

**Q: SQLite ko Vercel pe deploy kar sakte hai?**
**A: Nahi, SQLite Vercel pe kaam nahi karta kyunki:**
- ❌ Read-only filesystem
- ❌ No persistent storage
- ❌ Data lost between requests
- ❌ Not suitable for serverless

**Solution:**
- ✅ Use PostgreSQL (Supabase/Neon/Railway)
- ✅ Update DATABASE_URL
- ✅ Run migrations
- ✅ Deploy to Vercel

**Your app is now production-ready!** 🚀