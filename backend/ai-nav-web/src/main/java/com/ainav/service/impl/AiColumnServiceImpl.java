package com.ainav.service.impl;

import com.ainav.common.PageResult;
import com.ainav.mapper.AiColumnMapper;
import com.ainav.model.entity.AiColumn;
import com.ainav.service.AiColumnService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.support.SFunction;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class AiColumnServiceImpl extends ServiceImpl<AiColumnMapper, AiColumn>
        implements AiColumnService {

    @Override
    public PageResult<AiColumn> listColumnByPage(long current, long pageSize, Long categoryId, String sort) {
        LambdaQueryWrapper<AiColumn> qw = new LambdaQueryWrapper<>();
        qw.eq(AiColumn::getStatus, 1);
        if (categoryId != null && categoryId > 0) {
            qw.eq(AiColumn::getCategoryId, categoryId);
        }
        if ("hot".equals(sort)) {
            qw.orderByDesc(AiColumn::getViewNum).orderByAsc(AiColumn::getSort);
        } else if ("new".equals(sort)) {
            qw.orderByDesc(AiColumn::getCreateTime);
        } else {
            qw.orderByAsc(AiColumn::getSort);
        }
        Page<AiColumn> page = page(new Page<>(current, pageSize), qw);
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getSize(), page.getCurrent(), page.getPages());
    }

    @Override
    public void incArticleCount(Long columnId) {
        if (columnId == null) return;
        AiColumn col = getById(columnId);
        if (col == null) return;
        col.setArticleCount((col.getArticleCount() == null ? 0 : col.getArticleCount()) + 1);
        updateById(col);
    }

    @Override
    public void incViewNum(Long id) {
        if (id == null) return;
        AiColumn col = getById(id);
        if (col == null) return;
        col.setViewNum((col.getViewNum() == null ? 0L : col.getViewNum()) + 1);
        updateById(col);
    }
}
