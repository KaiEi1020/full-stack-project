# RBAC 权限模块设计文档

## 1. 概述

本文档定义后端 NestJS 项目的 RBAC 权限模块设计。采用 DDD + CQRS 模式，新增独立的 `access-control` 模块，与用户模块保持边界清晰。

## 2. 设计决策

| 决策项 | 选择 | 说明 |
|---|---|---|
| 模块划分 | 新增 `access-control` 模块 | `permission`、`role`、`role_permission`、`user_role` 归属权限模块 |
| 权限类型 | `DIRECTORY` / `PAGE` / `ACTION` / `ELEMENT` | 第一阶段按钮显示复用 `ACTION` 权限 |
| 租户隔离 | 不做 | 全系统共用一套权限点 |
| 角色系统标记 | 预留 `isSystem` | 系统角色不允许删除，其他限制后续扩展 |
| 用户角色 | 多角色 | 一个用户可绑定多个角色，权限取并集 |
| 树授权 | 前端辅助勾选 | 后端存储最终权限点，查询和鉴权最简单 |
| 权限编码 | `模块.资源.动作` | 示例：`system.user.create` |
| 用户权限列表 | 提供 HTTP 接口 | 给前端菜单/按钮控制使用 |
| 跨模块交互 | CQRS QueryBus + 领域事件 | 不直接操作对方表，不写 Port 接口 |
| 删除策略 | 软删除 | 所有业务实体使用 `deletedAt` |

## 3. 领域模型

所有实体继承 `BaseEntity`，具备 `id`、`createdAt`、`updatedAt`、`deletedAt`。

### 3.1 Permission（权限点）

```text
Permission extends BaseEntity
- code: string        // 唯一编码，如 system.user.create
- name: string        // 显示名称
- type: PermissionType // DIRECTORY | PAGE | ACTION | ELEMENT
- parentId?: string   // 父节点 ID，树结构
- sort: number        // 排序
- status: PermissionStatus // ACTIVE | DISABLED
```

### 3.2 Role（角色）

```text
Role extends BaseEntity
- code: string        // 唯一编码
- name: string        // 显示名称
- description?: string // 描述
- status: RoleStatus  // ACTIVE | DISABLED
- isSystem: boolean   // 是否系统内置角色
```

### 3.3 RolePermission（角色-权限关系）

```text
RolePermission extends BaseEntity
- roleId: string
- permissionId: string
```

### 3.4 UserRole（用户-角色关系）

```text
UserRole extends BaseEntity
- userId: string      // 引用用户 ID，不建 ORM 关系
- roleId: string
```

## 4. 应用服务与 CQRS

### 4.1 Command（写侧）

| Command | 模块 | 用途 |
|---|---|---|
| CreatePermissionCommand | access-control | 创建权限点 |
| UpdatePermissionCommand | access-control | 更新权限点 |
| DeletePermissionCommand | access-control | 软删除权限点 |
| CreateRoleCommand | access-control | 创建角色 |
| UpdateRoleCommand | access-control | 更新角色 |
| DeleteRoleCommand | access-control | 软删除角色 |
| AssignRolePermissionCommand | access-control | 给角色分配权限 |
| RemoveRolePermissionCommand | access-control | 移除角色权限 |
| AssignUserRoleCommand | access-control | 给用户分配角色 |
| RemoveUserRoleCommand | access-control | 移除用户角色 |

### 4.2 Query（读侧）

| Query | 模块 | 用途 |
|---|---|---|
| GetUserByIdQuery | user | access-control 校验用户存在 |
| GetUserRolesQuery | access-control | 查询用户角色列表 |
| GetUserPermissionsQuery | access-control | 聚合用户权限 code 列表 |
| GetRolePermissionsQuery | access-control | 查询角色拥有的权限 |
| GetPermissionTreeQuery | access-control | 查询权限树 |

### 4.3 领域事件

| 事件 | 发布者 | 订阅者 | 处理 |
|---|---|---|---|
| UserDeletedEvent | user | access-control | 软删除相关 user_role |
| RoleDeletedEvent | access-control | 预留 | 通知权限变更 |

## 5. 跨模块边界

```text
user 模块
- 只写 user、user_auth
- 删除用户时发布 UserDeletedEvent
- 不维护 user_role

access-control 模块
- 只写 permission、role、role_permission、user_role
- 存 userId，不建 MikroORM User 关系
- 不 join user 表
- 需要验证用户存在时，通过 QueryBus 执行 GetUserByIdQuery
- 订阅 UserDeletedEvent，软删除相关 user_role
```

## 6. 错误处理

| 错误场景 | 异常类型 |
|---|---|
| 权限编码重复 | ConflictException |
| 角色编码重复 | ConflictException |
| 给不存在的用户分配角色 | NotFoundException |
| 删除系统角色 | ForbiddenException |
| 删除有用户绑定的角色 | ConflictException |
| 权限树循环依赖 | BadRequestException |

## 7. 测试策略

| 测试类型 | 范围 |
|---|---|
| 领域实体单元测试 | 权限树校验、角色状态转换 |
| 应用服务单元测试 | Command/Query Handler |
| 仓储集成测试 | MikroORM 持久化 |
| 控制器 e2e 测试 | HTTP 接口完整链路 |

## 8. 模块目录结构

```text
src/modules/access-control
├── access-control.module.ts
├── api
│   └── controller
│       ├── permission.controller.ts
│       ├── role.controller.ts
│       └── user-role.controller.ts
├── application
│   ├── command
│   │   ├── handler
│   │   └── impl
│   └── query
│       ├── handler
│       └── impl
├── domain
│   ├── entities
│   │   ├── permission.ts
│   │   ├── role.ts
│   │   ├── role-permission.ts
│   │   └── user-role.ts
│   ├── events
│   │   └── role-deleted.event.ts
│   ├── repository
│   │   ├── permission.repository.ts
│   │   ├── role.repository.ts
│   │   ├── role-permission.repository.ts
│   │   └── user-role.repository.ts
│   └── vos
│       ├── permission-type.enum.ts
│       ├── permission-status.enum.ts
│       └── role-status.enum.ts
└── infrastructure
    └── persistence
        ├── repositories
        │   ├── mikroorm-permission.repository.ts
        │   ├── mikroorm-role.repository.ts
        │   ├── mikroorm-role-permission.repository.ts
        │   └── mikroorm-user-role.repository.ts
        └── schemas
            ├── permission.schema.ts
            ├── role.schema.ts
            ├── role-permission.schema.ts
            └── user-role.schema.ts
```

## 9. 实现阶段

| 阶段 | 内容 |
|---|---|
| 第一阶段 | 权限树 CRUD、角色 CRUD、角色授权、用户分配角色、用户权限列表查询 |
| 第二阶段 | Guard 鉴权、接口权限校验装饰器 |
| 第三阶段 | 前端按钮精细控制（ELEMENT 类型）、系统角色完整规则 |
