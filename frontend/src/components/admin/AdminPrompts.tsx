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
  Tag,
  message
} from "antd";
import useSWR from "swr";
import { api, swrFetcher } from "@/lib/api";
import { AiPrompt, BaseResponsePage } from "@/types";

/** AI 提示词管理：搜索 / 编辑 / 删除 */
export default function AdminPrompts() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AiPrompt | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, mutate } = useSWR<BaseResponsePage<AiPrompt>>(
    `/admin/prompt/list?current=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(search)}`,
    swrFetcher
  );
  const list = data?.data?.records ?? [];
  const total = data?.data?.total ?? 0;

  const openEdit = (p: AiPrompt) => {
    setEditing(p);
    form.setFieldsValue({
      title: p.title,
      categoryName: p.categoryName,
      content: p.content
    });
  };

  const submit = async () => {
    if (!editing) return;
    const values = await form.validateFields();
    setSaving(true);
    try {
      await api.admin.updateAdminPrompt({
        id: editing.id,
        title: values.title,
        categoryName: values.categoryName,
        content: values.content
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

  const onDelete = async (p: AiPrompt) => {
    try {
      await api.admin.deleteAdminPrompt(p.id);
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
          placeholder="搜索标题 / 内容"
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
        <Table<AiPrompt>
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
              title: "分类",
              dataIndex: "categoryName",
              width: 110,
              render: (v?: string) =>
                v ? <Tag color="blue">{v}</Tag> : <span>—</span>
            },
            {
              title: "使用次数",
              dataIndex: "useCount",
              width: 100,
              render: (v?: number) => v ?? 0
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
                    title="确认删除该提示词？"
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
          scroll={{ x: 800 }}
        />
      )}

      <Modal
        title="编辑提示词"
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
          <Form.Item name="categoryName" label="分类">
            <Input maxLength={20} placeholder="如：写作 / 绘画 / 编程" />
          </Form.Item>
          <Form.Item name="content" label="提示词内容">
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
