package com.ainav.service.impl;

import com.ainav.common.PageResult;
import com.ainav.mapper.AiPostMapper;
import com.ainav.model.entity.AiPost;
import com.ainav.service.AiPostService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class AiPostServiceImpl extends ServiceImpl<AiPostMapper, AiPost> implements AiPostService {

    @Override
    public PageResult<AiPost> listPostByPage(long current, long pageSize) {
        Page<AiPost> page = page(new Page<>(current, pageSize),
                new LambdaQueryWrapper<AiPost>().orderByDesc(AiPost::getCreateTime));
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getSize(), page.getCurrent(), page.getPages());
    }

    @Override
    public PageResult<AiPost> listMyPosts(long userId, long current, long pageSize) {
        Page<AiPost> page = page(new Page<>(current, pageSize),
                new LambdaQueryWrapper<AiPost>()
                        .eq(AiPost::getUserId, userId)
                        .orderByDesc(AiPost::getCreateTime));
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getSize(), page.getCurrent(), page.getPages());
    }
}
