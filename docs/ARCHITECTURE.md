# Architecture Overview

## Directory Structure

```
gh-achievements-lab/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Landing/marketing page
│   │   ├── (auth)/             # Auth route group
│   │   │   ├── signin/
│   │   │   └── signout/
│   │   ├── dashboard/          # Main app (protected)
│   │   │   ├── page.tsx        # Task list + filters
│   │   │   └── review/
│   │   │       └── page.tsx    # Weekly review
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/route.ts
│   │       ├── tasks/
│   │       │   ├── route.ts         # GET (list), POST (create)
│   │       │   └── [id]/route.ts    # PUT (update), DELETE
│   │       └── reviews/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── command-palette.tsx # Cmd+K quick-add
│   │   ├── task-list.tsx
│   │   ├── task-filters.tsx
│   │   ├── task-card.tsx
│   │   ├── weekly-review.tsx
│   │   └── auth/
│   │       ├── sign-in-button.tsx
│   │       └── user-menu.tsx
│   ├── db/
│   │   ├── index.ts            # Database connection
│   │   ├── schema.ts           # Drizzle schema definitions
│   │   └── seed.ts             # Development seed data
│   ├── lib/
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── utils.ts            # Shared utilities
│   │   └── parsers.ts          # NLP for dates/priority
│   └── types/
│       └── index.ts            # Shared TypeScript types
├── drizzle/
│   └── migrations/             # Generated SQL migrations
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── screenshots/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI pipeline
├── drizzle.config.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── CONTRIBUTING.md
└── README.md
```

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────>│  Next.js     │────>│  PostgreSQL  │
│              │<────│  App Router  │<────│  (Drizzle)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       │              ┌─────┴─────┐
       │              │ NextAuth  │
       │              │ (GitHub)  │
       │              └───────────┘
       │
  Cmd+K triggers
  command palette
```

### Request Lifecycle

1. **User Action** - User interacts with the UI (click, keyboard shortcut, form submit)
2. **Client Component** - React component handles the interaction, calls API
3. **API Route** - Next.js route handler validates input, checks auth session
4. **Database** - Drizzle ORM executes the query against PostgreSQL
5. **Response** - JSON response flows back to the client, UI updates

### Authentication Flow

1. User clicks "Sign in with GitHub"
2. NextAuth redirects to GitHub OAuth
3. GitHub redirects back with auth code
4. NextAuth exchanges code for access token, creates/updates user record
5. Session cookie is set, user is authenticated

## Database Schema

```
┌─────────────┐       ┌─────────────┐
│   users      │       │   tags       │
├─────────────┤       ├─────────────┤
│ id (PK)      │       │ id (PK)      │
│ name         │       │ name         │
│ email        │       │ color        │
│ emailVerified│       │ userId (FK)  │
│ image        │       └──────┬──────┘
│ createdAt    │              │
│ updatedAt    │              │
└──────┬──────┘       ┌──────┴──────┐
       │              │  task_tags   │
       │              ├─────────────┤
       │              │ taskId (FK)  │
       │              │ tagId (FK)   │
       │              └──────┬──────┘
       │                     │
┌──────┴──────┐       ┌──────┴──────┐
│weekly_reviews│       │   tasks      │
├─────────────┤       ├─────────────┤
│ id (PK)      │       │ id (PK)      │
│ weekStartDate│       │ title        │
│ summary      │       │ description  │
│ reflections  │       │ status       │
│ goals        │       │ priority     │
│ userId (FK)  │       │ dueDate      │
│ createdAt    │       │ completedAt  │
└─────────────┘       │ userId (FK)  │
                      │ createdAt    │
                      │ updatedAt    │
                      └─────────────┘
```

### Task Status Flow

```
inbox -> today -> done
  |        |       |
  v        v       v
backlog  this_week  archived
```

- **inbox** - Default for new tasks, unsorted
- **today** - Tasks to focus on today
- **this_week** - Planned for this week
- **backlog** - Someday/maybe
- **done** - Completed
- **archived** - No longer relevant

### Priority Levels

| Level | Label | Use Case |
|-------|-------|----------|
| `p0` | Critical | Blocking, must do now |
| `p1` | High | Important, do today |
| `p2` | Medium | Should do this week |
| `p3` | Low | Nice to have |

## Key Design Decisions

- **Next.js App Router** over Pages Router for server components and simplified data fetching
- **Drizzle ORM** over Prisma for better TypeScript inference and SQL-like query building
- **PostgreSQL** for relational data integrity (tasks, users, tags with many-to-many)
- **NextAuth.js** for battle-tested auth with minimal setup
- **shadcn/ui** for accessible, customizable components without framework lock-in
- **cmdk** for the command palette, following the Cmd+K UX pattern
