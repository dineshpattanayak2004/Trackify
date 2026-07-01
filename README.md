# Trackify - Sales Tracking & Analytics Platform

A full-stack sales tracking and analytics platform with real-time dashboard updates using React, Express, Prisma ORM, and Socket.io.

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time data updates

### Backend
- **Express.js** - REST API server
- **Socket.io** - WebSocket for real-time analytics
- **Prisma ORM** - Database ORM
- **SQLite** - Database (dev.db)
- **JWT** - Authentication
- **OpenAI API** - AI features

## Database Setup

### Prisma Configuration
The project uses **Prisma ORM** with **SQLite** database.

**Database Location:** `Tracify/server/prisma/dev.db`

**Configuration Files:**
- `Tracify/server/prisma/schema.prisma` - Database schema
- `Tracify/server/.env` - Environment variables
  ```
  DATABASE_URL="file:./dev.db"
  ```

### Database Schema
The database contains three main models:
- **User** - Admin and regular users
- **Contact** - Contact management
- **Distributor** - Distributor information

### Database Commands

```bash
# Navigate to server directory
cd Tracify/server

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with initial data
npm run seed
```

### Seed Data
The database is pre-seeded with:
- **Admin User:** `admin@trackify.test` / `adminpass`
- **Regular User:** `user@trackify.test` / `userpass`

## Socket.io - Real-time Features

Socket.io is used for **real-time analytics updates** on the dashboard.

### Implementation
- **Server:** `Tracify/server/src/index.js` (lines 6, 27-32, 42-53)
- **Event:** `analytics:update` - Broadcasts every 3 seconds
- **Data:** Active users, leads, conversion rate, revenue

### How it Works
1. Client connects to Socket.io server
2. Server emits `welcome` event on connection
3. Every 3 seconds, server broadcasts `analytics:update` event with:
   - `activeUsers` - Random count (100-300)
   - `leads` - Random count (500-700)
   - `conversionRate` - Random percentage (5-15%)
   - `revenue` - Random amount (100000-150000)
   - `timestamp` - Current ISO timestamp

### API Endpoint
- `GET /analytics/snapshot` - Returns current analytics snapshot (REST fallback)

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Frontend Setup
```bash
cd Tracify
npm install
npm run dev
```

### Backend Setup
```bash
cd Tracify/server
npm install
npm run dev
```

### Environment Variables
Create `Tracify/server/.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_jwt_secret_here
PORT=4000
OPENAI_API_KEY=your_openai_api_key_here
```

## Project Structure

```
Tracify/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── dev.db             # SQLite database (auto-generated)
│   │   └── seed.js            # Database seed script
│   ├── src/
│   │   ├── index.js           # Express server + Socket.io setup
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT authentication
│   │   └── routes/
│   │       ├── auth.js         # Authentication routes
│   │       ├── distributor.js # Distributor management
│   │       ├── ai.js           # OpenAI integration
│   │       ├── contacts.js     # Contact management
│   │       └── analytics.js    # Analytics API
│   ├── .env                    # Environment variables
│   └── package.json
├── src/                        # React frontend
│   ├── pages/
│   ├── components/
│   └── ...
└── README.md
```

## Available Scripts

### Server Scripts
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run seed       # Seed database
```

### Client Scripts
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## API Routes

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Distributors
- `GET /distributor` - Get all distributors
- `POST /distributor` - Create distributor
- `PUT /distributor/:id` - Update distributor
- `DELETE /distributor/:id` - Delete distributor

### Contacts
- `GET /contacts` - Get all contacts
- `POST /contacts` - Create contact
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact

### Analytics
- `GET /analytics/snapshot` - Get analytics snapshot

### AI
- `POST /ai/chat` - OpenAI chat completion

## Socket.io Events

### Client → Server
- `connection` - Client connects
- `disconnect` - Client disconnects

### Server → Client
- `welcome` - Connection confirmation
- `analytics:update` - Real-time analytics data (every 3s)

## Features

- ✅ User Authentication (JWT)
- ✅ Distributor Management
- ✅ Contact Management
- ✅ Real-time Analytics Dashboard
- ✅ AI-powered Chat (OpenAI)
- ✅ Role-based Access Control (Admin/User)
- ✅ SQLite Database with Prisma ORM
- ✅ CORS enabled
- ✅ Auto-reload with Nodemon

## Development

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Run `npm run prisma:generate`

### Reset Database
```bash
# Delete dev.db and run migrations again
rm prisma/dev.db
npm run prisma:migrate
npm run seed
```

## License

MIT