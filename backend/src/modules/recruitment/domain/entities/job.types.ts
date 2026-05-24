import { type BaseEntityProps } from '@/common/entities/base.entity';
import { JobStatus } from '../vos/job-status.enum';

export interface JobProps extends BaseEntityProps {
  title: string;
  description: string;
  status: JobStatus;
  requiredSkills?: string;
  preferredSkills?: string;
}

export interface CreateJobProps {
  title: string;
  description: string;
  status?: JobStatus;
  requiredSkills?: string;
  preferredSkills?: string;
}

export interface UpdateJobProps {
  title?: string;
  description?: string;
  status?: JobStatus;
  requiredSkills?: string;
  preferredSkills?: string;
}
