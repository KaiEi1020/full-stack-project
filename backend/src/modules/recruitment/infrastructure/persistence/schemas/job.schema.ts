import { EntitySchema } from '@mikro-orm/core';
import { Job } from '../../../domain/entities/job';
import { JobStatus } from '../../../domain/vos/job-status.enum';

export const JobSchema = new EntitySchema<Job>({
  class: Job,
  tableName: 'jobs',
  properties: {
    id: { type: 'string', primary: true },
    title: { type: 'string', length: 255 },
    description: { type: 'text' },
    status: {
      enum: true,
      items: () => JobStatus,
      default: JobStatus.DRAFT,
    },
    requiredSkills: { type: 'text' },
    preferredSkills: { type: 'text' },
    createdAt: { type: 'datetime', onCreate: () => new Date() },
    updatedAt: { type: 'datetime', onUpdate: () => new Date() },
    deletedAt: { type: 'datetime', nullable: true },
  },
});
