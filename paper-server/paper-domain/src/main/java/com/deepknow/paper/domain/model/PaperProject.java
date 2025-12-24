package com.deepknow.paper.domain.model;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class PaperProject {
    private Long id;
    private Long userId;
    private String title;
    private String abstractText;
    private String status;
    private LocalDateTime createTime;

    /**
     * 业务逻辑示例：检查项目是否可以编辑
     */
    public boolean canEdit() {
        return "DRAFT".equals(this.status);
    }
}
