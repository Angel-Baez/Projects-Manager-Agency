import { pgTable, uuid, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { projects } from './projects';
import { tasks } from './tasks';
import { users } from './users';

/**
 * Time logs - Track time spent on tasks for billing and reporting
 */
export const timeLogs = pgTable('time_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'set null' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Time tracking
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  duration: integer('duration'), // Duration in minutes

  // Description
  description: text('description'),

  // Billing
  isBillable: varchar('is_billable', { length: 10 }).default('true'),
  hourlyRate: varchar('hourly_rate', { length: 20 }), // Rate at time of logging

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type TimeLog = typeof timeLogs.$inferSelect;
export type NewTimeLog = typeof timeLogs.$inferInsert;
