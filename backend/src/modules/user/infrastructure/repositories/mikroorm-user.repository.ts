import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserEntity } from '../persistence/entities/user.entity';
import { CreateUserInput, UserRepository } from '../../domain/user.repository';

@Injectable()
export class MikroOrmUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<any[]> {
    const entities = await this.em.find(UserEntity, {}, {
      orderBy: { id: 'asc' },
    } as any);
    return entities;
  }

  async findById(id: string): Promise<any> {
    return this.em.findOne(UserEntity, { id } as any);
  }

  async findByPhone(phone: string): Promise<any> {
    return this.em.findOne(UserEntity, { phone });
  }

  async create(input: CreateUserInput): Promise<any> {
    const entity = this.em.create(UserEntity, {
      name: input.name,
      email: input.email,
      phone: input.phone,
    } as any);
    this.em.persist(entity);
    await this.em.flush();
    return entity;
  }
}
