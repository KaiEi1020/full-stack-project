import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { JobApplicationEntity } from '../persistence/entities/job-application.entity';
import { JobApplicationRepository } from '../../domain/repository/job-application.repository';

@Injectable()
export class MikroOrmJobApplicationRepository implements JobApplicationRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<any> {
    return this.em.findOne(JobApplicationEntity, { id } as any);
  }

  async findByIdOrFail(id: string): Promise<any> {
    return this.em.findOneOrFail(JobApplicationEntity, { id } as any);
  }

  async findAll(options?: {
    orderBy?: Record<string, string>;
  }): Promise<JobApplicationEntity[]> {
    return this.em.find(
      JobApplicationEntity,
      {},
      { orderBy: options?.orderBy },
    );
  }

  async findByJobId(jobId: string): Promise<JobApplicationEntity[]> {
    return this.em.find(JobApplicationEntity, { jobId });
  }

  async findByResumeId(resumeId: string): Promise<JobApplicationEntity | null> {
    return this.em.findOne(JobApplicationEntity, { resumeId });
  }

  async save(entity: JobApplicationEntity): Promise<void> {
    this.em.persist(entity);
    await this.em.flush();
  }

  create(data: Partial<JobApplicationEntity>): JobApplicationEntity {
    return this.em.create(
      JobApplicationEntity,
      data as Required<JobApplicationEntity>,
    );
  }
}
