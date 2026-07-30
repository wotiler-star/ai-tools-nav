package com.ainav.controller;

import com.ainav.common.BaseResponse;
import com.ainav.common.PageResult;
import com.ainav.common.ResultUtils;
import com.ainav.model.dto.ToolQueryRequest;
import com.ainav.model.entity.AiTool;
import com.ainav.model.vo.ToolDetailVO;
import com.ainav.service.AiToolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai_tool")
@Tag(name = "AI 工具")
public class AiToolController {

    @Resource
    private AiToolService aiToolService;

    @Operation(summary = "AI 工具分页列表")
    @GetMapping("/list/page")
    public BaseResponse<PageResult<AiTool>> listPage(ToolQueryRequest req) {
        return ResultUtils.success(aiToolService.listToolByPage(req));
    }

    @Operation(summary = "AI 工具详情")
    @GetMapping("/get")
    public BaseResponse<ToolDetailVO> get(@RequestParam Long id) {
        return ResultUtils.success(aiToolService.getToolDetail(id));
    }
}
