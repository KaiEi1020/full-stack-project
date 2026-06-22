import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ResumeEntity } from '../persistence/entities/resume.entity';
import { ResumeRepository } from '../../domain/repository/resume.repository';

@Injectable()
export class MikroOrmResumeRepository implements ResumeRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<any> {
    return this.em.findOne(ResumeEntity, { id } as any);
  }

  async findByIdOrFail(id: string): Promise<any> {
    return this.em.findOneOrFail(ResumeEntity, { id } as any);
  }

  async findAll(): Promise<ResumeEntity[]> {
    return this.em.find(ResumeEntity, {});
  }

  async save(entity: ResumeEntity): Promise<void> {
    this.em.persist(entity);
    await this.em.flush();
  }

  create(data: Partial<ResumeEntity>): ResumeEntity {
    return this.em.create(ResumeEntity, data as Required<ResumeEntity>);
  }
}
