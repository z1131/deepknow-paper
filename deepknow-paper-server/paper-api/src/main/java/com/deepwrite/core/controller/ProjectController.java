package com.deepwrite.core.controller;

import com.deepwrite.api.dto.ProjectDTO;
import com.deepwrite.api.service.ProjectAppService;
import com.deepwrite.common.model.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/projects")
public class ProjectController {

    @Autowired
    private ProjectAppService projectAppService;

    @PostMapping
    public Response<ProjectDTO> createProject() {
        // TODO: Get userId from token. For now, hardcode to 1001.
        Long userId = 1001L;
        return projectAppService.createProject(userId);
    }

    @GetMapping("/{id}")
    public Response<ProjectDTO> getProject(@PathVariable Long id) {
        return projectAppService.getProject(id);
    }

    @GetMapping
    public Response<List<ProjectDTO>> listProjects(@RequestParam(required = false) Long userId) {
        // Default to user 1001 if no userId provided
        if (userId == null) userId = 1001L;
        return projectAppService.listProjectsByUser(userId);
    }
}
