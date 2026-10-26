package com.ainav.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.annotation.SaCheckRole;
import com.ainav.common.BaseResponse;
import com.ainav.common.ErrorCode;
import com.ainav.common.ResultUtils;
import com.ainav.common.BusinessException;
import com.ainav.common.PageResult;
import com.ainav.model.entity.AiArticle;
import com.ainav.model.entity.AiColumn;
import com.ainav.model.entity.AiComment;
import com.ainav.model.entity.AiMessage;
import com.ainav.model.entity.AiPost;
import com.ainav.model.entity.AiPrompt;
import com.ainav.model.entity.AiTool;
import com.ainav.model.entity.Category;
import com.ainav.model.entity.User;
import com.ainav.model.vo.AdminStatsVO;
import com.ainav.model.vo.UserVO;
import com.ainav.service.AiArticleService;
import com.ainav.service.AiColumnService;
import com.ainav.service.AiCommentService;
import com.ainav.service.AiMessageService;
import com.ainav.service.AiPostService;
import com.ainav.service.AiPromptService;
import com.ainav.service.AiToolService;
import com.ainav.service.CategoryService;
import com.ainav.service.UserService;
import com.ainav.service.cache.CacheKeys;
import com.ainav.service.cache.RedisCacheService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.Data;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 后台管理接口，统一前缀 /admin，Sa-Token 校验管理员角色。
 * 与 SaTokenConfig 中 /admin/** 登录拦截 + 此处 @SaCheckRole 双重校验对齐。
 */
@RestController
@RequestMapping("/admin")
@Tag(name = "后台管理")
@SaCheckLogin
@SaCheckRole("admin")
public class AdminController {

    @Resource
    private AiToolService aiToolService;

    @Resource
    private CategoryService categoryService;

    @Resource
    private AiColumnService aiColumnService;

    @Resource
    private AiArticleService aiArticleService;

    @Resource
    private UserService userService;

    @Resource
    private AiPostService aiPostService;

    @Resource
    private AiPromptService aiPromptService;

    @Resource
    private AiCommentService aiCommentService;

    @Resource
    private AiMessageService aiMessageService;

    /** Redis 查询缓存：仅 prod profile 启用时存在（ainav.cache.enabled=true） */
    @Autowired(required = false)
    private RedisCacheService redisCacheService;

    /**
     * 后台写操作后按前缀失效前台缓存。
     *
     * <p>这是「后台改完前台立刻可见」的关键：读接口按 CacheKeys 的前缀写缓存，
     * 写接口必须以同样的前缀清掉，否则前台最长要等 TTL（5 分钟）才更新。
     */
    private void evictCache(String... prefixes) {
        if (redisCacheService == null || prefixes == null) {
            return;
        }
        for (String prefix : prefixes) {
            redisCacheService.deleteByPrefix(prefix);
        }
    }

    // ===== AI 工具管理 =====

    @Operation(summary = "新增 AI 工具")
    @PostMapping("/tool/add")
    public BaseResponse<Long> addTool(@RequestBody AiTool tool) {
        if (tool == null || tool.getName() == null || tool.getName().isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "工具名称不能为空");
        }
        aiToolService.save(tool);
        evictCache(CacheKeys.TOOL_LIST, CacheKeys.TOOL_SEARCH);
        return ResultUtils.success(tool.getId());
    }

    @Operation(summary = "更新 AI 工具")
    @PutMapping("/tool/update")
    public BaseResponse<Boolean> updateTool(@RequestBody AiTool tool) {
        if (tool == null || tool.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少工具 id");
        }
        boolean ok = aiToolService.updateById(tool);
        evictCache(CacheKeys.TOOL_LIST, CacheKeys.TOOL_SEARCH, CacheKeys.TOOL_DETAIL);
        return ResultUtils.success(ok);
    }

    @Operation(summary = "删除 AI 工具")
    @DeleteMapping("/tool/{id}")
    public BaseResponse<Boolean> deleteTool(@PathVariable Long id) {
        boolean ok = aiToolService.removeById(id);
        evictCache(CacheKeys.TOOL_LIST, CacheKeys.TOOL_SEARCH, CacheKeys.TOOL_DETAIL);
        return ResultUtils.success(ok);
    }

    // ===== 分类管理 =====

    @Operation(summary = "新增分类")
    @PostMapping("/category/add")
    public BaseResponse<Long> addCategory(@RequestBody Category category) {
        if (category == null || category.getName() == null || category.getName().isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类名称不能为空");
        }
        categoryService.save(category);
        evictCache(CacheKeys.CATEGORY_LIST);
        return ResultUtils.success(category.getId());
    }

    @Operation(summary = "更新分类")
    @PutMapping("/category/update")
    public BaseResponse<Boolean> updateCategory(@RequestBody Category category) {
        if (category == null || category.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少分类 id");
        }
        boolean ok = categoryService.updateById(category);
        evictCache(CacheKeys.CATEGORY_LIST);
        return ResultUtils.success(ok);
    }

    @Operation(summary = "删除分类")
    @DeleteMapping("/category/{id}")
    public BaseResponse<Boolean> deleteCategory(@PathVariable Long id) {
        boolean ok = categoryService.removeById(id);
        evictCache(CacheKeys.CATEGORY_LIST);
        return ResultUtils.success(ok);
    }

    // ===== AI 知识库管理（专栏 + 文章） =====

    @Operation(summary = "知识库专栏列表（含未发布，按 sort 升序）")
    @GetMapping("/column/list")
    public BaseResponse<java.util.List<AiColumn>> listColumns() {
        return ResultUtils.success(aiColumnService.list(
                new LambdaQueryWrapper<AiColumn>().orderByAsc(AiColumn::getSort)));
    }

    @Operation(summary = "新增专栏")
    @PostMapping("/column/add")
    public BaseResponse<Long> addColumn(@RequestBody AiColumn col) {
        if (col == null || col.getTitle() == null || col.getTitle().isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "专栏标题不能为空");
        }
        if (col.getStatus() == null) col.setStatus(1);
        if (col.getArticleCount() == null) col.setArticleCount(0);
        if (col.getNeedVip() == null) col.setNeedVip(0);
        aiColumnService.save(col);
        evictCache(CacheKeys.COLUMN_LIST, CacheKeys.COLUMN_CATEGORY_LIST);
        return ResultUtils.success(col.getId());
    }

    @Operation(summary = "更新专栏")
    @PutMapping("/column/update")
    public BaseResponse<Boolean> updateColumn(@RequestBody AiColumn col) {
        if (col == null || col.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少专栏 id");
        }
        boolean ok = aiColumnService.updateById(col);
        evictCache(CacheKeys.COLUMN_LIST, CacheKeys.COLUMN_DETAIL);
        return ResultUtils.success(ok);
    }

    @Operation(summary = "删除专栏（连带删除其下文章）")
    @DeleteMapping("/column/{id}")
    public BaseResponse<Boolean> deleteColumn(@PathVariable Long id) {
        aiArticleService.remove(
                new LambdaQueryWrapper<AiArticle>().eq(AiArticle::getColumnId, id));
        boolean ok = aiColumnService.removeById(id);
        // 该专栏下的文章一并删除，文章缓存也要跟着失效
        evictCache(CacheKeys.COLUMN_LIST, CacheKeys.COLUMN_DETAIL,
                CacheKeys.ARTICLE_LIST, CacheKeys.ARTICLE_DETAIL);
        return ResultUtils.success(ok);
    }

    @Operation(summary = "知识库文章列表（含草稿，可按专栏过滤）")
    @GetMapping("/article/list")
    public BaseResponse<java.util.List<AiArticle>> listArticlesAdmin(
            @RequestParam(required = false) Long columnId) {
        LambdaQueryWrapper<AiArticle> qw = new LambdaQueryWrapper<>();
        if (columnId != null) {
            qw.eq(AiArticle::getColumnId, columnId);
        }
        qw.orderByAsc(AiArticle::getSort);
        return ResultUtils.success(aiArticleService.list(qw));
    }

    @Operation(summary = "新增文章")
    @PostMapping("/article/add")
    public BaseResponse<Long> addArticle(@RequestBody AiArticle art) {
        if (art == null || art.getTitle() == null || art.getTitle().isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章标题不能为空");
        }
        if (art.getStatus() == null) art.setStatus(1);
        aiArticleService.save(art);
        if (art.getColumnId() != null) {
            aiColumnService.incArticleCount(art.getColumnId());
        }
        // 专栏的文章数变了，专栏缓存一并失效
        evictCache(CacheKeys.ARTICLE_LIST, CacheKeys.COLUMN_LIST);
        return ResultUtils.success(art.getId());
    }

    @Operation(summary = "更新文章")
    @PutMapping("/article/update")
    public BaseResponse<Boolean> updateArticle(@RequestBody AiArticle art) {
        if (art == null || art.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少文章 id");
        }
        boolean ok = aiArticleService.updateById(art);
        evictCache(CacheKeys.ARTICLE_LIST, CacheKeys.ARTICLE_DETAIL);
        return ResultUtils.success(ok);
    }

    @Operation(summary = "删除文章")
    @DeleteMapping("/article/{id}")
    public BaseResponse<Boolean> deleteArticle(@PathVariable Long id) {
        boolean ok = aiArticleService.removeById(id);
        evictCache(CacheKeys.ARTICLE_LIST, CacheKeys.ARTICLE_DETAIL, CacheKeys.COLUMN_LIST);
        return ResultUtils.success(ok);
    }

    // ===== 数据概览 =====

    @Operation(summary = "数据概览统计")
    @GetMapping("/stats")
    public BaseResponse<AdminStatsVO> stats() {
        AdminStatsVO vo = new AdminStatsVO();
        vo.setUserCount(userService.count());
        vo.setToolCount(aiToolService.count());
        vo.setCategoryCount(categoryService.count());
        vo.setPostCount(aiPostService.count());
        vo.setPromptCount(aiPromptService.count());
        vo.setCommentCount(aiCommentService.count());
        vo.setColumnCount(aiColumnService.count());
        vo.setArticleCount(aiArticleService.count());
        vo.setMessageCount(aiMessageService.count());
        return ResultUtils.success(vo);
    }

    // ===== 用户管理 =====

    /** 管理员更新用户请求体（不含密码，密码只能用户自己改） */
    @Data
    public static class UserUpdateAdminReq {
        private Long id;
        private String userName;
        private String userAvatar;
        private String userProfile;
        private String email;
        private String phone;
        /** user / admin */
        private String role;
    }

    @Operation(summary = "用户分页列表（脱敏，支持关键词）")
    @GetMapping("/user/list")
    public BaseResponse<PageResult<UserVO>> listUsers(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long pageSize,
            @RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<User> qw = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isBlank()) {
            String kw = keyword.trim();
            qw.like(User::getUserAccount, kw)
                    .or().like(User::getUserName, kw)
                    .or().like(User::getEmail, kw);
        }
        qw.orderByDesc(User::getId);
        Page<User> page = userService.page(new Page<>(current, pageSize), qw);
        List<UserVO> vos = page.getRecords().stream()
                .map(userService::toVO)
                .collect(Collectors.toList());
        return ResultUtils.success(new PageResult<>(vos, page.getTotal(), page.getSize(),
                page.getCurrent(), page.getPages()));
    }

    @Operation(summary = "更新用户资料/角色")
    @PutMapping("/user/update")
    public BaseResponse<Boolean> updateUser(@RequestBody UserUpdateAdminReq req) {
        if (req == null || req.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少用户 id");
        }
        User u = userService.getById(req.getId());
        if (u == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "用户不存在");
        }
        if (req.getUserName() != null) {
            u.setUserName(req.getUserName());
        }
        if (req.getUserAvatar() != null) {
            u.setUserAvatar(req.getUserAvatar());
        }
        if (req.getUserProfile() != null) {
            u.setUserProfile(req.getUserProfile());
        }
        if (req.getEmail() != null) {
            u.setEmail(req.getEmail());
        }
        if (req.getPhone() != null) {
            u.setPhone(req.getPhone());
        }
        if (req.getRole() != null && !req.getRole().isBlank()) {
            u.setRole(req.getRole());
        }
        u.setUpdateTime(LocalDateTime.now());
        boolean ok = userService.updateById(u);
        // 帖子缓存里冗余了 authorName / authorAvatar，改用户名/头像后必须失效，
        // 否则前台列表会继续显示旧的作者信息直到 TTL 到期
        evictCache(CacheKeys.POST_LIST, CacheKeys.POST_DETAIL);
        return ResultUtils.success(ok);
    }

    @Operation(summary = "删除用户")
    @DeleteMapping("/user/{id}")
    public BaseResponse<Boolean> deleteUser(@PathVariable Long id) {
        if (id == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少用户 id");
        }
        boolean ok = userService.removeById(id);
        // 同上：其名下帖子的作者信息仍缓存在列表里
        evictCache(CacheKeys.POST_LIST, CacheKeys.POST_DETAIL);
        return ResultUtils.success(ok);
    }

    // ===== 社区帖子管理 =====

    @Operation(summary = "帖子分页列表（支持关键词）")
    @GetMapping("/post/list")
    public BaseResponse<PageResult<AiPost>> listPosts(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long pageSize,
            @RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<AiPost> qw = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isBlank()) {
            String kw = keyword.trim();
            qw.like(AiPost::getTitle, kw).or().like(AiPost::getContent, kw);
        }
        qw.orderByDesc(AiPost::getId);
        Page<AiPost> page = aiPostService.page(new Page<>(current, pageSize), qw);
        return ResultUtils.success(new PageResult<>(page.getRecords(), page.getTotal(),
                page.getSize(), page.getCurrent(), page.getPages()));
    }

    @Operation(summary = "更新帖子")
    @PutMapping("/post/update")
    public BaseResponse<Boolean> updatePost(@RequestBody AiPost post) {
        if (post == null || post.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少帖子 id");
        }
        boolean ok = aiPostService.updateById(post);
        evictCache(CacheKeys.POST_LIST, CacheKeys.POST_DETAIL);
        return ResultUtils.success(ok);
    }

    @Operation(summary = "删除帖子")
    @DeleteMapping("/post/{id}")
    public BaseResponse<Boolean> deletePost(@PathVariable Long id) {
        // 连带清理该帖子下的评论，避免脏数据
        aiCommentService.remove(new LambdaQueryWrapper<AiComment>()
                .eq(AiComment::getTargetType, "post")
                .eq(AiComment::getTargetId, id));
        boolean ok = aiPostService.removeById(id);
        evictCache(CacheKeys.POST_LIST, CacheKeys.POST_DETAIL);
        return ResultUtils.success(ok);
    }

    // ===== AI 提示词管理 =====

    @Operation(summary = "提示词分页列表（支持关键词）")
    @GetMapping("/prompt/list")
    public BaseResponse<PageResult<AiPrompt>> listPrompts(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long pageSize,
            @RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<AiPrompt> qw = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isBlank()) {
            String kw = keyword.trim();
            qw.like(AiPrompt::getTitle, kw).or().like(AiPrompt::getContent, kw);
        }
        qw.orderByDesc(AiPrompt::getId);
        Page<AiPrompt> page = aiPromptService.page(new Page<>(current, pageSize), qw);
        return ResultUtils.success(new PageResult<>(page.getRecords(), page.getTotal(),
                page.getSize(), page.getCurrent(), page.getPages()));
    }

    @Operation(summary = "更新提示词")
    @PutMapping("/prompt/update")
    public BaseResponse<Boolean> updatePrompt(@RequestBody AiPrompt prompt) {
        if (prompt == null || prompt.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少提示词 id");
        }
        boolean ok = aiPromptService.updateById(prompt);
        evictCache(CacheKeys.PROMPT_LIST, CacheKeys.PROMPT_DETAIL);
        return ResultUtils.success(ok);
    }

    @Operation(summary = "删除提示词")
    @DeleteMapping("/prompt/{id}")
    public BaseResponse<Boolean> deletePrompt(@PathVariable Long id) {
        boolean ok = aiPromptService.removeById(id);
        evictCache(CacheKeys.PROMPT_LIST, CacheKeys.PROMPT_DETAIL);
        return ResultUtils.success(ok);
    }

    // ===== 评论管理 =====

    @Operation(summary = "评论分页列表（支持关键词）")
    @GetMapping("/comment/list")
    public BaseResponse<PageResult<AiComment>> listComments(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long pageSize,
            @RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<AiComment> qw = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isBlank()) {
            qw.like(AiComment::getContent, keyword.trim());
        }
        qw.orderByDesc(AiComment::getId);
        Page<AiComment> page = aiCommentService.page(new Page<>(current, pageSize), qw);
        return ResultUtils.success(new PageResult<>(page.getRecords(), page.getTotal(),
                page.getSize(), page.getCurrent(), page.getPages()));
    }

    @Operation(summary = "删除评论")
    @DeleteMapping("/comment/{id}")
    public BaseResponse<Boolean> deleteComment(@PathVariable Long id) {
        // 先取出再删：comment_num 冗余在帖子上，需按评论归属精准失效
        AiComment comment = aiCommentService.getById(id);
        boolean ok = aiCommentService.removeById(id);
        // 文章没有 comment_num 字段，只有帖子需要失效
        if (comment != null && "post".equals(comment.getTargetType())) {
            evictCache(CacheKeys.POST_LIST, CacheKeys.POST_DETAIL);
        }
        return ResultUtils.success(ok);
    }
}
