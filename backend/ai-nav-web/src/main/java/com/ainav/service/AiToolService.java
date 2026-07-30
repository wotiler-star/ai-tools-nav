package com.ainav.service;

import com.ainav.common.PageResult;
import com.ainav.model.dto.ToolQueryRequest;
import com.ainav.model.entity.AiTool;
import com.ainav.model.vo.ToolDetailVO;
import com.baomidou.mybatisplus.extension.service.IService;

public interface AiToolService extends IService<AiTool> {

    PageResult<AiTool> listToolByPage(ToolQueryRequest req);

    ToolDetailVO getToolDetail(Long id);
}
