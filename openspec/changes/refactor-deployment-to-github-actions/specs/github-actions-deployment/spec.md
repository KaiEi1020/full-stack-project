## ADDED Requirements

### Requirement: GitHub Actions 发布工作流
系统 SHALL 提供 GitHub Actions 发布工作流，用于构建、打包并发布前端和后端 Docker Compose 应用到远端服务器。

#### Scenario: 手动触发发布
- **WHEN** 维护者在 GitHub Actions 中手动触发发布工作流
- **THEN** 系统 MUST 执行构建校验、Docker 镜像打包、部署包上传和远端启动流程

#### Scenario: 主分支触发发布
- **WHEN** 代码变更合并或推送到约定的发布分支
- **THEN** 系统 MUST 按工作流配置自动执行发布流程或进入可审计的发布任务

### Requirement: 发布前质量校验
系统 SHALL 在执行远端发布前完成前端和后端的必要质量校验。

#### Scenario: 前端构建失败
- **WHEN** 前端依赖安装或生产构建失败
- **THEN** 发布工作流 MUST 失败并且 MUST NOT 上传或启动远端部署包

#### Scenario: 后端校验失败
- **WHEN** 后端构建、测试或关键校验失败
- **THEN** 发布工作流 MUST 失败并且 MUST NOT 上传或启动远端部署包

### Requirement: CI 生成部署包
系统 SHALL 在 GitHub Actions 运行环境中生成远端部署所需的完整部署包。

#### Scenario: 生成 Docker 镜像归档
- **WHEN** 发布工作流进入打包阶段
- **THEN** 系统 MUST 构建前端和后端 Docker 镜像，并生成远端可加载的镜像归档文件

#### Scenario: 生成部署运行文件
- **WHEN** 发布工作流生成部署包
- **THEN** 部署包 MUST 包含 `docker-compose.yml`、远端启动脚本和由 GitHub Secrets/Variables 生成的运行时环境配置

### Requirement: 密钥和环境变量管理
系统 SHALL 使用 GitHub Secrets/Variables 管理发布所需敏感信息和环境配置，不得依赖本地 `.env` 明文文件。

#### Scenario: 缺少必需发布密钥
- **WHEN** 发布工作流运行时缺少远端主机、SSH 用户、SSH 私钥或应用必需环境变量
- **THEN** 系统 MUST 在发布前失败并输出明确的缺失配置原因

#### Scenario: 生成运行时配置
- **WHEN** 发布工作流创建部署包
- **THEN** 系统 MUST 从 GitHub Secrets/Variables 写入远端运行所需配置，并且 MUST NOT 从开发者本地复制 `.env`

### Requirement: 远端非交互式发布
系统 SHALL 通过非交互式 SSH/SCP 或等价安全传输方式将部署包发布到远端服务器。

#### Scenario: 上传部署包
- **WHEN** 发布工作流完成部署包生成
- **THEN** 系统 MUST 将部署包上传到约定的远端目录，并确保远端启动脚本具备执行权限

#### Scenario: 远端发布失败
- **WHEN** SSH 连接、文件上传或远端命令执行失败
- **THEN** 发布工作流 MUST 失败并保留足够日志用于定位失败阶段
