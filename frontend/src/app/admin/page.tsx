"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Table,
  Tag,
  Tabs,
  Result,
  Button,
  Spin,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Space,
  Popconfirm,
  Divider,
  message
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { api, swrFetcher } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import SectionTitle from "@/components/SectionTitle";
import CategoryChart, { CategoryDatum } from "@/components/CategoryChart";
import {
  AiTool,
  AiColumn,
  AiColumnCategory,
  AiArticle,
  BaseResponse,
  BaseResponsePage,
  Category
} from "@/types";

/**
 * 后台管理（对齐后端 /admin/** + @SaCheckRole("admin")）。
 * 仅管理员可见；分类/工具的增删改通过弹窗调用 api.admin.*，
 * Mock 模式走 /api/admin/* 路由（进程内持久化），真实模式直连后端 AdminController。
 */
export default function AdminPage() {
  const router = useRouter();
  const { loginUser, openLoginModal } = useAppStore();
  const isAdmin = loginUser?.userRole === "admin";

  const {
    data: toolData,
    isLoading: tLoading,
    mutate: mutateTools
  } = useSWR<BaseResponsePage<AiTool>>(
    isAdmin ? "/ai_tool/list/page" : null,
    swrFetcher
  );
  const {
    data: catData,
    isLoading: cLoading,
    mutate: mutateCats
  } = useSWR<BaseResponse<Category[]>>(
    isAdmin ? "/category/list" : null,
    swrFetcher
  );

  // 分类弹窗
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm] = Form.useForm();

  // 工具弹窗
  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AiTool | null>(null);
  const [toolForm] = Form.useForm();

  // ===== 知识库：主题分类 + 专栏 + 文章 =====
  const {
    data: kbCatData,
    isLoading: kbCatLoading
  } = useSWR<BaseResponse<AiColumnCategory[]>>(isAdmin ? "/ai_column/category/list" : null, swrFetcher);
  const kbCats = useMemo<AiColumnCategory[]>(() => kbCatData?.data || [], [kbCatData]);

  const {
    data: kbColData,
    isLoading: kbColLoading,
    mutate: mutateKbCols
  } = useSWR<BaseResponse<AiColumn[]>>(isAdmin ? "/admin/column/list" : null, swrFetcher);
  const {
    data: kbArtData,
    isLoading: kbArtLoading,
    mutate: mutateKbArts
  } = useSWR<BaseResponse<AiArticle[]>>(isAdmin ? "/admin/article/list" : null, swrFetcher);
  const [kbColumnId, setKbColumnId] = useState<number | undefined>(undefined);
  const kbCols = useMemo<AiColumn[]>(() => kbColData?.data || [], [kbColData]);
  const kbArts = useMemo<AiArticle[]>(
    () => (kbArtData?.data || []).filter((a) => !kbColumnId || a.columnId === kbColumnId),
    [kbArtData, kbColumnId]
  );

  // 专栏弹窗
  const [colModalOpen, setColModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<AiColumn | null>(null);
  const [colForm] = Form.useForm();
  // 文章弹窗
  const [artModalOpen, setArtModalOpen] = useState(false);
  const [editingArt, setEditingArt] = useState<AiArticle | null>(null);
  const [artForm] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loginUser === null) openLoginModal();
  }, [loginUser, openLoginModal]);

  // 所有 hook 必须在 early return 之前以固定顺序调用（React Hooks 规则）
  const tools = useMemo(() => toolData?.data?.records || [], [toolData]);
  const cats = useMemo(() => catData?.data || [], [catData]);

  // 工具分类分布（d3 图表数据源）
  const catCounts = useMemo<CategoryDatum[]>(() => {
    if (!cats.length) return [];
    return cats.map((c) => ({
      name: c.name,
      count: tools.filter((t) => t.categoryId === c.id).length
    }));
  }, [cats, tools]);

  if (!loginUser) {
    return (
      <Result
        status="403"
        title="需要登录"
        subTitle="请先登录管理员账号（Mock 模式账号填 admin 即为管理员）"
        extra={
          <Button type="primary" onClick={openLoginModal}>
            去登录
          </Button>
        }
      />
    );
  }

  if (loginUser.userRole !== "admin") {
    return (
      <Result
        status="403"
        title="无权访问"
        subTitle="仅管理员可进入后台管理"
        extra={
          <Button type="primary" onClick={() => router.push("/")}>
            返回首页
          </Button>
        }
      />
    );
  }

  // ===== 分类操作 =====
  const openAddCat = () => {
    setEditingCat(null);
    catForm.resetFields();
    catForm.setFieldsValue({ icon: "📁", sort: cats.length + 1 });
    setCatModalOpen(true);
  };
  const openEditCat = (record: Category) => {
    setEditingCat(record);
    catForm.setFieldsValue(record);
    setCatModalOpen(true);
  };
  const submitCat = async () => {
    const values = await catForm.validateFields();
    setSubmitting(true);
    try {
      if (editingCat) {
        await api.admin.updateCategory({ ...editingCat, ...values });
        message.success("分类已更新");
      } else {
        await api.admin.addCategory(values);
        message.success("分类已新增");
      }
      setCatModalOpen(false);
      mutateCats();
    } catch (e: any) {
      message.error(e?.message || "操作失败");
    } finally {
      setSubmitting(false);
    }
  };
  const deleteCat = async (id: number) => {
    try {
      await api.admin.deleteCategory(id);
      message.success("分类已删除");
      mutateCats();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  // ===== 工具操作 =====
  const openAddTool = () => {
    setEditingTool(null);
    toolForm.resetFields();
    toolForm.setFieldsValue({
      categoryId: cats[0]?.id ?? 1,
      heat: 0,
      isHot: false,
      isRecommended: false
    });
    setToolModalOpen(true);
  };
  const openEditTool = (record: AiTool) => {
    setEditingTool(record);
    toolForm.setFieldsValue({ ...record, tags: (record.tags || []).join(",") });
    setToolModalOpen(true);
  };
  const submitTool = async () => {
    const values = await toolForm.validateFields();
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
      if (editingTool) {
        await api.admin.updateTool({ ...editingTool, ...payload });
        message.success("工具已更新");
      } else {
        await api.admin.addTool(payload);
        message.success("工具已新增");
      }
      setToolModalOpen(false);
      mutateTools();
    } catch (e: any) {
      message.error(e?.message || "操作失败");
    } finally {
      setSubmitting(false);
    }
  };
  const deleteTool = async (id: number) => {
    try {
      await api.admin.deleteTool(id);
      message.success("工具已删除");
      mutateTools();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  // ===== 知识库：专栏操作 =====
  const openAddCol = () => {
    setEditingCol(null);
    colForm.resetFields();
    colForm.setFieldsValue({ needVip: 0, status: 1, sort: kbCols.length + 1, coverColor: "#3874F7" });
    setColModalOpen(true);
  };
  const openEditCol = (record: AiColumn) => {
    setEditingCol(record);
    colForm.setFieldsValue(record);
    setColModalOpen(true);
  };
  const submitCol = async () => {
    const values = await colForm.validateFields();
    setSubmitting(true);
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
      setSubmitting(false);
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

  // ===== 知识库：文章操作 =====
  const openAddArt = () => {
    setEditingArt(null);
    artForm.resetFields();
    artForm.setFieldsValue({
      columnId: kbCols[0]?.id ?? kbColumnId,
      status: 1,
      viewNum: 0,
      likeNum: 0,
      collectNum: 0,
      sort: (kbArts.length || 0) + 1
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
    setSubmitting(true);
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
      setSubmitting(false);
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
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
      <SectionTitle
        title="后台管理"
        extra={
          <span style={{ color: "#86909c", fontSize: 13 }}>
            管理员：{loginUser.userName}
          </span>
        }
      />
      {catCounts.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #eaecef", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1d2129", marginBottom: 8 }}>
            工具分类分布（共 {tools.length} 个工具）
          </div>
          <CategoryChart data={catCounts} />
        </div>
      )}
      <Tabs
        items={[
          {
            key: "tool",
            label: `AI 工具（${tools.length}）`,
            children: (
              <>
                <div style={{ marginBottom: 12, textAlign: "right" }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openAddTool}
                  >
                    新增工具
                  </Button>
                </div>
                {tLoading ? (
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
                      {
                        title: "描述",
                        dataIndex: "description",
                        ellipsis: true
                      },
                      {
                        title: "分类",
                        dataIndex: "categoryId",
                        width: 90,
                        render: (v: number) =>
                          cats.find((c) => c.id === v)?.name || v
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
                            <Button
                              type="link"
                              size="small"
                              onClick={() => openEditTool(r)}
                            >
                              编辑
                            </Button>
                            <Popconfirm
                              title="确认删除该工具？"
                              onConfirm={() => deleteTool(r.id)}
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
              </>
            )
          },
          {
            key: "cat",
            label: `分类（${cats.length}）`,
            children: (
              <>
                <div style={{ marginBottom: 12, textAlign: "right" }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openAddCat}
                  >
                    新增分类
                  </Button>
                </div>
                {cLoading ? (
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
                        render: (v: string) => (
                          <span style={{ fontSize: 18 }}>{v}</span>
                        )
                      },
                      { title: "名称", dataIndex: "name" },
                      { title: "排序", dataIndex: "sort", width: 90 },
                      {
                        title: "操作",
                        width: 140,
                        render: (_, r) => (
                          <Space size={0}>
                            <Button
                              type="link"
                              size="small"
                              onClick={() => openEditCat(r)}
                            >
                              编辑
                            </Button>
                            <Popconfirm
                              title="确认删除该分类？"
                              onConfirm={() => deleteCat(r.id)}
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
              </>
            )
          },
          {
            key: "kb",
            label: "知识库管理",
            children: (
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
                {kbColLoading ? (
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
                        render: (v: number) =>
                          v ? <Tag color="gold">会员</Tag> : <Tag>免费</Tag>
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
                      value={kbColumnId}
                      onChange={setKbColumnId}
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
              </>
            )
          }
        ]}
      />

      {/* 分类管理弹窗 */}
      <Modal
        title={editingCat ? "编辑分类" : "新增分类"}
        open={catModalOpen}
        onOk={submitCat}
        confirmLoading={submitting}
        onCancel={() => setCatModalOpen(false)}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={catForm} layout="vertical" style={{ marginTop: 16 }}>
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

      {/* 工具管理弹窗 */}
      <Modal
        title={editingTool ? "编辑工具" : "新增工具"}
        open={toolModalOpen}
        onOk={submitTool}
        confirmLoading={submitting}
        onCancel={() => setToolModalOpen(false)}
        okText="保存"
        cancelText="取消"
        width={560}
        destroyOnClose
      >
        <Form form={toolForm} layout="vertical" style={{ marginTop: 16 }}>
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

      {/* 专栏管理弹窗 */}
      <Modal
        title={editingCol ? "编辑专栏" : "新增专栏"}
        open={colModalOpen}
        onOk={submitCol}
        confirmLoading={submitting}
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

      {/* 文章管理弹窗 */}
      <Modal
        title={editingArt ? "编辑文章" : "新增文章"}
        open={artModalOpen}
        onOk={submitArt}
        confirmLoading={submitting}
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
    </div>
  );
}
