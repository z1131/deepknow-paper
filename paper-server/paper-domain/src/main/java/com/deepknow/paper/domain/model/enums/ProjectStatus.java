package com.deepknow.paper.domain.model.enums;

/**
 * 论文项目状态枚举 - 映射业务生命周期
 */
public enum ProjectStatus {
    /**
     * 已创建，初始状态（进行需求输入或意向探索）
     */
    INIT,

    /**
     * AI 正在生成候选题目中（人机博弈探索期）
     */
    TOPIC_GENERATING,

    /**
     * 选题已确认 (核心里程碑：灵魂已确立)
     * 此状态下后续 AI 流程（大纲等）才可开启
     */
    TOPIC_CONFIRMED,

    /**
     * 大纲生成/编辑中
     */
    OUTLINE_PROCESSING,

    /**
     * 正文撰写中
     */
    WRITING,

    /**
     * 精修中
     */
    REFINING,

    /**
     * 已完成
     */
    COMPLETED;

    public static ProjectStatus fromString(String status) {
        if (status == null) return INIT;
        try {
            return ProjectStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return INIT;
        }
    }
}
