package com.deepknow.paper.infrastructure.repository;

import com.deepknow.paper.domain.context.model.PaperProject;
import com.deepknow.paper.domain.context.model.ReferenceDoc;
import com.deepknow.paper.domain.context.repository.PaperProjectRepository;
import com.deepknow.paper.infrastructure.repository.mapper.PaperProjectMapper;
import com.deepknow.paper.infrastructure.repository.mapper.ReferenceDocMapper;
import com.deepknow.paper.infrastructure.repository.po.PaperProjectPO;
import com.deepknow.paper.infrastructure.repository.po.ReferenceDocPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class PaperProjectRepositoryImpl implements PaperProjectRepository {

    @Autowired
    private PaperProjectMapper projectMapper;
    
    @Autowired
    private ReferenceDocMapper referenceDocMapper;

    @Override
    public List<PaperProject> findByUserId(Long userId) {
        return projectMapper.selectByUserId(userId).stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public PaperProject findById(Long id) {
        PaperProjectPO po = projectMapper.selectById(id);
        return toEntity(po);
    }

    @Override
    @Transactional
    public PaperProject save(PaperProject project) {
        PaperProjectPO po = toPO(project);
        if (po.getId() == null) {
            projectMapper.insert(po);
        } else {
            po.setUpdateTime(LocalDateTime.now());
            projectMapper.updateById(po);
        }
        
        // 级联保存参考文档 (简单实现：仅插入新增的)
        project.getReferenceDocs().forEach(doc -> {
            if (doc.getId() == null) {
                referenceDocMapper.insert(toDocPO(doc, po.getId()));
            }
        });

        return toEntity(po);
    }

    private PaperProjectPO toPO(PaperProject entity) {
        PaperProjectPO po = new PaperProjectPO();
        po.setId(entity.getId());
        po.setUserId(entity.getUserId());
        po.setTitle(entity.getTitle());
        po.setTopicOverview(entity.getTopicOverview());
        po.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        po.setCreateTime(entity.getCreateTime());
        return po;
    }

    private PaperProject toEntity(PaperProjectPO po) {
        if (po == null) return null;
        return PaperProject.builder()
                .id(po.getId())
                .userId(po.getUserId())
                .title(po.getTitle())
                .topicOverview(po.getTopicOverview())
                .statusStr(po.getStatus())
                .createTime(po.getCreateTime())
                .build();
    }

    private ReferenceDocPO toDocPO(ReferenceDoc doc, Long projectId) {
        ReferenceDocPO po = new ReferenceDocPO();
        po.setProjectId(projectId);
        po.setFileName(doc.getFileName());
        po.setContent(doc.getContent());
        po.setCreateTime(doc.getCreateTime());
        return po;
    }
}