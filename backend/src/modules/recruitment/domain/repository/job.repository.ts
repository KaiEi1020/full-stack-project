import { Job } from '../entities/job';

export const JOB_REPOSITORY = Symbol('JOB_REPOSITORY');

export interface JobRepository {
  findById(id: string): Promise<Job | null>;
  findByIdOrFail(id: string): Promise<Job>;
  findAll(options?: { orderBy?: Record<string, string> }): Promise<Job[]>;
  save(entity: Job): Promise<void>;
  create(data: Partial<Job>): Job;
}
