package com.deepknow.paper.domain.context.model.enums;

public enum DocUsage {
    /**
     * 选题辅助材料 (用于 analyze-doc)
     */
    TOPIC_SUPPORT,

    /**
     * 正文参考文献 (用于 RAG 检索)
     */
    REFERENCE_MATERIAL,
    
    /**
     * 系统生成的中间产物
     */
    GENERATED_CONTENT
}
