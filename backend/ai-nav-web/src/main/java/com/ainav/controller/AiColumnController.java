package com.ainav.controller;

import com.ainav.common.BaseResponse;
import com.ainav.common.PageResult;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.AiArticle;
import com.ainav.model.entity.AiColumn;
import com.ainav.model.entity.AiColumnCategory;
import com.ainav.service.AiArticleService;
import com.ainav.service.AiColumnCategoryService;
import com.ainav.service.AiColumnService;
import com.ainav.service.cache.CacheKeys;
import com.ainav.service.cache.RedisCacheService;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai_column")
@Tag(name = "AI 知识库-专栏")
public class AiColumnController {

    @Resource
    private AiColumnCategoryService aiColumnCategoryService;

    @Resource
    private AiColumnService aiColumnService;

    @Resource
    private AiArticleService aiArticleService;

    /** Redis 查询缓存：仅 prod profile 启用时存在（ainav.cache.enabled=true） */
    @Autowired(required = false)
    private RedisCacheService redisCacheService;

    @Operation(summary = "知识库分类列表（几乎不变，缓存 30 分钟）")
    @GetMapping("/category/list")
    public BaseResponse<java.util.List<AiColumnCategory>> categoryList() {
        if (redisCacheService != null) {
            java.util.List<AiColumnCategory> cached =
                    redisCacheService.getList(CacheKeys.COLUMN_CATEGORY_LIST, AiColumnCategory.class);
            if (cached != null) {
                return ResultUtils.success(cached);
            }
        }
        java.util.List<AiColumnCategory> data = aiColumnCategoryService.listAll();
        if (redisCacheService != null) {
            redisCacheService.putList(CacheKeys.COLUMN_CATEGORY_LIST, data, CacheKeys.TTL_DICT);
        }
        return ResultUtils.success(data);
    }

    @Operation(summary = "专栏分页列表（支持分类过滤 + 排序 hot/new）")
    @GetMapping("/list")
    public BaseResponse<PageResult<AiColumn>> list(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "12") long pageSize,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "default") String sort) {
        String key = RedisCacheService.buildKey(CacheKeys.COLUMN_LIST, categoryId, sort, current, pageSize);
        if (redisCacheService != null) {
            PageResult<AiColumn> cached =
                    redisCacheService.getGeneric(key, new TypeReference<PageResult<AiColumn>>() {
                    });
            if (cached != null) {
                return ResultUtils.success(cached);
            }
        }
        PageResult<AiColumn> data = aiColumnService.listColumnByPage(current, pageSize, categoryId, sort);
        if (redisCacheService != null) {
            redisCacheService.put(key, data, CacheKeys.TTL_LIST);
        }
        return ResultUtils.success(data);
    }

    @Operation(summary = "专栏详情")
    @GetMapping("/get/{id}")
    public BaseResponse<AiColumn> get(@PathVariable long id) {
        String key = RedisCacheService.buildKey(CacheKeys.COLUMN_DETAIL, id);
        if (redisCacheService != null) {
            AiColumn cached = redisCacheService.get(key, AiColumn.class);
            if (cached != null) {
                return ResultUtils.success(cached);
            }
        }
        AiColumn data = aiColumnService.getById(id);
        if (redisCacheService != null) {
            redisCacheService.put(key, data, CacheKeys.TTL_DETAIL);
        }
        return ResultUtils.success(data);
    }

    @Operation(summary = "文章分页列表（按专栏过滤 + 排序 hot/new）")
    @GetMapping("/article/list")
    public BaseResponse<PageResult<AiArticle>> articleList(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "20") long pageSize,
            @RequestParam(required = false) Long columnId,
            @RequestParam(defaultValue = "default") String sort) {
        String key = RedisCacheService.buildKey(CacheKeys.ARTICLE_LIST, columnId, sort, current, pageSize);
        if (redisCacheService != null) {
            PageResult<AiArticle> cached =
                    redisCacheService.getGeneric(key, new TypeReference<PageResult<AiArticle>>() {
                    });
            if (cached != null) {
                return ResultUtils.success(cached);
            }
        }
        PageResult<AiArticle> data = aiArticleService.listArticleByPage(current, pageSize, columnId, sort);
        if (redisCacheService != null) {
            redisCacheService.put(key, data, CacheKeys.TTL_LIST);
        }
        return ResultUtils.success(data);
    }

    @Operation(summary = "文章详情")
    @GetMapping("/article/get/{id}")
    public BaseResponse<AiArticle> articleGet(@PathVariable long id) {
        String key = RedisCacheService.buildKey(CacheKeys.ARTICLE_DETAIL, id);
        if (redisCacheService != null) {
            AiArticle cached = redisCacheService.get(key, AiArticle.class);
            if (cached != null) {
                return ResultUtils.success(cached);
            }
        }
        AiArticle data = aiArticleService.getById(id);
        if (redisCacheService != null) {
            redisCacheService.put(key, data, CacheKeys.TTL_DETAIL);
        }
        return ResultUtils.success(data);
    }

    @Operation(summary = "文章阅读量 +1（公开，详情页进入时调一次）")
    @PostMapping("/article/view/{id}")
    public BaseResponse<Long> articleView(@PathVariable long id) {
        aiArticleService.incViewNum(id);
        // 阅读量已变，详情缓存立即失效；列表页的展示值允许滞后到 TTL 到期
        if (redisCacheService != null) {
            redisCacheService.delete(RedisCacheService.buildKey(CacheKeys.ARTICLE_DETAIL, id));
        }
        AiArticle art = aiArticleService.getById(id);
        return ResultUtils.success(art != null ? art.getViewNum() : 0L);
    }

    @Operation(summary = "专栏阅读量 +1（公开）")
    @PostMapping("/view/{id}")
    public BaseResponse<Long> columnView(@PathVariable long id) {
        aiColumnService.incViewNum(id);
        if (redisCacheService != null) {
            redisCacheService.delete(RedisCacheService.buildKey(CacheKeys.COLUMN_DETAIL, id));
        }
        AiColumn col = aiColumnService.getById(id);
        return ResultUtils.success(col != null ? col.getViewNum() : 0L);
    }
}
