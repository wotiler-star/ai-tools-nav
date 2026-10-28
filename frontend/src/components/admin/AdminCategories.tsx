"use client";

import { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  message
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { api, swrFetcher } from "@/lib/api";
import { BaseResponse, Category } from "@/types";

/**
 * 后台 · 分类管理 Tab（表格 + 新增/编辑弹窗）。
 * 从 app/admin/page.tsx 拆出，与 AdminTools 共用 `/category/list` 这个 SWR key，
 * 因此这里改完分类，父页的工具分类下拉与分布图会一起刷新。
 */
export default function AdminCategories() {
  const {
    data: catData,
    isLoading,
    mutate: mutateCats
  } = useSWR<BaseResponse<Category[]>>("/category/list", swrFetcher);
  const cats = catData?.data || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ icon: "📁", sort: cats.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (record: Category) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      if (editing) {
        await api.admin.updateCategory({ ...editing, ...values });
        message.success("分类已更新");
      } else {
        await api.admin.addCategory(values);
        message.success("分类已新增");
      }
      setModalOpen(false);
      mutateCats();
    } catch (e: any) {
      message.error(e?.message || "操作失败");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.admin.deleteCategory(id);
      message.success("分类已删除");
      mutateCats();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  return (
    <>
      <div style={{ marginBottom: 12, textAlign: "right" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          新增分类
        </Button>
      </div>
      {isLoading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spin />
        </div>
      ) : (
        <Table<Category>
          rowKey="id"
          dataSource={cats}
          pagination={false}
          columns={[
            { title: "ID", dataIndex: "id", width: 70 },
            {
              title: "图标",
              dataIndex: "icon",
              width: 70,
              render: (v: string) => <span style={{ fontSize: 18 }}>{v}</span>
            },
            { title: "名称", dataIndex: "name" },
            { title: "排序", dataIndex: "sort", width: 90 },
            {
              title: "操作",
              width: 140,
              render: (_, r) => (
                <Space size={0}>
                  <Button type="link" size="small" onClick={() => openEdit(r)}>
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除该分类？"
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
        title={editing ? "编辑分类" : "新增分类"}
        open={modalOpen}
        onOk={submit}
        confirmLoading={submitting}
        onCancel={() => setModalOpen(false)}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: "请输入分类名称" }]}
          >
            <Input placeholder="如：对话、绘画" maxLength={20} />
          </Form.Item>
          <Form.Item name="icon" label="图标（Emoji）">
            <Input placeholder="如：💬" maxLength={4} />
          </Form.Item>
          <Form.Item name="sort" label="排序（越小越靠前）">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
