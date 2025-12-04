import React, { useState, useEffect } from 'react';
import { 
  Button, Form, Select, Input, InputNumber, Checkbox, Radio, 
  Table, Card, Typography, Tabs, Tag, message, Modal, Space,
  DatePicker, Upload, Popconfirm, Empty
} from 'antd';
import { 
  MailOutlined, BellOutlined, TemplateOutlined, FileTextOutlined, 
  PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined,
  SearchOutlined, FilterOutlined, DownloadOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;

/**
 * 展会通知管理组件
 * 支持发送通知、通知模板管理和通知记录查询等功能
 */
const ExhibitionNotification = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [form] = Form.useForm();
  const [templateForm] = Form.useForm();
  const [notificationRecords, setNotificationRecords] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [exhibitionList, setExhibitionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [sending, setSending] = useState(false);

  // 模拟加载展会列表数据
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * 加载初始数据
   */
  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // 模拟异步加载数据
      await Promise.all([
        // 加载展会列表
        new Promise(resolve => {
          setTimeout(() => {
            setExhibitionList([
              { id: '1', name: '2023轨道交通技术展览会' },
              { id: '2', name: '2023智慧城市建设论坛' },
              { id: '3', name: '2023轨道交通装备展' },
            ]);
            resolve();
          }, 500);
        }),
        
        // 加载通知模板
        new Promise(resolve => {
          setTimeout(() => {
            setTemplates([
              {
                id: '1',
                name: '报名成功通知',
                type: 'email',
                content: '尊敬的{companyName}：\n\n您已成功报名参加{exhibitionName}！\n\n申请编号：{applyNo}\n申请时间：{applyTime}\n\n我们将尽快审核您的申请，请耐心等待。\n\n如有任何问题，请联系组委会。\n\n祝商祺！',
                status: 'active'
              },
              {
                id: '2',
                name: '审核通过通知', 
                type: 'email',
                content: '尊敬的{companyName}：\n\n恭喜您！您的{exhibitionName}申请已审核通过。\n\n申请编号：{applyNo}\n审核时间：{auditTime}\n\n请按照展会指南准备相关参展事宜。\n\n祝参展顺利！',
                status: 'active'
              },
              {
                id: '3',
                name: '审核拒绝通知',
                type: 'email',
                content: '尊敬的{companyName}：\n\n很遗憾，您的{exhibitionName}申请未通过审核。\n\n申请编号：{applyNo}\n审核时间：{auditTime}\n拒绝原因：{rejectReason}\n\n如有疑问，请联系组委会了解详情。\n\n感谢您的理解与支持！',
                status: 'active'
              }
            ]);
            resolve();
          }, 600);
        }),
        
        // 加载通知记录
        new Promise(resolve => {
          setTimeout(() => {
            setNotificationRecords([
              {
                id: '1',
                exhibitionName: '2023轨道交通技术展览会',
                title: '报名成功通知',
                type: 'email',
                recipient: 'zhangsan@example.com',
                recipientName: '中车集团有限公司',
                content: '尊敬的中车集团有限公司：\n\n您已成功报名参加2023轨道交通技术展览会！',
                status: 'success',
                sendTime: '2023-05-10 09:30:00'
              },
              {
                id: '2',
                exhibitionName: '2023轨道交通技术展览会', 
                title: '审核通过通知',
                type: 'email',
                recipient: 'lisi@example.com',
                recipientName: '华为技术有限公司',
                content: '尊敬的华为技术有限公司：\n\n恭喜您！您的2023轨道交通技术展览会申请已审核通过。',
                status: 'success',
                sendTime: '2023-05-10 14:15:00'
              },
              {
                id: '3',
                exhibitionName: '2023轨道交通技术展览会',
                title: '审核拒绝通知',
                type: 'email',
                recipient: 'wangwu@example.com',
                recipientName: '西门子（中国）有限公司',
                content: '尊敬的西门子（中国）有限公司：\n\n很遗憾，您的2023轨道交通技术展览会申请未通过审核。',
                status: 'failed',
                sendTime: '2023-05-10 16:45:00'
              }
            ]);
            resolve();
          }, 700);
        })
      ]);
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('数据加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 发送通知
   */
  const handleSendNotification = async (values) => {
    try {
      setSending(true);
      
      // 模拟发送通知的异步过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 添加新的通知记录
      const newRecord = {
        id: String(Date.now()),
        exhibitionName: exhibitionList.find(ex => ex.id === values.exhibitionId)?.name || '',
        title: values.title,
        type: values.notificationType,
        recipient: values.recipient,
        recipientName: values.recipientName,
        content: values.content,
        status: Math.random() > 0.2 ? 'success' : 'failed', // 模拟80%成功率
        sendTime: new Date().toLocaleString('zh-CN')
      };
      
      setNotificationRecords([newRecord, ...notificationRecords]);
      
      message.success('通知发送成功！');
      form.resetFields();
    } catch (error) {
      console.error('发送通知失败:', error);
      message.error('通知发送失败，请重试');
    } finally {
      setSending(false);
    }
  };

  /**
   * 选择模板
   */
  const handleSelectTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      form.setFieldsValue({
        title: template.name,
        content: template.content,
        notificationType: template.type
      });
      message.success('已应用模板内容');
    }
  };

  /**
   * 打开模板编辑/新增模态框
   */
  const handleTemplateModalOpen = (template = null) => {
    if (template) {
      setCurrentTemplate(template);
      templateForm.setFieldsValue({
        name: template.name,
        type: template.type,
        content: template.content
      });
    } else {
      setCurrentTemplate(null);
      templateForm.resetFields();
    }
    setTemplateModalVisible(true);
  };

  /**
   * 保存模板
   */
  const handleSaveTemplate = async (values) => {
    try {
      // 模拟保存异步过程
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (currentTemplate) {
        // 编辑现有模板
        setTemplates(templates.map(t => 
          t.id === currentTemplate.id 
            ? { ...t, name: values.name, type: values.type, content: values.content }
            : t
        ));
        message.success('模板更新成功');
      } else {
        // 添加新模板
        const newTemplate = {
          id: String(Date.now()),
          name: values.name,
          type: values.type,
          content: values.content,
          status: 'active'
        };
        setTemplates([...templates, newTemplate]);
        message.success('模板创建成功');
      }
      
      setTemplateModalVisible(false);
    } catch (error) {
      console.error('保存模板失败:', error);
      message.error('模板保存失败，请重试');
    }
  };

  /**
   * 删除模板
   */
  const handleDeleteTemplate = async (templateId) => {
    try {
      // 模拟删除异步过程
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTemplates(templates.filter(t => t.id !== templateId));
      message.success('模板删除成功');
    } catch (error) {
      console.error('删除模板失败:', error);
      message.error('模板删除失败，请重试');
    }
  };

  // 通知记录表格列配置
  const recordColumns = [
    {
      title: '展会名称',
      dataIndex: 'exhibitionName',
      key: 'exhibitionName',
      width: 200,
    },
    {
      title: '通知标题',
      dataIndex: 'title',
      key: 'title',
      width: 180,
    },
    {
      title: '通知类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={type === 'email' ? 'blue' : 'green'}>
          {type === 'email' ? '邮件' : '短信'}
        </Tag>
      ),
    },
    {
      title: '接收人',
      dataIndex: 'recipientName',
      key: 'recipientName',
      width: 150,
    },
    {
      title: '接收邮箱/电话',
      dataIndex: 'recipient',
      key: 'recipient',
      width: 180,
    },
    {
      title: '发送状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => handleViewNotification(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  /**
   * 查看通知详情
   */
  const handleViewNotification = (record) => {
    Modal.info({
      title: '通知详情',
      width: 600,
      content: (
        <div>
          <p><strong>展会名称：</strong>{record.exhibitionName}</p>
          <p><strong>通知标题：</strong>{record.title}</p>
          <p><strong>通知类型：</strong>{record.type === 'email' ? '邮件' : '短信'}</p>
          <p><strong>接收单位：</strong>{record.recipientName}</p>
          <p><strong>接收邮箱/电话：</strong>{record.recipient}</p>
          <p><strong>发送状态：</strong>
            <Tag color={record.status === 'success' ? 'green' : 'red'}>
              {record.status === 'success' ? '成功' : '失败'}
            </Tag>
          </p>
          <p><strong>发送时间：</strong>{record.sendTime}</p>
          <p><strong>通知内容：</strong></p>
          <div style={{ backgroundColor: '#f5f5f5', padding: 10, borderRadius: 4, whiteSpace: 'pre-wrap' }}>
            {record.content}
          </div>
        </div>
      ),
    });
  };

  return (
    <div>
      <Card 
        title={<Title level={4}>展会通知管理</Title>}
        extra={
          <Button 
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadInitialData}
            loading={loading}
          >
            刷新数据
          </Button>
        }
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarExtraContent={
            activeTab === 'template' && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => handleTemplateModalOpen()}
              >
                新增模板
              </Button>
            )
          }
        >
          {/* 发送通知 */}
          <TabPane 
            tab={<span><MailOutlined /> 发送通知</span>} 
            key="send"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSendNotification}
              initialValues={{
                notificationType: 'email',
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="exhibitionId"
                    label="选择展会"
                    rules={[{ required: true, message: '请选择展会' }]}
                  >
                    <Select placeholder="请选择展会" loading={exhibitionList.length === 0}>
                      {exhibitionList.map(exhibition => (
                        <Option key={exhibition.id} value={exhibition.id}>
                          {exhibition.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="notificationType"
                    label="通知类型"
                    rules={[{ required: true, message: '请选择通知类型' }]}
                  >
                    <Radio.Group>
                      <Radio.Button value="email">邮件</Radio.Button>
                      <Radio.Button value="sms">短信</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="recipientName"
                    label="接收单位"
                    rules={[{ required: true, message: '请输入接收单位名称' }]}
                  >
                    <Input placeholder="请输入接收单位名称" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="recipient"
                    label="接收邮箱/电话"
                    rules={[
                      { required: true, message: '请输入接收邮箱或电话' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const type = getFieldValue('notificationType');
                          if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                            return Promise.reject('请输入有效的邮箱地址');
                          }
                          if (type === 'sms' && !/^1[3-9]\d{9}$/.test(value)) {
                            return Promise.reject('请输入有效的手机号码');
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input placeholder="请输入接收邮箱或电话" />
                  </Form.Item>
                </Col>
                
                <Col xs={24}>
                  <Form.Item
                    name="title"
                    label="通知标题"
                    rules={[{ required: true, message: '请输入通知标题' }]}
                  >
                    <Input placeholder="请输入通知标题" />
                  </Form.Item>
                </Col>
                
                <Col xs={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span>通知内容</span>
                    <Select 
                      placeholder="选择模板" 
                      style={{ width: 200 }}
                      onChange={handleSelectTemplate}
                    >
                      {templates.map(template => (
                        <Option key={template.id} value={template.id}>
                          {template.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <Form.Item
                    name="content"
                    rules={[{ required: true, message: '请输入通知内容' }]}
                  >
                    <TextArea 
                      placeholder="请输入通知内容，支持变量：{companyName}, {exhibitionName}, {applyNo}, {applyTime}, {auditTime}, {rejectReason}"
                      rows={8}
                      showCount
                      maxLength={1000}
                    />
                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                      提示：您可以使用{companyName}, {exhibitionName}, {applyNo}等变量，系统会自动替换为实际值
                    </Text>
                  </Form.Item>
                </Col>
                
                <Col xs={24} style={{ textAlign: 'center' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SendOutlined />}
                    loading={sending}
                    size="large"
                    style={{ minWidth: 120 }}
                  >
                    发送通知
                  </Button>
                </Col>
              </Row>
            </Form>
          </TabPane>
          
          {/* 通知模板管理 */}
          <TabPane 
            tab={<span><TemplateOutlined /> 通知模板</span>} 
            key="template"
          >
            <Table 
              dataSource={templates}
              columns={[
                {
                  title: '模板名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '模板类型',
                  dataIndex: 'type',
                  key: 'type',
                  render: (type) => (
                    <Tag color={type === 'email' ? 'blue' : 'green'}>
                      {type === 'email' ? '邮件' : '短信'}
                    </Tag>
                  ),
                },
                {
                  title: '模板内容',
                  dataIndex: 'content',
                  key: 'content',
                  ellipsis: { showTitle: true },
                  render: (content) => (
                    <div style={{ maxWidth: 400 }}>
                      <Text ellipsis={{ rows: 2 }}>{content}</Text>
                    </div>
                  ),
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={status === 'active' ? 'green' : 'gray'}>
                      {status === 'active' ? '启用' : '停用'}
                    </Tag>
                  ),
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => (
                    <Space size="middle">
                      <Button 
                        type="link" 
                        icon={<EditOutlined />}
                        onClick={() => handleTemplateModalOpen(record)}
                      >
                        编辑
                      </Button>
                      <Popconfirm
                        title="确定要删除这个模板吗？"
                        onConfirm={() => handleDeleteTemplate(record.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                          删除
                        </Button>
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: <Empty description="暂无模板数据" /> }}
            />
          </TabPane>
          
          {/* 通知记录查询 */}
          <TabPane 
            tab={<span><FileTextOutlined /> 通知记录</span>} 
            key="records"
          >
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} md={6}>
                <Input
                  placeholder="搜索通知标题"
                  prefix={<SearchOutlined />}
                  // 搜索功能待实现
                />
              </Col>
              <Col xs={24} md={6}>
                <Select placeholder="按展会筛选">
                  <Option value="all">全部展会</Option>
                  {exhibitionList.map(exhibition => (
                    <Option key={exhibition.id} value={exhibition.id}>
                      {exhibition.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={6}>
                <Select placeholder="按状态筛选">
                  <Option value="all">全部状态</Option>
                  <Option value="success">发送成功</Option>
                  <Option value="failed">发送失败</Option>
                </Select>
              </Col>
              <Col xs={24} md={6}>
                <Button type="primary" icon={<DownloadOutlined />}>
                  导出记录
                </Button>
              </Col>
            </Row>
            
            <Table 
              dataSource={notificationRecords}
              columns={recordColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: <Empty description="暂无通知记录" /> }}
            />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* 模板编辑/新增模态框 */}
      <Modal
        title={currentTemplate ? "编辑模板" : "新增模板"}
        open={templateModalVisible}
        onCancel={() => setTemplateModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={templateForm}
          layout="vertical"
          onFinish={handleSaveTemplate}
          initialValues={{
            type: 'email',
          }}
        >
          <Form.Item
            name="name"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="模板类型"
            rules={[{ required: true, message: '请选择模板类型' }]}
          >
            <Radio.Group>
              <Radio.Button value="email">邮件</Radio.Button>
              <Radio.Button value="sms">短信</Radio.Button>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="content"
            label="模板内容"
            rules={[{ required: true, message: '请输入模板内容' }]}
          >
            <TextArea 
              placeholder="请输入模板内容"
              rows={10}
              showCount
              maxLength={1000}
            />
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              提示：您可以使用以下变量，系统会自动替换为实际值：
              <br />
              {companyName} - 企业名称 | {exhibitionName} - 展会名称 | {applyNo} - 申请编号 | 
              {applyTime} - 申请时间 | {auditTime} - 审核时间 | {rejectReason} - 拒绝原因
            </Text>
          </Form.Item>
          
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button 
              onClick={() => setTemplateModalVisible(false)}
              style={{ marginRight: 16 }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              {currentTemplate ? "更新模板" : "创建模板"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

// 修复React组件使用中的一个问题
const ReloadOutlined = BellOutlined;

export default ExhibitionNotification;