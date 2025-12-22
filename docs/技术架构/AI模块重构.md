# AI 模块重构方案

## 1. 背景与问题
当前项目中的 AI 调用逻辑存在以下问题：
1.  **逻辑割裂**：`generateTopics` 和 `analyzeTopic` 是两个完全独立的接口，各自维护一套 Prompt 构建、API 调用和结果解析逻辑。
2.  **代码冗余**：`DeepSeekClient` 中存在大量重复的 HTTP 请求构建和错误处理代码。
3.  **缺乏统一管控**：Prompt 分散在不同类中，缺乏统一的版本管理和语言控制（导致了中英文输出不一致的问题）。
4.  **扩展性差**：如果未来需要切换模型（如从 DeepSeek 切换到 GPT-4）或增加新的 AI 功能（如全文润色），需要重复编写大量样板代码。

## 2. 重构目标
建立一个统一、可复用、易扩展的 AI 基础设施层（AI Infrastructure Layer），实现：
1.  **统一的 Client**：只负责底层的 HTTP 通信和协议适配（OpenAI 兼容协议）。
2.  **Agent 抽象**：引入 `Agent` 概念，封装具体的业务场景（如“选题助手”、“评审专家”）。
3.  **Prompt 管理**：统一管理 Prompt 模板，支持多语言配置。
4.  **结构化输出**：统一处理 JSON 解析和容错。

## 3. 架构设计

### 3.1 核心组件

#### `LLMClient` (通用客户端)
- 职责：负责与大模型 API 进行 HTTP 通信。
- 方法：`chat(ChatRequest request): ChatResponse`
- 特性：处理鉴权、重试、超时、日志记录。

#### `AIAgent` (抽象基类)
- 职责：定义 Agent 的标准行为。
- 属性：`systemPrompt`, `modelConfig` (temperature, maxTokens)。
- 方法：`call(String userBuffer): T` (泛型返回业务对象)。

#### `PromptManager` (Prompt 管理)
- 职责：管理系统提示词和用户提示词模板。
- 特性：支持变量替换，支持语言设置（强制中文）。

### 3.2 业务实现

#### `TopicAgent` (选题助手)
- 继承自 `AIAgent`。
- 场景：生成选题、分析选题。
- 内部逻辑：根据不同的 `Instruction` (GENERATE | ANALYZE) 组装不同的 Prompt。

## 4. 实施步骤

1.  **提取通用 Client**：将 `DeepSeekClient` 重构为通用的 `OpenAIClient` 或保留原名但剥离业务逻辑。
2.  **定义 Prompt 模板**：将分散的 Java 字符串 Prompt 迁移到配置文件或专门的枚举/类中管理。
3.  **实现 Agent 模式**：创建 `TopicAgent` 类，统一处理选题相关的 AI 请求。
4.  **迁移业务逻辑**：修改 `TopicAppServiceImpl` 和 `TopicAnalysisService`，使其调用 `TopicAgent` 而不是直接调用 Client。

## 5. 预期收益
- **一致性**：所有 Agent 默认继承“输出中文”的系统设定，避免语言不一致。
- **复用性**：新增 AI 功能只需关注 Prompt 本身，无需关心底层调用。
- **可维护性**：Prompt 和代码分离，便于调优。
