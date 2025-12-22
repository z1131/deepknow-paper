package com.deepwrite.api.service;

import com.deepwrite.common.model.Response;
import java.util.List;

public interface TopicAppService {
    /**
     * Generate topic candidates based on initial idea.
     * @param projectId The project ID.
     * @param initialIdea The user's initial vague idea.
     * @return List of generated topics (JSON objects).
     */
    Response<List<Object>> generateTopics(Long projectId, String initialIdea);

    /**
     * Confirm the selected topic and update project status.
     * @param projectId The project ID.
     * @param request The confirmation request details.
     * @return Boolean indicating success.
     */
    Response<Boolean> confirmTopic(Long projectId, com.deepwrite.api.dto.ConfirmTopicRequest request);
}
