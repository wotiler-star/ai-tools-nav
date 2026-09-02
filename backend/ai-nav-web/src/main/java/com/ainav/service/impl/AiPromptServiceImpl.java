package com.ainav.service.impl;

import com.ainav.common.PageResult;
import com.ainav.mapper.AiPromptMapper;
import com.ainav.model.entity.AiPrompt;
import com.ainav.service.AiPromptService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class AiPromptServiceImpl extends ServiceImpl<AiPromptMapper, AiPrompt> implements AiPromptService {

    @Override
    public PageResult<AiPrompt> listPromptByPage(long current, long pageSize) {
        Page<AiPrompt> page = page(new Page<>(current, pageSize),
                new LambdaQueryWrapper<AiPrompt>().orderByDesc(AiPrompt::getUseCount));
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getSize(), page.getCurrent(), page.getPages());
    }

    @Override
    public PageResult<AiPrompt> listMyPrompts(long userId, long current, long pageSize) {
        // ai_prompt 无 create_time，按 id 倒序近似「最新在前」
        Page<AiPrompt> page = page(new Page<>(current, pageSize),
                new LambdaQueryWrapper<AiPrompt>()
                        .eq(AiPrompt::getUserId, userId)
                        .orderByDesc(AiPrompt::getId));
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getSize(), page.getCurrent(), page.getPages());
    }
}
