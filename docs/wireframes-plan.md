# Wireframes Planning & Component Breakdown

This document captures wireframe designs and maps them to implementation components.

## Overview

The mobile/Next.js app serves as the primary **data ingestion interface**. Wireframes guide the implementation of fast, mobile-optimized screens for capturing daily fitness data.

## Wireframe Inventory

*Wireframes will be added here as HTML is provided*

### Planned Screens

1. **Morning Check-In Screen**
   - Hours slept input
   - Sleep quality slider
   - Energy level buttons
   - Soreness body map (SVG)
   - Acute pain toggle
   - Time available selector
   - Submit button

2. **Today's Plan Screen**
   - Day type display (Push/Pull/Legs/PT/Rest)
   - Recommended exercises list
   - Sets/reps/weight targets
   - Start Workout button
   - Modify options

3. **Active Workout Screen**
   - Exercise name
   - Set counter
   - Weight input
   - Reps input
   - Effort selector
   - Rest timer
   - Next set/Complete exercise buttons

4. **Workout History Screen**
   - List of past workouts
   - Date/type filters
   - Quick stats
   - Tap to view details

5. **Analytics/Muscle Visualization Screen**
   - Muscle visualization (SVG)
   - View toggle (today/7 days/split)
   - Key metrics cards
   - Neglected muscles highlight

6. **Settings/Configuration Screens**
   - User preferences
   - Exercise management
   - Data export options

## Component Mapping

Once wireframes are provided, we'll map each screen element to:

- **React Components** (Server vs Client)
- **API Endpoints** needed
- **Database Queries** required
- **State Management** approach
- **Styling Strategy** (Tailwind classes)

## Mobile-First Considerations

- Touch target sizes (minimum 44x44px)
- Vertical scrolling optimized
- Large, clear typography
- Minimal text input
- Fast form completion
- Offline capability for data entry

## Interaction Patterns

- **Swipe gestures** for navigation (if applicable)
- **Tap targets** for primary actions
- **Long press** for secondary actions (if needed)
- **Haptic feedback** for confirmations (PWA)

## Design System

- Color palette
- Typography scale
- Spacing system
- Icon set
- Button styles
- Form input styles

---

*This document will be updated as wireframes are provided and reviewed*


