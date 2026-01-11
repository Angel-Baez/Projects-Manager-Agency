import { Resolver, Query, Args } from '@nestjs/graphql';
import { ClientsService } from './clients.service';
import { ClientType } from './dto/client.type';

@Resolver(() => ClientType)
export class ClientsResolver {
  constructor(private clientsService: ClientsService) {}

  @Query(() => [ClientType], { name: 'clients' })
  async findAll(@Args('tenantId') tenantId: string) {
    return this.clientsService.findAll(tenantId);
  }

  @Query(() => ClientType, { name: 'client', nullable: true })
  async findOne(@Args('id') id: string, @Args('tenantId') tenantId: string) {
    return this.clientsService.findById(id, tenantId);
  }
}
