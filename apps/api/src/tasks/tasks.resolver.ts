import { Resolver, Query, Args } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { TaskType } from './dto/task.type';

@Resolver(() => TaskType)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Query(() => [TaskType], { name: 'tasks' })
  async findAll(@Args('tenantId') tenantId: string) {
    return this.tasksService.findAll(tenantId);
  }

  @Query(() => TaskType, { name: 'task', nullable: true })
  async findOne(@Args('id') id: string, @Args('tenantId') tenantId: string) {
    return this.tasksService.findById(id, tenantId);
  }

  @Query(() => [TaskType], { name: 'tasksByProject' })
  async findByProjectId(
    @Args('projectId') projectId: string,
    @Args('tenantId') tenantId: string
  ) {
    return this.tasksService.findByProjectId(projectId, tenantId);
  }
}
