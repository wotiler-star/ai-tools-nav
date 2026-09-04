package com.ainav.service.cache;

import java.time.Duration;

/**
 * 缓存 key 前缀与 TTL 的统一定义。
 *
 * <p>读接口按前缀写缓存，后台写接口按同一前缀失效——两边必须引用这里的常量，
 * 否则会出现「后台改完前台还是旧数据」的脏读。
 */
public final class CacheKeys {

    private CacheKeys() {
    }

    /** 全站缓存的统一根前缀，便于按业务整体清理 */
    public static final String ROOT = "ainav";

    // ===== AI 工具 =====
    public static final String TOOL_LIST = ROOT + ":tool:list";
    public static final String TOOL_SEARCH = ROOT + ":tool:search";
    public static final String TOOL_DETAIL = ROOT + ":tool:detail";

    // ===== 分类 =====
    public static final String CATEGORY_LIST = ROOT + ":category:list";

    // ===== 知识库 =====
    public static final String COLUMN_CATEGORY_LIST = ROOT + ":column:category:list";
    public static final String COLUMN_LIST = ROOT + ":column:list";
    public static final String COLUMN_DETAIL = ROOT + ":column:detail";
    public static final String ARTICLE_LIST = ROOT + ":article:list";
    public static final String ARTICLE_DETAIL = ROOT + ":article:detail";

    // ===== 社区 / 提示词 =====
    public static final String POST_LIST = ROOT + ":post:list";
    public static final String POST_DETAIL = ROOT + ":post:detail";
    public static final String PROMPT_LIST = ROOT + ":prompt:list";
    public static final String PROMPT_DETAIL = ROOT + ":prompt:detail";

    // ===== TTL =====
    /** 列表类：读多写少，5 分钟足够，后台改数据会立刻失效 */
    public static final Duration TTL_LIST = Duration.ofMinutes(5);
    /** 详情类：改动相对频繁（含阅读量自增），2 分钟 */
    public static final Duration TTL_DETAIL = Duration.ofMinutes(2);
    /** 分类/知识库分类：几乎不变，30 分钟 */
    public static final Duration TTL_DICT = Duration.ofMinutes(30);
}
