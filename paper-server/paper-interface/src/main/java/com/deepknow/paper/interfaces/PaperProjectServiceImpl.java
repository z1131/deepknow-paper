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
}
