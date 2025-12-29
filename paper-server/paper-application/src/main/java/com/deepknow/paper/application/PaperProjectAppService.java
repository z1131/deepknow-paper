package com.deepknow.paper.application;

import com.deepknow.paper.api.dto.ProjectDTO;
import com.deepknow.paper.domain.context.model.PaperProject;
import com.deepknow.paper.domain.context.model.enums.ProjectStatus;
import com.deepknow.paper.domain.context.repository.PaperProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaperProjectAppService {

    @Autowired
    private PaperProjectRepository repository;

    public List<ProjectDTO> listUserProjects(Long userId) {
        List<PaperProject> projects = repository.findByUserId(userId);
        return projects.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO createProject(Long userId) {
        PaperProject project = PaperProject.builder()
                .userId(userId)
                .status(ProjectStatus.INIT)
                .createTime(LocalDateTime.now())
                .build();
        
        PaperProject saved = repository.save(project);
        return toDTO(saved);
    }

    public ProjectDTO getProject(Long projectId, Long userId) {
        PaperProject project = repository.findById(projectId);
        if (project == null || !project.getUserId().equals(userId)) {
            throw new RuntimeException("Project not found or unauthorized");
        }
        return toDTO(project);
    }

    public ProjectDTO confirmTopic(Long projectId, Long userId, String title, String overview) {
        PaperProject project = repository.findById(projectId);
        if (project == null || !project.getUserId().equals(userId)) {
            throw new RuntimeException("Project not found or unauthorized");
        }

        project.confirmTopic(title, overview);
        PaperProject saved = repository.save(project);
        return toDTO(saved);
    }

    @Transactional
    public ProjectDTO uploadReferenceDoc(Long projectId, Long userId, String fileName, String content) {
        PaperProject project = repository.findById(projectId);
        if (project == null || !project.getUserId().equals(userId)) {
            throw new RuntimeException("Project not found or unauthorized");
        }

        project.addReferenceDoc(fileName, content);
        PaperProject saved = repository.save(project);
        return toDTO(saved);
    }

    private ProjectDTO toDTO(PaperProject entity) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setTitle(entity.getTitle());
        dto.setTopicOverview(entity.getTopicOverview());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        dto.setCreateTime(entity.getCreateTime());
        return dto;
    }
}