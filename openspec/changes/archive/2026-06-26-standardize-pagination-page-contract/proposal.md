## Why

当前后端接口中的列表查询仍以 `listJobs` 这类非分页语义命名和自由返回结构为主，无法形成统一的分页契约。后续会持续增加分页接口，如果现在不抽象公共能力，命名、入参和返回格式会继续分散，前后端接入成本也会不断上升。

## What Changes

- 将现有 `listJobs` 调整为分页接口，并统一命名为 `xxxPage` 形式。
- 约束所有分页接口的固定入参为 `{ pageNo: number; pageSize: number }`。
- 约束所有分页接口的固定返回结果为 `{ total: number; list: any[]; hasNext: boolean }`。
- 提供可复用的通用分页能力，供后续模块和接口直接复用，而不是每个接口单独实现分页协议。
- **BREAKING**：现有列表接口的命名、请求参数和响应结构将发生变化，调用方需要同步调整。

## Capabilities

### New Capabilities
- `pagination-contract`: 定义统一分页接口的命名、固定入参与固定返回结构，并支持后续接口复用同一套分页能力

### Modified Capabilities
- `resume-rest-api`: 调整招聘职位列表接口为分页接口，并将接口契约对齐到统一分页规范

## Impact

- 影响后端 REST API 的控制器、DTO、查询服务和相关测试。
- 影响现有职位列表接口的前后端调用方式与返回解析逻辑，调用方需要从原始数组迁移到 `{ total, list, hasNext }`。
- 需要在后端沉淀通用分页请求/响应模型与分页查询辅助能力，供后续接口复用。
- 这是一次破坏性契约调整：职位列表接口必须显式传入 `pageNo` 和 `pageSize`，并改按分页结果结构解析响应。
