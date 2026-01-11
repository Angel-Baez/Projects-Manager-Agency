import { Injectable, Inject } from '@nestjs/common';
import { Database, tenants, Tenant, NewTenant } from '@pma/database';
import { eq } from 'drizzle-orm';

@Injectable()
export class TenantsService {
  constructor(@Inject('DATABASE') private db: Database) {}

  async findAll(): Promise<Tenant[]> {
    return await this.db.select().from(tenants);
  }

  async findById(id: string): Promise<Tenant | undefined> {
    const result = await this.db.select().from(tenants).where(eq(tenants.id, id));
    return result[0];
  }

  async findBySlug(slug: string): Promise<Tenant | undefined> {
    const result = await this.db.select().from(tenants).where(eq(tenants.slug, slug));
    return result[0];
  }

  async create(data: NewTenant): Promise<Tenant> {
    const result = await this.db.insert(tenants).values(data).returning();
    return result[0];
  }

  async update(id: string, data: Partial<NewTenant>): Promise<Tenant> {
    const result = await this.db
      .update(tenants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    await this.db.delete(tenants).where(eq(tenants.id, id));
    return true;
  }
}
