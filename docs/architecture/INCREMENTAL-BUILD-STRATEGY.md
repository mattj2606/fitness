# Incremental Build Strategy: HTML Snippets → Components

## Approach

**Build bit by bit using HTML snippets/components from AI, focusing on getting input forms working first.**

## Strategy

### Phase 1: Core Input Forms (Priority)
1. **Check-in form** - Daily check-in inputs
2. **Workout logging form** - Exercise, sets, reps, weight
3. **Exercise creation form** - Add new exercises
4. **Basic navigation** - Move between forms

**Goal**: Get data ingestion working (web/desktop app)

### Phase 2: Display Components
1. **Plan page** - Show recommendations
2. **Exercise list** - Browse exercises
3. **Workout history** - View past workouts
4. **Analytics dashboard** - View metrics

### Phase 3: Polish
1. **Shadcn components** - Replace custom with Shadcn
2. **Mobile optimization** - Touch targets, responsive
3. **PWA features** - Offline, installable

## How to Integrate HTML Snippets

### Step 1: Receive HTML Snippet from AI
```html
<!-- Example: Check-in form snippet -->
<form class="space-y-4">
  <div>
    <label>Hours Slept</label>
    <input type="number" />
  </div>
  <!-- ... more fields ... -->
</form>
```

### Step 2: Convert to React Component
```tsx
// components/checkin/CheckinForm.tsx
'use client';

export function CheckinForm() {
  return (
    <form className="space-y-4">
      <div>
        <label>Hours Slept</label>
        <input type="number" />
      </div>
      {/* ... more fields ... */}
    </form>
  );
}
```

### Step 3: Add Functionality
```tsx
// Add state, validation, API calls
'use client';

import { useState } from 'react';

export function CheckinForm() {
  const [hoursSlept, setHoursSlept] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to save check-in
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... form fields ... */}
    </form>
  );
}
```

### Step 4: Integrate with Existing Code
```tsx
// app/checkin/page.tsx
import { CheckinForm } from '@/components/checkin/CheckinForm';

export default function CheckinPage() {
  return (
    <div className="p-4">
      <h1>Daily Check-In</h1>
      <CheckinForm />
    </div>
  );
}
```

## Component Structure

### For Each Page/Feature

1. **Create component file**
   ```
   components/[feature]/[ComponentName].tsx
   ```

2. **Start with HTML snippet**
   - Paste HTML from AI
   - Convert class → className
   - Convert to JSX syntax

3. **Add interactivity**
   - useState for form inputs
   - useEffect for data loading
   - API calls for submission

4. **Add validation**
   - Use Zod schemas (already have)
   - Form validation
   - Error handling

5. **Style with Tailwind**
   - Keep Tailwind classes from snippet
   - Adjust for mobile-first
   - Ensure touch targets (44x44px)

## Priority: Input Forms First

### Forms to Build (In Order)

1. **✅ Check-in Form** (Already exists, can enhance)
   - Hours slept
   - Sleep quality
   - Energy level
   - Soreness map
   - Time available

2. **Workout Logging Form** (Next priority)
   - Select exercise
   - Sets, reps, weight
   - Effort level
   - Notes
   - Add more sets

3. **Exercise Creation Form** (Already exists, can enhance)
   - Exercise name
   - Category
   - Equipment
   - Muscle targets
   - Instructions

4. **User Profile Form** (For goals, problems, preferences)
   - Goals selection
   - Problems input
   - Equipment available
   - Preferences

## Web/Desktop App Approach

### PWA Configuration

1. **Make it installable**
   - Add manifest.json
   - Service worker for offline
   - App icons

2. **Desktop-like experience**
   - Full-screen capable
   - Standalone mode
   - No browser chrome

3. **Offline support**
   - Cache forms
   - Sync when online
   - IndexedDB for local storage

## Workflow: AI Snippet → Component

### Example Workflow

**You provide:**
```
"Here's a check-in form HTML snippet: [paste HTML]"
```

**I will:**
1. Convert to React component
2. Add state management
3. Connect to existing API
4. Add validation
5. Style with Tailwind
6. Make mobile-friendly
7. Integrate into app

**Result:**
- Working form component
- Connected to backend
- Validated
- Mobile-optimized
- Ready to use

## Integration Points

### Existing Systems to Connect To

1. **Check-in Form** → `/api/checkins`
2. **Workout Form** → `/api/workouts` (need to create)
3. **Exercise Form** → `/api/exercises`
4. **Profile Form** → `/api/profile` (need to create)

### Data Flow

```
HTML Snippet (from AI)
    ↓
React Component (converted)
    ↓
Add State + Validation
    ↓
Connect to API
    ↓
Integrate into Page
    ↓
Test & Polish
```

## Next Steps

1. **Start with workout logging form**
   - Most critical for data collection
   - Needed for ML training
   - Core functionality

2. **Then enhance existing forms**
   - Check-in form (add features)
   - Exercise form (improve UX)

3. **Build display components**
   - Plan page (recommendations)
   - Analytics dashboard

4. **Add Shadcn gradually**
   - Replace custom components
   - Improve consistency
   - Better mobile experience

## Tips for HTML Snippets

### What to Provide

✅ **Good:**
- Complete form HTML
- Tailwind classes included
- Mobile-responsive
- Accessible (labels, ARIA)

❌ **Avoid:**
- Inline styles
- External CSS files
- jQuery dependencies
- Non-React patterns

### What I'll Do

1. Convert to React/Next.js
2. Add TypeScript types
3. Connect to existing APIs
4. Add validation
5. Make mobile-first
6. Ensure accessibility
7. Integrate with app

## Ready to Build

**Just provide HTML snippets/components and I'll:**
- Convert to React components
- Add functionality
- Connect to backend
- Make it work
- Integrate into app

**Focus areas:**
1. Input forms (data ingestion)
2. Web/desktop app (PWA)
3. Incremental building (bit by bit)

Let's start building! 🚀

