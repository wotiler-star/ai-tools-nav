package com.ainav.service;

import com.ainav.common.PageResult;
import com.ainav.model.entity.AiMessage;
import com.baomidou.mybatisplus.extension.service.IService;

public interface AiMessageService extends IService<AiMessage> {

    /** 我的消息（按接收者过滤，最新在前） */
    PageResult<AiMessage> listMyMessages(long userId, long current, long pageSize);

    /** 未读消息数（用于红点） */
    long unreadCount(long userId);

    /** 标记已读；id 为空则把该用户全部未读消息标记为已读 */
    boolean markRead(long userId, Long id);

    /** 删除自己的一条消息 */
    boolean deleteMessage(long userId, long id);

    /** 写一条站内消息（内部调用，不做登录校验） */
    void send(AiMessage msg);
}
