package com.deepknow.paper.api;

import com.deepknow.paper.api.dto.ProjectDTO;
import java.util.List;

public interface PaperProjectService {
    List<ProjectDTO> listProjects(Long userId);
    ProjectDTO createProject(Long userId);
    ProjectDTO getProject(Long projectId, Long userId);
    ProjectDTO updateIntent(Long projectId, Long userId, String intentDescription);
    ProjectDTO confirmTopic(Long projectId, Long userId, String title, String overview);
    ProjectDTO uploadReferenceDoc(Long projectId, Long userId, String fileName, byte[] fileBytes, String textContent);
}
