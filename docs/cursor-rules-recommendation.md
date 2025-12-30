# Cursor Rules Recommendation

Based on the fitness app project requirements, here are the recommended cursor rules from awesome-cursorrules to use or combine.

## Project Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Platform**: Mobile-first PWA
- **Pattern**: React Server Components + API Routes

## Recommended Cursor Rules

### Primary Recommendations

1. **Next.js (App Router)** 
   - `rules/nextjs-app-router-cursorrules-prompt-file/.cursorrules`
   - Essential for App Router patterns

2. **Next.js (TypeScript, Tailwind)**
   - `rules/nextjs-typescript-tailwind-cursorrules-prompt-file/.cursorrules`
   - Core stack alignment (Next.js + TypeScript + Tailwind)

3. **TypeScript (Next.js, React)**
   - `rules/typescript-nextjs-react-cursorrules-prompt-file/.cursorrules`
   - Strong TypeScript patterns for Next.js + React

### Secondary Recommendations (to Combine)

4. **Next.js 14 (Tailwind, SEO)**
   - `rules/nextjs-14-tailwind-seo-cursorrules-prompt-file/.cursorrules`
   - Mobile-first considerations, SEO patterns (though SEO is secondary)

5. **TypeScript (Zod, Tailwind, Next.js)**
   - `rules/typescript-zod-tailwind-nextjs-cursorrules-prompt-file/.cursorrules`
   - Zod validation patterns (we're using Zod for API validation)

6. **TypeScript Code Convention**
   - `rules/typescript-code-convention-cursorrules-prompt-file/.cursorrules`
   - General TypeScript best practices

### Additional Considerations

7. **React (React Query)** (Optional)
   - `rules/react-react-query-cursorrules-prompt-file/.cursorrules`
   - If we use React Query for client-side data fetching

8. **Tailwind (shadcn/ui Integration)** (Optional)
   - `rules/tailwind-shadcn-ui-integration-cursorrules-prompt-file/.cursorrules`
   - If we use shadcn/ui components

## Recommended Approach

**Combine these core rules**:
1. Start with **Next.js (App Router)** as the base
2. Add **Next.js (TypeScript, Tailwind)** for stack alignment
3. Incorporate **TypeScript (Zod, Tailwind, Next.js)** for validation patterns
4. Add project-specific customizations from `cursor-rules-plan.md`

This gives us:
- ✅ Next.js App Router patterns
- ✅ TypeScript best practices
- ✅ Tailwind CSS guidelines
- ✅ Zod validation patterns
- ✅ Mobile-first considerations

## Custom Additions Needed

After combining the base rules, add these project-specific items:

1. **Prisma ORM patterns** (from our `cursor-rules-plan.md`)
2. **Mobile-first PWA patterns**
3. **Data ingestion focus** (fast forms, minimal typing)
4. **Server Component vs Client Component guidelines**
5. **API route patterns** (Next.js route handlers)
6. **Component organization** (atomic design)

## Implementation Steps

1. **Review the recommended rules files** from awesome-cursorrules
2. **Combine the relevant sections** into a single `.cursorrules` file
3. **Add project-specific rules** from `docs/cursor-rules-plan.md`
4. **Test and refine** during early implementation
5. **Update as needed** based on development experience

## Files to Review

From the awesome-cursorrules repository:

```
rules/nextjs-app-router-cursorrules-prompt-file/.cursorrules
rules/nextjs-typescript-tailwind-cursorrules-prompt-file/.cursorrules
rules/typescript-nextjs-react-cursorrules-prompt-file/.cursorrules
rules/typescript-zod-tailwind-nextjs-cursorrules-prompt-file/.cursorrules
rules/typescript-code-convention-cursorrules-prompt-file/.cursorrules
```

---

**Next Action**: Review these rules files and create a combined `.cursorrules` file tailored to this project, incorporating the project-specific requirements from `cursor-rules-plan.md`.


