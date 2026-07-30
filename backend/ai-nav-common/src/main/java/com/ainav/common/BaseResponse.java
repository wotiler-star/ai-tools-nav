package com.ainav.common;

import lombok.Data;

import java.io.Serializable;

/**
 * 统一返回结构（与前端约定的 { code, data, message } 一致）
 */
@Data
public class BaseResponse<T> implements Serializable {

    private int code;

    private T data;

    private String message;

    public BaseResponse(int code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public BaseResponse(int code, T data) {
        this(code, data, "");
    }

    public BaseResponse(int code, String message) {
        this(code, null, message);
    }
}
