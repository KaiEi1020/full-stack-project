import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';
import {
  toPageResponse,
  type PageQuery,
  type PageResponse,
} from '@/common/pagination/page-response';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repository/user.repository';
import {
  USER_AUTH_REPOSITORY,
  type UserAuthRepository,
} from '../../domain/repository/user-auth.repository';
import { User } from '../../domain/entities/user';
import { UserAuth } from '../../domain/entities/user-auth';
import { UserStatus } from '../../domain/vos/user-status.enum';
import { IdentityType } from '../../domain/vos/identity-type.enum';

export interface CreateUserCommand {
  nickname: string;
  avatarUrl?: string;
  email?: string;
  identifier: string;
  password: string;
}

export interface UpdateUserCommand {
  nickname?: string;
  avatarUrl?: string;
  email?: string;
  status?: UserStatus;
}

export interface UserView {
  id: string;
  nickname: string;
  avatarUrl?: string;
  email?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    @Inject(USER_AUTH_REPOSITORY)
    private readonly userAuthRepo: UserAuthRepository,
  ) {}

  async create(input: CreateUserCommand): Promise<UserView> {
    const nickname = input.nickname.trim();
    const email = input.email?.trim();

    if (email) {
      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    const existingAuth = await this.userAuthRepo.findByIdentityTypeAndIdentifier(
      IdentityType.PASSWORD,
      input.identifier,
    );
    if (existingAuth) {
      throw new ConflictException('用户名已被使用');
    }

    const user = User.create({
      nickname,
      avatarUrl: input.avatarUrl,
      email,
    });
    await this.userRepo.save(user);

    const hashedPassword = await argon2.hash(input.password);
    const userAuth = UserAuth.create({
      userId: user.getId(),
      identityType: IdentityType.PASSWORD,
      identifier: input.identifier,
      credential: hashedPassword,
    });
    await this.userAuthRepo.save(userAuth);

    return this.toView(user);
  }

  async findById(id: string): Promise<UserView> {
    const user = await this.userRepo.findByIdOrFail(id);
    return this.toView(user);
  }

  async findPage(query: PageQuery): Promise<PageResponse<UserView>> {
    const result = await this.userRepo.findPage(query, {
      orderBy: { updatedAt: 'desc' },
    });

    return toPageResponse(
      {
        total: result.total,
        list: result.list.map((entity) => this.toView(entity)),
      },
      query,
    );
  }

  async update(id: string, input: UpdateUserCommand): Promise<UserView> {
    const user = await this.userRepo.findByIdOrFail(id);

    if (input.email !== undefined) {
      const existingUser = await this.userRepo.findByEmail(input.email);
      if (existingUser && existingUser.getId() !== id) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    user.update({
      nickname: input.nickname,
      avatarUrl: input.avatarUrl,
      email: input.email,
      status: input.status,
    });

    await this.userRepo.save(user);
    return this.toView(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepo.findByIdOrFail(id);
    user.delete();
    await this.userRepo.save(user);
  }

  private toView(entity: User): UserView {
    return {
      id: entity.getId(),
      nickname: entity.getNickname(),
      avatarUrl: entity.getAvatarUrl(),
      email: entity.getEmail(),
      status: entity.getStatus(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
