import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  PM = 'PM',
  DEV = 'DEV',
  DESIGNER = 'DESIGNER',
  CLIENT = 'CLIENT',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  tenantId: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  emailVerified?: Date;

  @Field()
  name: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field({ nullable: true })
  hourlyRate?: string;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  lastLoginAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
