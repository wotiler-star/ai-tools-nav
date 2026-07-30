package com.ainav.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.annotation.SaCheckRole;
import com.ainav.common.BaseResponse;
import com.ainav.common.ErrorCode;
import com.ainav.common.ResultUtils;
import com.ainav.common.BusinessException;
import com.ainav.model.entity.AiTool;
import com.ainav.model.entity.Category;
import com.ainav.service.AiToolService;
import com.ainav.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
