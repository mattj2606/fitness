# Migration Guide - Moving to Another PC

This guide contains everything you need to set up this project on a new computer.

## What We Built

### Phase 0: Infrastructure Setup ✅
- Next.js 14+ project with TypeScript
- PostgreSQL database with Prisma ORM
- Complete database schema (all phases)
- Seed data (exercises, muscles, mappings)
- Docker Compose configuration

### Phase 1: Foundation ✅
- **Day 3**: Authentication system (session-based)
- **Day 4**: Exercise & Muscle Management (API + UI)
- **Day 5**: Check-In Backend (API routes, service layer)
- **Day 6**: Check-In UI (form, soreness map, redirect flow)

## Docker Desktop Installation

### Why Docker?
- Isolated database environment
- One command to start everything
- No conflicts with other PostgreSQL installations
- Easy to reset/clean up
- Already configured in `docker-compose.yml`

### Installation Steps

1. **Download Docker Desktop**
   - URL: https://www.docker.com/products/docker-desktop
   - Download: Docker Desktop for Windows
   - File size: ~500MB

2. **Install Docker Desktop**
   - Run the installer
   - Follow the installation wizard
   - **Important**: Enable WSL 2 if prompted (required for Windows)
   - Restart your computer when installation completes

3. **Verify Installation**
   - Open Docker Desktop application
   - Wait for it to fully start (whale icon in system tray)
   - You should see "Docker Desktop is running" in the app

4. **System Requirements**
   - Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
   - Windows 11 64-bit: Home or Pro version 21H2 or higher
   - WSL 2 feature enabled
   - Virtualization enabled in BIOS

### Starting the Database

Once Docker Desktop is installed and running:

```bash
# Navigate to project directory
cd fitness

# Start PostgreSQL database
docker compose up -d

# Verify it's running
docker compose ps
```

You should see `fitness-postgres` container with status "Up".

## Complete Setup Steps (New PC)

### 1. Prerequisites
- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

### 2. Clone Repository
```bash
git clone https://github.com/mattj2606/fitness.git
cd fitness
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Database
```bash
docker compose up -d
```

Wait ~10 seconds for database to be ready.

### 5. Create Environment File
Create `.env.local` in project root:

```env
DATABASE_URL="postgresql://fitness:fitness_password@localhost:5432/fitness_db?schema=public"
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET="dev-session-secret-change-in-production"
```

### 6. Run Database Migrations
```bash
npm run db:migrate
```

This creates all database tables.

### 7. Seed Database (Optional)
```bash
npm run db:seed
```

This adds initial data:
- 14 muscle groups
- 10 exercises
- Exercise-muscle mappings

### 8. Start Development Server
```bash
npm run dev
```

App will be available at: http://localhost:3000

## Project Structure

```
fitness/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── checkin/           # Check-in page
│   ├── exercises/         # Exercises page
│   ├── login/             # Login page
│   ├── plan/              # Plan page (placeholder)
│   └── setup/             # Setup page
├── components/            # React components
│   ├── checkin/          # Check-in components
│   ├── exercises/        # Exercise components
│   └── layout/           # Layout components
├── lib/                   # Utilities and shared code
│   ├── auth/             # Authentication
│   ├── db/               # Database (Prisma)
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── validations/       # Zod schemas
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── docs/                  # Documentation
└── docker-compose.yml     # Docker configuration
```

## Key Files to Remember

### Configuration Files
- `docker-compose.yml` - Database configuration
- `.env.local` - Environment variables (create from `.env.local.example`)
- `package.json` - Dependencies and scripts
- `prisma/schema.prisma` - Database schema

### Important Scripts
- `npm run dev` - Start development server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run type-check` - Check TypeScript types

## Database Credentials

**Docker Compose:**
- User: `fitness`
- Password: `fitness_password`
- Database: `fitness_db`
- Port: `5432`

**Connection String:**
```
postgresql://fitness:fitness_password@localhost:5432/fitness_db?schema=public
```

## Troubleshooting

### Docker Desktop won't start
- Check Windows requirements (WSL 2, virtualization)
- Restart computer
- Check Docker Desktop logs
- Verify virtualization is enabled in BIOS

### "Port 5432 already in use"
- Another PostgreSQL is running
- Stop it or change port in `docker-compose.yml`

### "Can't connect to database"
- Check Docker container: `docker compose ps`
- Verify `.env.local` has correct DATABASE_URL
- Check credentials match `docker-compose.yml`

### Migration errors
- Ensure database is running
- Check connection string
- Try: `npx prisma migrate reset` (WARNING: deletes all data)

## What's Working

✅ Authentication system (setup, login, session)  
✅ Exercise management (CRUD, muscle mappings)  
✅ Check-in system (form, soreness map, API)  
✅ Database schema (all phases included)  
✅ Seed data (exercises, muscles, mappings)  

## What's Next

- Phase 1 Day 7: Recommendation Engine
- Phase 2: Workout Logging & Daily Plan
- Phase 3: Analytics & Visualization
- Phase 4-6: Nutrition, Medications, Health Profile

## Quick Reference

**Start everything:**
```bash
docker compose up -d    # Start database
npm run dev             # Start app
```

**Reset database:**
```bash
docker compose down -v  # Stop and remove volumes
docker compose up -d    # Start fresh
npm run db:migrate      # Create tables
npm run db:seed         # Add seed data
```

**View database:**
```bash
npm run db:studio       # Opens Prisma Studio in browser
```

## Notes

- All database tables are created upfront (including Phase 4-6 features)
- Session-based auth uses HTTP-only cookies
- Check-in form redirects to `/plan` after submission
- Exercise management includes muscle mapping editor
- All routes are protected with authentication

---

**Last Updated**: Session 1 - Phase 0 & Phase 1 Days 3-6 Complete

