## Context

当前前端基于 Vite + React + TypeScript，但存在大量示例页面（GraphQL Demo、简历评分、用户注册等）和与旧业务耦合的组件/hooks/types。组件库使用 `@headless-ui/react`，缺少统一路由方案。

后端已提供完整的招聘模块 REST API：`/api/recruitment/jobs`（CRUD + 分页），可直接对接。

## Goals / Non-Goals

**Goals:**
- 彻底清理旧前端代码，从零构建以招聘业务为核心的新前端
- 引入 React Router v6 实现客户端路由
- 采用 shadcn/ui 作为唯一组件库，移除 headless-ui
- 实现"招聘 → 岗位管理"模块，对接后端 jobs API

**Non-Goals:**
- 不保留任何旧页面或旧组件
- 不涉及后端接口改动
- 不实现招聘模块以外的业务（如简历管理、面试管理等后续迭代）

## Decisions

### 1. 路由方案：React Router v6

**选择**：`react-router-dom` v6，使用 `createBrowserRouter` + 嵌套路由

**理由**：
- React 生态事实标准，社区活跃，文档完善
- 支持嵌套路由，天然适配"模块 → 页面"的菜单结构
- 数据加载（loader）与表单处理（action）可简化数据流

**替代方案**：TanStack Router（类型安全更强，但学习成本高，社区规模较小）

### 2. 组件库：shadcn/ui

**选择**：shadcn/ui（通过 `https://ui.shadcn.com/docs/mcp` 引入）

**理由**：
- 基于 Radix UI + Tailwind CSS，无运行时依赖，代码直接复制到项目中
- 高度可定制，无黑盒抽象
- 用户明确要求使用

**替代方案**：Ant Design（功能全面但体积大）、MUI（风格偏 Material）

### 3. 布局结构

**选择**：左侧边栏 + 右侧主内容区

```
+------------------+--------------------------------+
| 招聘（模块标题）   |                                |
|   └─ 岗位管理     |        <Outlet />              |
|                  |   （路由匹配的页面内容）          |
|                  |                                |
+------------------+--------------------------------+
```

**理由**：
- 符合后台管理系统常见交互模式
- 侧边栏支持多级菜单，便于后续扩展其他二级菜单（如简历管理、面试管理）

### 4. 数据请求

**选择**：原生 `fetch` + React Query（`@tanstack/react-query`）

**理由**：
- React Query 提供服务端状态管理（缓存、重试、分页、乐观更新）
- 与 React Router loader 可配合使用，也可独立使用
- 轻量，不引入 Redux 等重型状态管理

**替代方案**：SWR（功能较 React Query 少）、Axios（需额外封装）

### 5. 文件结构

```
frontend/src/
├── main.tsx                    # 入口，挂载 RouterProvider
├── App.tsx                     # 根布局（含侧边栏 + Outlet）
├── components/
│   └── ui/                     # shadcn/ui 组件（button、input、table、dialog 等）
├── lib/
│   ├── api.ts                  # fetch 封装（baseURL、错误处理）
│   └── utils.ts                # shadcn 工具函数（cn）
├── pages/
│   ├── job-list/
│   │   ├── index.tsx           # 岗位列表页
│   │   ├── columns.tsx         # 表格列定义
│   │   └── components/
│   │       ├── create-job-dialog.tsx
│   │       └── edit-job-dialog.tsx
│   └── job-detail/
│       └── index.tsx           # 岗位详情页
└── types/
    └── job.ts                  # Job 相关类型定义
```

### 6. 清理策略

**选择**：直接删除旧文件，不保留任何兼容层

**理由**：
- 旧代码与新业务无关，无保留价值
- 保留兼容层会增加复杂度

## Risks / Trade-offs

- **[风险] shadcn/ui 需要 Tailwind CSS 配置** → 项目已使用 Tailwind，无需额外配置；若未使用，需在初始化时安装
- **[风险] React Query 增加学习成本** → 团队熟悉 React Query，且其 API 简洁；若团队不熟悉，可退回原生 fetch + useState
- **[权衡] 删除所有旧代码** → 短期工作量大，但长期维护成本低；若保留部分代码，可能引入历史包袱
- **[权衡] 使用 React Router loader** → 可在路由层预加载数据，但增加路由与数据层的耦合；若不需要 SSR，可简化为页面内 useEffect
