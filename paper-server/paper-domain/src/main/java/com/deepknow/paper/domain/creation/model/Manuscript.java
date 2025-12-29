package com.deepknow.paper.domain.creation.model;

/**
 * 创作核心域：稿件聚合根 (目前先搭个架子)
 */
public class Manuscript {
    private Long id;
    private Long projectId;
    private String content;

    public Manuscript() {}

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public String getContent() { return content; }
}
