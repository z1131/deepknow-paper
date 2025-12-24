package com.deepknow.paper.api;

import com.deepknow.paper.api.dto.ProjectDTO;
import java.util.List;

public interface PaperProjectService {
    /**
     * 获取用户的论文项目列表
     */
    List<ProjectDTO> listProjects(Long userId);
}
