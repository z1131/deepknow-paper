package com.deepwrite.api.model.request;

import java.io.Serializable;

public class GenerateTopicRequest implements Serializable {
    private String major;
    private String direction;
    private String researchInterest;

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getResearchInterest() {
        return researchInterest;
    }

    public void setResearchInterest(String researchInterest) {
        this.researchInterest = researchInterest;
    }
}