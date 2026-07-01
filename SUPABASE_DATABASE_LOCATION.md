# Supabase Mein Database Option Kahan Hai?

## 📍 Database Option Ka Location

### Current Screen Mein:
Aap **Settings** page mein ho. Database option **Settings** ke andar nahi hai, balki **left sidebar** mein hai.

---

## Step by Step - Database Option Dhoondein:

### Method 1: Left Sidebar Se (SABSE AASAN)

1. **Left sidebar dekho** (sabse left side vertical menu)
2. **"Database" icon dhundo** - Ye icon dikhega:
   ```
   🗄️  (database icon)
   Database
   ```
3. **Click karo** "Database" par

**Location**: Left sidebar mein, usually **Settings icon ke neeche** ya **Table Editor icon ke upar**

---

### Method 2: Agar Left Sidebar Mein Nahin Hai

1. **Left sidebar scroll karo** (mouse wheel se neeche)
2. **"Database" section dhundo**
3. **Click karo**

---

### Method 3: Quick Navigation

Supabase dashboard mein direct jao:

**Option A: URL se jao**
```
https://supabase.com/dashboard/project/YOUR-PROJECT-ID/editor
```

**Option B: Left sidebar items** (top to bottom):
```
🏠 Home
📊 Table Editor  ← Ye bhi database related hai
🗄️ Database      ← Yahan par hai!
🔌 API
📁 Storage
🔐 Auth
⚙️ Settings (currently selected)
```

---

## 🎯 Ab Kya Karein:

### Step 1: Database Connection String Lein

1. **Left sidebar → "Database" click karo**
2. **Settings section mein jao** (database ke andar)
3. **"Connection string" ya "Connection pooling" dhundo**
4. **"URI" format select karo**
5. **Copy karo connection string**

**Ya directly jao**:
```
Left Sidebar → Database → Settings → Connection string
```

---

## 📸 Screenshot Guide

### Aapke Current Screen (Settings) Se:

1. **Left sidebar dekho** - wahan "Database" likha hoga
2. **Click karo** "Database" par
3. **Naya page khulega** "Database" ka
4. **Wahan "Connection" ya "Connection string" option milega**
5. **Click karo** aur connection string copy karo

---

## 🔍 Quick Checklist

- [ ] Left sidebar mein "Database" dhundo
- [ ] Click karo Database par
- [ ] Database dashboard khulega
- [ ] Settings → Connection string par jao
- [ ] URI format select karo
- [ ] Copy karo connection string
- [ ] Password replace karo

---

## 💡 Pro Tip

Agar abhi bhi nahi mil raha:

1. **Left sidebar scroll karo** completely
2. **"Database" icon** dikhega (🗄️)
3. **Ya "Table Editor"** try karo (📊) - wahan se bhi connection string mil sakta hai

**Table Editor se connection string kaise lein**:
1. Left sidebar → "Table Editor" click karo
2. Top right mein "..." menu
3. "Copy connection string" select karo

---

## 🚀 Next Steps Database Milne Ke Baad:

1. **Connection string copy karo**
2. **Apne project ke `.env` file mein paste karo**:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```
3. **Prisma schema update karo**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. **Migrate karo**:
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev --name init
   ```

---

## ❓ Common Issues

### Q: Database option nahi dikh raha?
**A**: Left sidebar scroll karo, ya page refresh karo

### Q: Connection string nahi mil raha?
**A**: 
- Database → Settings → Connection string
- Ya Table Editor → ... menu → Copy connection string

### Q: Password kya hai?
**A**: Jab project banate time jo password banaya tha woh use karo. Ya forgot password use karo.

---

## 📞 Help

Agar abhi bhi problem hai:
1. Screenshot le lo
2. Supabase docs dekho: https://supabase.com/docs
3. Ya direct Supabase dashboard mein help option use karo

**Database option left sidebar mein hai - wahan jao!** 🎯