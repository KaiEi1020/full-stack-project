import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Job } from '../../../domain/entities/job';
import { JobRepository } from '../../../domain/repository/job.repository';

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

  async findAll(options?: {
    orderBy?: Record<string, string>;
  }): Promise<Job[]> {
    return this.em.find(
      Job,
      { deletedAt: undefined },
      { orderBy: options?.orderBy },
    );
  }

  async save(entity: Job): Promise<void> {
    this.em.persist(entity);
    await this.em.flush();
  }

  create(data: Partial<Job>): Job {
    return this.em.create(Job, data as Required<Job>);
  }
}
