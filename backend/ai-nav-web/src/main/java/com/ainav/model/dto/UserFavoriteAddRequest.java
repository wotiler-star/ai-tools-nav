package com.ainav.model.dto;

import lombok.Data;

import java.io.Serializable;

/** 收藏请求：targetType = tool / post / prompt */
@Data
public class UserFavoriteAddRequest implements Serializable {

    private String targetType;

    private Long targetId;
}
