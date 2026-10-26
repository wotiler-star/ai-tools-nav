"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { api, swrFetcher } from "@/lib/api";
import { AiArticle, AiColumn, AiColumnCategory, BaseResponse } from "@/types";

/**
 * 后台 · AI 知识库管理 Tab（专栏表 + 文章表 + 两个编辑弹窗）。
 * 从 app/admin/page.tsx 拆出，遵循 components/admin/ 下「一个 Tab 一个组件」的约定。
 *
 * 删专栏会级联删除其下文章，故两个列表都要重新拉取。
 */
export default function AdminKnowledge() {
  const {
    data: kbCatData,
    isLoading: kbCatLoading
  } = useSWR<BaseResponse<AiColumnCategory[]>>("/ai_column/category/list", swrFetcher);
  const kbCats = useMemo<AiColumnCategory[]>(() => kbCatData?.data || [], [kbCatData]);

  const {
    data: kbColData,
    isLoading: kbColLoading,
    mutate: mutateKbCols
  } = useSWR<BaseResponse<AiColumn[]>>("/admin/column/list", swrFetcher);
  const kbCols = useMemo<AiColumn[]>(() => kbColData?.data || [], [kbColData]);

  const {
    data: kbArtData,
    isLoading: kbArtLoading,
    mutate: mutateKbArts
  } = useSWR<BaseResponse<AiArticle[]>>("/admin/article/list", swrFetcher);

  const [columnId, setColumnId] = useState<number | undefined>(undefined);
  const kbArts = useMemo<AiArticle[]>(
    () => (kbArtData?.data || []).filter((a) => !columnId || a.columnId === columnId),
    [kbArtData, columnId]
  );

  // ===== 专栏 =====
  const [colModalOpen, setColModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<AiColumn | null>(null);
  const [colForm] = Form.useForm();
  const [submittingCol, setSubmittingCol] = useState(false);

  const openAddCol = () => {
    setEditingCol(null);
    colForm.resetFields();
    colForm.setFieldsValue({
      needVip: 0,
      status: 1,
      sort: kbCols.length + 1,
      coverColor: "#3874F7"
    });
    setColModalOpen(true);
  };

  const openEditCol = (record: AiColumn) => {
    setEditingCol(record);
    colForm.setFieldsValue(record);
    setColModalOpen(true);
  };

  const submitCol = async () => {
    const values = await colForm.validateFields();
    setSubmittingCol(true);
    try {
      if (editingCol) {
        await api.admin.updateColumn({ ...editingCol, ...values });
        message.success("专栏已更新");
      } else {
        await api.admin.addColumn(values);
        message.success("专栏已新增");
      }
      setColModalOpen(false);
      mutateKbCols();
    } catch (e: any) {
      message.error(e?.message || "操作失败");
    } finally {
      setSubmittingCol(false);
    }
  };

  const deleteCol = async (id: number) => {
    try {
      await api.admin.deleteColumn(id);
      message.success("专栏已删除（含其下文章）");
      mutateKbCols();
      mutateKbArts();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  // ===== 文章 =====
  const [artModalOpen, setArtModalOpen] = useState(false);
  const [editingArt, setEditingArt] = useState<AiArticle | null>(null);
  const [artForm] = Form.useForm();
  const [submittingArt, setSubmittingArt] = useState(false);

  const openAddArt = () => {
    setEditingArt(null);
    artForm.resetFields();
    artForm.setFieldsValue({
      columnId: kbCols[0]?.id ?? columnId,
      status: 1,
      viewNum: 0,
      likeNum: 0,
      collectNum: 0,
      sort: (kbArtData?.data?.length || 0) + 1
    });
    setArtModalOpen(true);
  };

  const openEditArt = (record: AiArticle) => {
    setEditingArt(record);
    artForm.setFieldsValue(record);
    setArtModalOpen(true);
  };

  const submitArt = async () => {
    const values = await artForm.validateFields();
    setSubmittingArt(true);
    try {
      if (editingArt) {
        await api.admin.updateArticle({ ...editingArt, ...values });
        message.success("文章已更新");
      } else {
        await api.admin.addArticle(values);
        message.success("文章已新增");
      }
      setArtModalOpen(false);
      mutateKbArts();
      mutateKbCols();
    } catch (e: any) {
      message.error(e?.message || "操作失败");
    } finally {
      setSubmittingArt(false);
    }
  };

  const deleteArt = async (id: number) => {
    try {
      await api.admin.deleteArticle(id);
      message.success("文章已删除");
      mutateKbArts();
      mutateKbCols();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  return (
    <>
      {/* 专栏管理 */}
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span style={{ fontSize: 13, color: "#86909c" }}>
          专栏即 AI 知识库的合集，文章挂在专栏之下
        </span>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddCol}>
          新增专栏
        </Button>
      </div>
      {kbColLoading || kbCatLoading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : (
        <Table<AiColumn>
          rowKey="id"
          dataSource={kbCols}
          pagination={false}
          style={{ marginBottom: 24 }}
          columns={[
            { title: "ID", dataIndex: "id", width: 70 },
            { title: "标题", dataIndex: "title" },
            { title: "描述", dataIndex: "description", ellipsis: true },
            { title: "文章数", dataIndex: "articleCount", width: 80 },
            {
              title: "阅读",
              dataIndex: "viewNum",
              width: 80,
              render: (v: number) => v || 0
            },
            {
              title: "会员",
              dataIndex: "needVip",
              width: 70,
              render: (v: number) => (v ? <Tag color="gold">会员</Tag> : <Tag>免费</Tag>)
            },
            {
              title: "操作",
              width: 140,
              render: (_, r) => (
                <Space size={0}>
                  <Button type="link" size="small" onClick={() => openEditCol(r)}>
                    编辑
                  </Button>
                  <Popconfirm
                    title="删除该专栏及其文章？"
                    onConfirm={() => deleteCol(r.id)}
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

      <Divider />

      {/* 文章管理 */}
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12
        }}
      >
        <Space>
          <span style={{ fontSize: 13, color: "#86909c" }}>文章列表：</span>
          <Select
            allowClear
            placeholder="按专栏筛选"
            style={{ width: 200 }}
            value={columnId}
            onChange={setColumnId}
            options={kbCols.map((c) => ({ value: c.id, label: c.title }))}
          />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddArt}>
          新增文章
        </Button>
      </div>
      {kbArtLoading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : (
        <Table<AiArticle>
          rowKey="id"
          dataSource={kbArts}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: "ID", dataIndex: "id", width: 70 },
            { title: "标题", dataIndex: "title" },
            {
              title: "专栏",
              dataIndex: "columnId",
              width: 180,
              render: (v: number) => kbCols.find((c) => c.id === v)?.title || v
            },
            {
              title: "阅读",
              dataIndex: "viewNum",
              width: 80,
              render: (v: number) => v || 0
            },
            { title: "排序", dataIndex: "sort", width: 70 },
            {
              title: "操作",
              width: 140,
              render: (_, r) => (
                <Space size={0}>
                  <Button type="link" size="small" onClick={() => openEditArt(r)}>
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除该文章？"
                    onConfirm={() => deleteArt(r.id)}
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

      {/* 专栏弹窗 */}
      <Modal
        title={editingCol ? "编辑专栏" : "新增专栏"}
        open={colModalOpen}
        onOk={submitCol}
        confirmLoading={submittingCol}
        onCancel={() => setColModalOpen(false)}
        okText="保存"
        cancelText="取消"
        width={560}
        destroyOnClose
      >
        <Form form={colForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="专栏标题"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input maxLength={256} placeholder="如：AI 编程从入门到实战" />
          </Form.Item>
          <Form.Item name="description" label="简介">
            <Input.TextArea rows={2} maxLength={512} />
          </Form.Item>
          <Form.Item name="coverColor" label="封面色值（用于生成渐变封面）">
            <Input maxLength={32} placeholder="#3874F7" />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="所属主题分类"
            rules={[{ required: true, message: "请选择分类" }]}
          >
            <Select
              placeholder="选择主题"
              options={kbCats.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>
          <Form.Item name="tags" label="标签（逗号分隔）">
            <Input placeholder="如：实战,项目" />
          </Form.Item>
          <Space size="large">
            <Form.Item name="needVip" label="会员专享">
              <Select
                style={{ width: 120 }}
                options={[
                  { value: 0, label: "免费" },
                  { value: 1, label: "会员" }
                ]}
              />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                style={{ width: 120 }}
                options={[
                  { value: 1, label: "启用" },
                  { value: 0, label: "停用" }
                ]}
              />
            </Form.Item>
            <Form.Item name="sort" label="排序">
              <InputNumber min={1} style={{ width: 120 }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>

      {/* 文章弹窗 */}
      <Modal
        title={editingArt ? "编辑文章" : "新增文章"}
        open={artModalOpen}
        onOk={submitArt}
        confirmLoading={submittingArt}
        onCancel={() => setArtModalOpen(false)}
        okText="保存"
        cancelText="取消"
        width={680}
        destroyOnClose
      >
        <Form form={artForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="文章标题"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input maxLength={256} />
          </Form.Item>
          <Form.Item
            name="columnId"
            label="所属专栏"
            rules={[{ required: true, message: "请选择专栏" }]}
          >
            <Select
              placeholder="选择专栏"
              options={kbCols.map((c) => ({ value: c.id, label: c.title }))}
            />
          </Form.Item>
          <Form.Item name="summary" label="摘要">
            <Input.TextArea rows={2} maxLength={512} />
          </Form.Item>
          <Form.Item name="content" label="正文（Markdown）">
            <Input.TextArea
              rows={10}
              placeholder="支持 # 标题、**加粗**、代码块等 Markdown 语法"
            />
          </Form.Item>
          <Space size="large">
            <Form.Item name="sort" label="排序">
              <InputNumber min={1} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                style={{ width: 120 }}
                options={[
                  { value: 1, label: "启用" },
                  { value: 0, label: "停用" }
                ]}
              />
            </Form.Item>
            <Form.Item name="viewNum" label="阅读量">
              <InputNumber min={0} style={{ width: 120 }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
}
