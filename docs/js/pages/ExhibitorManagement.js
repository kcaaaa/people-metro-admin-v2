// 参展公司管理页面 - 展会参展公司信息管理
const ExhibitorManagement = () => {
    console.log('ExhibitorManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Upload, Image, Divider, Statistic, Progress, InputNumber, Radio, Switch, DatePicker } = antd;
    const { TextArea } = Input;
    const { Option } = Select;
    const { RangePicker: DateRangePicker } = DatePicker;
    
    // 状态管理
    const [companyModalVisible, setCompanyModalVisible] = React.useState(false);
    const [editingCompany, setEditingCompany] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [companyForm] = Form.useForm();
    
    // 搜索和筛选状态
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [categoryFilter, setCategoryFilter] = React.useState('all');
    const [floorFilter, setFloorFilter] = React.useState('all');
    const [timeRange, setTimeRange] = React.useState(null);

    // 模拟参展公司数据
    const [companies, setCompanies] = React.useState([
        {
            id: 'company_001',
            name: '中车集团',
            logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100',
            description: '中国中车股份有限公司',
            floorId: 'floor_f1',
            areaId: 'area_a',
            boothNumber: 'A区-01',
            boothSize: '3x3',
            appAccount: 'crrc_official',
            contactPerson: '张经理',
            contactPhone: '13800138001',
            contactEmail: 'zhang@crrc.com',
            website: 'https://www.crrcgc.cc',
            category: '车辆制造',
            status: 'confirmed',
            created: '2024-01-12 14:30:00'
        },
        {
            id: 'company_002',
            name: '比亚迪轨道交通',
            logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
            description: '比亚迪轨道交通有限公司',
            floorId: 'floor_f1',
            areaId: 'area_a',
            boothNumber: 'A区-02',
            boothSize: '3x3',
            appAccount: 'byd_rail',
            contactPerson: '李总监',
            contactPhone: '13800138002',
            contactEmail: 'li@byd.com',
            website: 'https://rail.byd.com',
            category: '智能交通',
            status: 'confirmed',
            created: '2024-01-13 09:15:00'
        },
        {
            id: 'company_003',
            name: '华为技术',
            logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100',
            description: '华为技术有限公司',
            floorId: 'floor_f2',
            areaId: 'area_d',
            boothNumber: 'D区-03',
            boothSize: '6x3',
            appAccount: 'huawei_rail',
            contactPerson: '王工程师',
            contactPhone: '13800138003',
            contactEmail: 'wang@huawei.com',
            website: 'https://www.huawei.com',
            category: '通信技术',
            status: 'pending',
            created: '2024-01-14 16:45:00'
        },
        {
            id: 'company_004',
            name: '腾讯科技',
            logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100',
            description: '腾讯科技(深圳)有限公司',
            floorId: 'floor_f2',
            areaId: 'area_e',
            boothNumber: 'E区-05',
            boothSize: '4x3',
            appAccount: 'tencent_smart',
            contactPerson: '刘产品经理',
            contactPhone: '13800138004',
            contactEmail: 'liu@tencent.com',
            website: 'https://www.tencent.com',
            category: '数字化解决方案',
            status: 'confirmed',
            created: '2024-01-15 10:20:00'
        },
        {
            id: 'company_005',
            name: '西门子交通',
            logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100',
            description: '西门子交通技术有限公司',
            floorId: 'floor_f3',
            areaId: 'area_g',
            boothNumber: 'G区-01',
            boothSize: '5x4',
            appAccount: 'siemens_mobility',
            contactPerson: 'Mueller先生',
            contactPhone: '13800138005',
            contactEmail: 'mueller@siemens.com',
            website: 'https://www.siemens.com/mobility',
            category: '信号系统',
            status: 'confirmed',
            created: '2024-01-16 14:00:00'
        }
    ]);

    // 统计数据
    const statistics = React.useMemo(() => {
        const total = companies.length;
        const confirmed = companies.filter(c => c.status === 'confirmed').length;
        const pending = companies.filter(c => c.status === 'pending').length;
        const rejected = companies.filter(c => c.status === 'rejected').length;
        
        return { total, confirmed, pending, rejected };
    }, [companies]);

    React.useEffect(() => {
        loadCompanyData();
    }, []);

    // 模拟加载数据
    const loadCompanyData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            message.success('参展公司数据加载成功');
        } catch (error) {
            message.error('数据加载失败');
        } finally {
            setLoading(false);
        }
    };

    // 数据筛选
    const filteredCompanies = React.useMemo(() => {
        return companies.filter(company => {
            // 文本搜索
            if (searchText && 
                !company.name?.toLowerCase().includes(searchText.toLowerCase()) && 
                !company.description?.toLowerCase().includes(searchText.toLowerCase()) &&
                !company.contactPerson?.toLowerCase().includes(searchText.toLowerCase()) &&
                !company.boothNumber?.toLowerCase().includes(searchText.toLowerCase())) {
                return false;
            }
            
            // 状态筛选
            if (statusFilter !== 'all' && company.status !== statusFilter) {
                return false;
            }
            
            // 分类筛选
            if (categoryFilter !== 'all' && company.category !== categoryFilter) {
                return false;
            }
            
            return true;
        });
    }, [companies, searchText, statusFilter, categoryFilter]);

    // 重置筛选条件
    const resetFilters = () => {
        setSearchText('');
        setStatusFilter('all');
        setCategoryFilter('all');
        setFloorFilter('all');
        setTimeRange(null);
    };

    // 导出数据
    const handleExport = () => {
        message.loading('正在导出参展公司数据...', 2);
        setTimeout(() => {
            message.success(`已导出 ${filteredCompanies.length} 条参展公司数据`);
        }, 2000);
    };

    // 创建新公司
    const createNewCompany = () => {
        setEditingCompany(null);
        companyForm.resetFields();
        setCompanyModalVisible(true);
    };

    // 编辑公司
    const editCompany = (company) => {
        setEditingCompany(company);
        companyForm.setFieldsValue(company);
        setCompanyModalVisible(true);
    };

    // 删除公司
    const deleteCompany = (company) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除参展公司"${company.name}"吗？此操作不可恢复。`,
            okText: '确认删除',
            cancelText: '取消',
            okType: 'danger',
            onOk() {
                setCompanies(prev => prev.filter(c => c.id !== company.id));
                message.success('参展公司删除成功');
            }
        });
    };

    // 审核公司
    const reviewCompany = (company, status) => {
        const statusText = {
            'confirmed': '通过',
            'rejected': '拒绝'
        };
        
        Modal.confirm({
            title: '确认审核',
            content: `确定要${statusText[status]}参展公司"${company.name}"的申请吗？`,
            okText: `确认${statusText[status]}`,
            cancelText: '取消',
            onOk() {
                setCompanies(prev => 
                    prev.map(c => 
                        c.id === company.id ? { ...c, status } : c
                    )
                );
                message.success(`参展公司审核${statusText[status]}成功`);
            }
        });
    };

    // 保存公司信息
    const handleCompanySave = async (values) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (editingCompany) {
                // 编辑现有公司
                setCompanies(prev => 
                    prev.map(company => 
                        company.id === editingCompany.id 
                            ? { ...company, ...values }
                            : company
                    )
                );
                message.success('参展公司信息更新成功');
            } else {
                // 创建新公司
                const newCompany = {
                    id: `company_${Date.now()}`,
                    ...values,
                    status: 'pending',
                    created: new Date().toLocaleString()
                };
                setCompanies(prev => [newCompany, ...prev]);
                message.success('新参展公司创建成功');
            }
            
            setCompanyModalVisible(false);
            companyForm.resetFields();
            setEditingCompany(null);
        } catch (error) {
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 状态渲染
    const renderStatus = (status) => {
        const statusConfig = {
            'confirmed': { color: 'green', text: '已确认' },
            'pending': { color: 'orange', text: '待审核' },
            'rejected': { color: 'red', text: '已拒绝' }
        };
        const config = statusConfig[status] || statusConfig['pending'];
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    // 表格列定义
    const columns = [
        {
            title: '公司信息',
            key: 'company',
            width: 300,
            render: (_, record) => React.createElement('div', {
                style: { display: 'flex', alignItems: 'center' }
            }, [
                React.createElement(Image, {
                    key: 'logo',
                    src: record.logo,
                    alt: record.name,
                    width: 50,
                    height: 50,
                    style: { borderRadius: '4px', marginRight: '12px' }
                }),
                React.createElement('div', { key: 'info' }, [
                    React.createElement('div', {
                        key: 'name',
                        style: { fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }
                    }, record.name),
                    React.createElement('div', {
                        key: 'description',
                        style: { color: '#666', fontSize: '12px', marginBottom: '4px' }
                    }, record.description),
                    React.createElement('div', {
                        key: 'category',
                        style: { color: '#999', fontSize: '12px' }
                    }, record.category)
                ])
            ])
        },
        {
            title: '展位信息',
            key: 'booth',
            width: 150,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'number',
                    style: { fontWeight: 'bold', marginBottom: '4px' }
                }, record.boothNumber),
                React.createElement('div', {
                    key: 'size',
                    style: { color: '#666', fontSize: '12px' }
                }, `规格: ${record.boothSize}`)
            ])
        },
        {
            title: '联系信息',
            key: 'contact',
            width: 200,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'person',
                    style: { marginBottom: '4px' }
                }, record.contactPerson),
                React.createElement('div', {
                    key: 'phone',
                    style: { color: '#666', fontSize: '12px', marginBottom: '2px' }
                }, record.contactPhone),
                React.createElement('div', {
                    key: 'email',
                    style: { color: '#666', fontSize: '12px' }
                }, record.contactEmail)
            ])
        },
        {
            title: 'APP账号',
            dataIndex: 'appAccount',
            key: 'appAccount',
            width: 120,
            render: (account) => React.createElement(Tag, { 
                color: 'blue' 
            }, account)
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: renderStatus
        },
        {
            title: '创建时间',
            dataIndex: 'created',
            key: 'created',
            width: 150
        },
        {
            title: '操作',
            key: 'actions',
            width: 250,
            render: (_, record) => React.createElement(Space, { 
                size: 'small',
                direction: 'vertical'
            }, [
                React.createElement(Space, { key: 'row1', size: 'small' }, [
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        onClick: () => editCompany(record)
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'view',
                        size: 'small',
                        type: 'primary',
                        onClick: () => message.info('查看详情功能开发中')
                    }, '详情')
                ]),
                React.createElement(Space, { key: 'row2', size: 'small' }, [
                    record.status === 'pending' && React.createElement(Button, {
                        key: 'approve',
                        size: 'small',
                        type: 'primary',
                        onClick: () => reviewCompany(record, 'confirmed')
                    }, '通过'),
                    record.status === 'pending' && React.createElement(Button, {
                        key: 'reject',
                        size: 'small',
                        danger: true,
                        onClick: () => reviewCompany(record, 'rejected')
                    }, '拒绝'),
                    React.createElement(Button, {
                        key: 'delete',
                        size: 'small',
                        danger: true,
                        onClick: () => deleteCompany(record)
                    }, '删除')
                ])
            ])
        }
    ];

    return React.createElement('div', {
        style: { padding: '0' }
    }, [
        // 页面标题
        React.createElement('div', {
            key: 'header',
            style: { marginBottom: '24px' }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { 
                    fontSize: '24px', 
                    fontWeight: '600', 
                    margin: '0 0 8px 0',
                    color: '#333'
                }
            }, '参展公司管理'),
            React.createElement('div', {
                key: 'description',
                style: { 
                    color: '#666', 
                    fontSize: '14px'
                }
            }, '管理展会参展公司信息，包括公司资料、展位分配、审核状态等')
        ]),

        // 统计卡片
        React.createElement(Row, {
            key: 'stats',
            gutter: 16,
            style: { marginBottom: '24px' }
        }, [
            React.createElement(Col, { key: 'total', span: 6 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '参展公司总数',
                    value: statistics.total,
                    valueStyle: { color: '#1890ff' },
                    suffix: '家'
                }))
            ),
            React.createElement(Col, { key: 'confirmed', span: 6 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '已确认',
                    value: statistics.confirmed,
                    valueStyle: { color: '#52c41a' },
                    suffix: '家'
                }))
            ),
            React.createElement(Col, { key: 'pending', span: 6 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '待审核',
                    value: statistics.pending,
                    valueStyle: { color: '#faad14' },
                    suffix: '家'
                }))
            ),
            React.createElement(Col, { key: 'occupancy', span: 6 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '展位占用率',
                    value: ((statistics.confirmed / 150) * 100).toFixed(1),
                    valueStyle: { color: '#722ed1' },
                    suffix: '%'
                }))
            )
        ]),

        // 搜索和筛选
        React.createElement(Card, {
            key: 'filters',
            style: { marginBottom: '16px' }
        }, React.createElement(Row, {
            gutter: 16,
            align: 'middle'
        }, [
            React.createElement(Col, { key: 'search', span: 6 },
                React.createElement(Input, {
                    placeholder: '搜索公司名称、联系人或展位号',
                    value: searchText,
                    onChange: (e) => setSearchText(e.target.value),
                    style: { width: '100%' },
                    prefix: React.createElement('span', {}, '🔍')
                })
            ),
            React.createElement(Col, { key: 'status', span: 4 },
                React.createElement(Select, {
                    value: statusFilter,
                    onChange: setStatusFilter,
                    style: { width: '100%' },
                    placeholder: '筛选状态'
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                    React.createElement(Option, { key: 'confirmed', value: 'confirmed' }, '已确认'),
                    React.createElement(Option, { key: 'pending', value: 'pending' }, '待审核'),
                    React.createElement(Option, { key: 'rejected', value: 'rejected' }, '已拒绝')
                ])
            ),
            React.createElement(Col, { key: 'category', span: 4 },
                React.createElement(Select, {
                    value: categoryFilter,
                    onChange: setCategoryFilter,
                    style: { width: '100%' },
                    placeholder: '筛选分类'
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部分类'),
                    React.createElement(Option, { key: '车辆制造', value: '车辆制造' }, '车辆制造'),
                    React.createElement(Option, { key: '智能交通', value: '智能交通' }, '智能交通'),
                    React.createElement(Option, { key: '通信技术', value: '通信技术' }, '通信技术'),
                    React.createElement(Option, { key: '数字化解决方案', value: '数字化解决方案' }, '数字化解决方案'),
                    React.createElement(Option, { key: '信号系统', value: '信号系统' }, '信号系统')
                ])
            ),
            React.createElement(Col, { key: 'actions', span: 10 },
                React.createElement(Space, { size: 'small' }, [
                    React.createElement(Button, {
                        key: 'reset',
                        onClick: resetFilters
                    }, '重置筛选'),
                    React.createElement(Button, {
                        key: 'export',
                        onClick: handleExport
                    }, '导出数据'),
                    React.createElement(Button, {
                        key: 'refresh',
                        onClick: loadCompanyData,
                        loading: loading
                    }, '刷新数据'),
                    React.createElement(Button, {
                        key: 'create',
                        type: 'primary',
                        onClick: createNewCompany
                    }, '新增公司')
                ])
            )
        ])),

        // 数据表格
        React.createElement(Card, {
            key: 'table',
            title: `参展公司列表 (${filteredCompanies.length}家)`
        }, React.createElement(Table, {
            columns: columns,
            dataSource: filteredCompanies.map((item, index) => ({ ...item, key: index })),
            loading: loading,
            pagination: {
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            },
            scroll: { x: 1400 }
        })),

        // 公司信息编辑模态框
        React.createElement(Modal, {
            key: 'companyModal',
            title: editingCompany ? '编辑参展公司' : '新增参展公司',
            visible: companyModalVisible,
            onCancel: () => {
                setCompanyModalVisible(false);
                companyForm.resetFields();
                setEditingCompany(null);
            },
            footer: [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setCompanyModalVisible(false);
                        companyForm.resetFields();
                        setEditingCompany(null);
                    }
                }, '取消'),
                React.createElement(Button, {
                    key: 'submit',
                    type: 'primary',
                    loading: loading,
                    onClick: () => companyForm.submit()
                }, '保存')
            ],
            width: 800
        }, React.createElement(Form, {
            form: companyForm,
            layout: 'vertical',
            onFinish: handleCompanySave
        }, [
            React.createElement(Row, { key: 'row1', gutter: 16 }, [
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: '公司名称',
                        name: 'name',
                        rules: [{ required: true, message: '请输入公司名称' }]
                    }, React.createElement(Input, { placeholder: '请输入公司名称' }))
                ),
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: '公司分类',
                        name: 'category',
                        rules: [{ required: true, message: '请选择公司分类' }]
                    }, React.createElement(Select, { placeholder: '请选择公司分类' }, [
                        React.createElement(Option, { key: '车辆制造', value: '车辆制造' }, '车辆制造'),
                        React.createElement(Option, { key: '智能交通', value: '智能交通' }, '智能交通'),
                        React.createElement(Option, { key: '通信技术', value: '通信技术' }, '通信技术'),
                        React.createElement(Option, { key: '数字化解决方案', value: '数字化解决方案' }, '数字化解决方案'),
                        React.createElement(Option, { key: '信号系统', value: '信号系统' }, '信号系统')
                    ]))
                )
            ]),
            
            React.createElement(Form.Item, {
                key: 'description',
                label: '公司描述',
                name: 'description',
                rules: [{ required: true, message: '请输入公司描述' }]
            }, React.createElement(TextArea, { 
                rows: 3, 
                placeholder: '请输入公司描述' 
            })),

            React.createElement(Row, { key: 'row2', gutter: 16 }, [
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: '展位号',
                        name: 'boothNumber',
                        rules: [{ required: true, message: '请输入展位号' }]
                    }, React.createElement(Input, { placeholder: '如：A区-01' }))
                ),
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: '展位规格',
                        name: 'boothSize',
                        rules: [{ required: true, message: '请输入展位规格' }]
                    }, React.createElement(Input, { placeholder: '如：3x3' }))
                )
            ]),

            React.createElement(Row, { key: 'row3', gutter: 16 }, [
                React.createElement(Col, { span: 8 },
                    React.createElement(Form.Item, {
                        label: '联系人',
                        name: 'contactPerson',
                        rules: [{ required: true, message: '请输入联系人' }]
                    }, React.createElement(Input, { placeholder: '请输入联系人姓名' }))
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Form.Item, {
                        label: '联系电话',
                        name: 'contactPhone',
                        rules: [{ required: true, message: '请输入联系电话' }]
                    }, React.createElement(Input, { placeholder: '请输入联系电话' }))
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Form.Item, {
                        label: '联系邮箱',
                        name: 'contactEmail',
                        rules: [
                            { required: true, message: '请输入联系邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                        ]
                    }, React.createElement(Input, { placeholder: '请输入联系邮箱' }))
                )
            ]),

            React.createElement(Row, { key: 'row4', gutter: 16 }, [
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: 'APP账号',
                        name: 'appAccount',
                        rules: [{ required: true, message: '请输入APP账号' }]
                    }, React.createElement(Input, { placeholder: '请输入APP账号' }))
                ),
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: '公司网站',
                        name: 'website'
                    }, React.createElement(Input, { placeholder: '请输入公司网站URL' }))
                )
            ]),

            React.createElement(Form.Item, {
                key: 'logo',
                label: '公司LOGO',
                name: 'logo'
            }, React.createElement(Input, { 
                placeholder: '请输入LOGO图片URL或使用上传功能' 
            }))
        ]))
    ]);
};

window.ExhibitorManagement = ExhibitorManagement; 