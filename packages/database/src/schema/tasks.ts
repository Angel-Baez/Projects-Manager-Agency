import { pgTable, uuid, varchar, timestamp, text, integer, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { projects } from './projects';
import { users } from './users';

/**
 * Task status
 */
export const taskStatusEnum = pgEnum('task_status', [
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'BLOCKED',
  'DONE',
  'CANCELLED',
]);

/**
 * Task priority
 */
export const taskPriorityEnum = pgEnum('task_priority', [
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT',
]);

/**
 * Tasks - Granular work items in projects
 */
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),

  // Task info
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  code: varchar('code', { length: 50 }), // e.g., "TASK-001"

  // Assignment
  assigneeId: uuid('assignee_id').references(() => users.id),
  createdById: uuid('created_by_id')
    .notNull()
    .references(() => users.id),

  // Classification
  status: taskStatusEnum('status').default('TODO').notNull(),
  priority: taskPriorityEnum('priority').default('MEDIUM').notNull(),

  // Timeline
  dueDate: timestamp('due_date'),
  estimatedHours: varchar('estimated_hours', { length: 20 }),

  // Tracking
  orderIndex: integer('order_index').default(0), // For Kanban ordering

  // Parent task (for subtasks)
  parentTaskId: uuid('parent_task_id').references(() => tasks.id),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
export type TaskPriority = (typeof taskPriorityEnum.enumValues)[number];
