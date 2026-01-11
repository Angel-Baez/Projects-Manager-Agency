import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { ProjectType } from './dto/project.type';

@Resolver(() => ProjectType)
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => [ProjectType], { name: 'projects' })
  async findAll(@Args('tenantId') tenantId: string) {
    return this.projectsService.findAll(tenantId);
  }

  @Query(() => ProjectType, { name: 'project', nullable: true })
  async findOne(@Args('id') id: string, @Args('tenantId') tenantId: string) {
    return this.projectsService.findById(id, tenantId);
  }

  @Query(() => [ProjectType], { name: 'projectsByClient' })
  async findByClientId(
    @Args('clientId') clientId: string,
    @Args('tenantId') tenantId: string
  ) {
    return this.projectsService.findByClientId(clientId, tenantId);
  }
}
