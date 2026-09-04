"use client";

import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message
} from "antd";
import useSWR from "swr";
import { api, swrFetcher } from "@/lib/api";
import { BaseResponsePage, UserVO } from "@/types";

/** 用户管理：搜索 / 改资料 / 改角色 / 删除 */
export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<UserVO | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, mutate } = useSWR<BaseResponsePage<UserVO>>(
    `/admin/user/list?current=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(search)}`,
    swrFetcher
  );
  const list = data?.data?.records ?? [];
  const total = data?.data?.total ?? 0;

  const openEdit = (u: UserVO) => {
    setEditing(u);
    form.setFieldsValue({
      userName: u.userName,
      userRole: u.userRole ?? "user",
      email: u.email,
      phone: u.phone,
      userProfile: u.userProfile,
      userAvatar: u.userAvatar
    });
  };

  const submit = async () => {
    if (!editing) return;
    const values = await form.validateFields();
    setSaving(true);
    try {
      await api.admin.updateUser({
        id: editing.id,
        userName: values.userName,
        userAvatar: values.userAvatar,
        userProfile: values.userProfile,
        email: values.email,
        phone: values.phone,
        role: values.userRole
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

  const onDelete = async (u: UserVO) => {
    try {
      await api.admin.deleteUser(u.id);
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
          placeholder="搜索账号 / 昵称 / 邮箱"
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
        <Table<UserVO>
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
              title: "昵称",
              dataIndex: "userName",
              width: 140,
              ellipsis: true
            },
            {
              title: "角色",
              dataIndex: "userRole",
              width: 100,
              render: (v: string) =>
                v === "admin" ? (
                  <Tag color="red">管理员</Tag>
                ) : (
                  <Tag color="blue">普通用户</Tag>
                )
            },
            { title: "邮箱", dataIndex: "email", width: 180, ellipsis: true },
            { title: "手机", dataIndex: "phone", width: 130 },
            {
              title: "积分",
              dataIndex: "points",
              width: 90,
              render: (v?: number) => v ?? 0
            },
            {
              title: "等级",
              dataIndex: "level",
              width: 80,
              render: (v?: number) => `Lv${v ?? 1}`
            },
            {
              title: "注册时间",
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
                    title={`确认删除用户「${r.userName}」？`}
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
          scroll={{ x: 1100 }}
        />
      )}

      <Modal
        title="编辑用户"
        open={!!editing}
        onOk={submit}
        confirmLoading={saving}
        onCancel={() => setEditing(null)}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="userName" label="昵称">
            <Input maxLength={64} />
          </Form.Item>
          <Form.Item name="userRole" label="角色">
            <Select
              options={[
                { value: "user", label: "普通用户" },
                { value: "admin", label: "管理员" }
              ]}
            />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input maxLength={128} />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input maxLength={32} />
          </Form.Item>
          <Form.Item name="userAvatar" label="头像 URL">
            <Input />
          </Form.Item>
          <Form.Item name="userProfile" label="个人简介">
            <Input.TextArea rows={3} maxLength={256} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
