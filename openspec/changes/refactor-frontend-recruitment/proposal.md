## Why

当前前端存在大量与招聘业务无关的示例页面（GraphQL Demo、简历评分、用户注册等），且缺少统一路由和规范化组件库。为聚焦招聘业务、提升可维护性，需要彻底清理现有前端，引入 React Router 与 shadcn/ui，构建以"招聘 - 岗位管理"为核心的新前端。

## What Changes

- **BREAKING** 删除 `frontend/src/pages` 下所有现有页面（CandidateDetailPage、CandidateListPage、GraphqlDemoPage、ResumeScorePage、ResumeUploadPage、UserRegistrationPage）
- **BREAKING** 删除与旧页面耦合的组件（`components/` 下 CandidateStatusBadge、ScoreChart、ScreeningProgress、Toast、UploadForm、status.ts）、hooks（useResumeUpload、useScreeningEvents）、类型定义（types/screening.ts）及旧 API 层（lib/api.ts）
- **BREAKING** 移除 `@headless-ui/react` 依赖，改用 shadcn/ui 作为唯一组件库
- 引入 `react-router-dom`（v6）作为客户端路由方案
- 新增"招聘"模块，包含二级菜单"岗位管理"
- "岗位管理"页面对接后端 `POST/GET/PUT/DELETE /api/recruitment/jobs` 接口，支持分页列表、创建、编辑、删除、详情查看

## Capabilities

### New Capabilities

- `recruitment-layout`: 应用整体布局，包含侧边栏导航（招聘模块 + 岗位管理二级菜单）与主内容区，基于 React Router 实现路由
- `job-management`: 岗位管理 CRUD 功能，包含列表分页、创建、编辑、删除、详情，调用 `/api/recruitment/jobs` REST 接口

### Modified Capabilities

（无已有能力需要修改）

## Impact

- **依赖变更**：`package.json` 移除 `@headless-ui/react`，新增 `react-router-dom`；通过 shadcn CLI 按需引入组件
- **文件结构**：`frontend/src/` 下 pages、components、hooks、types、lib 目录将被清空并重建
- **API**：前端将通过 HTTP 调用后端 `api/recruitment/jobs`（已存在）
- **构建**：Vite 配置无需变更，但入口 `main.tsx` 与 `App.tsx` 将重写为路由 + 布局结构
