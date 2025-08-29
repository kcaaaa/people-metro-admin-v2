// 栏目权限管理页面
const ColumnPermissionManagement = () => {
    const { Row, Col, Card, Button, Space, Alert, Form, Input, Select, message, Modal, Table, Tag, Tabs, Switch, Drawer, TreeSelect, Divider, Tooltip, Badge, Collapse, Descriptions, Timeline, Statistic } = antd;
    const [form] = Form.useForm();
    const [columns, setColumns] = React.useState([]);
    const [selectedColumn, setSelectedColumn] = React.useState(null);
    const [permissionModalVisible, setPermissionModalVisible] = React.useState(false);
    const [templateModalVisible, setTemplateModalVisible] = React.useState(false);
    const [conflictModalVisible, setConflictModalVisible] = React.useState(false);
    const [historyDrawerVisible, setHistoryDrawerVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [permissionManager, setPermissionManager] = React.useState(null);
    const [currentPermissions, setCurrentPermissions] = React.useState({});
    const [permissionTemplates, setPermissionTemplates] = React.useState({});
    const [permissionConflicts, setPermissionConflicts] = React.useState([]);
    const [permissionHistory, setPermissionHistory] = React.useState([]);

    React.useEffect(() => {
        loadPermissionManager();
        loadColumns();
    }, []);

    // 加载权限管理器
    const loadPermissionManager = () => {
        if (window.columnPermissionManager) {
            setPermissionManager(window.columnPermissionManager);
            setPermissionTemplates(window.columnPermissionManager.getPermissionTemplates());
        }
    };

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

    // 渲染权限概览
    const renderPermissionOverview = () => {
        if (!permissionManager) return React.createElement('div', {}, '加载中...');

        const allColumns = permissionManager.getAllColumnKeys();
        const permissionSummary = permissionManager.getUserPermissionSummary('admin', ['admin']);

        return React.createElement('div', {}, [
            React.createElement(Row, { key: 'stats', gutter: 16, style: { marginBottom: '24px' } }, [
                React.createElement(Col, { key: 'total', span: 6 }, 
                    React.createElement(Card, {}, [
                        React.createElement(Statistic, {
                            title: '总栏目数',
                            value: allColumns.length,
                            prefix: React.createElement('span', {}, '📋')
                        })
                    ])
                ),
                React.createElement(Col, { key: 'publish', span: 6 }, 
                    React.createElement(Card, {}, [
                        React.createElement(Statistic, {
                            title: '可发布栏目',
                            value: permissionSummary.publishableColumns.length,
                            prefix: React.createElement('span', {}, '✍️')
                        })
                    ])
                ),
                React.createElement(Col, { key: 'review', span: 6 }, 
                    React.createElement(Card, {}, [
                        React.createElement(Statistic, {
                            title: '可审核栏目',
                            value: permissionSummary.reviewableColumns.length,
                            prefix: React.createElement('span', {}, '👁️')
                        })
                    ])
                ),
                React.createElement(Col, { key: 'templates', span: 6 }, 
                    React.createElement(Card, {}, [
                        React.createElement(Statistic, {
                            title: '权限模板',
                            value: Object.keys(permissionTemplates).length,
                            prefix: React.createElement('span', {}, '📝')
                        })
                    ])
                )
            ]),
            React.createElement(Card, { key: 'modes', title: '权限模式说明' }, [
                React.createElement(Alert, {
                    message: '权限配置模式',
                    description: '系统支持三种权限配置模式：角色权限、用户权限和混合权限。每种模式都有其适用场景和配置方式。',
                    type: 'info',
                    showIcon: true,
                    style: { marginBottom: '16px' }
                }),
                React.createElement(Collapse, {}, [
                    React.createElement(Collapse.Panel, {
                        key: 'role',
                        header: '角色权限模式',
                        extra: React.createElement(Tag, { color: 'blue' }, '推荐')
                    }, '基于用户角色分配权限，适合大规模用户管理。管理员可以为不同角色配置不同的栏目权限，用户通过角色继承权限。'),
                    React.createElement(Collapse.Panel, {
                        key: 'user',
                        header: '用户权限模式'
                    }, '直接为用户分配特定栏目的权限，适合精细化权限控制。可以为特定用户配置特殊的栏目访问权限。'),
                    React.createElement(Collapse.Panel, {
                        key: 'mixed',
                        header: '混合权限模式'
                    }, '结合角色权限和用户权限，用户既继承角色权限，也可以拥有个人特殊权限。系统会合并两种权限配置。')
                ])
            ])
        ]);
    };

    // 渲染权限管理表格
    const renderPermissionTable = () => {
        const columns = [
            {
                title: '栏目名称',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => React.createElement('div', {}, [
                    React.createElement('div', { key: 'title', style: { fontWeight: 'bold' } }, text),
                    React.createElement('div', { key: 'code', style: { fontSize: '12px', color: '#999' } }, record.code)
                ])
            },
            {
                title: '层级',
                dataIndex: 'level',
                key: 'level',
                render: (level) => React.createElement(Tag, { color: level === 1 ? 'blue' : 'green' }, `第${level}级`)
            },
            {
                title: '发布权限',
                key: 'publish',
                render: (_, record) => {
                    const canPublish = permissionManager?.canPublish('admin', ['admin'], record.key);
                    return React.createElement(Tag, { 
                        color: canPublish ? 'green' : 'red' 
                    }, canPublish ? '可发布' : '不可发布');
                }
            },
            {
                title: '审核权限',
                key: 'review',
                render: (_, record) => {
                    const canReview = permissionManager?.canReview('admin', ['admin'], record.key);
                    return React.createElement(Tag, { 
                        color: canReview ? 'green' : 'red' 
                    }, canReview ? '可审核' : '不可审核');
                }
            },
            {
                title: '发布设置',
                key: 'settings',
                render: (_, record) => {
                    const requiresReview = permissionManager?.requiresReview(record.key);
                    const supportsAutoPublish = permissionManager?.supportsAutoPublish(record.key);
                    return React.createElement(Space, { direction: 'vertical', size: 'small' }, [
                        React.createElement(Tag, { 
                            key: 'review', 
                            color: requiresReview ? 'orange' : 'default' 
                        }, requiresReview ? '需审核' : '无需审核'),
                        React.createElement(Tag, { 
                            key: 'auto', 
                            color: supportsAutoPublish ? 'blue' : 'default' 
                        }, supportsAutoPublish ? '支持自动发布' : '手动发布')
                    ]);
                }
            },
            {
                title: '操作',
                key: 'actions',
                render: (_, record) => React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'config',
                        size: 'small',
                        onClick: () => handleConfigPermissions(record)
                    }, '配置权限'),
                    React.createElement(Button, {
                        key: 'template',
                        size: 'small',
                        onClick: () => handleApplyTemplate(record)
                    }, '应用模板'),
                    React.createElement(Button, {
                        key: 'history',
                        size: 'small',
                        onClick: () => handleViewHistory(record)
                    }, '变更历史')
                ])
            }
        ];

        // 扁平化栏目数据用于表格显示
        const flatColumns = [];
        const flattenColumns = (cols, parentTitle = '') => {
            cols.forEach(col => {
                flatColumns.push({
                    ...col,
                    fullTitle: parentTitle ? `${parentTitle} > ${col.title}` : col.title
                });
                if (col.children) {
                    flattenColumns(col.children, col.title);
                }
            });
        };
        flattenColumns(columns);

        return React.createElement(Table, {
            columns: columns,
            dataSource: flatColumns,
            rowKey: 'key',
            loading: loading,
            pagination: { pageSize: 10 }
        });
    };

    // 配置权限
    const handleConfigPermissions = (column) => {
        setSelectedColumn(column);
        setCurrentPermissions(permissionManager?.getColumnPermissions(column.key) || {});
        setPermissionModalVisible(true);
    };

    // 应用模板
    const handleApplyTemplate = (column) => {
        setSelectedColumn(column);
        setTemplateModalVisible(true);
    };

    // 查看历史
    const handleViewHistory = (column) => {
        setSelectedColumn(column);
        setPermissionHistory(permissionManager?.getPermissionChangeHistory(column.key) || []);
        setHistoryDrawerVisible(true);
    };

    // 保存权限
    const handleSavePermissions = (values) => {
        if (selectedColumn && permissionManager) {
            const newPermissions = {
                ...currentPermissions,
                ...values
            };
            
            // 检查权限冲突
            const conflicts = permissionManager.checkPermissionConflicts(newPermissions);
            if (conflicts.length > 0) {
                setPermissionConflicts(conflicts);
                setConflictModalVisible(true);
                return;
            }

            permissionManager.updateColumnPermissions(selectedColumn.key, newPermissions);
            setPermissionModalVisible(false);
            message.success('权限配置保存成功');
        }
    };

    // 应用模板确认
    const handleApplyTemplateConfirm = (templateName) => {
        if (selectedColumn && permissionManager) {
            permissionManager.applyPermissionTemplate(selectedColumn.key, templateName);
            setTemplateModalVisible(false);
            message.success('权限模板应用成功');
        }
    };

    // 批量应用模板
    const handleBatchApplyTemplate = (templateName, columnKeys) => {
        if (permissionManager) {
            const updates = columnKeys.map(key => ({
                columnKey: key,
                templateName: templateName
            }));
            permissionManager.batchUpdatePermissions(updates);
            message.success('批量应用模板成功');
        }
    };

    // 渲染权限配置模态框
    const renderPermissionModal = () => {
        return React.createElement(Modal, {
            title: `配置权限 - ${selectedColumn?.title}`,
            visible: permissionModalVisible,
            onCancel: () => setPermissionModalVisible(false),
            footer: null,
            width: 800
        }, [
            React.createElement(Form, {
                form: form,
                layout: 'vertical',
                onFinish: handleSavePermissions,
                initialValues: currentPermissions
            }, [
                React.createElement(Row, { key: 'header', gutter: 16 }, [
                    React.createElement(Col, { key: 'info', span: 24 }, 
                        React.createElement(Alert, {
                            message: '权限配置说明',
                            description: '请为当前栏目配置发布权限、审核权限和发布设置。权限配置会影响用户在该栏目的操作能力。',
                            type: 'info',
                            showIcon: true,
                            style: { marginBottom: '16px' }
                        })
                    )
                ]),
                React.createElement(Row, { key: 'permissions', gutter: 16 }, [
                    React.createElement(Col, { key: 'publish', span: 12 }, [
                        React.createElement(Card, { title: '发布权限', size: 'small' }, [
                            React.createElement(Form.Item, {
                                key: 'publishRoles',
                                name: 'publishRoles',
                                label: '可发布角色'
                            }, React.createElement(Select, {
                                mode: 'multiple',
                                placeholder: '选择可发布的角色',
                                options: [
                                    { label: '管理员', value: 'admin' },
                                    { label: '编辑', value: 'editor' },
                                    { label: '作者', value: 'author' }
                                ]
                            })),
                            React.createElement(Form.Item, {
                                key: 'publishUsers',
                                name: 'publishUsers',
                                label: '可发布用户'
                            }, React.createElement(Select, {
                                mode: 'multiple',
                                placeholder: '选择可发布的用户',
                                options: [
                                    { label: '张三', value: 'user1' },
                                    { label: '李四', value: 'user2' },
                                    { label: '王五', value: 'user3' }
                                ]
                            }))
                        ])
                    ]),
                    React.createElement(Col, { key: 'review', span: 12 }, [
                        React.createElement(Card, { title: '审核权限', size: 'small' }, [
                            React.createElement(Form.Item, {
                                key: 'reviewRoles',
                                name: 'reviewRoles',
                                label: '可审核角色'
                            }, React.createElement(Select, {
                                mode: 'multiple',
                                placeholder: '选择可审核的角色',
                                options: [
                                    { label: '管理员', value: 'admin' },
                                    { label: '审核员', value: 'reviewer' }
                                ]
                            })),
                            React.createElement(Form.Item, {
                                key: 'reviewUsers',
                                name: 'reviewUsers',
                                label: '可审核用户'
                            }, React.createElement(Select, {
                                mode: 'multiple',
                                placeholder: '选择可审核的用户',
                                options: [
                                    { label: '审核员A', value: 'reviewer1' },
                                    { label: '审核员B', value: 'reviewer2' }
                                ]
                            }))
                        ])
                    ])
                ]),
                React.createElement(Row, { key: 'settings', gutter: 16, style: { marginTop: '16px' } }, [
                    React.createElement(Col, { key: 'settings', span: 24 }, [
                        React.createElement(Card, { title: '发布设置', size: 'small' }, [
                            React.createElement(Form.Item, {
                                key: 'requiresReview',
                                name: 'requiresReview',
                                label: '发布设置',
                                valuePropName: 'checked'
                            }, React.createElement(Switch, { checkedChildren: '需审核', unCheckedChildren: '无需审核' })),
                            React.createElement(Form.Item, {
                                key: 'supportsAutoPublish',
                                name: 'supportsAutoPublish',
                                label: '自动发布',
                                valuePropName: 'checked'
                            }, React.createElement(Switch, { checkedChildren: '支持', unCheckedChildren: '不支持' }))
                        ])
                    ])
                ]),
                React.createElement(Form.Item, {
                    key: 'actions',
                    style: { marginTop: '16px', textAlign: 'right' }
                }, React.createElement(Space, {}, [
                    React.createElement(Button, { key: 'cancel', onClick: () => setPermissionModalVisible(false) }, '取消'),
                    React.createElement(Button, { key: 'submit', type: 'primary', htmlType: 'submit' }, '保存')
                ]))
            ])
        ]);
    };

    // 渲染模板应用模态框
    const renderTemplateModal = () => {
        return React.createElement(Modal, {
            title: `应用权限模板 - ${selectedColumn?.title}`,
            visible: templateModalVisible,
            onCancel: () => setTemplateModalVisible(false),
            footer: null
        }, [
            React.createElement(Alert, {
                message: '权限模板说明',
                description: '选择要应用的权限模板，系统将自动配置相应的权限设置。',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '16px' }
            }),
            React.createElement(Collapse, {}, 
                Object.entries(permissionTemplates).map(([name, template]) => 
                    React.createElement(Collapse.Panel, {
                        key: name,
                        header: React.createElement('div', {
                            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
                        }, [
                            React.createElement('span', { key: 'name' }, template.name),
                            React.createElement(Button, {
                                key: 'apply',
                                size: 'small',
                                type: 'primary',
                                onClick: () => handleApplyTemplateConfirm(name)
                            }, '应用')
                        ]),
                        extra: React.createElement(Tag, { color: template.type === 'public' ? 'green' : 'blue' }, template.type === 'public' ? '公开' : '私有')
                    }, React.createElement('div', {}, [
                        React.createElement('p', { key: 'desc' }, template.description),
                        React.createElement('div', { key: 'details' }, [
                            React.createElement('div', { key: 'publish' }, `发布权限: ${template.publishRoles?.join(', ') || '无'}`),
                            React.createElement('div', { key: 'review' }, `审核权限: ${template.reviewRoles?.join(', ') || '无'}`),
                            React.createElement('div', { key: 'settings' }, `发布设置: ${template.requiresReview ? '需审核' : '无需审核'}`)
                        ])
                    ]))
                )
            )
        ]);
    };

    // 渲染冲突提示模态框
    const renderConflictModal = () => {
        return React.createElement(Modal, {
            title: '权限冲突检测',
            visible: conflictModalVisible,
            onCancel: () => setConflictModalVisible(false),
            footer: React.createElement(Space, {}, [
                React.createElement(Button, { key: 'cancel', onClick: () => setConflictModalVisible(false) }, '取消'),
                React.createElement(Button, { 
                    key: 'continue', 
                    type: 'primary', 
                    onClick: () => {
                        setConflictModalVisible(false);
                        handleSavePermissions(form.getFieldsValue());
                    }
                }, '继续保存')
            ])
        }, [
            React.createElement(Alert, {
                message: '检测到权限配置冲突',
                description: '以下权限配置可能存在冲突，请检查后确认是否继续保存。',
                type: 'warning',
                showIcon: true,
                style: { marginBottom: '16px' }
            }),
            React.createElement(Collapse, {}, 
                permissionConflicts.map((conflict, index) => 
                    React.createElement(Collapse.Panel, {
                        key: index,
                        header: conflict.type,
                        extra: React.createElement(Tag, { color: 'red' }, '冲突')
                    }, conflict.description)
                )
            )
        ]);
    };

    // 渲染历史记录抽屉
    const renderHistoryDrawer = () => {
        return React.createElement(Drawer, {
            title: `权限变更历史 - ${selectedColumn?.title}`,
            visible: historyDrawerVisible,
            onClose: () => setHistoryDrawerVisible(false),
            width: 600
        }, [
            React.createElement(Timeline, {}, 
                permissionHistory.map((record, index) => 
                    React.createElement(Timeline.Item, {
                        key: index,
                        color: record.type === 'add' ? 'green' : record.type === 'update' ? 'blue' : 'red'
                    }, [
                        React.createElement('div', { key: 'time', style: { fontWeight: 'bold' } }, record.time),
                        React.createElement('div', { key: 'operator' }, `操作人: ${record.operator}`),
                        React.createElement('div', { key: 'action' }, `操作: ${record.action}`),
                        React.createElement('div', { key: 'details' }, `详情: ${record.details}`)
                    ])
                )
            )
        ]);
    };

    const tabItems = [
        { key: 'overview', label: '📊 权限概览', children: renderPermissionOverview() },
        { key: 'management', label: '⚙️ 权限管理', children: React.createElement('div', {}, [
            React.createElement(Row, { key: 'header', style: { marginBottom: '16px' } }, [
                React.createElement(Col, { key: 'title', span: 12 }, 
                    React.createElement('h3', { style: { margin: 0 } }, '栏目权限列表')
                ),
                React.createElement(Col, { key: 'actions', span: 12, style: { textAlign: 'right' } }, 
                    React.createElement(Space, {}, [
                        React.createElement(Button, {
                            key: 'batch',
                            onClick: () => setTemplateModalVisible(true)
                        }, '批量应用模板'),
                        React.createElement(Button, {
                            key: 'refresh',
                            onClick: () => {
                                loadPermissionManager();
                                loadColumns();
                            }
                        }, '刷新')
                    ])
                )
            ]),
            renderPermissionTable()
        ]) }
    ];

    return React.createElement('div', { className: 'column-permission-management-page' }, [
        // 页面头部
        React.createElement(Row, { key: 'header', style: { marginBottom: '24px' } }, [
            React.createElement(Col, { key: 'title', span: 12 }, 
                React.createElement('h1', { style: { margin: 0, fontSize: '24px', fontWeight: 'bold' } }, '栏目权限管理')
            ),
            React.createElement(Col, { key: 'actions', span: 12, style: { textAlign: 'right' } }, 
                React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'templates',
                        onClick: () => setTemplateModalVisible(true)
                    }, '权限模板'),
                    React.createElement(Button, {
                        key: 'conflicts',
                        onClick: () => {
                            const conflicts = permissionManager?.checkPermissionConflicts(currentPermissions) || [];
                            setPermissionConflicts(conflicts);
                            setConflictModalVisible(true);
                        }
                    }, '冲突检测'),
                    React.createElement(Button, {
                        key: 'export',
                        type: 'primary'
                    }, '导出配置')
                ])
            )
        ]),

        // 主要内容区域
        React.createElement(Card, { key: 'main' }, [
            React.createElement(Tabs, {
                items: tabItems,
                defaultActiveKey: 'overview'
            })
        ]),

        // 模态框和抽屉
        renderPermissionModal(),
        renderTemplateModal(),
        renderConflictModal(),
        renderHistoryDrawer()
    ]);
};

window.App.pages.ColumnPermissionManagement = ColumnPermissionManagement;
console.log('[ColumnPermissionManagement] 栏目权限管理组件挂载成功');
