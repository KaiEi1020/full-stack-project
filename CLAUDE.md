# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

This repository contains two independently managed Node/TypeScript apps plus root-level deployment scripts in `scripts/`:

- `frontend/`: Vite + React 19 single-page app
- `backend/`: NestJS 11 HTTP API

Install dependencies inside each app directory. Do not use a root pnpm workspace.

## Commands

### Frontend (`frontend/`)

| Task                     | Command                       |
| ------------------------ | ----------------------------- |
| Install dependencies     | `cd frontend && pnpm install` |
| Start dev server         | `cd frontend && pnpm dev`     |
| Build production bundle  | `cd frontend && pnpm build`   |
| Lint                     | `cd frontend && pnpm lint`    |
| Preview production build | `cd frontend && pnpm preview` |

### Backend (`backend/`)

| Task                        | Command                                             |
| --------------------------- | --------------------------------------------------- |
| Install dependencies        | `cd backend && pnpm install`                        |
| Start dev server with watch | `cd backend && pnpm start:dev`                      |
| Start once                  | `cd backend && pnpm start`                          |
| Build                       | `cd backend && pnpm build`                          |
| Lint                        | `cd backend && pnpm lint`                           |
| Format                      | `cd backend && pnpm format`                         |
| Run all unit tests          | `cd backend && pnpm test`                           |
| Run tests in watch mode     | `cd backend && pnpm test:watch`                     |
| Run coverage                | `cd backend && pnpm test:cov`                       |
| Run e2e tests               | `cd backend && pnpm test:e2e`                       |
| Debug tests                 | `cd backend && pnpm test:debug`                     |
| Run a single Jest spec      | `cd backend && pnpm test -- app.controller.spec.ts` |
| Run a single e2e spec       | `cd backend && pnpm test:e2e -- app.e2e-spec.ts`    |

## Architecture

### Frontend

The frontend is a small Vite application with a single React root:

- `frontend/src/main.tsx` mounts `App` in `StrictMode`
- `frontend/src/App.tsx` holds the entire current UI
- `frontend/src/App.css` and `frontend/src/index.css` contain all styling
- `frontend/public/` contains static assets served directly by Vite
- `frontend/src/assets/` contains assets imported through the bundler

Notable implementation details:

- Vite is configured with both `@vitejs/plugin-react` and the Babel React Compiler preset in `frontend/vite.config.ts`
- TypeScript uses bundler-style resolution and `noEmit`; production output comes from Vite, not `tsc` artifacts
- There is no routing, shared state layer, API client, or test setup yet; changes to UI behavior will likely start in `App.tsx`

### Backend

The backend follows the standard NestJS bootstrap pattern:

- `backend/src/main.ts` creates the Nest app from `AppModule` and listens on `process.env.PORT ?? 3000`
- `backend/src/app.module.ts` is the root module and currently wires a single controller/service pair
- `backend/src/app.controller.ts` exposes `GET /`
- `backend/src/app.service.ts` provides the response used by the controller

Testing is split by scope:

- `backend/src/*.spec.ts` for unit tests using the app source as Jest `rootDir`
- `backend/test/*.e2e-spec.ts` for end-to-end tests booting a real Nest application with Supertest

Important constraints from current config:

- The Nest CLI uses `src` as `sourceRoot` and clears `dist/` on build
- The backend TypeScript config uses decorators/metadata and NodeNext module resolution
- Backend linting currently runs ESLint with `--fix`, so it may modify files

## Working assumptions for future changes

- Treat `frontend/` and `backend/` as separate runnable apps with independent dependency management
- If a task mentions “the app” without clarification, verify whether it refers to the React frontend or the Nest backend
- For frontend changes, validate behavior in a browser with the Vite dev server; for backend changes, prefer unit or e2e coverage depending on whether HTTP behavior changed

## Language & Specification Requirements

- 所有由 superpowers 插件生成的测试规约 (Specs)、设计文档 (Plans) 以及代码注释必须完全使用【简体中文】。
- 编写测试用例 (Test Cases) 时，描述性的 `it("应该在用户登录失败时抛出错误", ...)` 或 `describe("购物车模块", ...)` 必须使用中文。
- 保持技术名词的行业通用翻译（例如：保留 Worktree, Token，但解释和结构描述用中文）。
