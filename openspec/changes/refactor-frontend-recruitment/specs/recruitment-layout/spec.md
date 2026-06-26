## ADDED Requirements

### Requirement: 应用采用 React Router v6 实现客户端路由
系统 SHALL 使用 `react-router-dom` v6 作为唯一路由方案，通过 `createBrowserRouter` + `RouterProvider` 挂载路由。

#### Scenario: 路由配置正确
- **WHEN** 应用启动
- **THEN** 系统创建 BrowserRouter，包含根布局路由（`/`）及嵌套子路由：`/recruitment/jobs`（岗位列表）、`/recruitment/jobs/:id`（岗位详情）

#### Scenario: 根路径重定向
- **WHEN** 用户访问 `/`
- **THEN** 系统自动重定向到 `/recruitment/jobs`

#### Scenario: 未匹配路由重定向
- **WHEN** 用户访问任意不存在的路径
- **THEN** 系统自动重定向到 `/recruitment/jobs`

---

### Requirement: 根布局提供侧边栏 + 主内容区两栏结构
系统 SHALL 在根布局（`App.tsx`）中渲染左侧固定侧边栏和右侧主内容区，子路由通过 `<Outlet />` 渲染。

#### Scenario: 布局结构正确
- **WHEN** 任意页面渲染
- **THEN** 页面左侧为固定宽度（240px）侧边栏导航，右侧为自适应宽度主内容区

---

### Requirement: 侧边栏导航支持模块分组与二级菜单
侧边栏 SHALL 按模块分组展示菜单项，支持可展开的模块组，每个模块组下包含二级菜单项。当前仅有"招聘"模块，其下仅有"岗位管理"一个二级菜单。

#### Scenario: 侧边栏展示招聘模块
- **WHEN** 应用加载完成
- **THEN** 侧边栏显示"招聘"模块组（可展开），展开后显示"岗位管理"菜单项

#### Scenario: 当前路由对应菜单高亮
- **WHEN** 用户位于 `/recruitment/jobs` 页面
- **THEN** 侧边栏中"招聘"模块组展开，"岗位管理"菜单项处于高亮选中状态

#### Scenario: 点击菜单项导航
- **WHEN** 用户点击"岗位管理"菜单项
- **THEN** 系统导航到 `/recruitment/jobs`，菜单项高亮状态更新

---

### Requirement: 移除 headless-ui 依赖
系统 SHALL 从 `package.json` 中移除 `@headless-ui/react`，所有 UI 组件改用 shadcn/ui。

#### Scenario: 依赖清理完成
- **WHEN** 执行依赖清理
- **THEN** `package.json` 中不再包含 `@headless-ui/react`，`node_modules` 中不再安装该包
