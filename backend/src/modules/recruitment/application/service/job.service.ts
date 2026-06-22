import { Injectable, Inject } from '@nestjs/common';
import {
  toPageResponse,
  type PageQuery,
  type PageResponse,
} from '@/common/pagination/page-response';
import {
  JOB_REPOSITORY,
  type JobRepository,
} from '../../domain/repository/job.repository';
import {
  Job,
  type CreateJobProps,
  type UpdateJobProps,
} from '../../domain/entities/job';
import { JobStatus } from '../../domain/vos/job-status.enum';

export type CreateJobCommand = CreateJobProps;

export type UpdateJobCommand = UpdateJobProps;

export interface JobView {
  id: string;
  title: string;
  description: string;
  requiredSkills?: string;
  preferredSkills?: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class JobService {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepo: JobRepository,
  ) {}

  async create(input: CreateJobCommand): Promise<JobView> {
    const job = Job.create({
      title: input.title,
      description: input.description,
      requiredSkills: input.requiredSkills,
      preferredSkills: input.preferredSkills,
    });
    await this.jobRepo.save(job);
    return this.toView(job);
  }

  async findById(id: string): Promise<JobView> {
    const entity = await this.jobRepo.findByIdOrFail(id);
    return this.toView(entity);
  }

  async jobPage(query: PageQuery): Promise<PageResponse<JobView>> {
    const result = await this.jobRepo.findPage(query, {
      orderBy: { updatedAt: 'desc' },
    });

    return toPageResponse(
      {
        total: result.total,
        list: result.list.map((entity) => this.toView(entity)),
      },
      query,
    );
  }

  async update(id: string, input: UpdateJobCommand): Promise<JobView> {
    const entity = await this.jobRepo.findByIdOrFail(id);

    entity.update({
      title: input.title,
      description: input.description,
      requiredSkills: input.requiredSkills,
      preferredSkills: input.preferredSkills,
      status: input.status,
    });

    await this.jobRepo.save(entity);
    return this.toView(entity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.jobRepo.findByIdOrFail(id);
    entity.delete();
    await this.jobRepo.save(entity);
  }

  private toView(entity: Job): JobView {
    return {
      id: entity.getId(),
      title: entity.getTitle(),
      description: entity.getDescription(),
      requiredSkills: entity.getRequiredSkills(),
      preferredSkills: entity.getPreferredSkills(),
      status: entity.getStatus(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
