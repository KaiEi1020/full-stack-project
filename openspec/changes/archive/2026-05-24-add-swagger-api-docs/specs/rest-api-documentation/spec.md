## ADDED Requirements

### Requirement: Swagger 文档可访问
系统 SHALL 提供可通过浏览器访问的 Swagger UI 页面，用于可视化展示 API 文档。

#### Scenario: 访问 Swagger 页面
- **WHEN** 用户在浏览器中访问 `/api-docs` 路由
- **THEN** 系统返回 Swagger UI 页面，展示所有已注册 API 的文档

### Requirement: OpenAPI 规范可导出
系统 SHALL 提供符合 OpenAPI 3.0 规范的 JSON 端点，支持导出后导入 Apifox。

#### Scenario: 获取 OpenAPI JSON
- **WHEN** 客户端请求 `/api-docs-json` 路由
- **THEN** 系统返回符合 OpenAPI 3.0 规范的 JSON 文档

#### Scenario: Apifox 导入
- **WHEN** 用户将 `/api-docs-json` 返回的 JSON 导入 Apifox
- **THEN** Apifox 正确解析并展示所有 API 端点信息，包括请求参数、响应示例等

### Requirement: Job 接口文档完整
招聘模块的 Job 相关 API SHALL 在 Swagger 文档中完整展示，包括创建、查询、更新、删除操作。

#### Scenario: 创建职位接口文档
- **WHEN** 查看 Swagger 文档中 POST /api/recruitment/job 接口
- **THEN** 文档包含接口描述、请求体 DTO 字段说明、响应状态码示例

#### Scenario: 职位列表接口文档
- **WHEN** 查看 Swagger 文档中 GET /api/recruitment/job 接口
- **THEN** 文档包含接口描述、响应数据结构示例

#### Scenario: 职位详情接口文档
- **WHEN** 查看 Swagger 文档中 GET /api/recruitment/job/:id 接口
- **THEN** 文档包含路径参数 id 的说明、响应数据结构示例

#### Scenario: 更新职位接口文档
- **WHEN** 查看 Swagger 文档中 PUT /api/recruitment/job/:id 接口
- **THEN** 文档包含路径参数 id、请求体 DTO 的完整说明

#### Scenario: 删除职位接口文档
- **WHEN** 查看 Swagger 文档中 DELETE /api/recruitment/job/:id 接口
- **THEN** 文档包含路径参数 id 的说明、删除操作响应示例

### Requirement: DTO 验证规则文档化
系统 SHALL 在 Swagger 文档中展示 DTO 字段的验证规则（如必填、长度限制、格式要求）。

#### Scenario: 验证规则展示
- **WHEN** 查看包含 DTO 的接口文档
- **THEN** 每个字段旁展示对应的验证规则（如 "必填"、"最大长度 100"）
