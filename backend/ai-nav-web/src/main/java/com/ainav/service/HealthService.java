package com.ainav.service;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * 健康检查服务：就绪探针所需的依赖校验在这里完成，
 * 控制器只负责把结果映射为 HTTP 状态码。
 */
public interface HealthService {

    /** 就绪探针结果 */
    @Data
    @AllArgsConstructor
    class Result {
        /** 是否就绪（所有依赖均可用） */
        private boolean ready;
        /** 不可用的依赖名称 */
        private List<String> unavailable;
    }

    /** 存活探针：进程存活即为 true，不触碰外部依赖 */
    boolean alive();

    /** 就绪探针：返回各关键依赖的可用性结论 */
    Result check();
}
