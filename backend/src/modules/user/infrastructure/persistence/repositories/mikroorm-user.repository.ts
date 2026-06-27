import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import type {
  PageQuery,
  PageResult,
} from '../../../../../common/pagination/page-response';
import { User } from '../../../domain/entities/user';
import type { UserRepository } from '../../../domain/repository/user.repository';

@Injectable()
export class MikroOrmUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<User | null> {
    return this.em.findOne(User, { id, deletedAt: undefined });
  }

  async findByIdOrFail(id: string): Promise<User> {
    return this.em.findOneOrFail(User, { id, deletedAt: undefined });
  }

  async findByIdIncludingDeleted(id: string): Promise<User | null> {
    return this.em.findOne(User, { id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email, deletedAt: undefined });
  }

  async findPage(
    query: PageQuery,
    options?: {
      orderBy?: Record<string, string>;
    },
  ): Promise<PageResult<User>> {
    const where = { deletedAt: undefined };
    const offset = (query.pageNo - 1) * query.pageSize;
    const [list, total] = await this.em.findAndCount(User, where, {
      orderBy: options?.orderBy,
      limit: query.pageSize,
      offset,
    });

    return { total, list };
  }

  async save(entity: User): Promise<void> {
    this.em.persist(entity);
    await this.em.flush();
  }

  create(data: Partial<User>): User {
    return this.em.create(User, data as Required<User>);
  }
}
