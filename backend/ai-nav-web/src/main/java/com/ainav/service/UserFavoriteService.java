package com.ainav.service;

import com.ainav.model.dto.UserFavoriteAddRequest;
import com.ainav.model.entity.UserFavorite;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface UserFavoriteService extends IService<UserFavorite> {

    /** 新增收藏（幂等，已收藏直接返回 true） */
    boolean addFavorite(Long userId, UserFavoriteAddRequest req);

    /** 取消收藏 */
    boolean removeFavorite(Long userId, String targetType, Long targetId);

    /** 我的收藏列表（按收藏时间倒序） */
    List<UserFavorite> listMyFavorites(Long userId);
}
