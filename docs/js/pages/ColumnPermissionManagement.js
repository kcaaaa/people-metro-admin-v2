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
                    status: 'enabled',
                    contentCount: 156,
                    children: [
                        { key: 'about-profile', title: '协会简介', code: 'about-profile', level: 2, contentCount: 45 },
                        { key: 'about-articles', title: '协会章程', code: 'about-articles', level: 2, contentCount: 23 },
                        { key: 'about-party', title: '党建园地', code: 'about-party', level: 2, contentCount: 34 },
                        { key: 'about-documents', title: '4+N 纲领性文件', code: 'about-documents', level: 2, contentCount: 28 },
                        { key: 'about-activities', title: '品牌活动', code: 'about-activities', level: 2, contentCount: 26 }
                    ]
                },
                {
                    key: 'information',
                    title: '资讯',
                    code: 'information',
                    level: 1,
                    status: 'enabled',
                    contentCount: 234,
                    children: [
                        { key: 'info-industry', title: '行业资讯', code: 'info-industry', level: 2, contentCount: 156 },
                        { key: 'info-association', title: '协会信息', code: 'info-association', level: 2, contentCount: 78 }
                    ]
                },
                {
                    key: 'services',
                    title: '服务',
                    code: 'services',
                    level: 1,
                    status: 'enabled',
                    contentCount: 189,
                    children: [
                        { key: 'service-member', title: '会员服务', code: 'service-member', level: 2, contentCount: 67 },
                        { key: 'service-statistics', title: '统计', code: 'service-statistics', level: 2, contentCount: 45 },
                        { key: 'service-standards', title: '标准', code: 'service-standards', level: 2, contentCount: 38 },
                        { key: 'service-training', title: '人才培养', code: 'service-training', level: 2, contentCount: 29 },
                        { key: 'service-review', title: '评审', code: 'service-review', level: 2, contentCount: 10 },
                        { key: 'service-policy', title: '政策汇编', code: 'service-policy', level: 2, contentCount: 0 }
                    ]
                },
                {
                    key: 'columns',
                    title: '专栏',
                    code: 'columns',
                    level: 1,
                    status: 'enabled',
                    contentCount: 312,
                    children: [
                        { key: 'column-history', title: '口述历史', code: 'column-history', level: 2, contentCount: 89 },
                        { key: 'column-decrypt', title: '解密', code: 'column-decrypt', level: 2, contentCount: 67 },
                        { key: 'column-figures', title: '人物', code: 'column-figures', level: 2, contentCount: 78 },
                        { key: 'column-science', title: '城轨科普', code: 'column-science', level: 2, contentCount: 56 },
                        { key: 'column-beauty', title: '地铁之美', code: 'column-beauty', level: 2, contentCount: 22 }
                    ]
                }
            ];

            setColumns(mockColumns);
            setLoading(false);
        }, 800);
    };

    // 渲染栏目权限概览
    const renderPermissionOverview = () => {
        if (!permissionManager) return null;

        const allColumns = permissionManager.getAllColumnKeys();
        const totalColumns = allColumns.length;
        let strictColumns = 0;
        let moderateColumns = 0;
        let looseColumns = 0;

        allColumns.forEach(columnKey => {
            const permissions = permissionManager.getColumnPermissions(columnKey);
            if (permissions.requireReview && !permissions.autoPublish) {
                strictColumns++;
            } else if (permissions.requireReview && permissions.autoPublish) {
                moderateColumns++;
            } else {
                looseColumns++;
            }
        });

        return React.createElement(Row, {
            key: 'overview',
            gutter: [24, 24],
            style: { marginBottom: '24px' }
        }, [
            React.createElement(Col, { key: 'total', span: 6 }, React.createElement(Card, {
                size: 'small'
            }, [
                React.createElement(Statistic, {
                    key: 'stat',
                    title: '总栏目数',
                    value: totalColumns,
                    valueStyle: { color: '#1890ff' }
                })
            ])),
            React.createElement(Col, { key: 'strict', span: 6 }, React.createElement(Card, {
                size: 'small'
            }, [
                React.createElement(Statistic, {
                    key: 'stat',
                    title: '严格审核',
                    value: strictColumns,
                    valueStyle: { color: '#f5222d' }
                })
            ])),
            React.createElement(Col, { key: 'moderate', span: 6 }, React.createElement(Card, {
                size: 'small'
            }, [
                React.createElement(Statistic, {
                    key: 'stat',
                    title: '适中模式',
                    value: moderateColumns,
                    valueStyle: { color: '#fa8c16' }
                })
            ])),
            React.createElement(Col, { key: 'loose', span: 6 }, React.createElement(Card, {
                size: 'small'
            }, [
                React.createElement(Statistic, {
                    key: 'stat',
                    title: '宽松模式',
                    value: looseColumns,
                    valueStyle: { color: '#52c41a' }
                })
            ]))
        ]);
    };

    // 渲染栏目权限表格
    const renderPermissionTable = () => {
        const columns = [
            {
                title: '栏目信息',
                key: 'columnInfo',
                render: (_, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'title',
                        style: { fontWeight: 'bold' }
                    }, record.title),
                    React.createElement('div', {
                        key: 'code',
                        style: { fontSize: '12px', color: '#666' }
                    }, `代码: ${record.code}`),
                    React.createElement('div', {
                        key: 'level',
                        style: { fontSize: '12px', color: '#999' }
                    }, record.level === 1 ? '主栏目' : '子栏目')
                ])
            },
            {
                title: '发布权限',
                key: 'publishPermissions',
                render: (_, record) => {
                    if (!permissionManager) return '-';
                    const permissions = permissionManager.getColumnPermissions(record.key);
                    return React.createElement('div', {}, [
                        React.createElement('div', {
                            key: 'roles',
                            style: { marginBottom: '4px' }
                        }, permissions.publishRoles.map(role => 
                            React.createElement(Tag, {
                                key: role,
                                size: 'small',
                                color: 'blue'
                            }, role)
                        )),
                        permissions.publishUsers.length > 0 && React.createElement('div', {
                            key: 'users',
                            style: { fontSize: '12px', color: '#666' }
                        }, `特定用户: ${permissions.publishUsers.length}人`)
                    ]);
                }
            },
            {
                title: '审核权限',
                key: 'reviewPermissions',
                render: (_, record) => {
                    if (!permissionManager) return '-';
                    const permissions = permissionManager.getColumnPermissions(record.key);
                    return React.createElement('div', {}, [
                        React.createElement('div', {
                            key: 'roles',
                            style: { marginBottom: '4px' }
                        }, permissions.reviewRoles.map(role => 
                            React.createElement(Tag, {
                                key: role,
                                size: 'small',
                                color: 'green'
                            }, role)
                        )),
                        permissions.reviewUsers.length > 0 && React.createElement('div', {
                            key: 'users',
                            style: { fontSize: '12px', color: '#666' }
                        }, `特定用户: ${permissions.reviewUsers.length}人`)
                    ]);
                }
            },
            {
                title: '发布设置',
                key: 'publishSettings',
                render: (_, record) => {
                    if (!permissionManager) return '-';
                    const permissions = permissionManager.getColumnPermissions(record.key);
                    return React.createElement('div', {}, [
                        React.createElement('div', {
                            key: 'auto-publish',
                            style: { marginBottom: '4px' }
                        }, React.createElement(Tag, {
                            color: permissions.autoPublish ? 'green' : 'red',
                            size: 'small'
                        }, permissions.autoPublish ? '自动发布' : '手动发布')),
                        React.createElement('div', {
                            key: 'require-review',
                            style: { fontSize: '12px', color: '#666' }
                        }, React.createElement(Tag, {
                            color: permissions.requireReview ? 'orange' : 'blue',
                            size: 'small'
                        }, permissions.requireReview ? '需要审核' : '无需审核'))
                    ]);
                }
            },
            {
                title: '内容统计',
                key: 'contentStats',
                render: (_, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'count',
                        style: { fontWeight: 'bold', color: '#1890ff' }
                    }, `${record.contentCount} 篇`),
                    React.createElement('div', {
                        key: 'status',
                        style: { fontSize: '12px', color: '#666' }
                    }, React.createElement(Tag, {
                        color: record.status === 'enabled' ? 'green' : 'red',
                        size: 'small'
                    }, record.status === 'enabled' ? '启用' : '禁用'))
                ])
            },
            {
                title: '操作',
                key: 'actions',
                render: (_, record) => React.createElement(Space, { size: 'small' }, [
                    React.createElement(Button, {
                        key: 'config',
                        size: 'small',
                        type: 'primary',
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
                        type: 'link',
                        onClick: () => handleViewHistory(record)
                    }, '变更历史')
                ])
            }
        ];

        // 扁平化栏目数据
        const flatColumns = [];
        columns.forEach(column => {
            flatColumns.push(column);
            if (column.children) {
                column.children.forEach(child => {
                    flatColumns.push(child);
                });
            }
        });

        return React.createElement(Table, {
            dataSource: flatColumns,
            columns: columns,
            rowKey: 'key',
            pagination: { pageSize: 20 },
            size: 'small',
            loading: loading
        });
    };

    // 配置权限
    const handleConfigPermissions = (column) => {
        setSelectedColumn(column);
        if (permissionManager) {
            const permissions = permissionManager.getColumnPermissions(column.key);
            setCurrentPermissions(permissions);
        }
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
        if (permissionManager) {
            const history = permissionManager.getPermissionChangeHistory(column.key);
            setPermissionHistory(history);
        }
        setHistoryDrawerVisible(true);
    };

    // 保存权限配置
    const handleSavePermissions = async () => {
        try {
            const values = await form.validateFields();
            
            // 检查权限冲突
            const conflicts = permissionManager.checkPermissionConflicts(values);
            if (conflicts.length > 0) {
                setPermissionConflicts(conflicts);
                setConflictModalVisible(true);
                return;
            }

            // 保存权限配置
            permissionManager.updateColumnPermissions(selectedColumn.key, values);
            message.success('权限配置已保存');
            setPermissionModalVisible(false);
            
            // 重新加载数据
            loadColumns();
        } catch (error) {
            console.error('保存权限配置失败:', error);
        }
    };

    // 应用权限模板
    const handleApplyTemplateConfirm = (templateName) => {
        try {
            permissionManager.applyPermissionTemplate(selectedColumn.key, templateName);
            message.success(`已应用 ${permissionTemplates[templateName].name} 模板`);
            setTemplateModalVisible(false);
            
            // 重新加载数据
            loadColumns();
        } catch (error) {
            message.error(`应用模板失败: ${error.message}`);
        }
    };

    // 批量应用模板
    const handleBatchApplyTemplate = (templateName, columnKeys) => {
        const updates = columnKeys.map(columnKey => ({
            columnKey,
            permissions: permissionTemplates[templateName].config
        }));

        const results = permissionManager.batchUpdatePermissions(updates);
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        if (successCount > 0) {
            message.success(`成功应用模板到 ${successCount} 个栏目`);
        }
        if (failCount > 0) {
            message.error(`${failCount} 个栏目应用模板失败`);
        }

        // 重新加载数据
        loadColumns();
    };

    // 渲染权限配置模态框
    const renderPermissionModal = () => {
        if (!selectedColumn) return null;

        return React.createElement(Modal, {
            title: `${selectedColumn.title} - 权限配置`,
            open: permissionModalVisible,
            onCancel: () => setPermissionModalVisible(false),
            onOk: handleSavePermissions,
            width: 800,
            okText: '保存配置',
            cancelText: '取消'
        }, [
            React.createElement(Alert, {
                key: 'info',
                message: '权限配置说明',
                description: '配置当前栏目的内容发布和审核权限。支持角色级别和用户级别的权限控制。',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Form, {
                key: 'permission-form',
                form: form,
                layout: 'vertical',
                initialValues: currentPermissions
            }, [
                React.createElement(Row, { key: 'publish-section', gutter: 24 }, [
                    React.createElement(Col, { key: 'publish', span: 12 }, React.createElement(Card, {
                        title: '发布权限配置',
                        size: 'small'
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
                    ])),

                    React.createElement(Col, { key: 'review', span: 12 }, React.createElement(Card, {
                        title: '审核权限配置',
                        size: 'small'
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
                    ]))
                ]),

                React.createElement(Card, {
                    key: 'publish-settings',
                    title: '发布设置',
                    size: 'small',
                    style: { marginTop: '16px' }
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

    // 渲染模板应用模态框
    const renderTemplateModal = () => {
        if (!selectedColumn) return null;

        return React.createElement(Modal, {
            title: `${selectedColumn.title} - 应用权限模板`,
            open: templateModalVisible,
            onCancel: () => setTemplateModalVisible(false),
            footer: null,
            width: 600
        }, [
            React.createElement(Alert, {
                key: 'info',
                message: '模板应用说明',
                description: '选择权限模板快速应用到当前栏目，模板会覆盖现有的权限配置。',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Row, {
                key: 'templates',
                gutter: [16, 16]
            }, Object.keys(permissionTemplates).map(templateKey => {
                const template = permissionTemplates[templateKey];
                return React.createElement(Col, {
                    key: templateKey,
                    span: 12
                }, React.createElement(Card, {
                    size: 'small',
                    hoverable: true,
                    style: { cursor: 'pointer' },
                    onClick: () => handleApplyTemplateConfirm(templateKey)
                }, [
                    React.createElement('div', {
                        key: 'title',
                        style: { 
                            fontSize: '16px', 
                            fontWeight: 'bold', 
                            marginBottom: '8px',
                            color: '#1890ff'
                        }
                    }, template.name),
                    React.createElement('div', {
                        key: 'description',
                        style: { 
                            fontSize: '12px', 
                            color: '#666',
                            marginBottom: '16px',
                            lineHeight: '1.4'
                        }
                    }, template.description),
                    React.createElement('div', {
                        key: 'features',
                        style: { fontSize: '12px' }
                    }, [
                        React.createElement('div', {
                            key: 'auto-publish',
                            style: { marginBottom: '4px' }
                        }, `自动发布: ${template.config.autoPublish ? '是' : '否'}`),
                        React.createElement('div', {
                            key: 'require-review',
                            style: { marginBottom: '4px' }
                        }, `需要审核: ${template.config.requireReview ? '是' : '否'}`),
                        React.createElement('div', {
                            key: 'publish-roles'
                        }, `发布角色: ${template.config.publishRoles.length}个`)
                    ])
                ]));
            }))
        ]);
    };

    // 渲染权限冲突模态框
    const renderConflictModal = () => {
        return React.createElement(Modal, {
            title: '权限配置冲突检测',
            open: conflictModalVisible,
            onCancel: () => setConflictModalVisible(false),
            onOk: () => {
                setConflictModalVisible(false);
                setPermissionModalVisible(false);
            },
            okText: '我知道了',
            cancelText: '返回修改',
            width: 600
        }, [
            React.createElement(Alert, {
                key: 'warning',
                message: '检测到权限配置冲突',
                description: '以下问题可能影响权限配置的有效性，建议修改后重新保存。',
                type: 'warning',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement('div', {
                key: 'conflicts'
            }, permissionConflicts.map((conflict, index) => 
                React.createElement(Alert, {
                    key: index,
                    message: conflict.message,
                    type: conflict.severity === 'error' ? 'error' : 'warning',
                    showIcon: true,
                    style: { marginBottom: '12px' }
                })
            ))
        ]);
    };

    // 渲染历史记录抽屉
    const renderHistoryDrawer = () => {
        if (!selectedColumn) return null;

        return React.createElement(Drawer, {
            title: `${selectedColumn.title} - 权限变更历史`,
            open: historyDrawerVisible,
            onClose: () => setHistoryDrawerVisible(false),
            width: 600
        }, [
            React.createElement(Timeline, {
                key: 'history',
                items: permissionHistory.map((item, index) => ({
                    key: index,
                    children: React.createElement('div', {}, [
                        React.createElement('div', {
                            key: 'header',
                            style: { 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '8px'
                            }
                        }, [
                            React.createElement('span', {
                                key: 'operator',
                                style: { fontWeight: 'bold' }
                            }, `操作人: ${item.changedBy}`),
                            React.createElement('span', {
                                key: 'time',
                                style: { fontSize: '12px', color: '#666' }
                            }, item.changedAt)
                        ]),
                        React.createElement('div', {
                            key: 'reason',
                            style: { marginBottom: '8px', color: '#666' }
                        }, `变更原因: ${item.reason}`),
                        React.createElement(Collapse, {
                            key: 'details',
                            size: 'small',
                            items: [
                                {
                                    key: 'changes',
                                    label: '查看变更详情',
                                    children: React.createElement('div', {}, [
                                        React.createElement('div', {
                                            key: 'old',
                                            style: { marginBottom: '8px' }
                                        }, [
                                            React.createElement('div', {
                                                key: 'label',
                                                style: { fontWeight: 'bold', marginBottom: '4px' }
                                            }, '变更前:'),
                                            React.createElement('pre', {
                                                key: 'content',
                                                style: { 
                                                    fontSize: '12px', 
                                                    background: '#f5f5f5', 
                                                    padding: '8px',
                                                    borderRadius: '4px'
                                                }
                                            }, JSON.stringify(item.oldPermissions, null, 2))
                                        ]),
                                        React.createElement('div', {
                                            key: 'new'
                                        }, [
                                            React.createElement('div', {
                                                key: 'label',
                                                style: { fontWeight: 'bold', marginBottom: '4px' }
                                            }, '变更后:'),
                                            React.createElement('pre', {
                                                key: 'content',
                                                style: { 
                                                    fontSize: '12px', 
                                                    background: '#f0f9ff', 
                                                    padding: '8px',
                                                    borderRadius: '4px'
                                                }
                                            }, JSON.stringify(item.newPermissions, null, 2))
                                        ])
                                    ])
                                }
                            ]
                        })
                    ])
                }))
            })
        ]);
    };

    const tabItems = [
        {
            key: 'overview',
            label: '📊 权限概览',
            children: renderPermissionOverview()
        },
        {
            key: 'management',
            label: '⚙️ 权限管理',
            children: React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'header',
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }
                }, [
                    React.createElement('h3', {
                        key: 'title',
                        style: { margin: 0 }
                    }, '栏目权限配置'),
                    React.createElement(Space, {
                        key: 'actions'
                    }, [
                        React.createElement(Button, {
                            key: 'batch-template',
                            onClick: () => {
                                const selectedKeys = ['about', 'information']; // 这里应该从表格选择获取
                                Modal.confirm({
                                    title: '批量应用模板',
                                    content: '选择要应用的权限模板',
                                    onOk: () => handleBatchApplyTemplate('moderate', selectedKeys)
                                });
                            }
                        }, '批量应用模板'),
                        React.createElement(Button, {
                            key: 'export',
                            onClick: () => message.info('导出功能开发中...')
                        }, '导出配置')
                    ])
                ]),
                renderPermissionTable()
            ])
        }
    ];

    return React.createElement('div', { className: 'column-permission-management-page' }, [
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
            }, '栏目权限管理'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'refresh',
                    onClick: () => {
                        if (permissionManager) {
                            permissionManager.reloadPermissions();
                            loadColumns();
                            message.success('权限配置已刷新');
                        }
                    }
                }, '刷新配置'),
                React.createElement(Button, {
                    key: 'help',
                    type: 'link',
                    onClick: () => message.info('帮助文档开发中...')
                }, '帮助')
            ])
        ]),

        React.createElement(Tabs, {
            key: 'main-tabs',
            items: tabItems,
            defaultActiveKey: 'overview'
        }),

        // 权限配置模态框
        renderPermissionModal(),

        // 模板应用模态框
        renderTemplateModal(),

        // 权限冲突模态框
        renderConflictModal(),

        // 历史记录抽屉
        renderHistoryDrawer()
    ]);
};

window.App.pages.ColumnPermissionManagement = ColumnPermissionManagement;
console.log('[ColumnPermissionManagement] 栏目权限管理组件挂载成功');
