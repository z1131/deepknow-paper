# DeepKnow Paper 后端重构方案 (DDD 多模块版)

## 1. 背景与目标

为了融入统一的 DeepKnow 通用智能体体系，并提升代码的可维护性与扩展性，DeepKnow Paper 后端将采用**轻量级 DDD（领域驱动设计）**分层架构进行重构。
项目将保持为 **Maven 多模块**结构，去除旧的微服务组件（Auth, Gateway），并将核心业务逻辑拆分为职责清晰的层级模块。

## 2. 模块结构设计

`deepknow-paper-server` 将作为父工程，包含以下 5 个子模块：

| 模块名 (`artifactId`) | 层级 | 职责描述 | 包含内容 (来源) | 依赖关系 |
| :--- | :--- | :--- | :--- | :--- |
| **paper-domain** | 领域层 | 业务核心，纯净的业务逻辑 | - 实体 (Entity/Aggregate)<br>- 值对象 (VO)<br>- 领域服务接口/实现<br>- 仓储接口 (Repository Interface)<br>*(原 `dw-core/domain`, `dw-core/.../service` 部分)* | 无 |
| **paper-repo** | 仓储层 | 数据持久化实现 | - MyBatis Mapper 接口<br>- Mapper XML<br>- DO (Data Objects)<br>- 仓储实现类<br>*(原 `dw-core/mapper`)* | `paper-domain`, MySQL, MyBatis |
| **paper-infra** | 基础设施层 | 通用技术支撑与第三方服务 | - 工具类 (Utils)<br>- 第三方客户端 (OSS, AI Client)<br>- 配置 (Config)<br>*(原 `dw-common`, `dw-core/infrastructure`)* | `paper-domain` |
| **paper-service** | 应用层 | 业务编排与用例实现 | - 应用服务接口 (AppService)<br>- 应用服务实现 (AppServiceImpl)<br>- DTO (Data Transfer Objects)<br>*(原 `dw-api/service`, `dw-core/.../service`, `dw-api/dto`)* | `paper-domain`, `paper-repo`, `paper-infra` |
| **paper-api** | 接口层 | 外部交互入口 | - Controller<br>- 全局异常处理<br>- 启动类 (`Application`)<br>*(原 `dw-core/controller`, `dw-api/model`)* | `paper-service` |

**依赖链示意:**
`api` -> `service` -> `domain` (核心)
`service` -> `repo` (持久化)
`service` -> `infra` (基础能力)
`repo` -> `domain`
`infra` -> `domain`

## 3. 详细执行步骤

### 3.1 模块初始化
1.  清理 `deepknow-paper-server` 下的旧模块目录 (`dw-auth`, `dw-gateway`, `dw-common`, `dw-api`, `dw-core`)。
2.  创建 5 个新模块目录：
    - `deepknow-paper-api`
    - `deepknow-paper-service`
    - `deepknow-paper-domain`
    - `deepknow-paper-repo`
    - `deepknow-paper-infra`
3.  配置父工程 `pom.xml`，定义 `<modules>` 和 `<dependencyManagement>`。
4.  为每个子模块创建 `pom.xml`，配置相应的依赖关系。

### 3.2 代码迁移与拆分
*注：在迁移过程中，将调整包名以匹配模块结构（建议统一前缀 `com.deepwrite.paper` 或保持 `com.deepwrite.core` 但逻辑分包）。以下按**原包名** -> **新模块**映射：*

1.  **Domain (paper-domain)**
    - `dw-core/src/.../domain/**` -> `deepknow-paper-domain`
    - `dw-core/src/.../service/TopicAnalysisService.java` (若是领域逻辑) -> `deepknow-paper-domain`

2.  **Infrastructure (paper-infra)**
    - `dw-common/src/.../common/**` -> `deepknow-paper-infra`
    - `dw-core/src/.../infrastructure/**` -> `deepknow-paper-infra`

3.  **Repository (paper-repo)**
    - `dw-core/src/.../mapper/**` -> `deepknow-paper-repo`
    - `dw-core/src/main/resources/mapper/**` (XML) -> `deepknow-paper-repo/src/main/resources/mapper`

4.  **Application (paper-service)**
    - `dw-api/src/.../service/**` (接口) -> `deepknow-paper-service`
    - `dw-api/src/.../dto/**` -> `deepknow-paper-service`
    - `dw-core/src/.../service/*AppServiceImpl.java` -> `deepknow-paper-service`
    - `dw-core/src/.../service/FileService.java` -> `deepknow-paper-service`

5.  **Interface (paper-api)**
    - `dw-core/src/.../controller/**` -> `deepknow-paper-api`
    - `dw-api/src/.../model/**` (Web VO) -> `deepknow-paper-api`
    - `dw-core/src/.../DwCoreApplication.java` -> `deepknow-paper-api/src/.../PaperApplication.java`
    - `dw-core/src/main/resources/application.yml` -> `deepknow-paper-api/src/main/resources`

### 3.3 构建与验证
1.  **Maven 构建**: 在根目录执行 `mvn clean install`，解决可能出现的循环依赖或包引用错误。
2.  **启动验证**: 运行 `paper-api` 模块中的启动类，验证服务能否正常启动。

## 4. 部署调整

1.  **Dockerfile**: 更新以基于 `deepknow-paper-api` 模块构建镜像（因为它是包含启动类的入口模块）。
2.  **Docker Compose**: 更新 `docker-compose.prod.yml`，指向新的 Dockerfile 路径。
