package com.ainav.service.impl;

import com.ainav.mapper.AiToolMapper;
import com.ainav.mapper.CategoryMapper;
import com.ainav.model.entity.AiTool;
import com.ainav.model.entity.Category;
import com.ainav.service.CategoryService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Resource
    private AiToolMapper aiToolMapper;

    @Override
    public List<Category> listOrdered() {
        List<Category> categories = list(new LambdaQueryWrapper<Category>().orderByAsc(Category::getSort));

        // 统计每个标签在 ai_tool 表中的命中数（tags 为逗号分隔字符串）。
        // 只查 tags 列，避免把 589 条工具的整行拉进内存。
        Map<String, Integer> tagHits = new HashMap<>();
        List<AiTool> tools = aiToolMapper.selectList(
                new LambdaQueryWrapper<AiTool>().select(AiTool::getTags));
        for (AiTool tool : tools) {
            String raw = tool.getTags();
            if (raw == null || raw.isEmpty()) continue;
            for (String tag : raw.split(",")) {
                String t = tag.trim();
                if (!t.isEmpty()) tagHits.merge(t, 1, Integer::sum);
            }
        }

        // 标签云只保留至少命中 1 个工具的标签；cloudCount 同步收敛，
        // 避免「展示 N 个」却只有 M<N 个可用标签导致前端出现点开即空的死链。
        for (Category c : categories) {
            String raw = c.getTags();
            if (raw == null || raw.isEmpty()) continue;
            List<String> kept = Arrays.stream(raw.split(","))
                    .map(String::trim)
                    .filter(t -> !t.isEmpty())
                    .filter(t -> tagHits.getOrDefault(t, 0) > 0)
                    .collect(Collectors.toList());
            c.setTags(String.join(",", kept));
            if (c.getCloudCount() != null) {
                c.setCloudCount(Math.min(c.getCloudCount(), kept.size()));
            }
        }
        return categories;
    }
}
