# 🏗️ Projects Manager Agency

> Multi-tenant project management platform designed specifically for agencies

A comprehensive solution for managing clients, projects, teams, deliverables, and billing in one unified platform. Built with modern technologies and enterprise-grade architecture.

---

## 🚨 Problem Statement

Agencies typically juggle multiple disconnected tools:
- **Projects** in Notion
- **Tasks** in Trello/Jira
- **Clients** in Excel spreadsheets
- **Payments** in Stripe (disconnected)
- **Communication** scattered across platforms

**Result:** Elegant chaos that slows down productivity and creates confusion.

---

## 💡 Solution

**Projects Manager Agency** eliminates this fragmentation by providing:

- ✅ **Multi-client management** - Handle unlimited clients
- ✅ **Multi-project tracking** - Each client can have multiple projects
- ✅ **Multi-team collaboration** - Assign roles and permissions
- ✅ **Integrated billing** - Stripe integration for seamless invoicing
- ✅ **Real-time updates** - Redis-powered live collaboration
- ✅ **Client portal** - Clients see progress without internal chaos

**One platform. One source of truth.**

---

## 🎯 Core Features (MVP)

### 1. Multi-tenant Architecture
- Agencies as tenants with complete data isolation
- Scalable row-level security (RLS)

### 2. Role-Based Access Control (RBAC)
- **Owner**: Full access to tenant settings and billing
- **Admin**: Full project and team management
- **PM (Project Manager)**: Manage assigned projects
- **Dev/Designer**: Work on assigned tasks
- **Client**: Read-only access to their projects

### 3. Project Management
- Projects linked to clients
- Tasks with Kanban board
- Milestones and deliverables
- Progress tracking

### 4. Time & Billing
- Time logging per task
- Hourly rates per user
- Automatic invoice generation via Stripe
- Multiple billing models (Fixed, Hourly, Retainer, Milestone)

### 5. Client Portal
- Clients view project progress
- Approve deliverables
- Communication hub

---

## ⚙️ Technical Architecture

### **Tech Stack**

#### Frontend
- **Next.js 15** (App Router)
- **Auth.js** (Multi-tenant authentication)
- **Apollo Client** (GraphQL)
- **Tailwind CSS** (Styling)
- **TypeScript**

#### Backend
- **NestJS** (API framework)
- **GraphQL with Apollo Server**
- **PostgreSQL** (Primary database)
- **Drizzle ORM** (Type-safe database access)
- **Redis** (Real-time features & caching)
- **Inngest** (Background jobs & automation)

#### Infrastructure
- **Docker Compose** (Local development)
- **pnpm** (Monorepo package manager)

#### Integrations
- **Stripe** (Payments & invoicing)
- **Brevo** (Email notifications)

---

## 📁 Project Structure

```
Projects-Manager-Agency/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   └── lib/           # Utilities & GraphQL client
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── tenants/       # Tenant management
│       │   ├── users/         # User management
│       │   ├── clients/       # Client management
│       │   ├── projects/      # Project management
│       │   ├── tasks/         # Task management
│       │   └── app.module.ts
│       └── package.json
│
├── packages/
│   └── database/               # Shared database package
│       ├── src/
│       │   ├── schema/        # Drizzle schemas
│       │   │   ├── tenants.ts
│       │   │   ├── users.ts
│       │   │   ├── clients.ts
│       │   │   ├── projects.ts
│       │   │   ├── tasks.ts
│       │   │   ├── time-logs.ts
│       │   │   └── invoices.ts
│       │   ├── index.ts
│       │   └── migrate.ts
│       └── drizzle.config.ts
│
├── docker-compose.yml          # PostgreSQL + Redis
├── pnpm-workspace.yaml         # Monorepo config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **Docker** & Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Projects-Manager-Agency.git
   cd Projects-Manager-Agency
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Docker services**
   ```bash
   pnpm docker:up
   ```

5. **Run database migrations**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

   This starts:
   - **Frontend**: http://localhost:3000
   - **API**: http://localhost:4000/graphql

---

## 📊 Database Schema

### Core Entities

1. **Tenants** - Agencies (multi-tenant root)
2. **Users** - Team members with roles
3. **Clients** - Companies hiring the agency
4. **Projects** - Client work with timelines and budgets
5. **Tasks** - Granular work items
6. **TimeLogs** - Time tracking for billing
7. **Invoices** - Billing documents

### Entity Relationships

```
Tenant (Agency)
  ├── Users (Team members)
  ├── Clients (External companies)
  │     └── Projects
  │           └── Tasks
  │                 └── TimeLogs
  └── Invoices
```

---

## 🛠️ Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps
pnpm lint             # Lint all code
pnpm type-check       # TypeScript type checking

# Database
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio

# Docker
pnpm docker:up        # Start PostgreSQL + Redis
pnpm docker:down      # Stop Docker services
```

### Database Migrations

```bash
# Generate migration after schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate

# View database in GUI
pnpm db:studio
```

---

## 🔐 Authentication & Multi-tenancy

### Multi-tenant Strategy

- **Row-Level Security (RLS)** with `tenantId` in every table
- Auth.js manages sessions with tenant context
- GraphQL resolvers automatically filter by tenant
- Complete data isolation between agencies

### Role Permissions

| Role     | Permissions                                      |
|----------|--------------------------------------------------|
| OWNER    | Full access (billing, settings, team)            |
| ADMIN    | Project & team management                        |
| PM       | Manage assigned projects                         |
| DEV      | Work on assigned tasks, log time                 |
| DESIGNER | Work on design tasks                             |
| CLIENT   | Read-only access to their projects               |

---

## 🎨 GraphQL API

### Example Queries

```graphql
# Get all projects for a tenant
query GetProjects($tenantId: String!) {
  projects(tenantId: $tenantId) {
    id
    name
    status
    progress
    client {
      companyName
    }
  }
}

# Get tasks for a project
query GetTasks($projectId: String!, $tenantId: String!) {
  tasksByProject(projectId: $projectId, tenantId: $tenantId) {
    id
    title
    status
    priority
    assignee {
      name
      avatar
    }
  }
}
```

### GraphQL Playground

Access the interactive playground at: http://localhost:4000/graphql

---

## 🔄 Background Jobs (Inngest)

Planned automation workflows:

1. **Task completed** → Email client + Generate report
2. **Invoice due** → Send reminder via Brevo
3. **Project milestone reached** → Notify team
4. **Time logged** → Update project budget tracking

---

## 💳 Stripe Integration

### Features

- Automatic invoice generation
- Multiple payment methods
- Subscription management for agencies
- Per-client billing
- Webhook handling for payment events

---

## 🗺️ Roadmap

### Phase 1: MVP Foundation ✅ (Current)
- [x] Monorepo setup
- [x] Database schema with Drizzle
- [x] NestJS GraphQL API
- [x] Next.js frontend base
- [x] Docker Compose setup
- [ ] Auth.js multi-tenant authentication
- [ ] Redis integration
- [ ] Inngest setup
- [ ] Stripe integration

### Phase 2: Core Features
- [ ] Dashboard UI
- [ ] Project management UI
- [ ] Kanban board for tasks
- [ ] Time tracking UI
- [ ] Client portal

### Phase 3: Advanced Features
- [ ] Real-time collaboration
- [ ] File uploads & attachments
- [ ] Reports & analytics
- [ ] Email notifications (Brevo)
- [ ] Mobile responsiveness

### Phase 4: Production Ready
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deployment guides
- [ ] Documentation

---

## 🤝 Contributing

This is a private agency tool. For internal development:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create a Pull Request

---

## 📄 License

Private & Proprietary - All Rights Reserved

---

## 🙋 Support

For questions or issues:
- Internal team: Contact the PM
- Technical issues: Create an issue in the repository

---

**Built with ❤️ for agencies who want clarity, not chaos.**
