package com.deepknow.paper.domain.model;

import com.deepknow.paper.domain.model.enums.ProjectStatus;
import java.time.LocalDateTime;

public class PaperProject {
    private Long id;
    private Long userId;
    private String title;
    private String abstractText;
    private ProjectStatus status;
    private LocalDateTime createTime;

    public PaperProject() {}

    public PaperProject(Long id, Long userId, String title, String abstractText, ProjectStatus status, LocalDateTime createTime) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.abstractText = abstractText;
        this.status = status;
        this.createTime = createTime;
    }

    /**
     * 核心业务动作：确认选题（确立论文灵魂）
     */
    public void confirmTopic(String title, String overview) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("论文标题不能为空");
        }
        this.title = title;
        this.abstractText = overview;
        this.status = ProjectStatus.TOPIC_CONFIRMED;
    }

    /**
     * 检查是否可以开始 AI 生产流程（大纲、撰写等）
     */
    public boolean isSoulConfirmed() {
        return this.status == ProjectStatus.TOPIC_CONFIRMED 
            || this.status == ProjectStatus.OUTLINE_PROCESSING
            || this.status == ProjectStatus.WRITING
            || this.status == ProjectStatus.REFINING;
    }

    public static PaperProjectBuilder builder() {
        return new PaperProjectBuilder();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getAbstractText() { return abstractText; }
    public ProjectStatus getStatus() { return status; }
    public LocalDateTime getCreateTime() { return createTime; }

    public static class PaperProjectBuilder {
        private Long id;
        private Long userId;
        private String title;
        private String abstractText;
        private ProjectStatus status;
        private LocalDateTime createTime;

        PaperProjectBuilder() {}

        public PaperProjectBuilder id(Long id) { this.id = id; return this; }
        public PaperProjectBuilder userId(Long userId) { this.userId = userId; return this; }
        public PaperProjectBuilder title(String title) { this.title = title; return this; }
        public PaperProjectBuilder abstractText(String abstractText) { this.abstractText = abstractText; return this; }
        public PaperProjectBuilder status(ProjectStatus status) { this.status = status; return this; }
        public PaperProjectBuilder statusStr(String status) { this.status = ProjectStatus.fromString(status); return this; }
        public PaperProjectBuilder createTime(LocalDateTime createTime) { this.createTime = createTime; return this; }

        public PaperProject build() {
            return new PaperProject(id, userId, title, abstractText, status, createTime);
        }
    }
}
