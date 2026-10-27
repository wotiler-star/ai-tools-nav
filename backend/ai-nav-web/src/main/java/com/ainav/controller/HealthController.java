package com.ainav.controller;

import com.ainav.common.BaseResponse;
import com.ainav.common.ResultUtils;
import com.ainav.service.HealthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 健康检查端点：供 Docker HEALTHCHECK / 网关 / 监控使用。
 * 注意：这两个路径未出现在 SaTokenConfig 的拦截名单中，默认匿名可访问，
 * 若后续调整拦截规则，请将 /health、/ready 一并加进 excludePathPatterns。
 */
@RestController
@Tag(name = "健康检查")
public class HealthController {

    @Resource
    private HealthService healthService;

    /**
     * 存活探针（liveness）：进程能响应即返回 200，不校验任何外部依赖，
     * 避免因依赖抖动导致容器被判定为死亡而重启。
     */
    @Operation(summary = "存活探针 liveness")
    @GetMapping("/health")
    public BaseResponse<String> health() {
        return ResultUtils.success("ok");
    }

    /**
     * 就绪探针（readiness）：校验关键依赖（MySQL / Redis）是否可用，
     * 全部可用返回 200，否则返回 503，便于上游判断是否转发流量。
     */
    @Operation(summary = "就绪探针 readiness")
    @GetMapping("/ready")
    public ResponseEntity<BaseResponse<String>> ready() {
        HealthService.Result result = healthService.check();
        if (!result.isReady()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ResultUtils.error(503, "unavailable: " + String.join(",", result.getUnavailable())));
        }
        return ResponseEntity.ok(ResultUtils.success("ready"));
    }
}
