import { EntitySchema } from '@mikro-orm/core';
import { User } from '../../../domain/entities/user';
import { UserStatus } from '../../../domain/vos/user-status.enum';

export const UserSchema = new EntitySchema<User>({
  class: User,
  tableName: 'users',
  properties: {
    id: { type: 'string', primary: true },
    nickname: { type: 'string', length: 50 },
    avatarUrl: { type: 'string', length: 255, nullable: true },
    email: { type: 'string', length: 100, nullable: true },
    status: {
      enum: true,
      items: () => UserStatus,
      default: UserStatus.ACTIVE,
    },
    createdAt: { type: 'datetime' },
    updatedAt: { type: 'datetime' },
    deletedAt: { type: 'datetime', nullable: true },
  },
});
