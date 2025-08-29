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
                    description: '行业资讯和协会信息',
                    contentCount: 234,
                    children: [
                        {
                            key: 'info-industry',
                            title: '行业资讯',
                            code: 'info-industry',
                            level: 2,
                            sort: 1,
                            status: 'enabled',
                            description: '轨道交通行业最新资讯',
                            contentCount: 156,
                            parentKey: 'information'
                        },
                        {
                            key: 'info-association',
                            title: '协会信息',
                            code: 'info-association',
                            level: 2,
                            sort: 2,
                            status: 'enabled',
                            description: '协会内部信息和通知',
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
                    description: '会员服务和专业服务',
                    contentCount: 189,
                    children: [
                        {
                            key: 'service-member',
                            title: '会员服务',
                            code: 'service-member',
                            level: 2,
                            sort: 1,
                            status: 'enabled',
                            description: '会员专享服务内容',
                            contentCount: 67,
                            parentKey: 'services'
                        },
                        {
                            key: 'service-statistics',
                            title: '统计',
                            code: 'service-statistics',
                            level: 2,
                            sort: 2,
                            status: 'enabled',
                            description: '行业统计数据和报告',
                            contentCount: 45,
                            parentKey: 'services'
                        },
                        {
                            key: 'service-standards',
                            title: '标准',
                            code: 'service-standards',
                            level: 2,
                            sort: 3,
                            status: 'enabled',
                            description: '行业标准和技术规范',
                            contentCount: 38,
                            parentKey: 'services'
                        },
                        {
                            key: 'service-training',
                            title: '人才培养',
                            code: 'service-training',
                            level: 2,
                            sort: 4,
                            status: 'enabled',
                            description: '人才培养和培训项目',
                            contentCount: 29,
                            parentKey: 'services'
                        },
                        {
                            key: 'service-review',
                            title: '评审',
                            code: 'service-review',
                            level: 2,
                            sort: 5,
                            status: 'enabled',
                            description: '专业评审和认证服务',
                            contentCount: 10,
                            parentKey: 'services'
                        },
                        {
                            key: 'service-policy',
                            title: '政策汇编',
                            code: 'service-policy',
                            level: 2,
                            sort: 6,
                            status: 'enabled',
                            description: '政策文件和法规汇编',
                            contentCount: 0,
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
                    description: '特色专栏和专题内容',
                    contentCount: 312,
                    children: [
                        {
                            key: 'column-history',
                            title: '口述历史',
                            code: 'column-history',
                            level: 2,
                            sort: 1,
                            status: 'enabled',
                            description: '行业历史口述记录',
                            contentCount: 89,
                            parentKey: 'columns'
                        },
                        {
                            key: 'column-decrypt',
                            title: '解密',
                            code: 'column-decrypt',
                            level: 2,
                            sort: 2,
                            status: 'enabled',
                            description: '解密行业内幕和故事',
                            contentCount: 67,
                            parentKey: 'columns'
                        },
                        {
                            key: 'column-figures',
                            title: '人物',
                            code: 'column-figures',
                            level: 2,
                            sort: 3,
                            status: 'enabled',
                            description: '行业人物专访和介绍',
                            contentCount: 78,
                            parentKey: 'columns'
                        },
                        {
                            key: 'column-science',
                            title: '城轨科普',
                            code: 'column-science',
                            level: 2,
                            sort: 4,
                            status: 'enabled',
                            description: '城市轨道交通科普知识',
                            contentCount: 56,
                            parentKey: 'columns'
                        },
                        {
                            key: 'column-beauty',
                            title: '地铁之美',
                            code: 'column-beauty',
                            level: 2,
                            sort: 5,
                            status: 'enabled',
                            description: '地铁艺术和美学展示',
                            contentCount: 22,
                            parentKey: 'columns'
                        }
                    ]
                }
            ];

            setColumns(mockColumns);
            setExpandedKeys(['about', 'information', 'services', 'columns']);
            setLoading(false);
        }, 800);
    };

    // 渲染栏目树
    const renderColumnTree = () => {
        const treeData = columns.map(column => ({
            title: React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }
            }, [
                React.createElement('span', { key: 'title' }, column.title),
                React.createElement(Space, { key: 'actions', size: 'small' }, [
                    React.createElement(Tag, {
                        key: 'count',
                        size: 'small',
                        color: 'blue'
                    }, `${column.contentCount}篇`),
                    React.createElement(Tag, {
                        key: 'status',
                        size: 'small',
                        color: column.status === 'enabled' ? 'green' : 'red'
                    }, column.status === 'enabled' ? '启用' : '禁用')
                ])
            ]),
            key: column.key,
            children: column.children?.map(child => ({
                title: React.createElement('div', {
                    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }
                }, [
                    React.createElement('span', { key: 'title' }, child.title),
                    React.createElement(Space, { key: 'actions', size: 'small' }, [
                        React.createElement(Tag, {
                            key: 'count',
                            size: 'small',
                            color: 'blue'
                        }, `${child.contentCount}篇`),
                        React.createElement(Tag, {
                            key: 'status',
                            size: 'small',
                            color: child.status === 'enabled' ? 'green' : 'red'
                        }, child.status === 'enabled' ? '启用' : '禁用')
                    ])
                ]),
                key: child.key,
                parentKey: child.parentKey
            }))
        }));

        return React.createElement(Tree, {
            treeData: treeData,
            expandedKeys: expandedKeys,
            checkedKeys: checkedKeys,
            selectedKeys: selectedKeys,
            onExpand: setExpandedKeys,
            onCheck: setCheckedKeys,
            onSelect: (keys, info) => {
                setSelectedKeys(keys);
                if (keys.length > 0) {
                    const columnKey = keys[0];
                    const column = findColumnByKey(columnKey);
                    setSelectedColumn(column);
                }
            },
            showLine: true,
            showIcon: true,
            blockNode: true
        });
    };

    // 根据key查找栏目
    const findColumnByKey = (key) => {
        for (const column of columns) {
            if (column.key === key) return column;
            if (column.children) {
                const child = column.children.find(c => c.key === key);
                if (child) return child;
            }
        }
        return null;
    };

    // 渲染栏目详情
    const renderColumnDetail = () => {
        if (!selectedColumn) {
            return React.createElement('div', {
                style: { 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#999',
                    fontSize: '14px'
                }
            }, '请选择一个栏目查看详情');
        }

        const isMainColumn = selectedColumn.level === 1;
        const parentColumn = isMainColumn ? null : columns.find(c => c.key === selectedColumn.parentKey);

        return React.createElement(Card, {
            title: React.createElement('div', {}, [
                React.createElement('span', { key: 'title' }, '栏目详情'),
                React.createElement(Tag, {
                    key: 'level',
                    color: isMainColumn ? 'blue' : 'green',
                    style: { marginLeft: '8px' }
                }, isMainColumn ? '主栏目' : '子栏目')
            ]),
            extra: React.createElement(Space, {}, [
                React.createElement(Button, {
                    size: 'small',
                    onClick: () => setEditColumnModalVisible(true)
                }, '编辑'),
                React.createElement(Button, {
                    size: 'small',
                    type: 'primary',
                    onClick: () => setPermissionDrawerVisible(true)
                }, '权限配置')
            ])
        }, [
            React.createElement(Row, { key: 'basic-info', gutter: [24, 16] }, [
                React.createElement(Col, { key: 'name', span: 12 }, [
                    React.createElement('div', { key: 'label', style: { fontWeight: 'bold', marginBottom: '4px' } }, '栏目名称:'),
                    React.createElement('div', { key: 'value' }, selectedColumn.title)
                ]),
                React.createElement(Col, { key: 'code', span: 12 }, [
                    React.createElement('div', { key: 'label', style: { fontWeight: 'bold', marginBottom: '4px' } }, '栏目代码:'),
                    React.createElement('div', { key: 'value' }, selectedColumn.code)
                ]),
                React.createElement(Col, { key: 'sort', span: 12 }, [
                    React.createElement('div', { key: 'label', style: { fontWeight: 'bold', marginBottom: '4px' } }, '排序权重:'),
                    React.createElement('div', { key: 'value' }, selectedColumn.sort)
                ]),
                React.createElement(Col, { key: 'status', span: 12 }, [
                    React.createElement('div', { key: 'label', style: { fontWeight: 'bold', marginBottom: '4px' } }, '状态:'),
                    React.createElement(Tag, {
                        key: 'value',
                        color: selectedColumn.status === 'enabled' ? 'green' : 'red'
                    }, selectedColumn.status === 'enabled' ? '启用' : '禁用')
                ]),
                React.createElement(Col, { key: 'description', span: 24 }, [
                    React.createElement('div', { key: 'label', style: { fontWeight: 'bold', marginBottom: '4px' } }, '栏目描述:'),
                    React.createElement('div', { key: 'value' }, selectedColumn.description)
                ]),
                React.createElement(Col, { key: 'content-count', span: 12 }, [
                    React.createElement('div', { key: 'label', style: { fontWeight: 'bold', marginBottom: '4px' } }, '内容数量:'),
                    React.createElement('div', { key: 'value' }, `${selectedColumn.contentCount} 篇`)
                ]),
                React.createElement(Col, { key: 'parent', span: 12 }, [
                    React.createElement('div', { key: 'label', style: { fontWeight: 'bold', marginBottom: '4px' } }, '上级栏目:'),
                    React.createElement('div', { key: 'value' }, parentColumn ? parentColumn.title : '无')
                ])
            ])
        ]);
    };

    // 渲染权限配置抽屉
    const renderPermissionDrawer = () => {
        if (!selectedColumn) return null;

        return React.createElement(Drawer, {
            title: `${selectedColumn.title} - 权限配置`,
            open: permissionDrawerVisible,
            onClose: () => setPermissionDrawerVisible(false),
            width: 600,
            extra: React.createElement(Button, {
                type: 'primary',
                onClick: () => {
                    message.success('权限配置已保存');
                    setPermissionDrawerVisible(false);
                }
            }, '保存配置')
        }, [
            React.createElement(Alert, {
                key: 'info',
                message: '权限配置说明',
                description: '为当前栏目配置内容发布和审核权限，支持角色和用户级别的权限控制',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Form, {
                key: 'permission-form',
                form: permissionForm,
                layout: 'vertical',
                initialValues: {
                    publishRoles: ['content_editor', 'column_manager'],
                    publishUsers: [],
                    reviewRoles: ['content_reviewer', 'senior_reviewer'],
                    reviewUsers: [],
                    autoPublish: false,
                    requireReview: true
                }
            }, [
                React.createElement(Card, {
                    key: 'publish-permissions',
                    title: '发布权限配置',
                    size: 'small',
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement(Form.Item, {
                        key: 'publish-roles',
                        name: 'publishRoles',
                        label: '发布角色',
                        extra: '选择可以在此栏目发布内容的角色'
                    }, React.createElement(Select, {
                        mode: 'multiple',
                        placeholder: '选择发布角色',
                        options: [
                            { value: 'content_editor', label: '内容编辑' },
                            { value: 'column_manager', label: '栏目管理员' },
                            { value: 'senior_editor', label: '高级编辑' },
                            { value: 'guest_editor', label: '特邀编辑' }
                        ]
                    })),

                    React.createElement(Form.Item, {
                        key: 'publish-users',
                        name: 'publishUsers',
                        label: '发布用户',
                        extra: '选择可以在此栏目发布内容的特定用户'
                    }, React.createElement(Select, {
                        mode: 'multiple',
                        placeholder: '选择发布用户',
                        options: [
                            { value: 'user_001', label: '张三 (内容编辑)' },
                            { value: 'user_002', label: '李四 (栏目管理员)' },
                            { value: 'user_003', label: '王五 (高级编辑)' }
                        ]
                    }))
                ]),

                React.createElement(Card, {
                    key: 'review-permissions',
                    title: '审核权限配置',
                    size: 'small',
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement(Form.Item, {
                        key: 'review-roles',
                        name: 'reviewRoles',
                        label: '审核角色',
                        extra: '选择可以审核此栏目内容的角色'
                    }, React.createElement(Select, {
                        mode: 'multiple',
                        placeholder: '选择审核角色',
                        options: [
                            { value: 'content_reviewer', label: '内容审核员' },
                            { value: 'senior_reviewer', label: '高级审核员' },
                            { value: 'content_manager', label: '内容管理员' },
                            { value: 'chief_editor', label: '总编辑' }
                        ]
                    })),

                    React.createElement(Form.Item, {
                        key: 'review-users',
                        name: 'reviewUsers',
                        label: '审核用户',
                        extra: '选择可以审核此栏目内容的特定用户'
                    }, React.createElement(Select, {
                        mode: 'multiple',
                        placeholder: '选择审核用户',
                        options: [
                            { value: 'reviewer_001', label: '赵六 (内容审核员)' },
                            { value: 'reviewer_002', label: '钱七 (高级审核员)' },
                            { value: 'reviewer_003', label: '孙八 (内容管理员)' }
                        ]
                    }))
                ]),

                React.createElement(Card, {
                    key: 'publish-settings',
                    title: '发布设置',
                    size: 'small'
                }, [
                    React.createElement(Form.Item, {
                        key: 'auto-publish',
                        name: 'autoPublish',
                        label: '自动发布',
                        extra: '启用后，符合条件的内容将自动发布，无需人工审核'
                    }, React.createElement(Switch, {
                        checkedChildren: '启用',
                        unCheckedChildren: '禁用'
                    })),

                    React.createElement(Form.Item, {
                        key: 'require-review',
                        name: 'requireReview',
                        label: '强制审核',
                        extra: '启用后，所有内容必须经过审核才能发布'
                    }, React.createElement(Switch, {
                        checkedChildren: '启用',
                        unCheckedChildren: '禁用'
                    }))
                ])
            ])
        ]);
    };

    // 添加栏目
    const handleAddColumn = () => {
        setAddColumnModalVisible(true);
    };

    // 编辑栏目
    const handleEditColumn = () => {
        setEditColumnModalVisible(true);
    };

    // 批量操作
    const handleBatchOperation = (operation) => {
        if (checkedKeys.length === 0) {
            message.warning('请先选择要操作的栏目');
            return;
        }

        switch (operation) {
            case 'enable':
                message.success(`已启用 ${checkedKeys.length} 个栏目`);
                break;
            case 'disable':
                message.success(`已禁用 ${checkedKeys.length} 个栏目`);
                break;
            case 'delete':
                Modal.confirm({
                    title: '确认删除',
                    content: `确定要删除选中的 ${checkedKeys.length} 个栏目吗？此操作不可撤销。`,
                    onOk: () => {
                        message.success('栏目删除成功');
                        setCheckedKeys([]);
                    }
                });
                break;
            default:
                break;
        }
    };

    // 栏目统计
    const getColumnStats = () => {
        let totalColumns = 0;
        let enabledColumns = 0;
        let totalContent = 0;

        columns.forEach(column => {
            totalColumns++;
            if (column.status === 'enabled') enabledColumns++;
            totalContent += column.contentCount || 0;

            if (column.children) {
                column.children.forEach(child => {
                    totalColumns++;
                    if (child.status === 'enabled') enabledColumns++;
                    totalContent += child.contentCount || 0;
                });
            }
        });

        return { totalColumns, enabledColumns, totalContent };
    };

    const stats = getColumnStats();

    return React.createElement('div', { className: 'column-management-page' }, [
        React.createElement('div', {
            key: 'header',
            style: {
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }
            }, '栏目管理'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'add',
                    type: 'primary',
                    onClick: handleAddColumn
                }, '新增栏目'),
                React.createElement(Button, {
                    key: 'batch-enable',
                    onClick: () => handleBatchOperation('enable')
                }, '批量启用'),
                React.createElement(Button, {
                    key: 'batch-disable',
                    onClick: () => handleBatchOperation('disable')
                }, '批量禁用'),
                React.createElement(Button, {
                    key: 'batch-delete',
                    danger: true,
                    onClick: () => handleBatchOperation('delete')
                }, '批量删除')
            ])
        ]),

        // 统计卡片
        React.createElement(Row, {
            key: 'stats',
            gutter: [24, 24],
            style: { marginBottom: '24px' }
        }, [
            React.createElement(Col, { key: 'total', span: 6 }, React.createElement(Card, {
                size: 'small'
            }, [
                React.createElement('div', {
                    key: 'title',
                    style: { fontSize: '14px', color: '#666', marginBottom: '8px' }
                }, '总栏目数'),
                React.createElement('div', {
                    key: 'value',
                    style: { fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }
                }, stats.totalColumns)
            ])),
            React.createElement(Col, { key: 'enabled', span: 6 }, React.createElement(Card, {
                size: 'small'
            }, [
                React.createElement('div', {
                    key: 'title',
                    style: { fontSize: '14px', color: '#666', marginBottom: '8px' }
                }, '启用栏目'),
                React.createElement('div', {
                    key: 'value',
                    style: { fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }
                }, stats.enabledColumns)
            ])),
            React.createElement(Col, { key: 'content', span: 6 }, React.createElement(Card, {
                size: 'small'
            }, [
                React.createElement('div', {
                    key: 'title',
                    style: { fontSize: '14px', color: '#666', marginBottom: '8px' }
                }, '总内容数'),
                React.createElement('div', {
                    key: 'value',
                    style: { fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }
                }, stats.totalContent)
            ])),
            React.createElement(Col, { key: 'usage', span: 6 }, React.createElement(Card, {
                size: 'small'
            }, [
                React.createElement('div', {
                    key: 'title',
                    style: { fontSize: '14px', color: '#666', marginBottom: '8px' }
                }, '使用率'),
                React.createElement('div', {
                    key: 'value',
                    style: { fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }
                }, `${Math.round((stats.enabledColumns / stats.totalColumns) * 100)}%`)
            ]))
        ]),

        // 主要内容区域
        React.createElement(Row, {
            key: 'main-content',
            gutter: 24
        }, [
            // 左侧栏目树
            React.createElement(Col, {
                key: 'left',
                span: 12
            }, React.createElement(Card, {
                title: '栏目结构',
                extra: React.createElement(Button, {
                    size: 'small',
                    type: 'link',
                    onClick: () => setExpandedKeys(columns.map(c => c.key))
                }, '全部展开')
            }, [
                React.createElement(Alert, {
                    key: 'info',
                    message: '栏目管理说明',
                    description: '点击栏目查看详情，支持拖拽排序和批量操作。主栏目下可创建子栏目，每个栏目可独立配置权限。',
                    type: 'info',
                    showIcon: true,
                    style: { marginBottom: '16px' }
                }),
                renderColumnTree()
            ])),

            // 右侧详情
            React.createElement(Col, {
                key: 'right',
                span: 12
            }, renderColumnDetail())
        ]),

        // 权限配置抽屉
        renderPermissionDrawer(),

        // 新增栏目模态框
        React.createElement(Modal, {
            key: 'add-column-modal',
            title: '新增栏目',
            open: addColumnModalVisible,
            onCancel: () => setAddColumnModalVisible(false),
            onOk: () => {
                message.success('栏目创建成功');
                setAddColumnModalVisible(false);
            },
            width: 600
        }, React.createElement(Form, {
            form: form,
            layout: 'vertical'
        }, [
            React.createElement(Form.Item, {
                key: 'parent',
                name: 'parent',
                label: '上级栏目',
                extra: '选择上级栏目，留空表示创建主栏目'
            }, React.createElement(TreeSelect, {
                treeData: columns.map(c => ({
                    title: c.title,
                    key: c.key,
                    value: c.key,
                    children: c.children?.map(child => ({
                        title: child.title,
                        key: child.key,
                        value: child.key
                    }))
                })),
                placeholder: '选择上级栏目',
                allowClear: true,
                treeDefaultExpandAll: true
            })),

            React.createElement(Form.Item, {
                key: 'title',
                name: 'title',
                label: '栏目名称',
                rules: [{ required: true, message: '请输入栏目名称' }]
            }, React.createElement(Input, {
                placeholder: '请输入栏目名称'
            })),

            React.createElement(Form.Item, {
                key: 'code',
                name: 'code',
                label: '栏目代码',
                rules: [{ required: true, message: '请输入栏目代码' }],
                extra: '栏目代码用于系统识别，建议使用英文和数字'
            }, React.createElement(Input, {
                placeholder: '请输入栏目代码'
            })),

            React.createElement(Form.Item, {
                key: 'description',
                name: 'description',
                label: '栏目描述'
            }, React.createElement(Input.TextArea, {
                placeholder: '请输入栏目描述',
                rows: 3
            })),

            React.createElement(Form.Item, {
                key: 'sort',
                name: 'sort',
                label: '排序权重',
                initialValue: 1
            }, React.createElement(Input, {
                type: 'number',
                placeholder: '数字越小排序越靠前'
            }))
        ])),

        // 编辑栏目模态框
        React.createElement(Modal, {
            key: 'edit-column-modal',
            title: '编辑栏目',
            open: editColumnModalVisible,
            onCancel: () => setEditColumnModalVisible(false),
            onOk: () => {
                message.success('栏目更新成功');
                setEditColumnModalVisible(false);
            },
            width: 600
        }, selectedColumn && React.createElement(Form, {
            form: form,
            layout: 'vertical',
            initialValues: selectedColumn
        }, [
            React.createElement(Form.Item, {
                key: 'title',
                name: 'title',
                label: '栏目名称',
                rules: [{ required: true, message: '请输入栏目名称' }]
            }, React.createElement(Input, {
                placeholder: '请输入栏目名称'
            })),

            React.createElement(Form.Item, {
                key: 'code',
                name: 'code',
                label: '栏目代码',
                rules: [{ required: true, message: '请输入栏目代码' }]
            }, React.createElement(Input, {
                placeholder: '请输入栏目代码'
            })),

            React.createElement(Form.Item, {
                key: 'description',
                name: 'description',
                label: '栏目描述'
            }, React.createElement(Input.TextArea, {
                placeholder: '请输入栏目描述',
                rows: 3
            })),

            React.createElement(Form.Item, {
                key: 'sort',
                name: 'sort',
                label: '排序权重'
            }, React.createElement(Input, {
                type: 'number',
                placeholder: '数字越小排序越靠前'
            })),

            React.createElement(Form.Item, {
                key: 'status',
                name: 'status',
                label: '栏目状态'
            }, React.createElement(Select, {
                options: [
                    { value: 'enabled', label: '启用' },
                    { value: 'disabled', label: '禁用' }
                ]
            }))
        ]))
    ]);
};

window.App.pages.ColumnManagement = ColumnManagement;
console.log('[ColumnManagement] 栏目管理组件挂载成功');
