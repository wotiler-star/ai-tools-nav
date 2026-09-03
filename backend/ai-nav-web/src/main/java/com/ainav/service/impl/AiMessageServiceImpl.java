package com.ainav.service.impl;

import com.ainav.common.PageResult;
import com.ainav.mapper.AiMessageMapper;
import com.ainav.model.entity.AiMessage;
import com.ainav.service.AiMessageService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiMessageServiceImpl extends ServiceImpl<AiMessageMapper, AiMessage> implements AiMessageService {

    @Override
    public PageResult<AiMessage> listMyMessages(long userId, long current, long pageSize) {
        Page<AiMessage> page = page(new Page<>(current, pageSize),
                new LambdaQueryWrapper<AiMessage>()
                        .eq(AiMessage::getUserId, userId)
                        .orderByDesc(AiMessage::getId));
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getSize(), page.getCurrent(), page.getPages());
    }

    @Override
    public long unreadCount(long userId) {
        return count(new LambdaQueryWrapper<AiMessage>()
                .eq(AiMessage::getUserId, userId)
                .eq(AiMessage::getIsRead, 0));
    }

    @Override
    public boolean markRead(long userId, Long id) {
        LambdaQueryWrapper<AiMessage> q = new LambdaQueryWrapper<AiMessage>()
                .eq(AiMessage::getUserId, userId)
                .eq(AiMessage::getIsRead, 0);
        if (id != null) {
            q.eq(AiMessage::getId, id);
        }
        List<AiMessage> list = list(q);
        if (list.isEmpty()) {
            return true;
        }
        list.forEach(m -> m.setIsRead(1));
        return updateBatchById(list);
    }

    @Override
    public boolean deleteMessage(long userId, long id) {
        return remove(new LambdaQueryWrapper<AiMessage>()
                .eq(AiMessage::getUserId, userId)
                .eq(AiMessage::getId, id));
    }

    @Override
    public void send(AiMessage msg) {
        if (msg == null) {
            return;
        }
        if (msg.getIsRead() == null) {
            msg.setIsRead(0);
        }
        if (msg.getType() == null || msg.getType().isBlank()) {
            msg.setType("system");
        }
        if (msg.getCreateTime() == null) {
            msg.setCreateTime(java.time.LocalDateTime.now());
        }
        save(msg);
    }
}
