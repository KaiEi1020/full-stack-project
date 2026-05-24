import { randomUUID } from 'node:crypto';

export interface BaseEntityProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export abstract class BaseEntity {
  protected readonly id: string;
  protected createdAt: Date;
  protected updatedAt: Date;
  protected deletedAt?: Date;

  protected constructor(props?: BaseEntityProps) {
    const baseProps = props ?? {};
    this.id = baseProps.id ?? randomUUID();
    this.createdAt = baseProps.createdAt ?? new Date();
    this.updatedAt = baseProps.updatedAt ?? new Date();
    this.deletedAt = baseProps.deletedAt;
  }

  protected touch(): void {
    this.updatedAt = new Date();
  }

  protected markDeleted(): void {
    this.deletedAt = new Date();
    this.touch();
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getDeletedAt(): Date | undefined {
    return this.deletedAt;
  }
}
