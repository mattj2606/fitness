# Quick Test Checklist

## Before Testing

- [ ] Database is running (Docker or local PostgreSQL)
- [ ] `.env.local` file created with DATABASE_URL
- [ ] Database migrations run: `npm run db:migrate`
- [ ] Database seeded (optional): `npm run db:seed`
- [ ] Dev server running: `npm run dev`

## Testing Steps

### 1. Authentication Flow ✅
- [ ] Visit http://localhost:3000
- [ ] Should redirect to `/setup` (if no user exists)
- [ ] Fill setup form and click "Get Started"
- [ ] Should redirect to home page
- [ ] Visit http://localhost:3000/login
- [ ] Click "Sign In"
- [ ] Should redirect to home page

### 2. Check-In Flow ✅
- [ ] Visit http://localhost:3000/checkin
- [ ] Form loads correctly
- [ ] Enter hours slept (e.g., 7.5)
- [ ] Select sleep quality (click 1-5)
- [ ] Select energy level (low/normal/high)
- [ ] Click on muscle area in soreness map
- [ ] Select intensity (0-5)
- [ ] Toggle acute pain (if needed)
- [ ] Add pain note (if acute pain enabled)
- [ ] Select time available (short/normal/long)
- [ ] Click "Confirm Today"
- [ ] Should redirect to `/plan` page
- [ ] Visit `/checkin` again
- [ ] Form should be pre-filled with previous data

### 3. Exercise Management ✅
- [ ] Visit http://localhost:3000/exercises
- [ ] List of exercises displays
- [ ] Click category filter (push, pull, legs, etc.)
- [ ] Exercises filter correctly
- [ ] Click "+ New Exercise"
- [ ] Fill form and create exercise
- [ ] New exercise appears in list
- [ ] Click on exercise card
- [ ] Detail modal opens
- [ ] Check/uncheck muscle groups
- [ ] Adjust weights
- [ ] Click "Save Mappings"
- [ ] Mappings saved
- [ ] Click "Delete" on exercise
- [ ] Exercise removed

## Common Issues & Fixes

### Issue: "Can't reach database server"
**Fix**: 
1. Check if PostgreSQL is running
2. Verify `.env.local` has correct DATABASE_URL
3. Test connection: `npx prisma db pull` (should work)

### Issue: "Migration failed"
**Fix**:
1. Check database exists
2. Verify user has permissions
3. Try: `npx prisma migrate reset` (deletes all data)

### Issue: "Page not found" or redirect loops
**Fix**:
1. Check browser console for errors
2. Clear cookies
3. Check session creation in Network tab

### Issue: Form doesn't submit
**Fix**:
1. Check browser console for errors
2. Check Network tab for API errors
3. Verify API routes are working

## What to Check

### Browser Console
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Server Logs
- Check terminal where `npm run dev` is running
- Look for error messages
- Check database connection errors

### Database
- Verify data is being saved
- Use Prisma Studio: `npm run db:studio`
- Check tables have data

## Next Steps After Testing

If everything works:
1. ✅ Proceed to Phase 1 Day 7: Recommendation Engine
2. ✅ Document any issues found
3. ✅ Fix any bugs discovered

If issues found:
1. Document the issue
2. Check error messages
3. Fix and retest


