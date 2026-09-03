package com.ainav.service.impl;

import com.ainav.mapper.AiCommentMapper;
import com.ainav.model.entity.AiComment;
import com.ainav.service.AiCommentService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiCommentServiceImpl extends ServiceImpl<AiCommentMapper, AiComment>
        implements AiCommentService {

    @Override
    public List<AiComment> listByTarget(String targetType, Long targetId) {
        LambdaQueryWrapper<AiComment> qw = new LambdaQueryWrapper<>();
        qw.eq(AiComment::getStatus, 1);
        if (targetType != null && !targetType.isBlank()) {
            qw.eq(AiComment::getTargetType, targetType);
        }
        if (targetId != null) {
            qw.eq(AiComment::getTargetId, targetId);
        }
        qw.orderByAsc(AiComment::getCreateTime);
        return list(qw);
    }
}
