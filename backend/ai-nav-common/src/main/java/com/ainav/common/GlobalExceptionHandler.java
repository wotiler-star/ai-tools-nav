package com.ainav.common;

import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.exception.SaTokenException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器（统一返回 { code, data, message }）
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BusinessException.class)
    public BaseResponse<?> businessExceptionHandler(BusinessException e) {
        return ResultUtils.error(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public BaseResponse<?> validationExceptionHandler(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldError() != null
                ? e.getBindingResult().getFieldError().getDefaultMessage()
                : "参数校验失败";
        return ResultUtils.error(ErrorCode.PARAMS_ERROR.getCode(), msg);
    }

    /**
     * Sa-Token 未登录：返回 40100，避免被通用 RuntimeException 兜底成 500「系统内部异常」。
     * 前端据此提示重新登录。
     */
    @ExceptionHandler(NotLoginException.class)
    public BaseResponse<?> notLoginExceptionHandler(NotLoginException e) {
        return ResultUtils.error(ErrorCode.NOT_LOGIN_ERROR.getCode(), "未登录或登录已过期");
    }

    /** 其余 Sa-Token 异常：无角色 / 无权限 / 被封禁 / 二级认证等（1.38 起基类为 SaTokenException） */
    @ExceptionHandler(SaTokenException.class)
    public BaseResponse<?> saExceptionHandler(SaTokenException e) {
        return ResultUtils.error(ErrorCode.NO_AUTH_ERROR.getCode(), e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public BaseResponse<?> runtimeExceptionHandler(RuntimeException e, HttpServletRequest request) {
        log.error("系统异常 url={}", request.getRequestURI(), e);
        return ResultUtils.error(ErrorCode.SYSTEM_ERROR.getCode(), ErrorCode.SYSTEM_ERROR.getMessage());
    }
}
