package com.deepknow.paper.infrastructure.repository.mapper;

import com.deepknow.paper.infrastructure.repository.po.ReferenceDocPO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ReferenceDocMapper {
    int insert(ReferenceDocPO po);
    List<ReferenceDocPO> selectByProjectId(Long projectId);
}
