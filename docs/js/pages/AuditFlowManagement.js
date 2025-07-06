// 审核流程管理页面
const AuditFlowManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, Switch, message, Row, Col, Steps, Divider, Tabs, Transfer, Checkbox } = antd;
    const { Option } = Select;
    const { Step } = Steps;
    const { TabPane } = Tabs;

    const [loading, setLoading] = React.useState(false);
    const [flowTemplates, setFlowTemplates] = React.useState([]);
    const [currentFlow, setCurrentFlow] = React.useState(null);
    const [flowModalVisible, setFlowModalVisible] = React.useState(false);
    const [roleModalVisible, setRoleModalVisible] = React.useState(false);
    const [globalSwitch, setGlobalSwitch] = React.useState(true);
    const [form] = Form.useForm();

    // 模拟数据
    const mockFlowTemplates = [
        {
            id: 1,
            name: '标准内容审核流程',
            type: 'content',
            description: '适用于普通内容的审核流程',
            status: 'active',
            steps: [
                { id: 1, name: 'AI初审', type: 'ai', roles: ['ai-system'], required: true },
                { id: 2, name: '人工初审', type: 'manual', roles: ['junior-auditor'], required: true },
                { id: 3, name: '人工复审', type: 'manual', roles: ['senior-auditor'], required: false }
            ],
            rules: {
                contentTypes: ['video', 'image'],
                boards: ['content', 'industry'],
                priority: 1
            },
            createTime: '2024-01-10 10:00:00',
            updateTime: '2024-01-15 14:30:00'
        },
        {
            id: 2,
            name: '协会发布审核流程',
            type: 'association',
            description: '协会发布内容的特殊审核流程',
            status: 'active',
            steps: [
                { id: 1, name: 'AI初审', type: 'ai', roles: ['ai-system'], required: true },
                { id: 2, name: '协会内部审核', type: 'manual', roles: ['association-auditor'], required: true },
                { id: 3, name: '平台审核', type: 'manual', roles: ['senior-auditor'], required: true }
            ],
            rules: {
                contentTypes: ['video', 'image'],
                boards: ['association'],
                priority: 2
            },
            createTime: '2024-01-08 09:30:00',
            updateTime: '2024-01-12 16:20:00'
        },
        {
            id: 3,
            name: '展会内容审核流程',
            type: 'exhibition',
            description: '展会相关内容的审核流程',
            status: 'active',
            steps: [
                { id: 1, name: 'AI初审', type: 'ai', roles: ['ai-system'], required: true },
                { id: 2, name: '会展公司审核', type: 'manual', roles: ['exhibition-auditor'], required: true }
            ],
            rules: {
                contentTypes: ['video', 'image'],
                boards: ['exhibition'],
                priority: 3
            },
            createTime: '2024-01-05 15:45:00',
            updateTime: '2024-01-14 11:10:00'
        }
    ];

    const mockRoles = [
        { id: 'ai-system', name: 'AI系统', type: 'system', description: '自动化AI审核系统' },
        { id: 'junior-auditor', name: '初级审核员', type: 'manual', description: '负责基础内容审核' },
        { id: 'senior-auditor', name: '高级审核员', type: 'manual', description: '负责复杂内容和争议内容审核' },
        { id: 'association-auditor', name: '协会审核组', type: 'manual', description: '协会内部审核人员' },
        { id: 'exhibition-auditor', name: '会展审核员', type: 'manual', description: '会展公司审核人员' }
    ];

    React.useEffect(() => {
        loadFlowTemplates();
    }, []);

    const loadFlowTemplates = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setFlowTemplates(mockFlowTemplates);
        } catch (error) {
            message.error('加载流程模板失败');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFlow = () => {
        setCurrentFlow(null);
        form.resetFields();
        setFlowModalVisible(true);
    };

    const handleEditFlow = (flow) => {
        setCurrentFlow(flow);
        form.setFieldsValue({
            name: flow.name,
            description: flow.description,
            contentTypes: flow.rules.contentTypes,
            boards: flow.rules.boards,
            priority: flow.rules.priority
        });
        setFlowModalVisible(true);
    };

    const handleSaveFlow = async (values) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (currentFlow) {
                // 编辑流程
                setFlowTemplates(prev => 
                    prev.map(item => 
                        item.id === currentFlow.id 
                            ? { ...item, ...values, updateTime: new Date().toLocaleString() }
                            : item
                    )
                );
                message.success('流程模板更新成功');
            } else {
                // 新建流程
                const newFlow = {
                    id: Date.now(),
                    ...values,
                    status: 'active',
                    steps: [
                        { id: 1, name: 'AI初审', type: 'ai', roles: ['ai-system'], required: true }
                    ],
                    createTime: new Date().toLocaleString(),
                    updateTime: new Date().toLocaleString()
                };
                setFlowTemplates(prev => [newFlow, ...prev]);
                message.success('流程模板创建成功');
            }
            
            setFlowModalVisible(false);
        } catch (error) {
            message.error('保存失败');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFlowStatus = async (flowId) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            setFlowTemplates(prev => 
                prev.map(item => 
                    item.id === flowId 
                        ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
                        : item
                )
            );
            message.success('流程状态更新成功');
        } catch (error) {
            message.error('状态更新失败');
        }
    };

    const handleDeleteFlow = async (flowId) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            setFlowTemplates(prev => prev.filter(item => item.id !== flowId));
            message.success('流程模板删除成功');
        } catch (error) {
            message.error('删除失败');
        }
    };

    const getStatusTag = (status) => {
        return status === 'active' 
            ? React.createElement(Tag, { color: 'green' }, '启用中')
            : React.createElement(Tag, { color: 'red' }, '已停用');
    };

    const getBoardTag = (board) => {
        const boardMap = {
            association: { color: 'blue', text: '协会发布' },
            industry: { color: 'green', text: '行业发布' },
            exhibition: { color: 'purple', text: '展会发布' },
            content: { color: 'orange', text: '内容发布' }
        };
        const config = boardMap[board] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color, size: 'small' }, config.text);
    };

    const renderFlowSteps = (steps) => {
        return React.createElement(Steps, {
            size: 'small',
            direction: 'horizontal'
        }, steps.map((step, index) => 
            React.createElement(Step, {
                key: step.id,
                title: step.name,
                description: step.roles.map(roleId => {
                    const role = mockRoles.find(r => r.id === roleId);
                    return role ? role.name : roleId;
                }).join(', '),
                icon: step.type === 'ai' ? '🤖' : '👤'
            })
        ));
    };

    const columns = [
        {
            title: '流程信息',
            key: 'info',
            width: 250,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'name',
                    style: { fontWeight: 'bold', marginBottom: 4 }
                }, record.name),
                React.createElement('div', {
                    key: 'desc',
                    style: { fontSize: 12, color: '#666', marginBottom: 8 }
                }, record.description),
                React.createElement('div', { key: 'status' }, getStatusTag(record.status))
            ])
        },
        {
            title: '审核步骤',
            key: 'steps',
            width: 400,
            render: (_, record) => renderFlowSteps(record.steps)
        },
        {
            title: '适用范围',
            key: 'rules',
            width: 200,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'boards',
                    style: { marginBottom: 8 }
                }, record.rules.boards.map(board => getBoardTag(board))),
                React.createElement('div', {
                    key: 'types',
                    style: { fontSize: 12, color: '#666' }
                }, `内容类型：${record.rules.contentTypes.join(', ')}`),
                React.createElement('div', {
                    key: 'priority',
                    style: { fontSize: 12, color: '#666' }
                }, `优先级：${record.priority}`)
            ])
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            width: 150,
            sorter: true
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record) => React.createElement(Space, {}, [
                React.createElement(Button, {
                    key: 'edit',
                    type: 'link',
                    size: 'small',
                    onClick: () => handleEditFlow(record)
                }, '编辑'),
                React.createElement(Button, {
                    key: 'toggle',
                    type: 'link',
                    size: 'small',
                    onClick: () => handleToggleFlowStatus(record.id)
                }, record.status === 'active' ? '停用' : '启用'),
                React.createElement(Button, {
                    key: 'delete',
                    type: 'link',
                    size: 'small',
                    danger: true,
                    onClick: () => {
                        Modal.confirm({
                            title: '确认删除',
                            content: '删除后无法恢复，确定要删除这个流程模板吗？',
                            onOk: () => handleDeleteFlow(record.id)
                        });
                    }
                }, '删除')
            ])
        }
    ];

    const renderFlowModal = () => {
        return React.createElement(Modal, {
            title: currentFlow ? '编辑流程模板' : '创建流程模板',
            visible: flowModalVisible,
            onCancel: () => setFlowModalVisible(false),
            footer: null,
            width: 800
        }, React.createElement(Form, {
            form: form,
            layout: 'vertical',
            onFinish: handleSaveFlow
        }, [
            React.createElement(Form.Item, {
                key: 'name',
                label: '流程名称',
                name: 'name',
                rules: [{ required: true, message: '请输入流程名称' }]
            }, React.createElement(Input, { placeholder: '请输入流程名称' })),

            React.createElement(Form.Item, {
                key: 'description',
                label: '流程描述',
                name: 'description',
                rules: [{ required: true, message: '请输入流程描述' }]
            }, React.createElement(Input.TextArea, { placeholder: '请输入流程描述', rows: 3 })),

            React.createElement(Row, { key: 'row', gutter: 16 }, [
                React.createElement(Col, { key: 'boards', span: 12 },
                    React.createElement(Form.Item, {
                        label: '适用板块',
                        name: 'boards',
                        rules: [{ required: true, message: '请选择适用板块' }]
                    }, React.createElement(Select, {
                        mode: 'multiple',
                        placeholder: '请选择适用板块'
                    }, [
                        React.createElement(Option, { key: 'association', value: 'association' }, '协会发布'),
                        React.createElement(Option, { key: 'industry', value: 'industry' }, '行业发布'),
                        React.createElement(Option, { key: 'exhibition', value: 'exhibition' }, '展会发布'),
                        React.createElement(Option, { key: 'content', value: 'content' }, '内容发布')
                    ]))
                ),
                React.createElement(Col, { key: 'types', span: 12 },
                    React.createElement(Form.Item, {
                        label: '内容类型',
                        name: 'contentTypes',
                        rules: [{ required: true, message: '请选择内容类型' }]
                    }, React.createElement(Select, {
                        mode: 'multiple',
                        placeholder: '请选择内容类型'
                    }, [
                        React.createElement(Option, { key: 'video', value: 'video' }, '视频'),
                        React.createElement(Option, { key: 'image', value: 'image' }, '图文')
                    ]))
                )
            ]),

            React.createElement(Form.Item, {
                key: 'priority',
                label: '优先级',
                name: 'priority',
                rules: [{ required: true, message: '请输入优先级' }]
            }, React.createElement(Input, { 
                type: 'number', 
                placeholder: '数字越大优先级越高',
                min: 1,
                max: 10
            })),

            React.createElement(Form.Item, { key: 'buttons' },
                React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'cancel',
                        onClick: () => setFlowModalVisible(false)
                    }, '取消'),
                    React.createElement(Button, {
                        key: 'submit',
                        type: 'primary',
                        htmlType: 'submit',
                        loading: loading
                    }, currentFlow ? '更新' : '创建')
                ])
            )
        ]));
    };

    const renderGlobalSettings = () => {
        return React.createElement(Card, {
            title: '全局审核设置',
            size: 'small',
            style: { marginBottom: 24 }
        }, [
            React.createElement('div', {
                key: 'switch',
                style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 16
                }
            }, [
                React.createElement('div', { key: 'label' }, [
                    React.createElement('h4', { key: 'title', style: { margin: 0 } }, '强制人工复审'),
                    React.createElement('p', {
                        key: 'desc',
                        style: { margin: 0, fontSize: 12, color: '#666' }
                    }, '开启后，所有内容在AI审核后必须进入人工复审环节')
                ]),
                React.createElement(Switch, {
                    key: 'switch',
                    checked: globalSwitch,
                    onChange: (checked) => {
                        setGlobalSwitch(checked);
                        message.success(checked ? '已开启强制人工复审' : '已关闭强制人工复审');
                    }
                })
            ]),
            React.createElement(Divider, { key: 'divider' }),
            React.createElement('div', {
                key: 'info',
                style: { fontSize: 12, color: '#666' }
            }, [
                React.createElement('p', { key: 'note', style: { margin: 0 } }, 
                    '注意：此设置会覆盖所有流程模板的配置，用于应对特殊时期的监管要求。'
                )
            ])
        ]);
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '审核流程管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '配置和管理不同内容类型的审核流程，支持多级审核和角色指派'
            )
        ]),

        renderGlobalSettings(),

        React.createElement(Card, { key: 'main-card' }, [
            React.createElement('div', {
                key: 'header',
                style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 16 
                }
            }, [
                React.createElement('h3', { key: 'title' }, '流程模板管理'),
                React.createElement(Space, { key: 'actions' }, [
                    React.createElement(Button, {
                        key: 'refresh',
                        onClick: loadFlowTemplates
                    }, '刷新'),
                    React.createElement(Button, {
                        key: 'create',
                        type: 'primary',
                        onClick: handleCreateFlow
                    }, '创建流程模板')
                ])
            ]),

            React.createElement(Table, {
                key: 'table',
                columns: columns,
                dataSource: flowTemplates,
                loading: loading,
                pagination: {
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`
                },
                rowKey: 'id'
            })
        ]),

        renderFlowModal()
    ]);
};

window.App.pages.AuditFlowManagement = AuditFlowManagement;
console.log('[AuditFlowManagement] 组件挂载成功'); 