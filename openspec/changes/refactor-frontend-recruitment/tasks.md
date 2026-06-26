## 1. 清理旧代码

- [ ] 1.1 删除 `frontend/src/pages/` 下所有旧页面（CandidateDetailPage、CandidateListPage、GraphqlDemoPage、ResumeScorePage、ResumeUploadPage、UserRegistrationPage）
- [ ] 1.2 删除 `frontend/src/components/` 下所有旧组件（CandidateStatusBadge、ScoreChart、ScreeningProgress、Toast、UploadForm、status.ts）
- [ ] 1.3 删除 `frontend/src/hooks/` 目录下所有旧 hooks（useResumeUpload、useScreeningEvents）
- [ ] 1.4 删除 `frontend/src/types/screening.ts`
- [ ] 1.5 删除 `frontend/src/lib/api.ts`
- [ ] 1.6 删除 `frontend/src/App.css`
- [ ] 1.7 卸载 `@headless-ui/react` 依赖

## 2. 基础设施搭建

- [ ] 2.1 安装 `react-router-dom` 依赖
- [ ] 2.2 初始化 shadcn/ui（配置 Tailwind、添加 `components.json`、添加 `cn` 工具函数到 `lib/utils.ts`）
- [ ] 2.3 通过 shadcn CLI 安装所需组件（button、input、table、dialog、form、label、select、card、badge、pagination）

## 3. 布局与路由

- [ ] 3.1 创建根布局组件 `App.tsx`（左侧边栏 + 右侧 `<Outlet />` 两栏结构）
- [ ] 3.2 创建侧边栏导航组件（支持模块分组、二级菜单、当前路由高亮）
- [ ] 3.3 创建岗位列表页 `pages/job-list/index.tsx`
- [ ] 3.4 创建岗位详情页 `pages/job-detail/index.tsx`
- [ ] 3.5 重写 `main.tsx`，使用 `createBrowserRouter` 配置路由（根路径重定向到 `/recruitment/jobs`，嵌套路由 `/recruitment/jobs` 和 `/recruitment/jobs/:id`）

## 4. API 层与类型定义

- [ ] 4.1 创建 `types/job.ts`，定义 Job 相关类型（CreateJobDto、UpdateJobDto、JobView、PageRequest、PageResponse）
- [ ] 4.2 创建 `lib/api.ts`，封装 fetch 请求（baseURL、错误处理）
- [ ] 4.3 创建 `lib/job-api.ts`，封装岗位相关 API 调用（jobPage、getJob、createJob、updateJob、deleteJob）

## 5. 岗位管理功能

- [ ] 5.1 实现岗位列表页：分页表格展示（调用 jobPage 接口，表格列：职位名称、描述、状态、创建时间、操作按钮）
- [ ] 5.2 实现创建岗位对话框（表单：title、description、requiredSkills、preferredSkills，表单校验，调用 createJob 接口）
- [ ] 5.3 实现编辑岗位对话框（预填充数据，调用 updateJob 接口）
- [ ] 5.4 实现删除岗位确认对话框（二次确认，调用 deleteJob 接口）
- [ ] 5.5 实现岗位详情页（展示完整岗位信息，返回列表按钮）
