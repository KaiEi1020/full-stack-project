import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { USER_REPOSITORY } from '../../domain/repository/user.repository';
import { USER_AUTH_REPOSITORY } from '../../domain/repository/user-auth.repository';
import { UserRepository } from '../../domain/repository/user.repository';
import { UserAuthRepository } from '../../domain/repository/user-auth.repository';
import { User } from '../../domain/entities/user';
import { UserAuth } from '../../domain/entities/user-auth';
import { UserStatus } from '../../domain/vos/user-status.enum';
import { IdentityType } from '../../domain/vos/identity-type.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepo: jest.Mocked<UserRepository>;
  let userAuthRepo: jest.Mocked<UserAuthRepository>;

  beforeEach(async () => {
    userRepo = {
      findById: jest.fn(),
      findByIdOrFail: jest.fn(),
      findByIdIncludingDeleted: jest.fn(),
      findByEmail: jest.fn(),
      findPage: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userAuthRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByIdentityTypeAndIdentifier: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UserAuthRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: USER_REPOSITORY, useValue: userRepo },
        { provide: USER_AUTH_REPOSITORY, useValue: userAuthRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('创建用户', () => {
    it('应该在提供有效数据时创建用户', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      userAuthRepo.findByIdentityTypeAndIdentifier.mockResolvedValue(null);
      userRepo.save.mockResolvedValue(undefined);
      userAuthRepo.save.mockResolvedValue(undefined);

      const result = await service.create({
        nickname: '张三',
        identifier: 'zhangsan',
        password: 'password123',
      });

      expect(result.nickname).toBe('张三');
      expect(result.status).toBe(UserStatus.ACTIVE);
      expect(userRepo.save).toHaveBeenCalled();
      expect(userAuthRepo.save).toHaveBeenCalled();
    });

    it('应该在邮箱已存在时抛出 ConflictException', async () => {
      const existingUser = User.create({
        nickname: '李四',
        email: 'test@example.com',
      });
      userRepo.findByEmail.mockResolvedValue(existingUser);

      await expect(
        service.create({
          nickname: '张三',
          email: 'test@example.com',
          identifier: 'zhangsan',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('应该在用户名已存在时抛出 ConflictException', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      const existingAuth = UserAuth.create({
        userId: 'uuid',
        identityType: IdentityType.PASSWORD,
        identifier: 'zhangsan',
        credential: 'hashed',
      });
      userAuthRepo.findByIdentityTypeAndIdentifier.mockResolvedValue(
        existingAuth,
      );

      await expect(
        service.create({
          nickname: '张三',
          identifier: 'zhangsan',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('查询用户', () => {
    it('应该通过 ID 查询用户详情', async () => {
      const user = User.create({ nickname: '张三' });
      userRepo.findByIdOrFail.mockResolvedValue(user);

      const result = await service.findById('uuid');

      expect(result.nickname).toBe('张三');
    });
  });

  describe('更新用户', () => {
    it('应该更新用户信息', async () => {
      const user = User.create({ nickname: '张三' });
      userRepo.findByIdOrFail.mockResolvedValue(user);
      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.save.mockResolvedValue(undefined);

      const result = await service.update('uuid', { nickname: '张三三' });

      expect(result.nickname).toBe('张三三');
    });
  });

  describe('删除用户', () => {
    it('应该软删除用户', async () => {
      const user = User.create({ nickname: '张三' });
      userRepo.findByIdOrFail.mockResolvedValue(user);
      userRepo.save.mockResolvedValue(undefined);

      await service.delete('uuid');

      expect(userRepo.save).toHaveBeenCalled();
      expect(user.getDeletedAt()).toBeDefined();
    });
  });
});
