"use client";

import { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  message
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { api, swrFetcher } from "@/lib/api";
import { AiTool, BaseResponsePage, Category } from "@/types";

/**
 * 后台 · AI 工具管理 Tab（表格 + 新增/编辑弹窗）。
 *
 * 从 app/admin/page.tsx 拆出：该页原近 900 行，除已抽出的概述/用户/帖子/提示词/评论外，
 * 剩余的工具与分类管理也各自独立，符合 components/admin/ 下「一个 Tab 一个组件」的现有约定。
 *
 * 工具列表走 `/ai_tool/list/page`，与父页面的概览图表共用同一个 SWR key，
 * 因此这里 mutate 后父页的统计也会同步刷新，不会重复发请求。
 */
export default function AdminTools({ cats }: { cats: Category[] }) {
  const {
    data: toolData,
    isLoading,
    mutate: mutateTools
  } = useSWR<BaseResponsePage<AiTool>>("/ai_tool/list/page", swrFetcher);
  const tools = toolData?.data?.records || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AiTool | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      categoryId: cats[0]?.id ?? 1,
      heat: 0,
      isHot: false,
      isRecommended: false
    });
    setModalOpen(true);
  };

  const openEdit = (record: AiTool) => {
    setEditing(record);
    form.setFieldsValue({ ...record, tags: (record.tags || []).join(",") });
    setModalOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    // 表单里 tags 是逗号分隔字符串，后端实体存的是 string[]，提交前统一拆成数组
    const payload: Partial<AiTool> = {
      ...values,
      tags:
        typeof values.tags === "string"
          ? values.tags
              .split(/[,，]/)
              .map((s: string) => s.trim())
              .filter(Boolean)
          : values.tags || []
    };
    setSubmitting(true);
    try {
      if (editing) {
        await api.admin.updateTool({ ...editing, ...payload });
        message.success("工具已更新");
      } else {
        await api.admin.addTool(payload);
        message.success("工具已新增");
      }
      setModalOpen(false);
      mutateTools();
    } catch (e: any) {
      message.error(e?.message || "操作失败");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.admin.deleteTool(id);
      message.success("工具已删除");
      mutateTools();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  return (
    <>
      <div style={{ marginBottom: 12, textAlign: "right" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          新增工具
        </Button>
      </div>
      {isLoading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spin />
        </div>
      ) : (
        <Table<AiTool>
          rowKey="id"
          dataSource={tools}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: "ID", dataIndex: "id", width: 70 },
            { title: "名称", dataIndex: "name", width: 140 },
            { title: "描述", dataIndex: "description", ellipsis: true },
            {
              title: "分类",
              dataIndex: "categoryId",
              width: 90,
              render: (v: number) => cats.find((c) => c.id === v)?.name || v
            },
            { title: "热度", dataIndex: "heat", width: 90 },
            {
              title: "标记",
              width: 130,
              render: (_, r) => (
                <>
                  {r.isHot && <Tag color="red">热门</Tag>}
                  {r.isRecommended && <Tag color="blue">推荐</Tag>}
                </>
              )
            },
            {
              title: "操作",
              width: 140,
              render: (_, r) => (
                <Space size={0}>
                  <Button type="link" size="small" onClick={() => openEdit(r)}>
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除该工具？"
                    onConfirm={() => onDelete(r.id)}
                    okText="删除"
                    cancelText="取消"
                  >
                    <Button type="link" size="small" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              )
            }
          ]}
        />
      )}

      <Modal
        title={editing ? "编辑工具" : "新增工具"}
        open={modalOpen}
        onOk={submit}
        confirmLoading={submitting}
        onCancel={() => setModalOpen(false)}
        okText="保存"
        cancelText="取消"
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="工具名称"
            rules={[{ required: true, message: "请输入工具名称" }]}
          >
            <Input placeholder="如：ChatGPT" maxLength={40} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="一句话介绍该工具" maxLength={200} />
          </Form.Item>
          <Form.Item
            name="url"
            label="官网地址"
            rules={[{ required: true, message: "请输入官网地址" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: "请选择分类" }]}
          >
            <Select
              options={cats.map((c) => ({
                value: c.id,
                label: `${c.icon} ${c.name}`
              }))}
              placeholder="选择分类"
            />
          </Form.Item>
          <Form.Item name="tags" label="标签（逗号分隔）">
            <Input placeholder="如：聊天,GPT-4" />
          </Form.Item>
          <Space size="large">
            <Form.Item name="heat" label="热度">
              <InputNumber min={0} style={{ width: 140 }} />
            </Form.Item>
            <Form.Item name="isHot" label="热门" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isRecommended" label="推荐" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
}
