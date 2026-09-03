package com.ainav.service;

import com.ainav.common.PageResult;
import com.ainav.model.entity.AiColumn;
import com.baomidou.mybatisplus.extension.service.IService;

public interface AiColumnService extends IService<AiColumn> {

    /** 专栏列表：支持分类过滤 + 排序（hot / new / default） */
    PageResult<AiColumn> listColumnByPage(long current, long pageSize, Long categoryId, String sort);

    /** 文章发布后维护专栏文章数（幂等自增） */
    void incArticleCount(Long columnId);

    /** 专栏阅读量自增 */
    void incViewNum(Long id);
}
