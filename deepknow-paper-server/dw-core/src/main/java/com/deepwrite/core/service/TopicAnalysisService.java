package com.deepwrite.core.service;

import cn.hutool.json.JSONUtil;
import com.deepwrite.common.model.Response;
import com.deepwrite.core.entity.TopicCandidate;
import com.deepwrite.core.infrastructure.oss.OssClient;
import com.deepwrite.core.mapper.TopicCandidateMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service

public class TopicAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(TopicAnalysisService.class);

    private final OssClient ossClient;
    private final FileService fileService;
    private final com.deepwrite.core.infrastructure.ai.agent.TopicAnalysisAgent topicAnalysisAgent;
    private final TopicCandidateMapper topicCandidateMapper;

    public TopicAnalysisService(OssClient ossClient, FileService fileService, com.deepwrite.core.infrastructure.ai.agent.TopicAnalysisAgent topicAnalysisAgent, TopicCandidateMapper topicCandidateMapper) {
        this.ossClient = ossClient;
        this.fileService = fileService;
        this.topicAnalysisAgent = topicAnalysisAgent;
        this.topicCandidateMapper = topicCandidateMapper;
    }

    @Transactional(rollbackFor = Exception.class)
    public Response<Object> analyzeTopic(Long projectId, MultipartFile file, String topicTitle) {
        try {
            // 1. Upload file to OSS
            String fileUrl = ossClient.uploadFile(file);
            log.info("File uploaded to OSS: {}", fileUrl);

            // 2. Extract text from file
            String fileContent = fileService.extractText(file);
            if (fileContent == null || fileContent.isEmpty()) {
                return Response.error("Could not extract text from file");
            }
            // Truncate content if too long (DeepSeek context limit)
            if (fileContent.length() > 10000) {
                fileContent = fileContent.substring(0, 10000) + "...";
            }

            // 3. Call AI for analysis
            String analysisResult = topicAnalysisAgent.analyze(topicTitle, fileContent);

            // 4. Save result as a candidate (or just return it?)
            // Requirement says "Analyze Existing Documents". Usually this leads to a "Topic Candidate" with the analysis.
            // Let's save it.
            TopicCandidate candidate = new TopicCandidate();
            candidate.setProjectId(projectId);
            candidate.setContent(analysisResult); // The analysis JSON
            candidate.setRationale("Analysis of uploaded file: " + file.getOriginalFilename());
            candidate.setSelected(false);
            
            // We might want to store the file URL somewhere, but TopicCandidate doesn't have a field for it.
            // For now, maybe put it in the rationale or content?
            // Let's wrap the content.
            // Actually, the AI returns a JSON. We can add the fileUrl to it?
            // Or just return the result to frontend and let frontend decide?
            // The prompt returns: feasibility, innovation, suggestions, refined_topic.
            
            topicCandidateMapper.insert(candidate);

            return Response.success(JSONUtil.parseObj(analysisResult));

        } catch (IOException e) {
            log.error("File processing failed", e);
            return Response.error("File processing failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Topic analysis failed", e);
            return Response.error("Topic analysis failed: " + e.getMessage());
        }
    }
}
