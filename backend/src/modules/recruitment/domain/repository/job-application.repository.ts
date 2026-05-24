import { JobApplicationEntity } from '../../infrastructure/persistence/entities/job-application.entity'; // TODO: 从实体中导入

export const JOB_APPLICATION_REPOSITORY = Symbol('JOB_APPLICATION_REPOSITORY');

export interface JobApplicationRepository {
  findById(id: string): Promise<JobApplicationEntity | null>;
  findByIdOrFail(id: string): Promise<JobApplicationEntity>;
  findAll(options?: {
    orderBy?: Record<string, string>;
  }): Promise<JobApplicationEntity[]>;
  findByJobId(jobId: string): Promise<JobApplicationEntity[]>;
  findByResumeId(resumeId: string): Promise<JobApplicationEntity | null>;
  save(entity: JobApplicationEntity): Promise<void>;
  create(data: Partial<JobApplicationEntity>): JobApplicationEntity;
}
