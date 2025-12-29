package com.deepknow.paper.api.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

public class ProjectDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long userId;
    private String title;
    private String topicOverview;
    private String status; // Keep as String for API compatibility
    private LocalDateTime createTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTopicOverview() { return topicOverview; }
    public void setTopicOverview(String topicOverview) { this.topicOverview = topicOverview; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
}
