import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserAuth } from '../../../domain/entities/user-auth';
import type { UserAuthRepository } from '../../../domain/repository/user-auth.repository';
import { IdentityType } from '../../../domain/vos/identity-type.enum';

@Injectable()
export class MikroOrmUserAuthRepository implements UserAuthRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<UserAuth | null> {
    return this.em.findOne(UserAuth, { id });
  }

  async findByUserId(userId: string): Promise<UserAuth[]> {
    return this.em.find(UserAuth, { userId });
  }

  async findByIdentityTypeAndIdentifier(
    identityType: IdentityType,
    identifier: string,
  ): Promise<UserAuth | null> {
    return this.em.findOne(UserAuth, { identityType, identifier });
  }

  async save(entity: UserAuth): Promise<void> {
    this.em.persist(entity);
    await this.em.flush();
  }

  create(data: Partial<UserAuth>): UserAuth {
    return this.em.create(UserAuth, data as Required<UserAuth>);
  }
}
