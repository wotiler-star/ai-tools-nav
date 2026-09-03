package com.ainav.service;

import com.ainav.model.entity.AiComment;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface AiCommentService extends IService<AiComment> {

    /** 某目标的评论列表（顶级 + 回复，按时间升序） */
    List<AiComment> listByTarget(String targetType, Long targetId);
}
