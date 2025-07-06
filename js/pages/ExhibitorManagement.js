// 参展公司管理页面 - 展会参展公司信息管理
const ExhibitorManagement = () => {
    // 从全局antd对象中获取组件
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Upload, Image, Divider, Statistic, Progress, InputNumber, Radio, Switch, DatePicker, Tooltip, Steps, Descriptions, Tabs } = window.antd;
    const { TextArea } = Input;
    const { Option } = Select;
    
    // 状态管理
    const [loading, setLoading] = React.useState(false);
    const [companies, setCompanies] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    
    // 获取展商数据
    React.useEffect(() => {
        loadCompanyData();
    }, []);

    // 加载展商数据
    const loadCompanyData = async () => {
        setLoading(true);
        try {
            // 这里应该是从API获取数据
            const mockData = [
                {
                    id: 'BJ001',
                    name: '北京地铁集团',
                    contactPerson: '张经理',
                    phone: '13800138001',
                    email: 'zhang@bjmetro.com',
                    status: '正常'
                },
                {
                    id: 'SH001',
                    name: '上海申通地铁',
                    contactPerson: '李经理',
                    phone: '13800138002',
                    email: 'li@shtmetro.com',
                    status: '正常'
                },
                {
                    id: 'GZ001',
                    name: '广州地铁集团',
                    contactPerson: '王经理',
                    phone: '13800138003',
                    email: 'wang@gzmetro.com',
                    status: '正常'
                }
            ];
            setCompanies(mockData);
            message.success('数据加载成功');
        } catch (error) {
            message.error('数据加载失败');
        } finally {
            setLoading(false);
        }
    };

    // 表格列定义
    const columns = [
        {
            title: '展商信息',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space direction="vertical" size="small">
                    <span style={{ fontWeight: 'bold' }}>{text}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>ID: {record.id}</span>
                </Space>
            )
        },
        {
            title: '联系方式',
            key: 'contact',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <span>{record.contactPerson}</span>
                    <span>{record.phone}</span>
                    <span>{record.email}</span>
                </Space>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === '正常' ? 'green' : 'red'}>{status}</Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                    <Button type="link" onClick={() => handleDelete(record)}>删除</Button>
                </Space>
            )
        }
    ];

    // 处理编辑
    const handleEdit = (record) => {
        message.info(`编辑展商: ${record.name}`);
    };

    // 处理删除
    const handleDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除展商 ${record.name} 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                setCompanies(prev => prev.filter(item => item.id !== record.id));
                message.success('删除成功');
            }
        });
    };

    // 搜索处理
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // 状态筛选
    const handleStatusFilter = (value) => {
        setStatusFilter(value);
    };

    // 过滤数据
    const filteredData = React.useMemo(() => {
        return companies.filter(item => {
            const matchSearch = !searchText || 
                item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.id.toLowerCase().includes(searchText.toLowerCase());
            
            const matchStatus = statusFilter === 'all' || item.status === statusFilter;
            
            return matchSearch && matchStatus;
        });
    }, [companies, searchText, statusFilter]);

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Space style={{ marginBottom: 16 }}>
                            <Input.Search
                                placeholder="搜索展商"
                                onSearch={handleSearch}
                                style={{ width: 200 }}
                            />
                            <Select
                                defaultValue="all"
                                style={{ width: 120 }}
                                onChange={handleStatusFilter}
                            >
                                <Option value="all">全部状态</Option>
                                <Option value="正常">正常</Option>
                                <Option value="异常">异常</Option>
                            </Select>
                            <Button type="primary" onClick={() => message.info('新增展商')}>
                                新增展商
                            </Button>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total) => `共 ${total} 条记录`
                            }}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

// 将组件挂载到正确的命名空间
window.App.pages.ExhibitorManagement = ExhibitorManagement;
console.log('[ExhibitorManagement] 组件挂载成功'); 