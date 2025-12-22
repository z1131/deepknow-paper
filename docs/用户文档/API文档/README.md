# API 文档

## 文档生成规则
- 所有API文档必须基于 业务功能 中各模块的 规格说明.md 自动生成
- 使用 OpenAPI 3.0 规范
- 包含完整的请求/响应示例

## 文档结构
```
API文档/
├── openapi.yaml          # 完整的API规范
├── modules/              # 各模块API文档
│   ├── module_a.md
│   └── module_b.md
└── examples/             # 使用示例
    ├── curl/
    └── javascript/
```

## 更新机制
文档会在以下时机自动更新:
1. 新功能模块创建时
2. API接口变更时
3. 每次构建时

---
文档生成时间: 2025-11-27T08:49:07.237Z
