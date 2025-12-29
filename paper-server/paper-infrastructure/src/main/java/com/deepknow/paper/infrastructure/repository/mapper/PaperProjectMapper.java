package com.deepknow.paper.infrastructure.repository.mapper;

import com.deepknow.paper.infrastructure.repository.po.PaperProjectPO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface PaperProjectMapper {
    int insert(PaperProjectPO po);
    int updateById(PaperProjectPO po);
    PaperProjectPO selectById(Long id);
    List<PaperProjectPO> selectByUserId(Long userId);
}