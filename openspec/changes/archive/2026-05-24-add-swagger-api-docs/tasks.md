## 1. 环境准备

- [x] 1.1 安装 `@nestjs/swagger` 和 `swagger-ui-express` 依赖
- [x] 1.2 安装 `class-validator` 和 `class-transformer` 用于 DTO 验证

## 2. Swagger 基础配置

- [x] 2.1 在 `src/main.ts` 中引入 Swagger 模块
- [x] 2.2 配置 DocumentBuilder（标题、版本、描述）
- [x] 2.3 挂载 Swagger UI 到 `/api-docs` 路由

## 3. DTO 建模

- [x] 3.1 创建 `CreateJobDto` 类，添加字段和验证装饰器
- [x] 3.2 创建 `UpdateJobDto` 类，添加部分字段更新支持
- [x] 3.3 在 DTO 类上添加 Swagger 装饰器（@ApiProperty 等）

## 4. Controller 文档注解

- [x] 4.1 为 `JobController` 添加 `@ApiTags('job')` 装饰器
- [x] 4.2 为各接口添加 `@ApiOperation` 描述
- [x] 4.3 为各接口添加 `@ApiResponse` 响应示例
- [x] 4.4 为路径参数接口添加 `@ApiParam` 参数说明

## 5. 验证与测试

- [ ] 5.1 启动开发服务器，访问 `/api-docs` 验证文档页面显示
- [ ] 5.2 访问 `/api-docs-json` 验证 OpenAPI JSON 导出
- [ ] 5.3 验证 Job 各接口文档完整性
- [ ] 5.4 尝试将 JSON 导入 Apifox，验证兼容性
