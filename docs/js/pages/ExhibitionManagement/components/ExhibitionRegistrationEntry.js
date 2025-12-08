import React, { useState, useEffect } from 'react';
import { Card, Form, Switch, Radio, Input, DatePicker, Select, Button, Space, message, Table, Tag, Tooltip, Divider } from 'antd';
import { SaveOutlined, EyeOutlined, EditOutlined, CopyOutlined, QrcodeOutlined, RefreshOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

/**
 * 展会报名入口管理组件
 * 功能：配置和管理展会报名入口的各种设置，如开启/关闭报名、设置报名时间段、配置报名方式等
 */
const ExhibitionRegistrationEntry = ({ exhibitionData = [] }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentExhibition, setCurrentExhibition] = useState(null);
  const [entryConfig, setEntryConfig] = useState([]);
  const [showQrcode, setShowQrcode] = useState(false);
  const [currentQrcodeExhibition, setCurrentQrcodeExhibition] = useState(null);

  // 加载展会报名入口配置
  const loadEntryConfig = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 模拟入口配置数据
      const mockConfig = [
        {
          id: '1',
          exhibitionId: 'exhibition001',
          exhibitionName: '2024城市轨道交通技术展',
          registrationEnabled: true,
          registrationMethod: 'both', // online, offline, both
          registrationTimeRange: {
            start: '2024-01-01 00:00:00',
            end: '2024-01-31 23:59:59',
          },
          maxParticipants: 200,
          currentParticipants: 156,
          registrationUrl: 'https://peoplemetro.com/registration/exhibition001',
          qrcodeUrl: 'https://peoplemetro.com/qrcode/exhibition001.png',
          customFormEnabled: true,
          anonymousRegistration: false,
          reviewRequired: true,
          notificationEnabled: true,
          reminderEnabled: true,
          reminderTime: '2024-02-01 09:00:00',
          description: '城市轨道交通领域年度盛会，展示最新技术成果和解决方案',
        },
        {
          id: '2',
          exhibitionId: 'exhibition002',
          exhibitionName: '2024智能交通创新论坛',
          registrationEnabled: true,
          registrationMethod: 'online',
          registrationTimeRange: {
            start: '2024-01-15 00:00:00',
            end: '2024-02-15 23:59:59',
          },
          maxParticipants: 100,
          currentParticipants: 78,
          registrationUrl: 'https://peoplemetro.com/registration/exhibition002',
          qrcodeUrl: 'https://peoplemetro.com/qrcode/exhibition002.png',
          customFormEnabled: true,
          anonymousRegistration: false,
          reviewRequired: true,
          notificationEnabled: true,
          reminderEnabled: false,
          reminderTime: null,
          description: '探讨智能交通领域的创新技术和未来发展趋势',
        },
        {
          id: '3',
          exhibitionId: 'exhibition003',
          exhibitionName: '2024地铁设备维护研讨会',
          registrationEnabled: false,
          registrationMethod: 'both',
          registrationTimeRange: {
            start: '2024-02-01 00:00:00',
            end: '2024-02-28 23:59:59',
          },
          maxParticipants: 50,
          currentParticipants: 0,
          registrationUrl: 'https://peoplemetro.com/registration/exhibition003',
          qrcodeUrl: 'https://peoplemetro.com/qrcode/exhibition003.png',
          customFormEnabled: false,
          anonymousRegistration: false,
          reviewRequired: false,
          notificationEnabled: true,
          reminderEnabled: true,
          reminderTime: '2024-03-01 09:00:00',
          description: '专注地铁设备维护技术的交流与研讨',
        },
      ];
      
      setEntryConfig(mockConfig);
      setLoading(false);
    }, 500);
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadEntryConfig();
  }, []);

  // 选择展会后加载对应的配置
  const handleExhibitionChange = (value) => {
    if (!value) {
      setCurrentExhibition(null);
      form.resetFields();
      return;
    }
    
    const exhibition = exhibitionData.find(item => item.exhibitionId === value);
    setCurrentExhibition(exhibition);
    
    // 查找该展会的报名配置
    const config = entryConfig.find(item => item.exhibitionId === value);
    if (config) {
      // 将配置填充到表单中
      form.setFieldsValue({
        registrationEnabled: config.registrationEnabled,
        registrationMethod: config.registrationMethod,
        registrationTimeRange: config.registrationTimeRange ? [
          moment(config.registrationTimeRange.start),
          moment(config.registrationTimeRange.end)
        ] : null,
        maxParticipants: config.maxParticipants,
        customFormEnabled: config.customFormEnabled,
        anonymousRegistration: config.anonymousRegistration,
        reviewRequired: config.reviewRequired,
        notificationEnabled: config.notificationEnabled,
        reminderEnabled: config.reminderEnabled,
        reminderTime: config.reminderTime ? moment(config.reminderTime) : null,
        description: config.description,
      });
    } else {
      // 没有配置时设置默认值
      form.setFieldsValue({
        registrationEnabled: false,
        registrationMethod: 'both',
        maxParticipants: 100,
        customFormEnabled: true,
        anonymousRegistration: false,
        reviewRequired: true,
        notificationEnabled: true,
        reminderEnabled: false,
      });
    }
  };

  // 保存报名入口配置
  const handleSaveConfig = (values) => {
    if (!currentExhibition) {
      message.warning('请先选择展会');
      return;
    }
    
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 转换日期格式
      const formattedValues = {
        ...values,
        registrationTimeRange: values.registrationTimeRange ? {
          start: values.registrationTimeRange[0].format('YYYY-MM-DD HH:mm:ss'),
          end: values.registrationTimeRange[1].format('YYYY-MM-DD HH:mm:ss'),
        } : null,
        reminderTime: values.reminderTime ? values.reminderTime.format('YYYY-MM-DD HH:mm:ss') : null,
      };
      
      // 更新或添加配置
      const existingIndex = entryConfig.findIndex(item => item.exhibitionId === currentExhibition.exhibitionId);
      let updatedConfig;
      
      if (existingIndex >= 0) {
        // 更新现有配置
        updatedConfig = [...entryConfig];
        updatedConfig[existingIndex] = {
          ...updatedConfig[existingIndex],
          ...formattedValues,
          exhibitionName: currentExhibition.exhibitionName,
        };
      } else {
        // 添加新配置
        updatedConfig = [
          ...entryConfig,
          {
            id: Date.now().toString(),
            exhibitionId: currentExhibition.exhibitionId,
            exhibitionName: currentExhibition.exhibitionName,
            ...formattedValues,
            currentParticipants: 0,
            registrationUrl: `https://peoplemetro.com/registration/${currentExhibition.exhibitionId}`,
            qrcodeUrl: `https://peoplemetro.com/qrcode/${currentExhibition.exhibitionId}.png`,
          },
        ];
      }
      
      setEntryConfig(updatedConfig);
      message.success('报名入口配置已保存');
      setLoading(false);
    }, 500);
  };

  // 复制报名链接
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      message.success('报名链接已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败，请手动复制');
    });
  };

  // 查看二维码
  const handleViewQrcode = (exhibition) => {
    setCurrentQrcodeExhibition(exhibition);
    setShowQrcode(true);
  };

  // 刷新报名链接和二维码
  const handleRefreshLink = (id) => {
    setLoading(true);
    // 模拟刷新操作
    setTimeout(() => {
      const updatedConfig = entryConfig.map(item => {
        if (item.id === id) {
          return {
            ...item,
            registrationUrl: `https://peoplemetro.com/registration/${item.exhibitionId}?t=${Date.now()}`,
            qrcodeUrl: `https://peoplemetro.com/qrcode/${item.exhibitionId}.png?t=${Date.now()}`,
          };
        }
        return item;
      });
      
      setEntryConfig(updatedConfig);
      message.success('报名链接和二维码已刷新');
      setLoading(false);
    }, 500);
  };

  // 表格列配置
  const columns = [
    {
      title: '展会名称',
      dataIndex: 'exhibitionName',
      key: 'exhibitionName',
      width: 200,
    },
    {
      title: '报名状态',
      key: 'registrationEnabled',
      width: 100,
      render: (_, record) => (
        <Tag color={record.registrationEnabled ? 'green' : 'gray'}>
          {record.registrationEnabled ? '已开启' : '已关闭'}
        </Tag>
      ),
    },
    {
      title: '报名方式',
      key: 'registrationMethod',
      width: 120,
      render: (_, record) => {
        const methodMap = {
          'online': '线上',
          'offline': '线下',
          'both': '线上+线下',
        };
        return methodMap[record.registrationMethod] || '未知';
      },
    },
    {
      title: '报名人数',
      key: 'participants',
      width: 120,
      render: (_, record) => (
        <span>{record.currentParticipants} / {record.maxParticipants}</span>
      ),
    },
    {
      title: '审核要求',
      key: 'reviewRequired',
      width: 100,
      render: (_, record) => (
        <Tag color={record.reviewRequired ? 'orange' : 'blue'}>
          {record.reviewRequired ? '需审核' : '自动通过'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="复制报名链接">
            <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopyLink(record.registrationUrl)} />
          </Tooltip>
          <Tooltip title="查看报名二维码">
            <Button type="link" icon={<QrcodeOutlined />} onClick={() => handleViewQrcode(record)} />
          </Tooltip>
          <Tooltip title="刷新链接和二维码">
            <Button type="link" icon={<RefreshOutlined />} onClick={() => handleRefreshLink(record.id)} />
          </Tooltip>
          <Tooltip title="编辑配置">
            <Button type="link" icon={<EditOutlined />} onClick={() => {
              form.resetFields();
              setCurrentExhibition({
                exhibitionId: record.exhibitionId,
                exhibitionName: record.exhibitionName,
              });
              // 填充表单
              form.setFieldsValue({
                registrationEnabled: record.registrationEnabled,
                registrationMethod: record.registrationMethod,
                registrationTimeRange: record.registrationTimeRange ? [
                  moment(record.registrationTimeRange.start),
                  moment(record.registrationTimeRange.end)
                ] : null,
                maxParticipants: record.maxParticipants,
                customFormEnabled: record.customFormEnabled,
                anonymousRegistration: record.anonymousRegistration,
                reviewRequired: record.reviewRequired,
                notificationEnabled: record.notificationEnabled,
                reminderEnabled: record.reminderEnabled,
                reminderTime: record.reminderTime ? moment(record.reminderTime) : null,
                description: record.description,
              });
            }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 配置表单 */}
      <Card title="报名入口配置" style={{ marginBottom: 20 }}>
        <Form form={form} layout="vertical" onFinish={handleSaveConfig}>
          <Form.Item
            name="exhibitionId"
            label="选择展会"
            rules={[{ required: true, message: '请选择展会' }]}
          >
            <Select placeholder="请选择展会" onChange={handleExhibitionChange} allowClear>
              {exhibitionData.map(item => (
                <Option key={item.exhibitionId} value={item.exhibitionId}>
                  {item.exhibitionName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {currentExhibition && (
            <>
              <Divider />
              <Form.Item
                name="registrationEnabled"
                label="启用报名"
                valuePropName="checked"
              >
                <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
              </Form.Item>

              <Form.Item
                name="registrationMethod"
                label="报名方式"
                rules={[{ required: true, message: '请选择报名方式' }]}
              >
                <Radio.Group>
                  <Radio value="online">线上报名</Radio>
                  <Radio value="offline">线下报名</Radio>
                  <Radio value="both">线上+线下</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="registrationTimeRange"
                label="报名时间段"
                rules={[{ required: true, message: '请设置报名时间段' }]}
              >
                <RangePicker showTime style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />
              </Form.Item>

              <Form.Item
                name="maxParticipants"
                label="最大报名人数"
                rules={[{ required: true, message: '请设置最大报名人数' }, { type: 'number', min: 1 }]}
              >
                <Input type="number" placeholder="请输入最大报名人数" />
              </Form.Item>

              <Form.Item
                name="customFormEnabled"
                label="启用自定义表单"
                valuePropName="checked"
              >
                <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
              </Form.Item>

              <Form.Item
                name="anonymousRegistration"
                label="允许匿名报名"
                valuePropName="checked"
              >
                <Switch checkedChildren="允许" unCheckedChildren="不允许" />
              </Form.Item>

              <Form.Item
                name="reviewRequired"
                label="报名需审核"
                valuePropName="checked"
              >
                <Switch checkedChildren="需审核" unCheckedChildren="自动通过" />
              </Form.Item>

              <Form.Item
                name="notificationEnabled"
                label="开启报名通知"
                valuePropName="checked"
              >
                <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
              </Form.Item>

              <Form.Item
                name="reminderEnabled"
                label="发送参会提醒"
                valuePropName="checked"
              >
                <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
              </Form.Item>

              <Form.Item
                name="reminderTime"
                label="提醒时间"
                dependencies={['reminderEnabled']}
                shouldUpdate={(prevValues, currentValues) => prevValues.reminderEnabled !== currentValues.reminderEnabled}
              >
                {({ getFieldValue }) => {
                  const reminderEnabled = getFieldValue('reminderEnabled');
                  return reminderEnabled ? (
                    <DatePicker showTime style={{ width: '100%' }} placeholder="请选择提醒时间" />
                  ) : null;
                }}
              </Form.Item>

              <Form.Item
                name="description"
                label="展会描述"
              >
                <TextArea rows={4} placeholder="请输入展会描述（将显示在报名页面）" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                  保存配置
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </Card>

      {/* 报名入口列表 */}
      <Card title="报名入口列表" style={{ marginBottom: 20 }}>
        <Table
          columns={columns}
          dataSource={entryConfig}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 二维码弹窗 */}
      {showQrcode && currentQrcodeExhibition && (
        <Modal
          title={`${currentQrcodeExhibition.exhibitionName} 报名二维码`}
          open={showQrcode}
          onCancel={() => setShowQrcode(false)}
          footer={null}
          width={400}
          centered
        >
          <div style={{ textAlign: 'center', padding: 20 }}>
            {/* 这里应该是实际的二维码图片，暂时使用占位图 */}
            <div style={{ width: 200, height: 200, margin: '0 auto', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <QrcodeOutlined style={{ fontSize: 60, color: '#999' }} />
            </div>
            <p style={{ marginBottom: 10 }}>扫码报名参加 {currentQrcodeExhibition.exhibitionName}</p>
            <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopyLink(currentQrcodeExhibition.registrationUrl)}>
              复制报名链接
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExhibitionRegistrationEntry;
