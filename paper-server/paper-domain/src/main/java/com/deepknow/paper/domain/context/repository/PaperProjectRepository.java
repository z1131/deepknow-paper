package com.deepknow.paper.domain.context.repository;

import com.deepknow.paper.domain.context.model.PaperProject;
import java.util.List;

public interface PaperProjectRepository {
    List<PaperProject> findByUserId(Long userId);
    PaperProject findById(Long id);
    PaperProject save(PaperProject project);
}
