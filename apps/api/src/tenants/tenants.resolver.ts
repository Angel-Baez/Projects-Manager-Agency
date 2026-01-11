import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TenantsService } from './tenants.service';
import { TenantType } from './dto/tenant.type';
import { CreateTenantInput } from './dto/create-tenant.input';
import { UpdateTenantInput } from './dto/update-tenant.input';

@Resolver(() => TenantType)
export class TenantsResolver {
  constructor(private tenantsService: TenantsService) {}

  @Query(() => [TenantType], { name: 'tenants' })
  async findAll() {
    return this.tenantsService.findAll();
  }

  @Query(() => TenantType, { name: 'tenant', nullable: true })
  async findOne(@Args('id') id: string) {
    return this.tenantsService.findById(id);
  }

  @Mutation(() => TenantType)
  async createTenant(@Args('input') input: CreateTenantInput) {
    return this.tenantsService.create(input);
  }

  @Mutation(() => TenantType)
  async updateTenant(
    @Args('id') id: string,
    @Args('input') input: UpdateTenantInput
  ) {
    return this.tenantsService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteTenant(@Args('id') id: string) {
    return this.tenantsService.delete(id);
  }
}
