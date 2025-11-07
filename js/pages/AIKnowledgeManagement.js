// AI知识库管理页面组件
const AIKnowledgeManagement = ({ onPageChange, currentPage }) => {
    console.log('AIKnowledgeManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Table, Modal, Form, Input, Select, Switch, Tag, message, Upload, Popconfirm, Badge, Statistic } = antd;
    const { Option } = Select;
    const { TextArea } = Input;
    const [loading, setLoading] = React.useState(false);
    const [dataSource, setDataSource] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [currentKnowledge, setCurrentKnowledge] = React.useState(null);
    const [form] = Form.useForm();
    
    // 知识库类型选项
    const knowledgeTypes = [
        { value: 'faq', label: '常见问题' },
        { value: 'product', label: '产品文档' },
        { value: 'technical', label: '技术文档' },
        { value: 'operation', label: '运营数据' },
        { value: 'policy', label: '政策法规' }
    ];
    
    // 模拟数据初始化
    React.useEffect(() => {
        initMockData();
    }, []);
    
    // 初始化模拟数据
    const initMockData = () => {
        setLoading(true);
        
        // 模拟知识库数据
        const mockKnowledge = [
            {
                id: '1',
                name: '客服FAQ知识库',
                description: '包含常见客户问题和解答的知识库',
                type: 'faq',
                enabled: true,
                documentCount: 256,
                lastUpdated: '2024-01-20',
                createdAt: '2024-01-05'
            },
            {
                id: '2',
                name: '产品手册',
                description: '详细的产品功能和使用说明文档',
                type: 'product',
                enabled: true,
                documentCount: 128,
                lastUpdated: '2024-01-18',
                createdAt: '2024-01-02'
            },
            {
                id: '3',
                name: '技术文档库',
                description: '系统架构、API接口和技术规范文档',
                type: 'technical',
                enabled: false,
                documentCount: 78,
                lastUpdated: '2024-01-15',
                createdAt: '2023-12-28'
            },
            {
                id: '4',
                name: '运营数据分析',
                description: '运营数据报告和趋势分析文档',
                type: 'operation',
                enabled: true,
                documentCount: 45,
                lastUpdated: '2024-01-10',
                createdAt: '2024-01-01'
            },
            {
                id: '5',
                name: '政策法规汇编',
                description: '相关政策法规和行业标准文档',
                type: 'policy',
                enabled: true,
                documentCount: 102,
                lastUpdated: '2024-01-12',
                createdAt: '2023-12-30'
            }
        ];
        
        setTimeout(() => {
            setDataSource(mockKnowledge);
            setLoading(false);
        }, 500);
    };
    
    // 打开新增/编辑对话框
    const handleOpenModal = (record = null) => {
        if (record) {
            // 编辑模式
            setEditMode(true);
            setCurrentKnowledge(record);
            form.setFieldsValue({
                name: record.name,
                description: record.description,
                type: record.type,
                enabled: record.enabled
            });
        } else {
            // 新增模式
            setEditMode(false);
            setCurrentKnowledge(null);
            form.resetFields();
            form.setFieldsValue({ enabled: true });
        }
        setVisible(true);
    };
    
    // 关闭对话框
    const handleCloseModal = () => {
        setVisible(false);
        form.resetFields();
    };
    
    // 保存知识库
    const handleSaveKnowledge = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (editMode) {
                // 更新知识库
                const updatedDataSource = dataSource.map(item => 
                    item.id === currentKnowledge.id ? { ...item, ...values, lastUpdated: new Date().toISOString().split('T')[0] } : item
                );
                setDataSource(updatedDataSource);
                message.success('知识库更新成功');
            } else {
                // 新增知识库
                const newKnowledge = {
                    id: Date.now().toString(),
                    ...values,
                    documentCount: 0,
                    createdAt: new Date().toISOString().split('T')[0],
                    lastUpdated: new Date().toISOString().split('T')[0]
                };
                setDataSource([...dataSource, newKnowledge]);
                message.success('知识库创建成功');
            }
            
            handleCloseModal();
        } catch (error) {
            console.error('保存失败:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // 删除知识库
    const handleDeleteKnowledge = async (id) => {
        try {
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const updatedDataSource = dataSource.filter(item => item.id !== id);
            setDataSource(updatedDataSource);
            message.success('知识库删除成功');
        } catch (error) {
            message.error('删除失败');
        } finally {
            setLoading(false);
        }
    };
    
    // 切换知识库状态
    const handleToggleStatus = async (id) => {
        try {
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const updatedDataSource = dataSource.map(item => 
                item.id === id ? { ...item, enabled: !item.enabled, lastUpdated: new Date().toISOString().split('T')[0] } : item
            );
            setDataSource(updatedDataSource);
            message.success('状态更新成功');
        } catch (error) {
            message.error('状态更新失败');
        } finally {
            setLoading(false);
        }
    };
    
    // 上传文档
    const handleUploadDocuments = (id) => {
        message.success('文档上传功能待实现');
    };
    
    // 查看文档
    const handleViewDocuments = (id) => {
        message.success('查看文档功能待实现');
    };
    
    // 查看知识库详情（支持编辑模式）
   const handleViewKnowledge = (knowledgeId, mode = 'view') => {
          console.log('Viewing knowledge detail for ID:', knowledgeId, 'Mode:', mode);
          if (onPageChange) {
             onPageChange('AIKnowledgeDetail', { knowledgeId, mode });
          }
      };
    
    // 计算统计数据
    const totalKnowledge = dataSource.length;
    const enabledKnowledge = dataSource.filter(item => item.enabled).length;
    const totalDocuments = dataSource.reduce((sum, item) => sum + item.documentCount, 0);
    
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
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: function(type) {
                const typeOption = knowledgeTypes.find(function(t) { return t.value === type; });
                return typeOption ? React.createElement(Tag, { color: 'blue' }, typeOption.label) : type;
            }
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
            title: '文档数量',
            dataIndex: 'documentCount',
            key: 'documentCount'
        },
        {
            title: '最后更新',
            dataIndex: 'lastUpdated',
            key: 'lastUpdated'
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
                         React.createElement(Button, { size: 'small', onClick: function() { handleViewKnowledge(record.id, 'edit'); } }, '详情/编辑'),
                          React.createElement(Popconfirm, {
                            title: '确定要删除这个知识库吗？',
                            onConfirm: function() { handleDeleteKnowledge(record.id); },
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
        React.createElement(Row, { gutter: 16, key: 'stats-row' },
            React.createElement(Col, { span: 6 },
                React.createElement(Card, null,
                    React.createElement(Statistic, {
                        title: '知识库总数',
                        value: totalKnowledge
                    })
                )
            ),
            React.createElement(Col, { span: 6 },
                React.createElement(Card, null,
                    React.createElement(Statistic, {
                        title: '已启用知识库',
                        value: enabledKnowledge,
                        precision: 0
                    })
                )
            ),
            React.createElement(Col, { span: 6 },
                React.createElement(Card, null,
                    React.createElement(Statistic, {
                        title: '文档总数',
                        value: totalDocuments,
                        precision: 0
                    })
                )
            ),
            React.createElement(Col, { span: 6 },
                React.createElement(Card, null,
                    React.createElement(Statistic, {
                        title: '平均文档数',
                        value: totalKnowledge > 0 ? (totalDocuments / totalKnowledge).toFixed(1) : 0,
                        precision: 1
                    })
                )
            )
        ),
        
        React.createElement(Row, { gutter: 16, key: 'table-row', style: { marginTop: 16 } },
            React.createElement(Col, { span: 24 },
                React.createElement(Card, {
                    title: '知识库列表',
                    extra: React.createElement(Button, { type: 'primary', onClick: function() { handleOpenModal(); } }, '新增知识库')
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
        
        // 新增/编辑知识库对话框
        React.createElement(Modal,
            {
                title: editMode ? '编辑知识库' : '新增知识库',
                open: visible,
                onOk: handleSaveKnowledge,
                onCancel: handleCloseModal,
                width: 600,
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
                        rules: [{ required: true, message: '请输入知识库名称' }]
                    },
                    React.createElement(Input, { placeholder: '请输入知识库名称' })
                ),
                React.createElement(Form.Item,
                    {
                        name: 'description',
                        label: '描述',
                        rules: [{ required: true, message: '请输入知识库描述' }]
                    },
                    React.createElement(TextArea, { rows: 3, placeholder: '请输入知识库描述' })
                ),
                React.createElement(Form.Item,
                    {
                        name: 'type',
                        label: '类型',
                        rules: [{ required: true, message: '请选择知识库类型' }]
                    },
                    React.createElement(Select, { placeholder: '请选择知识库类型' },
                        knowledgeTypes.map(function(type) {
                            return React.createElement(Option, { key: type.value, value: type.value }, type.label);
                        })
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
window.App.pages.AIKnowledgeManagement = AIKnowledgeManagement;
console.log('[AIKnowledgeManagement] 组件挂载成功');