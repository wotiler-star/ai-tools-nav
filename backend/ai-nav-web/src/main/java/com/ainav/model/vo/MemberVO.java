package com.ainav.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/** 会员中心视图 */
@Data
public class MemberVO implements Serializable {

    private Long points;

    private Integer level;

    private Integer vipType;

    private String vipTypeName;

    private LocalDateTime vipExpireTime;

    private Boolean isVip;

    private List<String> benefits;
}
