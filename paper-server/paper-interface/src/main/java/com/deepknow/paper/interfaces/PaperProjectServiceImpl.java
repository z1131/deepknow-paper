package com.deepknow.paper.interfaces;

import com.deepknow.paper.api.PaperProjectService;
import com.deepknow.paper.api.dto.ProjectDTO;
import com.deepknow.paper.application.PaperProjectAppService;
import org.apache.dubbo.config.annotation.DubboService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@DubboService
public class PaperProjectServiceImpl implements PaperProjectService {

    @Autowired
    private PaperProjectAppService appService;

    @Override
    public List<ProjectDTO> listProjects(Long userId) {
        return appService.listUserProjects(userId);
    }

    @Override
    public ProjectDTO createProject(Long userId) {
        return appService.createProject(userId);
    }

    @Override
    public ProjectDTO getProject(Long projectId, Long userId) {
        return appService.getProject(projectId, userId);
    }

    @Override
    public ProjectDTO confirmTopic(Long projectId, Long userId, String title, String overview) {
        return appService.confirmTopic(projectId, userId, title, overview);
    }

    @Override
    public ProjectDTO uploadReferenceDoc(Long projectId, Long userId, String fileName, String content) {
        return appService.uploadReferenceDoc(projectId, userId, fileName, content);
    }
}