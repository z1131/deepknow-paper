# 阿里云容器镜像服务 (ACR) 配置

本文件记录了 DeepWrite 项目使用的阿里云容器镜像服务相关配置。

## 1. ACR 实例与命名空间

-   **Registry 地址**: `crpi-16uyo5eg9cykcl2r.cn-hangzhou.personal.cr.aliyuncs.com` (这是你的个人版实例地址)
-   **命名空间 (Namespace)**: `deepwrite`

## 2. 镜像仓库列表 (在 `deepwrite` 命名空间下)

-   `dw-gateway`
-   `dw-auth`
-   `dw-core`

## 3. 登录凭证

-   **登录用户名**: `aliyun6883918707`
-   **登录密码**: **[请在 GitHub Secrets 中配置，切勿明文记录]**

---
**重要提示**:
-   **密码安全**: 登录密码是敏感信息。请务必在阿里云 ACR 控制台修改你的密码，并仅在 GitHub Secrets 中配置新密码，切勿明文记录或通过任何不安全渠道传递。
-   **仓库类型**: 镜像仓库创建时请选择“本地仓库”模式，不要绑定代码源。
-   **权限**: 确保 `aliyun6883918707` 拥有向 `deepwrite` 命名空间推送镜像的权限。
