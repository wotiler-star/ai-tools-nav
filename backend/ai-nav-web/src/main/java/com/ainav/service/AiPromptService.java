package com.ainav.service;

import com.ainav.common.PageResult;
import com.ainav.model.entity.AiPrompt;
import com.baomidou.mybatisplus.extension.service.IService;

public interface AiPromptService extends IService<AiPrompt> {

    PageResult<AiPrompt> listPromptByPage(long current, long pageSize);

    /** 「我的提示词」：按发布用户过滤 */
    PageResult<AiPrompt> listMyPrompts(long userId, long current, long pageSize);
}
