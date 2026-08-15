package com.ainav.service.es;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ainav.common.PageResult;
import com.ainav.mapper.AiToolMapper;
import com.ainav.model.entity.AiTool;
import com.ainav.model.es.EsAiToolDoc;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Elasticsearch 工具搜索服务（仅在 ainav.es.enabled=true 时生效）。
 *
 * <p>职责：
 * 1. 启动时把全量 ai_tool 同步进 ES 索引（幂等：先删后建）；
 * 2. 提供 {@link #search(String, long, long)} 走 ES 多字段检索；
 * 3. 索引初始化 / 检索失败都被 try-catch 吞掉，由调用方回退到 DB 搜索，保证可用性。
 */
@Service
@ConditionalOnProperty(prefix = "ainav.es", name = "enabled", havingValue = "true")
public class EsToolSearchService {

    private static final Logger log = LoggerFactory.getLogger(EsToolSearchService.class);

    @Resource
    private ElasticsearchClient elasticsearchClient;

    @Resource
    private AiToolMapper aiToolMapper;

    @org.springframework.beans.factory.annotation.Value("${ainav.es.index:ai_tool}")
    private String indexName;

    /** 启动后全量同步到 ES（失败不影响主流程） */
    @PostConstruct
    public void syncIndex() {
        try {
            boolean exists = elasticsearchClient.indices()
                    .exists(e -> e.index(indexName))
                    .value();
            if (exists) {
                elasticsearchClient.indices().delete(d -> d.index(indexName));
            }
            elasticsearchClient.indices().create(c -> c.index(indexName)
                    .mappings(m -> m
                            .properties("name", p -> p.text(t -> t))
                            .properties("description", p -> p.text(t -> t))
                            .properties("tags", p -> p.text(t -> t))
                            .properties("categoryId", p -> p.long_(l -> l))
                            .properties("heat", p -> p.integer(i -> i))));
            List<AiTool> all = aiToolMapper.selectList(null);
            for (AiTool tool : all) {
                EsAiToolDoc doc = new EsAiToolDoc();
                BeanUtils.copyProperties(tool, doc);
                elasticsearchClient.index(i -> i
                        .index(indexName)
                        .id(String.valueOf(tool.getId()))
                        .document(doc));
            }
            log.info("ES 索引 {} 同步完成，共 {} 条", indexName, all.size());
        } catch (Exception e) {
            log.warn("ES 索引初始化失败（搜索将回退 DB）：{}", e.getMessage());
        }
    }

    /** ES 多字段检索，返回与 DB 一致的 PageResult<AiTool> */
    public PageResult<AiTool> search(String keyword, long current, long pageSize) throws Exception {
        int from = (int) ((current - 1) * pageSize);
        int limit = (int) pageSize;
        Query query = Query.of(q -> q.multiMatch(m -> m
                .query(keyword)
                .fields("name", "description", "tags")));
        SearchResponse<EsAiToolDoc> resp = elasticsearchClient.search(s -> s
                .index(indexName)
                .query(query)
                .from(from)
                .size(limit), EsAiToolDoc.class);

        List<AiTool> records = new ArrayList<>();
        for (var hit : resp.hits().hits()) {
            EsAiToolDoc doc = hit.source();
            if (doc != null) {
                AiTool tool = new AiTool();
                BeanUtils.copyProperties(doc, tool);
                records.add(tool);
            }
        }
        long total = resp.hits().total() != null ? resp.hits().total().value() : records.size();
        long pages = pageSize > 0 ? (long) Math.ceil((double) total / pageSize) : 0;
        return new PageResult<>(records, total, pageSize, current, pages);
    }
}
