# 🚀 Bug Bucket - Complete Setup & Deployment Guide

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Docker and Docker Compose (for local development)
- PostgreSQL database (local or hosted)
- Git

## 🏃‍♂️ Quick Start (3 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Setup database
docker-compose up -d
cp env.example .env.local
npm run db:push
npm run db:seed

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Demo Credentials:**

- Email: `owner@bugbucket.dev`
- Password: `password123`

## 📁 Project Structure

```
bug-bucket/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data script
├── src/
│   ├── app/                # Next.js app router pages
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard page
│   │   ├── projects/      # Projects pages
│   │   └── bugs/          # Bug detail pages
│   │   └── settings/      # Settings page
│   ├── components/        # React components
│   │   ├── ui/           # ShadCN UI components
│   │   ├── layouts/      # Layout components
│   │   ├── forms/        # Form components
│   │   ├── providers/    # Context providers
│   │   ├── project/      # Project tab components
│   │   └── bug/          # Bug-related components
│   ├── lib/              # Utilities
│   │   ├── auth.ts       # NextAuth configuration
│   │   ├── auth-utils.ts # Auth helper functions
│   │   ├── prisma.ts     # Prisma client
│   │   ├── utils.ts      # General utilities
│   │   └── validations.ts # Zod schemas
│   └── hooks/            # Custom React hooks
│       ├── use-api.ts    # API query hooks
│       └── use-auth.ts   # Auth hooks
├── public/               # Static assets
├── docker-compose.yml    # Docker services
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/bugbucket?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# OAuth (Optional)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
ENABLE_GITHUB_AUTH="false"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Bug Bucket"

# File Upload (Optional)
UPLOAD_PROVIDER="local"
UPLOAD_MAX_SIZE=10485760

# Email Notifications (Optional)
ENABLE_EMAIL_NOTIFICATIONS="false"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM="noreply@bugbucket.dev"
```

## 🗄️ Database Setup

### Local Development (with Docker)

```bash
# Start PostgreSQL container
docker-compose up -d

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed demo data
npm run db:seed

# Open Prisma Studio (Database GUI)
npm run db:studio
```

### Production Database

For production, use a hosted PostgreSQL service:

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

Update `DATABASE_URL` in your environment variables.

## 🔐 Authentication Setup

### Email/Password (Default)

Enabled by default. Users can sign up with email and password.

### GitHub OAuth (Optional)

1. Create a GitHub OAuth App: https://github.com/settings/developers
2. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Add credentials to `.env.local`:
   ```env
   GITHUB_CLIENT_ID="your_client_id"
   GITHUB_CLIENT_SECRET="your_client_secret"
   ENABLE_GITHUB_AUTH="true"
   ```

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start dev server with turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Create and run migration
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed demo data

# Testing
npm run test             # Run Playwright tests
npm run test:ui          # Run tests with UI
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Configure environment variables
   - Deploy!

3. **Add Database:**
   - Use Vercel Postgres or connect external database
   - Update `DATABASE_URL` environment variable

4. **Run Migrations:**
   ```bash
   # After deployment, run from your local machine:
   npx prisma migrate deploy
   ```

### Deploy with Docker

```bash
# Build image
docker build -t bug-bucket .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  bug-bucket
```

### Deploy to Other Platforms

- **Railway**: Connect GitHub, add PostgreSQL, deploy
- **DigitalOcean App Platform**: Import from GitHub
- **AWS**: Use ECS/Fargate with RDS PostgreSQL
- **Self-hosted**: Use Docker Compose on your VPS

## 📦 Production Checklist

Before going to production:

- [ ] Generate strong `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- [ ] Use production database (not Docker local)
- [ ] Set up database backups
- [ ] Configure email SMTP for notifications
- [ ] Enable GitHub OAuth (optional)
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure domain and SSL certificate
- [ ] Review and update CORS settings
- [ ] Set up CI/CD pipeline
- [ ] Run security audit: `npm audit`
- [ ] Review and harden Prisma queries
- [ ] Set up rate limiting for API routes
- [ ] Configure file upload storage (S3)
- [ ] Test all auth flows in production
- [ ] Create initial admin user

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# Restart database
docker-compose restart postgres

# Check connection
npx prisma db pull
```

### Prisma Client Issues

```bash
# Regenerate client
npm run db:generate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues

- Verify `NEXTAUTH_URL` matches your domain
- Check `NEXTAUTH_SECRET` is set
- Clear cookies and try again

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Secrets**: Use strong, unique values for all secrets
3. **Database**: Use connection pooling for production
4. **API Routes**: Implement rate limiting
5. **Input Validation**: All inputs validated with Zod
6. **SQL Injection**: Protected by Prisma ORM
7. **XSS**: React escapes output by default
8. **CSRF**: NextAuth handles CSRF tokens
9. **Dependencies**: Run `npm audit` regularly
10. **Backups**: Automate database backups

## 📊 Monitoring & Analytics

### Recommended Tools

- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics, Plausible
- **Performance**: Vercel Speed Insights
- **Uptime**: UptimeRobot, Better Uptime
- **Logs**: Vercel Logs, Logtail

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TanStack Query Documentation](https://tanstack.com/query)
- [ShadCN UI Documentation](https://ui.shadcn.com)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file.

---

**Need Help?** Open an issue on GitHub or check the documentation.
