package com.deepknow.paper.infrastructure.repository.po;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("paper_project")
public class PaperProjectPO {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String title;
    private String abstractText;
    private String status;
    
    @TableLogic
    private Integer isDeleted;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
