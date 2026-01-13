# Cursor Rules Planning

This document outlines the Cursor rules configuration needed for efficient AI-assisted development of this fitness app.

**Note**: This project uses **AnswerSome cursor rules** (not standard `.cursorrules`). These rules will be integrated into the architecture planning process.

## Overview

AnswerSome cursor rules will guide AI assistance to:
- Follow project-specific patterns
- Maintain consistency across codebase
- Enforce mobile-first principles
- Use correct TypeScript/React patterns
- Follow Next.js App Router conventions
- Integrate with architecture planning decisions

## Required Cursor Rules

### 1. TypeScript & Type Safety

- Always use TypeScript strict mode patterns
- Define types/interfaces before implementation
- Use Prisma-generated types from database
- Avoid `any` - use `unknown` if needed with proper type guards
- Use Zod for runtime validation on API boundaries

### 2. Next.js App Router Patterns

- Use Server Components by default
- Mark Client Components with `"use client"` directive
- Prefer Server Components for data fetching
- Use async Server Components when possible
- Place API routes in `app/api/` directory
- Use route handlers for API endpoints (not Pages Router)

### 3. React Component Patterns

- Functional components only
- Use React hooks appropriately
- Extract reusable logic to custom hooks
- Keep components small and focused
- Use composition over inheritance
- Prefer Server Components for static content

### 4. Component Organization

- Atomic design principles: atoms → molecules → organisms → templates → pages
- Place components in `components/` directory
- Group related components in subdirectories (`components/checkin/`, `components/workout/`)
- Co-locate component files with related utilities when appropriate
- Use index files for clean imports

### 5. Database & Prisma

- Always use Prisma Client for database access
- Never write raw SQL (unless absolutely necessary)
- Use transactions for multi-step operations
- Handle database errors gracefully
- Use `prisma.$transaction()` for complex operations
- Index frequently queried fields

### 6. API Route Patterns

- Use Next.js route handlers (`route.ts` files)
- Validate all inputs with Zod schemas
- Return consistent error response format
- Use proper HTTP status codes
- Handle errors with try-catch blocks
- Log errors appropriately
- Always authenticate requests (except public routes)

### 7. Mobile-First CSS & Tailwind

- Mobile-first approach: base styles for mobile, then `md:`, `lg:` breakpoints
- Use Tailwind utility classes
- Prefer Tailwind over custom CSS
- Use consistent spacing scale
- Ensure touch targets are at least 44x44px
- Test on mobile viewport sizes

### 8. File Naming Conventions

- Components: PascalCase (`CheckinForm.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- Types: PascalCase (`WorkoutData.ts`)
- API routes: lowercase (`route.ts`)

### 9. Code Organization

```
app/
  (routes)/          # Route groups for organization
  api/               # API routes
  components/        # Reusable components
    ui/              # Base UI components
    checkin/         # Feature-specific components
    workout/
    analytics/
  lib/               # Utilities and shared code
    db/              # Database utilities
    services/        # Business logic
    utils/           # Helper functions
    types/           # TypeScript types
  hooks/             # Custom React hooks (if needed)
```

### 10. Error Handling

- Use error boundaries for React components
- Handle API errors gracefully with user-friendly messages
- Log errors for debugging
- Never expose sensitive error details to client
- Use consistent error response format

### 11. Performance

- Optimize images with Next.js Image component
- Use dynamic imports for large components
- Implement proper loading states
- Use Suspense boundaries appropriately
- Cache API responses when appropriate
- Optimize database queries (avoid N+1)

### 12. Accessibility

- Use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Provide alt text for images
- Ensure sufficient color contrast

### 13. Security

- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries (Prisma handles this)
- Implement proper authentication checks
- Use HTTP-only cookies for sessions
- Protect API routes with authentication middleware

### 14. Testing Considerations

- Write testable code (pure functions where possible)
- Extract business logic from components
- Use dependency injection for testability
- Document complex logic with comments
- Consider test cases when implementing features

### 15. Documentation

- Comment complex business logic
- Document API endpoints (inline comments)
- Use JSDoc for public functions
- Keep README updated
- Document architecture decisions in ADRs

## Implementation Notes

- When generating code, always follow these patterns
- Prefer existing patterns over new approaches
- Ask for clarification if requirements are unclear
- Suggest improvements if a better pattern exists
- Maintain consistency with existing codebase

## Mobile-First Reminders

- Always consider mobile viewport first
- Test interactions with touch in mind
- Ensure forms are easy to complete on mobile
- Minimize typing requirements
- Use large touch targets
- Consider one-handed usage

## Data Ingestion Focus

- Optimize for fast data entry
- Minimize form fields
- Use smart defaults
- Auto-save when possible
- Provide clear validation feedback
- Support offline entry with sync

## AnswerSome Cursor Rules Integration

**Status**: Awaiting AnswerSome cursor rules configuration

Once AnswerSome cursor rules are provided, they will be:
1. Reviewed and validated against project requirements
2. Integrated into architecture planning documents
3. Used to inform component patterns and code organization
4. Referenced during implementation checkpoints

### Integration Points

- **Architecture Planning**: Rules will inform technical decisions
- **Component Design**: Rules will guide React component patterns
- **API Design**: Rules will shape API route structure
- **Database Patterns**: Rules will inform Prisma usage patterns
- **Development Workflow**: Rules will guide AI-assisted coding

---

**Next Steps**: 
1. ✅ Document project-specific rule requirements (this document)
2. ⏳ Receive AnswerSome cursor rules
3. ⏳ Review and integrate rules into architecture planning
4. ⏳ Update delivery order to reflect rule integration
5. ⏳ Begin implementation with rules in place

