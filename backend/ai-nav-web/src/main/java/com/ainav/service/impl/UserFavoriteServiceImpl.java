package com.ainav.service.impl;

import com.ainav.common.BusinessException;
import com.ainav.common.ErrorCode;
import com.ainav.mapper.UserFavoriteMapper;
import com.ainav.model.dto.UserFavoriteAddRequest;
import com.ainav.model.entity.AiPost;
import com.ainav.model.entity.AiPrompt;
import com.ainav.model.entity.AiTool;
import com.ainav.model.entity.UserFavorite;
import com.ainav.service.AiPostService;
import com.ainav.service.AiPromptService;
import com.ainav.service.AiToolService;
import com.ainav.service.UserFavoriteService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户收藏：收藏时把目标标题/封面/简介/链接做快照，
 * 列表即可自包含展示，无需再回查三张内容表。
 */
@Service
public class UserFavoriteServiceImpl extends ServiceImpl<UserFavoriteMapper, UserFavorite>
        implements UserFavoriteService {

    @Resource
    private AiToolService aiToolService;

    @Resource
    private AiPostService aiPostService;

    @Resource
    private AiPromptService aiPromptService;

    @Override
    public boolean addFavorite(Long userId, UserFavoriteAddRequest req) {
        if (req == null || req.getTargetType() == null || req.getTargetId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "收藏目标为空");
        }
        String type = req.getTargetType();
        Long targetId = req.getTargetId();

        // 幂等：已收藏直接返回成功
        long exist = lambdaQuery()
                .eq(UserFavorite::getUserId, userId)
                .eq(UserFavorite::getTargetType, type)
                .eq(UserFavorite::getTargetId, targetId)
                .count();
        if (exist > 0) {
            return true;
        }

        UserFavorite fav = new UserFavorite();
        fav.setUserId(userId);
        fav.setTargetType(type);
        fav.setTargetId(targetId);
        fillSnapshot(fav, type, targetId);
        return save(fav);
    }

    private void fillSnapshot(UserFavorite fav, String type, Long targetId) {
        switch (type) {
            case "tool" -> {
                AiTool t = aiToolService.getById(targetId);
                if (t == null) {
                    throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "收藏的工具不存在");
                }
                fav.setTargetTitle(t.getName());
                fav.setTargetCover(t.getLogo());
                fav.setTargetDesc(t.getDescription());
                fav.setTargetUrl(t.getUrl());
            }
            case "post" -> {
                AiPost p = aiPostService.getById(targetId);
                if (p == null) {
                    throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "收藏的帖子不存在");
                }
                fav.setTargetTitle(p.getTitle());
                fav.setTargetCover(p.getThumbUrl());
                fav.setTargetDesc(brief(p.getContent()));
                fav.setTargetUrl("/essay/" + p.getId());
            }
            case "prompt" -> {
                AiPrompt pr = aiPromptService.getById(targetId);
                if (pr == null) {
                    throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "收藏的提示词不存在");
                }
                fav.setTargetTitle(pr.getTitle());
                fav.setTargetDesc(brief(pr.getContent()));
                fav.setTargetUrl("/painting?id=" + pr.getId());
            }
            default -> throw new BusinessException(ErrorCode.PARAMS_ERROR, "未知的收藏类型：" + type);
        }
    }

    /** 正文摘要：压缩空白后截断 80 字 */
    private String brief(String text) {
        if (text == null) {
            return "";
        }
        String s = text.replaceAll("\\s+", " ").trim();
        return s.length() > 80 ? s.substring(0, 80) : s;
    }

    @Override
    public boolean removeFavorite(Long userId, String targetType, Long targetId) {
        return lambdaUpdate()
                .eq(UserFavorite::getUserId, userId)
                .eq(UserFavorite::getTargetType, targetType)
                .eq(UserFavorite::getTargetId, targetId)
                .remove();
    }

    @Override
    public List<UserFavorite> listMyFavorites(Long userId) {
        return lambdaQuery()
                .eq(UserFavorite::getUserId, userId)
                .orderByDesc(UserFavorite::getCreateTime)
                .list();
    }
}
