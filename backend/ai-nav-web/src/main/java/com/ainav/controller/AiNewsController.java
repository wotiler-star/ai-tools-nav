package com.ainav.controller;

import com.ainav.common.BaseResponse;
import com.ainav.common.PageResult;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.AiNews;
import com.ainav.service.AiNewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * AI 资讯：公开读接口（首页榜单 + /news 列表 + 详情）。
 * 写操作需登录，已在 SaTokenConfig 中按需放行/拦截；此处只提供读取能力。
 */
@RestController
@RequestMapping("/ai_news")
@Tag(name = "AI 资讯")
public class AiNewsController {

    @Resource
    private AiNewsService aiNewsService;

    @Operation(summary = "AI 资讯分页列表")
    @GetMapping("/list/page")
    public BaseResponse<PageResult<AiNews>> listPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long pageSize) {
        return ResultUtils.success(aiNewsService.listNewsByPage(current, pageSize));
    }

    @Operation(summary = "AI 资讯详情")
    @GetMapping("/get")
    public BaseResponse<AiNews> get(@RequestParam long id) {
        AiNews data = aiNewsService.getById(id);
        if (data != null) {
            aiNewsService.incViewNum(id);
        }
        return ResultUtils.success(data);
    }
}
