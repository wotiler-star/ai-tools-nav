package com.ainav.service.impl;

import com.ainav.model.entity.Category;
import com.ainav.service.CategoryService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ainav.mapper.CategoryMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Override
    public List<Category> listOrdered() {
        return list(new LambdaQueryWrapper<Category>().orderByAsc(Category::getSort));
    }
}
