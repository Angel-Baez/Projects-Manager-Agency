import { pgTable, uuid, varchar, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

/**
 * User roles in the system
 * - OWNER: Full access to tenant settings and billing
 * - ADMIN: Full access to projects and team management
 * - PM: Project Manager - can manage assigned projects
 * - DEV: Developer - can work on assigned tasks
 * - DESIGNER: Designer - can work on design tasks
 * - CLIENT: External client - read-only access to their projects
 */
export const userRoleEnum = pgEnum('user_role', [
  'OWNER',
  'ADMIN',
  'PM',
  'DEV',
  'DESIGNER',
  'CLIENT',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),

  // Auth
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('email_verified'),
  password: varchar('password', { length: 255 }), // Hashed, optional (OAuth users won't have this)

  // Profile
  name: varchar('name', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 500 }),
  title: varchar('title', { length: 100 }), // Job title
  phone: varchar('phone', { length: 50 }),

  // Role & permissions
  role: userRoleEnum('role').default('DEV').notNull(),

  // Billing rate (for time tracking)
  hourlyRate: varchar('hourly_rate', { length: 20 }), // Stored as string to avoid float issues

  // Status
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = (typeof userRoleEnum.enumValues)[number];
