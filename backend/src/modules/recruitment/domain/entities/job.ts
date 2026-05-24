import { randomUUID } from 'node:crypto';
import { JobStatus } from '../vos/job-status.enum';

export class Job {
  private id: string;
  private title: string;
  private description: string;
  private requiredSkills?: string;
  private preferredSkills?: string;
  private status: JobStatus;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt?: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    status: JobStatus,
    requiredSkills?: string,
    preferredSkills?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.requiredSkills = requiredSkills;
    this.preferredSkills = preferredSkills;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt;
  }

  static create(input: {
    id?: string;
    title: string;
    description: string;
    status?: JobStatus;
    requiredSkills?: string;
    preferredSkills?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    return new Job(
      input.id ?? randomUUID(),
      input.title,
      input.description,
      input.status ?? JobStatus.DRAFT,
      input.requiredSkills,
      input.preferredSkills,
      input.createdAt,
      input.updatedAt,
      input.deletedAt,
    );
  }

  // 领域行为
  public publish(): void {
    if (this.status === JobStatus.ACTIVE) throw new Error('岗位已发布');
    this.status = JobStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  public update(input: {
    title?: string;
    description?: string;
    requiredSkills?: string;
    preferredSkills?: string;
    status?: JobStatus;
  }) {
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
    this.updatedAt = new Date();
  }

  public markDeleted() {
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }

  // Getters
  public getId() {
    return this.id;
  }
  public getTitle() {
    return this.title;
  }
  public getDescription() {
    return this.description;
  }
  public getStatus() {
    return this.status;
  }
  public getRequiredSkills() {
    return this.requiredSkills;
  }
  public getPreferredSkills() {
    return this.preferredSkills;
  }
  public getCreatedAt() {
    return this.createdAt;
  }
  public getUpdatedAt() {
    return this.updatedAt;
  }
  public getDeletedAt() {
    return this.deletedAt;
  }
}
