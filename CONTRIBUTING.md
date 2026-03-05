# Contributing to gh-achievements-lab

Thanks for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/<your-username>/gh-achievements-lab.git
   cd gh-achievements-lab
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up your environment:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required values (see [Environment Variables](README.md#environment-variables)).

4. **Set up the database:**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start developing:**

   ```bash
   pnpm dev
   ```

## Workflow

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feat/your-feature
   ```

2. **Make your changes** and ensure quality:

   ```bash
   pnpm lint        # Check linting
   npx tsc --noEmit # Check types
   pnpm test        # Run tests
   ```

3. **Commit using conventional commits:**

   ```
   feat: add task sorting by due date
   fix: prevent duplicate tags on quick-add
   docs: update API endpoint examples
   refactor: extract task filter logic
   test: add coverage for weekly review API
   chore: update dependencies
   ```

   Format: `type: short description`

   Reference issues when applicable: `feat: add tag filtering (#42)`

4. **Push and open a pull request** against `main`.

## Code Style

- **TypeScript** - All code must be typed. Avoid `any`.
- **ESLint** - Follow the project's ESLint configuration. Run `pnpm lint` before committing.
- **Formatting** - Consistent formatting is enforced by the linter.
- **Imports** - Use the `@/*` path alias for src-relative imports.

## Project Structure

See [Architecture Overview](docs/ARCHITECTURE.md) for a detailed breakdown of the directory structure and design decisions.

## Pull Request Guidelines

- Keep PRs focused on a single change
- Write a clear title and description
- Link related issues (e.g., "Closes #7")
- Ensure all CI checks pass
- Add tests for new features and bug fixes
- Update documentation if you change APIs or behavior

## Reporting Issues

- Use [GitHub Issues](https://github.com/NikitaDmitrieff/gh-achievements-lab/issues)
- Include steps to reproduce for bugs
- Provide context on what you expected vs. what happened

## Questions?

Open a discussion or reach out via issues. We're happy to help!
