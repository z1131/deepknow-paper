CREATE TABLE IF NOT EXISTS topic_candidate (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    content TEXT COMMENT 'Topic content or analysis result',
    rationale TEXT COMMENT 'AI rationale or analysis details',
    selected TINYINT(1) DEFAULT 0 COMMENT 'Whether this topic is selected',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Topic candidates and analysis results';
