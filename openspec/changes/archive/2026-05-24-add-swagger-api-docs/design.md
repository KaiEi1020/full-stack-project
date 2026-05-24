## Context

当前后端使用 NestJS 构建 REST API，但没有交互式文档。前端开发者需要手动查看 Controller 代码或使用 Postman/curl 测试接口，效率较低。此外，团队希望能够将 API 文档导出到 Apifox 进行更便捷的团队协作和接口管理。

项目当前使用 `@nestjs/common` v11 构建 API，暂无 Swagger 相关依赖。

## Goals / Non-Goals

**Goals:**
- 集成 Swagger/OpenAPI 文档生成能力
- 为招聘模块的 Job API 生成完整的接口文档
- 支持导出 OpenAPI 3.0 规范（JSON/YAML）以便导入 Apifox
- 保持向后兼容，不影响现有接口功能

**Non-Goals:**
- 不包含 API 版本管理策略
- 不实现 API 认证/授权文档（当前接口无权限控制）
- 不覆盖其他模块（用户管理、简历管理等）的文档

## Decisions

### 1. 使用 @nestjs/swagger 而非手动编写 OpenAPI
**决定**: 采用 `@nestjs/swagger` + `swagger-ui-express`

**理由:**
- NestJS 官方推荐方案，与框架深度集成
- 支持通过装饰器自动从代码生成文档，减少维护成本
- 支持 OpenAPI 3.0 规范，可导出 JSON/YAML 对接 Apifox

**替代方案考虑:**
- 手动编写 OpenAPI YAML/JSON → 需要手动维护，与代码不同步
- 使用 `tsoa` → 需要额外学习成本，且主要面向 CLI 项目

### 2. 路由前缀设计
**决定**: 文档路由为 `/api-docs`

**理由:**
- 简洁明了，符合常见约定
- 与 API 路由 `/api/recruitment/job` 区分开

### 3. DTO 建模策略
**决定**: 使用 class-validator + class-transformer 定义 DTO，并在 DTO 类上添加 Swagger 装饰器

**理由:**
- 运行时验证与文档生成一体化
- 与 MikroORM 实体分离，保持单一职责

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 新增依赖增加维护成本 | 中 | 仅引入 2 个核心包，后续按需扩展 |
| DTO 与 Entity 重复定义 | 低 | DTO 侧重 API 契约，Entity 侧重数据存储，职责分离合理 |
| 文档路由暴露实现细节 | 低 | 仅在开发/测试环境启用，生产环境可通过环境变量控制 |

## Open Questions

- [ ] 是否需要为其他模块（用户管理、简历管理）同步添加文档？
- [ ] 生产环境是否需要禁用 Swagger UI？
