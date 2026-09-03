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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
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

    @Operation(summary = "知识库分类列表")
    @GetMapping("/category/list")
    public BaseResponse<java.util.List<AiColumnCategory>> categoryList() {
        return ResultUtils.success(aiColumnCategoryService.listAll());
    }

    @Operation(summary = "专栏分页列表（支持分类过滤 + 排序 hot/new）")
    @GetMapping("/list")
    public BaseResponse<PageResult<AiColumn>> list(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "12") long pageSize,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "default") String sort) {
        return ResultUtils.success(aiColumnService.listColumnByPage(current, pageSize, categoryId, sort));
    }

    @Operation(summary = "专栏详情")
    @GetMapping("/get/{id}")
    public BaseResponse<AiColumn> get(@PathVariable long id) {
        return ResultUtils.success(aiColumnService.getById(id));
    }

    @Operation(summary = "文章分页列表（按专栏过滤 + 排序 hot/new）")
    @GetMapping("/article/list")
    public BaseResponse<PageResult<AiArticle>> articleList(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "20") long pageSize,
            @RequestParam(required = false) Long columnId,
            @RequestParam(defaultValue = "default") String sort) {
        return ResultUtils.success(aiArticleService.listArticleByPage(current, pageSize, columnId, sort));
    }

    @Operation(summary = "文章详情")
    @GetMapping("/article/get/{id}")
    public BaseResponse<AiArticle> articleGet(@PathVariable long id) {
        return ResultUtils.success(aiArticleService.getById(id));
    }

    @Operation(summary = "文章阅读量 +1（公开，详情页进入时调一次）")
    @PostMapping("/article/view/{id}")
    public BaseResponse<Long> articleView(@PathVariable long id) {
        aiArticleService.incViewNum(id);
        AiArticle art = aiArticleService.getById(id);
        return ResultUtils.success(art != null ? art.getViewNum() : 0L);
    }

    @Operation(summary = "专栏阅读量 +1（公开）")
    @PostMapping("/view/{id}")
    public BaseResponse<Long> columnView(@PathVariable long id) {
        aiColumnService.incViewNum(id);
        AiColumn col = aiColumnService.getById(id);
        return ResultUtils.success(col != null ? col.getViewNum() : 0L);
    }
}
