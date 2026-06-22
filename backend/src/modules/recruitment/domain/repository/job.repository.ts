import type {
  PageQuery,
  PageResult,
} from '../../../../common/pagination/page-response';
import { Job } from '../entities/job';

export const JOB_REPOSITORY = Symbol('JOB_REPOSITORY');

export interface JobRepository {
  findById(id: string): Promise<Job | null>;
  findByIdOrFail(id: string): Promise<Job>;
  findByIdIncludingDeleted(id: string): Promise<Job | null>;
  findPage(
    query: PageQuery,
    options?: { orderBy?: Record<string, string> },
  ): Promise<PageResult<Job>>;
  save(entity: Job): Promise<void>;
  create(data: Partial<Job>): Job;
}
