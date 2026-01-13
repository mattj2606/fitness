# Testing Guide

## Prerequisites

Before testing, you need:

1. **PostgreSQL Database Running**
   - Option A: Docker (recommended)
     ```bash
     docker compose up -d
     ```
   - Option B: Local PostgreSQL instance
     - Install PostgreSQL locally
     - Create database: `fitness_db`
     - User: `fitness` / Password: `fitness_password`

2. **Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Update `DATABASE_URL` to match your PostgreSQL setup

3. **Database Migrations**
   ```bash
   npm run db:migrate
   ```

4. **Seed Database** (optional but recommended)
   ```bash
   npm run db:seed
   ```

## Testing Steps

### 1. Start Development Server

```bash
npm run dev
```

The app should start at `http://localhost:3000`

### 2. Test Authentication Flow

1. **First Visit** - Should redirect to `/setup`
   - Visit: `http://localhost:3000`
   - Expected: Redirects to `/setup` page

2. **User Setup**
   - Fill in email (optional)
   - Click "Get Started"
   - Expected: Creates user, creates session, redirects to home

3. **Login** - If you already have a user
   - Visit: `http://localhost:3000/login`
   - Click "Sign In"
   - Expected: Creates session, redirects to home

### 3. Test Check-In Flow

1. **Navigate to Check-In**
   - Visit: `http://localhost:3000/checkin`
   - Expected: Check-in form loads

2. **Fill Out Form**
   - Hours Slept: Enter a number (e.g., 7.5)
   - Sleep Quality: Click a number (1-5)
   - Energy Level: Click low/normal/high
   - Soreness Map: 
     - Click on a muscle area button (e.g., "Chest")
     - Select intensity (0-5)
     - Repeat for other areas
   - Acute Pain: Toggle if needed, add note
   - Time Available: Select short/normal/long

3. **Submit Form**
   - Click "Confirm Today"
   - Expected: 
     - Form submits
     - Redirects to `/plan` page
     - Check-in saved to database

4. **Verify Data Saved**
   - Visit: `http://localhost:3000/checkin` again
   - Expected: Form pre-filled with previous check-in data

### 4. Test Exercise Management

1. **Navigate to Exercises**
   - Visit: `http://localhost:3000/exercises`
   - Expected: List of exercises (from seed data)

2. **Filter Exercises**
   - Click category buttons (push, pull, legs, etc.)
   - Expected: Exercises filter by category

3. **Create Exercise**
   - Click "+ New Exercise"
   - Fill in form:
     - Name: "Test Exercise"
     - Category: Select one
     - Equipment: (optional)
     - Instructions: (optional)
   - Click "Create Exercise"
   - Expected: New exercise appears in list

4. **View Exercise Details**
   - Click on an exercise card
   - Expected: Modal opens with exercise details

5. **Edit Muscle Mappings**
   - In exercise detail modal
   - Check/uncheck muscle groups
   - Adjust weights (0.0-1.0)
   - Click "Save Mappings"
   - Expected: Mappings saved

6. **Delete Exercise**
   - Click "Delete" on an exercise
   - Confirm deletion
   - Expected: Exercise removed from list

### 5. Test API Endpoints (Optional)

You can test API endpoints directly:

```bash
# Get session
curl http://localhost:3000/api/auth/session

# Get exercises
curl http://localhost:3000/api/exercises

# Get today's check-in
curl http://localhost:3000/api/checkins/today
```

**Note**: API endpoints require authentication (session cookie).

## Common Issues

### Database Connection Error

**Error**: `Can't reach database server`

**Solutions**:
1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `.env.local`
3. Verify database credentials

### Migration Errors

**Error**: `Migration failed`

**Solutions**:
1. Check database connection
2. Ensure database exists
3. Try: `npx prisma migrate reset` (WARNING: deletes all data)

### TypeScript Errors

**Error**: Type errors during build

**Solutions**:
1. Run: `npm run type-check`
2. Fix any type errors
3. Ensure all dependencies installed: `npm install`

### Session Not Working

**Error**: Redirects to login repeatedly

**Solutions**:
1. Check browser cookies are enabled
2. Clear cookies and try again
3. Verify session creation in API response

## Testing Checklist

- [ ] Database running and connected
- [ ] Migrations applied
- [ ] Seed data loaded (optional)
- [ ] Dev server starts without errors
- [ ] Can create user account
- [ ] Can log in
- [ ] Can access check-in page
- [ ] Can fill out check-in form
- [ ] Soreness map interactive
- [ ] Can submit check-in
- [ ] Redirects to plan page
- [ ] Check-in data persists
- [ ] Can view exercises
- [ ] Can create exercise
- [ ] Can edit muscle mappings
- [ ] Can delete exercise

## Next Steps After Testing

Once testing is complete:
1. Document any bugs or issues
2. Proceed to Phase 1 Day 7: Recommendation Engine
3. Or fix any issues found during testing



