import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ProjectBillingType {
  FIXED_PRICE = 'FIXED_PRICE',
  HOURLY = 'HOURLY',
  RETAINER = 'RETAINER',
  MILESTONE = 'MILESTONE',
}

registerEnumType(ProjectStatus, { name: 'ProjectStatus' });
registerEnumType(ProjectBillingType, { name: 'ProjectBillingType' });

@ObjectType()
export class ProjectType {
  @Field(() => ID)
  id: string;

  @Field()
  tenantId: string;

  @Field()
  clientId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  code: string;

  @Field({ nullable: true })
  projectManagerId?: string;

  @Field({ nullable: true })
  startDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field({ nullable: true })
  estimatedHours?: string;

  @Field(() => ProjectBillingType)
  billingType: ProjectBillingType;

  @Field({ nullable: true })
  budget?: string;

  @Field({ nullable: true })
  hourlyRate?: string;

  @Field(() => ProjectStatus)
  status: ProjectStatus;

  @Field()
  progress: string;

  @Field()
  isActive: boolean;

  @Field()
  isArchived: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
