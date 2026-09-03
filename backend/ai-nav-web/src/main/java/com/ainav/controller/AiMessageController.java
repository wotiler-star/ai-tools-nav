package com.ainav.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.ainav.common.BaseResponse;
import com.ainav.common.BusinessException;
import com.ainav.common.ErrorCode;
import com.ainav.common.PageResult;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.AiMessage;
import com.ainav.service.AiMessageService;
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
@RequestMapping("/ai_message")
@Tag(name = "站内消息")
public class AiMessageController {

    @Resource
    private AiMessageService aiMessageService;

    @Operation(summary = "我的消息（分页，需登录）")
    @GetMapping("/list/page")
    public BaseResponse<PageResult<AiMessage>> listPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long pageSize) {
        return ResultUtils.success(aiMessageService.listMyMessages(currentUserId(), current, pageSize));
    }

    @Operation(summary = "未读消息数（需登录）")
    @GetMapping("/unread/count")
    public BaseResponse<Long> unreadCount() {
        return ResultUtils.success(aiMessageService.unreadCount(currentUserId()));
    }

    /** 标记已读请求体：id 为空表示全部已读 */
    @Data
    public static class ReadReq {
        private Long id;
    }

    @Operation(summary = "标记已读（需登录，id 为空则全部已读）")
    @PostMapping("/read")
    public BaseResponse<Boolean> read(@RequestBody(required = false) ReadReq req) {
        Long id = req == null ? null : req.getId();
        return ResultUtils.success(aiMessageService.markRead(currentUserId(), id));
    }

    @Operation(summary = "删除消息（需登录，仅本人）")
    @PostMapping("/delete")
    public BaseResponse<Boolean> delete(@RequestParam long id) {
        return ResultUtils.success(aiMessageService.deleteMessage(currentUserId(), id));
    }

    /** 当前登录用户 id */
    private Long currentUserId() {
        Object loginId = StpUtil.getLoginIdDefaultNull();
        if (loginId == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        return Long.valueOf(loginId.toString());
    }
}
