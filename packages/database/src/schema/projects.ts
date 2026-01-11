import { pgTable, uuid, varchar, timestamp, boolean, text, date, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { clients } from './clients';
import { users } from './users';

/**
 * Project status enum
 */
export const projectStatusEnum = pgEnum('project_status', [
  'PLANNING',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
]);

/**
 * Project billing type
 */
export const projectBillingTypeEnum = pgEnum('project_billing_type', [
  'FIXED_PRICE',
  'HOURLY',
  'RETAINER',
  'MILESTONE',
]);

/**
 * Projects - Main entity for client work
 */
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),

  // Basic info
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  code: varchar('code', { length: 50 }).notNull(), // e.g., "PROJ-001"

  // Project manager
  projectManagerId: uuid('project_manager_id').references(() => users.id),

  // Timeline
  startDate: date('start_date'),
  endDate: date('end_date'),
  estimatedHours: varchar('estimated_hours', { length: 20 }),

  // Billing
  billingType: projectBillingTypeEnum('billing_type').default('FIXED_PRICE').notNull(),
  budget: varchar('budget', { length: 20 }), // Total budget
  hourlyRate: varchar('hourly_rate', { length: 20 }), // For hourly projects

  // Status
  status: projectStatusEnum('status').default('PLANNING').notNull(),
  progress: varchar('progress', { length: 5 }).default('0'), // Percentage 0-100

  // Settings
  isActive: boolean('is_active').default(true).notNull(),
  isArchived: boolean('is_archived').default(false).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];
export type ProjectBillingType = (typeof projectBillingTypeEnum.enumValues)[number];
