import { pgTable, uuid, varchar, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { clients } from './clients';
import { projects } from './projects';

/**
 * Invoice status
 */
export const invoiceStatusEnum = pgEnum('invoice_status', [
  'DRAFT',
  'SENT',
  'PAID',
  'OVERDUE',
  'CANCELLED',
]);

/**
 * Invoices - Billing documents for clients
 */
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),

  // Invoice details
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),

  // Amounts (stored as strings to avoid float precision issues)
  subtotal: varchar('subtotal', { length: 20 }).notNull(),
  taxRate: varchar('tax_rate', { length: 10 }).default('0'),
  taxAmount: varchar('tax_amount', { length: 20 }).default('0'),
  total: varchar('total', { length: 20 }).notNull(),

  // Currency
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),

  // Status
  status: invoiceStatusEnum('status').default('DRAFT').notNull(),

  // Dates
  issueDate: timestamp('issue_date').notNull(),
  dueDate: timestamp('due_date').notNull(),
  paidAt: timestamp('paid_at'),

  // Stripe integration
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),

  // Notes
  notes: text('notes'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceStatus = (typeof invoiceStatusEnum.enumValues)[number];
