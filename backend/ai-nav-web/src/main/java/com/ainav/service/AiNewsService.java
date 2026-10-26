package com.ainav.service;

import com.ainav.common.PageResult;
import com.ainav.model.entity.AiNews;
import com.baomidou.mybatisplus.extension.service.IService;

public interface AiNewsService extends IService<AiNews> {

    /** 资讯分页列表：仅发布态，sort 升序 + 发布时间倒序 */
    PageResult<AiNews> listNewsByPage(long current, long pageSize);

    /** 阅读量自增 */
    void incViewNum(Long id);
}
