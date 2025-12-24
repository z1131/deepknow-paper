package com.deepknow.paper.api.dto;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class ProjectDTO implements Serializable {
    private Long id;
    private Long userId;
    private String title;
    private String abstractText;
    private String status;
    private LocalDateTime createTime;
}
