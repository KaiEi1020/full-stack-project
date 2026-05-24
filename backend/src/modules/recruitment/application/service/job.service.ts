import { Injectable, Inject } from '@nestjs/common';
import {
  JOB_REPOSITORY,
  type JobRepository,
} from '../../domain/repository/job.repository';
import { Job } from '../../domain/entities/job';
import {
  type CreateJobProps,
  type UpdateJobProps,
} from '../../domain/entities/job.types';
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

  async findAll(): Promise<JobView[]> {
    const entities = await this.jobRepo.findAll({
      orderBy: { updatedAt: 'desc' },
    });
    return entities.map((e) => this.toView(e));
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
