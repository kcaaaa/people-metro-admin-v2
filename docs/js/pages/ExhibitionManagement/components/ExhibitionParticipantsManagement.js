import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, DatePicker, Table, Tag, Button, Space, Modal, message, Upload, Tooltip, Badge, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, FilterOutlined, DownloadOutlined, UploadOutlined, SyncOutlined, UserAddOutlined, FileTextOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { queryString } from '@/utils/queryString';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

/**
 * 参展人员管理组件
 * 功能：管理所有展会的参展人员信息，包括人员信息管理、签到管理、数据导入导出等
 */
const ExhibitionParticipantsManagement = ({ exhibitionData = [] }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [participantsData, setParticipantsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [editForm] = Form.useForm();
  const [uploadFileList, setUploadFileList] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [statistics, setStatistics] = useState({
    total: 0,
    checkedIn: 0,
    pending: 0,
    checkedOut: 0,
    byExhibition: {},
    byCompanyType: {}
  });

  // 加载参展人员数据
  const loadParticipantsData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 模拟参展人员数据
      const mockData = [
        {
          id: 'p1',
          exhibitionId: 'exhibition001',
          exhibitionName: '2024城市轨道交通技术展',
          name: '张三',
          phone: '13800138001',
          email: 'zhangsan@example.com',
          company: '中国铁路技术集团',
          position: '技术总监',
          department: '研发部',
          companyType: '国有企业',
          industry: '轨道交通',
          participantType: '专业观众', // 专业观众、参展商、媒体、演讲嘉宾
          ticketNumber: 'TKT202401150001',
          checkInStatus: 'checkedIn', // pending, checkedIn, checkedOut
          checkInTime: '2024-02-01 09:15:30',
          checkOutTime: '2024-02-01 16:45:20',
          registrationId: '1',
          badgeNumber: 'B001',
          badgeType: 'VIP',
          createdTime: '2024-01-15 10:30:22',
          emergencyContact: '李四',
          emergencyPhone: '13900139002',
          remarks: null,
        },
        {
          id: 'p2',
          exhibitionId: 'exhibition001',
          exhibitionName: '2024城市轨道交通技术展',
          name: '李四',
          phone: '13900139002',
          email: 'lisi@example.com',
          company: '北京地铁运营有限公司',
          position: '设备工程师',
          department: '设备维护部',
          companyType: '国有企业',
          industry: '轨道交通',
          participantType: '专业观众',
          ticketNumber: 'TKT202401150002',
          checkInStatus: 'checkedIn',
          checkInTime: '2024-02-01 10:20:15',
          checkOutTime: null,
          registrationId: '2',
          badgeNumber: 'B002',
          badgeType: '标准',
          createdTime: '2024-01-15 14:22:18',
          emergencyContact: '王五',
          emergencyPhone: '13700137003',
          remarks: '需要特殊饮食安排',
        },
        {
          id: 'p3',
          exhibitionId: 'exhibition001',
          exhibitionName: '2024城市轨道交通技术展',
          name: '王五',
          phone: '13700137003',
          email: 'wangwu@example.com',
          company: '上海轨道交通集团',
          position: '项目经理',
          department: '工程管理部',
          companyType: '国有企业',
          industry: '轨道交通',
          participantType: '专业观众',
          ticketNumber: 'TKT202401160001',
          checkInStatus: 'pending',
          checkInTime: null,
          checkOutTime: null,
          registrationId: '3',
          badgeNumber: 'B003',
          badgeType: '标准',
          createdTime: '2024-01-16 09:15:40',
          emergencyContact: '张三',
          emergencyPhone: '13800138001',
          remarks: null,
        },
        {
          id: 'p4',
          exhibitionId: 'exhibition002',
          exhibitionName: '2024智能交通创新论坛',
          name: '赵六',
          phone: '13600136004',
          email: 'zhaoliu@example.com',
          company: '深圳智能交通研究院',
          position: '研究员',
          department: '智能交通研究所',
          companyType: '科研机构',
          industry: '智能交通',
          participantType: '演讲嘉宾',
          ticketNumber: 'TKT202401160002',
          checkInStatus: 'pending',
          checkInTime: null,
          checkOutTime: null,
          registrationId: '4',
          badgeNumber: 'B004',
          badgeType: 'VIP',
          createdTime: '2024-01-16 16:45:22',
          emergencyContact: '孙八',
          emergencyPhone: '13400134006',
          remarks: '需要安排接送服务',
        },
        {
          id: 'p5',
          exhibitionId: 'exhibition002',
          exhibitionName: '2024智能交通创新论坛',
          name: '钱七',
          phone: '13500135005',
          email: 'qianqi@example.com',
          company: '广州交通集团',
          position: '技术负责人',
          department: '信息科技部',
          companyType: '国有企业',
          industry: '智能交通',
          participantType: '参展商',
          ticketNumber: 'TKT202401170001',
          checkInStatus: 'pending',
          checkInTime: null,
          checkOutTime: null,
          registrationId: '5',
          badgeNumber: 'B005',
          badgeType: '参展商',
          createdTime: '2024-01-17 11:20:35',
          emergencyContact: '周九',
          emergencyPhone: '13300133007',
          remarks: null,
        },
        {
          id: 'p6',
          exhibitionId: 'exhibition001',
          exhibitionName: '2024城市轨道交通技术展',
          name: '孙八',
          phone: '13400134006',
          email: 'sunba@example.com',
          company: '成都地铁集团',
          position: '采购经理',
          department: '物资采购部',
          companyType: '国有企业',
          industry: '轨道交通',
          participantType: '专业观众',
          ticketNumber: 'TKT202401180001',
          checkInStatus: 'checkedIn',
          checkInTime: '2024-02-01 11:30:45',
          checkOutTime: '2024-02-01 17:00:10',
          registrationId: '6',
          badgeNumber: 'B006',
          badgeType: '标准',
          createdTime: '2024-01-18 09:45:10',
          emergencyContact: '吴十',
          emergencyPhone: '13200132008',
          remarks: null,
        },
        {
          id: 'p7',
          exhibitionId: 'exhibition001',
          exhibitionName: '2024城市轨道交通技术展',
          name: '周九',
          phone: '13300133007',
          email: 'zhoujiu@example.com',
          company: '杭州地铁集团',
          position: '系统工程师',
          department: '系统运维部',
          companyType: '国有企业',
          industry: '轨道交通',
          participantType: '专业观众',
          ticketNumber: 'TKT202401180002',
          checkInStatus: 'checkedOut',
          checkInTime: '2024-02-01 09:45:20',
          checkOutTime: '2024-02-01 12:30:15',
          registrationId: null,
          badgeNumber: 'B007',
          badgeType: '标准',
          createdTime: '2024-01-18 14:20:30',
          emergencyContact: '钱七',
          emergencyPhone: '13500135005',
          remarks: null,
        },
        {
          id: 'p8',
          exhibitionId: 'exhibition002',
          exhibitionName: '2024智能交通创新论坛',
          name: '吴十',
          phone: '13200132008',
          email: 'wushi@example.com',
          company: '中国交通报',
          position: '记者',
          department: '科技新闻部',
          companyType: '媒体机构',
          industry: '新闻媒体',
          participantType: '媒体',
          ticketNumber: 'TKT202401190001',
          checkInStatus: 'pending',
          checkInTime: null,
          checkOutTime: null,
          registrationId: null,
          badgeNumber: 'B008',
          badgeType: '媒体',
          createdTime: '2024-01-19 10:15:20',
          emergencyContact: '郑十一',
          emergencyPhone: '13100131009',
          remarks: '需要媒体采访证',
        },
      ];
      
      setParticipantsData(mockData);
      setFilteredData(mockData);
      updateStatistics(mockData);
      setLoading(false);
    }, 500);
  };

  // 更新统计数据
  const updateStatistics = (data) => {
    const checkedIn = data.filter(item => item.checkInStatus === 'checkedIn').length;
    const pending = data.filter(item => item.checkInStatus === 'pending').length;
    const checkedOut = data.filter(item => item.checkInStatus === 'checkedOut').length;
    
    // 按展会统计
    const byExhibition = {};
    data.forEach(item => {
      if (!byExhibition[item.exhibitionId]) {
        byExhibition[item.exhibitionId] = {
          name: item.exhibitionName,
          total: 0,
          checkedIn: 0,
          pending: 0,
          checkedOut: 0
        };
      }
      byExhibition[item.exhibitionId].total += 1;
      byExhibition[item.exhibitionId][item.checkInStatus] += 1;
    });
    
    // 按公司类型统计
    const byCompanyType = {};
    data.forEach(item => {
      if (!byCompanyType[item.companyType]) {
        byCompanyType[item.companyType] = {
          count: 0,
          checkedIn: 0
        };
      }
      byCompanyType[item.companyType].count += 1;
      if (item.checkInStatus === 'checkedIn') {
        byCompanyType[item.companyType].checkedIn += 1;
      }
    });
    
    setStatistics({
      total: data.length,
      checkedIn,
      pending,
      checkedOut,
      byExhibition,
      byCompanyType
    });
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadParticipantsData();
  }, []);

  // 筛选参展人员
  const handleFilter = (values) => {
    setLoading(true);
    // 模拟筛选操作
    setTimeout(() => {
      let filtered = [...participantsData];
      
      // 按展会筛选
      if (values.exhibitionId) {
        filtered = filtered.filter(item => item.exhibitionId === values.exhibitionId);
      }
      
      // 按签到状态筛选
      if (values.checkInStatus) {
        filtered = filtered.filter(item => item.checkInStatus === values.checkInStatus);
      }
      
      // 按参会类型筛选
      if (values.participantType) {
        filtered = filtered.filter(item => item.participantType === values.participantType);
      }
      
      // 按公司类型筛选
      if (values.companyType) {
        filtered = filtered.filter(item => item.companyType === values.companyType);
      }
      
      // 按关键词搜索
      if (values.keyword) {
        const keyword = values.keyword.toLowerCase();
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(keyword) ||
          item.phone.includes(keyword) ||
          item.company.toLowerCase().includes(keyword) ||
          item.email.toLowerCase().includes(keyword) ||
          item.ticketNumber?.toLowerCase().includes(keyword) ||
          item.badgeNumber?.toLowerCase().includes(keyword)
        );
      }
      
      setFilteredData(filtered);
      updateStatistics(filtered);
      setLoading(false);
    }, 300);
  };

  // 重置筛选条件
  const handleReset = () => {
    form.resetFields();
    setFilteredData(participantsData);
    updateStatistics(participantsData);
  };

  // 打开添加参展人员弹窗
  const handleAddParticipant = () => {
    editForm.resetFields();
    setShowAddModal(true);
  };

  // 打开编辑参展人员弹窗
  const handleEditParticipant = (record) => {
    setCurrentParticipant(record);
    editForm.setFieldsValue({
      ...record,
      // 转换特殊字段格式
      exhibitionId: record.exhibitionId,
    });
    setShowEditModal(true);
  };

  // 添加参展人员
  const handleAddSubmit = (values) => {
    setLoading(true);
    // 模拟添加操作
    setTimeout(() => {
      const newParticipant = {
        ...values,
        id: `p${participantsData.length + 1}`,
        createdTime: new Date().toLocaleString('zh-CN'),
        checkInStatus: 'pending',
        checkInTime: null,
        checkOutTime: null,
        registrationId: null,
        exhibitionName: exhibitionData.find(ex => ex.exhibitionId === values.exhibitionId)?.exhibitionName || values.exhibitionId,
      };
      
      const updatedData = [...participantsData, newParticipant];
      setParticipantsData(updatedData);
      setFilteredData(updatedData.filter(item => 
        // 保留当前筛选条件下的数据
        (form.getFieldValue('exhibitionId') ? item.exhibitionId === form.getFieldValue('exhibitionId') : true) &&
        (form.getFieldValue('checkInStatus') ? item.checkInStatus === form.getFieldValue('checkInStatus') : true) &&
        (form.getFieldValue('participantType') ? item.participantType === form.getFieldValue('participantType') : true) &&
        (form.getFieldValue('companyType') ? item.companyType === form.getFieldValue('companyType') : true)
      ));
      
      updateStatistics(updatedData);
      setShowAddModal(false);
      message.success('参展人员添加成功');
      setLoading(false);
    }, 500);
  };

  // 编辑参展人员
  const handleEditSubmit = (values) => {
    setLoading(true);
    // 模拟编辑操作
    setTimeout(() => {
      const updatedData = participantsData.map(item => 
        item.id === currentParticipant.id 
          ? { 
              ...item, 
              ...values,
              exhibitionName: exhibitionData.find(ex => ex.exhibitionId === values.exhibitionId)?.exhibitionName || values.exhibitionId,
            } 
          : item
      );
      
      setParticipantsData(updatedData);
      setFilteredData(updatedData.filter(item => 
        // 保留当前筛选条件下的数据
        (form.getFieldValue('exhibitionId') ? item.exhibitionId === form.getFieldValue('exhibitionId') : true) &&
        (form.getFieldValue('checkInStatus') ? item.checkInStatus === form.getFieldValue('checkInStatus') : true) &&
        (form.getFieldValue('participantType') ? item.participantType === form.getFieldValue('participantType') : true) &&
        (form.getFieldValue('companyType') ? item.companyType === form.getFieldValue('companyType') : true)
      ));
      
      updateStatistics(updatedData);
      setShowEditModal(false);
      message.success('参展人员信息更新成功');
      setLoading(false);
    }, 500);
  };

  // 删除参展人员
  const handleDelete = (id) => {
    setLoading(true);
    // 模拟删除操作
    setTimeout(() => {
      const updatedData = participantsData.filter(item => item.id !== id);
      setParticipantsData(updatedData);
      setFilteredData(updatedData.filter(item => 
        // 保留当前筛选条件下的数据
        (form.getFieldValue('exhibitionId') ? item.exhibitionId === form.getFieldValue('exhibitionId') : true) &&
        (form.getFieldValue('checkInStatus') ? item.checkInStatus === form.getFieldValue('checkInStatus') : true) &&
        (form.getFieldValue('participantType') ? item.participantType === form.getFieldValue('participantType') : true) &&
        (form.getFieldValue('companyType') ? item.companyType === form.getFieldValue('companyType') : true)
      ));
      
      updateStatistics(updatedData);
      message.success('参展人员删除成功');
      setLoading(false);
    }, 300);
  };

  // 批量删除参展人员
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的参展人员');
      return;
    }
    
    setLoading(true);
    // 模拟批量删除操作
    setTimeout(() => {
      const updatedData = participantsData.filter(item => !selectedRowKeys.includes(item.id));
      setParticipantsData(updatedData);
      setFilteredData(updatedData.filter(item => 
        // 保留当前筛选条件下的数据
        (form.getFieldValue('exhibitionId') ? item.exhibitionId === form.getFieldValue('exhibitionId') : true) &&
        (form.getFieldValue('checkInStatus') ? item.checkInStatus === form.getFieldValue('checkInStatus') : true) &&
        (form.getFieldValue('participantType') ? item.participantType === form.getFieldValue('participantType') : true) &&
        (form.getFieldValue('companyType') ? item.companyType === form.getFieldValue('companyType') : true)
      ));
      
      updateStatistics(updatedData);
      setSelectedRowKeys([]);
      message.success(`成功删除 ${selectedRowKeys.length} 条参展人员信息`);
      setLoading(false);
    }, 300);
  };

  // 导入参展人员数据
  const handleImport = () => {
    message.info('请选择Excel文件进行导入');
  };

  // 导出参展人员数据
  const handleExport = () => {
    setLoading(true);
    // 模拟导出操作
    setTimeout(() => {
      message.success('参展人员数据导出成功');
      setLoading(false);
    }, 500);
  };

  // 刷新数据
  const handleRefresh = () => {
    loadParticipantsData();
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // 签到状态标签渲染
  const renderCheckInStatusTag = (status) => {
    const statusMap = {
      'pending': { color: 'default', text: '未签到', icon: <ClockCircleOutlined /> },
      'checkedIn': { color: 'blue', text: '已签到', icon: <CheckOutlined /> },
      'checkedOut': { color: 'cyan', text: '已签退', icon: <CheckOutlined /> },
    };
    
    const config = statusMap[status] || { color: 'default', text: '未知', icon: null };
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  // 参会类型标签渲染
  const renderParticipantTypeTag = (type) => {
    const typeMap = {
      '专业观众': { color: 'blue', text: '专业观众' },
      '参展商': { color: 'green', text: '参展商' },
      '媒体': { color: 'purple', text: '媒体' },
      '演讲嘉宾': { color: 'orange', text: '演讲嘉宾' },
    };
    
    const config = typeMap[type] || { color: 'default', text: '未知' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 工作证类型标签渲染
  const renderBadgeTypeTag = (type) => {
    const typeMap = {
      'VIP': { color: 'red', text: 'VIP' },
      '标准': { color: 'blue', text: '标准' },
      '参展商': { color: 'green', text: '参展商' },
      '媒体': { color: 'purple', text: '媒体' },
    };
    
    const config = typeMap[type] || { color: 'default', text: '未知' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列配置
  const columns = [
    {
      title: '展会名称',
      dataIndex: 'exhibitionName',
      key: 'exhibitionName',
      width: 180,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
      width: 200,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: '参会类型',
      key: 'participantType',
      width: 100,
      render: (_, record) => renderParticipantTypeTag(record.participantType),
    },
    {
      title: '工作证号',
      dataIndex: 'badgeNumber',
      key: 'badgeNumber',
      width: 100,
    },
    {
      title: '工作证类型',
      key: 'badgeType',
      width: 100,
      render: (_, record) => renderBadgeTypeTag(record.badgeType),
    },
    {
      title: '签到状态',
      key: 'checkInStatus',
      width: 100,
      render: (_, record) => renderCheckInStatusTag(record.checkInStatus),
    },
    {
      title: '签到时间',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      width: 150,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑信息">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditParticipant(record)} />
          </Tooltip>
          <Popconfirm
            title="确定要删除这条参展人员信息吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 自定义展开行内容
  const expandableRowRender = (record) => (
    <div style={{ padding: 20, backgroundColor: '#fafafa' }}>
      <Card title="详细信息" size="small">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 20px' }}>
          <div><strong>邮箱：</strong>{record.email}</div>
          <div><strong>部门：</strong>{record.department || '无'}</div>
          <div><strong>公司类型：</strong>{record.companyType}</div>
          <div><strong>行业：</strong>{record.industry}</div>
          <div><strong>票号：</strong>{record.ticketNumber || '无'}</div>
          <div><strong>创建时间：</strong>{record.createdTime}</div>
          <div><strong>签退时间：</strong>{record.checkOutTime || '无'}</div>
          <div><strong>紧急联系人：</strong>{record.emergencyContact}</div>
          <div><strong>紧急联系电话：</strong>{record.emergencyPhone}</div>
          {record.registrationId && (
            <div><strong>报名ID：</strong>{record.registrationId}</div>
          )}
          {record.remarks && (
            <div style={{ gridColumn: '1 / -1' }}><strong>备注：</strong>{record.remarks}</div>
          )}
        </div>
      </Card>
    </div>
  );

  // 统计卡片配置
  const renderStatisticsCards = () => {
    const cards = [
      { title: '总人数', count: statistics.total, color: 'blue', icon: <UserAddOutlined /> },
      { title: '已签到', count: statistics.checkedIn, color: 'green', icon: <CheckOutlined /> },
      { title: '未签到', count: statistics.pending, color: 'orange', icon: <ClockCircleOutlined /> },
      { title: '已签退', count: statistics.checkedOut, color: 'cyan', icon: <CheckOutlined /> },
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
        {cards.map((card, index) => (
          <Card 
            key={index} 
            bordered={false} 
            size="small" 
            style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: `#${card.color}` }}>
                  {card.count}
                </div>
                <div style={{ color: '#666', marginTop: 5 }}>{card.title}</div>
              </div>
              <div style={{ fontSize: 32, color: `#${card.color}40` }}>{card.icon}</div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // 添加/编辑表单配置
  const renderParticipantForm = () => (
    <Form
      form={editForm}
      layout="vertical"
      onFinish={showAddModal ? handleAddSubmit : handleEditSubmit}
      initialValues={{
        participantType: '专业观众',
        badgeType: '标准',
      }}
    >
      <Form.Item name="exhibitionId" label="展会名称" rules={[{ required: true, message: '请选择展会' }]}>
        <Select placeholder="请选择展会">
          {exhibitionData.map(item => (
            <Select.Option key={item.exhibitionId} value={item.exhibitionId}>
              {item.exhibitionName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
        
        <Form.Item name="phone" label="手机号码" rules={[{ required: true, message: '请输入手机号码' }]}>
          <Input placeholder="请输入手机号码" />
        </Form.Item>
        
        <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        
        <Form.Item name="position" label="职位">
          <Input placeholder="请输入职位" />
        </Form.Item>
        
        <Form.Item name="company" label="公司名称" rules={[{ required: true, message: '请输入公司名称' }]}>
          <Input placeholder="请输入公司名称" />
        </Form.Item>
        
        <Form.Item name="department" label="部门">
          <Input placeholder="请输入部门" />
        </Form.Item>
        
        <Form.Item name="companyType" label="公司类型">
          <Select placeholder="请选择公司类型">
            <Select.Option value="国有企业">国有企业</Select.Option>
            <Select.Option value="民营企业">民营企业</Select.Option>
            <Select.Option value="外资企业">外资企业</Select.Option>
            <Select.Option value="科研机构">科研机构</Select.Option>
            <Select.Option value="高校">高校</Select.Option>
            <Select.Option value="媒体机构">媒体机构</Select.Option>
            <Select.Option value="其他">其他</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="industry" label="所属行业">
          <Select placeholder="请选择所属行业">
            <Select.Option value="轨道交通">轨道交通</Select.Option>
            <Select.Option value="智能交通">智能交通</Select.Option>
            <Select.Option value="电子信息">电子信息</Select.Option>
            <Select.Option value="机械制造">机械制造</Select.Option>
            <Select.Option value="软件服务">软件服务</Select.Option>
            <Select.Option value="新闻媒体">新闻媒体</Select.Option>
            <Select.Option value="其他">其他</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="participantType" label="参会类型">
          <Select placeholder="请选择参会类型">
            <Select.Option value="专业观众">专业观众</Select.Option>
            <Select.Option value="参展商">参展商</Select.Option>
            <Select.Option value="媒体">媒体</Select.Option>
            <Select.Option value="演讲嘉宾">演讲嘉宾</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="badgeType" label="工作证类型">
          <Select placeholder="请选择工作证类型">
            <Select.Option value="VIP">VIP</Select.Option>
            <Select.Option value="标准">标准</Select.Option>
            <Select.Option value="参展商">参展商</Select.Option>
            <Select.Option value="媒体">媒体</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="badgeNumber" label="工作证号">
          <Input placeholder="请输入工作证号" />
        </Form.Item>
        
        <Form.Item name="ticketNumber" label="票号">
          <Input placeholder="请输入票号" />
        </Form.Item>
        
        <Form.Item name="emergencyContact" label="紧急联系人">
          <Input placeholder="请输入紧急联系人" />
        </Form.Item>
        
        <Form.Item name="emergencyPhone" label="紧急联系电话">
          <Input placeholder="请输入紧急联系电话" />
        </Form.Item>
      </div>
      
      <Form.Item name="remarks" label="备注">
        <TextArea rows={3} placeholder="请输入备注信息" />
      </Form.Item>
      
      <Form.Item>
        <Space style={{ float: 'right' }}>
          <Button onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {showAddModal ? '添加' : '保存'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <div>
      {/* 统计卡片 */}
      {renderStatisticsCards()}
      
      {/* 筛选搜索表单 */}
      <Card title="参展人员筛选" style={{ marginBottom: 20 }}>
        <Form form={form} layout="inline" onFinish={handleFilter}>
          <Form.Item name="exhibitionId" label="展会名称">
            <Select placeholder="请选择展会" allowClear style={{ width: 200 }}>
              {exhibitionData.map(item => (
                <Select.Option key={item.exhibitionId} value={item.exhibitionId}>
                  {item.exhibitionName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="participantType" label="参会类型">
            <Select placeholder="请选择参会类型" allowClear style={{ width: 120 }}>
              <Select.Option value="专业观众">专业观众</Select.Option>
              <Select.Option value="参展商">参展商</Select.Option>
              <Select.Option value="媒体">媒体</Select.Option>
              <Select.Option value="演讲嘉宾">演讲嘉宾</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="checkInStatus" label="签到状态">
            <Select placeholder="请选择签到状态" allowClear style={{ width: 120 }}>
              <Select.Option value="pending">未签到</Select.Option>
              <Select.Option value="checkedIn">已签到</Select.Option>
              <Select.Option value="checkedOut">已签退</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="companyType" label="公司类型">
            <Select placeholder="请选择公司类型" allowClear style={{ width: 120 }}>
              <Select.Option value="国有企业">国有企业</Select.Option>
              <Select.Option value="民营企业">民营企业</Select.Option>
              <Select.Option value="外资企业">外资企业</Select.Option>
              <Select.Option value="科研机构">科研机构</Select.Option>
              <Select.Option value="高校">高校</Select.Option>
              <Select.Option value="媒体机构">媒体机构</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="keyword" label="搜索">
            <Input placeholder="姓名/手机号/公司/邮箱/票号" style={{ width: 250 }} prefix={<SearchOutlined />} />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<FilterOutlined />} loading={loading}>
                筛选
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button onClick={handleRefresh} icon={<SyncOutlined />}>刷新</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 操作工具栏 */}
      <Card style={{ marginBottom: 20 }} bodyStyle={{ padding: '10px 24px' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddParticipant}>
            添加参展人员
          </Button>
          
          <Upload
            name="file"
            fileList={uploadFileList}
            beforeUpload={() => false}
            customRequest={handleImport}
          >
            <Button icon={<UploadOutlined />}>导入数据</Button>
          </Upload>
          
          <Button icon={<FileTextOutlined />} onClick={() => message.info('下载导入模板')}>
            下载模板
          </Button>
          
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            导出数据
          </Button>
          
          <Popconfirm
            title="确定要批量删除选中的参展人员信息吗？"
            onConfirm={handleBatchDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button danger disabled={selectedRowKeys.length === 0}>
              批量删除 ({selectedRowKeys.length})
            </Button>
          </Popconfirm>
          
          <span style={{ marginLeft: 'auto', color: '#666' }}>
            共 {filteredData.length} 条数据
          </span>
        </Space>
      </Card>

      {/* 参展人员表格 */}
      <Card title="参展人员列表">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          expandable={{
            expandedRowRender: expandableRowRender,
            rowExpandable: () => true,
            expandedRowKeys: Object.keys(expandedRows).filter(key => expandedRows[key]),
            onExpand: (expanded, record) => {
              setExpandedRows(prev => ({
                ...prev,
                [record.id]: expanded
              }));
            },
          }}
        />
      </Card>

      {/* 添加参展人员弹窗 */}
      <Modal
        title="添加参展人员"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width={800}
      >
        {renderParticipantForm()}
      </Modal>

      {/* 编辑参展人员弹窗 */}
      <Modal
        title="编辑参展人员"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        width={800}
      >
        {renderParticipantForm()}
      </Modal>
    </div>
  );
};

export default ExhibitionParticipantsManagement;
