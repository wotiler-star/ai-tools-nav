package com.ainav.service.impl;

import com.ainav.common.PageResult;
import com.ainav.mapper.AiNewsMapper;
import com.ainav.model.entity.AiNews;
import com.ainav.service.AiNewsService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class AiNewsServiceImpl extends ServiceImpl<AiNewsMapper, AiNews>
        implements AiNewsService {

    @Override
    public PageResult<AiNews> listNewsByPage(long current, long pageSize) {
        LambdaQueryWrapper<AiNews> qw = new LambdaQueryWrapper<>();
        qw.eq(AiNews::getStatus, 1)
                .orderByAsc(AiNews::getSort)
                .orderByDesc(AiNews::getCreateTime);
        Page<AiNews> page = page(new Page<>(current, pageSize), qw);
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getSize(),
                page.getCurrent(), page.getPages());
    }

    @Override
    public void incViewNum(Long id) {
        if (id == null) return;
        AiNews news = getById(id);
        if (news == null) return;
        news.setViewNum((news.getViewNum() == null ? 0L : news.getViewNum()) + 1);
        updateById(news);
    }
}
