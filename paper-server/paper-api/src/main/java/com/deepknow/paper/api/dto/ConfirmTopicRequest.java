package com.deepknow.paper.api.dto;

import java.io.Serializable;

/**
 * 确认选题请求
 */
public class ConfirmTopicRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String title;
    private String overview;

    public ConfirmTopicRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }
}
