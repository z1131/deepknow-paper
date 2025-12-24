package com.deepknow.paper.infrastructure.repository.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.deepknow.paper.infrastructure.repository.po.PaperProjectPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaperProjectMapper extends BaseMapper<PaperProjectPO> {
}
