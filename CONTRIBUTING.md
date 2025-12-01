# Contributing to Bug Bucket

First off, thank you for considering contributing to Bug Bucket! 🎉

Bug Bucket is an open-source project, and we love to receive contributions from our community. There are many ways to contribute, from writing tutorials or blog posts, improving the documentation, submitting bug reports and feature requests, or writing code.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Testing Guidelines](#testing-guidelines)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, Node version, browser, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### 📝 Improving Documentation

Documentation improvements are always welcome! This includes:

- Fixing typos or clarifying existing docs
- Adding examples or tutorials
- Translating documentation
- Creating video tutorials or blog posts

### 💻 Code Contributions

Ready to contribute code? Great! Here's how to get started.

---

## Development Setup

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 16.x (or Docker)
- Git

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/bug-bucket.git
cd bug-bucket
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
cp env.example .env
```

Edit `.env` with your local configuration.

### 4. Start Database

```bash
# Using Docker (recommended)
docker-compose up -d

# Or use your own PostgreSQL instance
```

### 5. Run Migrations and Seed

```bash
npm run db:push
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 7. Run Tests

```bash
npm test
```

---

## Coding Standards

### TypeScript

- **Use TypeScript strict mode** - No `any` types unless absolutely necessary
- **Prefer interfaces over types** for object shapes
- **Use explicit return types** for functions
- **Avoid non-null assertions** (`!`) when possible

### Code Style

We use Prettier and ESLint to maintain consistent code style:

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint
```

**Key conventions:**

- **No semicolons** (enforced by Prettier)
- **Double quotes** for strings
- **2 spaces** for indentation
- **100 character** line length
- **Trailing commas** in ES5 contexts

### React Best Practices

- **Use Server Components by default** - Only use Client Components when needed
- **Keep components small and focused** - Single responsibility principle
- **Use meaningful component names** - Descriptive and clear
- **Avoid prop drilling** - Use composition or context
- **Memoize expensive computations** - Use `useMemo` and `useCallback` appropriately

### File Naming

- **Components**: PascalCase (e.g., `BugCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **API routes**: kebab-case (e.g., `bug-groups.ts`)
- **Types**: PascalCase (e.g., `BugStatus.ts`)

### Folder Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Base UI components
│   └── [feature]/   # Feature-specific components
├── lib/             # Utilities and configuration
├── hooks/           # Custom React hooks
└── types/           # TypeScript type definitions
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear and semantic commit messages.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(bugs): add bulk status update functionality

Implement bulk actions for changing bug status.
Users can now select multiple bugs and update their status at once.

Closes #123
```

```bash
fix(auth): resolve session expiration issue

Fixed a bug where sessions were expiring prematurely.
Updated JWT expiration time to 30 days.
```

```bash
docs(readme): update installation instructions

Added Docker setup instructions and clarified environment variable configuration.
```

---

## Pull Request Process

### Before Submitting

1. **Create a new branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Write or update tests** for your changes

4. **Run the test suite**:
   ```bash
   npm test
   npm run lint
   npm run format:check
   ```

5. **Update documentation** if needed

6. **Commit your changes** following our commit guidelines

### Submitting the PR

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub

3. **Fill out the PR template** completely

4. **Link related issues** using keywords (Fixes #123, Closes #456)

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] Tests pass locally (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Formatting is correct (`npm run format:check`)
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages follow conventional commits
- [ ] PR description clearly describes the changes
- [ ] Related issues are linked

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **At least one maintainer** must approve
3. **All review comments** must be addressed
4. **Conflicts** must be resolved
5. **Maintainer will merge** once approved

---

## Project Structure

### Key Directories

- **`/src/app`** - Next.js App Router pages and API routes
- **`/src/components`** - Reusable React components
- **`/src/lib`** - Utilities, configurations, and helpers
- **`/prisma`** - Database schema and migrations
- **`/tests`** - E2E and integration tests
- **`/.github`** - GitHub Actions workflows and templates

### Important Files

- **`prisma/schema.prisma`** - Database schema
- **`src/lib/auth.ts`** - Authentication configuration
- **`src/lib/validations.ts`** - Zod validation schemas
- **`src/lib/utils.ts`** - Utility functions

---

## Testing Guidelines

### Unit Tests

- Test individual functions and components
- Mock external dependencies
- Aim for high coverage on critical paths

### Integration Tests

- Test API routes end-to-end
- Use test database
- Clean up after tests

### E2E Tests (Playwright)

- Test critical user flows
- Run against real database
- Keep tests fast and reliable

### Writing Tests

```typescript
// Example E2E test
import { test, expect } from '@playwright/test'

test('user can create a bug', async ({ page }) => {
  await page.goto('/signin')
  await page.fill('[name="email"]', 'owner@bugbucket.dev')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  await page.goto('/projects/demo-project')
  await page.click('text=New Bug')
  await page.fill('[name="title"]', 'Test Bug')
  await page.fill('[name="description"]', 'This is a test bug')
  await page.click('button[type="submit"]')
  
  await expect(page.locator('text=Test Bug')).toBeVisible()
})
```

---

## Getting Help

- **Discord**: [Join our community](https://discord.gg/bugbucket) (coming soon)
- **GitHub Discussions**: [Ask questions](https://github.com/yourusername/bug-bucket/discussions)
- **Documentation**: [Read the docs](./ARCHITECTURE.md)

---

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to Bug Bucket! 🚀
