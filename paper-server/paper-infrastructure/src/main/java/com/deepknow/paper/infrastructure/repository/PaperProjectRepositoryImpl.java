package com.deepknow.paper.infrastructure.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.deepknow.paper.domain.model.PaperProject;
import com.deepknow.paper.domain.repository.PaperProjectRepository;
import com.deepknow.paper.infrastructure.repository.mapper.PaperProjectMapper;
import com.deepknow.paper.infrastructure.repository.po.PaperProjectPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class PaperProjectRepositoryImpl implements PaperProjectRepository {

    @Autowired
    private PaperProjectMapper mapper;

    @Override
    public List<PaperProject> findByUserId(Long userId) {
        LambdaQueryWrapper<PaperProjectPO> query = new LambdaQueryWrapper<>();
        query.eq(PaperProjectPO::getUserId, userId)
             .orderByDesc(PaperProjectPO::getCreateTime);
             
        return mapper.selectList(query).stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public PaperProject save(PaperProject project) {
        PaperProjectPO po = toPO(project);
        if (po.getId() == null) {
            mapper.insert(po);
        } else {
            mapper.updateById(po);
        }
        // Return entity with ID populated
        return toEntity(po);
    }

    private PaperProjectPO toPO(PaperProject entity) {
        PaperProjectPO po = new PaperProjectPO();
        po.setId(entity.getId());
        po.setUserId(entity.getUserId());
        po.setTitle(entity.getTitle());
        po.setAbstractText(entity.getAbstractText());
        po.setStatus(entity.getStatus());
        return po;
    }

    private PaperProject toEntity(PaperProjectPO po) {
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
