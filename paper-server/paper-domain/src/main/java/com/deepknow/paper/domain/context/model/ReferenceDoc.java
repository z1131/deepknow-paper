package com.deepknow.paper.domain.context.model;

import java.time.LocalDateTime;

public class ReferenceDoc {
    private Long id;
    private Long projectId;
    private String fileName;
    private String content;
    private LocalDateTime createTime;

    public ReferenceDoc() {}

    public ReferenceDoc(Long id, Long projectId, String fileName, String content, LocalDateTime createTime) {
        this.id = id;
        this.projectId = projectId;
        this.fileName = fileName;
        this.content = content;
        this.createTime = createTime;
    }

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public String getFileName() { return fileName; }
    public String getContent() { return content; }
    public LocalDateTime getCreateTime() { return createTime; }
}
