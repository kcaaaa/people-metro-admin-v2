// AI智能体管理页面组件
const AIAgentManagement = ({ onPageChange, currentPage }) => {
    console.log('AIAgentManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Table, Modal, Form, Input, Select, Switch, Tag, message, Upload, Popconfirm } = antd;
    const { Option } = Select;
    const { TextArea } = Input;
    const [loading, setLoading] = React.useState(false);
    const [dataSource, setDataSource] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [currentAgent, setCurrentAgent] = React.useState(null);
    const [form] = Form.useForm();
    
    // AI模型选项
    const aiModels = [
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'gpt-3.5', label: 'GPT-3.5' },
        { value: 'claude', label: 'Claude' },
        { value: 'gemini', label: 'Gemini' },
        { value: 'llama', label: 'Llama' }
    ];
    
    // 关联知识库选项
    const knowledgeBases = [
        { id: '1', name: '客服FAQ知识库' },
        { id: '2', name: '产品手册' },
        { id: '3', name: '技术文档库' },
        { id: '4', name: '运营数据分析' }
    ];
    
    // 用户角色选项
    const userRoles = [
        'admin', 'editor', 'viewer', 'operator', 'manager'
    ];
    
    // 模拟数据初始化
    React.useEffect(() => {
        initMockData();
    }, []);
    
    // 初始化模拟数据
    const initMockData = () => {
        setLoading(true);
        
        // 模拟智能体数据
        const mockAgents = [
            {
                id: '1',
                name: '客服助手',
                description: '为客户提供常见问题解答和技术支持',
                model: 'gpt-3.5',
                enabled: true,
                knowledgeBases: ['1', '2'],
                roles: ['operator', 'manager'],
                maxTokens: 2000,
                temperature: 0.7,
                topP: 0.9,
                createdAt: '2024-01-10',
                updatedAt: '2024-01-20'
            },
            {
                id: '2',
                name: '产品咨询',
                description: '介绍产品功能和提供使用建议',
                model: 'gpt-4',
                enabled: true,
                knowledgeBases: ['2'],
                roles: ['operator', 'viewer'],
                maxTokens: 3000,
                temperature: 0.8,
                topP: 0.95,
                createdAt: '2024-01-05',
                updatedAt: '2024-01-15'
            },
            {
                id: '3',
                name: '技术支持',
                description: '提供技术问题排查和解决方案',
                model: 'claude',
                enabled: false,
                knowledgeBases: ['3'],
                roles: ['operator', 'editor'],
                maxTokens: 4000,
                temperature: 0.6,
                topP: 0.85,
                createdAt: '2023-12-20',
                updatedAt: '2024-01-10'
            },
            {
                id: '4',
                name: '数据分析助手',
                description: '帮助分析运营数据和生成报告',
                model: 'gemini',
                enabled: true,
                knowledgeBases: ['4'],
                roles: ['manager', 'editor'],
                maxTokens: 5000,
                temperature: 0.75,
                topP: 0.9,
                createdAt: '2024-01-08',
                updatedAt: '2024-01-18'
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
                description: record.description,
                model: record.model,
                enabled: record.enabled,
                knowledgeBases: record.knowledgeBases,
                roles: record.roles,
                maxTokens: record.maxTokens,
                temperature: record.temperature,
                topP: record.topP
            });
        } else {
            // 新增模式
            setEditMode(false);
            setCurrentAgent(null);
            form.resetFields();
            form.setFieldsValue({ 
                enabled: true,
                maxTokens: 2000,
                temperature: 0.7,
                topP: 0.9
            });
        }
        setVisible(true);
    };
    
    // 关闭对话框
    const handleCloseModal = () => {
        setVisible(false);
        form.resetFields();
    };
    
    // 保存智能体
    const handleSaveAgent = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (editMode) {
                // 更新智能体
                const updatedDataSource = dataSource.map(item => 
                    item.id === currentAgent.id ? { ...item, ...values, updatedAt: new Date().toISOString().split('T')[0] } : item
                );
                setDataSource(updatedDataSource);
                message.success('智能体更新成功');
            } else {
                // 新增智能体
                const newAgent = {
                    id: Date.now().toString(),
                    ...values,
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
    
    // 表格列定义
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'AI模型',
            dataIndex: 'model',
            key: 'model'
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
            title: '关联知识库',
            key: 'knowledgeBases',
            render: function(_, record) {
                return React.createElement('div', null,
                    record.knowledgeBases.map(function(kbId) {
                        const kb = knowledgeBases.find(function(k) { return k.id === kbId; });
                        return kb ? React.createElement(Tag, { key: kbId }, kb.name) : null;
                    })
                );
            }
        },
        {
            title: '适用角色',
            key: 'roles',
            render: function(_, record) {
                return React.createElement('div', null,
                    record.roles.map(function(role) {
                        return React.createElement(Tag, { key: role, color: 'blue' }, role);
                    })
                );
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
                React.createElement(Form.Item,
                    {
                        name: 'name',
                        label: '名称',
                        rules: [{ required: true, message: '请输入智能体名称' }]
                    },
                    React.createElement(Input, { placeholder: '请输入智能体名称' })
                ),
                React.createElement(Form.Item,
                    {
                        name: 'description',
                        label: '描述',
                        rules: [{ required: true, message: '请输入智能体描述' }]
                    },
                    React.createElement(TextArea, { rows: 3, placeholder: '请输入智能体描述' })
                ),
                React.createElement(Form.Item,
                    {
                        name: 'model',
                        label: 'AI模型',
                        rules: [{ required: true, message: '请选择AI模型' }]
                    },
                    React.createElement(Select, { placeholder: '请选择AI模型' },
                        aiModels.map(function(model) {
                            return React.createElement(Option, { key: model.value, value: model.value }, model.label);
                        })
                    )
                ),
                React.createElement(Form.Item,
                    {
                        name: 'knowledgeBases',
                        label: '关联知识库',
                        rules: [{ required: true, message: '请选择关联知识库' }]
                    },
                    React.createElement(Select, { placeholder: '请选择关联知识库', mode: 'multiple' },
                        knowledgeBases.map(function(kb) {
                            return React.createElement(Option, { key: kb.id, value: kb.id }, kb.name);
                        })
                    )
                ),
                React.createElement(Form.Item,
                    {
                        name: 'roles',
                        label: '适用角色',
                        rules: [{ required: true, message: '请选择适用角色' }]
                    },
                    React.createElement(Select, { placeholder: '请选择适用角色', mode: 'multiple' },
                        userRoles.map(function(role) {
                            return React.createElement(Option, { key: role, value: role }, role);
                        })
                    )
                ),
                React.createElement(Row, { gutter: 16 },
                    React.createElement(Col, { span: 8 },
                        React.createElement(Form.Item,
                            {
                                name: 'maxTokens',
                                label: '最大响应长度',
                                rules: [{ required: true, message: '请输入最大响应长度' }]
                            },
                            React.createElement(Input, { type: 'number', placeholder: '请输入最大响应长度' })
                        )
                    ),
                    React.createElement(Col, { span: 8 },
                        React.createElement(Form.Item,
                            {
                                name: 'temperature',
                                label: '温度参数',
                                rules: [{ required: true, message: '请输入温度参数' }]
                            },
                            React.createElement(Input, { type: 'number', min: 0, max: 1, step: 0.01, placeholder: '0.7' })
                        )
                    ),
                    React.createElement(Col, { span: 8 },
                        React.createElement(Form.Item,
                            {
                                name: 'topP',
                                label: 'Top P参数',
                                rules: [{ required: true, message: '请输入Top P参数' }]
                            },
                            React.createElement(Input, { type: 'number', min: 0, max: 1, step: 0.01, placeholder: '0.9' })
                        )
                    )
                ),
                React.createElement(Form.Item,
                    {
                        name: 'enabled',
                        valuePropName: 'checked',
                        label: '启用状态'
                    },
                    React.createElement(Switch)
                )
            )
        )
    );
};

// 挂载组件到window.App.pages
window.App.pages.AIAgentManagement = AIAgentManagement;
console.log('[AIAgentManagement] 组件挂载成功');