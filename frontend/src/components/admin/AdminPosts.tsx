"use client";

import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  message
} from "antd";
import useSWR from "swr";
import { api, swrFetcher } from "@/lib/api";
import { AiPost, BaseResponsePage } from "@/types";

/** 社区帖子管理：搜索 / 编辑 / 删除（删除会连带清理该帖评论） */
export default function AdminPosts() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AiPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, mutate } = useSWR<BaseResponsePage<AiPost>>(
    `/admin/post/list?current=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(search)}`,
    swrFetcher
  );
  const list = data?.data?.records ?? [];
  const total = data?.data?.total ?? 0;

  const openEdit = (p: AiPost) => {
    setEditing(p);
    form.setFieldsValue({
      title: p.title,
      content: p.content,
      thumbUrl: p.thumbUrl
    });
  };

  const submit = async () => {
    if (!editing) return;
    const values = await form.validateFields();
    setSaving(true);
    try {
      await api.admin.updateAdminPost({
        id: editing.id,
        title: values.title,
        content: values.content,
        thumbUrl: values.thumbUrl
      });
      message.success("已保存");
      setEditing(null);
      mutate();
    } catch (e: any) {
      message.error(e?.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (p: AiPost) => {
    try {
      await api.admin.deleteAdminPost(p.id);
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
          placeholder="搜索标题 / 正文"
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
        <Table<AiPost>
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
            { title: "标题", dataIndex: "title", ellipsis: true },
            {
              title: "作者",
              dataIndex: "authorName",
              width: 120,
              ellipsis: true
            },
            {
              title: "点赞",
              dataIndex: "likeNum",
              width: 80,
              render: (v?: number) => v ?? 0
            },
            {
              title: "评论",
              dataIndex: "commentNum",
              width: 80,
              render: (v?: number) => v ?? 0
            },
            {
              title: "发布时间",
              dataIndex: "createTime",
              width: 120,
              render: (v?: string) => (v || "").toString().slice(0, 10)
            },
            {
              title: "操作",
              width: 140,
              fixed: "right",
              render: (_, r) => (
                <Space size={0}>
                  <Button type="link" size="small" onClick={() => openEdit(r)}>
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除该帖子？（连带删除其评论）"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={() => onDelete(r)}
                  >
                    <Button type="link" size="small" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              )
            }
          ]}
          scroll={{ x: 900 }}
        />
      )}

      <Modal
        title="编辑帖子"
        open={!!editing}
        onOk={submit}
        confirmLoading={saving}
        onCancel={() => setEditing(null)}
        okText="保存"
        cancelText="取消"
        width={680}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input maxLength={128} />
          </Form.Item>
          <Form.Item name="thumbUrl" label="封面 URL">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="正文">
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
