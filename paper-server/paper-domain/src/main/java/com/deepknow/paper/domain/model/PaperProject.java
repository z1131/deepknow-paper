package com.deepknow.paper.domain.model;

import java.time.LocalDateTime;

public class PaperProject {
    private Long id;
    private Long userId;
    private String title;
    private String abstractText;
    private String status;
    private LocalDateTime createTime;

    public PaperProject() {}

    public PaperProject(Long id, Long userId, String title, String abstractText, String status, LocalDateTime createTime) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.abstractText = abstractText;
        this.status = status;
        this.createTime = createTime;
    }

    public static PaperProjectBuilder builder() {
        return new PaperProjectBuilder();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getAbstractText() { return abstractText; }
    public String getStatus() { return status; }
    public LocalDateTime getCreateTime() { return createTime; }

    public static class PaperProjectBuilder {
        private Long id;
        private Long userId;
        private String title;
        private String abstractText;
        private String status;
        private LocalDateTime createTime;

        PaperProjectBuilder() {}

        public PaperProjectBuilder id(Long id) { this.id = id; return this; }
        public PaperProjectBuilder userId(Long userId) { this.userId = userId; return this; }
        public PaperProjectBuilder title(String title) { this.title = title; return this; }
        public PaperProjectBuilder abstractText(String abstractText) { this.abstractText = abstractText; return this; }
        public PaperProjectBuilder status(String status) { this.status = status; return this; }
        public PaperProjectBuilder createTime(LocalDateTime createTime) { this.createTime = createTime; return this; }

        public PaperProject build() {
            return new PaperProject(id, userId, title, abstractText, status, createTime);
        }
    }

    /**
     * 业务逻辑示例：检查项目是否可以编辑
     */
    public boolean canEdit() {
        return "DRAFT".equals(this.status);
    }
}
