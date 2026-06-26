## Context

当前仓库包含前端 Vite/React 应用、后端 NestJS API、Dockerfile、根目录 `docker-compose.yml` 以及一组 CVM 发布脚本。现有发布流程由本地执行 `pnpm deploy:cvm` 驱动：本地构建前后端镜像，保存为 tar.gz，复制 `docker-compose.yml`、`.env` 和远端启动脚本，再通过 SSH/SCP 上传到远端服务器。

该流程的问题是发布结果受本机 Docker、pnpm、环境变量和网络状态影响，`.env` 明文进入本地部署包，且构建与发布记录不在统一的 CI/CD 审计链路中。目标方案是在 GitHub Actions 中完成正式发布，同时让现有脚本保留为本地调试工具。

## Goals / Non-Goals

**Goals:**
- 新增 GitHub Actions workflow，支持手动触发和主分支触发发布。
- 在 CI 中分别安装前端、后端依赖并执行构建/测试/关键校验。
- 在 CI 中构建前端和后端 Docker 镜像，生成可上传到远端服务器的部署包。
- 通过 GitHub Secrets/Variables 注入远端主机、SSH 凭据和运行时环境变量，避免打包本地 `.env`。
- 发布后在远端执行 Docker Compose 启动，并验证服务状态。
- 保留本地脚本入口，但让脚本支持 CI 非交互式调用。

**Non-Goals:**
- 不引入 Kubernetes、容器镜像仓库或多环境发布平台。
- 不改变前端、后端业务代码和对外 API。
- 不重构数据库 schema 或业务数据迁移流程。
- 不实现蓝绿发布、滚动发布或自动扩缩容。

## Decisions

1. **使用 GitHub Actions 直接构建并上传部署包，而不是先推送到镜像仓库。**
   - 理由：当前远端 Compose 文件使用本地镜像名 `frontend:latest`、`backend:latest`，现有运维路径也是 tar 包传输；沿用 tar 包可以降低迁移成本。
   - 替代方案：推送到 GHCR 或其他镜像仓库，再由远端 `docker compose pull`。该方案更标准，但需要新增 registry 权限、镜像命名和远端登录配置，本次不纳入。

2. **CI 生成 `.env`，不再从仓库或本地复制 `.env`。**
   - 理由：`.env` 包含数据库密码、模型 API Key 等敏感信息，不应依赖本地文件进入发布包。GitHub Secrets 是更适合的密钥来源。
   - 替代方案：远端长期维护 `.env`，CI 只上传镜像和 Compose 文件。该方案减少 CI 密钥数量，但发布结果不完全可复现，配置漂移风险更高。

3. **将发布 workflow 拆成校验、打包、上传部署三个阶段。**
   - 理由：校验失败应阻止发布；打包产物应在上传前完整验证；上传和远端启动失败需要明确定位。
   - 替代方案：单个 shell 步骤串联所有命令。实现更简单，但失败定位和后续维护较差。

4. **保留 `scripts/start-remote.sh` 作为远端启动入口。**
   - 理由：远端启动逻辑已经集中在该脚本中，GitHub Actions 只需上传并调用它，避免把 Docker 细节散落在 workflow YAML 中。
   - 替代方案：在 workflow 中内联所有远端命令。该方案少一个脚本，但会降低本地复用性和可测试性。

5. **部署验证以 Docker Compose 服务状态为最低保障。**
   - 理由：当前系统已有 Compose 编排和健康依赖，CI 可通过 `docker compose ps`/服务状态检查判断启动是否成功。
   - 替代方案：增加 HTTP smoke test。该方案更贴近用户视角，但需要稳定的公网域名或端口契约；可作为后续增强。

## Risks / Trade-offs

- GitHub Actions 无法访问远端服务器或 SSH 密钥配置错误 → workflow 在上传或远端执行阶段失败，并输出明确错误；文档化必需的 Secrets/Variables。
- CI 构建 tar 镜像会消耗较多时间和存储 → 仅在发布 workflow 中执行 Docker 构建，普通验证不生成发布包。
- 继续使用 tar 包而不是镜像仓库 → 迁移成本低，但产物分发效率和版本管理弱于 registry；后续可单独演进。
- 远端 `.env` 由 CI 每次生成 → 配置变更更可控，但需要在 GitHub 中维护完整环境变量列表。
- `latest` 镜像标签不利于版本追踪 → 本次保持兼容，同时可在部署包中记录 Git SHA，后续再引入不可变标签。

## Migration Plan

1. 新增 `.github/workflows/deploy.yml`，定义触发条件、依赖安装、构建校验、Docker 打包、部署包生成、上传和远端启动步骤。
2. 调整 `scripts/pack-cvm.mjs`，支持从环境变量生成部署包 `.env`，并在 CI 中避免读取本地 `.env`。
3. 调整 `scripts/transfer-cvm.mjs` 或 workflow 上传步骤，使其可使用 GitHub Actions 中的 SSH 私钥和远端路径。
4. 调整 `scripts/start-remote.sh`，确保重复执行安全，能加载镜像、启动 Compose 并返回失败状态。
5. 在 GitHub 仓库配置部署所需 Secrets/Variables。
6. 手动触发 workflow 进行首次发布验证。
7. 若发布失败，回滚方式为在远端保留上一版部署包或重新运行此前可用提交的 workflow；若需紧急恢复，可继续使用本地旧发布脚本。