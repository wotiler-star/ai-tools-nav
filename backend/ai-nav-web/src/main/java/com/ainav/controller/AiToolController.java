package com.ainav.controller;

import com.ainav.common.BaseResponse;
import com.ainav.common.PageResult;
import com.ainav.common.ResultUtils;
import com.ainav.model.dto.ToolQueryRequest;
import com.ainav.model.entity.AiTool;
import com.ainav.model.vo.ToolDetailVO;
import com.ainav.service.AiToolService;
import com.ainav.service.cache.CacheKeys;
import com.ainav.service.cache.RedisCacheService;
import com.ainav.service.es.EsToolSearchService;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai_tool")
@Tag(name = "AI 工具")
public class AiToolController {

    @Resource
    private AiToolService aiToolService;

    /** ES 搜索服务：仅 es profile 启用时存在，未启用 / 异常时回退 DB */
    @Autowired(required = false)
    private EsToolSearchService esToolSearchService;

    /** Redis 查询缓存：仅 prod profile 启用时存在（ainav.cache.enabled=true） */
    @Autowired(required = false)
    private RedisCacheService redisCacheService;

    @Operation(summary = "AI 工具分页列表（prod profile 下走 Redis 缓存）")
    @GetMapping("/list/page")
    public BaseResponse<PageResult<AiTool>> listPage(ToolQueryRequest req) {
        String key = RedisCacheService.buildKey(CacheKeys.TOOL_LIST,
                req.getCategoryId(), req.getKeyword(), req.getTag(), req.getCurrent(), req.getPageSize());
        if (redisCacheService != null) {
            PageResult<AiTool> cached =
                    redisCacheService.getGeneric(key, new TypeReference<PageResult<AiTool>>() {
                    });
            if (cached != null) {
                return ResultUtils.success(cached);
            }
        }
        PageResult<AiTool> data = aiToolService.listToolByPage(req);
        if (redisCacheService != null) {
            redisCacheService.put(key, data, CacheKeys.TTL_LIST);
        }
        return ResultUtils.success(data);
    }

    @Operation(summary = "AI 工具搜索（ES 优先，未启用 ES 或异常时回退 DB）")
    @GetMapping("/search")
    public BaseResponse<PageResult<AiTool>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "20") long pageSize) {
        if (esToolSearchService != null && keyword != null && !keyword.isBlank()) {
            try {
                return ResultUtils.success(esToolSearchService.search(keyword, current, pageSize));
            } catch (Exception e) {
                // 回退 DB 搜索
            }
        }
        ToolQueryRequest req = new ToolQueryRequest();
        req.setCurrent(current);
        req.setPageSize(pageSize);
        req.setKeyword(keyword);
        // 搜索走独立前缀：关键词组合极多，混在列表前缀里会让失效成本变高
        String key = RedisCacheService.buildKey(CacheKeys.TOOL_SEARCH, keyword, current, pageSize);
        if (redisCacheService != null) {
            PageResult<AiTool> cached =
                    redisCacheService.getGeneric(key, new TypeReference<PageResult<AiTool>>() {
                    });
            if (cached != null) {
                return ResultUtils.success(cached);
            }
        }
        PageResult<AiTool> data = aiToolService.listToolByPage(req);
        if (redisCacheService != null) {
            redisCacheService.put(key, data, CacheKeys.TTL_LIST);
        }
        return ResultUtils.success(data);
    }

    @Operation(summary = "AI 工具详情（prod profile 下走 Redis 缓存）")
    @GetMapping("/get")
    public BaseResponse<ToolDetailVO> get(@RequestParam Long id) {
        String key = RedisCacheService.buildKey(CacheKeys.TOOL_DETAIL, id);
        if (redisCacheService != null) {
            ToolDetailVO cached = redisCacheService.get(key, ToolDetailVO.class);
            if (cached != null) {
                return ResultUtils.success(cached);
            }
        }
        ToolDetailVO data = aiToolService.getToolDetail(id);
        if (redisCacheService != null) {
            redisCacheService.put(key, data, CacheKeys.TTL_DETAIL);
        }
        return ResultUtils.success(data);
    }
}
