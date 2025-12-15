// AI知识库详情页面组件
const AIKnowledgeDetail = ({ onPageChange, currentPage, knowledgeId, mode = 'view' }) => {
    console.log('AIKnowledgeDetail component is rendering for knowledge ID:', knowledgeId);
    
    const { Row, Col, Card, Button, Space, Table, Modal, Form, Input, Select, Switch, Tag, message, Upload, Popconfirm, Breadcrumb } = antd;
    const { Option } = Select;
    const { TextArea } = Input;
    const [loading, setLoading] = React.useState(false);
    const [knowledgeInfo, setKnowledgeInfo] = React.useState(null);
    const [fileDataSource, setFileDataSource] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [form] = Form.useForm();
    
    // 知识库类型选项
    // 当前用户信息（从认证系统获取）
    const currentUser = window.AuthUtils && window.AuthUtils.getCurrentUser ? window.AuthUtils.getCurrentUser() : {
        id: 'user1',
        name: '管理员',
        role: 'admin' // 默认值
    };
    
    // 权限检查函数
    const hasEditPermission = (record) => {
        // 超级管理员拥有全部权限
        if (currentUser.role === 'super-admin') {
            return true;
        }
        // 管理员可以编辑所有全局知识库和自己的个人知识库
        if (currentUser.role === 'admin' && record.isGlobal) {
            return true;
        }
        // 个人知识库只有创建者可以编辑
        if (!record.isGlobal && record.owner === currentUser.id) {
            return true;
        }
        return false;
    };
    
    const knowledgeTypes = [
        { value: 'faq', label: '常见问题' },
        { value: 'product', label: '产品文档' },
        { value: 'technical', label: '技术文档' },
        { value: 'operation', label: '运营数据' },
        { value: 'policy', label: '政策法规' }
    ];
    
    // 文件类型映射
    const fileTypeMap = {
        'pdf': { label: 'PDF文档', color: 'blue' },
        'doc': { label: 'Word文档', color: 'green' },
        'docx': { label: 'Word文档', color: 'green' },
        'xls': { label: 'Excel表格', color: 'cyan' },
        'xlsx': { label: 'Excel表格', color: 'cyan' },
        'ppt': { label: 'PPT演示', color: 'orange' },
        'pptx': { label: 'PPT演示', color: 'orange' },
        'txt': { label: '文本文件', color: 'purple' },
        'md': { label: 'Markdown', color: 'red' },
        'csv': { label: 'CSV文件', color: 'lime' }
    };
    
    // 权限设置选项（用于个人知识库权限设置）
    const userOptions = [
        { value: 'user1', label: '当前用户' },
        { value: 'user2', label: '用户2' },
        { value: 'user3', label: '用户3' }
    ];
    
    const departmentOptions = [
        { value: 'dept1', label: '技术部' },
        { value: 'dept2', label: '市场部' },
        { value: 'dept3', label: '人事部' }
    ];
    
    const roleOptions = [
        { value: 'admin', label: '管理员' },
        { value: 'editor', label: '编辑' },
        { value: 'user', label: '普通用户' }
    ];
    
    // 组件加载时初始化数据
    // 当mode或knowledgeId变化时重新加载数据
    React.useEffect(() => {
        if (knowledgeId) {
            loadKnowledgeData();
        }
    }, [knowledgeId, mode]);
    
    // 加载知识库详情数据
    const loadKnowledgeData = () => {
        setLoading(true);
        
        // 模拟API调用延迟
        setTimeout(() => {
            // 模拟获取知识库详情
            const mockKnowledgeDetail = {
                id: knowledgeId,
                name: knowledgeId === '1' ? '客服FAQ知识库' : 
                      knowledgeId === '2' ? '产品手册' : 
                      knowledgeId === '3' ? '技术文档库' : 
                      knowledgeId === '4' ? '运营数据分析' : 
                      knowledgeId === 'personal1' ? '我的学习笔记' :
                      knowledgeId === 'personal2' ? '项目规划文档' :
                      '政策法规汇编',
                description: knowledgeId === '1' ? '包含常见客户问题和解答的知识库' :
                            knowledgeId === '2' ? '详细的产品功能和使用说明文档' :
                            knowledgeId === '3' ? '系统架构、API接口和技术规范文档' :
                            knowledgeId === '4' ? '运营数据报告和趋势分析文档' :
                            knowledgeId === 'personal1' ? '个人整理的学习资料和笔记' :
                            knowledgeId === 'personal2' ? '个人项目的规划和设计文档' :
                            '相关政策法规和行业标准文档',
                type: knowledgeId === '1' ? 'faq' :
                      knowledgeId === '2' ? 'product' :
                      knowledgeId === '3' ? 'technical' :
                      knowledgeId === '4' ? 'operation' :
                      knowledgeId === 'personal1' ? 'technical' :
                      knowledgeId === 'personal2' ? 'product' :
                      'policy',
                enabled: knowledgeId !== '3', // ID为3的知识库设为禁用状态
                documentCount: knowledgeId === '1' ? 256 :
                              knowledgeId === '2' ? 128 :
                              knowledgeId === '3' ? 78 :
                              knowledgeId === '4' ? 45 :
                              knowledgeId === 'personal1' ? 25 :
                              knowledgeId === 'personal2' ? 15 :
                              102,
                lastUpdated: '2024-01-20',
                createdAt: knowledgeId === '1' ? '2024-01-05' :
                           knowledgeId === '2' ? '2024-01-02' :
                           knowledgeId === '3' ? '2023-12-28' :
                           knowledgeId === '4' ? '2024-01-01' :
                           knowledgeId === 'personal1' ? '2024-01-03' :
                           knowledgeId === 'personal2' ? '2024-01-01' :
                           '2023-12-30',
                isGlobal: !knowledgeId.startsWith('personal'), // 个人知识库isGlobal为false
                owner: knowledgeId.startsWith('personal') ? currentUser.id : 'system', // 个人知识库的创建者是当前用户
                permissions: knowledgeId.startsWith('personal') ? {
                    users: knowledgeId === 'personal2' ? ['user2'] : [],
                    departments: knowledgeId === 'personal2' ? ['dept1'] : [],
                    roles: knowledgeId === 'personal2' ? ['editor'] : []
                } : undefined // 全局知识库不需要权限设置
            };
            
            // 模拟获取知识文件列表
            const mockFiles = generateMockFiles(knowledgeId);
            
            setKnowledgeInfo(mockKnowledgeDetail);
            setFileDataSource(mockFiles);
            setLoading(false);
        }, 800);
    };
    
    // 生成模拟文件数据
    const generateMockFiles = (knowledgeId) => {
        const baseFiles = [];
        const fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'csv'];
        // 修改：增加示例知识库文件数量，确保每个知识库都有足够的文件
        const fileCount = knowledgeId === '1' ? 30 : 
                          knowledgeId === '2' ? 25 : 
                          knowledgeId === '3' ? 20 : 
                          knowledgeId === '4' ? 15 : 15;
        
        for (let i = 1; i <= fileCount; i++) {
            const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            const createdAt = date.toISOString().split('T')[0];
            
            date.setDate(date.getDate() + Math.floor(Math.random() * 10));
            const updatedAt = date.toISOString().split('T')[0];
            
            let fileNamePrefix = '';
            switch(knowledgeId) {
                case '1':
                    fileNamePrefix = 'FAQ问答集_';
                    break;
                case '2':
                    fileNamePrefix = '产品功能说明_';
                    break;
                case '3':
                    fileNamePrefix = '技术文档_';
                    break;
                case '4':
                    fileNamePrefix = '运营数据分析报告_';
                    break;
                default:
                    fileNamePrefix = '政策文件_';
            }
            
            baseFiles.push({
                id: `${knowledgeId}-file-${i}`,
                name: `${fileNamePrefix}第${i}篇.${fileType}`,
                type: fileType,
                size: Math.floor(Math.random() * 10000) + 100, // KB
                status: Math.random() > 0.2 ? 'active' : 'pending', // 80%的文件状态为active
                createdAt: createdAt,
                updatedAt: updatedAt,
                uploadBy: '系统管理员'
            });
        }
        
        return baseFiles;
    };
    
    // 返回上一页
    const handleBackToList = () => {
        if (onPageChange) {
            onPageChange('AIKnowledgeManagement');
        }
    };
    
    // 打开编辑对话框
    const handleOpenEditModal = () => {
        if (knowledgeInfo) {
            setEditMode(true);
            form.setFieldsValue({
                name: knowledgeInfo.name,
                description: knowledgeInfo.description,
                type: knowledgeInfo.type,
                enabled: knowledgeInfo.enabled,
                permissions: knowledgeInfo.permissions || { users: [], departments: [], roles: [] } // 初始化权限字段
            });
            setVisible(true);
        }
    };
    
    // 关闭对话框
    const handleCloseModal = () => {
        setVisible(false);
        form.resetFields();
    };
    
    // 保存知识库信息
    const handleSaveKnowledge = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 更新知识库信息
            const updatedKnowledge = {
                ...knowledgeInfo,
                ...values,
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            
            setKnowledgeInfo(updatedKnowledge);
            message.success('知识库更新成功');
            handleCloseModal();
        } catch (error) {
            console.error('保存失败:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // 切换知识库状态
    const handleToggleStatus = async () => {
        try {
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const updatedKnowledge = {
                ...knowledgeInfo,
                enabled: !knowledgeInfo.enabled,
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            
            setKnowledgeInfo(updatedKnowledge);
            message.success('状态更新成功');
        } catch (error) {
            message.error('状态更新失败');
        } finally {
            setLoading(false);
        }
    };
    
    // 删除知识库
    const handleDeleteKnowledge = async () => {
        try {
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            
            message.success('知识库删除成功');
            // 删除成功后返回知识库列表页面
            if (onPageChange) {
                onPageChange('AIKnowledgeManagement');
            }
        } catch (error) {
            message.error('删除失败');
        } finally {
            setLoading(false);
        }
    };
    
    // 上传文件
    const handleUploadFile = () => {
        message.success('文件上传功能待实现');
    };
    
    // 下载文件
    const handleDownloadFile = (fileId) => {
        message.success(`文件下载功能待实现: ${fileId}`);
    };
    
    // 删除文件
    const handleDeleteFile = async (fileId) => {
        try {
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const updatedFiles = fileDataSource.filter(file => file.id !== fileId);
            setFileDataSource(updatedFiles);
            
            // 更新知识库文档数量
            const updatedKnowledge = {
                ...knowledgeInfo,
                documentCount: updatedFiles.length,
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            
            setKnowledgeInfo(updatedKnowledge);
            message.success('文件删除成功');
        } catch (error) {
            message.error('文件删除失败');
        } finally {
            setLoading(false);
        }
    };
    
    // 文件表格列定义
    const fileColumns = [
        {
            title: '文件名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 250
        },
        {
            title: '文件类型',
            dataIndex: 'type',
            key: 'type',
            render: function(type) {
                const typeInfo = fileTypeMap[type] || { label: type.toUpperCase(), color: 'gray' };
                return React.createElement(Tag, { color: typeInfo.color }, typeInfo.label);
            }
        },
        {
            title: '文件大小',
            dataIndex: 'size',
            key: 'size',
            render: function(size) {
                return `${size} KB`;
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: function(status) {
                return React.createElement(Tag, { color: status === 'active' ? 'green' : 'orange' },
                    status === 'active' ? '已生效' : '待处理'
                );
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt'
        },
        {
            title: '上传者',
            dataIndex: 'uploadBy',
            key: 'uploadBy'
        },
        {
            title: '操作',
            key: 'action',
            render: function(_, record) {
                return React.createElement(Space, null,
                    React.createElement(Button, { size: 'small', onClick: function() { handleDownloadFile(record.id); } }, '下载'),
                    React.createElement(Popconfirm, {
                        title: '确定要删除这个文件吗？',
                        onConfirm: function() { handleDeleteFile(record.id); },
                        okText: '确定',
                        cancelText: '取消'
                    }, React.createElement(Button, { size: 'small', danger: true }, '删除'))
                );
            }
        }
    ];
    
    // 如果正在加载数据，显示加载状态
    if (loading && !knowledgeInfo) {
        return React.createElement(Row, { justify: 'center', align: 'middle', style: { minHeight: '50vh' } },
            React.createElement('div', null, '加载中...')
        );
    }
    
    // 如果没有找到知识库信息，显示错误状态
    if (!knowledgeInfo) {
        return React.createElement(Row, { justify: 'center', align: 'middle', style: { minHeight: '50vh' } },
            React.createElement('div', null, '未找到知识库信息')
        );
    }
    
    // 获取知识库类型的显示文本
    const knowledgeTypeLabel = knowledgeTypes.find(t => t.value === knowledgeInfo.type)?.label || knowledgeInfo.type;
    
    return React.createElement(React.Fragment, null,
        // 面包屑导航
        React.createElement(Row, { key: 'breadcrumb-row', style: { marginBottom: 16 } },
            React.createElement(Col, { span: 24 },
                React.createElement(Breadcrumb, null,
                    React.createElement(Breadcrumb.Item, { onClick: handleBackToList }, '知识库管理'),
                    React.createElement(Breadcrumb.Item, null, knowledgeInfo.name)
                )
            )
        ),
        
        // 知识库基本信息卡片
        React.createElement(Row, { gutter: 16, key: 'info-row', style: { marginBottom: 16 } },
            React.createElement(Col, { span: 24 },
                React.createElement(Card, {
                    title: '知识库信息',
                    extra: React.createElement(Space, null,
                        // 根据mode决定是否显示编辑和删除按钮
                        mode === 'edit' ? (
                            React.createElement(Space, null,
                                React.createElement(Button, { size: 'small', onClick: handleOpenEditModal }, '编辑'),
                                React.createElement(Popconfirm, {
                                    title: '确定要删除这个知识库吗？',
                                    onConfirm: handleDeleteKnowledge,
                                    okText: '确定',
                                    cancelText: '取消'
                                }, React.createElement(Button, { size: 'small', danger: true }, '删除'))
                            )
                        ) : null
                    )
                },
                    React.createElement(Row, { gutter: 16 },
                        React.createElement(Col, { span: 6 },
                            React.createElement('div', { style: { marginBottom: 8 } },
                                React.createElement('span', { style: { fontWeight: 'bold' } }, '名称: '),
                                knowledgeInfo.name
                            ),
                            React.createElement('div', { style: { marginBottom: 8 } },
                                React.createElement('span', { style: { fontWeight: 'bold' } }, '类型: '),
                                React.createElement(Tag, { color: 'blue' }, knowledgeTypeLabel)
                            ),
                            React.createElement('div', { style: { marginBottom: 8 } },
                                React.createElement('span', { style: { fontWeight: 'bold' } }, '状态: '),
                                React.createElement(Tag, { color: knowledgeInfo.enabled ? 'green' : 'red' },
                                    knowledgeInfo.enabled ? '已启用' : '已禁用'
                                )
                            ),
                            React.createElement('div', { style: { marginBottom: 8 } },
                                React.createElement('span', { style: { fontWeight: 'bold' } }, '启用/关闭: '),
                                React.createElement(Switch, {
                                    checked: knowledgeInfo.enabled,
                                    onChange: handleToggleStatus
                                })
                            )
                        ),
                        React.createElement(Col, { span: 18 },
                            React.createElement('div', { style: { marginBottom: 8 } },
                                React.createElement('span', { style: { fontWeight: 'bold' } }, '描述: '),
                                knowledgeInfo.description
                            ),
                            React.createElement('div', { style: { marginBottom: 8 } },
                                React.createElement('span', { style: { fontWeight: 'bold' } }, '文档数量: '),
                                knowledgeInfo.documentCount
                            ),
                            React.createElement('div', { style: { marginBottom: 8 } },
                                React.createElement('span', { style: { fontWeight: 'bold' } }, '创建时间: '),
                                knowledgeInfo.createdAt
                            ),
                            React.createElement('div', { style: { marginBottom: 8 } },
                                React.createElement('span', { style: { fontWeight: 'bold' } }, '最后更新: '),
                                knowledgeInfo.lastUpdated
                            )
                        )
                    )
                )
            )
        ),
        
        // 文件列表
        React.createElement(Row, { gutter: 16, key: 'files-row' },
            React.createElement(Col, { span: 24 },
                React.createElement(Card, {
                    title: '知识文件列表',
                    extra: mode === 'edit' ? React.createElement(Button, { type: 'primary', onClick: handleUploadFile }, '上传文件') : null
                },
                    React.createElement(Table,
                        {
                            columns: fileColumns,
                            dataSource: fileDataSource,
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
        
        // 编辑知识库对话框
        React.createElement(Modal,
            {
                title: '编辑知识库',
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
                ),
                
                // 个人知识库需要设置权限（按人员、部门、角色）
                knowledgeInfo.isGlobal === false && React.createElement(React.Fragment, null,
                    React.createElement(Form.Item, {
                        name: ['permissions', 'users'],
                        label: '访问权限（人员）',
                        tooltip: '选择可以访问该知识库的具体用户'
                    },
                        React.createElement(Select, { 
                            mode: 'multiple', 
                            placeholder: '请选择用户',
                            disabled: !hasEditPermission(knowledgeInfo) // 根据权限控制是否可编辑
                        },
                            userOptions.map(function(user) {
                                return React.createElement(Option, { key: user.value, value: user.value }, user.label);
                            })
                        )
                    ),
                    
                    React.createElement(Form.Item, {
                        name: ['permissions', 'departments'],
                        label: '访问权限（部门）',
                        tooltip: '选择可以访问该知识库的部门'
                    },
                        React.createElement(Select, { 
                            mode: 'multiple', 
                            placeholder: '请选择部门',
                            disabled: !hasEditPermission(knowledgeInfo) // 根据权限控制是否可编辑
                        },
                            departmentOptions.map(function(dept) {
                                return React.createElement(Option, { key: dept.value, value: dept.value }, dept.label);
                            })
                        )
                    ),
                    
                    React.createElement(Form.Item, {
                        name: ['permissions', 'roles'],
                        label: '访问权限（角色）',
                        tooltip: '选择可以访问该知识库的角色'
                    },
                        React.createElement(Select, { 
                            mode: 'multiple', 
                            placeholder: '请选择角色',
                            disabled: !hasEditPermission(knowledgeInfo) // 根据权限控制是否可编辑
                        },
                            roleOptions.map(function(role) {
                                return React.createElement(Option, { key: role.value, value: role.value }, role.label);
                            })
                        )
                    )
                )
            )
        )
    );
};

// 挂载组件到window.App.pages
window.App.pages.AIKnowledgeDetail = AIKnowledgeDetail;
console.log('[AIKnowledgeDetail] 组件挂载成功');