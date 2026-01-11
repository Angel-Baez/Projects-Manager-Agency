import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class TenantType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  primaryColor?: string;

  @Field({ nullable: true })
  stripeCustomerId?: string;

  @Field({ nullable: true })
  subscriptionStatus?: string;

  @Field({ nullable: true })
  subscriptionPlan?: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
