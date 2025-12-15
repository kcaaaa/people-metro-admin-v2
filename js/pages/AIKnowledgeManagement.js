// AI知识库管理页面组件
const AIKnowledgeManagement = ({ onPageChange, currentPage }) => {
    console.log('AIKnowledgeManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Table, Modal, Form, Input, Select, Switch, Tag, message, Upload, Popconfirm, Badge, Statistic, Tabs } = antd;
    const { Option } = Select;
    const { TextArea } = Input;
    const { TabPane } = Tabs;
    const [loading, setLoading] = React.useState(false);
    const [globalKnowledgeData, setGlobalKnowledgeData] = React.useState([]); // 全局知识库数据
    const [personalKnowledgeData, setPersonalKnowledgeData] = React.useState([]); // 个人知识库数据
    const [visible, setVisible] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [currentKnowledge, setCurrentKnowledge] = React.useState(null);
    const [currentKnowledgeType, setCurrentKnowledgeType] = React.useState('global'); // 当前操作的知识库类型：'global' 或 'personal'
    const [form] = Form.useForm();
    
    // 当前用户信息（从认证系统获取）
    const currentUser = window.AuthUtils && window.AuthUtils.getCurrentUser ? window.AuthUtils.getCurrentUser() : {
        id: '1',
        name: '管理员',
        role: 'admin', // 默认值设置为admin，确保有足够权限
        permissions: ['*'] // 默认赋予所有权限
    };
    
    // 调试信息：输出当前用户和权限
    console.log('[AIKnowledgeManagement] 当前用户:', currentUser);
    console.log('[AIKnowledgeManagement] 当前用户角色:', currentUser.role);
    
    // 从分类管理系统获取的分类数据
    const [categories, setCategories] = React.useState([]);
    
    // 模拟获取分类数据的函数
    const fetchCategories = () => {
        // 这里应该调用API获取真实分类数据，现在使用模拟数据
        const mockCategories = [
            {
                id: 'standard',
                name: '标准',
                level: 1
            },
            {
                id: 'statistics',
                name: '统计分析',
                level: 1
            },
            {
                id: 'compliance',
                name: '合规',
                level: 1
            },
            {
                id: 'other',
                name: '其他',
                level: 1
            }
        ];
        setCategories(mockCategories);
    };
    
    // 初始化时获取分类数据
    React.useEffect(() => {
        fetchCategories();
    }, []);
    
    // 模拟数据初始化
    React.useEffect(() => {
        initMockData();
    }, []);
    
    // 初始化模拟数据
    const initMockData = () => {
        setLoading(true);
        
        // 模拟全局知识库数据
        const mockGlobalKnowledge = [
            {
                id: 'global1',
                name: '客服FAQ知识库',
                description: '包含常见客户问题和解答的知识库',
                type: 'faq',
                enabled: true,
                documentCount: 256,
                lastUpdated: '2024-01-20',
                createdAt: '2024-01-05',
                owner: 'admin',
                isGlobal: true,
                // 全局知识库关联的角色列表
                roles: ['admin', 'user', 'editor']
            },
            {
                id: 'global2',
                name: '产品手册',
                description: '详细的产品功能和使用说明文档',
                type: 'product',
                enabled: true,
                documentCount: 128,
                lastUpdated: '2024-01-18',
                createdAt: '2024-01-02',
                owner: 'admin',
                isGlobal: true,
                roles: ['admin', 'user']
            },
            {
                id: 'global3',
                name: '技术文档库',
                description: '系统架构、API接口和技术规范文档',
                type: 'technical',
                enabled: false,
                documentCount: 78,
                lastUpdated: '2024-01-15',
                createdAt: '2023-12-28',
                owner: 'admin',
                isGlobal: true,
                roles: ['admin', 'editor']
            }
        ];
        
        // 模拟个人知识库数据
        const mockPersonalKnowledge = [
            {
                id: 'personal1',
                name: '我的学习笔记',
                description: '个人整理的学习资料和笔记',
                type: 'technical',
                enabled: true,
                documentCount: 25,
                lastUpdated: '2024-01-19',
                createdAt: '2024-01-03',
                owner: currentUser.id,
                isGlobal: false,
                permissions: {
                    users: [], // 允许访问的用户ID列表
                    departments: [], // 允许访问的部门ID列表
                    roles: [] // 允许访问的角色列表
                }
            },
            {
                id: 'personal2',
                name: '项目规划文档',
                description: '个人项目的规划和设计文档',
                type: 'product',
                enabled: true,
                documentCount: 15,
                lastUpdated: '2024-01-17',
                createdAt: '2024-01-01',
                owner: currentUser.id,
                isGlobal: false,
                permissions: {
                    users: ['user2'], // 允许user2访问
                    departments: ['dept1'], // 允许dept1部门访问
                    roles: ['editor'] // 允许editor角色访问
                }
            }
        ];
        
        // 如果是管理员，还可以看到其他用户的个人知识库
        let allPersonalKnowledge = [...mockPersonalKnowledge];
        if (currentUser.role === 'admin') {
            allPersonalKnowledge.push({
                id: 'personal3',
                name: '其他用户的知识库',
                description: '另一个用户创建的个人知识库',
                type: 'faq',
                enabled: true,
                documentCount: 10,
                lastUpdated: '2024-01-16',
                createdAt: '2023-12-29',
                owner: 'user2',
                isGlobal: false,
                permissions: {
                    users: [],
                    departments: [],
                    roles: ['admin']
                }
            });
        }
        
        // 模拟用户数据（用于权限控制）
        const mockUsers = [
            { id: 'user1', name: '当前用户', department: 'dept1', role: 'user' },
            { id: 'user2', name: '用户2', department: 'dept2', role: 'editor' },
            { id: 'user3', name: '用户3', department: 'dept1', role: 'admin' }
        ];
        
        // 模拟部门数据
        const mockDepartments = [
            { id: 'dept1', name: '技术部' },
            { id: 'dept2', name: '市场部' },
            { id: 'dept3', name: '人事部' }
        ];
        
        // 获取当前用户信息
        const currentUserInfo = mockUsers.find(user => user.id === currentUser.id) || { department: 'unknown' };
        
        setTimeout(() => {
            // 过滤出用户有权限查看的全局知识库
            const accessibleGlobalKnowledge = mockGlobalKnowledge.filter(knowledge => 
                // 修改权限控制，允许所有用户查看和编辑全局知识库
                // currentUser.role === 'super-admin' || currentUser.role === 'admin' || knowledge.roles.includes(currentUser.role)
                true
            );
            
            // 过滤出用户有权限查看的个人知识库
            const accessiblePersonalKnowledge = allPersonalKnowledge.filter(knowledge => {
                // 超级管理员和管理员可以查看所有个人知识库
                if (currentUser.role === 'super-admin' || currentUser.role === 'admin') {
                    return true;
                }
                
                // 知识库创建者可以查看
                if (knowledge.owner === currentUser.id) {
                    return true;
                }
                
                // 检查权限设置
                const permissions = knowledge.permissions || {};
                
                // 检查用户权限
                if (permissions.users && permissions.users.includes(currentUser.id)) {
                    return true;
                }
                
                // 检查部门权限
                if (permissions.departments && permissions.departments.includes(currentUserInfo.department)) {
                    return true;
                }
                
                // 检查角色权限
                if (permissions.roles && permissions.roles.includes(currentUser.role)) {
                    return true;
                }
                
                return false;
            });
            
            setGlobalKnowledgeData(accessibleGlobalKnowledge);
            setPersonalKnowledgeData(accessiblePersonalKnowledge);
            setLoading(false);
        }, 500);
    };
    
    // 模拟用户数据（用于权限控制）
    const mockUsers = [
        { id: 'user1', name: '当前用户', department: 'dept1', role: 'user' },
        { id: 'user2', name: '用户2', department: 'dept2', role: 'editor' },
        { id: 'user3', name: '用户3', department: 'dept1', role: 'admin' }
    ];
    
    // 模拟部门数据
    const mockDepartments = [
        { id: 'dept1', name: '技术部' },
        { id: 'dept2', name: '市场部' },
        { id: 'dept3', name: '人事部' }
    ];
    
    // 打开新增/编辑对话框
    const handleOpenModal = (record = null, knowledgeType = 'global') => {
        setCurrentKnowledgeType(knowledgeType);
        
        if (record) {
            // 编辑模式
            setEditMode(true);
            setCurrentKnowledge(record);
            form.setFieldsValue({
                name: record.name,
                description: record.description,
                type: record.type,
                enabled: record.enabled,
                roles: record.roles || [],
                permissions: record.permissions || { users: [], departments: [], roles: [] }
            });
        } else {
            // 新增模式
            setEditMode(false);
            setCurrentKnowledge(null);
            form.resetFields();
            form.setFieldsValue({ 
                enabled: true,
                roles: knowledgeType === 'global' ? ['admin', 'editor', 'user'] : [], // 默认给全局知识库分配所有角色权限
                permissions: { users: [], departments: [], roles: [] },
                type: 'other' // 新增时默认只能选择"其他"分类
            });
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
            
            // 准备保存的数据
            const saveData = {
                ...values,
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            
            if (editMode) {
                // 更新知识库
                if (currentKnowledgeType === 'global') {
                    const updatedGlobalData = globalKnowledgeData.map(item => 
                        item.id === currentKnowledge.id ? { ...item, ...saveData } : item
                    );
                    setGlobalKnowledgeData(updatedGlobalData);
                } else {
                    const updatedPersonalData = personalKnowledgeData.map(item => 
                        item.id === currentKnowledge.id ? { ...item, ...saveData } : item
                    );
                    setPersonalKnowledgeData(updatedPersonalData);
                }
                message.success('知识库更新成功');
            } else {
                // 新增知识库
                const newKnowledge = {
                    id: Date.now().toString(),
                    ...values,
                    documentCount: 0,
                    createdAt: new Date().toISOString().split('T')[0],
                    lastUpdated: new Date().toISOString().split('T')[0],
                    owner: currentUser.id,
                    isGlobal: currentKnowledgeType === 'global',
                    // 为全局知识库添加默认角色权限，允许用户自定义
                    roles: currentKnowledgeType === 'global' ? (values.roles || ['admin', 'editor', 'user']) : [],
                    permissions: currentKnowledgeType !== 'global' ? {
                        users: [],
                        departments: [],
                        roles: []
                    } : undefined
                };
                
                if (currentKnowledgeType === 'global') {
                    setGlobalKnowledgeData([...globalKnowledgeData, newKnowledge]);
                } else {
                    setPersonalKnowledgeData([...personalKnowledgeData, newKnowledge]);
                }
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
    const handleDeleteKnowledge = async (id, knowledgeType) => {
        try {
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (knowledgeType === 'global') {
                const updatedGlobalData = globalKnowledgeData.filter(item => item.id !== id);
                setGlobalKnowledgeData(updatedGlobalData);
            } else {
                const updatedPersonalData = personalKnowledgeData.filter(item => item.id !== id);
                setPersonalKnowledgeData(updatedPersonalData);
            }
            message.success('知识库删除成功');
        } catch (error) {
            message.error('删除失败');
        } finally {
            setLoading(false);
        }
    };
    
    // 切换知识库状态
    const handleToggleStatus = async (id, knowledgeType) => {
        try {
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const updateData = {
                enabled: !((knowledgeType === 'global' ? globalKnowledgeData : personalKnowledgeData).find(item => item.id === id)?.enabled),
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            
            if (knowledgeType === 'global') {
                const updatedGlobalData = globalKnowledgeData.map(item => 
                    item.id === id ? { ...item, ...updateData } : item
                );
                setGlobalKnowledgeData(updatedGlobalData);
            } else {
                const updatedPersonalData = personalKnowledgeData.map(item => 
                    item.id === id ? { ...item, ...updateData } : item
                );
                setPersonalKnowledgeData(updatedPersonalData);
            }
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
    const handleViewKnowledge = (knowledgeId, mode = 'view', knowledgeType = 'global') => {
        console.log('Viewing knowledge detail for ID:', knowledgeId, 'Mode:', mode, 'Type:', knowledgeType);
        if (onPageChange) {
            onPageChange('AIKnowledgeDetail', { knowledgeId, mode, knowledgeType });
        }
    };
    
    // 检查用户是否有编辑权限
    const hasEditPermission = (record) => {
        // 调试信息：输出记录信息
        console.log('[AIKnowledgeManagement] 检查权限记录:', record);
        console.log('[AIKnowledgeManagement] 当前用户角色:', currentUser.role);
        
        // 超级管理员和管理员拥有全部权限
        if (currentUser.role === 'super_admin' || currentUser.role === 'super-admin' || currentUser.role === 'admin') {
            console.log('[AIKnowledgeManagement] 用户是管理员，拥有权限');
            return true;
        }
        // 个人知识库只有创建者可以编辑
        if (!record.isGlobal && record.owner === currentUser.id) {
            console.log('[AIKnowledgeManagement] 个人知识库，用户是创建者');
            return true;
        }
        console.log('[AIKnowledgeManagement] 无编辑权限');
        return false;
    };
    
    // 计算统计数据
    const totalGlobalKnowledge = globalKnowledgeData.length;
    const enabledGlobalKnowledge = globalKnowledgeData.filter(item => item.enabled).length;
    const totalGlobalDocuments = globalKnowledgeData.reduce((sum, item) => sum + item.documentCount, 0);
    
    const totalPersonalKnowledge = personalKnowledgeData.length;
    const enabledPersonalKnowledge = personalKnowledgeData.filter(item => item.enabled).length;
    const totalPersonalDocuments = personalKnowledgeData.reduce((sum, item) => sum + item.documentCount, 0);
    
    // 角色选项（用于全局知识库权限设置）
    const roleOptions = [
        { value: 'admin', label: '管理员' },
        { value: 'editor', label: '编辑' },
        { value: 'user', label: '普通用户' }
    ];
    
    // 用户选项（用于个人知识库权限设置）
    const userOptions = mockUsers.map(user => ({
        value: user.id,
        label: user.name
    }));
    
    // 部门选项（用于个人知识库权限设置）
    const departmentOptions = mockDepartments.map(dept => ({
        value: dept.id,
        label: dept.name
    }));
    
    // 知识库类型选项
    const knowledgeTypes = [
        { value: 'faq', label: 'FAQ' },
        { value: 'product', label: '产品手册' },
        { value: 'technical', label: '技术文档' },
        { value: 'other', label: '其他' }
    ];
    
    // 表格列定义 - 全局知识库
    const globalColumns = [
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
            title: '分类',
            dataIndex: 'type',
            key: 'type',
            render: function(type) {
                const typeOption = categories.find(function(t) { return t.id === type; });
                return typeOption ? React.createElement(Tag, { color: 'blue' }, typeOption.name) : type;
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
                const canEdit = hasEditPermission(record);
                return React.createElement(Space, null,
                    React.createElement(Button, { 
                        size: 'small', 
                        onClick: function() { handleViewKnowledge(record.id, canEdit ? 'edit' : 'view', 'global'); },
                        disabled: !canEdit && record.isGlobal
                    }, canEdit ? '详情/编辑' : '查看'),
                    canEdit && React.createElement(Popconfirm, {
                        title: '确定要删除这个知识库吗？',
                        onConfirm: function() { handleDeleteKnowledge(record.id, 'global'); },
                        okText: '确定',
                        cancelText: '取消'
                    }, React.createElement(Button, { size: 'small', danger: true }, '删除')),
                    canEdit && React.createElement(Switch, {
                        checked: record.enabled,
                        onChange: function() { handleToggleStatus(record.id, 'global'); }
                    })
                );
            }
        }
    ];
    
    // 表格列定义 - 个人知识库
    const personalColumns = [
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
            title: '所有者',
            dataIndex: 'owner',
            key: 'owner',
            render: function(owner) {
                return owner === currentUser.id ? '我' : '其他用户';
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
                const canEdit = hasEditPermission(record);
                return React.createElement(Space, null,
                    React.createElement(Button, { 
                        size: 'small', 
                        onClick: function() { handleViewKnowledge(record.id, canEdit ? 'edit' : 'view', 'personal'); }
                    }, canEdit ? '详情/编辑' : '查看'),
                    canEdit && React.createElement(Popconfirm, {
                        title: '确定要删除这个知识库吗？',
                        onConfirm: function() { handleDeleteKnowledge(record.id, 'personal'); },
                        okText: '确定',
                        cancelText: '取消'
                    }, React.createElement(Button, { size: 'small', danger: true }, '删除')),
                    canEdit && React.createElement(Switch, {
                        checked: record.enabled,
                        onChange: function() { handleToggleStatus(record.id, 'personal'); }
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
                        title: '全局知识库总数',
                        value: totalGlobalKnowledge
                    })
                )
            ),
            React.createElement(Col, { span: 6 },
                React.createElement(Card, null,
                    React.createElement(Statistic, {
                        title: '个人知识库总数',
                        value: totalPersonalKnowledge
                    })
                )
            ),
            React.createElement(Col, { span: 6 },
                React.createElement(Card, null,
                    React.createElement(Statistic, {
                        title: '全局文档总数',
                        value: totalGlobalDocuments,
                        precision: 0
                    })
                )
            ),
            React.createElement(Col, { span: 6 },
                React.createElement(Card, null,
                    React.createElement(Statistic, {
                        title: '个人文档总数',
                        value: totalPersonalDocuments,
                        precision: 0
                    })
                )
            )
        ),
        
        React.createElement(Row, { gutter: 16, key: 'tabs-row', style: { marginTop: 16 } },
            React.createElement(Col, { span: 24 },
                React.createElement(Card, null,
                    React.createElement(Tabs, { defaultActiveKey: 'global' },
                        React.createElement(TabPane, { 
                            tab: React.createElement(Space, null, 
                                React.createElement('span', null, '全局知识库'),
                                React.createElement(Badge, { count: totalGlobalKnowledge })
                            ), 
                            key: 'global' 
                        },
                            React.createElement(Space, { style: { marginBottom: 16 }, direction: 'horizontal', align: 'center' },
                                React.createElement('span', null, '全局知识库由管理员创建，面向特定角色开放访问权限'),
                                (currentUser.role === 'admin' || currentUser.role === 'super-admin' || currentUser.role === 'super_admin') && React.createElement(Button, { 
                                    type: 'primary', 
                                    onClick: function() { handleOpenModal(null, 'global'); } 
                                }, '新增全局知识库')
                            ),
                            React.createElement(Table,
                                {
                                    columns: globalColumns,
                                    dataSource: globalKnowledgeData,
                                    rowKey: 'id',
                                    loading: loading,
                                    pagination: {
                                        pageSize: 10
                                    }
                                }
                            )
                        ),
                        React.createElement(TabPane, { 
                            tab: React.createElement(Space, null, 
                                React.createElement('span', null, '个人知识库'),
                                React.createElement(Badge, { count: totalPersonalKnowledge })
                            ), 
                            key: 'personal' 
                        },
                            React.createElement(Space, { style: { marginBottom: 16 }, direction: 'horizontal', align: 'center' },
                                React.createElement('span', null, '个人知识库仅供创建者管理，管理员可查看所有个人知识库'),
                                React.createElement(Button, { 
                                    type: 'primary', 
                                    onClick: function() { handleOpenModal(null, 'personal'); } 
                                }, '新增个人知识库')
                            ),
                            React.createElement(Table,
                                {
                                    columns: personalColumns,
                                    dataSource: personalKnowledgeData,
                                    rowKey: 'id',
                                    loading: loading,
                                    pagination: {
                                        pageSize: 10
                                    }
                                }
                            )
                        )
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
                        label: '分类',
                        rules: [{ required: true, message: '请选择知识库分类' }],
                        help: editMode ? '编辑模式下可以修改分类' : '新增知识库只能使用"其他"分类'
                    },
                    React.createElement(Select, { 
                        placeholder: '请选择知识库分类',
                        disabled: !editMode // 新增时禁用选择，只能使用默认的"其他"分类
                    },
                        categories.map(function(category) {
                            return React.createElement(Option, { key: category.id, value: category.id }, category.name);
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
                // 全局知识库需要设置角色权限
                currentKnowledgeType === 'global' && React.createElement(Form.Item,
                    {
                        name: 'roles',
                        label: '访问权限（角色）',
                        rules: [{ required: true, message: '请选择至少一个角色' }],
                        tooltip: '选择可以访问该知识库的用户角色'
                    },
                    React.createElement(Select, { 
                        mode: 'multiple', 
                        placeholder: '请选择角色',
                        disabled: !(currentUser.role === 'admin' || currentUser.role === 'super-admin') // 超级管理员和管理员可以设置权限
                    },
                        roleOptions.map(function(role) {
                            return React.createElement(Option, { key: role.value, value: role.value }, role.label);
                        })
                    )
                ),
                
                // 个人知识库需要设置权限（按人员、部门、角色）
                currentKnowledgeType === 'personal' && React.createElement(React.Fragment, null,
                    React.createElement(Form.Item, {
                        name: ['permissions', 'users'],
                        label: '访问权限（人员）',
                        tooltip: '选择可以访问该知识库的具体用户'
                    },
                        React.createElement(Select, { 
                            mode: 'multiple', 
                            placeholder: '请选择用户',
                            disabled: currentKnowledge ? !hasEditPermission(currentKnowledge) : false // 新增时不禁用，编辑时检查权限
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
                            disabled: currentKnowledge ? !hasEditPermission(currentKnowledge) : false // 新增时不禁用，编辑时检查权限
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
                            disabled: currentKnowledge ? !hasEditPermission(currentKnowledge) : false // 新增时不禁用，编辑时检查权限
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
window.App.pages.AIKnowledgeManagement = AIKnowledgeManagement;
console.log('[AIKnowledgeManagement] 组件挂载成功');