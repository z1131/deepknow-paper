package com.deepwrite.core.service;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.deepwrite.api.dto.ProjectDTO;
import com.deepwrite.api.service.ProjectAppService;
import com.deepwrite.common.model.Response;
import com.deepwrite.core.entity.Project;
import com.deepwrite.core.mapper.ProjectMapper;
import org.apache.dubbo.config.annotation.DubboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@DubboService
@Service
public class ProjectAppServiceImpl implements ProjectAppService {

    @Autowired
    private ProjectMapper projectMapper;

    @Override
    public Response<ProjectDTO> createProject(Long userId) {
        Project project = new Project();
        project.setUserId(userId);
        project.setStatus("INIT");
        project.setCreatedAt(java.time.LocalDateTime.now());
        project.setUpdatedAt(java.time.LocalDateTime.now());
        project.setDeleted(false);
        
        projectMapper.insert(project);
        
        ProjectDTO dto = new ProjectDTO();
        BeanUtil.copyProperties(project, dto);
        return Response.success(dto);
    }

    @Override
    public Response<ProjectDTO> getProject(Long id) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            // Use generic error code for now
            return Response.error(404, "Project not found");
        }
        ProjectDTO dto = new ProjectDTO();
        BeanUtil.copyProperties(project, dto);
        return Response.success(dto);
    }

    @Override
    public Response<List<ProjectDTO>> listProjectsByUser(Long userId) {
        QueryWrapper<Project> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        queryWrapper.orderByDesc("created_at");
        
        List<Project> projects = projectMapper.selectList(queryWrapper);
        List<ProjectDTO> dtos = projects.stream()
                .map(p -> {
                    ProjectDTO dto = new ProjectDTO();
                    BeanUtil.copyProperties(p, dto);
                    return dto;
                })
                .collect(Collectors.toList());
        
        return Response.success(dtos);
    }
}
