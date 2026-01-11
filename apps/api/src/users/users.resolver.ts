import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserType } from './dto/user.type';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [UserType], { name: 'users' })
  async findAll(@Args('tenantId') tenantId: string) {
    return this.usersService.findAll(tenantId);
  }

  @Query(() => UserType, { name: 'user', nullable: true })
  async findOne(@Args('id') id: string, @Args('tenantId') tenantId: string) {
    return this.usersService.findById(id, tenantId);
  }
}
