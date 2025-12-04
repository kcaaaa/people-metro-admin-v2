// 安全获取React和antd
const React = typeof window !== 'undefined' ? window.React : null;
const antd = typeof window !== 'undefined' ? window.antd : {};
const { Card, Form, Input, Select, DatePicker, Table, Tag, Button, Space, Modal, message, Tooltip, Badge, Popconfirm } = antd || {};
const { SearchOutlined, EyeOutlined, DeleteOutlined, EditOutlined, FilterOutlined, DownloadOutlined, SyncOutlined } = typeof window !== 'undefined' ? window['@ant-design/icons'] : {};
const { queryString } = typeof window !== 'undefined' && window['@'] && window['@'].utils ? window['@'].utils : {};

const { RangePicker } = DatePicker || {};
const { TextArea } = Input || {};

/**
 * 展会报名信息管理组件
 * 功能：查看、筛选、搜索和管理所有展会报名信息，包括报名详情查看、状态更新、删除等操作
 */
const ExhibitionRegistrationManagement = ({ exhibitionData = [] }) => {
  // 安全初始化状态
  let form = {};
  let loading = false, setLoading = () => {};
  let registrationData = [], setRegistrationData = () => {};
  let filteredData = [], setFilteredData = () => {};
  let selectedRowKeys = [], setSelectedRowKeys = () => {};
  let showDetailModal = false, setShowDetailModal = () => {};
  let currentRegistration = null, setCurrentRegistration = () => {};
  let expandedRows = {}, setExpandedRows = () => {};
  
  // 安全使用React hooks
  if (React && React.useState && Form && Form.useForm) {
    try {
      [form] = Form.useForm();
      [loading, setLoading] = React.useState(false);
      [registrationData, setRegistrationData] = React.useState([]);
      [filteredData, setFilteredData] = React.useState([]);
      [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
      [showDetailModal, setShowDetailModal] = React.useState(false);
      [currentRegistration, setCurrentRegistration] = React.useState(null);
      [expandedRows, setExpandedRows] = React.useState({});
    } catch (error) {
      console.error('Error initializing React hooks:', error);
    }
  } else {
    console.warn('React hooks not available, using fallback implementation');
  }

  // 加载报名信息数据
  const loadRegistrationData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 模拟报名数据
      const mockData = [
        {
          id: '1',
          exhibitionId: 'exhibition001',
          exhibitionName: '2024城市轨道交通技术展',
          registrationTime: '2024-01-15 10:30:22',
          status: 'approved', // pending, approved, rejected
          name: '张三',
          phone: '13800138001',
          email: 'zhangsan@example.com',
          company: '中国铁路技术集团',
          position: '技术总监',
          department: '研发部',
          participantCount: 3,
          notes: '希望了解最新的城市轨道交通技术解决方案',
          approvalTime: '2024-01-15 11:00:00',
          approvalBy: '系统管理员',
          approvalNotes: null,
          ticketNumber: 'TKT202401150001',
          checkInStatus: 'pending', // pending, checkedIn, checkedOut
          checkInTime: null,
          checkOutTime: null,
          customFields: {
            interests: ['智能调度系统', '信号控制系统'],
            specialRequirements: '需要安排翻译服务',
            dietaryRestrictions: '无',
          },
        },
        {
          id: '2',
          exhibitionId: 'exhibition001',
          exhibitionName: '2024城市轨道交通技术展',
          registrationTime: '2024-01-15 14:22:18',
          status: 'approved',
          name: '李四',
          phone: '13900139002',
          email: 'lisi@example.com',
          company: '北京地铁运营有限公司',
          position: '设备工程师',
          department: '设备维护部',
          participantCount: 1,
          notes: '关注地铁设备维护和升级',
          approvalTime: '2024-01-15 15:00:00',
          approvalBy: '系统管理员',
          approvalNotes: null,
          ticketNumber: 'TKT202401150002',
          checkInStatus: 'checkedIn',
          checkInTime: '2024-02-01 09:15:30',
          checkOutTime: null,
          customFields: {
            interests: ['设备维护', '故障诊断'],
            specialRequirements: null,
            dietaryRestrictions: '素食',
          },
        },
        {
          id: '3',
          exhibitionId: 'exhibition001',
          exhibitionName: '2024城市轨道交通技术展',
          registrationTime: '2024-01-16 09:15:40',
          status: 'pending',
          name: '王五',
          phone: '13700137003',
          email: 'wangwu@example.com',
          company: '上海轨道交通集团',
          position: '项目经理',
          department: '工程管理部',
          participantCount: 2,
          notes: '考察新的轨道交通建设技术',
          approvalTime: null,
          approvalBy: null,
          approvalNotes: null,
          ticketNumber: null,
          checkInStatus: 'pending',
          checkInTime: null,
          checkOutTime: null,
          customFields: {
            interests: ['工程建设', '项目管理'],
            specialRequirements: '需要技术资料包',
            dietaryRestrictions: null,
          },
        },
        {
          id: '4',
          exhibitionId: 'exhibition002',
          exhibitionName: '2024智能交通创新论坛',
          registrationTime: '2024-01-16 16:45:22',
          status: 'rejected',
          name: '赵六',
          phone: '13600136004',
          email: 'zhaoliu@example.com',
          company: '深圳智能交通研究院',
          position: '研究员',
          department: '智能交通研究所',
          participantCount: 1,
          notes: '研究智能交通系统和算法',
          approvalTime: '2024-01-17 10:30:00',
          approvalBy: '系统管理员',
          approvalNotes: '报名信息不完整',
          ticketNumber: null,
          checkInStatus: 'pending',
          checkInTime: null,
          checkOutTime: null,
          customFields: {
            interests: ['智能算法', '交通大数据'],
            specialRequirements: null,
            dietaryRestrictions: null,
          },
        },
        {
          id: '5',
          exhibitionId: 'exhibition002',
          exhibitionName: '2024智能交通创新论坛',
          registrationTime: '2024-01-17 11:20:35',
          status: 'approved',
          name: '钱七',
          phone: '13500135005',
          email: 'qianqi@example.com',
          company: '广州交通集团',
          position: '技术负责人',
          department: '信息科技部',
          participantCount: 4,
          notes: '寻求智能交通解决方案合作',
          approvalTime: '2024-01-17 14:00:00',
          approvalBy: '系统管理员',
          approvalNotes: null,
          ticketNumber: 'TKT202401170001',
          checkInStatus: 'pending',
          checkInTime: null,
          checkOutTime: null,
          customFields: {
            interests: ['智能调度', '车路协同'],
            specialRequirements: '需要安排VIP接待',
            dietaryRestrictions: '海鲜过敏',
          },
        },
        {
          id: '6',
          exhibitionId: 'exhibition001',
          exhibitionName: '2024城市轨道交通技术展',
          registrationTime: '2024-01-18 09:45:10',
          status: 'approved',
          name: '孙八',
          phone: '13400134006',
          email: 'sunba@example.com',
          company: '成都地铁集团',
          position: '采购经理',
          department: '物资采购部',
          participantCount: 2,
          notes: '考察设备采购可能性',
          approvalTime: '2024-01-18 10:30:00',
          approvalBy: '系统管理员',
          approvalNotes: null,
          ticketNumber: 'TKT202401180001',
          checkInStatus: 'checkedIn',
          checkInTime: '2024-02-01 10:20:15',
          checkOutTime: '2024-02-01 16:30:45',
          customFields: {
            interests: ['设备采购', '供应商评估'],
            specialRequirements: null,
            dietaryRestrictions: null,
          },
        },
      ];
      
      setRegistrationData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 500);
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadRegistrationData();
  }, []);

  // 筛选报名信息
  const handleFilter = (values) => {
    setLoading(true);
    // 模拟筛选操作
    setTimeout(() => {
      let filtered = [...registrationData];
      
      // 按展会筛选
      if (values.exhibitionId) {
        filtered = filtered.filter(item => item.exhibitionId === values.exhibitionId);
      }
      
      // 按报名状态筛选
      if (values.status) {
        filtered = filtered.filter(item => item.status === values.status);
      }
      
      // 按签到状态筛选
      if (values.checkInStatus) {
        filtered = filtered.filter(item => item.checkInStatus === values.checkInStatus);
      }
      
      // 按报名时间段筛选
      if (values.registrationTimeRange && values.registrationTimeRange.length === 2) {
        const startTime = values.registrationTimeRange[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = values.registrationTimeRange[1].format('YYYY-MM-DD HH:mm:ss');
        filtered = filtered.filter(item => item.registrationTime >= startTime && item.registrationTime <= endTime);
      }
      
      // 按姓名/手机号/公司筛选
      if (values.keyword) {
        const keyword = values.keyword.toLowerCase();
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(keyword) ||
          item.phone.includes(keyword) ||
          item.company.toLowerCase().includes(keyword) ||
          item.email.toLowerCase().includes(keyword)
        );
      }
      
      setFilteredData(filtered);
      setLoading(false);
    }, 300);
  };

  // 重置筛选条件
  const handleReset = () => {
    form.resetFields();
    setFilteredData(registrationData);
  };

  // 查看报名详情
  const handleViewDetail = (record) => {
    setCurrentRegistration(record);
    setShowDetailModal(true);
  };

  // 删除报名信息
  const handleDelete = (id) => {
    setLoading(true);
    // 模拟删除操作
    setTimeout(() => {
      const updatedData = registrationData.filter(item => item.id !== id);
      setRegistrationData(updatedData);
      setFilteredData(updatedData.filter(item => 
        // 保留当前筛选条件下的数据
        (form.getFieldValue('exhibitionId') ? item.exhibitionId === form.getFieldValue('exhibitionId') : true) &&
        (form.getFieldValue('status') ? item.status === form.getFieldValue('status') : true) &&
        (form.getFieldValue('checkInStatus') ? item.checkInStatus === form.getFieldValue('checkInStatus') : true)
      ));
      message.success('报名信息已删除');
      setLoading(false);
    }, 300);
  };

  // 批量删除报名信息
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的报名信息');
      return;
    }
    
    setLoading(true);
    // 模拟批量删除操作
    setTimeout(() => {
      const updatedData = registrationData.filter(item => !selectedRowKeys.includes(item.id));
      setRegistrationData(updatedData);
      setFilteredData(updatedData.filter(item => 
        // 保留当前筛选条件下的数据
        (form.getFieldValue('exhibitionId') ? item.exhibitionId === form.getFieldValue('exhibitionId') : true) &&
        (form.getFieldValue('status') ? item.status === form.getFieldValue('status') : true) &&
        (form.getFieldValue('checkInStatus') ? item.checkInStatus === form.getFieldValue('checkInStatus') : true)
      ));
      setSelectedRowKeys([]);
      message.success(`成功删除 ${selectedRowKeys.length} 条报名信息`);
      setLoading(false);
    }, 300);
  };

  // 导出报名信息
  const handleExport = () => {
    setLoading(true);
    // 模拟导出操作
    setTimeout(() => {
      message.success('报名信息导出成功');
      setLoading(false);
    }, 500);
  };

  // 刷新数据
  const handleRefresh = () => {
    loadRegistrationData();
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // 状态标签渲染
  const renderStatusTag = (status) => {
    const statusMap = {
      'pending': { color: 'orange', text: '待审核' },
      'approved': { color: 'green', text: '已通过' },
      'rejected': { color: 'red', text: '已拒绝' },
    };
    
    const config = statusMap[status] || { color: 'default', text: '未知' };
    
    // 安全渲染，避免JSX语法错误
    if (React && Tag && React.createElement) {
      return React.createElement(Tag, { color: config.color }, config.text);
    }
    // 降级处理
    return document.createElement ? document.createElement('span') : null;
  };

  // 签到状态标签渲染
  const renderCheckInStatusTag = (status) => {
    const statusMap = {
      'pending': { color: 'default', text: '未签到' },
      'checkedIn': { color: 'blue', text: '已签到' },
      'checkedOut': { color: 'cyan', text: '已签退' },
    };
    
    const config = statusMap[status] || { color: 'default', text: '未知' };
    
    // 安全渲染，避免JSX语法错误
    if (React && Tag && React.createElement) {
      return React.createElement(Tag, { color: config.color }, config.text);
    }
    // 降级处理
    return document.createElement ? document.createElement('span') : null;
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
      title: '报名人',
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
      title: '报名人数',
      dataIndex: 'participantCount',
      key: 'participantCount',
      width: 80,
    },
    {
      title: '报名时间',
      dataIndex: 'registrationTime',
      key: 'registrationTime',
      width: 150,
    },
    {
      title: '报名状态',
      key: 'status',
      width: 100,
      render: (_, record) => renderStatusTag(record.status),
    },
    {
      title: '签到状态',
      key: 'checkInStatus',
      width: 100,
      render: (_, record) => renderCheckInStatusTag(record.checkInStatus),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} />
          </Tooltip>
          <Tooltip title="编辑信息">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleViewDetail(record)} />
          </Tooltip>
          <Popconfirm
            title="确定要删除这条报名信息吗？"
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
  const expandableRowRender = (record) => React.createElement(
    'div',
    { style: { padding: 20, backgroundColor: '#fafafa' } },
    React.createElement(
      Card,
      { title: "自定义表单信息", size: "small" },
      React.createElement(
        'div',
        { style: { marginBottom: 10 } },
        React.createElement('strong', null, "感兴趣的领域："),
        ' ',
        (record.customFields?.interests?.join(', ') || '无')
      ),
      React.createElement(
        'div',
        { style: { marginBottom: 10 } },
        React.createElement('strong', null, "期望了解的内容："),
        ' ',
        (record.customFields?.expectations || '无')
      ),
      React.createElement(
        'div',
        { style: { marginBottom: 10 } },
        React.createElement('strong', null, "特殊需求："),
        ' ',
        (record.customFields?.specialNeeds || '无')
      )
    )
  )
          <strong>特殊需求：</strong>
          {record.customFields?.specialRequirements || '无'}
        </div>
        <div>
          <strong>饮食限制：</strong>
          {record.customFields?.dietaryRestrictions || '无'}
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      {/* 筛选搜索表单 */}
      <Card title="报名信息筛选" style={{ marginBottom: 20 }}>
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
          
          <Form.Item name="status" label="报名状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="approved">已通过</Select.Option>
              <Select.Option value="rejected">已拒绝</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="checkInStatus" label="签到状态">
            <Select placeholder="请选择签到状态" allowClear style={{ width: 120 }}>
              <Select.Option value="pending">未签到</Select.Option>
              <Select.Option value="checkedIn">已签到</Select.Option>
              <Select.Option value="checkedOut">已签退</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="registrationTimeRange" label="报名时间段">
            <RangePicker showTime placeholder={['开始时间', '结束时间']} style={{ width: 320 }} />
          </Form.Item>
          
          <Form.Item name="keyword" label="搜索">
            <Input placeholder="姓名/手机号/公司/邮箱" style={{ width: 200 }} prefix={<SearchOutlined />} />
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
          <Popconfirm
            title="确定要批量删除选中的报名信息吗？"
            onConfirm={handleBatchDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button danger disabled={selectedRowKeys.length === 0}>
              批量删除 ({selectedRowKeys.length})
            </Button>
          </Popconfirm>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            导出数据
          </Button>
          <span style={{ marginLeft: 'auto', color: '#666' }}>
            共 {filteredData.length} 条数据
          </span>
        </Space>
      </Card>

      {/* 报名信息表格 */}
      <Card title="报名信息列表">
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
            rowExpandable: (record) => !!record.customFields,
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

      // 详情弹窗
      React.createElement(Modal,
        {
          title: "报名信息详情",
          open: showDetailModal,
          onCancel: () => setShowDetailModal(false),
          footer: null,
          width: 700
        },
        currentRegistration ? React.createElement(
          'div',
          null,
          // 基本信息Card
          React.createElement(Card, { size: "small", title: "基本信息", style: { marginBottom: 16 } },
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' } },
              React.createElement('div', null, React.createElement('strong', null, "展会名称："), currentRegistration.exhibitionName),
              React.createElement('div', null, React.createElement('strong', null, "报名时间："), currentRegistration.registrationTime),
              React.createElement('div', null, React.createElement('strong', null, "报名状态："), renderStatusTag(currentRegistration.status)),
              React.createElement('div', null, React.createElement('strong', null, "签到状态："), renderCheckInStatusTag(currentRegistration.checkInStatus)),
              React.createElement('div', null, React.createElement('strong', null, "姓名："), currentRegistration.name),
              React.createElement('div', null, React.createElement('strong', null, "手机号码："), currentRegistration.phone),
              React.createElement('div', null, React.createElement('strong', null, "邮箱："), currentRegistration.email),
              React.createElement('div', null, React.createElement('strong', null, "公司："), currentRegistration.company),
              React.createElement('div', null, React.createElement('strong', null, "职位："), currentRegistration.position),
              React.createElement('div', null, React.createElement('strong', null, "部门："), currentRegistration.department),
              React.createElement('div', null, React.createElement('strong', null, "报名人数："), currentRegistration.participantCount),
              currentRegistration.ticketNumber ? 
                React.createElement('div', null, React.createElement('strong', null, "票号："), currentRegistration.ticketNumber) : null
            )
          ),
          
          // 备注Card
          currentRegistration.notes ? 
            React.createElement(Card, { size: "small", title: "备注", style: { marginBottom: 16 } },
              React.createElement('div', null, currentRegistration.notes)
            ) : null,
          
          // 审核信息Card
          currentRegistration.status !== 'pending' ? 
            React.createElement(Card, { size: "small", title: "审核信息", style: { marginBottom: 16 } },
              React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' } },
                React.createElement('div', null, React.createElement('strong', null, "审核时间："), currentRegistration.approvalTime || '无'),
                React.createElement('div', null, React.createElement('strong', null, "审核人："), currentRegistration.approvalBy || '无'),
                currentRegistration.approvalNotes ? 
                  React.createElement('div', { style: { gridColumn: '1 / -1' } }, React.createElement('strong', null, "审核备注："), currentRegistration.approvalNotes) : null
              )
            ) : null,
          
          // 签到信息Card
          currentRegistration.checkInStatus !== 'pending' ? 
            React.createElement(Card, { size: "small", title: "签到信息", style: { marginBottom: 16 } },
              React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' } },
                React.createElement('div', null, React.createElement('strong', null, "签到时间："), currentRegistration.checkInTime || '无'),
                React.createElement('div', null, React.createElement('strong', null, "签退时间："), currentRegistration.checkOutTime || '无')
              )
            ) : null,
          
          // 自定义表单信息Card
          currentRegistration.customFields ? 
            React.createElement(Card, { size: "small", title: "自定义表单信息" },
              React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' } },
                React.createElement('div', null, React.createElement('strong', null, "感兴趣的领域："), currentRegistration.customFields.interests?.join(', ') || '无'),
                currentRegistration.customFields.specialRequirements ? 
                  React.createElement('div', { style: { gridColumn: '1 / -1' } }, React.createElement('strong', null, "特殊需求："), currentRegistration.customFields.specialRequirements) : null,
                currentRegistration.customFields.dietaryRestrictions ? 
                  React.createElement('div', { style: { gridColumn: '1 / -1' } }, React.createElement('strong', null, "饮食限制："), currentRegistration.customFields.dietaryRestrictions) : null
              )
            ) : null
        ) : null
      )
    )
  );
};

// 安全导出模块
try {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExhibitionRegistrationManagement;
  }
} catch (e) {
  console.warn('Error exporting module:', e);
}

// 安全注册组件到window对象
try {
  if (typeof window !== 'undefined') {
    if (!window.App) window.App = {};
    if (!window.App.pages) window.App.pages = {};
    window.App.pages.ExhibitionRegistrationManagement = ExhibitionRegistrationManagement;
  }
} catch (e) {
  console.warn('Error registering component to window:', e);
}
