package com.deepwrite.api.dto;

import lombok.Data;

public class ConfirmTopicRequest {
    /**
     * The finalized title of the project.
     */
    private String title;

    /**
     * The rationale or description of the selected topic.
     */
    private String rationale;

    /**
     * Optional: The ID of the candidate if selected from generated list.
     */
    private Long candidateId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRationale() {
        return rationale;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }
}
