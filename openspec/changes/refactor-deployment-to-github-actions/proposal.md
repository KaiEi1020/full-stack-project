## Why

当前发布流程依赖本地手动构建 Docker 镜像、打包 tar、复制 `.env` 并通过 SSH/SCP 上传到云服务器，过程可重复性和可审计性较弱，也容易受本机环境影响。将发布流程迁移到 GitHub Actions，可以把构建、校验、传输和远端启动统一到受版本控制的 CI/CD 工作流中，降低手动操作成本。

## What Changes

- 新增基于 GitHub Actions 的发布能力，在代码推送或手动触发时执行前后端构建校验、Docker 镜像构建、部署包生成与远端发布。
- 将现有 CVM 发布脚本调整为可被 CI 调用的非交互式流程，并避免在部署包中复制本地 `.env` 明文文件。
- 新增发布所需的 GitHub Secrets/Variables 契约，用于远端主机、SSH 用户、密钥、应用环境变量等敏感配置。
- 保留本地调试和手动发布入口，但以 GitHub Actions 作为正式发布路径。
- 新增部署验证步骤，发布后检查远端 Docker Compose 服务状态，失败时让工作流明确失败。

## Capabilities

### New Capabilities
- `github-actions-deployment`: 定义通过 GitHub Actions 自动构建并发布前后端 Docker Compose 应用到远端服务器的能力。

### Modified Capabilities
- `remote-runtime-validation`: 发布完成后的远端运行状态验证从手动检查扩展为 GitHub Actions 工作流内的自动验证。

## Impact

- 影响根目录发布脚本：`deploy-cvm.sh`、`scripts/pack-cvm.mjs`、`scripts/transfer-cvm.mjs`、`scripts/start-remote.sh`。
- 新增 GitHub Actions 配置：`.github/workflows/*.yml`。
- 影响远端运行文件：`docker-compose.yml` 与部署包内生成的环境配置。
- 需要在 GitHub 仓库配置部署相关 Secrets/Variables，例如远端主机、SSH 用户、SSH 私钥、应用环境变量。
- 不改变前端、后端对外 API；主要改变发布和运维流程。
