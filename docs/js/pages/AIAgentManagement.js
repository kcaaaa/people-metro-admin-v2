// AI智能体管理页面组件
const AIAgentManagement = ({ onPageChange, currentPage }) => {
    console.log('AIAgentManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Table, Modal, Form, Input, Select, Switch, Tag, message, Upload, Popconfirm, InputNumber } = antd;
    const { Option } = Select;
    const { TextArea } = Input;
    const [loading, setLoading] = React.useState(false);
    const [dataSource, setDataSource] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [currentAgent, setCurrentAgent] = React.useState(null);
    const [form] = Form.useForm();
    
    // 智能体类型选项
    const agentTypes = [
        { value: 'dify', label: 'Dify智能体' },
        { value: 'alicloud', label: '阿里云智能体' }
    ];
    
    // 平台选项
    const platforms = [
        { value: 'pc', label: 'PC端' },
        { value: 'app', label: 'APP端' },
        { value: 'both', label: 'PC和APP端' }
    ];
    
    // 用户角色选项（调整为对象数组格式）
    const userRoles = [
        { value: 'admin', label: '管理员' },
        { value: 'editor', label: '编辑' },
        { value: 'viewer', label: '查看者' },
        { value: 'operator', label: '操作员' },
        { value: 'manager', label: '经理' }
    ];
    
    // 模拟数据初始化
    React.useEffect(() => {
        initMockData();
    }, []);
    
    // 初始化模拟数据
    const initMockData = () => {
        setLoading(true);
        
        // 模拟智能体数据 - 调整为符合新结构的数据
        const mockAgents = [
            {
                id: '1',
                name: '客服助手',
                type: 'dify',
                platform: 'pc',
                sort: 0,
                url: 'https://example.com/agent1',
                ai_id: 'agent123',
                ai_key: 'key123',
                role: 'operator',
                remark: '为客户提供常见问题解答',
                enabled: true,
                createdAt: '2024-01-10',
                updatedAt: '2024-01-20'
            },
            {
                id: '2',
                name: '产品咨询',
                type: 'alicloud',
                platform: 'both',
                sort: 1,
                url: '',
                ai_id: 'agent456',
                ai_key: 'key456',
                role: 'viewer',
                remark: '介绍产品功能和提供使用建议',
                enabled: true,
                createdAt: '2024-01-05',
                updatedAt: '2024-01-15'
            },
            {
                id: '3',
                name: '技术支持',
                type: 'dify',
                platform: 'app',
                sort: 2,
                url: 'https://example.com/agent3',
                ai_id: 'agent789',
                ai_key: 'key789',
                role: 'editor',
                remark: '提供技术问题排查和解决方案',
                enabled: false,
                createdAt: '2023-12-20',
                updatedAt: '2024-01-10'
            }
        ];
        
        setTimeout(() => {
            setDataSource(mockAgents);
            setLoading(false);
        }, 500);
    };
    
    // 打开新增/编辑对话框
    const handleOpenModal = (record = null) => {
        if (record) {
            // 编辑模式
            setEditMode(true);
            setCurrentAgent(record);
            form.setFieldsValue({
                name: record.name,
                type: record.type,
                platform: record.platform,
                sort: record.sort,
                url: record.url,
                ai_id: record.ai_id,
                ai_key: record.ai_key,
                role: record.role,
                remark: record.remark,
                enabled: record.enabled
            });
        } else {
            // 新增模式
            setEditMode(false);
            setCurrentAgent(null);
            form.resetFields();
            form.setFieldsValue({ 
                platform: 'pc',
                sort: 0,
                enabled: true
            });
        }
        setVisible(true);
    };
    
    // 关闭对话框
    const handleCloseModal = () => {
        setVisible(false);
        form.resetFields();
    };
    
    // 保存智能体配置 - 调整为符合新数据结构的逻辑
    const handleSaveAgent = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (editMode) {
                // 更新智能体
                const updatedDataSource = dataSource.map(item => 
                    item.id === currentAgent.id ? { 
                        ...item, 
                        name: values.name,
                        type: values.type,
                        platform: values.platform,
                        sort: values.sort,
                        url: values.url || '',
                        ai_id: values.ai_id,
                        ai_key: values.ai_key,
                        role: values.role,
                        remark: values.remark || '',
                        enabled: values.enabled,
                        updatedAt: new Date().toISOString().split('T')[0] 
                    } : item
                );
                setDataSource(updatedDataSource);
                message.success('智能体更新成功');
            } else {
                // 新增智能体
                const newAgent = {
                    id: Date.now().toString(),
                    name: values.name,
                    type: values.type,
                    platform: values.platform,
                    sort: values.sort,
                    url: values.url || '',
                    ai_id: values.ai_id,
                    ai_key: values.ai_key,
                    role: values.role,
                    remark: values.remark || '',
                    enabled: values.enabled,
                    createdAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0]
                };
                setDataSource([...dataSource, newAgent]);
                message.success('智能体创建成功');
            }
            
            handleCloseModal();
        } catch (error) {
            console.error('保存失败:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // 删除智能体
    const handleDeleteAgent = async (id) => {
        try {
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const updatedDataSource = dataSource.filter(item => item.id !== id);
            setDataSource(updatedDataSource);
            message.success('智能体删除成功');
        } catch (error) {
            message.error('删除失败');
        } finally {
            setLoading(false);
        }
    };
    
    // 切换智能体状态
    const handleToggleStatus = async (id) => {
        try {
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const updatedDataSource = dataSource.map(item => 
                item.id === id ? { ...item, enabled: !item.enabled, updatedAt: new Date().toISOString().split('T')[0] } : item
            );
            setDataSource(updatedDataSource);
            message.success('状态更新成功');
        } catch (error) {
            message.error('状态更新失败');
        } finally {
            setLoading(false);
        }
    };
    
    // 表格列定义 - 调整为符合新数据结构的列
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '智能体类型',
            key: 'type',
            render: function(_, record) {
                const typeOption = agentTypes.find(type => type.value === record.type);
                return typeOption ? typeOption.label : record.type;
            }
        },
        {
            title: '平台',
            key: 'platform',
            render: function(_, record) {
                const platformOption = platforms.find(platform => platform.value === record.platform);
                return platformOption ? platformOption.label : record.platform;
            }
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort'
        },
        {
            title: '状态',
            key: 'status',
            render: function(_, record) {
                return React.createElement(Tag, { color: record.enabled ? 'green' : 'red' },
                    record.enabled ? '已启用' : '已禁用'
                );
            }
        },
        {
            title: '角色',
            key: 'role',
            render: function(_, record) {
                const roleOption = userRoles.find(role => role.value === record.role);
                return roleOption ? React.createElement(Tag, { color: 'blue' }, roleOption.label) : record.role;
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: '操作',
            key: 'action',
            render: function(_, record) {
                return React.createElement(Space, null,
                    React.createElement(Button, { size: 'small', onClick: function() { handleOpenModal(record); } }, '编辑'),
                    React.createElement(Popconfirm, {
                        title: '确定要删除这个智能体吗？',
                        onConfirm: function() { handleDeleteAgent(record.id); },
                        okText: '确定',
                        cancelText: '取消'
                    }, React.createElement(Button, { size: 'small', danger: true }, '删除')),
                    React.createElement(Switch, {
                        checked: record.enabled,
                        onChange: function() { handleToggleStatus(record.id); }
                    })
                );
            }
        }
    ];
    
    return React.createElement(React.Fragment, null,
        React.createElement(Row, { gutter: 16, key: 'header-row' },
            React.createElement(Col, { span: 24 },
                React.createElement(Card, {
                    title: 'AI智能体管理',
                    extra: React.createElement(Button, { type: 'primary', onClick: function() { handleOpenModal(); } }, '新增智能体')
                },
                    React.createElement(Table,
                        {
                            columns: columns,
                            dataSource: dataSource,
                            rowKey: 'id',
                            loading: loading,
                            pagination: {
                                pageSize: 10
                            }
                        }
                    )
                )
            )
        ),
        
        // 新增/编辑智能体对话框
        React.createElement(Modal,
            {
                title: editMode ? '编辑智能体' : '新增智能体',
                open: visible,
                onOk: handleSaveAgent,
                onCancel: handleCloseModal,
                width: 700,
                confirmLoading: loading
            },
            React.createElement(Form,
                {
                    form: form,
                    layout: 'vertical'
                },
                // 调整表单字段为用户要求的字段
                React.createElement(Row, { gutter: 16 },
                    React.createElement(Col, { span: 12 },
                        React.createElement(Form.Item,
                            {
                                name: 'name',
                                label: '智能体名称',
                                rules: [{ required: true, message: '请输入智能体名称' }, { max: 100, message: '智能体名称不能超过100个字符' }]
                            },
                            React.createElement(Input, { placeholder: '请输入智能体名称', showCount: true, maxLength: 100 })
                        )
                    ),
                    React.createElement(Col, { span: 12 },
                        React.createElement(Form.Item,
                            {
                                name: 'type',
                                label: '智能体类型',
                                rules: [{ required: true, message: '请选择智能体类型' }]
                            },
                            React.createElement(Select, { placeholder: '请选择智能体类型' },
                                agentTypes.map(function(type) {
                                    return React.createElement(Option, { key: type.value, value: type.value }, type.label);
                                })
                            )
                        )
                    )
                ),
                React.createElement(Row, { gutter: 16 },
                    React.createElement(Col, { span: 12 },
                        React.createElement(Form.Item,
                            {
                                name: 'platform',
                                label: '平台',
                                rules: [{ required: true, message: '请选择平台' }]
                            },
                            React.createElement(Select, { placeholder: '请选择平台' },
                                platforms.map(function(platform) {
                                    return React.createElement(Option, { key: platform.value, value: platform.value }, platform.label);
                                })
                            )
                        )
                    ),
                    React.createElement(Col, { span: 12 },
                        React.createElement(Form.Item,
                            {
                                name: 'sort',
                                label: '排序',
                                rules: [{ required: true, message: '请设置排序值' }]
                            },
                            React.createElement(InputNumber, { min: 0, placeholder: '0' })
                        )
                    )
                ),
                React.createElement(Form.Item,
                    {
                        name: 'url',
                        label: '智能体链接',
                        rules: [{ max: 500, message: '智能体链接不能超过500个字符' }]
                    },
                    React.createElement(Input, { placeholder: '请输入智能体链接（可选）', showCount: true, maxLength: 500 })
                ),
                React.createElement(Row, { gutter: 16 },
                    React.createElement(Col, { span: 12 },
                        React.createElement(Form.Item,
                            {
                                name: 'ai_id',
                                label: 'ai_id',
                                rules: [{ required: true, message: '请输入ai_id' }]
                            },
                            React.createElement(Input, { placeholder: '请输入ai_id' })
                        )
                    ),
                    React.createElement(Col, { span: 12 },
                        React.createElement(Form.Item,
                            {
                                name: 'ai_key',
                                label: 'ai_key',
                                rules: [{ required: true, message: '请输入ai_key' }]
                            },
                            React.createElement(Input, { placeholder: '请输入ai_key' })
                        )
                    )
                ),
                React.createElement(Row, { gutter: 16 },
                    React.createElement(Col, { span: 12 },
                        React.createElement(Form.Item,
                            {
                                name: 'role',
                                label: '角色',
                                rules: [{ required: true, message: '请选择角色' }]
                            },
                            React.createElement(Select, { placeholder: '请选择角色' },
                                userRoles.map(function(role) {
                                    return React.createElement(Option, { key: role.value, value: role.value }, role.label);
                                })
                            )
                        )
                    )
                ),
                React.createElement(Form.Item,
                    {
                        name: 'remark',
                        label: '备注',
                        rules: [{ max: 500, message: '备注信息不能超过500个字符' }]
                    },
                    React.createElement(TextArea, { rows: 3, placeholder: '请输入备注信息', showCount: true, maxLength: 500 })
                ),
                React.createElement(Form.Item,
                    {
                        name: 'enabled',
                        valuePropName: 'checked',
                        label: '状态',
                        rules: [{ required: true, message: '请设置状态' }]
                    },
                    React.createElement(Switch, { checkedChildren: '启用', unCheckedChildren: '停用' })
                )
            )
        )
    );
};

// 挂载组件到window.App.pages
window.App.pages.AIAgentManagement = AIAgentManagement;
console.log('[AIAgentManagement] 组件挂载成功');