## MODIFIED Requirements

### Requirement: 系统必须支持镜像打包验证
系统 MUST 能够在本地或 GitHub Actions 发布工作流中完成当前项目的镜像构建，以验证前后端运行时打包链路可用。

#### Scenario: 执行镜像构建
- **WHEN** 开发者在项目中执行约定的镜像打包流程
- **THEN** 系统必须能够成功构建所需镜像或给出明确失败原因

#### Scenario: CI 执行镜像构建
- **WHEN** GitHub Actions 发布工作流进入镜像打包阶段
- **THEN** 系统 MUST 成功构建前端和后端镜像归档，或让工作流以明确失败原因终止

### Requirement: 系统必须验证远程启动脚本
系统 MUST 验证 `bash ./scripts/start-remote.sh` 的执行链路，确保远程启动脚本与当前打包结果匹配，并能在 GitHub Actions 发布流程中作为远端启动入口使用。

#### Scenario: 执行远程启动脚本
- **WHEN** 开发者执行 `bash ./scripts/start-remote.sh`
- **THEN** 系统必须能够完成脚本校验、启动过程验证或输出明确的失败信息

#### Scenario: CI 远端执行启动脚本
- **WHEN** GitHub Actions 发布工作流上传部署包后通过 SSH 执行远端启动脚本
- **THEN** 系统 MUST 加载部署包中的镜像、启动 Docker Compose 服务并返回可用于判断发布成功或失败的退出状态

### Requirement: 系统必须验证远端服务状态
系统 MUST 在远端启动流程完成后验证 Docker Compose 服务状态，确保发布结果处于可运行状态。

#### Scenario: 远端服务启动成功
- **WHEN** 远端启动脚本完成镜像加载和 `docker compose up -d`
- **THEN** 系统 MUST 输出服务状态，并以成功退出状态表示发布验证通过

#### Scenario: 远端服务启动失败
- **WHEN** 任一必需服务未能启动或 Compose 命令返回失败
- **THEN** 系统 MUST 以失败退出状态终止，并输出可定位失败服务的日志或状态信息
