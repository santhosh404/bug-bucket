# 🏗️ Bug Bucket Architecture

This document describes the architecture, design decisions, and technical implementation of Bug Bucket.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Data Model](#data-model)
- [Authentication & Authorization](#authentication--authorization)
- [API Design](#api-design)
- [Frontend Architecture](#frontend-architecture)
- [File Upload Strategy](#file-upload-strategy)
- [Notification System](#notification-system)
- [Performance Considerations](#performance-considerations)
- [Scalability](#scalability)

---

## Overview

Bug Bucket is built as a modern, full-stack TypeScript application using Next.js 16 with the App Router. The architecture follows these principles:

- **Type Safety**: Strict TypeScript across the entire stack
- **Server-First**: Leverage React Server Components for optimal performance
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Security by Default**: Role-based access control enforced at every layer
- **Developer Experience**: Fast feedback loops, great DX

---

## Technology Stack

### Core Framework
- **Next.js 16** (App Router) - Full-stack React framework
- **React 19** - UI library with Server Components
- **TypeScript 5** - Type-safe development

### Database & ORM
- **PostgreSQL 16** - Primary database
- **Prisma 7** - Type-safe ORM with migrations

### Authentication
- **NextAuth.js v5** - Authentication framework
- **bcryptjs** - Password hashing
- **JWT** - Session management

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS
- **ShadCN UI** - Accessible component library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Data Fetching & State
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Charts & Analytics
- **Recharts** - Data visualization

### Testing
- **Playwright** - E2E testing
- **Jest** - Unit testing (future)

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Husky** - Git hooks
- **Prettier** - Code formatting
- **ESLint** - Linting

---

## Data Model

### Entity Relationship Diagram

```
User
├── ownedProjects (1:N Project)
├── projectMemberships (1:N ProjectMember)
├── assignedBugs (1:N Bug)
├── createdBugs (1:N Bug)
├── bugComments (1:N BugComment)
├── activityLogs (1:N ActivityLog)
└── notifications (1:N Notification)

Project
├── owner (N:1 User)
├── members (1:N ProjectMember)
├── bugGroups (1:N BugGroup)
├── bugs (1:N Bug)
├── activityLogs (1:N ActivityLog)
└── notifications (1:N Notification)

BugGroup
├── project (N:1 Project)
└── bugs (1:N Bug)

Bug
├── project (N:1 Project)
├── bugGroup (N:1 BugGroup)
├── assignedTo (N:1 User)
├── createdBy (N:1 User)
├── comments (1:N BugComment)
├── attachments (1:N Attachment)
└── activityLogs (1:N ActivityLog)

BugComment
├── bug (N:1 Bug)
├── user (N:1 User)
└── attachments (1:N Attachment)
```

### Key Design Decisions

#### 1. **Separate ProjectMember Table**
Instead of a many-to-many join table, we use a dedicated `ProjectMember` entity to:
- Store role information (OWNER/MEMBER)
- Track when members were added
- Enable future features (permissions, custom roles)

#### 2. **Bug Groups for Organization**
Projects can have multiple bug groups (e.g., "V1.0 Bugs", "UI Issues"):
- Provides flexible organization
- Supports ordering
- Allows grouping by milestone, feature, or any custom criteria

#### 3. **Comprehensive Activity Logging**
Every significant action is logged in `ActivityLog`:
- Full audit trail
- Enables "Recent Activity" features
- Supports analytics and reporting

#### 4. **Flexible Notification System**
Notifications are stored in the database:
- In-app notifications
- Foundation for email/push notifications
- Read/unread tracking
- Metadata field for extensibility

#### 5. **Attachment Flexibility**
Attachments can belong to bugs OR comments:
- Supports rich bug descriptions
- Enables visual communication in comments
- Metadata stored separately from files

---

## Authentication & Authorization

### Authentication Flow

1. **Credentials Provider**
   - Email/password with bcrypt hashing
   - Passwords never stored in plain text
   - Minimum 6 characters enforced

2. **OAuth Provider (Optional)**
   - GitHub OAuth support
   - Configurable via environment variables
   - Seamless account linking

3. **Session Management**
   - JWT-based sessions
   - Stored in HTTP-only cookies
   - 30-day expiration (configurable)

### Authorization Model

#### Roles
- **Project Owner**: Full control over project, bugs, and members
- **Project Member**: Can view bugs, update assigned bugs, add comments

#### Permission Matrix

| Action | Owner | Member | Non-Member |
|--------|-------|--------|------------|
| View public project | ✅ | ✅ | ✅ |
| View private project | ✅ | ✅ | ❌ |
| Create bug | ✅ | ❌ | ❌ |
| Update own assigned bug | ✅ | ✅ | ❌ |
| Update any bug | ✅ | ❌ | ❌ |
| Delete bug | ✅ | ❌ | ❌ |
| Add comment | ✅ | ✅ | ❌ |
| Add/remove members | ✅ | ❌ | ❌ |
| Create bug group | ✅ | ❌ | ❌ |
| Delete project | ✅ | ❌ | ❌ |

#### Implementation

Authorization is enforced at multiple layers:

1. **API Layer** (`/src/lib/auth-utils.ts`)
   ```typescript
   await requireProjectOwner(projectId)  // Throws if not owner
   await requireProjectAccess(projectId) // Throws if no access
   ```

2. **Database Layer**
   - Prisma queries filtered by user permissions
   - No direct access to unauthorized data

3. **UI Layer**
   - Conditional rendering based on permissions
   - Disabled buttons for unauthorized actions

---

## API Design

### REST API Principles

All API routes follow RESTful conventions:

- **GET** - Retrieve resources
- **POST** - Create resources
- **PATCH** - Update resources
- **DELETE** - Remove resources

### Route Structure

```
/api
├── /auth
│   ├── /[...nextauth]      # NextAuth handlers
│   └── /signup             # User registration
├── /projects
│   ├── /                   # List/Create projects
│   ├── /[id]              # Get/Update/Delete project
│   ├── /[id]/members      # Manage members
│   ├── /[id]/groups       # Manage bug groups
│   ├── /[id]/bugs         # List bugs (filtered)
│   └── /[id]/analytics    # Project analytics
├── /bugs
│   ├── /                   # Create bug
│   ├── /[id]              # Get/Update/Delete bug
│   └── /[id]/comments     # Bug comments
└── /notifications
    └── /                   # List/Update notifications
```

### Request Validation

All inputs are validated using Zod schemas:

```typescript
// Example: Create bug validation
const createBugSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  // ...
})
```

### Response Format

Consistent response structure:

```typescript
// Success
{
  "bug": { /* bug data */ },
  "message": "Bug created successfully"
}

// Error
{
  "error": "Validation error",
  "details": [/* validation errors */]
}
```

### Pagination

List endpoints support pagination:

```
GET /api/projects/[id]/bugs?page=1&limit=20&sortBy=priority&sortOrder=desc
```

Response includes pagination metadata:

```json
{
  "bugs": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Frontend Architecture

### Component Organization

```
src/components/
├── ui/                    # ShadCN base components
├── layout/               # Layout components (Header, Sidebar)
├── forms/                # Form components
├── bugs/                 # Bug-specific components
├── projects/             # Project-specific components
└── dashboard/            # Dashboard components
```

### State Management Strategy

1. **Server State** (TanStack Query)
   - API data fetching
   - Caching and invalidation
   - Optimistic updates

2. **URL State** (Next.js Router)
   - Filters, pagination
   - Shareable links
   - Browser back/forward

3. **Local State** (React useState)
   - Form inputs
   - UI toggles
   - Temporary data

4. **Global State** (React Context)
   - Theme (dark/light)
   - User session
   - Notifications

### Server vs. Client Components

**Server Components** (default):
- Project listings
- Bug details
- Dashboard analytics
- Static content

**Client Components** (when needed):
- Forms with interactions
- Real-time updates
- Animations
- Event handlers

---

## File Upload Strategy

### Development (Local Storage)

Files stored in `/public/uploads`:
- Simple for development
- No external dependencies
- Not suitable for production

### Production (S3-Compatible)

Presigned URL approach:

1. Client requests presigned URL from API
2. API generates presigned URL (S3/MinIO)
3. Client uploads directly to S3
4. Client notifies API of successful upload
5. API stores metadata in database

Benefits:
- Reduces server load
- Faster uploads
- Scalable
- Works with any S3-compatible service

---

## Notification System

### In-App Notifications

Stored in database, displayed in UI:
- Real-time badge count
- Notification dropdown
- Mark as read functionality

### Email Notifications (Optional)

Triggered for:
- Bug assignment (always)
- Critical priority bugs (always)
- Status changes (configurable)
- New comments (configurable)

Implementation:
- SMTP configuration via environment variables
- Queued for async processing (future: Bull/Redis)
- Graceful degradation if email fails

---

## Performance Considerations

### Database Optimization

1. **Indexes**
   - All foreign keys indexed
   - Composite indexes for common queries
   - Status, priority, deadline indexed

2. **Query Optimization**
   - Prisma includes for N+1 prevention
   - Pagination for large datasets
   - Select only needed fields

3. **Connection Pooling**
   - Prisma connection pooling
   - Singleton pattern in development

### Frontend Optimization

1. **Code Splitting**
   - Automatic with Next.js
   - Dynamic imports for heavy components

2. **Image Optimization**
   - Next/Image for automatic optimization
   - Lazy loading
   - Responsive images

3. **Caching**
   - TanStack Query caching
   - Next.js static generation where possible
   - CDN for static assets

---

## Scalability

### Horizontal Scaling

The application is stateless and can scale horizontally:

1. **Application Servers**
   - Multiple Next.js instances behind load balancer
   - No shared state between instances
   - Session stored in JWT (no session store needed)

2. **Database**
   - PostgreSQL read replicas for read-heavy workloads
   - Connection pooling (PgBouncer)
   - Potential for sharding by project

3. **File Storage**
   - S3/CDN handles scaling automatically
   - No server-side file storage

### Vertical Scaling

For smaller deployments:
- Increase database resources
- Optimize queries and indexes
- Enable caching layers (Redis)

### Future Enhancements

- **Real-time Updates**: WebSockets or Server-Sent Events
- **Search**: Elasticsearch for full-text search
- **Caching**: Redis for session storage and caching
- **Queue**: Bull/BullMQ for background jobs
- **Monitoring**: Sentry, DataDog, or similar

---

## Security Considerations

1. **Input Validation**
   - Zod validation on all inputs
   - SQL injection prevented by Prisma
   - XSS prevented by React

2. **Authentication**
   - Bcrypt for password hashing
   - JWT with secure secrets
   - HTTP-only cookies

3. **Authorization**
   - Enforced at API and database layers
   - No client-side security

4. **Rate Limiting**
   - TODO: Implement rate limiting middleware
   - Prevent brute force attacks

5. **CORS**
   - Configured for same-origin only
   - Explicit CORS headers for API

---

## Monitoring & Logging

### Application Logs

- Structured logging with metadata
- Error tracking
- Performance metrics

### Database Logs

- Slow query logging
- Connection pool monitoring
- Migration tracking

### Recommended Tools

- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Vercel Analytics** - Performance monitoring
- **Prisma Pulse** - Database change streams

---

## Conclusion

Bug Bucket's architecture prioritizes:
- **Developer Experience**: Fast, type-safe development
- **Performance**: Optimized queries, caching, and rendering
- **Security**: Multi-layer authorization and validation
- **Scalability**: Stateless design, horizontal scaling
- **Maintainability**: Clear structure, comprehensive docs

For questions or suggestions, please open an issue or discussion on GitHub.
