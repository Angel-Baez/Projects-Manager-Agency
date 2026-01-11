import { Injectable, Inject } from '@nestjs/common';
import { Database, users, User, NewUser } from '@pma/database';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE') private db: Database) {}

  async findAll(tenantId: string): Promise<User[]> {
    return await this.db.select().from(users).where(eq(users.tenantId, tenantId));
  }

  async findById(id: string, tenantId: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.tenantId, tenantId)));
    return result[0];
  }

  async findByEmail(email: string, tenantId: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.tenantId, tenantId)));
    return result[0];
  }

  async create(data: NewUser): Promise<User> {
    const result = await this.db.insert(users).values(data).returning();
    return result[0];
  }

  async update(id: string, tenantId: string, data: Partial<NewUser>): Promise<User> {
    const result = await this.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(users.id, id), eq(users.tenantId, tenantId)))
      .returning();
    return result[0];
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    await this.db.delete(users).where(and(eq(users.id, id), eq(users.tenantId, tenantId)));
    return true;
  }
}
