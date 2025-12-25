package com.deepknow.paper.domain.repository;

import com.deepknow.paper.domain.model.PaperProject;
import java.util.List;

public interface PaperProjectRepository {
    List<PaperProject> findByUserId(Long userId);
    PaperProject save(PaperProject project);
}
