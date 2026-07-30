package com.ainav.service.impl;

import com.ainav.common.BusinessException;
import com.ainav.common.ErrorCode;
import com.ainav.common.PageResult;
import com.ainav.mapper.AiToolMapper;
import com.ainav.model.dto.ToolQueryRequest;
import com.ainav.model.entity.AiTool;
import com.ainav.model.vo.ToolDetailVO;
import com.ainav.service.AiToolService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class AiToolServiceImpl extends ServiceImpl<AiToolMapper, AiTool> implements AiToolService {

    @Override
    public PageResult<AiTool> listToolByPage(ToolQueryRequest req) {
        QueryWrapper<AiTool> qw = new QueryWrapper<>();
        if (req.getCategoryId() != null && req.getCategoryId() > 0) {
            qw.eq("categoryId", req.getCategoryId());
        }
        String kw = req.getKeyword();
        if (StringUtils.hasText(kw)) {
            qw.and(w -> w.like("name", kw).or().like("description", kw).or().like("tags", kw));
        }
        qw.orderByDesc("heat");
        Page<AiTool> page = page(new Page<>(req.getCurrent(), req.getPageSize()), qw);
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getSize(), page.getCurrent(), page.getPages());
    }

    @Override
    public ToolDetailVO getToolDetail(Long id) {
        AiTool tool = getById(id);
        if (tool == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        List<AiTool> related = lambdaQuery()
                .eq(AiTool::getCategoryId, tool.getCategoryId())
                .ne(AiTool::getId, id)
                .last("limit 5")
                .list();
        ToolDetailVO vo = new ToolDetailVO();
        BeanUtils.copyProperties(tool, vo);
        vo.setRelated(related);
        return vo;
    }
}
