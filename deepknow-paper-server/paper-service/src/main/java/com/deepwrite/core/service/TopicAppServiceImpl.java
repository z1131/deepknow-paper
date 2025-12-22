package com.deepwrite.core.service;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.deepwrite.api.service.TopicAppService;
import com.deepwrite.common.model.Response;
import com.deepwrite.core.entity.Project;
import com.deepwrite.core.entity.TopicCandidate;
import com.deepwrite.core.mapper.ProjectMapper;
import com.deepwrite.core.mapper.TopicCandidateMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TopicAppServiceImpl implements TopicAppService {

    private static final Logger log = LoggerFactory.getLogger(TopicAppServiceImpl.class);

    private final ProjectMapper projectMapper;
    private final TopicCandidateMapper topicCandidateMapper;
    private final com.deepwrite.core.infrastructure.ai.agent.TopicGenerationAgent topicGenerationAgent;

    public TopicAppServiceImpl(ProjectMapper projectMapper, TopicCandidateMapper topicCandidateMapper, com.deepwrite.core.infrastructure.ai.agent.TopicGenerationAgent topicGenerationAgent) {
        this.projectMapper = projectMapper;
        this.topicCandidateMapper = topicCandidateMapper;
        this.topicGenerationAgent = topicGenerationAgent;
    }



    @Override
    @Transactional(rollbackFor = Exception.class)
    public Response<List<Object>> generateTopics(Long projectId, String initialIdea) {
        // 1. Validate Project
        Project project = projectMapper.selectById(projectId);
        if (project == null) {
            return Response.error("Project not found");
        }

        // 2. Call AI
        String jsonResult;
        try {
            jsonResult = topicGenerationAgent.generate(initialIdea);
        } catch (Exception e) {
            return Response.error("AI Generation Failed: " + e.getMessage());
        }

        // 3. Parse and Save
        JSONArray topics = JSONUtil.parseArray(jsonResult);
        List<Object> resultList = new ArrayList<>();

        // Clear existing candidates for this project (optional, or append? Requirement says "persist results". Let's append or just save new ones. For now, we save new ones.)
        // Actually, usually we might want to keep history, but for simplicity let's just add them.
        
        for (Object topicObj : topics) {
            TopicCandidate candidate = new TopicCandidate();
            candidate.setProjectId(projectId);
            candidate.setContent(JSONUtil.toJsonStr(topicObj));
            candidate.setRationale(JSONUtil.parseObj(topicObj).getStr("rationale"));
            candidate.setSelected(false);
            
            topicCandidateMapper.insert(candidate);
            resultList.add(topicObj);
        }

        // 4. Update Project Status
        if ("INIT".equals(project.getStatus())) {
            project.setStatus("TOPIC_GENERATED");
            projectMapper.updateById(project);
        }

        return Response.success(resultList);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Response<Boolean> confirmTopic(Long projectId, com.deepwrite.api.dto.ConfirmTopicRequest request) {
        // 1. Validate Project
        Project project = projectMapper.selectById(projectId);
        if (project == null) {
            return Response.error("Project not found");
        }

        // 2. Update Project
        project.setTitle(request.getTitle());
        project.setStatus("TOPIC_SELECTED");
        projectMapper.updateById(project);

        // 3. (Optional) Update Candidate Status
        if (request.getCandidateId() != null) {
            TopicCandidate candidate = topicCandidateMapper.selectById(request.getCandidateId());
            if (candidate != null && candidate.getProjectId().equals(projectId)) {
                candidate.setSelected(true);
                topicCandidateMapper.updateById(candidate);
            }
        }

        return Response.success(true);
    }
}
