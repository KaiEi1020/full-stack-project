import { EntitySchema } from '@mikro-orm/core';
import { UserAuth } from '../../../domain/entities/user-auth';
import { IdentityType } from '../../../domain/vos/identity-type.enum';

export const UserAuthSchema = new EntitySchema<UserAuth>({
  class: UserAuth,
  tableName: 'user_auths',
  properties: {
    id: { type: 'string', primary: true },
    userId: { type: 'string', length: 36 },
    identityType: {
      enum: true,
      items: () => IdentityType,
    },
    identifier: { type: 'string', length: 100 },
    credential: { type: 'string', length: 255, nullable: true },
    createdAt: { type: 'datetime' },
    updatedAt: { type: 'datetime' },
    deletedAt: { type: 'datetime', nullable: true },
  },
});
