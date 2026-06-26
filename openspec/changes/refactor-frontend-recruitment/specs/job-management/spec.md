## ADDED Requirements

### Requirement: 应用采用 React Router 实现路由
系统 SHALL 使用 React Router v6 作为客户端路由方案，支持嵌套路由和数据预加载。

#### Scenario: 路由配置正确
- **WHEN** 应用启动
- **THEN** 系统创建 BrowserRouter，配置根布局（`/`）和嵌套路由（`/recruitment/jobs`、`/recruitment/jobs/:id`）

#### Scenario: 路由切换正常
- **WHEN** 用户点击侧边栏菜单项
- **THEN** 系统通过 `<Link>` 或 `useNavigate()` 切换路由，页面内容更新，不刷新整个页面

---

### Requirement: 应用采用 shadcn/ui 组件库
系统 SHALL 使用 shadcn/ui 作为唯一组件库，移除 `@headless-ui/react` 依赖。

#### Scenario: 组件库初始化
- **WHEN** 项目初始化
- **THEN** 通过 shadcn CLI 安装所需组件（button、input、table、dialog、form、label、select、pagination 等）

#### Scenario: 移除 headless-ui
- **WHEN** 清理旧依赖
- **THEN** `package.json` 中移除 `@headless-ui/react`，所有组件改用 shadcn/ui

---

### Requirement: 应用采用左右两栏布局
系统 SHALL 提供左侧边栏 + 右侧主内容区的布局结构，侧边栏展示模块导航，主内容区通过 `<Outlet />` 渲染路由匹配的页面。

#### Scenario: 布局结构正确
- **WHEN** 应用加载
- **THEN** 页面左侧为固定宽度（240px）侧边栏，右侧为自适应宽度的主内容区

#### Scenario: 侧边栏展示招聘模块
- **WHEN** 用户访问任意页面
- **THEN** 侧边栏显示"招聘"模块标题，其下显示"岗位管理"菜单项

#### Scenario: 菜单项高亮当前路由
- **WHEN** 用户位于 `/recruitment/jobs` 页面
- **THEN** 侧边栏中"岗位管理"菜单项处于高亮选中状态

---

### Requirement: 岗位列表分页展示
系统 SHALL 在 `/recruitment/jobs` 页面以表格形式分页展示岗位列表，调用 `GET /api/recruitment/jobs` 接口。

#### Scenario: 加载岗位列表
- **WHEN** 用户进入岗位列表页
- **THEN** 系统调用 `GET /api/recruitment/jobs?page=1&pageSize=10`，返回数据渲染表格，显示岗位名称、职位描述、必备技能、优先技能、状态、创建时间、更新时间等字段

#### Scenario: 切换分页
- **WHEN** 用户点击分页器的第 2 页
- **THEN** 系统调用 `GET /api/recruitment/jobs?page=2&pageSize=10`，表格刷新为第 2 页数据

#### Scenario: 列表为空
- **WHEN** 接口返回空列表
- **THEN** 表格显示"暂无数据"提示

---

### Requirement: 创建岗位
系统 SHALL 提供创建岗位功能，通过对话框表单收集信息，调用 `POST /api/recruitment/jobs` 接口。

#### Scenario: 打开创建对话框
- **WHEN** 用户点击"新建岗位"按钮
- **THEN** 系统弹出创建岗位对话框，显示表单（职位名称、职位描述、必备技能、优先技能）

#### Scenario: 成功创建岗位
- **WHEN** 用户填写表单并提交
- **THEN** 系统调用 `POST /api/recruitment/jobs`，成功后关闭对话框并刷新列表，显示成功提示

#### Scenario: 表单校验失败
- **WHEN** 用户未填写必填字段（如职位名称）直接提交
- **THEN** 系统显示表单校验错误提示，不发送请求

---

### Requirement: 编辑岗位
系统 SHALL 提供编辑岗位功能，通过对话框表单修改信息，调用 `PUT /api/recruitment/jobs/:id` 接口。

#### Scenario: 打开编辑对话框
- **WHEN** 用户点击某行的"编辑"按钮
- **THEN** 系统弹出编辑岗位对话框，表单预填充当前岗位数据

#### Scenario: 成功编辑岗位
- **WHEN** 用户修改表单并提交
- **THEN** 系统调用 `PUT /api/recruitment/jobs/:id`，成功后关闭对话框并刷新列表，显示成功提示

---

### Requirement: 删除岗位
系统 SHALL 提供删除岗位功能，需二次确认，调用 `DELETE /api/recruitment/jobs/:id` 接口。

#### Scenario: 确认删除
- **WHEN** 用户点击某行的"删除"按钮
- **THEN** 系统弹出确认对话框，提示"确定要删除该岗位吗？"

#### Scenario: 成功删除岗位
- **WHEN** 用户在确认对话框中点击"确定"
- **THEN** 系统调用 `DELETE /api/recruitment/jobs/:id`，成功后刷新列表，显示成功提示

#### Scenario: 取消删除
- **WHEN** 用户在确认对话框中点击"取消"
- **THEN** 系统不发送删除请求，对话框关闭

---

### Requirement: 查看岗位详情
系统 SHALL 在 `/recruitment/jobs/:id` 页面展示岗位完整信息，调用 `GET /api/recruitment/jobs/:id` 接口。

#### Scenario: 进入详情页
- **WHEN** 用户点击某行的"查看"按钮
- **THEN** 系统导航到 `/recruitment/jobs/:id`，调用 `GET /api/recruitment/jobs/:id`，渲染详情页，展示所有字段

#### Scenario: 岗位不存在
- **WHEN** 用户访问一个不存在的岗位 ID
- **THEN** 系统显示"岗位不存在"错误提示，并提供"返回列表"按钮

#### Scenario: 返回详情页
- **WHEN** 用户在详情页点击"返回列表"按钮
- **THEN** 系统导航回 `/recruitment/jobs` 列表页

---

### Requirement: 删除所有旧页面和组件
系统 SHALL 删除 `frontend/src/pages` 下所有现有页面、`components` 下所有旧组件、`hooks` 下所有旧 hooks、`types` 下所有旧类型定义、`lib/api.ts` 旧 API 层。

#### Scenario: 清理旧文件
- **WHEN** 开始重构
- **THEN** 删除以下文件：
  - `pages/CandidateDetailPage.tsx`
  - `pages/CandidateListPage.tsx`
  - `pages/GraphqlDemoPage.tsx`
  - `pages/ResumeScorePage.tsx`
  - `pages/ResumeUploadPage.tsx`
  - `pages/UserRegistrationPage.tsx`
  - `components/CandidateStatusBadge.tsx`
  - `components/ScoreChart.tsx`
  - `components/ScreeningProgress.tsx`
  - `components/Toast.tsx`
  - `components/UploadForm.tsx`
  - `components/status.ts`
  - `hooks/useResumeUpload.ts`
  - `hooks/useScreeningEvents.ts`
  - `types/screening.ts`
  - `lib/api.ts`

#### Scenario: 清理旧依赖
- **WHEN** 清理 package.json
- **THEN** 移除 `@headless-ui/react` 依赖

---

### Requirement: 重写入口文件
系统 SHALL 重写 `main.tsx` 和 `App.tsx`，挂载 React Router 的 `RouterProvider` 和根布局。

#### Scenario: main.tsx 挂载路由
- **WHEN** 应用启动
- **THEN** `main.tsx` 创建 `createBrowserRouter`，挂载 `RouterProvider` 到 React 根节点

#### Scenario: App.tsx 作为根布局
- **WHEN** 路由匹配
- **THEN** `App.tsx` 渲染侧边栏 + `<Outlet />`，所有子路由在主内容区渲染
