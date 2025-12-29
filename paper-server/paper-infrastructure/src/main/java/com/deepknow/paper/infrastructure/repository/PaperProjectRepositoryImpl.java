package com.deepknow.paper.infrastructure.repository;

import com.deepknow.paper.domain.model.PaperProject;
import com.deepknow.paper.domain.repository.PaperProjectRepository;
import com.deepknow.paper.infrastructure.repository.mapper.PaperProjectMapper;
import com.deepknow.paper.infrastructure.repository.po.PaperProjectPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class PaperProjectRepositoryImpl implements PaperProjectRepository {

    @Autowired
    private PaperProjectMapper mapper;

    @Override
    public List<PaperProject> findByUserId(Long userId) {
        return mapper.selectByUserId(userId).stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public PaperProject save(PaperProject project) {
        PaperProjectPO po = toPO(project);
        if (po.getId() == null) {
            mapper.insert(po);
        } else {
            po.setUpdateTime(LocalDateTime.now());
            mapper.updateById(po);
        }
        // Return entity with ID populated (MyBatis sets generated key back into PO)
        return toEntity(po);
    }

    private PaperProjectPO toPO(PaperProject entity) {
        PaperProjectPO po = new PaperProjectPO();
        po.setId(entity.getId());
        po.setUserId(entity.getUserId());
        po.setTitle(entity.getTitle());
        po.setAbstractText(entity.getAbstractText());
        po.setStatus(entity.getStatus());
        po.setCreateTime(entity.getCreateTime());
        po.setUpdateTime(LocalDateTime.now());
        return po;
    }

    private PaperProject toEntity(PaperProjectPO po) {
        if (po == null) return null;
        return PaperProject.builder()
                .id(po.getId())
                .userId(po.getUserId())
                .title(po.getTitle())
                .abstractText(po.getAbstractText())
                .status(po.getStatus())
                .createTime(po.getCreateTime())
                .build();
    }
}
