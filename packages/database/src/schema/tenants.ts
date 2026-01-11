import { pgTable, uuid, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core';

/**
 * Tenants (Agencies) - Multi-tenant root entity
 * Each agency is a separate tenant with isolated data
 */
export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),

  // Contact info
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  website: varchar('website', { length: 255 }),

  // Address
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),

  // Branding
  logo: text('logo'), // URL to logo
  primaryColor: varchar('primary_color', { length: 7 }), // Hex color

  // Subscription & billing
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('trial'),
  subscriptionPlan: varchar('subscription_plan', { length: 50 }).default('starter'),

  // Status
  isActive: boolean('is_active').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
