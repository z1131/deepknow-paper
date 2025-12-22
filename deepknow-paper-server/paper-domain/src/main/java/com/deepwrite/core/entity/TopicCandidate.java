package com.deepwrite.core.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@TableName("topic_candidate")
public class TopicCandidate implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long projectId;
    private String content; // JSON string or plain text content
    private String rationale; // AI's reasoning
    private Boolean selected;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    // Manual Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }
    public Boolean getSelected() { return selected; }
    public void setSelected(Boolean selected) { this.selected = selected; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
