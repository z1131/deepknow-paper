# API 定义 - Project Management

## 1. 创建项目 (Initialize Project)

*   **URL**: `/api/core/v1/projects`
*   **Method**: `POST`
*   **Description**: 用户点击“开始写作”时调用，创建一个状态为 `INIT` 的空项目。
*   **Request Header**: `X-User-Id` (暂时模拟，后续由 Gateway 解析 Token 注入)
*   **Request Body**: (Empty)
*   **Response**:
    ```json
    {
        "code": 200,
        "data": {
            "id": "123456789",
            "userId": "1001",
            "status": "INIT",
            "title": null,
            "createdAt": "2025-12-01 12:00:00"
        }
    }
    ```

## 2. 获取项目详情 (Get Project)

*   **URL**: `/api/core/v1/projects/{id}`
*   **Method**: `GET`
*   **Description**: 根据 ID 获取项目的最新状态。前端页面刷新或路由跳转时调用，用于恢复现场。
*   **Response**:
    ```json
    {
        "code": 200,
        "data": {
            "id": "123456789",
            "userId": "1001",
            "status": "TOPIC_GENERATED",
            "title": null,
            // 注意：这里不返回候选题目列表，那个由单独接口返回，保持轻量
            "createdAt": "..."
        }
    }
    ```
