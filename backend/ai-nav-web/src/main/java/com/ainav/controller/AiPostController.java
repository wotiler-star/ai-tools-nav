package com.ainav.controller;

import com.ainav.common.BaseResponse;
import com.ainav.common.PageResult;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.AiPost;
import com.ainav.service.AiPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai_post")
@Tag(name = "AI 社区")
public class AiPostController {

    @Resource
    private AiPostService aiPostService;

    @Operation(summary = "社区帖子分页列表")
    @GetMapping("/list/page")
    public BaseResponse<PageResult<AiPost>> listPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "12") long pageSize) {
        return ResultUtils.success(aiPostService.listPostByPage(current, pageSize));
    }
}
