import {
  BaseEntity,
  type BaseEntityProps,
} from '../../../../common/entities/base.entity';
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

export class Job extends BaseEntity {
  private title: string;
  private description: string;
  private status: JobStatus;
  private requiredSkills?: string;
  private preferredSkills?: string;

  constructor(props: JobProps) {
    super(props);
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.requiredSkills = props.requiredSkills;
    this.preferredSkills = props.preferredSkills;
  }

  static create(input: CreateJobProps) {
    return new Job({
      ...input,
      status: input.status ?? JobStatus.DRAFT,
    });
  }

  public publish(): void {
    if (this.status === JobStatus.ACTIVE) throw new Error('岗位已发布');
    this.status = JobStatus.ACTIVE;
    this.touch();
  }

  public update(input: UpdateJobProps): void {
    if (input.title !== undefined) {
      this.title = input.title;
    }
    if (input.description !== undefined) {
      this.description = input.description;
    }
    if (input.requiredSkills !== undefined) {
      this.requiredSkills = input.requiredSkills;
    }
    if (input.preferredSkills !== undefined) {
      this.preferredSkills = input.preferredSkills;
    }
    if (input.status !== undefined) {
      this.status = input.status;
    }
    this.touch();
  }

  public delete(): void {
    super.markDeleted();
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): string {
    return this.description;
  }

  public getStatus(): JobStatus {
    return this.status;
  }

  public getRequiredSkills(): string | undefined {
    return this.requiredSkills;
  }

  public getPreferredSkills(): string | undefined {
    return this.preferredSkills;
  }
}
