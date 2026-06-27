# 用户模块重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构 `backend/src/modules/user/` 模块，使其目录结构与 `recruitment` 模块保持一致（`api/application/domain/infrastructure`），同时支持用户增删改查功能。

**Architecture:** 采用 DDD 分层架构，参考 `recruitment` 模块的目录结构。`users` 为聚合根，`user_auths` 为独立实体。密码使用 `argon2id` 哈希存储。软删除策略与 `recruitment` 保持一致。

**Tech Stack:** NestJS 11, MikroORM, PostgreSQL, argon2, class-validator, Swagger

## Global Constraints

- 所有表字段注释、测试用例描述、代码注释必须使用简体中文
- 用户 ID 沿用项目当前 `BaseEntity` 的 UUID 字符串，不采用 BIGINT 自增
- 密码加密使用 `argon2id`（通过 `argon2` 包）
- 删除策略：软删除，查询默认排除 `deletedAt IS NOT NULL` 的记录
- 本期不做登录/注册/Token，仅保留 `user_auths` 数据模型和写入能力
- 创建 password 类型身份时密码必填
- `users.email` 唯一但允许为空
- `user_auths(identity_type, identifier)` 唯一索引

---

## 文件结构映射

### 新文件（创建）

| 文件 | 职责 |
|------|------|
| `domain/entities/user.ts` | User 领域实体，聚合根 |
| `domain/entities/user-auth.ts` | UserAuth 领域实体 |
| `domain/vos/user-status.enum.ts` | 用户状态枚举 |
| `domain/vos/identity-type.enum.ts` | 登录类型枚举 |
| `domain/repository/user.repository.ts` | User 仓储接口 |
| `domain/repository/user-auth.repository.ts` | UserAuth 仓储接口 |
| `application/service/user.service.ts` | 用户应用服务，编排 CRUD |
| `api/controller/user.controller.ts` | REST API 控制器 |
| `api/dto/create-user.dto.ts` | 创建用户 DTO |
| `api/dto/update-user.dto.ts` | 更新用户 DTO |
| `infrastructure/persistence/schemas/user.schema.ts` | users 表 MikroORM Schema |
| `infrastructure/persistence/schemas/user-auth.schema.ts` | user_auths 表 MikroORM Schema |
| `infrastructure/persistence/repositories/mikroorm-user.repository.ts` | User 仓储 MikroORM 实现 |
| `infrastructure/persistence/repositories/mikroorm-user-auth.repository.ts` | UserAuth 仓储 MikroORM 实现 |

### 旧文件（删除）

- `user.controller.ts` → 替换为 `api/controller/user.controller.ts`
- `register-user.dto.ts` → 删除
- `application/register-user.service.ts` → 删除
- `application/register-user.service.spec.ts` → 删除
- `application/user-query.service.ts` → 删除
- `application/user-query.service.spec.ts` → 删除
- `domain/user.repository.ts` → 删除
- `infrastructure/repositories/mikroorm-user.repository.ts` → 删除
- `infrastructure/persistence/entities/user.entity.ts` → 删除
- `models/user.model.ts` → 删除
- `infrastructure/sms-notification.publisher.ts` → 删除

### 修改文件

- `user.module.ts` → 重新配置 providers、imports、controllers

---

## Task 1: 安装依赖 argon2

**Files:**
- Modify: `backend/package.json`

**Interfaces:**
- Consumes: 无
- Produces: `argon2` 包可用

- [ ] **Step 1: 安装 argon2**

```bash
cd backend && pnpm add argon2
```

- [ ] **Step 2: 验证安装**

```bash
cd backend && node -e "const argon2 = require('argon2'); console.log('argon2 版本:', argon2.version)"
```

Expected: 输出版本号，无报错

- [ ] **Step 3: Commit**

```bash
git add backend/package.json backend/pnpm-lock.yaml
git commit -m "chore: 安装 argon2 用于密码哈希

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 2: 创建领域层 — 值对象（VO）

**Files:**
- Create: `backend/src/modules/user/domain/vos/user-status.enum.ts`
- Create: `backend/src/modules/user/domain/vos/identity-type.enum.ts`

**Interfaces:**
- Consumes: 无
- Produces: `UserStatus` 枚举, `IdentityType` 枚举

- [ ] **Step 1: 创建 UserStatus 枚举**

```typescript
// backend/src/modules/user/domain/vos/user-status.enum.ts
export enum UserStatus {
  DISABLED = 0,
  ACTIVE = 1,
}
```

- [ ] **Step 2: 创建 IdentityType 枚举**

```typescript
// backend/src/modules/user/domain/vos/identity-type.enum.ts
export enum IdentityType {
  PASSWORD = 'password',
  GITHUB = 'github',
  WECHAT = 'wechat',
  GITEE = 'gitee',
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/user/domain/vos/
git commit -m "feat(user): 添加用户状态与登录类型枚举

- UserStatus: ACTIVE=1, DISABLED=0
- IdentityType: PASSWORD, GITHUB, WECHAT, GITEE

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 3: 创建领域层 — User 实体

**Files:**
- Create: `backend/src/modules/user/domain/entities/user.ts`

**Interfaces:**
- Consumes: `BaseEntity`, `BaseEntityProps` from `@/common/entities/base.entity`
- Produces: `User` 类, `UserProps`, `CreateUserProps`, `UpdateUserProps`

- [ ] **Step 1: 创建 User 实体**

```typescript
// backend/src/modules/user/domain/entities/user.ts
import {
  BaseEntity,
  type BaseEntityProps,
} from '@/common/entities/base.entity';
import { UserStatus } from '../vos/user-status.enum';

export interface UserProps extends BaseEntityProps {
  nickname: string;
  avatarUrl?: string;
  email?: string;
  status: UserStatus;
}

export interface CreateUserProps {
  nickname: string;
  avatarUrl?: string;
  email?: string;
}

export interface UpdateUserProps {
  nickname?: string;
  avatarUrl?: string;
  email?: string;
  status?: UserStatus;
}

export class User extends BaseEntity {
  private nickname: string;
  private avatarUrl?: string;
  private email?: string;
  private status: UserStatus;

  constructor(props: UserProps) {
    super(props);
    this.nickname = props.nickname;
    this.avatarUrl = props.avatarUrl;
    this.email = props.email;
    this.status = props.status;
  }

  static create(input: CreateUserProps): User {
    return new User({
      ...input,
      status: UserStatus.ACTIVE,
    });
  }

  public update(input: UpdateUserProps): void {
    if (input.nickname !== undefined) {
      this.nickname = input.nickname;
    }
    if (input.avatarUrl !== undefined) {
      this.avatarUrl = input.avatarUrl;
    }
    if (input.email !== undefined) {
      this.email = input.email;
    }
    if (input.status !== undefined) {
      this.status = input.status;
    }
    this.touch();
  }

  public delete(): void {
    super.markDeleted();
  }

  public getNickname(): string {
    return this.nickname;
  }

  public getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  public getEmail(): string | undefined {
    return this.email;
  }

  public getStatus(): UserStatus {
    return this.status;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/user/domain/entities/user.ts
git commit -m "feat(user): 添加 User 领域实体

- 包含 nickname, avatarUrl, email, status 属性
- 支持 create, update, delete 操作
- 软删除策略

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 4: 创建领域层 — UserAuth 实体

**Files:**
- Create: `backend/src/modules/user/domain/entities/user-auth.ts`

**Interfaces:**
- Consumes: `BaseEntity`, `BaseEntityProps` from `@/common/entities/base.entity`, `IdentityType`
- Produces: `UserAuth` 类, `UserAuthProps`, `CreateUserAuthProps`

- [ ] **Step 1: 创建 UserAuth 实体**

```typescript
// backend/src/modules/user/domain/entities/user-auth.ts
import {
  BaseEntity,
  type BaseEntityProps,
} from '@/common/entities/base.entity';
import { IdentityType } from '../vos/identity-type.enum';

export interface UserAuthProps extends BaseEntityProps {
  userId: string;
  identityType: IdentityType;
  identifier: string;
  credential?: string;
}

export interface CreateUserAuthProps {
  userId: string;
  identityType: IdentityType;
  identifier: string;
  credential?: string;
}

export class UserAuth extends BaseEntity {
  private userId: string;
  private identityType: IdentityType;
  private identifier: string;
  private credential?: string;

  constructor(props: UserAuthProps) {
    super(props);
    this.userId = props.userId;
    this.identityType = props.identityType;
    this.identifier = props.identifier;
    this.credential = props.credential;
  }

  static create(input: CreateUserAuthProps): UserAuth {
    return new UserAuth({
      ...input,
    });
  }

  public getUserId(): string {
    return this.userId;
  }

  public getIdentityType(): IdentityType {
    return this.identityType;
  }

  public getIdentifier(): string {
    return this.identifier;
  }

  public getCredential(): string | undefined {
    return this.credential;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/user/domain/entities/user-auth.ts
git commit -m "feat(user): 添加 UserAuth 领域实体

- 包含 userId, identityType, identifier, credential 属性
- 用于存储用户认证身份

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 5: 创建领域层 — 仓储接口

**Files:**
- Create: `backend/src/modules/user/domain/repository/user.repository.ts`
- Create: `backend/src/modules/user/domain/repository/user-auth.repository.ts`

**Interfaces:**
- Consumes: `User`, `UserAuth`, `PageQuery`, `PageResult` from `@/common/pagination/page-response`
- Produces: `USER_REPOSITORY` Symbol, `UserRepository` 接口, `USER_AUTH_REPOSITORY` Symbol, `UserAuthRepository` 接口

- [ ] **Step 1: 创建 UserRepository 接口**

```typescript
// backend/src/modules/user/domain/repository/user.repository.ts
import type {
  PageQuery,
  PageResult,
} from '@/common/pagination/page-response';
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
```

- [ ] **Step 2: 创建 UserAuthRepository 接口**

```typescript
// backend/src/modules/user/domain/repository/user-auth.repository.ts
import { UserAuth } from '../entities/user-auth';
import { IdentityType } from '../vos/identity-type.enum';

export const USER_AUTH_REPOSITORY = Symbol('USER_AUTH_REPOSITORY');

export interface UserAuthRepository {
  findById(id: string): Promise<UserAuth | null>;
  findByUserId(userId: string): Promise<UserAuth[]>;
  findByIdentityTypeAndIdentifier(
    identityType: IdentityType,
    identifier: string,
  ): Promise<UserAuth | null>;
  save(entity: UserAuth): Promise<void>;
  create(data: Partial<UserAuth>): UserAuth;
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/user/domain/repository/
git commit -m "feat(user): 添加 User 和 UserAuth 仓储接口

- UserRepository: 支持 findById, findByEmail, findPage, save, create
- UserAuthRepository: 支持 findById, findByUserId, findByIdentityTypeAndIdentifier, save, create

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 6: 创建基础设施层 — Schema

**Files:**
- Create: `backend/src/modules/user/infrastructure/persistence/schemas/user.schema.ts`
- Create: `backend/src/modules/user/infrastructure/persistence/schemas/user-auth.schema.ts`

**Interfaces:**
- Consumes: `User`, `UserAuth` 领域实体, `UserStatus`, `IdentityType`
- Produces: `UserSchema`, `UserAuthSchema`

- [ ] **Step 1: 创建 UserSchema**

```typescript
// backend/src/modules/user/infrastructure/persistence/schemas/user.schema.ts
import { EntitySchema } from '@mikro-orm/core';
import { User } from '../../../domain/entities/user';
import { UserStatus } from '../../../domain/vos/user-status.enum';

export const UserSchema = new EntitySchema<User>({
  class: User,
  tableName: 'users',
  properties: {
    id: { type: 'string', primary: true },
    nickname: { type: 'string', length: 50 },
    avatarUrl: { type: 'string', length: 255, nullable: true },
    email: { type: 'string', length: 100, nullable: true },
    status: {
      enum: true,
      items: () => UserStatus,
      default: UserStatus.ACTIVE,
    },
    createdAt: { type: 'datetime' },
    updatedAt: { type: 'datetime' },
    deletedAt: { type: 'datetime', nullable: true },
  },
});
```

- [ ] **Step 2: 创建 UserAuthSchema**

```typescript
// backend/src/modules/user/infrastructure/persistence/schemas/user-auth.schema.ts
import { EntitySchema } from '@mikro-orm/core';
import { UserAuth } from '../../../domain/entities/user-auth';
import { IdentityType } from '../../../domain/vos/identity-type.enum';

export const UserAuthSchema = new EntitySchema<UserAuth>({
  class: UserAuth,
  tableName: 'user_auths',
  properties: {
    id: { type: 'string', primary: true },
    userId: { type: 'string', length: 36 },
    identityType: {
      enum: true,
      items: () => IdentityType,
    },
    identifier: { type: 'string', length: 100 },
    credential: { type: 'string', length: 255, nullable: true },
    createdAt: { type: 'datetime' },
    updatedAt: { type: 'datetime' },
    deletedAt: { type: 'datetime', nullable: true },
  },
});
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/user/infrastructure/persistence/schemas/
git commit -m "feat(user): 添加 users 和 user_auths 的 MikroORM Schema

- UserSchema: 映射 users 表，包含 nickname, avatarUrl, email, status
- UserAuthSchema: 映射 user_auths 表，包含 userId, identityType, identifier, credential

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 7: 创建基础设施层 — 仓储实现

**Files:**
- Create: `backend/src/modules/user/infrastructure/persistence/repositories/mikroorm-user.repository.ts`
- Create: `backend/src/modules/user/infrastructure/persistence/repositories/mikroorm-user-auth.repository.ts`

**Interfaces:**
- Consumes: `UserRepository`, `UserAuthRepository` 接口, `UserSchema`, `UserAuthSchema`
- Produces: `MikroOrmUserRepository`, `MikroOrmUserAuthRepository`

- [ ] **Step 1: 创建 MikroOrmUserRepository**

```typescript
// backend/src/modules/user/infrastructure/persistence/repositories/mikroorm-user.repository.ts
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import type {
  PageQuery,
  PageResult,
} from '../../../../../common/pagination/page-response';
import { User } from '../../../domain/entities/user';
import type { UserRepository } from '../../../domain/repository/user.repository';

@Injectable()
export class MikroOrmUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<User | null> {
    return this.em.findOne(User, { id, deletedAt: undefined });
  }

  async findByIdOrFail(id: string): Promise<User> {
    return this.em.findOneOrFail(User, { id, deletedAt: undefined });
  }

  async findByIdIncludingDeleted(id: string): Promise<User | null> {
    return this.em.findOne(User, { id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email, deletedAt: undefined });
  }

  async findPage(
    query: PageQuery,
    options?: {
      orderBy?: Record<string, string>;
    },
  ): Promise<PageResult<User>> {
    const where = { deletedAt: undefined };
    const offset = (query.pageNo - 1) * query.pageSize;
    const [list, total] = await this.em.findAndCount(User, where, {
      orderBy: options?.orderBy,
      limit: query.pageSize,
      offset,
    });

    return { total, list };
  }

  async save(entity: User): Promise<void> {
    this.em.persist(entity);
    await this.em.flush();
  }

  create(data: Partial<User>): User {
    return this.em.create(User, data as Required<User>);
  }
}
```

- [ ] **Step 2: 创建 MikroOrmUserAuthRepository**

```typescript
// backend/src/modules/user/infrastructure/persistence/repositories/mikroorm-user-auth.repository.ts
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserAuth } from '../../../domain/entities/user-auth';
import type { UserAuthRepository } from '../../../domain/repository/user-auth.repository';
import { IdentityType } from '../../../domain/vos/identity-type.enum';

@Injectable()
export class MikroOrmUserAuthRepository implements UserAuthRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<UserAuth | null> {
    return this.em.findOne(UserAuth, { id });
  }

  async findByUserId(userId: string): Promise<UserAuth[]> {
    return this.em.find(UserAuth, { userId });
  }

  async findByIdentityTypeAndIdentifier(
    identityType: IdentityType,
    identifier: string,
  ): Promise<UserAuth | null> {
    return this.em.findOne(UserAuth, { identityType, identifier });
  }

  async save(entity: UserAuth): Promise<void> {
    this.em.persist(entity);
    await this.em.flush();
  }

  create(data: Partial<UserAuth>): UserAuth {
    return this.em.create(UserAuth, data as Required<UserAuth>);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/user/infrastructure/persistence/repositories/
git commit -m "feat(user): 添加 MikroORM 仓储实现

- MikroOrmUserRepository: 实现 UserRepository 接口
- MikroOrmUserAuthRepository: 实现 UserAuthRepository 接口

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 8: 创建应用层 — UserService

**Files:**
- Create: `backend/src/modules/user/application/service/user.service.ts`

**Interfaces:**
- Consumes: `UserRepository`, `UserAuthRepository`, `User`, `UserAuth`, `PageQuery`, `PageResponse`
- Produces: `UserService`, `CreateUserCommand`, `UpdateUserCommand`, `UserView`

- [ ] **Step 1: 创建 UserService**

```typescript
// backend/src/modules/user/application/service/user.service.ts
import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
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
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/user/application/service/user.service.ts
git commit -m "feat(user): 添加 UserService 应用服务

- 支持创建用户（含 password 身份和 argon2id 哈希）
- 支持查询详情、分页查询、更新、软删除
- 邮箱和用户名唯一性校验

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 9: 创建接口层 — DTO

**Files:**
- Create: `backend/src/modules/user/api/dto/create-user.dto.ts`
- Create: `backend/src/modules/user/api/dto/update-user.dto.ts`

**Interfaces:**
- Consumes: class-validator, Swagger
- Produces: `CreateUserDto`, `UpdateUserDto`

- [ ] **Step 1: 创建 CreateUserDto**

```typescript
// backend/src/modules/user/api/dto/create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户昵称', example: '张三' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nickname!: string;

  @ApiPropertyOptional({ description: '头像URL', example: 'https://example.com/avatar.png' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatarUrl?: string;

  @ApiPropertyOptional({ description: '绑定邮箱', example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({ description: '用户名/邮箱（用于登录）', example: 'zhangsan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  identifier!: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;
}
```

- [ ] **Step 2: 创建 UpdateUserDto**

```typescript
// backend/src/modules/user/api/dto/update-user.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsEmail, IsInt, Min, Max } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '用户昵称', example: '张三' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @ApiPropertyOptional({ description: '头像URL', example: 'https://example.com/avatar.png' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatarUrl?: string;

  @ApiPropertyOptional({ description: '绑定邮箱', example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: '用户状态: 0-禁用, 1-正常', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  status?: number;
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/user/api/dto/
git commit -m "feat(user): 添加创建和更新用户的 DTO

- CreateUserDto: nickname, avatarUrl, email, identifier, password
- UpdateUserDto: nickname, avatarUrl, email, status

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 10: 创建接口层 — UserController

**Files:**
- Create: `backend/src/modules/user/api/controller/user.controller.ts`

**Interfaces:**
- Consumes: `UserService`, `CreateUserDto`, `UpdateUserDto`, `PageRequestDto`
- Produces: REST API 端点

- [ ] **Step 1: 创建 UserController**

```typescript
// backend/src/modules/user/api/controller/user.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from '../../application/service/user.service';
import type { PageRequestDto } from '@/common/pagination/page-request.dto';
import type { PageResponse } from '@/common/pagination/page-response';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import type { UserView } from '../../application/service/user.service';

@ApiTags('user')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '邮箱或用户名已存在' })
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '获取用户分页列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  userPage(@Query() query: PageRequestDto): Promise<PageResponse<UserView>> {
    return this.userService.findPage(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  @ApiParam({ name: 'id', description: '用户 ID', type: String })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  @ApiParam({ name: 'id', description: '用户 ID', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 409, description: '邮箱已被使用' })
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户 ID', type: String })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/user/api/controller/user.controller.ts
git commit -m "feat(user): 添加 UserController REST API

- POST /api/users: 创建用户
- GET /api/users: 分页查询用户列表
- GET /api/users/:id: 查询用户详情
- PUT /api/users/:id: 更新用户信息
- DELETE /api/users/:id: 软删除用户

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 11: 重构 UserModule

**Files:**
- Modify: `backend/src/modules/user/user.module.ts`

**Interfaces:**
- Consumes: 所有新创建的 providers、schemas、controller
- Produces: 重新配置的 NestJS 模块

- [ ] **Step 1: 重写 UserModule**

```typescript
// backend/src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from './api/controller/user.controller';
import { UserService } from './application/service/user.service';
import { USER_REPOSITORY } from './domain/repository/user.repository';
import { USER_AUTH_REPOSITORY } from './domain/repository/user-auth.repository';
import { MikroOrmUserRepository } from './infrastructure/persistence/repositories/mikroorm-user.repository';
import { MikroOrmUserAuthRepository } from './infrastructure/persistence/repositories/mikroorm-user-auth.repository';
import { UserSchema } from './infrastructure/persistence/schemas/user.schema';
import { UserAuthSchema } from './infrastructure/persistence/schemas/user-auth.schema';

@Module({
  imports: [MikroOrmModule.forFeature([UserSchema, UserAuthSchema])],
  controllers: [UserController],
  providers: [
    UserService,
    MikroOrmUserRepository,
    MikroOrmUserAuthRepository,
    { provide: USER_REPOSITORY, useExisting: MikroOrmUserRepository },
    { provide: USER_AUTH_REPOSITORY, useExisting: MikroOrmUserAuthRepository },
  ],
})
export class UserModule {}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/user/user.module.ts
git commit -m "refactor(user): 重构 UserModule

- 导入新的 Schema、Controller、Service、Repository
- 配置依赖注入

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 12: 删除旧文件

**Files:**
- Delete: `backend/src/modules/user/user.controller.ts`
- Delete: `backend/src/modules/user/register-user.dto.ts`
- Delete: `backend/src/modules/user/application/register-user.service.ts`
- Delete: `backend/src/modules/user/application/register-user.service.spec.ts`
- Delete: `backend/src/modules/user/application/user-query.service.ts`
- Delete: `backend/src/modules/user/application/user-query.service.spec.ts`
- Delete: `backend/src/modules/user/domain/user.repository.ts`
- Delete: `backend/src/modules/user/infrastructure/repositories/mikroorm-user.repository.ts`
- Delete: `backend/src/modules/user/infrastructure/persistence/entities/user.entity.ts`
- Delete: `backend/src/modules/user/models/user.model.ts`
- Delete: `backend/src/modules/user/infrastructure/sms-notification.publisher.ts`

- [ ] **Step 1: 删除旧文件**

```bash
cd backend/src/modules/user
rm -f user.controller.ts
rm -f register-user.dto.ts
rm -f application/register-user.service.ts
rm -f application/register-user.service.spec.ts
rm -f application/user-query.service.ts
rm -f application/user-query.service.spec.ts
rm -f domain/user.repository.ts
rm -f infrastructure/repositories/mikroorm-user.repository.ts
rm -f infrastructure/persistence/entities/user.entity.ts
rm -f models/user.model.ts
rm -f infrastructure/sms-notification.publisher.ts
```

- [ ] **Step 2: 清理空目录**

```bash
cd backend/src/modules/user
rm -rf application/
rm -rf models/
rm -rf infrastructure/repositories/
rm -rf infrastructure/persistence/entities/
rm -rf infrastructure/sms-notification.publisher.ts
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore(user): 删除旧的用户模块文件

- 删除旧的 controller, service, dto, entity, repository, model
- 清理空目录

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 13: 创建测试 — UserService 单元测试

**Files:**
- Create: `backend/src/modules/user/application/service/user.service.spec.ts`

**Interfaces:**
- Consumes: `UserService`, `UserRepository`, `UserAuthRepository`
- Produces: 通过测试

- [ ] **Step 1: 创建 UserService 测试**

```typescript
// backend/src/modules/user/application/service/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { USER_REPOSITORY } from '../../domain/repository/user.repository';
import { USER_AUTH_REPOSITORY } from '../../domain/repository/user-auth.repository';
import { User } from '../../domain/entities/user';
import { UserAuth } from '../../domain/entities/user-auth';
import { UserStatus } from '../../domain/vos/user-status.enum';
import { IdentityType } from '../../domain/vos/identity-type.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepo: jest.Mocked<any>;
  let userAuthRepo: jest.Mocked<any>;

  beforeEach(async () => {
    userRepo = {
      findById: jest.fn(),
      findByIdOrFail: jest.fn(),
      findByEmail: jest.fn(),
      findPage: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    userAuthRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByIdentityTypeAndIdentifier: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

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
      const existingUser = User.create({ nickname: '李四', email: 'test@example.com' });
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
      userAuthRepo.findByIdentityTypeAndIdentifier.mockResolvedValue(existingAuth);

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
```

- [ ] **Step 2: 运行测试**

```bash
cd backend && pnpm test -- user.service.spec.ts
```

Expected: 所有测试通过

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/user/application/service/user.service.spec.ts
git commit -m "test(user): 添加 UserService 单元测试

- 覆盖创建、查询、更新、删除场景
- 覆盖邮箱和用户名唯一性校验

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Task 14: 验证构建和 lint

**Files:**
- 无新文件

- [ ] **Step 1: 运行 lint**

```bash
cd backend && pnpm lint
```

Expected: 无错误

- [ ] **Step 2: 运行构建**

```bash
cd backend && pnpm build
```

Expected: 构建成功

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore(user): 验证构建和代码规范

- 通过 lint 检查
- 通过 TypeScript 编译

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## 计划自检

### Spec 覆盖检查

| 设计文档要求 | 对应任务 |
|-------------|---------|
| 用户增删改查 | Task 8 (UserService), Task 10 (UserController) |
| users 表建模 | Task 3 (User 实体), Task 6 (UserSchema) |
| user_auths 表建模 | Task 4 (UserAuth 实体), Task 6 (UserAuthSchema) |
| 密码 argon2id 加密 | Task 1 (安装 argon2), Task 8 (UserService.create) |
| 软删除 | Task 3 (User.delete), Task 7 (findById 排除 deleted) |
| 目录结构参考 recruitment | 所有 Task 的文件路径 |
| 旧代码清理 | Task 12 |

### Placeholder 检查

- 无 "TBD", "TODO", "implement later" 等占位符
- 所有步骤包含完整代码和命令
- 所有类型和接口名称一致

### 类型一致性检查

- `UserStatus` / `IdentityType` 枚举在 Task 2 定义，后续任务一致使用
- `UserRepository` / `UserAuthRepository` 接口在 Task 5 定义，Task 7 实现，Task 8 消费
- `CreateUserCommand` / `UpdateUserCommand` / `UserView` 在 Task 8 定义，Task 10 消费
