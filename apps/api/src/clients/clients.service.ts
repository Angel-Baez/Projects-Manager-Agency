import { Injectable, Inject } from '@nestjs/common';
import { Database, clients, Client, NewClient } from '@pma/database';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class ClientsService {
  constructor(@Inject('DATABASE') private db: Database) {}

  async findAll(tenantId: string): Promise<Client[]> {
    return await this.db.select().from(clients).where(eq(clients.tenantId, tenantId));
  }

  async findById(id: string, tenantId: string): Promise<Client | undefined> {
    const result = await this.db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.tenantId, tenantId)));
    return result[0];
  }

  async create(data: NewClient): Promise<Client> {
    const result = await this.db.insert(clients).values(data).returning();
    return result[0];
  }

  async update(id: string, tenantId: string, data: Partial<NewClient>): Promise<Client> {
    const result = await this.db
      .update(clients)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(clients.id, id), eq(clients.tenantId, tenantId)))
      .returning();
    return result[0];
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    await this.db.delete(clients).where(and(eq(clients.id, id), eq(clients.tenantId, tenantId)));
    return true;
  }
}
