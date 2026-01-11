import { Injectable, Inject } from '@nestjs/common';
import { Database, projects, Project, NewProject } from '@pma/database';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class ProjectsService {
  constructor(@Inject('DATABASE') private db: Database) {}

  async findAll(tenantId: string): Promise<Project[]> {
    return await this.db.select().from(projects).where(eq(projects.tenantId, tenantId));
  }

  async findById(id: string, tenantId: string): Promise<Project | undefined> {
    const result = await this.db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.tenantId, tenantId)));
    return result[0];
  }

  async findByClientId(clientId: string, tenantId: string): Promise<Project[]> {
    return await this.db
      .select()
      .from(projects)
      .where(and(eq(projects.clientId, clientId), eq(projects.tenantId, tenantId)));
  }

  async create(data: NewProject): Promise<Project> {
    const result = await this.db.insert(projects).values(data).returning();
    return result[0];
  }

  async update(id: string, tenantId: string, data: Partial<NewProject>): Promise<Project> {
    const result = await this.db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(projects.id, id), eq(projects.tenantId, tenantId)))
      .returning();
    return result[0];
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    await this.db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.tenantId, tenantId)));
    return true;
  }
}
