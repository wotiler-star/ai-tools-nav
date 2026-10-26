package com.ainav.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.ainav.common.BaseResponse;
import com.ainav.common.BusinessException;
import com.ainav.common.ErrorCode;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.AiComment;
import com.ainav.model.entity.AiMessage;
import com.ainav.model.entity.AiPost;
import com.ainav.model.entity.User;
import com.ainav.service.AiCommentService;
import com.ainav.service.AiMessageService;
import com.ainav.service.AiPostService;
import com.ainav.service.UserService;
import com.ainav.service.cache.CacheKeys;
import com.ainav.service.cache.RedisCacheService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/ai_comment")
@Tag(name = "评论")
public class AiCommentController {

    @Resource
    private AiCommentService aiCommentService;

    @Resource
    private UserService userService;

    @Resource
    private AiPostService aiPostService;

    @Resource
    private AiMessageService aiMessageService;

    /** Redis 查询缓存：仅 prod profile 启用时存在（ainav.cache.enabled=true） */
    @Autowired(required = false)
    private RedisCacheService redisCacheService;

    /**
     * 评论增删会改变帖子的 comment_num，而该值被缓存在帖子列表/详情里。
     * 文章没有 comment_num 字段，因此只有 targetType=post 时才需要失效。
     */
    private void evictPostCacheOnComment(String targetType) {
        if (redisCacheService == null || !"post".equals(targetType)) {
            return;
        }
        redisCacheService.deleteByPrefix(CacheKeys.POST_LIST);
        redisCacheService.deleteByPrefix(CacheKeys.POST_DETAIL);
    }

    /** 发评论请求体 */
    @Data
    public static class AddCommentReq {
        /** 目标类型：article / post */
        private String targetType;
        private Long targetId;
        private String content;
        /** 回复某条评论时传其 id，顶级评论传 0 或不传 */
        private Long parentId;
    }

    @Operation(summary = "评论列表（公开）")
    @GetMapping("/list")
    public BaseResponse<List<AiComment>> list(
            @RequestParam(defaultValue = "article") String targetType,
            @RequestParam Long targetId) {
        if (targetId == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少目标 id");
        }
        return ResultUtils.success(aiCommentService.listByTarget(targetType, targetId));
    }

    @Operation(summary = "发布评论（需登录）")
    @PostMapping("/add")
    public BaseResponse<Long> add(@RequestBody AddCommentReq req) {
        StpUtil.checkLogin();
        if (req == null || req.getTargetId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少目标 id");
        }
        if (req.getContent() == null || req.getContent().isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "评论内容不能为空");
        }
        long userId = StpUtil.getLoginIdAsLong();
        User user = userService.getById(userId);

        AiComment c = new AiComment();
        c.setUserId(userId);
        c.setUserName(user != null ? user.getUserName() : "匿名用户");
        c.setUserAvatar(user != null ? user.getUserAvatar() : "");
        c.setTargetType(req.getTargetType() == null || req.getTargetType().isBlank()
                ? "article" : req.getTargetType());
        c.setTargetId(req.getTargetId());
        c.setContent(req.getContent().trim());
        c.setParentId(req.getParentId() == null ? 0L : req.getParentId());
        c.setLikeNum(0L);
        c.setStatus(1);
        aiCommentService.save(c);
        evictPostCacheOnComment(c.getTargetType());
        notifyOwner(c, userId);
        return ResultUtils.success(c.getId());
    }

    /**
     * 站内消息：评论通知内容作者、回复通知父评论作者。
     * 注意：文章（article）无归属用户字段，故不发送通知；给自己评论不通知。
     */
    private void notifyOwner(AiComment c, long fromUserId) {
        try {
            Long receiverId = null;
            String type = "comment";

            // 目标标题（帖子才有）
            String targetTitle = "";
            if ("post".equals(c.getTargetType())) {
                AiPost target = aiPostService.getById(c.getTargetId());
                if (target != null) {
                    targetTitle = target.getTitle() == null ? "" : target.getTitle();
                }
            }

            // 回复：优先通知被回复的那条评论的作者
            if (c.getParentId() != null && c.getParentId() > 0) {
                AiComment parent = aiCommentService.getById(c.getParentId());
                if (parent != null && parent.getUserId() != null) {
                    receiverId = parent.getUserId();
                    type = "reply";
                }
            }
            // 顶级评论：通知帖子作者
            if (receiverId == null && "post".equals(c.getTargetType())) {
                AiPost target = aiPostService.getById(c.getTargetId());
                if (target != null) {
                    receiverId = target.getUserId();
                }
            }

            if (receiverId == null || Objects.equals(receiverId, fromUserId)) {
                return;
            }

            AiMessage msg = new AiMessage();
            msg.setUserId(receiverId);
            msg.setType(type);
            msg.setTargetType(c.getTargetType());
            msg.setTargetId(c.getTargetId());
            msg.setTargetTitle(targetTitle);
            msg.setFromUserId(fromUserId);
            msg.setFromUserName(c.getUserName());
            msg.setFromUserAvatar(c.getUserAvatar());
            msg.setContent(abbreviate(c.getContent(), 120));
            aiMessageService.send(msg);
        } catch (Exception ignore) {
            // 通知失败不影响评论本身已入库
        }
    }

    private static String abbreviate(String s, int max) {
        if (s == null) {
            return "";
        }
        String t = s.trim();
        return t.length() <= max ? t : t.substring(0, max) + "…";
    }

    @Operation(summary = "删除评论（本人或管理员）")
    @DeleteMapping("/delete/{id}")
    public BaseResponse<Boolean> delete(@PathVariable long id) {
        StpUtil.checkLogin();
        AiComment c = aiCommentService.getById(id);
        if (c == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "评论不存在");
        }
        long userId = StpUtil.getLoginIdAsLong();
        User user = userService.getById(userId);
        boolean isAdmin = user != null && "admin".equals(user.getRole());
        if (!isAdmin && !Objects.equals(c.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "只能删除自己的评论");
        }
        boolean ok = aiCommentService.removeById(id);
        evictPostCacheOnComment(c.getTargetType());
        return ResultUtils.success(ok);
    }
}
