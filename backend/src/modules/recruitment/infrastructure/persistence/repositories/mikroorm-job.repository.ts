import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import type {
  PageQuery,
  PageResult,
} from '../../../../../common/pagination/page-response';
import { Job } from '../../../domain/entities/job';
import type { JobRepository } from '../../../domain/repository/job.repository';

@Injectable()
export class MikroOrmJobRepository implements JobRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<Job | null> {
    return this.em.findOne(Job, { id, deletedAt: undefined });
  }

  async findByIdOrFail(id: string): Promise<Job> {
    return this.em.findOneOrFail(Job, { id, deletedAt: undefined });
  }

  async findByIdIncludingDeleted(id: string): Promise<Job | null> {
    return this.em.findOne(Job, { id });
  }

  async findPage(
    query: PageQuery,
    options?: {
      orderBy?: Record<string, string>;
    },
  ): Promise<PageResult<Job>> {
    const where = { deletedAt: undefined };
    const offset = (query.pageNo - 1) * query.pageSize;
    const [list, total] = await this.em.findAndCount(Job, where, {
      orderBy: options?.orderBy,
      limit: query.pageSize,
      offset,
    });

    return { total, list };
  }

  async save(entity: Job): Promise<void> {
    this.em.persist(entity);
    await this.em.flush();
  }

  create(data: Partial<Job>): Job {
    return this.em.create(Job, data as Required<Job>);
  }
}
