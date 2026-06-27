import { UserAuth } from '../entities/user-auth';
import { IdentityType } from '../vos/identity-type.enum';

export const USER_AUTH_REPOSITORY = Symbol('USER_AUTH_REPOSITORY');

export interface UserAuthRepository {
  findById(id: string): Promise<UserAuth | null>;
  findByUserId(userId: string): Promise<UserAuth[]>;
  findByIdentityTypeAndIdentifier(
    identityType: IdentityType,
    identifier: string,
  ): Promise<UserAuth | null>;
  save(entity: UserAuth): Promise<void>;
  create(data: Partial<UserAuth>): UserAuth;
}
