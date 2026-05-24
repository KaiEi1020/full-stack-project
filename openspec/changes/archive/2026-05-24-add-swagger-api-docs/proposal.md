## Why

当前后端 API 缺乏交互式文档，开发者需要手动查看代码或使用 Postman 等工具测试接口，不便于前端对接和团队协作。通过添加 Swagger/OpenAPI 文档，可以自动生成交互式 API 文档，并可导出对接 Apifox。

## What Changes

- 引入 `@nestjs/swagger` 和 `swagger-ui-express` 依赖
- 在 `main.ts` 中配置 Swagger 模块，启用 `/api-docs` 路由
- 在 `JobController` 各接口添加 Swagger 装饰器（@ApiTags、@ApiOperation、@ApiResponse 等）
- 创建 DTO 类并添加验证装饰器，用于请求/响应建模

## Capabilities

### New Capabilities
- `rest-api-documentation`: REST API 文档自动化生成能力，支持 OpenAPI 3.0 规范，可导出 JSON/YAML 对接 Apifox

### Modified Capabilities
- (无)

## Impact

- **新增依赖**: `@nestjs/swagger`, `swagger-ui-express`, `class-validator`, `class-transformer`
- **代码影响**: 修改 `src/main.ts`，修改 `src/modules/recruitment/api/controller/job.controller.ts`，新增 DTO 文件
- **路由影响**: 新增 `/api-docs` 路由提供 Swagger UI 页面
