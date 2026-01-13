# Setup Summary - Quick Reference

## One-Time Setup (New PC)

```bash
# 1. Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# 2. Clone repository
git clone https://github.com/mattj2606/fitness.git
cd fitness

# 3. Install dependencies
npm install

# 4. Start database
docker compose up -d

# 5. Create .env.local (copy from .env.local.example)
# DATABASE_URL="postgresql://fitness:fitness_password@localhost:5432/fitness_db?schema=public"

# 6. Run migrations
npm run db:migrate

# 7. Seed database (optional)
npm run db:seed

# 8. Start dev server
npm run dev
```

## Daily Development

```bash
# Start database (if not running)
docker compose up -d

# Start dev server
npm run dev
```

## Database Commands

```bash
npm run db:migrate    # Run migrations
npm run db:seed       # Seed database
npm run db:studio     # Open Prisma Studio
```

## Docker Commands

```bash
docker compose up -d        # Start database
docker compose down         # Stop database
docker compose ps           # Check status
docker compose down -v      # Stop and remove volumes (reset)
```

## Project Status

✅ **Phase 0**: Infrastructure complete  
✅ **Phase 1 Day 3**: Authentication  
✅ **Phase 1 Day 4**: Exercise Management  
✅ **Phase 1 Day 5**: Check-In Backend  
✅ **Phase 1 Day 6**: Check-In UI  

**Next**: Phase 1 Day 7 - Recommendation Engine


