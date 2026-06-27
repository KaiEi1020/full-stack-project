# 用户模块重构设计文档

## 1. 设计目标

重构 `backend/src/modules/user/` 模块，使其目录结构与 `recruitment` 模块保持一致（`api/application/domain/infrastructure`），同时支持用户增删改查功能。

## 2. 数据模型

### 2.1 users 表

| 字段         | 类型         | 说明                                             |
| ------------ | ------------ | ------------------------------------------------ |
| `id`         | UUID         | 系统唯一用户ID，沿用 `BaseEntity` 的 UUID 字符串 |
| `nickname`   | VARCHAR(50)  | 用户在本系统的昵称，必填                         |
| `avatar_url` | VARCHAR(255) | 头像URL，可为空                                  |
| `email`      | VARCHAR(100) | 绑定邮箱，可为空，唯一                           |
| `status`     | TINYINT      | 用户状态: 1-正常, 0-禁用，默认1                  |
| `created_at` | TIMESTAMP    | 创建时间                                         |
| `updated_at` | TIMESTAMP    | 更新时间                                         |
| `deleted_at` | TIMESTAMP    | 软删除标记                                       |

### 2.2 user_auths 表

| 字段            | 类型         | 说明                                                                |
| --------------- | ------------ | ------------------------------------------------------------------- |
| `id`            | UUID         | 主键，沿用 `BaseEntity` 的 UUID 字符串                              |
| `user_id`       | UUID         | 对应 `users` 表的 `id`                                              |
| `identity_type` | VARCHAR(20)  | 登录类型: github, wechat, gitee, password                           |
| `identifier`    | VARCHAR(100) | 唯一标识: 第三方平台的 UnionID/OpenID，密码登录则是用户名/邮箱      |
| `credential`    | VARCHAR(255) | 凭证: 密码登录存 `argon2id` 哈希密码；第三方登录可选存 access_token |
| `created_at`    | TIMESTAMP    | 创建时间                                                            |
| `updated_at`    | TIMESTAMP    | 更新时间                                                            |
| `deleted_at`    | TIMESTAMP    | 软删除标记                                                          |

### 2.3 约束

- `users.email`：唯一但允许为空
- `user_auths(identity_type, identifier)`：唯一索引，确保同一平台同一账号不重复注册
- `user_auths.user_id`：外键关联 `users(id)`，级联删除

## 3. 模块结构

```text
backend/src/modules/user/
├── api/
│   ├── controller/user.controller.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── application/
│   └── service/
│       └── user.service.ts
├── domain/
│   ├── entities/
│   │   ├── user.ts
│   │   └── user-auth.ts
│   ├── repository/
│   │   ├── user.repository.ts
│   │   └── user-auth.repository.ts
│   └── vos/
│       ├── identity-type.enum.ts
│       └── user-status.enum.ts
├── infrastructure/
│   └── persistence/
│       ├── repositories/
│       │   ├── mikroorm-user.repository.ts
│       │   └── mikroorm-user-auth.repository.ts
│       └── schemas/
│           ├── user.schema.ts
│           └── user-auth.schema.ts
└── user.module.ts
```

## 4. 领域层设计

### 4.1 实体

- `User`：聚合根，包含 `nickname`、`avatarUrl`、`email`、`status`，支持创建、更新、软删除
- `UserAuth`：值对象/实体，包含 `identityType`、`identifier`、`credential`、`userId`

### 4.2 值对象（VO）

- `UserStatus`：枚举，`ACTIVE = 1`、`DISABLED = 0`
- `IdentityType`：枚举，`PASSWORD`、`GITHUB`、`WECHAT`、`GITEE`

### 4.3 仓储接口

- `UserRepository`：用户 CRUD、分页查询、按邮箱查询、软删除
- `UserAuthRepository`：认证身份 CRUD、按 `identityType + identifier` 查询、按 `userId` 查询

## 5. 应用层设计

### 5.1 UserService

| 方法                  | 职责                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `create(command)`     | 创建用户；`nickname` 必填；password 注册时 `identifier/password` 必填；使用 `argon2id` 哈希密码；同时创建 `User` 和 `UserAuth` |
| `findById(id)`        | 查询用户详情                                                                                                                   |
| `findPage(query)`     | 分页查询未删除用户                                                                                                             |
| `update(id, command)` | 更新昵称、头像、邮箱、状态                                                                                                     |
| `delete(id)`          | 软删除用户                                                                                                                     |

### 5.2 视图对象

- `UserView`：返回给前端的数据结构，不包含 `credential`

## 6. 接口层设计

### 6.1 REST API

| 方法   | 路径             | 说明                         |
| ------ | ---------------- | ---------------------------- |
| POST   | `/api/users`     | 创建用户（含 password 注册） |
| GET    | `/api/users`     | 分页查询用户列表             |
| GET    | `/api/users/:id` | 查询用户详情                 |
| PUT    | `/api/users/:id` | 更新用户信息                 |
| DELETE | `/api/users/:id` | 软删除用户                   |

### 6.2 DTO

- `CreateUserDto`：`nickname`（必填）、`avatarUrl`（可选）、`email`（可选）、`password`（password 注册时必填）、`identifier`（password 注册时必填，作为用户名/邮箱）
- `UpdateUserDto`：`nickname`、`avatarUrl`、`email`、`status` 可选

## 7. 基础设施层设计

### 7.1 Schema

- `UserSchema`：映射 `users` 表，继承 `BaseEntity`
- `UserAuthSchema`：映射 `user_auths` 表，继承 `BaseEntity`，外键 `userId`

### 7.2 仓储实现

- `MikroOrmUserRepository`：使用 `EntityManager` 操作 `UserSchema`
- `MikroOrmUserAuthRepository`：使用 `EntityManager` 操作 `UserAuthSchema`

## 8. 关键决策

| 决策项       | 结论                      | 说明                                                             |
| ------------ | ------------------------- | ---------------------------------------------------------------- |
| 用户 ID 类型 | UUID 字符串               | 沿用项目当前 `BaseEntity` 的 UUID 字符串，不采用 BIGINT 自增     |
| 密码加密     | `argon2id`                | 推荐方案，安全性优于 bcrypt                                      |
| 删除策略     | 软删除                    | 和 `recruitment` 模块保持一致                                    |
| 认证范围     | 本期不做                  | 仅保留 `user_auths` 数据模型和写入能力，登录/注册/Token 后续再做 |
| 密码必填     | 是                        | 创建 password 类型身份时密码必填                                 |
| auth 删除    | 用户软删除不物理删除 auth | 认证查询后续应校验用户状态和 `deletedAt`                         |

## 9. 旧代码处理

以下旧文件将被新结构替换：

- `user.controller.ts` → `api/controller/user.controller.ts`
- `register-user.dto.ts` → `api/dto/create-user.dto.ts`
- `application/register-user.service.ts` → 合并到 `application/service/user.service.ts`
- `application/user-query.service.ts` → 合并到 `application/service/user.service.ts`
- `domain/user.repository.ts` → `domain/repository/user.repository.ts`
- `infrastructure/repositories/mikroorm-user.repository.ts` → `infrastructure/persistence/repositories/mikroorm-user.repository.ts`
- `infrastructure/persistence/entities/user.entity.ts` → `infrastructure/persistence/schemas/user.schema.ts`
- `models/user.model.ts` → 删除，使用 `domain/entities/user.ts`
- `infrastructure/sms-notification.publisher.ts` → 删除

## 10. 测试策略

- `user.service.spec.ts`：单元测试，覆盖创建、查询、更新、删除
- `user.controller.spec.ts`：单元测试，覆盖接口行为
- `mikroorm-user.repository.spec.ts`：可选，覆盖仓储查询

## 11. 风险与注意事项

1. **邮箱唯一性**：`email` 允许为空，但非空时必须唯一
2. **密码安全**：`credential` 字段必须存储 `argon2id` 哈希，禁止明文存储
3. **外键约束**：`user_auths.user_id` 外键级联删除，确保数据一致性
4. **软删除查询**：所有查询默认排除 `deletedAt IS NOT NULL` 的记录
