// 参展公司管理页面 - 展会运营参展公司信息管理
window.App = window.App || {};
window.App.pages = window.App.pages || {};
const ExhibitorManagement = () => {
    // 从全局antd对象中获取组件
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Upload, Image, Divider, Statistic, Progress, InputNumber, Radio, Switch, DatePicker, Tooltip, Steps, Descriptions, Tabs, Badge, Popconfirm, Drawer } = window.antd;
    const { TextArea } = Input;
    const { Option } = Select;
    const { TabPane } = Tabs;
    
    // 状态管理
    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('exhibitors');
    
    // 展商管理状态
    const [exhibitors, setExhibitors] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [exhibitorModalVisible, setExhibitorModalVisible] = React.useState(false);
    const [editingExhibitor, setEditingExhibitor] = React.useState(null);
    const [exhibitorForm] = Form.useForm();
    
    // 审核管理状态
    const [pendingChanges, setPendingChanges] = React.useState([]);
    const [reviewModalVisible, setReviewModalVisible] = React.useState(false);
    const [reviewingChange, setReviewingChange] = React.useState(null);
    const [reviewForm] = Form.useForm();
    
    // 统计数据状态
    const [statistics, setStatistics] = React.useState({
        totalExhibitors: 0,
        pendingReviews: 0,
        approvedToday: 0,
        rejectedToday: 0
    });

    // 初始化数据
    React.useEffect(() => {
        loadExhibitorsData();
        loadPendingChanges();
        loadStatistics();
    }, []);

    // 加载展商数据
    const loadExhibitorsData = async () => {
        setLoading(true);
        try {
            // 模拟API调用
            const mockData = [
                {
                    id: 'EX001',
                    name: '中车集团',
                    contactPerson: '张经理',
                    phone: '13800138001',
                    email: 'zhang@crrc.com',
                    status: 'active',
                    approvalStatus: 'approved',
                    createTime: '2024-01-15 10:30:00',
                    lastUpdateTime: '2024-01-20 14:20:00',
                    description: '中国中车股份有限公司是全球规模最大、品种最全、技术领先的轨道交通装备供应商。',
                    website: 'https://www.crrcgc.cc',
                    logo: null,
                    companyImages: [],
                    productCount: 5,
                    onlineProductCount: 3
                },
                {
                    id: 'EX002',
                    name: '比亚迪轨道交通',
                    contactPerson: '李总监',
                    phone: '13800138002',
                    email: 'li@byd.com',
                    status: 'active',
                    approvalStatus: 'pending',
                    createTime: '2024-01-16 14:20:00',
                    lastUpdateTime: '2024-01-22 09:15:00',
                    description: '比亚迪轨道交通有限公司专注于轨道交通领域的创新发展。',
                    website: 'https://rail.byd.com',
                    logo: null,
                    companyImages: [],
                    productCount: 3,
                    onlineProductCount: 1
                },
                {
                    id: 'EX003',
                    name: '中国城市轨道交通协会',
                    contactPerson: '王会长',
                    phone: '13800138006',
                    email: 'wang@camet.org.cn',
                    status: 'active',
                    approvalStatus: 'approved',
                    createTime: '2024-01-10 09:00:00',
                    lastUpdateTime: '2024-01-25 16:30:00',
                    description: '中国城市轨道交通协会成立于2009年，是全国性、行业性、非营利性社会组织。',
                    website: 'http://www.camet.org.cn',
                    logo: null,
                    companyImages: [],
                    productCount: 8,
                    onlineProductCount: 6
                }
            ];
            setExhibitors(mockData);
        } catch (error) {
            message.error('加载展商数据失败');
        } finally {
            setLoading(false);
        }
    };

    // 加载待审核变更
    const loadPendingChanges = async () => {
        try {
            const mockChanges = [
                {
                    id: 'CHG001',
                    type: 'exhibitor_info',
                    exhibitorId: 'EX002',
                    exhibitorName: '比亚迪轨道交通',
                    submitTime: '2024-01-22 09:15:00',
                    status: 'pending',
                    priority: 'high',
                    changes: {
                        before: {
                            description: '比亚迪轨道交通有限公司专注于轨道交通领域的创新发展。',
                            website: 'https://rail.byd.com',
                            email: 'li@byd.com'
                        },
                        after: {
                            description: '比亚迪轨道交通有限公司是全球领先的新能源轨道交通解决方案提供商，专注于轨道交通领域的创新发展和技术突破。',
                            website: 'https://rail.byd.com/cn',
                            email: 'contact@byd-rail.com'
                        }
                    }
                },
                {
                    id: 'CHG002',
                    type: 'product_online',
                    exhibitorId: 'EX001',
                    exhibitorName: '中车集团',
                    submitTime: '2024-01-23 14:30:00',
                    status: 'pending',
                    priority: 'normal',
                    productInfo: {
                        name: '和谐号CRH380D动车组',
                        description: '最新一代高速动车组，最高运营速度380km/h',
                        category: '动车组',
                        specifications: '8节编组，定员556人'
                    }
                },
                {
                    id: 'CHG003',
                    type: 'product_online',
                    exhibitorId: 'EX003',
                    exhibitorName: '中国城市轨道交通协会',
                    submitTime: '2024-01-24 11:20:00',
                    status: 'pending',
                    priority: 'normal',
                    productInfo: {
                        name: '轨道交通标准化管理系统',
                        description: '用于轨道交通行业标准制定和管理的专业系统',
                        category: '管理系统',
                        specifications: '支持多标准体系管理'
                    }
                }
            ];
            setPendingChanges(mockChanges);
        } catch (error) {
            message.error('加载待审核数据失败');
        }
    };

    // 加载统计数据
    const loadStatistics = async () => {
        try {
            const mockStats = {
                totalExhibitors: 15,
                pendingReviews: 3,
                approvedToday: 2,
                rejectedToday: 1
            };
            setStatistics(mockStats);
        } catch (error) {
            message.error('加载统计数据失败');
        }
    };

    // 展商表格列定义
    const exhibitorColumns = [
        {
            title: '展商信息',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            render: (text, record) => React.createElement('div', null, [
                React.createElement('div', {
                    key: 'name',
                    style: { fontWeight: 'bold', marginBottom: '4px' }
                }, text),
                React.createElement('div', {
                    key: 'id',
                    style: { color: '#666', fontSize: '12px', marginBottom: '4px' }
                }, `ID: ${record.id}`),
                React.createElement('div', {
                    key: 'contact',
                    style: { color: '#666', fontSize: '12px' }
                }, `${record.contactPerson} | ${record.phone}`)
            ])
        },
        {
            title: '审核状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            width: 120,
            render: (status) => React.createElement(Tag, {
                color: status === 'approved' ? 'green' : 
                       status === 'pending' ? 'orange' : 'red'
            }, status === 'approved' ? '已审核' : 
               status === 'pending' ? '待审核' : '已拒绝')
        },
        {
            title: '产品统计',
            key: 'products',
            width: 120,
            render: (_, record) => React.createElement('div', null, [
                React.createElement('div', {
                    key: 'total',
                    style: { fontSize: '12px' }
                }, `总数: ${record.productCount}`),
                React.createElement('div', {
                    key: 'online',
                    style: { fontSize: '12px', color: '#52c41a' }
                }, `在线: ${record.onlineProductCount}`)
            ])
        },
        {
            title: '最后更新',
            dataIndex: 'lastUpdateTime',
            key: 'lastUpdateTime',
            width: 180
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record) => React.createElement(Space, { size: 'small' }, [
                React.createElement(Button, {
                    key: 'edit',
                    size: 'small',
                    type: 'link',
                    onClick: () => handleEditExhibitor(record)
                }, '编辑'),
                React.createElement(Button, {
                    key: 'view',
                    size: 'small',
                    type: 'link',
                    onClick: () => handleViewExhibitor(record)
                }, '详情'),
                React.createElement(Popconfirm, {
                    key: 'delete',
                    title: '确定要删除该展商吗？',
                    onConfirm: () => handleDeleteExhibitor(record),
                    okText: '确定',
                    cancelText: '取消'
                }, React.createElement(Button, {
                    size: 'small',
                    type: 'link',
                    danger: true
                }, '删除'))
            ])
        }
    ];

    // 审核变更表格列定义
    const changesColumns = [
        {
            title: '变更信息',
            key: 'info',
            width: 300,
            render: (_, record) => React.createElement('div', null, [
                React.createElement('div', {
                    key: 'exhibitor',
                    style: { fontWeight: 'bold', marginBottom: '4px' }
                }, record.exhibitorName),
                React.createElement('div', {
                    key: 'type',
                    style: { color: '#666', fontSize: '12px', marginBottom: '4px' }
                }, record.type === 'exhibitor_info' ? '展商信息变更' : '产品上架申请'),
                React.createElement('div', {
                    key: 'time',
                    style: { color: '#666', fontSize: '12px' }
                }, `提交时间: ${record.submitTime}`)
            ])
        },
        {
            title: '变更内容',
            key: 'content',
            render: (_, record) => {
                if (record.type === 'exhibitor_info') {
                    return React.createElement('div', { style: { fontSize: '12px' } }, [
                        React.createElement('div', { key: 'desc' }, '公司描述、网址、邮箱等信息变更'),
                        React.createElement(Button, {
                            key: 'detail',
                            size: 'small',
                            type: 'link',
                            onClick: () => handleViewChanges(record)
                        }, '查看详情')
                    ]);
                } else {
                    return React.createElement('div', { style: { fontSize: '12px' } }, [
                        React.createElement('div', { key: 'product' }, `产品: ${record.productInfo?.name}`),
                        React.createElement('div', { key: 'category' }, `分类: ${record.productInfo?.category}`)
                    ]);
                }
            }
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            width: 100,
            render: (priority) => React.createElement(Tag, {
                color: priority === 'high' ? 'red' : 
                       priority === 'normal' ? 'blue' : 'default'
            }, priority === 'high' ? '高' : 
               priority === 'normal' ? '普通' : '低')
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => React.createElement(Tag, {
                color: status === 'pending' ? 'orange' : 
                       status === 'approved' ? 'green' : 'red'
            }, status === 'pending' ? '待审核' : 
               status === 'approved' ? '已通过' : '已拒绝')
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record) => React.createElement(Space, { size: 'small' }, [
                React.createElement(Button, {
                    key: 'review',
                    size: 'small',
                    type: 'primary',
                    onClick: () => handleReviewChange(record)
                }, '审核'),
                React.createElement(Button, {
                    key: 'approve',
                    size: 'small',
                    type: 'link',
                    style: { color: '#52c41a' },
                    onClick: () => handleQuickApprove(record)
                }, '快速通过'),
                React.createElement(Button, {
                    key: 'reject',
                    size: 'small',
                    type: 'link',
                    danger: true,
                    onClick: () => handleQuickReject(record)
                }, '快速拒绝')
            ])
        }
    ];

    // 处理新增展商
    const handleAddExhibitor = () => {
        setEditingExhibitor(null);
        exhibitorForm.resetFields();
        setExhibitorModalVisible(true);
    };

    // 处理编辑展商
    const handleEditExhibitor = (exhibitor) => {
        setEditingExhibitor(exhibitor);
        exhibitorForm.setFieldsValue(exhibitor);
        setExhibitorModalVisible(true);
    };

    // 处理查看展商详情
    const handleViewExhibitor = (exhibitor) => {
        Modal.info({
            title: `展商详情 - ${exhibitor.name}`,
            width: 800,
            content: React.createElement('div', null, [
                React.createElement(Descriptions, {
                    key: 'desc',
                    column: 2,
                    bordered: true,
                    items: [
                        { label: '展商ID', children: exhibitor.id },
                        { label: '公司名称', children: exhibitor.name },
                        { label: '联系人', children: exhibitor.contactPerson },
                        { label: '联系电话', children: exhibitor.phone },
                        { label: '邮箱', children: exhibitor.email },
                        { label: '网址', children: exhibitor.website || '未设置' },
                        { label: '创建时间', children: exhibitor.createTime },
                        { label: '最后更新', children: exhibitor.lastUpdateTime },
                        { label: '产品总数', children: exhibitor.productCount },
                        { label: '在线产品', children: exhibitor.onlineProductCount },
                        { label: '公司描述', children: exhibitor.description, span: 2 }
                    ]
                })
            ])
        });
    };

    // 处理删除展商
    const handleDeleteExhibitor = (exhibitor) => {
        setExhibitors(prev => prev.filter(item => item.id !== exhibitor.id));
        message.success('删除成功');
        loadStatistics(); // 重新加载统计数据
    };

    // 处理保存展商
    const handleSaveExhibitor = async (values) => {
        try {
            if (editingExhibitor) {
                // 编辑模式
                setExhibitors(prev => prev.map(item => 
                    item.id === editingExhibitor.id 
                        ? { ...item, ...values, lastUpdateTime: new Date().toLocaleString() }
                        : item
                ));
                message.success('更新成功');
            } else {
                // 新增模式
                const newExhibitor = {
                    ...values,
                    id: `EX${String(Date.now()).slice(-3)}`,
                    status: 'active',
                    approvalStatus: 'pending',
                    createTime: new Date().toLocaleString(),
                    lastUpdateTime: new Date().toLocaleString(),
                    productCount: 0,
                    onlineProductCount: 0
                };
                setExhibitors(prev => [newExhibitor, ...prev]);
                message.success('新增成功');
            }
            setExhibitorModalVisible(false);
            loadStatistics(); // 重新加载统计数据
        } catch (error) {
            message.error('保存失败');
        }
    };

    // 处理审核变更
    const handleReviewChange = (change) => {
        setReviewingChange(change);
        reviewForm.resetFields();
        setReviewModalVisible(true);
    };

    // 处理查看变更详情
    const handleViewChanges = (change) => {
        const { changes } = change;
        Modal.info({
            title: '变更详情对比',
            width: 800,
            content: React.createElement('div', null, [
                React.createElement('h4', { key: 'title' }, '变更对比'),
                React.createElement(Table, {
                    key: 'table',
                    columns: [
                        { title: '字段', dataIndex: 'field', key: 'field' },
                        { title: '修改前', dataIndex: 'before', key: 'before' },
                        { title: '修改后', dataIndex: 'after', key: 'after' }
                    ],
                    dataSource: Object.keys(changes.before).map(key => ({
                        key,
                        field: key === 'description' ? '公司描述' : 
                               key === 'website' ? '公司网址' : 
                               key === 'email' ? '邮箱' : key,
                        before: changes.before[key],
                        after: changes.after[key]
                    })),
                    pagination: false,
                    size: 'small'
                })
            ])
        });
    };

    // 处理快速通过
    const handleQuickApprove = (change) => {
        Modal.confirm({
            title: '确认通过',
            content: '确定要通过这个变更申请吗？',
            onOk: () => {
                // 更新变更状态
                setPendingChanges(prev => prev.map(item => 
                    item.id === change.id 
                        ? { ...item, status: 'approved', reviewer: '当前用户', reviewTime: new Date().toLocaleString() }
                        : item
                ));
                
                // 如果是展商信息变更，更新展商数据
                if (change.type === 'exhibitor_info') {
                    setExhibitors(prev => prev.map(item => 
                        item.id === change.exhibitorId 
                            ? { ...item, ...change.changes.after, approvalStatus: 'approved', lastUpdateTime: new Date().toLocaleString() }
                            : item
                    ));
                }
                
                message.success('审核通过');
                loadStatistics();
            }
        });
    };

    // 处理快速拒绝
    const handleQuickReject = (change) => {
        Modal.confirm({
            title: '确认拒绝',
            content: '确定要拒绝这个变更申请吗？',
            onOk: () => {
                setPendingChanges(prev => prev.map(item => 
                    item.id === change.id 
                        ? { ...item, status: 'rejected', reviewer: '当前用户', reviewTime: new Date().toLocaleString() }
                        : item
                ));
                message.success('已拒绝');
                loadStatistics();
            }
        });
    };

    // 处理提交审核
    const handleSubmitReview = async (values) => {
        try {
            const { decision, comment } = values;
            
            // 更新变更状态
            setPendingChanges(prev => prev.map(item => 
                item.id === reviewingChange.id 
                    ? { 
                        ...item, 
                        status: decision, 
                        reviewer: '当前用户', 
                        reviewTime: new Date().toLocaleString(),
                        reviewComment: comment
                    }
                    : item
            ));
            
            // 如果通过且是展商信息变更，更新展商数据
            if (decision === 'approved' && reviewingChange.type === 'exhibitor_info') {
                setExhibitors(prev => prev.map(item => 
                    item.id === reviewingChange.exhibitorId 
                        ? { ...item, ...reviewingChange.changes.after, approvalStatus: 'approved', lastUpdateTime: new Date().toLocaleString() }
                        : item
                ));
            }
            
            setReviewModalVisible(false);
            message.success(`审核${decision === 'approved' ? '通过' : '拒绝'}成功`);
            loadStatistics();
        } catch (error) {
            message.error('审核失败');
        }
    };

    // 过滤展商数据
    const filteredExhibitors = React.useMemo(() => {
        return exhibitors.filter(item => {
            const matchSearch = !searchText || 
                item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.id.toLowerCase().includes(searchText.toLowerCase()) ||
                item.contactPerson.toLowerCase().includes(searchText.toLowerCase());
            
            const matchStatus = statusFilter === 'all' || item.approvalStatus === statusFilter;
            
            return matchSearch && matchStatus;
        });
    }, [exhibitors, searchText, statusFilter]);

    // 待审核数据
    const pendingChangesData = React.useMemo(() => {
        return pendingChanges.filter(item => item.status === 'pending');
    }, [pendingChanges]);

    return React.createElement('div', {
        style: { padding: '24px' }
    }, [
        // 统计卡片
        React.createElement(Row, {
            key: 'stats',
            gutter: [16, 16],
            style: { marginBottom: '24px' }
        }, [
            React.createElement(Col, {
                key: 'total',
                span: 6
            }, React.createElement(Card, null, React.createElement(Statistic, {
                title: '总展商数',
                value: statistics.totalExhibitors,
                prefix: '🏢'
            }))),
            React.createElement(Col, {
                key: 'pending',
                span: 6
            }, React.createElement(Card, null, React.createElement(Statistic, {
                title: '待审核',
                value: statistics.pendingReviews,
                prefix: '⏳',
                valueStyle: { color: '#fa8c16' }
            }))),
            React.createElement(Col, {
                key: 'approved',
                span: 6
            }, React.createElement(Card, null, React.createElement(Statistic, {
                title: '今日通过',
                value: statistics.approvedToday,
                prefix: '✅',
                valueStyle: { color: '#52c41a' }
            }))),
            React.createElement(Col, {
                key: 'rejected',
                span: 6
            }, React.createElement(Card, null, React.createElement(Statistic, {
                title: '今日拒绝',
                value: statistics.rejectedToday,
                prefix: '❌',
                valueStyle: { color: '#ff4d4f' }
            })))
        ]),
        
        // 主要内容区域
        React.createElement(Card, {
            key: 'main'
        }, React.createElement(Tabs, {
            activeKey: activeTab,
            onChange: setActiveTab,
            items: [
                {
                    key: 'exhibitors',
                    label: '展商管理',
                    children: React.createElement('div', null, [
                        // 搜索和操作栏
                        React.createElement(Row, {
                            key: 'toolbar',
                            gutter: [16, 16],
                            style: { marginBottom: '16px' }
                        }, [
                            React.createElement(Col, {
                                key: 'search',
                                span: 18
                            }, React.createElement(Space, null, [
                                React.createElement(Input.Search, {
                                    key: 'search-input',
                                    placeholder: '搜索展商名称、ID、联系人',
                                    onSearch: setSearchText,
                                    style: { width: 300 }
                                }),
                                React.createElement(Select, {
                                    key: 'status-filter',
                                    value: statusFilter,
                                    onChange: setStatusFilter,
                                    style: { width: 150 }
                                }, [
                                    React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                                    React.createElement(Option, { key: 'approved', value: 'approved' }, '已审核'),
                                    React.createElement(Option, { key: 'pending', value: 'pending' }, '待审核'),
                                    React.createElement(Option, { key: 'rejected', value: 'rejected' }, '已拒绝')
                                ])
                            ])),
                            React.createElement(Col, {
                                key: 'actions',
                                span: 6,
                                style: { textAlign: 'right' }
                            }, React.createElement(Button, {
                                type: 'primary',
                                onClick: handleAddExhibitor
                            }, '新增展商'))
                        ]),
                        
                        // 展商列表
                        React.createElement(Table, {
                            key: 'table',
                            columns: exhibitorColumns,
                            dataSource: filteredExhibitors,
                            rowKey: 'id',
                            loading: loading,
                            pagination: {
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total) => `共 ${total} 条记录`
                            }
                        })
                    ])
                },
                {
                    key: 'reviews',
                    label: React.createElement(Badge, {
                        count: pendingChangesData.length,
                        size: 'small'
                    }, '审核变更'),
                    children: React.createElement('div', null, [
                        React.createElement(Alert, {
                            key: 'alert',
                            message: '审核说明',
                            description: '展商在展商中心提交的信息变更和产品上架申请需要在此处审核。审核通过后，变更将立即生效。',
                            type: 'info',
                            showIcon: true,
                            style: { marginBottom: '16px' }
                        }),
                        
                        React.createElement(Table, {
                            key: 'changes-table',
                            columns: changesColumns,
                            dataSource: pendingChangesData,
                            rowKey: 'id',
                            pagination: {
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total) => `共 ${total} 条待审核记录`
                            }
                        })
                    ])
                }
            ]
        })),
        
        // 展商编辑弹窗
        React.createElement(Modal, {
            key: 'exhibitor-modal',
            title: editingExhibitor ? '编辑展商' : '新增展商',
            open: exhibitorModalVisible,
            onCancel: () => setExhibitorModalVisible(false),
            footer: null,
            width: 800
        }, React.createElement(Form, {
            form: exhibitorForm,
            layout: 'vertical',
            onFinish: handleSaveExhibitor
        }, [
            React.createElement(Row, {
                key: 'row1',
                gutter: [16, 16]
            }, [
                React.createElement(Col, {
                    key: 'name',
                    span: 12
                }, React.createElement(Form.Item, {
                    label: '公司名称',
                    name: 'name',
                    rules: [{ required: true, message: '请输入公司名称' }]
                }, React.createElement(Input, {
                    placeholder: '请输入公司名称'
                }))),
                React.createElement(Col, {
                    key: 'contact',
                    span: 12
                }, React.createElement(Form.Item, {
                    label: '联系人',
                    name: 'contactPerson',
                    rules: [{ required: true, message: '请输入联系人' }]
                }, React.createElement(Input, {
                    placeholder: '请输入联系人姓名'
                })))
            ]),
            React.createElement(Row, {
                key: 'row2',
                gutter: [16, 16]
            }, [
                React.createElement(Col, {
                    key: 'phone',
                    span: 12
                }, React.createElement(Form.Item, {
                    label: '联系电话',
                    name: 'phone',
                    rules: [
                        { required: true, message: '请输入联系电话' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                    ]
                }, React.createElement(Input, {
                    placeholder: '请输入11位手机号'
                }))),
                React.createElement(Col, {
                    key: 'email',
                    span: 12
                }, React.createElement(Form.Item, {
                    label: '邮箱',
                    name: 'email',
                    rules: [
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入正确的邮箱地址' }
                    ]
                }, React.createElement(Input, {
                    placeholder: '请输入邮箱地址'
                })))
            ]),
            React.createElement(Form.Item, {
                key: 'website',
                label: '公司网址',
                name: 'website'
            }, React.createElement(Input, {
                placeholder: '请输入公司网址'
            })),
            React.createElement(Form.Item, {
                key: 'description',
                label: '公司描述',
                name: 'description',
                rules: [{ required: true, message: '请输入公司描述' }]
            }, React.createElement(TextArea, {
                placeholder: '请输入公司描述',
                rows: 4
            })),
            React.createElement('div', {
                key: 'actions',
                style: { textAlign: 'right' }
            }, React.createElement(Space, null, [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => setExhibitorModalVisible(false)
                }, '取消'),
                React.createElement(Button, {
                    key: 'submit',
                    type: 'primary',
                    htmlType: 'submit'
                }, '保存')
            ]))
        ])),
        
        // 审核弹窗
        React.createElement(Modal, {
            key: 'review-modal',
            title: '审核变更申请',
            open: reviewModalVisible,
            onCancel: () => setReviewModalVisible(false),
            footer: null,
            width: 600
        }, reviewingChange && React.createElement('div', null, [
            React.createElement(Descriptions, {
                key: 'info',
                column: 1,
                bordered: true,
                style: { marginBottom: '16px' },
                items: [
                    { label: '展商名称', children: reviewingChange.exhibitorName },
                    { label: '变更类型', children: reviewingChange.type === 'exhibitor_info' ? '展商信息变更' : '产品上架申请' },
                    { label: '提交时间', children: reviewingChange.submitTime },
                    { label: '优先级', children: React.createElement(Tag, {
                        color: reviewingChange.priority === 'high' ? 'red' : 'blue'
                    }, reviewingChange.priority === 'high' ? '高优先级' : '普通优先级') }
                ]
            }),
            
            reviewingChange.type === 'exhibitor_info' && React.createElement('div', {
                key: 'changes',
                style: { marginBottom: '16px' }
            }, [
                React.createElement('h4', { key: 'title' }, '变更内容'),
                React.createElement(Table, {
                    key: 'table',
                    columns: [
                        { title: '字段', dataIndex: 'field', key: 'field' },
                        { title: '修改前', dataIndex: 'before', key: 'before' },
                        { title: '修改后', dataIndex: 'after', key: 'after' }
                    ],
                    dataSource: Object.keys(reviewingChange.changes.before).map(key => ({
                        key,
                        field: key === 'description' ? '公司描述' : 
                               key === 'website' ? '公司网址' : 
                               key === 'email' ? '邮箱' : key,
                        before: reviewingChange.changes.before[key],
                        after: reviewingChange.changes.after[key]
                    })),
                    pagination: false,
                    size: 'small'
                })
            ]),
            
            reviewingChange.type === 'product_online' && React.createElement('div', {
                key: 'product',
                style: { marginBottom: '16px' }
            }, [
                React.createElement('h4', { key: 'title' }, '产品信息'),
                React.createElement(Descriptions, {
                    key: 'desc',
                    column: 1,
                    bordered: true,
                    items: [
                        { label: '产品名称', children: reviewingChange.productInfo.name },
                        { label: '产品描述', children: reviewingChange.productInfo.description },
                        { label: '产品分类', children: reviewingChange.productInfo.category },
                        { label: '产品规格', children: reviewingChange.productInfo.specifications }
                    ]
                })
            ]),
            
            React.createElement(Form, {
                key: 'form',
                form: reviewForm,
                layout: 'vertical',
                onFinish: handleSubmitReview
            }, [
                React.createElement(Form.Item, {
                    key: 'decision',
                    label: '审核决定',
                    name: 'decision',
                    rules: [{ required: true, message: '请选择审核决定' }]
                }, React.createElement(Radio.Group, null, [
                    React.createElement(Radio, { key: 'approve', value: 'approved' }, '✅ 通过'),
                    React.createElement(Radio, { key: 'reject', value: 'rejected' }, '❌ 拒绝')
                ])),
                React.createElement(Form.Item, {
                    key: 'comment',
                    label: '审核备注',
                    name: 'comment',
                    rules: [{ required: true, message: '请输入审核备注' }]
                }, React.createElement(TextArea, {
                    placeholder: '请输入审核备注',
                    rows: 3
                })),
                React.createElement('div', {
                    key: 'actions',
                    style: { textAlign: 'right' }
                }, React.createElement(Space, null, [
                    React.createElement(Button, {
                        key: 'cancel',
                        onClick: () => setReviewModalVisible(false)
                    }, '取消'),
                    React.createElement(Button, {
                        key: 'submit',
                        type: 'primary',
                        htmlType: 'submit'
                    }, '提交审核')
                ]))
            ])
        ]))
    ]);
};

// 将组件挂载到正确的命名空间
window.App.pages.ExhibitorManagement = ExhibitorManagement;
console.log('[ExhibitorManagement] 组件挂载成功 - 完整版本');