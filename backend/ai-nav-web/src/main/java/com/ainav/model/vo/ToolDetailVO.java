package com.ainav.model.vo;

import com.ainav.model.entity.AiTool;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * 工具详情（含相关推荐）
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ToolDetailVO extends AiTool {

    private List<AiTool> related;
}
