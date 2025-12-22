# 案例 01: 2C4G 服务器下微服务 OOM 故障排查与 JVM 调优

## 1. 故障现象
在部署 DeepWrite 后端服务（Nacos + Gateway + Auth + Nginx）到一台 2C4G 的 ECS 服务器时，出现以下现象：
- **容器无限重启**: `docker ps -a` 显示 `dw-gateway` 和 `dw-auth` 的状态为 `Restarting` 或 `Exited`。
- **异常退出码**: `Exit Code 137` (OOM Killed) 或 `143` (SIGTERM)。
- **无应用日志**: `docker logs` 没有任何 Spring Boot 启动日志，只有底层 JVM 报错或无输出。

## 2. 问题分析

### 2.1 资源复盘
- **服务器配置**: 2 vCPU, 4GB RAM。
- **部署组件**:
  - Nacos Server (Java): 默认 JVM 堆配置较大。
  - Gateway (Java 21): Spring Boot 应用。
  - Auth (Java 21): Spring Boot 应用。
  - Nginx: 内存占用小。
  - OS 开销: 约 500MB - 1GB。

### 2.2 原因定位
**根本原因**: Java 容器没有进行内存限制。
1.  **Docker 层面**: `docker-compose.yml` 中未配置 `mem_limit`。
2.  **JVM 层面**: 默认情况下，JVM (特别是 Server 模式) 会根据宿主机总内存（4GB）来计算默认堆大小（通常是 1/4）。
3.  **结果**: 三个 Java 进程同时启动，都试图申请 1GB+ 的内存，瞬间耗尽物理内存。Linux 内核的 **OOM Killer** 介入，杀死了占用内存最快的进程（通常是正在启动的 Java 进程）。

## 3. 解决方案

采用 **"Docker 硬限制 + JVM 软限制"** 的双重保障策略。

### 3.1 Docker 资源限制 (`mem_limit`)
防止单个容器无限制占用内存，保护宿主机不被拖垮。

```yaml
dw-gateway:
  mem_limit: 512m  # 硬限制，超过即被 Kill
```

### 3.2 JVM 堆内存调整 (`-Xms -Xmx`)
让 JVM 感知到内存限制，主动进行 GC，而不是等到被 Docker 杀死。

```yaml
dw-gateway:
  environment:
    - JAVA_OPTS=-Xms256m -Xmx256m  # 堆内存限制在 256M
```

**注意**: `mem_limit` (512M) > `-Xmx` (256M)。这是因为 Java 进程除了堆内存 (Heap)，还需要非堆内存 (Metaspace, Thread Stacks, Direct Buffers) 和 JVM 自身开销。预留 50% 是比较安全的经验值。

### 3.3 最终配置 (ECS A)

| 服务 | Docker Limit | JVM Heap (`-Xmx`) |
| :--- | :--- | :--- |
| Nacos | 1GB | 512M |
| Gateway | 512M | 256M |
| Auth | 512M | 256M |
| **总计** | **2GB** | **1GB** |

这样即使所有服务跑满，也只占用 2GB 内存，留给 OS 和 Nginx 2GB 的 buffer，系统非常稳定。

## 4. 面试延伸点

- **Q: 为什么设置了 `mem_limit` 还需要设置 `-Xmx`?**
  - A: 如果只设 `mem_limit`，JVM 可能会根据宿主机内存算出一个很大的堆大小。当应用使用的堆内存接近 `mem_limit` 时，Docker 会直接杀掉容器，而不会触发 JVM 的 GC。只有设置了 `-Xmx` 小于 `mem_limit`，JVM 才会知道“内存不够了，该 GC 了”，从而避免 OOM。
- **Q: Java 10+ 的容器感知特性 (`UseContainerSupport`) 还需要手动设吗？**
  - A: 虽然新版 Java 能感知容器内存限制，但默认比例（1/4）在小内存机器（4G）上可能依然偏大（例如分配 1G 给一个微服务），或者偏小（分配不够）。手动设置 `-Xmx` 是最稳妥的生产实践。
