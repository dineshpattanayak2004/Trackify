# Trackify Server

This folder contains the Node/Express backend scaffold for Trackify.

Quick start (local/Postgres):

1. Copy `.env.example` to `.env` and fill `DATABASE_URL` and `JWT_SECRET` (and `OPENAI_API_KEY` if using AI).
2. Install dependencies:

```bash
cd server
npm install
```

3. Generate Prisma client and migrate (local Postgres):

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

4. Start server:

```bash
npm run dev
```

Notes:
- This is scaffold code configured for Neon/Postgres via `DATABASE_URL`.
- Socket.IO is enabled; frontend can connect to `http://localhost:4000`.

Docker (local Postgres):

1. Start a local Postgres with Docker Compose (from `server`):

```bash
docker compose up -d
```

2. Use the connection string: `postgresql://trackify:trackify@localhost:5432/trackify_dev` as your `DATABASE_URL` in `.env`.

