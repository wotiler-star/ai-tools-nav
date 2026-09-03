package com.ainav.service.impl;

import com.ainav.common.PageResult;
import com.ainav.mapper.AiColumnCategoryMapper;
import com.ainav.model.entity.AiColumnCategory;
import com.ainav.service.AiColumnCategoryService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiColumnCategoryServiceImpl extends ServiceImpl<AiColumnCategoryMapper, AiColumnCategory>
        implements AiColumnCategoryService {

    @Override
    public List<AiColumnCategory> listAll() {
        return list(new LambdaQueryWrapper<AiColumnCategory>().orderByAsc(AiColumnCategory::getSort));
    }
}
