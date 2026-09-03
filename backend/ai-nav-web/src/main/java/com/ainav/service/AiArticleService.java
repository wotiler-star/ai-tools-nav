package com.ainav.service;

import com.ainav.common.PageResult;
import com.ainav.model.entity.AiArticle;
import com.baomidou.mybatisplus.extension.service.IService;

public interface AiArticleService extends IService<AiArticle> {

    /** 文章列表：按专栏过滤 + 排序（hot / new / default） */
    PageResult<AiArticle> listArticleByPage(long current, long pageSize, Long columnId, String sort);

    /** 真实阅读量自增（文章详情页进入时调用） */
    void incViewNum(Long id);
}
