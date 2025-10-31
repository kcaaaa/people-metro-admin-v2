// 文创 来源公司管理
const CulturalCompanyManagement = () => {
    const { Card, Table, Button, Input, Space, Tag, Modal, Form, message, Select, Row, Col, Switch } = antd;
    const { TextArea } = Input;
    const { Option } = Select;

    // 状态管理
    const [loading, setLoading] = React.useState(false);
    const [companies, setCompanies] = React.useState(() => {
        const saved = localStorage.getItem('cultural_companies');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return getInitialCompanies();
            }
        }
        return getInitialCompanies();
    });
    const [modalVisible, setModalVisible] = React.useState(false);
    const [editingCompany, setEditingCompany] = React.useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = React.useState('');

    // 初始化演示数据
    function getInitialCompanies() {
        const initial = [
            {
                id: 1,
                name: '轨道交通文创有限公司',
                code: 'RT-CULT-001',
                contactName: '张经理',
                phone: '010-88888888',
                mobile: '13800138000',
                email: 'contact@rt-culture.com',
                address: '北京市海淀区轨道交通大厦8楼',
                website: 'www.rt-culture.com',
                description: '专业从事轨道交通文化创意产品研发与销售',
                status: 'active',
                productCount: 12,
                createTime: '2024-01-15 10:30:00',
                updateTime: '2024-10-28 14:20:00'
            },
            {
                id: 2,
                name: '城轨文化传媒公司',
                code: 'RT-CULT-002',
                contactName: '李总',
                phone: '021-66666666',
                mobile: '13900139000',
                email: 'info@metro-culture.com',
                address: '上海市浦东新区城轨文化产业园A座',
                website: 'www.metro-culture.com',
                description: '致力于城轨文化传播与衍生品开发',
                status: 'active',
                productCount: 8,
                createTime: '2024-02-20 09:15:00',
                updateTime: '2024-10-25 16:45:00'
            },
            {
                id: 3,
                name: '地铁文创工作室',
                code: 'RT-CULT-003',
                contactName: '王老师',
                phone: '0755-77777777',
                mobile: '13700137000',
                email: 'studio@metro-art.com',
                address: '深圳市南山区科技园地铁文创中心',
                website: 'www.metro-art.com',
                description: '专注于地铁主题文创产品设计与制作',
                status: 'active',
                productCount: 15,
                createTime: '2024-03-10 11:00:00',
                updateTime: '2024-10-30 10:30:00'
            }
        ];
        localStorage.setItem('cultural_companies', JSON.stringify(initial));
        return initial;
    }

    // 加载数据
    const loadCompanies = () => {
        setLoading(true);
        setTimeout(() => {
            const saved = localStorage.getItem('cultural_companies');
            if (saved) {
                try {
                    setCompanies(JSON.parse(saved));
                } catch (e) {
                    console.error('加载公司数据失败:', e);
                }
            }
            setLoading(false);
        }, 300);
    };

    React.useEffect(() => {
        loadCompanies();
    }, []);

    // 保存数据
    const saveCompanies = (data) => {
        localStorage.setItem('cultural_companies', JSON.stringify(data));
        setCompanies(data);
    };

    // 保存公司
    const handleSave = (values) => {
        if (editingCompany) {
            // 更新
            const updated = companies.map(c => 
                c.id === editingCompany.id 
                    ? { ...c, ...values, updateTime: new Date().toLocaleString('zh-CN') }
                    : c
            );
            saveCompanies(updated);
            message.success('公司信息已更新');
        } else {
            // 新增
            const newCompany = {
                id: Date.now(),
                ...values,
                productCount: 0,
                createTime: new Date().toLocaleString('zh-CN'),
                updateTime: new Date().toLocaleString('zh-CN')
            };
            saveCompanies([newCompany, ...companies]);
            message.success('公司已添加');
        }
        setModalVisible(false);
        setEditingCompany(null);
        form.resetFields();
    };

    // 删除公司
    const handleDelete = (company) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除公司"${company.name}"吗？删除后，关联的产品需要重新选择来源公司。`,
            onOk: () => {
                saveCompanies(companies.filter(c => c.id !== company.id));
                message.success('公司已删除');
            }
        });
    };

    // 编辑公司
    const handleEdit = (company) => {
        setEditingCompany(company);
        form.setFieldsValue(company);
        setModalVisible(true);
    };

    // 新增公司
    const handleAdd = () => {
        setEditingCompany(null);
        form.resetFields();
        setModalVisible(true);
    };

    // 过滤数据
    const filteredCompanies = companies.filter(c => 
        !searchText || 
        c.name.includes(searchText) || 
        c.code.includes(searchText) ||
        (c.contactName && c.contactName.includes(searchText))
    );

    // 表格列定义
    const columns = [
        {
            title: '公司代码',
            dataIndex: 'code',
            key: 'code',
            width: 140,
            render: (text) => React.createElement(Tag, { color: 'blue' }, text)
        },
        {
            title: '公司名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            ellipsis: true
        },
        {
            title: '联系人',
            dataIndex: 'contactName',
            key: 'contactName',
            width: 120
        },
        {
            title: '联系电话',
            key: 'phone',
            width: 160,
            render: (_, record) => React.createElement('div', null, [
                record.phone && React.createElement('div', { key: 'p' }, record.phone),
                record.mobile && React.createElement('div', { key: 'm', style: { color: '#666', fontSize: 12 } }, record.mobile)
            ])
        },
        {
            title: '联系邮箱',
            dataIndex: 'email',
            key: 'email',
            width: 180,
            ellipsis: true
        },
        {
            title: '关联产品数',
            dataIndex: 'productCount',
            key: 'productCount',
            width: 100,
            align: 'center',
            render: (count) => React.createElement(Tag, { color: count > 0 ? 'green' : 'default' }, count)
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status) => React.createElement(Tag, { color: status === 'active' ? 'success' : 'default' }, status === 'active' ? '启用' : '禁用')
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 160
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => React.createElement(Space, { size: 'small' }, [
                React.createElement(Button, {
                    key: 'edit',
                    type: 'link',
                    size: 'small',
                    onClick: () => handleEdit(record),
                    'data-permission': 'contact:manage'
                }, '编辑'),
                React.createElement(Button, {
                    key: 'delete',
                    type: 'link',
                    size: 'small',
                    danger: true,
                    onClick: () => handleDelete(record),
                    disabled: record.productCount > 0,
                    'data-permission': 'contact:manage'
                }, '删除')
            ])
        }
    ];

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '文创 来源公司管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, '管理文创产品的来源公司信息，包含详细的联系方式')
        ]),
        React.createElement(Card, { key: 'main-card' }, [
            React.createElement('div', { key: 'actions', style: { marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
                React.createElement(Input.Search, {
                    key: 'search',
                    placeholder: '搜索公司名称、代码或联系人',
                    allowClear: true,
                    style: { width: 300 },
                    value: searchText,
                    onChange: (e) => setSearchText(e.target.value),
                    onSearch: setSearchText
                }),
                React.createElement(Button, {
                    key: 'add',
                    type: 'primary',
                    onClick: handleAdd,
                    'data-permission': 'contact:manage'
                }, '新增公司')
            ]),
            React.createElement(Table, {
                key: 'table',
                rowKey: 'id',
                columns: columns,
                dataSource: filteredCompanies,
                loading: loading,
                scroll: { x: 1200 },
                pagination: {
                    total: filteredCompanies.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 家公司`
                }
            })
        ]),

        // 新增/编辑公司Modal
        React.createElement(Modal, {
            key: 'company-modal',
            visible: modalVisible,
            title: editingCompany ? '编辑公司信息' : '新增公司',
            width: 700,
            onCancel: () => {
                setModalVisible(false);
                setEditingCompany(null);
                form.resetFields();
            },
            footer: null
        }, [
            React.createElement(Form, {
                key: 'form',
                form: form,
                layout: 'vertical',
                onFinish: handleSave
            }, [
                React.createElement(Form.Item, {
                    key: 'id',
                    name: 'id',
                    style: { display: 'none' }
                }, React.createElement(Input, null)),
                React.createElement(Row, { key: 'row1', gutter: 16 }, [
                    React.createElement(Col, { key: 'col1', span: 12 }, [
                        React.createElement(Form.Item, {
                            key: 'code',
                            label: '公司代码',
                            name: 'code',
                            rules: [{ required: true, message: '请输入公司代码' }]
                        }, React.createElement(Input, { placeholder: '如：RT-CULT-001' })),
                        React.createElement(Form.Item, {
                            key: 'name',
                            label: '公司名称',
                            name: 'name',
                            rules: [{ required: true, message: '请输入公司名称' }]
                        }, React.createElement(Input, { placeholder: '公司全称' })),
                        React.createElement(Form.Item, {
                            key: 'contactName',
                            label: '联系人',
                            name: 'contactName',
                            rules: [{ required: true, message: '请输入联系人' }]
                        }, React.createElement(Input, { placeholder: '联系人姓名' })),
                        React.createElement(Form.Item, {
                            key: 'phone',
                            label: '固定电话',
                            name: 'phone'
                        }, React.createElement(Input, { placeholder: '如：010-88888888' })),
                        React.createElement(Form.Item, {
                            key: 'mobile',
                            label: '手机号码',
                            name: 'mobile'
                        }, React.createElement(Input, { placeholder: '如：13800138000' }))
                    ]),
                    React.createElement(Col, { key: 'col2', span: 12 }, [
                        React.createElement(Form.Item, {
                            key: 'email',
                            label: '联系邮箱',
                            name: 'email',
                            rules: [{ type: 'email', message: '请输入有效的邮箱地址' }]
                        }, React.createElement(Input, { placeholder: '如：contact@example.com' })),
                        React.createElement(Form.Item, {
                            key: 'website',
                            label: '公司网站',
                            name: 'website'
                        }, React.createElement(Input, { placeholder: '如：www.example.com' })),
                        React.createElement(Form.Item, {
                            key: 'address',
                            label: '公司地址',
                            name: 'address'
                        }, React.createElement(Input, { placeholder: '详细地址' })),
                        React.createElement(Form.Item, {
                            key: 'status',
                            label: '状态',
                            name: 'status',
                            valuePropName: 'checked',
                            initialValue: true,
                            getValueFromEvent: (checked) => checked ? 'active' : 'inactive',
                            getValueProps: (value) => ({ checked: value === 'active' })
                        }, React.createElement(Switch, { checkedChildren: '启用', unCheckedChildren: '禁用' }))
                    ])
                ]),
                React.createElement(Form.Item, {
                    key: 'description',
                    label: '公司简介',
                    name: 'description'
                }, React.createElement(TextArea, { rows: 3, placeholder: '公司简介或备注信息', maxLength: 500, showCount: true })),
                React.createElement('div', { key: 'actions', style: { textAlign: 'center', marginTop: 24 } }, React.createElement(Space, { size: 'large' }, [
                    React.createElement(Button, {
                        key: 'cancel',
                        onClick: () => {
                            setModalVisible(false);
                            setEditingCompany(null);
                            form.resetFields();
                        }
                    }, '取消'),
                    React.createElement(Button, {
                        key: 'reset',
                        onClick: () => form.resetFields()
                    }, '重置'),
                    React.createElement(Button, {
                        key: 'submit',
                        type: 'primary',
                        htmlType: 'submit',
                        'data-permission': 'contact:manage'
                    }, '保存')
                ]))
            ])
        ])
    ]);
};

window.App.pages.CulturalCompanyManagement = CulturalCompanyManagement;
console.log('[CulturalCompanyManagement] 组件挂载成功');

