# 📂 Git Upload & Vercel Deploy File List

## ✅ Git pe push karni wali files (Important):

```
trackify/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/            ← Puri migration folder
│   ├── src/
│   │   ├── index.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── distributor.js
│   │       ├── orders.js
│   │       └── distributors-public.js
│   └── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── components/
│   ├── config/
│   ├── pages/
│   ├── store/
│   └── utils/
├── public/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                    ← Yeh banana hoga!
└── .gitignore
```

## ❌ Git pe push mat karo (Yeh files nahi jayengi):

| File/Folder | Reason |
|-------------|--------|
| `.env` | Password aur secrets hai |
| `node_modules/` | Bahut heavy (100MB+) |
| `dist/` | Build files, deploy pe banti hai |
| `*.db` / `*.sqlite` | Local database |
| `.DS_Store` | Mac system file |

## 📝 `.gitignore` file (Banani padegi!):

```
node_modules/
dist/
.env
*.db
*.sqlite
*.db-journal
.DS_Store
```

## 🎯 Extra File: `vercel.json` (Root folder mein):

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

## 🚀 Deploy Steps:

### Step 1: GitHub pe push karo
```bash
git init
git add .
git commit -m "Initial commit with Neon PostgreSQL"
git remote add origin https://github.com/YOUR_USERNAME/trackify.git
git push -u origin main
```

### Step 2: Vercel mein import karo
1. https://vercel.com → New Project
2. GitHub repo select karo
3. Environment Variables dalo:
   ```
   DATABASE_URL = postgresql://neondb_owner:npg_0kTlo6idPfuq@ep-young-band-aoyv1p2o-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET = change_this_secret
   NODE_ENV = production
   ```
4. Deploy click karo

### Step 3: Database migrate karo (Vercel pe)
```bash
cd server
npx prisma migrate deploy
npx prisma db seed
```

## 📱 Database Dekhne Ke Liye:

### Neon Dashboard (Browser):
1. https://console.neon.tech
2. "trackify" project select karo
3. "Tables" ya "Browse" section
4. Saari tables dikhengi!

### Prisma Studio (Terminal se):
```bash
cd server
npx prisma studio
```
Browser mein http://localhost:5555 pe database dikhega!

### Terminal se SQL:
```bash
cd server
npx prisma db execute --stdin
SELECT * FROM "User";
SELECT * FROM "Distributor";
SELECT * FROM "Product";
SELECT * FROM "Order";
```

## 🎉 Summary

| Action | Command |
|--------|---------|
| Git push | `git add . && git commit -m "msg" && git push` |
| Vercel deploy | Vercel dashboard se |
| Database dekhna | https://console.neon.tech |
| Prisma Studio | `cd server && npx prisma studio` |
| Server run | `cd server && npm run dev` |
| Frontend run | `npm run dev` |