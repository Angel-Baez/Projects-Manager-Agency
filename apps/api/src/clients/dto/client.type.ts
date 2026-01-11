import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ClientType {
  @Field(() => ID)
  id: string;

  @Field()
  tenantId: string;

  @Field()
  companyName: string;

  @Field({ nullable: true })
  companyWebsite?: string;

  @Field({ nullable: true })
  companyLogo?: string;

  @Field()
  contactName: string;

  @Field()
  contactEmail: string;

  @Field({ nullable: true })
  contactPhone?: string;

  @Field({ nullable: true })
  contactTitle?: string;

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
  stripeCustomerId?: string;

  @Field({ nullable: true })
  billingEmail?: string;

  @Field({ nullable: true })
  taxId?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
