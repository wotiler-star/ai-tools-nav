package com.ainav.service.impl;

import com.ainav.common.PageResult;
import com.ainav.mapper.AiArticleMapper;
import com.ainav.model.entity.AiArticle;
import com.ainav.service.AiArticleService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class AiArticleServiceImpl extends ServiceImpl<AiArticleMapper, AiArticle>
        implements AiArticleService {

    @Override
    public PageResult<AiArticle> listArticleByPage(long current, long pageSize, Long columnId, String sort) {
        LambdaQueryWrapper<AiArticle> qw = new LambdaQueryWrapper<>();
        qw.eq(AiArticle::getStatus, 1);
        if (columnId != null && columnId > 0) {
            qw.eq(AiArticle::getColumnId, columnId);
        }
        if ("hot".equals(sort)) {
            qw.orderByDesc(AiArticle::getViewNum).orderByAsc(AiArticle::getSort);
        } else if ("new".equals(sort)) {
            qw.orderByDesc(AiArticle::getCreateTime);
        } else {
            qw.orderByAsc(AiArticle::getSort);
        }
        Page<AiArticle> page = page(new Page<>(current, pageSize), qw);
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getSize(), page.getCurrent(), page.getPages());
    }

    @Override
    public void incViewNum(Long id) {
        if (id == null) return;
        AiArticle art = getById(id);
        if (art == null) return;
        art.setViewNum((art.getViewNum() == null ? 0L : art.getViewNum()) + 1);
        updateById(art);
    }
}
