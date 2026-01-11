import { Injectable, Inject } from '@nestjs/common';
import { Database, tasks, Task, NewTask } from '@pma/database';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class TasksService {
  constructor(@Inject('DATABASE') private db: Database) {}

  async findAll(tenantId: string): Promise<Task[]> {
    return await this.db.select().from(tasks).where(eq(tasks.tenantId, tenantId));
  }

  async findById(id: string, tenantId: string): Promise<Task | undefined> {
    const result = await this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId)));
    return result[0];
  }

  async findByProjectId(projectId: string, tenantId: string): Promise<Task[]> {
    return await this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.tenantId, tenantId)));
  }

  async create(data: NewTask): Promise<Task> {
    const result = await this.db.insert(tasks).values(data).returning();
    return result[0];
  }

  async update(id: string, tenantId: string, data: Partial<NewTask>): Promise<Task> {
    const result = await this.db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId)))
      .returning();
    return result[0];
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    await this.db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId)));
    return true;
  }
}
