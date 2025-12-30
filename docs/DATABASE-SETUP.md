# Database Setup Guide

## Why Docker for This Project?

Docker is the **best choice** for this fitness app because:

✅ **Consistent Environment** - Same database setup on any machine  
✅ **Easy Setup** - One command to start everything  
✅ **Isolated** - Doesn't affect other PostgreSQL installations  
✅ **Portable** - Easy to move between dev/prod  
✅ **Already Configured** - We've set up `docker-compose.yml` for you  
✅ **Self-Contained** - Database data persists in Docker volumes  

## Docker Setup Steps

### Step 1: Install Docker Desktop

1. **Download Docker Desktop for Windows**
   - Go to: https://www.docker.com/products/docker-desktop
   - Download Docker Desktop for Windows
   - Run the installer
   - Restart your computer when prompted

2. **Verify Installation**
   - Open Docker Desktop application
   - Wait for it to start (whale icon in system tray)
   - You should see "Docker Desktop is running"

### Step 2: Start the Database

Once Docker Desktop is running:

```bash
docker compose up -d
```

This will:
- Download PostgreSQL 15 image (first time only)
- Create a container named `fitness-postgres`
- Start the database on port 5432
- Create a volume for data persistence

**Verify it's running:**
```bash
docker compose ps
```

You should see `fitness-postgres` with status "Up"

### Step 3: Create Environment File

Create `.env.local` in the project root:

```env
DATABASE_URL="postgresql://fitness:fitness_password@localhost:5432/fitness_db?schema=public"
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET="dev-session-secret-change-in-production"
```

### Step 4: Run Migrations

```bash
npm run db:migrate
```

This creates all the database tables.

### Step 5: Seed Database (Optional)

```bash
npm run db:seed
```

This adds initial data (muscles, exercises, mappings).

## Alternative: Local PostgreSQL

If you prefer not to use Docker, you can install PostgreSQL locally:

### Installation Steps

1. **Download PostgreSQL**
   - Go to: https://www.postgresql.org/download/windows/
   - Download and install PostgreSQL 15+
   - Remember the password you set for the `postgres` user

2. **Create Database**
   - Open pgAdmin or psql
   - Run these commands:
   ```sql
   CREATE DATABASE fitness_db;
   CREATE USER fitness WITH PASSWORD 'fitness_password';
   GRANT ALL PRIVILEGES ON DATABASE fitness_db TO fitness;
   ```

3. **Update .env.local**
   ```env
   DATABASE_URL="postgresql://fitness:fitness_password@localhost:5432/fitness_db?schema=public"
   ```

## Which Should You Choose?

### Choose Docker if:
- ✅ You want the easiest setup
- ✅ You don't have PostgreSQL installed
- ✅ You want isolated database (won't conflict with other projects)
- ✅ You want consistent setup across machines

### Choose Local PostgreSQL if:
- ✅ You already have PostgreSQL installed
- ✅ You prefer managing databases directly
- ✅ You need specific PostgreSQL configurations
- ✅ You're comfortable with database administration

## Recommendation

**For this project, Docker is recommended** because:
1. It's already configured in `docker-compose.yml`
2. One command to start everything
3. No conflicts with other databases
4. Easy to reset/clean up

## Troubleshooting

### Docker Desktop won't start
- Check Windows requirements (WSL 2, virtualization enabled)
- Restart computer
- Check Docker Desktop logs

### "Port 5432 already in use"
- Another PostgreSQL is running
- Stop it or change port in `docker-compose.yml`

### "Can't connect to database"
- Check Docker container is running: `docker compose ps`
- Check `.env.local` has correct DATABASE_URL
- Verify credentials match `docker-compose.yml`

## Next Steps

Once database is running:
1. ✅ Run migrations: `npm run db:migrate`
2. ✅ Seed database: `npm run db:seed` (optional)
3. ✅ Start dev server: `npm run dev`
4. ✅ Test the app!


