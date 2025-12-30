package com.deepknow.paper.domain.context.model;

import com.deepknow.paper.domain.context.model.enums.DocUsage;
import java.time.LocalDateTime;

public class ReferenceDoc {
    private Long id;
    private Long projectId;
    private String fileName;
    private String fileUrl;
    private String textUrl;
    private DocUsage usage;
    private LocalDateTime createTime;

    public ReferenceDoc() {}

    public ReferenceDoc(Long id, Long projectId, String fileName, String fileUrl, String textUrl, DocUsage usage, LocalDateTime createTime) {
        this.id = id;
        this.projectId = projectId;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.textUrl = textUrl;
        this.usage = usage;
        this.createTime = createTime;
    }

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public String getFileName() { return fileName; }
    public String getFileUrl() { return fileUrl; }
    public String getTextUrl() { return textUrl; }
    public DocUsage getUsage() { return usage; }
    public LocalDateTime getCreateTime() { return createTime; }
}
