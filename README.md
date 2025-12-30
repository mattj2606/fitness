# Fitness Intelligence App

Personal, self-hosted fitness intelligence app designed for daily use on mobile (iPhone) via a mobile-first web app.

## Features

- Fast daily check-ins (sleep, energy, soreness)
- Structured workout logging
- Muscle-level analytics
- Simple, explainable workout recommendations
- Nutrition tracking (calories & macros) with voice input
- Medication and supplement tracking
- Health profile (blood work, medical history)

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Platform**: Mobile-first PWA

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Docker Desktop installed (for PostgreSQL)
- npm or pnpm package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/mattj2606/fitness.git
   cd fitness
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start PostgreSQL database
   ```bash
   docker compose up -d
   ```

4. Set up environment variables
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your database credentials.

5. Initialize Prisma and run migrations
   ```bash
   npm run db:migrate
   ```

6. Seed the database (optional)
   ```bash
   npm run db:seed
   ```

7. Start the development server
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Documentation

All project documentation is in the [`docs/`](./docs/) folder:

- **[MIGRATION-GUIDE.md](./docs/MIGRATION-GUIDE.md)** - Complete guide for setting up on a new PC
- **[SETUP-SUMMARY.md](./docs/SETUP-SUMMARY.md)** - Quick reference for setup commands
- **[DATABASE-SETUP.md](./docs/DATABASE-SETUP.md)** - Detailed database setup instructions
- **[TESTING-GUIDE.md](./docs/TESTING-GUIDE.md)** - Testing instructions and checklist
- **[Session-1.md](./docs/Session-1.md)** - Development session log
- **[project.md](./docs/project.md)** - Project overview and requirements
- **[technical-evaluation.md](./docs/technical-evaluation.md)** - Technical roadmap
- **[delivery-order-and-checkpoints.md](./docs/delivery-order-and-checkpoints.md)** - Implementation plan

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Database

The app uses PostgreSQL with Prisma ORM. Database migrations are managed through Prisma.

- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio to view/edit data
- `npm run db:seed` - Seed the database with initial data

## Project Structure

```
app/                    # Next.js App Router pages
  (routes)/            # Route groups
  api/                 # API routes
components/            # React components
  ui/                  # Base UI components
  checkin/             # Check-in components
  workout/             # Workout components
  analytics/           # Analytics components
lib/                   # Utilities and shared code
  db/                  # Database utilities (Prisma)
  services/            # Business logic
  utils/               # Helper functions
  types/               # TypeScript types
prisma/                # Prisma schema and migrations
docs/                  # Project documentation
```

## Current Status

✅ **Phase 0**: Infrastructure Setup Complete  
✅ **Phase 1 Day 3**: Authentication System  
✅ **Phase 1 Day 4**: Exercise & Muscle Management  
✅ **Phase 1 Day 5**: Check-In Backend  
✅ **Phase 1 Day 6**: Check-In UI  

**Next**: Phase 1 Day 7 - Recommendation Engine

## Docker Setup

This project uses Docker Compose for PostgreSQL. See [docs/DATABASE-SETUP.md](./docs/DATABASE-SETUP.md) for detailed instructions.

**Quick Start:**
```bash
docker compose up -d    # Start database
docker compose ps       # Check status
docker compose down     # Stop database
```

## License

Private project - personal use only
