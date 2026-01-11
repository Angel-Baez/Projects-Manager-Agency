# 🏛️ Architecture Documentation

## Overview

Projects Manager Agency is built as a **monorepo** using modern, type-safe technologies with a focus on scalability, maintainability, and developer experience.

---

## 🎯 Key Architectural Decisions

### 1. **Monorepo Structure**

**Decision**: Use pnpm workspaces for monorepo management

**Rationale**:
- Shared type definitions between frontend and backend
- Centralized dependency management
- Faster builds with workspace caching
- Independent deployment of frontend/backend

**Structure**:
```
/apps       - Deployable applications (web, api)
/packages   - Shared libraries (database, ui, types, config)
```

---

### 2. **Multi-tenancy Strategy**

**Decision**: Row-Level Security (RLS) with `tenantId` column

**Rationale**:
- Simple to implement and understand
- Cost-effective (single database)
- Good performance with proper indexing
- Easy to migrate tenants if needed

**Alternative Considered**: Database-per-tenant (too complex for MVP)

**Implementation**:
- Every table has `tenantId` foreign key
- GraphQL context includes tenant from auth session
- Services automatically filter by `tenantId`
- Database indexes on `(tenantId, id)` for performance

---

### 3. **Database & ORM**

**Decision**: PostgreSQL + Drizzle ORM

**Rationale**:
- **PostgreSQL**: Industry standard, ACID compliance, excellent JSON support
- **Drizzle**: Type-safe, zero runtime overhead, excellent DX
- **vs Prisma**: Drizzle is lighter, faster, and more flexible for complex queries
- **vs TypeORM**: Drizzle has better TypeScript inference

**Schema Design**:
```typescript
tenants (agencies)
  ├── users (team members with roles)
  ├── clients (external companies)
  │     └── projects (work for clients)
  │           └── tasks (granular work items)
  │                 └── time_logs (billable time)
  └── invoices (billing)
```

---

### 4. **API Layer**

**Decision**: NestJS + GraphQL (Apollo Server)

**Rationale**:
- **NestJS**: Enterprise-grade Node.js framework with excellent DI
- **GraphQL over REST**:
  - Flexible queries (fetch exactly what you need)
  - Single endpoint
  - Strong typing
  - Better for complex relational data

**Example GraphQL Advantage**:
```graphql
# Get projects with nested client and tasks in ONE query
query {
  projects(tenantId: "...") {
    name
    client { companyName }
    tasks { title, status }
  }
}
```

**Module Structure**:
```
src/
├── tenants/        # Tenant CRUD
├── users/          # User management
├── clients/        # Client management
├── projects/       # Project management
├── tasks/          # Task management
├── time-logs/      # Time tracking
└── invoices/       # Billing
```

Each module follows NestJS patterns:
- `*.module.ts` - Module definition
- `*.service.ts` - Business logic
- `*.resolver.ts` - GraphQL resolvers
- `dto/*.ts` - Input/Output types

---

### 5. **Frontend Architecture**

**Decision**: Next.js 15 (App Router) + Apollo Client

**Rationale**:
- **Next.js 15**: Latest features, React Server Components
- **App Router**: Better code organization, nested layouts
- **Apollo Client**: Best-in-class GraphQL client with caching
- **TypeScript**: End-to-end type safety

**Folder Structure**:
```
src/
├── app/                  # App Router pages
│   ├── (auth)/          # Auth routes (login, register)
│   ├── (dashboard)/     # Protected dashboard routes
│   └── layout.tsx
├── components/          # React components
│   ├── ui/             # Base UI components
│   └── features/       # Feature-specific components
└── lib/                # Utilities
    ├── apollo.ts       # GraphQL client
    ├── auth.ts         # Auth helpers
    └── utils.ts
```

---

### 6. **Authentication**

**Decision**: Auth.js (NextAuth v5 beta)

**Rationale**:
- Official Next.js recommendation
- Multi-tenant support via custom callbacks
- Flexible providers (credentials, OAuth)
- Built-in CSRF protection

**Multi-tenant Flow**:
1. User logs in with email + password
2. Backend verifies credentials
3. Auth.js session includes `tenantId` and `role`
4. Every API request includes session token
5. GraphQL context extracts `tenantId` from token
6. Resolvers filter data by `tenantId`

**Session Structure**:
```typescript
{
  user: {
    id: "user-uuid",
    tenantId: "tenant-uuid",
    role: "PM",
    email: "user@example.com"
  }
}
```

---

### 7. **Real-time Features**

**Decision**: Redis + GraphQL Subscriptions

**Rationale**:
- **Redis**: Fast pub/sub for real-time updates
- **GraphQL Subscriptions**: Type-safe real-time data
- **Use Cases**:
  - Kanban board updates (task moved)
  - New comments/activity
  - Time tracking updates

**Example**:
```graphql
subscription OnTaskUpdated($projectId: ID!) {
  taskUpdated(projectId: $projectId) {
    id
    title
    status
  }
}
```

---

### 8. **Background Jobs**

**Decision**: Inngest

**Rationale**:
- Type-safe event-driven workflows
- Built-in retries and error handling
- Local development support
- Better DX than BullMQ or Agenda

**Use Cases**:
- Send email when task completed
- Generate invoice on project completion
- Send payment reminders
- Weekly project reports

**Example**:
```typescript
inngest.createFunction(
  { id: "send-task-completion-email" },
  { event: "task.completed" },
  async ({ event }) => {
    await brevo.sendEmail({
      to: event.data.clientEmail,
      subject: "Task completed",
      template: "task-completed"
    });
  }
);
```

---

### 9. **Payments**

**Decision**: Stripe (Server-side integration)

**Rationale**:
- Industry standard
- Excellent API and documentation
- Supports multiple billing models
- Webhooks for event handling

**Integration Points**:
1. **Tenant subscriptions**: Agency pays for platform
2. **Client invoicing**: Agency bills clients
3. **Payment tracking**: Link Stripe payments to invoices

**Billing Models Supported**:
- Fixed price projects
- Hourly billing (based on time logs)
- Retainers
- Milestone-based payments

---

### 10. **Email Notifications**

**Decision**: Brevo (formerly Sendinblue)

**Rationale**:
- Affordable transactional email service
- Template management
- Delivery tracking
- Better than SendGrid for European market

**Email Types**:
- Task assignments
- Project updates
- Invoice notifications
- Weekly digests

---

## 🔒 Security Considerations

### Data Isolation
- All queries filtered by `tenantId`
- Database constraints prevent cross-tenant access
- Unit tests verify tenant isolation

### Authentication
- Passwords hashed with bcrypt
- JWT tokens for session management
- CSRF protection via Auth.js
- Rate limiting on auth endpoints

### Authorization
- Role-based access control (RBAC)
- Permission checks in GraphQL resolvers
- Client users can only see their projects

### Input Validation
- GraphQL schema validation
- `class-validator` decorators in DTOs
- Sanitize user input to prevent XSS/SQL injection

---

## 📊 Performance Optimizations

### Database
- Indexes on `(tenantId, id)` for fast lookups
- Composite indexes on foreign keys
- Connection pooling via Drizzle

### Caching
- Redis for session storage
- Apollo Client cache on frontend
- GraphQL DataLoader for N+1 prevention

### Frontend
- Next.js Server Components
- Image optimization
- Code splitting by route
- Lazy loading for heavy components

---

## 🧪 Testing Strategy

### Unit Tests
- Service layer logic
- Utility functions
- Business rules

### Integration Tests
- GraphQL resolvers
- Database operations
- Auth flow

### E2E Tests
- Critical user flows
- Multi-tenant isolation
- Payment flows

---

## 🚀 Deployment Architecture

### Development
```
Docker Compose
  ├── PostgreSQL (port 5432)
  ├── Redis (port 6379)
  ├── API (port 4000)
  └── Web (port 3000)
```

### Production (Recommended)
```
Vercel (Frontend)
  └── Next.js app

Railway/Render (Backend)
  ├── NestJS API
  ├── PostgreSQL (managed)
  └── Redis (managed)

Stripe (Payments)
Brevo (Emails)
Inngest Cloud (Background jobs)
```

---

## 🔄 Data Flow Examples

### Creating a Task
1. User creates task in UI (Next.js)
2. Apollo Client sends GraphQL mutation
3. NestJS resolver validates input
4. Service checks user permissions
5. Drizzle inserts task into PostgreSQL
6. Inngest event triggers email to assignee
7. Redis pub/sub notifies connected clients
8. Apollo Client updates cache

### Generating Invoice
1. PM marks project as billable
2. Inngest job aggregates time logs
3. Calculate total: `sum(duration * hourlyRate)`
4. Create Stripe invoice
5. Send to client via Brevo
6. Store invoice in database
7. Update project billing status

---

## 📚 Further Reading

- [Next.js 15 Docs](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Multi-tenancy Patterns](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/overview)

---

**Last Updated**: 2026-01-11
