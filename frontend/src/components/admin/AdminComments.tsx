"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  message
} from "antd";
import useSWR from "swr";
import { api, swrFetcher } from "@/lib/api";
import { AiComment, BaseResponsePage } from "@/types";

/** 评论管理：搜索 / 删除（评论不支持编辑） */
export default function AdminComments() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, mutate } = useSWR<BaseResponsePage<AiComment>>(
    `/admin/comment/list?current=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(search)}`,
    swrFetcher
  );
  const list = data?.data?.records ?? [];
  const total = data?.data?.total ?? 0;

  const onDelete = async (c: AiComment) => {
    try {
      await api.admin.deleteAdminComment(c.id);
      message.success("已删除");
      mutate();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 12 }} wrap>
        <Input.Search
          placeholder="搜索评论内容"
          allowClear
          style={{ width: 280 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={(v) => {
            setSearch(v.trim());
            setPage(1);
          }}
        />
      </Space>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spin />
        </div>
      ) : (
        <Table<AiComment>
          rowKey="id"
          dataSource={list}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            }
          }}
          columns={[
            { title: "ID", dataIndex: "id", width: 70 },
            {
              title: "目标",
              dataIndex: "targetType",
              width: 90,
              render: (v?: string) =>
                v === "post" ? (
                  <Tag color="purple">帖子</Tag>
                ) : (
                  <Tag color="cyan">文章</Tag>
                )
            },
            {
              title: "目标 ID",
              dataIndex: "targetId",
              width: 90
            },
            {
              title: "评论者",
              dataIndex: "userName",
              width: 130,
              ellipsis: true
            },
            {
              title: "内容",
              dataIndex: "content",
              ellipsis: true
            },
            {
              title: "时间",
              dataIndex: "createTime",
              width: 120,
              render: (v?: string) => (v || "").toString().slice(0, 10)
            },
            {
              title: "操作",
              width: 90,
              fixed: "right",
              render: (_, r) => (
                <Popconfirm
                  title="确认删除该评论？"
                  okText="删除"
                  cancelText="取消"
                  onConfirm={() => onDelete(r)}
                >
                  <Button type="link" size="small" danger>
                    删除
                  </Button>
                </Popconfirm>
              )
            }
          ]}
          scroll={{ x: 900 }}
        />
      )}
    </div>
  );
}
