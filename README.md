# Trackify - Sales Tracking & Analytics Platform

A full-stack **CRM & Sales Tracking Platform** built with React, Vite, Express, and PostgreSQL, deployed on Vercel.

## 🚀 Live Demo

```
https://trackify.vercel.app
```

## 📸 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Library |
| **Vite 8** | Build Tool & Dev Server |
| **React Router 7** | Client-side Routing |
| **Chart.js** | Data Visualization |
| **Axios** | HTTP Client |
| **Socket.io Client** | Real-time Updates |
| **React Icons** | Icons Library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express.js** | REST API Server |
| **Prisma ORM** | Database ORM |
| **PostgreSQL (Neon)** | Database |
| **JWT** | Authentication |
| **Socket.io** | WebSocket |
| **OpenAI API** | AI Chat Feature |
| **bcrypt** | Password Hashing |

## ✨ Features

- ✅ **Role-based Access** - Admin, User, Distributor
- ✅ **Real-time Dashboard** - Live analytics via Socket.io
- ✅ **Lead Management** - Track and manage leads
- ✅ **AI Agent** - AI-powered chat assistant
- ✅ **Distributor Portal** - Product & order management
- ✅ **Analytics & Reports** - Interactive charts
- ✅ **Order Processing** - Full order lifecycle
- ✅ **Payment Tracking** - Payment status management
- ✅ **Mobile Responsive** - Works on all devices

## 🛠️ Local Development

### Prerequisites
- Node.js v18+
- npm or yarn

### 1. Clone & Install

```bash
# Clone the repo
git clone https://github.com/dineshpattanayak2004/Trackify.git
cd Trackify

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Variables

Create `server/.env`:

```env
DATABASE_URL="postgresql://user:password@host/db"
JWT_SECRET=your_jwt_secret_here
PORT=4000
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Database Setup

```bash
cd server
npx prisma generate
npx prisma db push
node prisma/seed.js
cd ..
```

### 4. Run Locally

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

## 🚢 Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deploy"
git push
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Framework: **Vite**
4. Root directory: `./`

### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your PostgreSQL URL |
| `JWT_SECRET` | Your JWT secret |
| `OPENAI_API_KEY` | Your OpenAI key |

### 4. Deploy
```bash
vercel --prod
```

## 📁 Project Structure

```
Trackify/
├── api/                      # Vercel serverless function
│   └── index.js             # Express app (Vercel entry)
├── public/                   # Static assets
├── server/                   # Backend
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.js           # Seed data
│   └── src/
│       ├── index.js          # Express server
│       ├── middleware/
│       │   └── auth.js       # JWT auth middleware
│       └── routes/
│           ├── auth.js       # Login/Register
│           ├── distributor.js# Distributor API
│           ├── orders.js     # Orders API
│           ├── products.js   # Products API
│           ├── contacts.js   # Contacts API
│           ├── analytics.js  # Analytics API
│           ├── ai.js         # OpenAI AI agent
│           └── distributors-public.js
├── src/                      # Frontend
│   ├── assets/               # Images
│   ├── components/           # Reusable components
│   ├── config/               # API config
│   ├── pages/                # Page components
│   ├── store/                # Context API store
│   └── utils/                # Utilities
├── vercel.json               # Vercel config
└── vite.config.js            # Vite config
```

## 🔐 Default Credentials (Seed Data)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@trackify.test` | `adminpass` |
| User | `user@trackify.test` | `userpass` |
| Distributor | Register via `/distributor/signup` | - |

## 📊 API Endpoints

### Auth
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login
```

### Distributors
```
GET    /api/public/distributors           - List distributors
GET    /api/public/distributors/:id/products - Distributor products
POST   /api/distributor                   - Create distributor
POST   /api/distributor/login             - Distributor login
```

### Orders
```
GET    /api/orders         - Get orders
POST   /api/orders         - Create order
PUT    /api/orders/:id     - Update order
DELETE /api/orders/:id     - Delete order
```

### Other
```
GET    /api/analytics/snapshot  - Analytics data
POST   /api/ai/chat             - AI chat completion
GET    /api/contacts            - Get contacts
```

## 🔧 Available Scripts

### Frontend
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Backend
```bash
npm run dev       # Dev with nodemon
npm start         # Production server
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to DB
npm run seed         # Seed database
```

## 🧹 Cleanup & Maintenance

### Remove old build files
```bash
rm -rf dist
npm run build
```

### Reset database
```bash
cd server
npx prisma migrate reset --force
npm run seed
```

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

MIT License - feel free to use and modify.

---

**Built with ❤️ by Trackify Team**