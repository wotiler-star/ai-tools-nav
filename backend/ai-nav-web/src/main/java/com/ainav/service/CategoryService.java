package com.ainav.service;

import com.ainav.model.entity.Category;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface CategoryService extends IService<Category> {

    List<Category> listOrdered();
}
