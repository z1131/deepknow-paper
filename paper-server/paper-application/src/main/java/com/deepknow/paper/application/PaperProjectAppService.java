package com.deepknow.paper.application;

import com.deepknow.paper.api.dto.ProjectDTO;
import com.deepknow.paper.domain.model.PaperProject;
import com.deepknow.paper.domain.repository.PaperProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
                .status("DRAFT")
                .build();
        
        PaperProject saved = repository.save(project);
        return toDTO(saved);
    }

    private ProjectDTO toDTO(PaperProject entity) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setTitle(entity.getTitle());
        dto.setAbstractText(entity.getAbstractText());
        dto.setStatus(entity.getStatus());
        dto.setCreateTime(entity.getCreateTime());
        return dto;
    }
}
