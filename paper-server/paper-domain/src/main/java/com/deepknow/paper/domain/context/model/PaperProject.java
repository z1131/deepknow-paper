package com.deepknow.paper.domain.context.model;

import com.deepknow.paper.domain.context.model.enums.DocUsage;
import com.deepknow.paper.domain.context.model.enums.ProjectStatus;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 项目上下文聚合根
 */
public class PaperProject {
    private Long id;
    private Long userId;
    private String title;
    private String topicOverview; // 对应数据库 topic_overview
    private ProjectStatus status;
    private LocalDateTime createTime;
    
    // 关联的参考文档
    private List<ReferenceDoc> referenceDocs = new ArrayList<>();

    public PaperProject() {}

    public PaperProject(Long id, Long userId, String title, String topicOverview, ProjectStatus status, LocalDateTime createTime) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.topicOverview = topicOverview;
        this.status = status;
        this.createTime = createTime;
    }

    /**
     * 业务动作：标记为正在生成选题（用户已提交意图或文档）
     */
    public void markTopicGenerating() {
        if (this.status == ProjectStatus.INIT) {
            this.status = ProjectStatus.TOPIC_GENERATING;
        }
    }

    /**
     * 业务动作：确认选题
     */
    public void confirmTopic(String title, String overview) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("标题不能为空");
        }
        this.title = title;
        this.topicOverview = overview;
        this.status = ProjectStatus.TOPIC_CONFIRMED;
    }

    /**
     * 业务动作：添加参考文档
     */
    public void addReferenceDoc(String fileName, String fileUrl, String textUrl, DocUsage usage) {
        ReferenceDoc doc = new ReferenceDoc(null, this.id, fileName, fileUrl, textUrl, usage, LocalDateTime.now());
        this.referenceDocs.add(doc);
    }

    public static PaperProjectBuilder builder() {
        return new PaperProjectBuilder();
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getTopicOverview() { return topicOverview; }
    public ProjectStatus getStatus() { return status; }
    public LocalDateTime getCreateTime() { return createTime; }
    public List<ReferenceDoc> getReferenceDocs() { return referenceDocs; }

    public static class PaperProjectBuilder {
        private Long id;
        private Long userId;
        private String title;
        private String topicOverview;
        private ProjectStatus status;
        private LocalDateTime createTime;

        public PaperProjectBuilder id(Long id) { this.id = id; return this; }
        public PaperProjectBuilder userId(Long userId) { this.userId = userId; return this; }
        public PaperProjectBuilder title(String title) { this.title = title; return this; }
        public PaperProjectBuilder topicOverview(String topicOverview) { this.topicOverview = topicOverview; return this; }
        public PaperProjectBuilder status(ProjectStatus status) { this.status = status; return this; }
        public PaperProjectBuilder statusStr(String status) { this.status = ProjectStatus.fromString(status); return this; }
        public PaperProjectBuilder createTime(LocalDateTime createTime) { this.createTime = createTime; return this; }

        public PaperProject build() {
            return new PaperProject(id, userId, title, topicOverview, status, createTime);
        }
    }
}
