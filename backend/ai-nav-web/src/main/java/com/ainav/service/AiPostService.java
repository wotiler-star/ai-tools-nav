package com.ainav.service;

import com.ainav.common.PageResult;
import com.ainav.model.entity.AiPost;
import com.baomidou.mybatisplus.extension.service.IService;

public interface AiPostService extends IService<AiPost> {

    PageResult<AiPost> listPostByPage(long current, long pageSize);

    /** 「我的帖子」：按发布用户过滤 */
    PageResult<AiPost> listMyPosts(long userId, long current, long pageSize);
}
