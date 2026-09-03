"use client";

import { useState } from "react";
import { App, Modal, Tabs, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { api } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

/**
 * 登录/注册弹窗。
 * 对齐真站：账号密码登录（Sa-Token SESSION），无第三方 OAuth。
 * 提示：Mock 模式下任意账号 + ≥6 位密码即可登录；账号 admin 为管理员。
 */
export default function LoginModal() {
  const { message } = App.useApp();
  const { loginModalOpen, closeLoginModal, setLoginUser } = useAppStore();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [loginForm] = Form.useForm();
  const [regForm] = Form.useForm();

  const onLogin = async () => {
    const v = await loginForm.validateFields();
    setLoading(true);
    try {
      const res = await api.login(v.userAccount, v.userPassword);
      setLoginUser(res.data);
      message.success("登录成功");
      closeLoginModal();
      loginForm.resetFields();
    } catch (e: any) {
      message.error(e?.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async () => {
    const v = await regForm.validateFields();
    setLoading(true);
    try {
      await api.register(v.userAccount, v.userPassword, v.checkPassword);
      // 注册成功后自动登录，贴合「注册 → 登录」连贯流程
      const loginRes = await api.login(v.userAccount, v.userPassword);
      setLoginUser(loginRes.data);
      message.success("注册成功，已自动登录");
      closeLoginModal();
      regForm.resetFields();
    } catch (e: any) {
      message.error(e?.message || "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={loginModalOpen}
      onCancel={closeLoginModal}
      footer={null}
      width={400}
      destroyOnClose
      title={<span style={{ fontSize: 18, fontWeight: 700 }}>欢迎来到 AI 导航</span>}
    >
      <Tabs
        activeKey={tab}
        onChange={(k) => setTab(k as "login" | "register")}
        items={[
          {
            key: "login",
            label: "登录",
            children: (
              <Form form={loginForm} layout="vertical" onFinish={onLogin}>
                <Form.Item
                  name="userAccount"
                  rules={[{ required: true, message: "请输入账号" }]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="账号（试试 admin 体验管理员）"
                  />
                </Form.Item>
                <Form.Item
                  name="userPassword"
                  rules={[
                    { required: true, message: "请输入密码" },
                    { min: 6, message: "密码不少于 6 位" }
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="密码（不少于 6 位）"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  block
                  size="large"
                  shape="round"
                  loading={loading}
                  htmlType="submit"
                >
                  登录
                </Button>
              </Form>
            )
          },
          {
            key: "register",
            label: "注册",
            children: (
              <Form form={regForm} layout="vertical" onFinish={onRegister}>
                <Form.Item
                  name="userAccount"
                  rules={[
                    { required: true, message: "请输入账号" },
                    { min: 4, message: "账号不少于 4 位" }
                  ]}
                >
                  <Input size="large" prefix={<UserOutlined />} placeholder="账号（不少于 4 位）" />
                </Form.Item>
                <Form.Item
                  name="userPassword"
                  rules={[
                    { required: true, message: "请输入密码" },
                    { min: 6, message: "密码不少于 6 位" }
                  ]}
                >
                  <Input.Password size="large" prefix={<LockOutlined />} placeholder="密码（不少于 6 位）" />
                </Form.Item>
                <Form.Item
                  name="checkPassword"
                  rules={[{ required: true, message: "请再次输入密码" }]}
                >
                  <Input.Password size="large" prefix={<LockOutlined />} placeholder="确认密码" />
                </Form.Item>
                <Button
                  type="primary"
                  block
                  size="large"
                  shape="round"
                  loading={loading}
                  htmlType="submit"
                >
                  注册
                </Button>
              </Form>
            )
          }
        ]}
      />
    </Modal>
  );
}
