# gh-achievements-lab

Ambient task capture and weekly focus review for founders. A productivity app that helps you capture tasks effortlessly, stay focused on what matters, and reflect on your progress weekly.

[![CI](https://github.com/NikitaDmitrieff/gh-achievements-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/NikitaDmitrieff/gh-achievements-lab/actions/workflows/ci.yml)

## Features

- **Ambient Task Capture** - Quick-add tasks from anywhere with `Cmd/Ctrl+K` command palette
- **Smart Parsing** - Natural language due dates ("tomorrow", "next friday") and priority detection ("!!! urgent" -> P0)
- **Dashboard** - Task list with status/priority badges, filters, and search
- **Weekly Reviews** - Auto-generated summaries, reflection prompts, and goal setting
- **Authentication** - GitHub OAuth via NextAuth.js
- **Responsive Design** - Mobile-first UI with Tailwind CSS and shadcn/ui

## Screenshots

<!-- TODO: Add screenshots -->
| Dashboard | Command Palette | Weekly Review |
|-----------|----------------|---------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Command Palette](docs/screenshots/command-palette.png) | ![Weekly Review](docs/screenshots/weekly-review.png) |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Auth:** NextAuth.js (GitHub OAuth)
- **Styling:** Tailwind CSS, shadcn/ui
- **Testing:** Vitest, @testing-library/react
- **CI/CD:** GitHub Actions
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/NikitaDmitrieff/gh-achievements-lab.git
   cd gh-achievements-lab
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   See [Environment Variables](#environment-variables) for all required values.

4. **Set up the database:**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed  # Optional: load sample data
   ```

5. **Start the development server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | App URL (e.g., `http://localhost:3000`) | Yes |
| `NEXTAUTH_SECRET` | Random secret for session encryption | Yes |
| `GITHUB_ID` | GitHub OAuth App client ID | Yes |
| `GITHUB_SECRET` | GitHub OAuth App client secret | Yes |

### Generating `NEXTAUTH_SECRET`

```bash
openssl rand -base64 32
```

### Setting up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set the callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret into your `.env.local`

## Development Workflow

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests with Vitest |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema changes (dev only) |
| `pnpm db:seed` | Seed database with sample data |

### Code Quality

- **Linting:** ESLint with Next.js config
- **Type Checking:** `npx tsc --noEmit`
- **Testing:** `pnpm test`

All checks run automatically on pull requests via GitHub Actions.

## Documentation

- [API Documentation](docs/API.md) - All API endpoints
- [Architecture Overview](docs/ARCHITECTURE.md) - Project structure and data flow
- [Contributing Guide](CONTRIBUTING.md) - How to contribute

## License

MIT
