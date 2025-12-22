# CI/CD 自动化部署流水线

## 1. 概述
本项目采用 GitHub Actions 实现 GitOps 自动化部署。
- **触发机制**: 代码推送到 `main` 分支时自动触发。
- **构建产物**: Docker 镜像 (存储于 GitHub Container Registry / GHCR)。
- **部署目标**: 阿里云 ECS 服务器 (通过 SSH + Docker Compose)。

## 2. 流水线阶段 (Pipeline Stages)

### Stage 1: Build & Push (构建)
1. **检出代码**: 拉取最新代码。
2. **环境准备**: 设置 JDK 11, Maven。
3. **后端编译**: 运行 `mvn clean package -DskipTests` 生成 Jar 包。
4. **镜像构建**:
   - 构建 `dw-gateway` 镜像 -> `ghcr.io/username/dw-gateway:latest`
   - 构建 `dw-auth` 镜像 -> `ghcr.io/username/dw-auth:latest`
   - 构建 `dw-core` 镜像 -> `ghcr.io/username/dw-core:latest`
5. **推送镜像**: 推送至 GHCR。

### Stage 2: Deploy (部署)
1. **连接服务器**: 通过 SSH 连接到阿里云 ECS。
2. **更新配置**: (可选) 更新 `docker-compose.yml`。
3. **拉取镜像**: `docker-compose pull`。
4. **重启服务**: `docker-compose up -d`。
5. **清理**: `docker image prune` 清理旧镜像。

## 3. 基础设施要求
- **服务器**: 安装 Docker, Docker Compose。
- **网络**: 开放 80 (Nginx), 443 (HTTPS), 8080 (Gateway)。
