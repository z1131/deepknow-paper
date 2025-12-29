package com.deepknow.paper.domain.context.model.enums;

public enum ProjectStatus {
    INIT,               // 初始状态
    TOPIC_GENERATING,   // 选题生成中
    TOPIC_CONFIRMED,    // 选题已确认 (灵魂确立)
    OUTLINE_PROCESSING, // 大纲处理中
    WRITING,            // 撰写中
    REFINING,           // 精修中
    COMPLETED;          // 已完成

    public static ProjectStatus fromString(String status) {
        if (status == null) return INIT;
        try {
            return ProjectStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return INIT;
        }
    }
}
