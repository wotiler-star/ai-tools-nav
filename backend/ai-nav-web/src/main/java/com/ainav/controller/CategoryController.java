package com.ainav.controller;

import com.ainav.common.BaseResponse;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.Category;
import com.ainav.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/category")
@Tag(name = "分类")
public class CategoryController {

    @Resource
    private CategoryService categoryService;

    @Operation(summary = "分类列表")
    @GetMapping("/list")
    public BaseResponse<List<Category>> list() {
        return ResultUtils.success(categoryService.listOrdered());
    }
}
