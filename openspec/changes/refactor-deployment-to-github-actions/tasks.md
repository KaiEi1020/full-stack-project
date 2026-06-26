## 1. 创建 GitHub Actions 发布工作流

- [ ] 1.1 在仓库根目录创建 `.github/workflows/deploy.yml`，定义 `workflow_dispatch` 和 `push` 触发条件
- [ ] 1.2 在工作流中定义前端和后端校验阶段（依赖安装、构建、测试）
- [ ] 1.3 在工作流中定义 Docker 镜像构建阶段，生成 `frontend.tar.gz` 和 `backend.tar.gz`
- [ ] 1.4 在工作流中定义部署包生成阶段，包含 `docker-compose.yml`、远端启动脚本和由 GitHub Secrets/Variables 生成的 `.env`
- [ ] 1.5 在工作流中定义 SSH 上传和远端启动阶段，使用 GitHub Secrets 注入 SSH 凭据
- [ ] 1.6 在工作流中定义部署验证阶段，远端执行 `docker compose ps` 并检查服务状态

## 2. 调整本地发布脚本以支持 CI 调用

- [ ] 2.1 调整 `scripts/pack-cvm.mjs`，支持在 CI 中从环境变量生成部署包 `.env`，避免读取本地 `.env`
- [ ] 2.2 调整 `scripts/start-remote.sh`，确保重复执行安全，能加载镜像、启动 Compose 并返回失败状态
- [ ] 2.3 验证 `scripts/transfer-cvm.mjs` 或 workflow 上传步骤，确保支持非交互式 SSH 密钥和远端路径配置
- [ ] 2.4 验证 `deploy-cvm.sh` 本地入口仍可用，且与 CI 流程不冲突

## 3. 配置 GitHub Secrets/Variables

- [ ] 3.1 在仓库 Settings > Secrets and variables > Actions 中配置远端主机地址（`DEPLOY_HOST`）
- [ ] 3.2 配置远端 SSH 用户名（`DEPLOY_USER`）和 SSH 私钥（`DEPLOY_SSH_KEY`）
- [ ] 3.3 配置应用运行时环境变量：数据库用户名、密码、数据库名、模型 API Key 等
- [ ] 3.4 验证所有必需 Secrets/Variables 在 workflow 中缺失时能够明确报错

## 4. 验证与文档

- [ ] 4.1 手动触发 workflow 进行首次发布验证，确认远端服务正常启动
- [ ] 4.2 在 `CLAUDE.md` 或 README 中补充 GitHub Actions 发布流程说明和必需 Secrets/Variables 清单
- [ ] 4.3 验证回滚路径：本地 `deploy-cvm.sh` 仍可作为紧急发布备选方案
- [ ] 4.4 确认发布日志和状态可在 GitHub Actions 运行记录中完整审计
