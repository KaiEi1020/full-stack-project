import type { PageQuery, PageResult } from '@/common/pagination/page-response';
import { User } from '../entities/user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByIdOrFail(id: string): Promise<User>;
  findByIdIncludingDeleted(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findPage(
    query: PageQuery,
    options?: { orderBy?: Record<string, string> },
  ): Promise<PageResult<User>>;
  save(entity: User): Promise<void>;
  create(data: Partial<User>): User;
}
