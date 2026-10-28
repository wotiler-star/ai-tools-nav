package com.ainav.controller;

import com.ainav.common.BaseResponse;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.Category;
import com.ainav.service.CategoryService;
import com.ainav.service.cache.CacheKeys;
import com.ainav.service.cache.RedisCacheService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
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

    /** Redis 查询缓存：仅 prod profile 启用时存在（ainav.cache.enabled=true） */
    @Autowired(required = false)
    private RedisCacheService redisCacheService;

    @Operation(summary = "分类列表（prod profile 下走 Redis 缓存）")
    @GetMapping("/list")
    public BaseResponse<List<Category>> list() {
        if (redisCacheService != null) {
            List<Category> cached = redisCacheService.getList(CacheKeys.CATEGORY_LIST, Category.class);
            if (cached != null) {
                return ResultUtils.success(cached);
            }
        }
        List<Category> data = categoryService.listOrdered();
        if (redisCacheService != null) {
            redisCacheService.putList(CacheKeys.CATEGORY_LIST, data, CacheKeys.TTL_DICT);
        }
        return ResultUtils.success(data);
    }
}
