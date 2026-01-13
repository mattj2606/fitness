# Quick Setup & Testing Guide

## Step 1: Database Setup

You have two options:

### Option A: Docker (Recommended - if you can install it)
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop
2. Start Docker Desktop
3. Run: `docker compose up -d`
4. Wait for database to be ready (~10 seconds)

### Option B: Local PostgreSQL
1. Install PostgreSQL: https://www.postgresql.org/download/
2. Create database:
   ```sql
   CREATE DATABASE fitness_db;
   CREATE USER fitness WITH PASSWORD 'fitness_password';
   GRANT ALL PRIVILEGES ON DATABASE fitness_db TO fitness;
   ```

## Step 2: Environment Variables

Create `.env.local` file in the project root:

```env
DATABASE_URL="postgresql://fitness:fitness_password@localhost:5432/fitness_db?schema=public"
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET="dev-session-secret-change-in-production"
```

## Step 3: Database Migration

```bash
npm run db:migrate
```

This will:
- Create all database tables
- Set up relationships and indexes

## Step 4: Seed Database (Optional but Recommended)

```bash
npm run db:seed
```

This will add:
- 14 muscle groups
- 10 exercises
- Exercise-muscle mappings

## Step 5: Start Development Server

```bash
npm run dev
```

The app will start at: http://localhost:3000

## Step 6: Test the Application

### Test Flow:
1. Visit http://localhost:3000
2. Should redirect to `/setup`
3. Click "Get Started" (email optional)
4. Should redirect to home page
5. Visit http://localhost:3000/checkin
6. Fill out the check-in form
7. Click "Confirm Today"
8. Should redirect to `/plan`

## Troubleshooting

### "Can't reach database server"
- Check if PostgreSQL is running
- Verify DATABASE_URL in `.env.local`
- Check database credentials

### "Migration failed"
- Make sure database exists
- Check connection string format
- Try: `npx prisma migrate reset` (WARNING: deletes data)

### "Module not found"
- Run: `npm install`
- Check node_modules exists


