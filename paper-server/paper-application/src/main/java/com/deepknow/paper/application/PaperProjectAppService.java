package com.deepknow.paper.application;

import com.deepknow.paper.api.dto.ProjectDTO;
import com.deepknow.paper.domain.model.PaperProject;
import com.deepknow.paper.domain.model.enums.ProjectStatus;
import com.deepknow.paper.domain.repository.PaperProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        // Simple mock/placeholder: Find all and filter (production should use repository.findById)
        return listUserProjects(userId).stream()
                .filter(p -> p.getId().equals(projectId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public ProjectDTO confirmTopic(Long projectId, Long userId, String title, String overview) {
        // 1. 加载领域对象 (这里先用简单的列表过滤，实际应增加 findById)
        List<PaperProject> projects = repository.findByUserId(userId);
        PaperProject project = projects.stream()
                .filter(p -> p.getId().equals(projectId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("项目不存在或无权操作"));

        // 2. 执行领域动作
        project.confirmTopic(title, overview);

        // 3. 持久化
        PaperProject saved = repository.save(project);
        return toDTO(saved);
    }

    private ProjectDTO toDTO(PaperProject entity) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setTitle(entity.getTitle());
        dto.setAbstractText(entity.getAbstractText());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        dto.setCreateTime(entity.getCreateTime());
        return dto;
    }
}
