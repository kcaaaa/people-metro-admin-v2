import React, { useState, useEffect, useMemo } from 'react';
import { Card, Tabs, Button, Row, Col, Form, Input, Select, Table, DatePicker, Upload, message, Modal, Drawer, Space, Badge, Avatar, Tag, Popover } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, SendOutlined, QrcodeOutlined, ClockCircleOutlined, SearchOutlined, FilterOutlined, MoreOutlined, EyeOutlined } from '@ant-design/icons';

// 引入子组件
import ExhibitionRegistrationForm from './components/ExhibitionRegistrationForm';
import RegistrationInfoDetail from './components/RegistrationInfoDetail';
import ParticipantManagement from './components/ParticipantManagement';
import MaterialManagement from './components/MaterialManagement';
import ReviewManagement from './components/ReviewManagement';
import ExportManagement from './components/ExportManagement';
import NotificationManagement from './components/NotificationManagement';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

/**
 * 展会报名管理页面
 * 功能：管理展会报名信息，包括报名入口配置、报名信息查看、参展人员管理等
 */
const ExhibitionRegistration = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('1');
  const [registrationData, setRegistrationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState(null);
  const [form] = Form.useForm();
  
  // 筛选条件状态
  const [filters, setFilters] = useState({
    exhibitionName: '',
    status: '',
    dateRange: null,
  });

  // 加载报名数据
  const loadRegistrationData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 模拟数据
      const mockData = [
        {
          id: '1',
          exhibitionName: '2023城市轨道交通技术展览会',
          exhibitionId: 'E2023001',
          registrationStatus: 'open',
          registrationStartTime: '2023-10-01 09:00',
      registrationEndTime: '2023-11-30 18:00',
          totalParticipants: 156,
          reviewedCount: 120,
          pendingCount: 36,
          rejectedCount: 0,
          registrationLink: 'https://example.com/register/E2023001',
          qrCodeUrl: 'https://example.com/qrcode/E2023001',
          createdBy: 'admin',
          createdTime: '2023-09-15 10:30:00',
          updatedTime: '2023-09-20 14:20:00',
        },
        {
          id: '2',
          exhibitionName: '2023智慧出行创新峰会',
          exhibitionId: 'E2023002',
          registrationStatus: 'closed',
          registrationStartTime: '2023-09-01 09:00',
      registrationEndTime: '2023-09-30 18:00',
          totalParticipants: 234,
          reviewedCount: 210,
          pendingCount: 0,
          rejectedCount: 24,
          registrationLink: 'https://example.com/register/E2023002',
          qrCodeUrl: 'https://example.com/qrcode/E2023002',
          createdBy: 'admin',
          createdTime: '2023-08-20 09:15:00',
          updatedTime: '2023-09-30 16:45:00',
        },
      ];
      
      setRegistrationData(mockData);
      setLoading(false);
    }, 500);
  };

  // 初始化数据
  useEffect(() => {
    loadRegistrationData();
  }, []);
  
  // 计算每个报名入口的显示状态
  const calculateDisplayStatus = (record) => {
    const now = new Date();
    const startTime = new Date(record.registrationStartTime);
    const endTime = record.registrationEndTime ? new Date(record.registrationEndTime) : null;
    
    // 如果状态为手动关闭，则直接返回closed
    if (record.registrationStatus === 'closed') {
      return 'closed';
    }
    
    // 如果状态为开放，根据时间计算实际状态
    if (record.registrationStatus === 'open') {
      // 还未到开始时间
      if (now < startTime) {
        return 'not_started';
      }
      // 已过结束时间
      if (endTime && now > endTime) {
        return 'ended';
      }
      // 在报名时间范围内
      return 'open';
    }
    
    return 'unknown';
  };
  
  // 使用useMemo优化性能，避免不必要的计算
  const enhancedRegistrationData = useMemo(() => {
    return registrationData.map(record => ({
      ...record,
      displayStatus: calculateDisplayStatus(record)
    }));
  }, [registrationData]);
  
  // 手动关闭报名
  const handleManualClose = (record) => {
    Modal.confirm({
      title: '确认关闭',
      content: `确定要手动关闭展会「${record.exhibitionName}」的报名吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 模拟更新操作
        setLoading(true);
        setTimeout(() => {
          setRegistrationData(prevData => 
            prevData.map(item => 
              item.id === record.id 
                ? { ...item, registrationStatus: 'closed', updatedTime: new Date().toLocaleString('zh-CN') }
                : item
            )
          );
          message.success('已手动关闭报名');
          setLoading(false);
        }, 500);
      },
    });
  };

  // 处理标签切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 处理新增报名入口
  const handleAddRegistration = () => {
    form.resetFields();
    setCurrentRegistration(null);
    setIsAddModalVisible(true);
  };

  // 处理编辑报名入口
  const handleEditRegistration = (record) => {
    setCurrentRegistration(record);
    form.setFieldsValue({
      exhibitionId: record.exhibitionId,
      exhibitionName: record.exhibitionName,
      registrationStartTime: record.registrationStartTime,
        registrationEndTime: record.registrationEndTime,
      registrationStatus: record.registrationStatus,
    });
    setIsAddModalVisible(true);
  };

  // 处理删除报名入口
  const handleDeleteRegistration = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该报名入口吗？删除后不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 模拟删除操作
        setLoading(true);
        setTimeout(() => {
          setRegistrationData(registrationData.filter(item => item.id !== id));
          message.success('删除成功');
          setLoading(false);
        }, 500);
      },
    });
  };

  // 处理查看详情
  const handleViewDetail = (record) => {
    setCurrentRegistration(record);
    setIsDetailDrawerVisible(true);
  };

  // 验证时间段有效性
  const validateTimeRange = (startTime, endTime, status) => {
    const now = new Date();
    const startDate = startTime ? new Date(startTime) : null;
    const endDate = endTime ? new Date(endTime) : null;
    
    // 检查开始时间和结束时间的关系
    if (startDate && endDate && endDate <= startDate) {
      message.error('结束时间必须晚于开始时间');
      return false;
    }
    
    // 如果状态为开放，但开始时间在很远的过去，提示用户
    if (status === 'open' && startDate && startDate < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      message.warning('开始时间设置在一周前，确认是否继续？');
    }
    
    // 如果设置了结束时间，但已经过期且状态为开放，提示用户
    if (status === 'open' && endDate && endDate <= now) {
      message.error('结束时间已过期，无法设置为开放状态');
      return false;
    }
    
    return true;
  };

  // 处理表单提交
  const handleFormSubmit = (values) => {
    // 验证时间段有效性
    const startTime = values.registrationStartTime ? values.registrationStartTime.format('YYYY-MM-DD HH:mm') : null;
    const endTime = values.registrationEndTime ? values.registrationEndTime.format('YYYY-MM-DD HH:mm') : null;
    const status = values.registrationStatus || 'open';
    
    if (!validateTimeRange(startTime, endTime, status)) {
      return;
    }
    
    // 模拟保存操作
    setLoading(true);
    setTimeout(() => {
      if (currentRegistration) {
        // 更新现有记录
        const updatedData = registrationData.map(item => 
          item.id === currentRegistration.id 
            ? { 
                ...item, 
                exhibitionName: values.exhibitionName,
                registrationStartTime: values.registrationStartTime ? values.registrationStartTime.format('YYYY-MM-DD HH:mm') : item.registrationStartTime,
                registrationEndTime: values.registrationEndTime ? values.registrationEndTime.format('YYYY-MM-DD HH:mm') : item.registrationEndTime,
                registrationStatus: values.registrationStatus,
                updatedTime: new Date().toLocaleString('zh-CN'),
              } 
            : item
        );
        setRegistrationData(updatedData);
        message.success('更新成功');
      } else {
        // 添加新记录
        const newRecord = {
          id: Date.now().toString(),
          exhibitionName: values.exhibitionName,
          exhibitionId: values.exhibitionId,
          registrationStatus: values.registrationStatus || 'open',
          registrationStartTime: values.registrationStartTime ? values.registrationStartTime.format('YYYY-MM-DD HH:mm') : new Date().toISOString().replace('T', ' ').substring(0, 16),
          registrationEndTime: values.registrationEndTime ? values.registrationEndTime.format('YYYY-MM-DD HH:mm') : '',
          totalParticipants: 0,
          reviewedCount: 0,
          pendingCount: 0,
          rejectedCount: 0,
          registrationLink: `https://example.com/register/${values.exhibitionId}`,
          qrCodeUrl: `https://example.com/qrcode/${values.exhibitionId}`,
          createdBy: 'admin',
          createdTime: new Date().toLocaleString('zh-CN'),
          updatedTime: new Date().toLocaleString('zh-CN'),
        };
        setRegistrationData([...registrationData, newRecord]);
        message.success('添加成功');
      }
      setIsAddModalVisible(false);
      setLoading(false);
    }, 500);
  };

  // 表格列配置
  const columns = [
    {
      title: '展会名称',
      dataIndex: 'exhibitionName',
      key: 'exhibitionName',
      ellipsis: true,
    },
    {
      title: '展会ID',
      dataIndex: 'exhibitionId',
      key: 'exhibitionId',
    },
    {      
      title: '报名状态',
      dataIndex: 'displayStatus',
      key: 'displayStatus',
      render: (status) => {
        let color = '';
        let text = '';
        switch (status) {
          case 'open':
            color = 'green';
            text = '开放报名';
            break;
          case 'closed':
            color = 'red';
            text = '已关闭(手动)';
            break;
          case 'ended':
            color = 'grey';
            text = '已结束(时间到)';
            break;
          case 'not_started':
            color = 'blue';
            text = '未开始';
            break;
          default:
            color = 'default';
            text = '未知';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '报名时间段',
      key: 'registrationPeriod',
      render: (_, record) => `${record.registrationStartTime} ~ ${record.registrationEndTime || '至今'}`,
    },
    {
      title: '报名人数',
      key: 'totalParticipants',
      render: (_, record) => (
        <Space>
          <span>总计: {record.totalParticipants}</span>
          <span style={{ marginLeft: 10 }}>
            审核中: <Badge count={record.pendingCount} style={{ backgroundColor: '#faad14' }} />
          </span>
          <span>
            已审核: <Badge count={record.reviewedCount} style={{ backgroundColor: '#52c41a' }} />
          </span>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditRegistration(record)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteRegistration(record.id)}>删除</Button>
          {record.registrationStatus === 'open' && (
            <Button type="text" onClick={() => handleManualClose(record)}>手动关闭</Button>
          )}
        </Space>
      ),
    },
  ];

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="展会报名管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRegistration}>
            新增报名入口
          </Button>
        }
      >
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="报名入口管理" key="1">
            {/* 筛选条件 */}
            <Card size="small" className="filter-card">
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="展会名称" name="exhibitionName">
                    <Input placeholder="请输入展会名称" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="报名状态" name="status">
                    <Select placeholder="请选择状态">
                      <Option value="open">开放报名</Option>
                      <Option value="closed">已关闭</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="报名时间段" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Space>
                    <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
                    <Button icon={<FilterOutlined />}>重置</Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* 数据表格 */}
            <Table
              rowKey="id"
              columns={columns}
              dataSource={registrationData}
              loading={loading}
            rowSelection={rowSelection}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条数据`,
            }}
            dataSource={enhancedRegistrationData}
          />
          </TabPane>
          
          <TabPane tab="报名信息管理" key="2">
            <RegistrationInfoDetail exhibitionData={registrationData} />
          </TabPane>
          
          <TabPane tab="参展人员管理" key="3">
            <ParticipantManagement exhibitionData={registrationData} />
          </TabPane>
          
          <TabPane tab="材料管理" key="4">
            <MaterialManagement exhibitionData={registrationData} />
          </TabPane>
          
          <TabPane tab="审核管理" key="5">
            <ReviewManagement exhibitionData={registrationData} />
          </TabPane>
          
          <TabPane tab="数据导出" key="6">
            <ExportManagement exhibitionData={registrationData} />
          </TabPane>
          
          <TabPane tab="通知管理" key="7">
            <NotificationManagement exhibitionData={registrationData} />
          </TabPane>
        </Tabs>
      </Card>

      {/* 新增/编辑报名入口模态框 */}
      <Modal
        title={currentRegistration ? '编辑报名入口' : '新增报名入口'}
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="exhibitionId"
            label="展会ID"
            rules={[{ required: true, message: '请输入展会ID' }]}
          >
            <Input placeholder="请输入展会ID" disabled={!!currentRegistration} />
          </Form.Item>
          
          <Form.Item
            name="exhibitionName"
            label="展会名称"
            rules={[{ required: true, message: '请输入展会名称' }]}
          >
            <Input placeholder="请输入展会名称" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="registrationStartTime"
                label="报名开始时间"
                rules={[{
                  required: true, 
                  message: '请选择开始时间'
                }, {
                  validator: (_, value, callback) => {
                    const endTime = form.getFieldValue('registrationEndTime');
                    if (endTime && value && endTime.isBefore(value)) {
                      callback('开始时间不能晚于结束时间');
                    } else {
                      callback();
                    }
                  }
                }]}
              >
                <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} placeholder="请选择开始时间" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="registrationEndTime"
                label="报名结束时间"
                rules={[{
                  validator: (_, value, callback) => {
                    const startTime = form.getFieldValue('registrationStartTime');
                    if (startTime && value && value.isBefore(startTime)) {
                      callback('结束时间不能早于开始时间');
                    } else {
                      callback();
                    }
                  }
                }]}
              >
                <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} placeholder="请选择结束时间" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="registrationStatus"
            label="报名状态设置"
            tooltip="系统会根据设置的时间段自动调整实际显示状态"
            rules={[{ required: true, message: '请选择报名状态设置' }]}
          >
            <Select placeholder="请选择报名状态设置">
              <Option value="open">允许自动控制</Option>
              <Option value="closed">强制关闭</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Row justify="end">
              <Space>
                <Button onClick={() => setIsAddModalVisible(false)}>取消</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  确定
                </Button>
              </Space>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title="报名入口详情"
        width={640}
        placement="right"
        onClose={() => setIsDetailDrawerVisible(false)}
        visible={isDetailDrawerVisible}
      >
        {currentRegistration && (
          <div>
            <p><strong>展会名称：</strong>{currentRegistration.exhibitionName}</p>
            <p><strong>展会ID：</strong>{currentRegistration.exhibitionId}</p>
            <p><strong>报名状态：</strong>
              {(() => {
                const displayStatus = calculateDisplayStatus(currentRegistration);
                let color = '';
                let text = '';
                switch (displayStatus) {
                  case 'open':
                    color = 'green';
                    text = '开放报名';
                    break;
                  case 'closed':
                    color = 'red';
                    text = '已关闭(手动)';
                    break;
                  case 'ended':
                    color = 'grey';
                    text = '已结束(时间到)';
                    break;
                  case 'not_started':
                    color = 'blue';
                    text = '未开始';
                    break;
                  default:
                    color = 'default';
                    text = '未知';
                }
                return <Tag color={color}>{text}</Tag>;
              })()}
            </p>
            <p><strong>报名时间段：</strong>{currentRegistration.registrationStartTime} ~ {currentRegistration.registrationEndTime || '至今'}</p>
            <p><strong>报名人数统计：</strong></p>
            <ul>
              <li>总报名人数：{currentRegistration.totalParticipants}</li>
              <li>审核中：{currentRegistration.pendingCount}</li>
              <li>已通过：{currentRegistration.reviewedCount}</li>
              <li>已拒绝：{currentRegistration.rejectedCount}</li>
            </ul>
            <p><strong>报名链接：</strong>
              <a href={currentRegistration.registrationLink} target="_blank" rel="noopener noreferrer">
                {currentRegistration.registrationLink}
              </a>
            </p>
            <p><strong>二维码：</strong></p>
            <div style={{ textAlign: 'center', padding: 20 }}>
              <img 
                src={currentRegistration.qrCodeUrl} 
                alt="报名二维码" 
                style={{ width: 200, height: 200 }}
              />
            </div>
            <p><strong>创建时间：</strong>{currentRegistration.createdTime}</p>
            <p><strong>更新时间：</strong>{currentRegistration.updatedTime}</p>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ExhibitionRegistration;
