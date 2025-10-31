// 栏目管理页面
const ColumnManagement = () => {
    const { Row, Col, Card, Button, Space, Alert, Form, Input, Select, message, Modal, Table, Tag, Tree, Switch, Drawer, TreeSelect, Divider, Tooltip, Badge, Statistic } = antd;
    const [form] = Form.useForm();
    const [permissionForm] = Form.useForm();
    const [columns, setColumns] = React.useState([]);
    const [selectedColumn, setSelectedColumn] = React.useState(null);
    const [permissionModalVisible, setPermissionModalVisible] = React.useState(false);
    const [addColumnModalVisible, setAddColumnModalVisible] = React.useState(false);
    const [editColumnModalVisible, setEditColumnModalVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [expandedKeys, setExpandedKeys] = React.useState([]);
    const [checkedKeys, setCheckedKeys] = React.useState([]);
    const [selectedKeys, setSelectedKeys] = React.useState([]);
    const [permissionDrawerVisible, setPermissionDrawerVisible] = React.useState(false);
    const [currentColumnPermissions, setCurrentColumnPermissions] = React.useState({});

    React.useEffect(() => {
        loadColumns();
    }, []);

    // 加载栏目数据
    const loadColumns = () => {
        setLoading(true);
        setTimeout(() => {
            const mockColumns = [
                {
                    key: 'about',
                    title: '关于我们',
                    code: 'about',
                    level: 1,
                    sort: 1,
                    status: 'enabled',
                    description: '协会相关信息和介绍',
                    contentCount: 156,
                    children: [
                        {
                            key: 'about-profile',
                            title: '协会简介',
                            code: 'about-profile',
                            level: 2,
                            sort: 1,
                            status: 'enabled',
                            description: '协会基本信息和介绍',
                            contentCount: 45,
                            parentKey: 'about'
                        },
                        {
                            key: 'about-articles',
                            title: '协会章程',
                            code: 'about-articles',
                            level: 2,
                            sort: 2,
                            status: 'enabled',
                            description: '协会章程和规章制度',
                            contentCount: 23,
                            parentKey: 'about'
                        },
                        {
                            key: 'about-party',
                            title: '党建园地',
                            code: 'about-party',
                            level: 2,
                            sort: 3,
                            status: 'enabled',
                            description: '党建相关内容和活动',
                            contentCount: 34,
                            parentKey: 'about'
                        },
                        {
                            key: 'about-documents',
                            title: '4+N 纲领性文件',
                            code: 'about-documents',
                            level: 2,
                            sort: 4,
                            status: 'enabled',
                            description: '纲领性文件和重要政策',
                            contentCount: 28,
                            parentKey: 'about'
                        },
                        {
                            key: 'about-activities',
                            title: '品牌活动',
                            code: 'about-activities',
                            level: 2,
                            sort: 5,
                            status: 'enabled',
                            description: '协会品牌活动和项目',
                            contentCount: 26,
                            parentKey: 'about'
                        }
                    ]
                },
                {
                    key: 'information',
                    title: '资讯',
                    code: 'information',
                    level: 1,
                    sort: 2,
                    status: 'enabled',
                    description: '行业资讯和新闻动态',
                    contentCount: 234,
                    children: [
                        {
                            key: 'information-news',
                            title: '行业新闻',
                            code: 'information-news',
                            level: 2,
                            sort: 1,
                            status: 'enabled',
                            description: '轨道交通行业最新新闻',
                            contentCount: 89,
                            parentKey: 'information'
                        },
                        {
                            key: 'information-policy',
                            title: '政策法规',
                            code: 'information-policy',
                            level: 2,
                            sort: 2,
                            status: 'enabled',
                            description: '相关政策法规和标准',
                            contentCount: 67,
                            parentKey: 'information'
                        },
                        {
                            key: 'information-tech',
                            title: '技术动态',
                            code: 'information-tech',
                            level: 2,
                            sort: 3,
                            status: 'enabled',
                            description: '技术发展和创新动态',
                            contentCount: 78,
                            parentKey: 'information'
                        }
                    ]
                },
                {
                    key: 'services',
                    title: '服务',
                    code: 'services',
                    level: 1,
                    sort: 3,
                    status: 'enabled',
                    description: '协会提供的各项服务',
                    contentCount: 189,
                    children: [
                        {
                            key: 'services-consultation',
                            title: '咨询服务',
                            code: 'services-consultation',
                            level: 2,
                            sort: 1,
                            status: 'enabled',
                            description: '专业咨询服务',
                            contentCount: 56,
                            parentKey: 'services'
                        },
                        {
                            key: 'services-training',
                            title: '培训服务',
                            code: 'services-training',
                            level: 2,
                            sort: 2,
                            status: 'enabled',
                            description: '专业培训和教育服务',
                            contentCount: 78,
                            parentKey: 'services'
                        },
                        {
                            key: 'services-certification',
                            title: '认证服务',
                            code: 'services-certification',
                            level: 2,
                            sort: 3,
                            status: 'enabled',
                            description: '产品认证和质量评估',
                            contentCount: 55,
                            parentKey: 'services'
                        }
                    ]
                },
                {
                    key: 'columns',
                    title: '专栏',
                    code: 'columns',
                    level: 1,
                    sort: 4,
                    status: 'enabled',
                    description: '专题专栏和特色内容',
                    contentCount: 312,
                    children: [
                        {
                            key: 'columns-special',
                            title: '专题专栏',
                            code: 'columns-special',
                            level: 2,
                            sort: 1,
                            status: 'enabled',
                            description: '专题报道和深度分析',
                            contentCount: 123,
                            parentKey: 'columns'
                        },
                        {
                            key: 'columns-interview',
                            title: '人物访谈',
                            code: 'columns-interview',
                            level: 2,
                            sort: 2,
                            status: 'enabled',
                            description: '行业专家和领袖访谈',
                            contentCount: 89,
                            parentKey: 'columns'
                        },
                        {
                            key: 'columns-case',
                            title: '案例分享',
                            code: 'columns-case',
                            level: 2,
                            sort: 3,
                            status: 'enabled',
                            description: '成功案例和经验分享',
                            contentCount: 100,
                            parentKey: 'columns'
                        }
                    ]
                }
            ];
            setColumns(mockColumns);
            setLoading(false);
        }, 1000);
    };

    // 渲染栏目树
    const renderColumnTree = (data) => {
        return data.map(item => ({
            title: React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }
            }, [
                React.createElement('span', { key: 'title' }, item.title),
                React.createElement('div', { key: 'actions', style: { display: 'flex', gap: '4px' } }, [
                    React.createElement(Tag, { 
                        key: 'status', 
                        color: item.status === 'enabled' ? 'green' : 'red',
                        size: 'small'
                    }, item.status === 'enabled' ? '启用' : '禁用'),
                    React.createElement(Badge, { 
                        key: 'count', 
                        count: item.contentCount, 
                        size: 'small',
                        style: { backgroundColor: '#1890ff' }
                    })
                ])
            ]),
            key: item.key,
            children: item.children ? renderColumnTree(item.children) : undefined
        }));
    };

    // 查找栏目
    const findColumnByKey = (key, data = columns) => {
        for (const item of data) {
            if (item.key === key) return item;
            if (item.children) {
                const found = findColumnByKey(key, item.children);
                if (found) return found;
            }
        }
        return null;
    };

    // 渲染栏目详情
    const renderColumnDetail = () => {
        if (!selectedColumn) {
            return React.createElement('div', {
                style: { 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    color: '#999'
                }
            }, [
                React.createElement('div', { key: 'icon', style: { fontSize: '48px', marginBottom: '16px' } }, '📋'),
                React.createElement('div', { key: 'text' }, '请选择一个栏目查看详情')
            ]);
        }

        return React.createElement(Card, {
            title: '栏目详情',
            extra: React.createElement(Space, {}, [
                React.createElement(Button, {
                    key: 'edit',
                    type: 'primary',
                    size: 'small',
                    onClick: () => setEditColumnModalVisible(true)
                }, '编辑'),
                React.createElement(Button, {
                    key: 'permission',
                    size: 'small',
                    onClick: () => setPermissionModalVisible(true)
                }, '权限配置')
            ])
        }, [
            React.createElement(Descriptions, {
                key: 'info',
                column: 2,
                bordered: true
            }, [
                React.createElement(Descriptions.Item, { key: 'title', label: '栏目名称' }, selectedColumn.title),
                React.createElement(Descriptions.Item, { key: 'code', label: '栏目代码' }, selectedColumn.code),
                React.createElement(Descriptions.Item, { key: 'level', label: '栏目层级' }, `第${selectedColumn.level}级`),
                React.createElement(Descriptions.Item, { key: 'sort', label: '排序' }, selectedColumn.sort),
                React.createElement(Descriptions.Item, { key: 'status', label: '状态' }, 
                    React.createElement(Tag, { color: selectedColumn.status === 'enabled' ? 'green' : 'red' }, 
                        selectedColumn.status === 'enabled' ? '启用' : '禁用')
                ),
                React.createElement(Descriptions.Item, { key: 'count', label: '内容数量' }, 
                    React.createElement(Badge, { count: selectedColumn.contentCount, style: { backgroundColor: '#1890ff' } })
                ),
                React.createElement(Descriptions.Item, { key: 'description', label: '描述', span: 2 }, selectedColumn.description)
            ])
        ]);
    };

    // 添加栏目
    const handleAddColumn = (values) => {
        const newColumn = {
            key: `column-${Date.now()}`,
            title: values.title,
            code: values.code,
            level: values.parentKey ? 2 : 1,
            sort: values.sort || 1,
            status: 'enabled',
            description: values.description,
            contentCount: 0,
            parentKey: values.parentKey
        };

        if (values.parentKey) {
            // 添加到子栏目
            const parentColumn = findColumnByKey(values.parentKey);
            if (parentColumn) {
                if (!parentColumn.children) parentColumn.children = [];
                parentColumn.children.push(newColumn);
            }
        } else {
            // 添加到主栏目
            setColumns(prev => [...prev, newColumn]);
        }

        setAddColumnModalVisible(false);
        form.resetFields();
        message.success('栏目添加成功');
    };

    // 编辑栏目
    const handleEditColumn = (values) => {
        if (selectedColumn) {
            Object.assign(selectedColumn, {
                title: values.title,
                code: values.code,
                sort: values.sort,
                description: values.description
            });
            setColumns([...columns]);
            setEditColumnModalVisible(false);
            message.success('栏目更新成功');
        }
    };

    // 批量操作
    const handleBatchOperation = (operation) => {
        if (checkedKeys.length === 0) {
            message.warning('请选择要操作的栏目');
            return;
        }

        const updateColumns = (data) => {
            return data.map(item => {
                if (checkedKeys.includes(item.key)) {
                    item.status = operation === 'enable' ? 'enabled' : 'disabled';
                }
                if (item.children) {
                    item.children = updateColumns(item.children);
                }
                return item;
            });
        };

        setColumns(updateColumns(columns));
        message.success(`批量${operation === 'enable' ? '启用' : '禁用'}成功`);
    };

    // 获取栏目统计
    const getColumnStats = () => {
        const totalColumns = columns.length + columns.reduce((sum, col) => sum + (col.children?.length || 0), 0);
        const enabledColumns = columns.filter(col => col.status === 'enabled').length + 
                             columns.reduce((sum, col) => sum + (col.children?.filter(child => child.status === 'enabled').length || 0), 0);
        const totalContent = columns.reduce((sum, col) => sum + col.contentCount + (col.children?.reduce((childSum, child) => childSum + child.contentCount, 0) || 0), 0);

        return { totalColumns, enabledColumns, totalContent };
    };

    const stats = getColumnStats();

    return React.createElement('div', { className: 'column-management-page' }, [
        // 页面头部
        React.createElement(Row, { key: 'header', style: { marginBottom: '24px' } }, [
            React.createElement(Col, { key: 'title', span: 12 }, 
                React.createElement('h1', { style: { margin: 0, fontSize: '24px', fontWeight: 'bold' } }, '栏目管理')
            ),
            React.createElement(Col, { key: 'actions', span: 12, style: { textAlign: 'right' } }, 
                React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'add',
                        type: 'primary',
                        onClick: () => setAddColumnModalVisible(true)
                    }, '添加栏目'),
                    React.createElement(Button, {
                        key: 'enable',
                        onClick: () => handleBatchOperation('enable')
                    }, '批量启用'),
                    React.createElement(Button, {
                        key: 'disable',
                        onClick: () => handleBatchOperation('disable')
                    }, '批量禁用')
                ])
            )
        ]),

        // 统计卡片
        React.createElement(Row, { key: 'stats', gutter: 16, style: { marginBottom: '24px' } }, [
            React.createElement(Col, { key: 'total', span: 8 }, 
                React.createElement(Card, {}, [
                    React.createElement(Statistic, {
                        title: '总栏目数',
                        value: stats.totalColumns,
                        prefix: React.createElement('span', {}, '📋')
                    })
                ])
            ),
            React.createElement(Col, { key: 'enabled', span: 8 }, 
                React.createElement(Card, {}, [
                    React.createElement(Statistic, {
                        title: '启用栏目',
                        value: stats.enabledColumns,
                        prefix: React.createElement('span', {}, '✅')
                    })
                ])
            ),
            React.createElement(Col, { key: 'content', span: 8 }, 
                React.createElement(Card, {}, [
                    React.createElement(Statistic, {
                        title: '总内容数',
                        value: stats.totalContent,
                        prefix: React.createElement('span', {}, '📄')
                    })
                ])
            )
        ]),

        // 主要内容区域
        React.createElement(Row, { key: 'main', gutter: 16 }, [
            // 左侧栏目树
            React.createElement(Col, { key: 'tree', span: 8 }, 
                React.createElement(Card, {
                    title: '栏目结构',
                    extra: React.createElement(Button, {
                        size: 'small',
                        onClick: () => setExpandedKeys(columns.map(col => col.key))
                    }, '展开全部')
                }, [
                    React.createElement(Tree, {
                        treeData: renderColumnTree(columns),
                        expandedKeys: expandedKeys,
                        checkedKeys: checkedKeys,
                        selectedKeys: selectedKeys,
                        onExpand: setExpandedKeys,
                        onCheck: setCheckedKeys,
                        onSelect: (keys) => {
                            setSelectedKeys(keys);
                            if (keys.length > 0) {
                                const column = findColumnByKey(keys[0]);
                                setSelectedColumn(column);
                            }
                        },
                        loading: loading
                    })
                ])
            ),
            // 右侧详情
            React.createElement(Col, { key: 'detail', span: 16 }, 
                React.createElement(Card, { style: { height: '600px' } }, renderColumnDetail())
            )
        ]),

        // 添加栏目模态框
        React.createElement(Modal, {
            key: 'addModal',
            title: '添加栏目',
            visible: addColumnModalVisible,
            onCancel: () => setAddColumnModalVisible(false),
            footer: null
        }, [
            React.createElement(Form, {
                form: form,
                layout: 'vertical',
                onFinish: handleAddColumn
            }, [
                React.createElement(Form.Item, {
                    key: 'title',
                    name: 'title',
                    label: '栏目名称',
                    rules: [{ required: true, message: '请输入栏目名称' }]
                }, React.createElement(Input, { placeholder: '请输入栏目名称' })),
                React.createElement(Form.Item, {
                    key: 'code',
                    name: 'code',
                    label: '栏目代码',
                    rules: [{ required: true, message: '请输入栏目代码' }]
                }, React.createElement(Input, { placeholder: '请输入栏目代码' })),
                React.createElement(Form.Item, {
                    key: 'parentKey',
                    name: 'parentKey',
                    label: '父级栏目'
                }, React.createElement(TreeSelect, {
                    placeholder: '请选择父级栏目（可选）',
                    treeData: columns.map(col => ({
                        title: col.title,
                        value: col.key,
                        children: col.children?.map(child => ({
                            title: child.title,
                            value: child.key
                        }))
                    })),
                    allowClear: true
                })),
                React.createElement(Form.Item, {
                    key: 'sort',
                    name: 'sort',
                    label: '排序'
                }, React.createElement(Input, { type: 'number', placeholder: '请输入排序值' })),
                React.createElement(Form.Item, {
                    key: 'description',
                    name: 'description',
                    label: '描述'
                }, React.createElement(Input.TextArea, { placeholder: '请输入栏目描述' })),
                React.createElement(Form.Item, {
                    key: 'actions'
                }, React.createElement(Space, {}, [
                    React.createElement(Button, { key: 'cancel', onClick: () => setAddColumnModalVisible(false) }, '取消'),
                    React.createElement(Button, { key: 'submit', type: 'primary', htmlType: 'submit' }, '确定')
                ]))
            ])
        ]),

        // 编辑栏目模态框
        React.createElement(Modal, {
            key: 'editModal',
            title: '编辑栏目',
            visible: editColumnModalVisible,
            onCancel: () => setEditColumnModalVisible(false),
            footer: null
        }, [
            React.createElement(Form, {
                form: form,
                layout: 'vertical',
                onFinish: handleEditColumn,
                initialValues: selectedColumn
            }, [
                React.createElement(Form.Item, {
                    key: 'title',
                    name: 'title',
                    label: '栏目名称',
                    rules: [{ required: true, message: '请输入栏目名称' }]
                }, React.createElement(Input, { placeholder: '请输入栏目名称' })),
                React.createElement(Form.Item, {
                    key: 'code',
                    name: 'code',
                    label: '栏目代码',
                    rules: [{ required: true, message: '请输入栏目代码' }]
                }, React.createElement(Input, { placeholder: '请输入栏目代码' })),
                React.createElement(Form.Item, {
                    key: 'sort',
                    name: 'sort',
                    label: '排序'
                }, React.createElement(Input, { type: 'number', placeholder: '请输入排序值' })),
                React.createElement(Form.Item, {
                    key: 'description',
                    name: 'description',
                    label: '描述'
                }, React.createElement(Input.TextArea, { placeholder: '请输入栏目描述' })),
                React.createElement(Form.Item, {
                    key: 'actions'
                }, React.createElement(Space, {}, [
                    React.createElement(Button, { key: 'cancel', onClick: () => setEditColumnModalVisible(false) }, '取消'),
                    React.createElement(Button, { key: 'submit', type: 'primary', htmlType: 'submit' }, '确定')
                ]))
            ])
        ])
    ]);
};

window.App.pages.ColumnManagement = ColumnManagement;
console.log('[ColumnManagement] 栏目管理组件挂载成功');
