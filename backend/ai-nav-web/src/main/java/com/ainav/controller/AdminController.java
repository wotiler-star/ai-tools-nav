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
import com.ainav.model.entity.AiTool;
import com.ainav.model.entity.Category;
import com.ainav.service.AiArticleService;
import com.ainav.service.AiColumnService;
import com.ainav.service.AiToolService;
import com.ainav.service.CategoryService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    // ===== AI 工具管理 =====

    @Operation(summary = "新增 AI 工具")
    @PostMapping("/tool/add")
    public BaseResponse<Long> addTool(@RequestBody AiTool tool) {
        if (tool == null || tool.getName() == null || tool.getName().isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "工具名称不能为空");
        }
        aiToolService.save(tool);
        return ResultUtils.success(tool.getId());
    }

    @Operation(summary = "更新 AI 工具")
    @PutMapping("/tool/update")
    public BaseResponse<Boolean> updateTool(@RequestBody AiTool tool) {
        if (tool == null || tool.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少工具 id");
        }
        return ResultUtils.success(aiToolService.updateById(tool));
    }

    @Operation(summary = "删除 AI 工具")
    @DeleteMapping("/tool/{id}")
    public BaseResponse<Boolean> deleteTool(@PathVariable Long id) {
        return ResultUtils.success(aiToolService.removeById(id));
    }

    // ===== 分类管理 =====

    @Operation(summary = "新增分类")
    @PostMapping("/category/add")
    public BaseResponse<Long> addCategory(@RequestBody Category category) {
        if (category == null || category.getName() == null || category.getName().isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类名称不能为空");
        }
        categoryService.save(category);
        return ResultUtils.success(category.getId());
    }

    @Operation(summary = "更新分类")
    @PutMapping("/category/update")
    public BaseResponse<Boolean> updateCategory(@RequestBody Category category) {
        if (category == null || category.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少分类 id");
        }
        return ResultUtils.success(categoryService.updateById(category));
    }

    @Operation(summary = "删除分类")
    @DeleteMapping("/category/{id}")
    public BaseResponse<Boolean> deleteCategory(@PathVariable Long id) {
        return ResultUtils.success(categoryService.removeById(id));
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
        return ResultUtils.success(col.getId());
    }

    @Operation(summary = "更新专栏")
    @PutMapping("/column/update")
    public BaseResponse<Boolean> updateColumn(@RequestBody AiColumn col) {
        if (col == null || col.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少专栏 id");
        }
        return ResultUtils.success(aiColumnService.updateById(col));
    }

    @Operation(summary = "删除专栏（连带删除其下文章）")
    @DeleteMapping("/column/{id}")
    public BaseResponse<Boolean> deleteColumn(@PathVariable Long id) {
        aiArticleService.remove(
                new LambdaQueryWrapper<AiArticle>().eq(AiArticle::getColumnId, id));
        return ResultUtils.success(aiColumnService.removeById(id));
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
        return ResultUtils.success(art.getId());
    }

    @Operation(summary = "更新文章")
    @PutMapping("/article/update")
    public BaseResponse<Boolean> updateArticle(@RequestBody AiArticle art) {
        if (art == null || art.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少文章 id");
        }
        return ResultUtils.success(aiArticleService.updateById(art));
    }

    @Operation(summary = "删除文章")
    @DeleteMapping("/article/{id}")
    public BaseResponse<Boolean> deleteArticle(@PathVariable Long id) {
        return ResultUtils.success(aiArticleService.removeById(id));
    }
}
