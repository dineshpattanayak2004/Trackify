# Supabase Setup Guide - Step by Step (Hindi/English)

## 📋 Complete Supabase Setup with Trackify App

---

## Step 1: Supabase Account Banaye

1. **Browser mein jao**: https://supabase.com
2. **Sign Up karo**:
   - GitHub se sign up karo (easiest) ya email se
   - Free account ban jayega
3. **Email verify karo** (agar email se sign up kiya ho)

---

## Step 2: Naya Project Banaye

1. **Dashboard pe jao**: https://supabase.com/dashboard
2. **"New Project" button click karo** (top right corner)
3. **Project details fill karo**:
   ```
   Name: trackify-db (ya koi bhi naam)
   Database Password: Apna strong password rakho (save karo!)
   Region: Asia Pacific (Mumbai) ya closest to India
   Pricing Plan: Free tier
   ```
4. **"Create new project" click karo**
5. **Wait karo** - 2-3 minutes project ready hone ka
6. **"Congratulations" screen aayega** → Click "Continue"

---

## Step 3: Database Connection String Le Lo

1. **Left sidebar mein "Settings" click karo** (gear icon)
2. **"Database" option click karo**
3. **Scroll down karo** → "Connection string" section milega
4. **"URI" tab click karo** (default "Direct connection" pe ho)
5. **Connection string copy karo**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Password replace karo**: `[YOUR-PASSWORD]` ko apne project ke password se replace karo
   ```
   Example:
   postgresql://postgres:MySecurePass123@db.abc123.supabase.co:5432/postgres
   ```

**⚠️ IMPORTANT**: Ye connection string safe jagah save karo!

---

## Step 4: Local Development Setup

### 4.1 Prisma Schema Update

**File: `server/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // ← SQLite se PostgreSQL change karo
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

### 4.2 Environment Variables Update

**File: `server/.env`**

```env
# ❌ Purana SQLite URL remove/comment karo:
# DATABASE_URL="file:./dev.db"

# ✅ Naya PostgreSQL URL add karo:
DATABASE_URL="postgresql://postgres:MySecurePass123@db.abc123.supabase.co:5432/postgres"

# Keep these as they are:
JWT_SECRET=your_very_secure_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
PORT=4000
```

**Note**: `DATABASE_URL` mein apna actual Supabase connection string daalo.

### 4.3 Prisma Client Generate Karo

```bash
cd server
npx prisma generate
```

**Output dikhega**:
```
Prisma Client generated successfully in 2.3s
```

### 4.4 Database Migrations Run Karo

```bash
cd server
npx prisma migrate dev --name init
```

**Kya hoga**:
- Prisma automatically tables create kar dega Supabase mein
- Migration files ban jayengi
- Database ready ho jayega

**Output**:
```
Applying migration `20240101000000_init`
The following migration(s) have been applied:

migrations/
  └─ 20240101000000_init/
      └─ migration.sql

Your database is now in sync with your schema.
```

### 4.5 Database Seed Karo

```bash
cd server
node prisma/seed.js
```

**Output**:
```
Admin user created: admin@trackify.test | role: admin
Regular user created: user@trackify.test | role: user
Distributor created: distributor@trackify.test | company: Test Distribution Co.
Distributor created: techdistro@trackify.test | company: TechDistro Pvt Ltd
Distributor created: softwaresolutions@trackify.test | company: Software Solutions Inc

Clearing existing products and selections...
✓ Cleared existing data

Creating 24 unique products...
✓ Created 24 products (8 per distributor, no overlap)

Creating distributor product selections (no overlap)...
✓ Assigned 8 products to Test Distribution Co.
✓ Assigned 8 products to TechDistro Pvt Ltd
✓ Assigned 8 products to Software Solutions Inc
```

---

## Step 5: Local Testing

### 5.1 Server Start Karo

```bash
# Terminal 1 - Backend
cd server
npm run dev
```

**Output**:
```
Server running on port 4000
Prisma Client connected to PostgreSQL
```

### 5.2 Frontend Start Karo

```bash
# Terminal 2 - Frontend
npm run dev
```

**Output**:
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 5.3 Test Karo

1. **Browser mein jao**: http://localhost:5173
2. **Login test karo**:
   - User: user@trackify.test / userpass
   - Distributor: distributor@trackify.test / distpass
3. **Orders place karo**
4. **Verify karo** ki data Supabase mein save ho raha hai

---

## Step 6: Supabase Dashboard Mein Data Check Karo

1. **Supabase dashboard pe jao**: https://supabase.com/dashboard
2. **Left sidebar → "Table Editor" click karo**
3. **Tables dekho**:
   - User
   - Distributor
   - Product
   - Order
   - DistributorProductSelection
4. **Data verify karo** ki tables mein entries hai

**Ya SQL query run karo**:
```sql
-- Left sidebar → "SQL Editor" → "New query"

-- Check users
SELECT * FROM "User";

-- Check distributors
SELECT * FROM "Distributor";

-- Check products
SELECT * FROM "Product";

-- Check orders
SELECT * FROM "Order";
```

---

## Step 7: Vercel Deployment Ke Liye Prepare Karo

### 7.1 Backend ko Vercel-ready banaye

**File: `server/src/index.js`** (update karo)

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

### 7.2 Routes update karo (Prisma instance pass karne ke liye)

**File: `server/src/routes/orders.js`** (first few lines)

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
      // Use req.prisma instead of global prisma
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

// ... rest of routes similarly update karo
```

**Same changes for other route files**:
- `server/src/routes/distributor.js`
- `server/src/routes/auth.js`
- `server/src/routes/distributors-public.js`

Har route file mein `prisma.` ki jagah `req.prisma.` use karo.

### 7.3 vercel.json banaye (root folder mein)

**File: `vercel.json`**

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

### 7.4 Frontend API URL update karo

**File: `src/config/api.js`** (create karo agar nahi hai)

```javascript
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-app.vercel.app'  // Vercel deployment ke baad update karo
  : 'http://localhost:4000';
```

**Phir har API call mein use karo**:
```javascript
// Pehle:
fetch("http://localhost:4000/orders")

// Baad mein:
fetch(`${API_BASE_URL}/orders`)
```

---

## Step 8: Vercel pe Deploy Karo

### 8.1 Code GitHub pe Push Karo

```bash
# Git initialize (agar nahi hai)
git init
git add .
git commit -m "Initial commit with Supabase PostgreSQL"

# GitHub pe push karo
git remote add origin https://github.com/YOUR_USERNAME/trackify.git
git push -u origin main
```

### 8.2 Vercel pe Deploy Karo

**Option A: Vercel CLI se (Quick)**

```bash
# Vercel CLI install karo
npm i -g vercel

# Login karo
vercel login

# Deploy karo
vercel

# Production deploy
vercel --prod
```

**Option B: Vercel Dashboard se (Recommended)**

1. **Vercel pe jao**: https://vercel.com
2. **"Add New Project" click karo**
3. **GitHub repository import karo**:
   - "Import Git Repository" click karo
   - GitHub repo select karo (trackify)
   - "Import" click karo
4. **Project configure karo**:
   ```
   Project Name: trackify
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   ```
5. **Environment Variables add karo**:
   
   Click "Environment Variables" section:
   ```
   Key: DATABASE_URL
   Value: postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
   
   Key: JWT_SECRET
   Value: your_very_secure_jwt_secret_key_here
   
   Key: NODE_ENV
   Value: production
   ```
6. **"Deploy" click karo**
7. **Wait karo** - 2-3 minutes deployment complete hoga
8. **Success!** 🎉

---

## Step 9: Post-Deployment Testing

### 9.1 Vercel App pe Jao

1. **Vercel dashboard se app ka URL le lo**:
   ```
   https://trackify-xyz.vercel.app
   ```
2. **Browser mein open karo**

### 9.2 Test Karo

1. **User login test**:
   - Email: user@trackify.test
   - Password: userpass
   - Products browse karo
   - Distributor select karo
   - Order place karo

2. **Distributor login test**:
   - Email: distributor@trackify.test
   - Password: distpass
   - Orders tab mein sirf apne orders dekho
   - Products manage karo

3. **Verify in Supabase**:
   - Supabase dashboard → Table Editor
   - Orders table mein naye orders dikhne chahiye
   - Distributor-specific orders hon chahiye

---

## Step 10: Database Management

### 10.1 Supabase Dashboard Features

**Table Editor**:
- Data directly edit kar sakte ho
- Naye rows add kar sakte ho
- Delete/Update kar sakte ho

**SQL Editor**:
- Custom queries run kar sakte ho
- Complex data analysis kar sakte ho

**Database Backups**:
- Automatic backups (free tier: daily)
- Manual backup bhi le sakte ho

### 10.2 Useful SQL Queries

```sql
-- Total orders count
SELECT COUNT(*) FROM "Order";

-- Orders by distributor
SELECT 
  d.company,
  COUNT(o.id) as total_orders
FROM "Distributor" d
LEFT JOIN "Order" o ON d.id = o."distributorId"
GROUP BY d.company;

-- Total revenue
SELECT SUM(total) FROM "Order";

-- Products by distributor
SELECT 
  d.company,
  COUNT(DISTINCT dps.productId) as product_count
FROM "Distributor" d
JOIN "DistributorProductSelection" dps ON d.id = dps.distributorId
GROUP BY d.company;
```

---

## 🎯 Important Notes

### ✅ DO:
1. Supabase connection string safe rakho (`.env` mein)
2. `.env` file ko GitHub pe push NA karo
3. Migrations run karo before deployment
4. Database backup lete raho
5. Environment variables Vercel mein set karo

### ❌ DON'T:
1. `.env` file ko commit NA karo
2. Database password hardcode NA karo
3. Production data pe directly test NA karo
4. Free tier ke limits check karte raho (500MB)

---

## 💰 Pricing

### Free Tier (Perfect for Development):
- **Supabase**: 500MB database, 2 projects
- **Vercel**: Unlimited personal projects
- **Total**: $0/month

### Pro Tier (Production):
- **Supabase Pro**: $25/month (8GB database)
- **Vercel Pro**: $20/month (optional)
- **Total**: $25-45/month

---

## 🐛 Troubleshooting

### Problem 1: Connection Error
**Solution**:
```bash
# Check DATABASE_URL is correct
# Check Supabase project is active
# Check internet connection
```

### Problem 2: Migration Fails
**Solution**:
```bash
# Reset database
cd server
npx prisma migrate reset

# Re-run migrations
npx prisma migrate dev
```

### Problem 3: Prisma Client Not Found
**Solution**:
```bash
cd server
npx prisma generate
```

### Problem 4: Tables Not Created
**Solution**:
```bash
# Check Supabase dashboard → Table Editor
# Run migrations again
cd server
npx prisma migrate dev
```

---

## ✅ Checklist

### Local Setup:
- [ ] Supabase account created
- [ ] Project created
- [ ] Connection string copied
- [ ] schema.prisma updated (postgresql)
- [ ] .env updated with DATABASE_URL
- [ ] Prisma client generated
- [ ] Migrations run
- [ ] Database seeded
- [ ] Local testing passed

### Deployment:
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Live URL working
- [ ] All features tested

---

## 🎉 Congratulations!

Ab aapka Trackify app Supabase PostgreSQL ke saath ready hai!

**Next Steps**:
1. ✅ Local development complete
2. ✅ Database on Supabase
3. ✅ Ready for Vercel deployment
4. ✅ All tests passing

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://prisma.io/docs
- Vercel Docs: https://vercel.com/docs

Happy Coding! 🚀