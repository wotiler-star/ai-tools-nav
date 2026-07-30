package com.ainav.controller;

import com.ainav.common.BaseResponse;
import com.ainav.common.PageResult;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.AiPrompt;
import com.ainav.service.AiPromptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai_prompt")
@Tag(name = "AI 提示词")
public class AiPromptController {

    @Resource
    private AiPromptService aiPromptService;

    @Operation(summary = "提示词分页列表")
    @GetMapping("/list/page")
    public BaseResponse<PageResult<AiPrompt>> listPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "20") long pageSize) {
        return ResultUtils.success(aiPromptService.listPromptByPage(current, pageSize));
    }
}
