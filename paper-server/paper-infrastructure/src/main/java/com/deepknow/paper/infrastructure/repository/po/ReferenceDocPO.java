package com.deepknow.paper.infrastructure.repository.po;

import java.time.LocalDateTime;

public class ReferenceDocPO {
    private Long id;
    private Long projectId;
    private String fileName;
    private String fileUrl;
    private String textUrl;
    private String usageType;
    private LocalDateTime createTime;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getTextUrl() { return textUrl; }
    public void setTextUrl(String textUrl) { this.textUrl = textUrl; }
    public String getUsageType() { return usageType; }
    public void setUsageType(String usageType) { this.usageType = usageType; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
}
