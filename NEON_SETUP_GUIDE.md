# Neon.tech Setup Guide - Step by Step (100% Easy)

## 📋 Neon.tech - Sabse Easy PostgreSQL Database

Neon.tech ka UI bahut simple hai aur database option clearly dikhta hai. 2 minute mein setup ho jayega!

---

## Step 1: Neon Account Banaye

1. **Browser mein jao**: https://console.neon.tech
2. **"Sign up" click karo** (GitHub se sign up karo - sabse easy)
3. **GitHub authorize karo**
4. **Account create ho jayega** - no credit card needed!

---

## Step 2: Naya Project Banaye

Jab aap login karenge, turant ye screen dikhegi:

1. **"Create new project" button click karo** (big button, center mein)
2. **Project name daalo**:
   ```
   Project Name: trackify
   ```
3. **Database name daalo**:
   ```
   Database Name: trackify
   ```
4. **Region select karo** (jo bhi closest ho):
   ```
   Region: Asia Pacific (Mumbai) - recommended for India
   ```
5. **"Create project" click karo**

---

## Step 3: Connection String Le Lo

Project create hote hi **direct connection string dikhega**!

### Screen pe dikhega:
```
✅ Project created successfully!

Connection String:
postgresql://neondb_owner:xxxxxxxx@ep-xxxxxx.us-east-2.aws.neon.tech/trackify?sslmode=require

📋 Copy this connection string
```

1. **"Copy" button click karo** (connection string ke saath hai)
2. **Connection string copy ho jayega**

**Connection string kuch aisa dikhega**:
```
postgresql://neondb_owner:Np8xYZabc123@ep-fancy-cloud-123456.us-east-2.aws.neon.tech/trackify?sslmode=require
```

---

## Step 4: .env File Update Karo

**File: `server/.env`**

```env
# ❌ SQLite URL remove karo (ya comment karo):
# DATABASE_URL="file:./dev.db"

# ✅ Neon PostgreSQL URL paste karo:
DATABASE_URL="postgresql://neondb_owner:Np8xYZabc123@ep-fancy-cloud-123456.us-east-2.aws.neon.tech/trackify?sslmode=require"

# Baki sab same rahega:
JWT_SECRET=your_very_secure_jwt_secret_key_here
NODE_ENV=development
PORT=4000
```

**⚠️ Important**: Apna actual connection string daalo, upar example hai!

---

## Step 5: Prisma Schema Update Karo

**File: `server/prisma/schema.prisma`**

Sirf **2 lines** change karni hain:

```prisma
datasource db {
  provider = "postgresql"   // ← "sqlite" se "postgresql" karo
  url      = env("DATABASE_URL")
}
```

**Full file aise dikhegi**:
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

---

## Step 6: Prisma Client Generate Karo

Terminal mein ye commands run karo:

```bash
cd server
npx prisma generate
```

**Output aayega**:
```
✔ Generated Prisma Client (v5.x.x) to .\node_modules\.prisma\client in 51ms
```

---

## Step 7: Database Migrations Run Karo

```bash
npx prisma migrate dev --name init
```

**Output aayega**:
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "trackify" at "ep-xxxx.us-east-2.aws.neon.tech"

Applying migration `20240101000000_init`

✔ Migration `20240101000000_init` applied successfully

Your database is now in sync with your Prisma schema.
```

---

## Step 8: Database Seed Karo

```bash
node prisma/seed.js
```

**Output aayega**:
```
Admin user created: admin@trackify.test | role: admin
Regular user created: user@trackify.test | role: user
Distributor created: distributor@trackify.test | company: Test Distribution Co.
Distributor created: techdistro@trackify.test | company: TechDistro Pvt Ltd
Distributor created: softwaresolutions@trackify.test | company: Software Solutions Inc
✓ Cleared existing data
✓ Created 24 products (8 per distributor, no overlap)
✓ Assigned 8 products to Test Distribution Co.
✓ Assigned 8 products to TechDistro Pvt Ltd
✓ Assigned 8 products to Software Solutions Inc
```

---

## Step 9: Server Start Karo

```bash
npm run dev
```

**Output aayega**:
```
Server running on port 4000
Connected to Neon PostgreSQL database
```

---

## Step 10: Neon Dashboard Mein Data Check Karo

1. **Neon console pe jao**: https://console.neon.tech
2. **Project select karo**
3. **"Tables" ya "Database" section mein jao**
4. **Data verify karo** ki tables bani hain

---

## 🎯 Quick Reference (Complete Setup in 5 Commands)

```bash
# 1. Server folder mein jao
cd server

# 2. Prisma Client generate karo
npx prisma generate

# 3. Database migrations run karo
npx prisma migrate dev --name init

# 4. Database seed karo
node prisma/seed.js

# 5. Server start karo
npm run dev
```

---

## ✅ Deploy to Vercel (Neon ke saath)

### Vercel Dashboard Mein Ye Variables Set Karo:

Go to: Vercel Dashboard → Project → Settings → Environment Variables

**Add karo**:
```
Key: DATABASE_URL
Value: postgresql://neondb_owner:xxxxxxxx@ep-xxxxxx.us-east-2.aws.neon.tech/trackify?sslmode=require

Key: JWT_SECRET
Value: your_very_secure_jwt_secret_key_here_change_this

Key: NODE_ENV
Value: production
```

---

## 💰 Pricing

### Free Tier (Best for Development):
- **500MB storage** - Perfect for your app
- **100 connections**
- **Unlimited projects** (Active: 1)
- **Cost**: $0

### Pro Tier (Production):
- **10GB storage**
- **Unlimited connections**
- **Cost**: $19/month

---

## 🐛 Common Issues

### Problem: Connection refused
**Solution**:
```bash
# Check if Neon project is active
# Check connection string is correct
# Check .env file is saved
```

### Problem: Migration fails
**Solution**:
```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

### Problem: Can't connect
**Solution**:
```bash
# .env file check karo
# DATABASE_URL sahi hai ya nahi
# Password check karo
```

---

## 🎉 Done!

Neon.tech setup complete! Ab aapka app PostgreSQL ke saath ready hai.

## Summary - Key Points:

| Step | Action | Time |
|------|--------|------|
| 1️⃣ | Neon account banaye | 1 min |
| 2️⃣ | Project create karein | 1 min |
| 3️⃣ | Connection string copy karein | 30 sec |
| 4️⃣ | .env file update karein | 1 min |
| 5️⃣ | Prisma generate & migrate | 2 min |
| 6️⃣ | Seed & start server | 2 min |
| **Total** | | **~7 minutes** 🚀 |

**Neon.tech ka UI simple hai, aur database option clearly dikhta hai - koi confusion nahi!** 🎯