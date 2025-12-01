# 🪣 Bug Bucket

<div align="center">

**A modern, production-ready bug tracker for development teams**

[![CI](https://github.com/yourusername/bug-bucket/workflows/CI/badge.svg)](https://github.com/yourusername/bug-bucket/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 🎯 Overview

Bug Bucket is an open-source, self-hosted bug tracking system designed with developers in mind. Track bugs, manage projects, collaborate with your team, and gain insights through powerful analytics—all with a clean, modern interface that doesn't get in your way.

> **"Found a bug? Great — now we can squash it."** 🐛

## ✨ Features

### 🔐 **Authentication & Authorization**

- Email/password authentication with secure bcrypt hashing
- Optional GitHub OAuth integration
- Role-based access control (Project Owners & Members)
- JWT-based sessions with NextAuth.js

### 📊 **Project Management**

- Create unlimited projects with custom visibility (Public/Private)
- Add team members and manage permissions
- Organize bugs into customizable groups
- Project-level analytics dashboard

### 🐛 **Bug Tracking**

- Rich-text bug descriptions
- File attachments (images, videos, PDFs)
- Priority levels (Low, Medium, High, Critical)
- Status workflow (Open → In Progress → Blocked → Resolved → Closed)
- Assignee management (members only)
- Optional deadlines with reminders
- Full activity timeline

### 💬 **Collaboration**

- Real-time comments on bugs
- @mentions and notifications
- Activity logs for full audit trail
- In-app notification system
- Email notifications (configurable)

### 📈 **Analytics & Insights**

- Bug distribution by status and priority
- Open vs. closed trends over time
- Upcoming deadline tracking
- Team workload distribution
- Interactive charts with Recharts

### 🎨 **Modern UI/UX**

- Dark/Light theme support with persistence
- Fully responsive (mobile-first design)
- Smooth animations with Framer Motion
- Accessible (WCAG 2.1 compliant)
- ShadCN UI components + Tailwind CSS

### 🚀 **Developer Experience**

- TypeScript strict mode
- Prisma ORM with PostgreSQL
- Comprehensive API with Zod validation
- Docker & Docker Compose for local dev
- E2E tests with Playwright
- CI/CD ready (GitHub Actions)

---

## 🚀 Quick Start

Get Bug Bucket running locally in 3 commands:

```bash
# 1. Clone and install
git clone https://github.com/yourusername/bug-bucket.git
cd bug-bucket
npm install

# 2. Setup database (requires Docker)
docker-compose up -d
npm run db:push
npm run db:seed

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with:

- **Email:** `owner@bugbucket.dev`
- **Password:** `password123`

---

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **PostgreSQL** 16.x (or use Docker Compose)
- **npm** or **pnpm**
- **Docker** (optional, for local database)

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bug-bucket.git
cd bug-bucket
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp env.example .env
```

Update `.env` with your configuration:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/bugbucket"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

**Option A: Using Docker (Recommended)**

```bash
docker-compose up -d
npm run db:push
npm run db:seed
```

**Option B: Using Existing PostgreSQL**

```bash
npm run db:migrate
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

- **[Architecture Guide](./ARCHITECTURE.md)** - System design and technical decisions
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to Bug Bucket
- **[Release Process](./RELEASE.md)** - Steps for creating releases
- **[Security Policy](./SECURITY.md)** - Vulnerability reporting
- **[Code of Conduct](./CODE_OF_CONDUCT.md)** - Community guidelines

---

## 🗂️ Project Structure

```
bug-bucket/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── api/               # API routes
│   │   ├── project/           # Project pages
│   │   └── dashboard/         # Dashboard
│   ├── components/            # React components
│   ├── lib/                   # Utilities & config
│   ├── hooks/                 # Custom React hooks
│   └── styles/                # Global styles
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── tests/                     # E2E tests
├── .github/                   # GitHub Actions
└── docker-compose.yml         # Local dev services
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run linter
npm run lint

# Check formatting
npm run format:check
```

---

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t bug-bucket .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  bug-bucket
```

---

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bug-bucket)

1. Click the button above
2. Add environment variables
3. Deploy!

### Self-Hosted

See [RELEASE.md](./RELEASE.md) for detailed deployment instructions.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [ShadCN UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Recharts](https://recharts.org/) - Charts

---

## 📞 Support

- 📖 [Documentation](./ARCHITECTURE.md)
- 🐛 [Issue Tracker](https://github.com/yourusername/bug-bucket/issues)
- 💬 [Discussions](https://github.com/yourusername/bug-bucket/discussions)

---

<div align="center">

Made with ❤️ by the Bug Bucket team

**[⬆ back to top](#-bug-bucket)**

</div>
