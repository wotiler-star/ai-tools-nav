package com.ainav.service;

import com.ainav.common.PageResult;
import com.ainav.model.entity.AiColumnCategory;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface AiColumnCategoryService extends IService<AiColumnCategory> {

    /** 全部分类（按 sort 升序） */
    List<AiColumnCategory> listAll();
}
