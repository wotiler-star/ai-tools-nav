package com.ainav.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.ainav.common.BaseResponse;
import com.ainav.common.BusinessException;
import com.ainav.common.ErrorCode;
import com.ainav.common.PageResult;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.AiPrompt;
import com.ainav.service.AiPromptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import lombok.Data;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @Operation(summary = "提示词详情")
    @GetMapping("/get")
    public BaseResponse<AiPrompt> get(@RequestParam long id) {
        return ResultUtils.success(aiPromptService.getById(id));
    }

    /** 发布提示词请求体 */
    @Data
    public static class AddPromptReq {
        private String title;
        private String content;
        /** 可选：分类（如 写作 / 绘画 / 编程），前端未传则为 null */
        private String categoryName;
    }

    @Operation(summary = "发布提示词（需登录）")
    @PostMapping("/add")
    public BaseResponse<Long> add(@RequestBody AddPromptReq req) {
        // 拦截器已校验登录态，此处再双保险
        StpUtil.checkLogin();
        long userId = StpUtil.getLoginIdAsLong();

        AiPrompt prompt = new AiPrompt();
        prompt.setUserId(userId);
        prompt.setTitle(req.getTitle() == null ? "" : req.getTitle().trim());
        prompt.setContent(req.getContent() == null ? "" : req.getContent());
        prompt.setCategoryName(req.getCategoryName() != null && !req.getCategoryName().isBlank()
                ? req.getCategoryName().trim()
                : null);
        prompt.setUseCount(0L);
        aiPromptService.save(prompt);
        return ResultUtils.success(prompt.getId());
    }

    /** 编辑提示词请求体 */
    @Data
    public static class UpdatePromptReq {
        private Long id;
        private String title;
        private String content;
        private String categoryName;
    }

    @Operation(summary = "编辑提示词（作者本人或管理员）")
    @PostMapping("/update")
    public BaseResponse<Boolean> update(@RequestBody UpdatePromptReq req) {
        if (req == null || req.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少提示词 id");
        }
        StpUtil.checkLogin();
        long userId = StpUtil.getLoginIdAsLong();
        AiPrompt prompt = aiPromptService.getById(req.getId());
        if (prompt == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "提示词不存在");
        }
        boolean isAdmin = StpUtil.hasRole("admin");
        if (!isAdmin && (prompt.getUserId() == null || prompt.getUserId() != userId)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "只能编辑自己的提示词");
        }
        if (req.getTitle() != null) {
            prompt.setTitle(req.getTitle().trim());
        }
        if (req.getContent() != null) {
            prompt.setContent(req.getContent());
        }
        if (req.getCategoryName() != null) {
            prompt.setCategoryName(req.getCategoryName().isBlank() ? null : req.getCategoryName().trim());
        }
        aiPromptService.updateById(prompt);
        return ResultUtils.success(true);
    }

    @Operation(summary = "删除提示词（作者本人或管理员）")
    @PostMapping("/delete")
    public BaseResponse<Boolean> delete(@RequestParam long id) {
        StpUtil.checkLogin();
        long userId = StpUtil.getLoginIdAsLong();
        AiPrompt prompt = aiPromptService.getById(id);
        if (prompt == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "提示词不存在");
        }
        boolean isAdmin = StpUtil.hasRole("admin");
        if (!isAdmin && (prompt.getUserId() == null || prompt.getUserId() != userId)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "只能删除自己的提示词");
        }
        aiPromptService.removeById(id);
        return ResultUtils.success(true);
    }
}
