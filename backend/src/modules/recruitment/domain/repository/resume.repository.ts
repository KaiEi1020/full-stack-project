import { ResumeEntity } from '../../infrastructure/persistence/entities/resume.entity'; // TODO: 从实体中导入

export const RESUME_REPOSITORY = Symbol('RESUME_REPOSITORY');

export interface ResumeRepository {
  findById(id: string): Promise<ResumeEntity | null>;
  findByIdOrFail(id: string): Promise<ResumeEntity>;
  findAll(): Promise<ResumeEntity[]>;
  save(entity: ResumeEntity): Promise<void>;
  create(data: Partial<ResumeEntity>): ResumeEntity;
}
