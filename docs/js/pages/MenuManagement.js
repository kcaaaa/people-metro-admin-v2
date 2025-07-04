// 菜单管理页面 - 动态控制导航菜单显隐
const MenuManagement = () => {
    console.log('MenuManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Switch, Tree, Divider, Statistic, Tooltip, Collapse } = antd;
    const { Panel } = Collapse;
    
    // 默认菜单配置
    const defaultMenuConfig = {
        'dashboard': { enabled: true, label: '首页', level: 1 },
        'content-management': { enabled: true, label: '内容管理', level: 1 },
        'content': { enabled: true, label: '内容管理', level: 2, parent: 'content-management' },
        'complaint': { enabled: true, label: '投诉管理', level: 2, parent: 'content-management' },
        'content-tags': { enabled: true, label: '内容标签', level: 2, parent: 'content-management' },
        'audit-management': { enabled: true, label: '审核管理', level: 1 },
        'review': { enabled: true, label: 'AI审核', level: 2, parent: 'audit-management' },
        'audit-flow': { enabled: true, label: '审核流程管理', level: 2, parent: 'audit-management' },
        'exhibition-management': { enabled: true, label: '展会管理', level: 1 },
        'booth': { enabled: true, label: '展位管理', level: 2, parent: 'exhibition-management' },
        'exhibitor': { enabled: true, label: '展商管理', level: 2, parent: 'exhibition-management' },
        'exhibitor-maintenance': { enabled: true, label: '展商维护', level: 2, parent: 'exhibition-management' },
        'live': { enabled: true, label: '论坛直播', level: 2, parent: 'exhibition-management' },
        'operation-statistics': { enabled: true, label: '运营管理', level: 1 },
        'stats': { enabled: true, label: '行为统计', level: 2, parent: 'operation-statistics' },
        'operational': { enabled: true, label: '运营数据统计', level: 2, parent: 'operation-statistics' },
        'live-stats': { enabled: true, label: '直播数据管理', level: 2, parent: 'operation-statistics' },
        'data': { enabled: true, label: '运营数据管理', level: 2, parent: 'operation-statistics' },
        'feedback': { enabled: true, label: '用户反馈管理', level: 2, parent: 'operation-statistics' },
        'message': { enabled: true, label: '消息管理', level: 2, parent: 'operation-statistics' },
        'system-management': { enabled: true, label: '系统管理', level: 1 },
        'user': { enabled: true, label: '用户管理', level: 2, parent: 'system-management' },
        'admin': { enabled: true, label: '权限管理', level: 2, parent: 'system-management' },
        'logs': { enabled: true, label: '日志管理', level: 2, parent: 'system-management' },
        'settings': { enabled: true, label: '系统设置', level: 2, parent: 'system-management' },
        'version': { enabled: true, label: 'APP版本管理', level: 2, parent: 'system-management' },
        'traffic': { enabled: true, label: '流量分配', level: 2, parent: 'system-management' },
        'menu': { enabled: true, label: '菜单管理', level: 2, parent: 'system-management' }
    };

    // 状态管理
    const [menuConfig, setMenuConfig] = React.useState(() => {
        const saved = localStorage.getItem('menuConfig');
        return saved ? JSON.parse(saved) : defaultMenuConfig;
    });
    const [loading, setLoading] = React.useState(false);
    const [expandedKeys, setExpandedKeys] = React.useState(['system-management', 'content-management', 'audit-management', 'exhibition-management', 'operation-statistics']);
    const [previewMode, setPreviewMode] = React.useState(false);

    // 保存配置到本地存储
    const saveMenuConfig = (config) => {
        localStorage.setItem('menuConfig', JSON.stringify(config));
        setMenuConfig(config);
        
        // 触发导航菜单更新
        window.dispatchEvent(new Event('menuConfigChanged'));
        message.success('菜单配置已保存');
    };

    // 切换菜单项状态
    const toggleMenuItem = (menuKey, enabled) => {
        const newConfig = { ...menuConfig };
        newConfig[menuKey].enabled = enabled;
        
        // 如果是一级菜单被禁用，禁用所有子菜单
        if (!enabled && newConfig[menuKey].level === 1) {
            Object.keys(newConfig).forEach(key => {
                if (newConfig[key].parent === menuKey) {
                    newConfig[key].enabled = false;
                }
            });
        }
        
        // 如果是二级菜单被启用，确保父菜单也启用
        if (enabled && newConfig[menuKey].level === 2) {
            const parentKey = newConfig[menuKey].parent;
            if (parentKey && !newConfig[parentKey].enabled) {
                newConfig[parentKey].enabled = true;
            }
        }
        
        saveMenuConfig(newConfig);
    };

    // 批量操作
    const batchToggle = (action) => {
        const newConfig = { ...menuConfig };
        
        Object.keys(newConfig).forEach(key => {
            if (action === 'enableAll') {
                newConfig[key].enabled = true;
            } else if (action === 'disableAll') {
                newConfig[key].enabled = false;
            } else if (action === 'enableLevel1') {
                if (newConfig[key].level === 1) {
                    newConfig[key].enabled = true;
                }
            } else if (action === 'enableLevel2') {
                if (newConfig[key].level === 2) {
                    newConfig[key].enabled = true;
                    // 确保父菜单也启用
                    const parentKey = newConfig[key].parent;
                    if (parentKey) {
                        newConfig[parentKey].enabled = true;
                    }
                }
            }
        });
        
        saveMenuConfig(newConfig);
    };

    // 重置为默认配置
    const resetToDefault = () => {
        Modal.confirm({
            title: '确认重置',
            content: '确定要重置为默认菜单配置吗？这将清除所有自定义设置。',
            okText: '确认重置',
            cancelText: '取消',
            okType: 'danger',
            onOk() {
                saveMenuConfig(defaultMenuConfig);
                message.success('已重置为默认菜单配置');
            }
        });
    };

    // 构建树形数据
    const buildTreeData = () => {
        const level1Items = Object.keys(menuConfig).filter(key => menuConfig[key].level === 1);
        
        return level1Items.map(key => {
            const item = menuConfig[key];
            const children = Object.keys(menuConfig)
                .filter(childKey => menuConfig[childKey].parent === key)
                .map(childKey => ({
                    title: React.createElement('div', {
                        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }
                    }, [
                        React.createElement('span', { 
                            key: 'label',
                            style: { 
                                color: menuConfig[childKey].enabled ? '#333' : '#999',
                                textDecoration: menuConfig[childKey].enabled ? 'none' : 'line-through'
                            }
                        }, `📄 ${menuConfig[childKey].label}`),
                        React.createElement(Switch, {
                            key: 'switch',
                            size: 'small',
                            checked: menuConfig[childKey].enabled,
                            onChange: (checked) => toggleMenuItem(childKey, checked)
                        })
                    ]),
                    key: childKey,
                    isLeaf: true
                }));

            return {
                title: React.createElement('div', {
                    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }
                }, [
                    React.createElement('span', { 
                        key: 'label',
                        style: { 
                            fontWeight: '500',
                            color: item.enabled ? '#333' : '#999',
                            textDecoration: item.enabled ? 'none' : 'line-through'
                        }
                    }, `📁 ${item.label}`),
                    React.createElement(Switch, {
                        key: 'switch',
                        checked: item.enabled,
                        onChange: (checked) => toggleMenuItem(key, checked)
                    })
                ]),
                key: key,
                children: children
            };
        });
    };

    // 统计信息
    const statistics = React.useMemo(() => {
        const total = Object.keys(menuConfig).length;
        const enabled = Object.values(menuConfig).filter(item => item.enabled).length;
        const level1Total = Object.values(menuConfig).filter(item => item.level === 1).length;
        const level1Enabled = Object.values(menuConfig).filter(item => item.level === 1 && item.enabled).length;
        const level2Total = Object.values(menuConfig).filter(item => item.level === 2).length;
        const level2Enabled = Object.values(menuConfig).filter(item => item.level === 2 && item.enabled).length;
        
        return {
            total,
            enabled,
            disabled: total - enabled,
            level1Total,
            level1Enabled,
            level2Total,
            level2Enabled
        };
    }, [menuConfig]);

    // 导入导出配置
    const exportConfig = () => {
        const configStr = JSON.stringify(menuConfig, null, 2);
        const blob = new Blob([configStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `menu-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        message.success('菜单配置已导出');
    };

    const importConfig = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const config = JSON.parse(e.target.result);
                        saveMenuConfig(config);
                        message.success('菜单配置导入成功');
                    } catch (error) {
                        message.error('配置文件格式错误');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    return React.createElement('div', {
        style: { padding: '0' }
    }, [
        // 页面标题
        React.createElement('div', {
            key: 'header',
            style: { marginBottom: '24px' }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { 
                    fontSize: '24px', 
                    fontWeight: '600', 
                    margin: '0 0 8px 0',
                    color: '#333'
                }
            }, '菜单管理'),
            React.createElement('div', {
                key: 'description',
                style: { 
                    color: '#666', 
                    fontSize: '14px'
                }
            }, '动态控制系统导航菜单的显示和隐藏，支持一级栏目和二级栏目的独立管理')
        ]),

        // 统计信息
        React.createElement(Row, {
            key: 'stats',
            gutter: 16,
            style: { marginBottom: '24px' }
        }, [
            React.createElement(Col, { key: 'total', span: 4 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '菜单总数',
                    value: statistics.total,
                    valueStyle: { color: '#1890ff' },
                    suffix: '个'
                }))
            ),
            React.createElement(Col, { key: 'enabled', span: 4 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '已启用',
                    value: statistics.enabled,
                    valueStyle: { color: '#52c41a' },
                    suffix: '个'
                }))
            ),
            React.createElement(Col, { key: 'disabled', span: 4 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '已禁用',
                    value: statistics.disabled,
                    valueStyle: { color: '#ff4d4f' },
                    suffix: '个'
                }))
            ),
            React.createElement(Col, { key: 'level1', span: 6 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '一级菜单',
                    value: `${statistics.level1Enabled}/${statistics.level1Total}`,
                    valueStyle: { color: '#722ed1' }
                }))
            ),
            React.createElement(Col, { key: 'level2', span: 6 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '二级菜单',
                    value: `${statistics.level2Enabled}/${statistics.level2Total}`,
                    valueStyle: { color: '#fa8c16' }
                }))
            )
        ]),

        // 操作面板
        React.createElement(Card, {
            key: 'actions',
            title: '批量操作',
            style: { marginBottom: '24px' }
        }, [
            React.createElement(Alert, {
                key: 'tip',
                message: '操作提示',
                description: '• 禁用一级菜单会自动禁用其下所有二级菜单\n• 启用二级菜单会自动启用其父级菜单\n• 菜单配置会实时保存到本地存储',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '16px' }
            }),
            React.createElement(Space, { key: 'buttons', wrap: true }, [
                React.createElement(Button, {
                    key: 'enableAll',
                    type: 'primary',
                    onClick: () => batchToggle('enableAll')
                }, '🔓 启用全部'),
                React.createElement(Button, {
                    key: 'disableAll',
                    danger: true,
                    onClick: () => batchToggle('disableAll')
                }, '🔒 禁用全部'),
                React.createElement(Button, {
                    key: 'enableLevel1',
                    onClick: () => batchToggle('enableLevel1')
                }, '📁 启用一级菜单'),
                React.createElement(Button, {
                    key: 'enableLevel2',
                    onClick: () => batchToggle('enableLevel2')
                }, '📄 启用二级菜单'),
                React.createElement(Divider, { 
                    key: 'divider1', 
                    type: 'vertical', 
                    style: { height: '32px' } 
                }),
                React.createElement(Button, {
                    key: 'export',
                    onClick: exportConfig
                }, '📥 导出配置'),
                React.createElement(Button, {
                    key: 'import',
                    onClick: importConfig
                }, '📤 导入配置'),
                React.createElement(Divider, { 
                    key: 'divider2', 
                    type: 'vertical', 
                    style: { height: '32px' } 
                }),
                React.createElement(Button, {
                    key: 'reset',
                    danger: true,
                    onClick: resetToDefault
                }, '🔄 重置默认')
            ])
        ]),

        // 菜单结构管理
        React.createElement(Card, {
            key: 'tree',
            title: '菜单结构配置',
            extra: React.createElement(Space, { size: 'small' }, [
                React.createElement(Tooltip, {
                    key: 'help',
                    title: '使用开关控制菜单项的显隐状态'
                }, React.createElement(Button, {
                    size: 'small',
                    shape: 'circle',
                    icon: React.createElement('span', {}, '❓')
                })),
                React.createElement(Button, {
                    key: 'expandAll',
                    size: 'small',
                    onClick: () => setExpandedKeys(Object.keys(menuConfig).filter(key => menuConfig[key].level === 1))
                }, '展开全部'),
                React.createElement(Button, {
                    key: 'collapseAll',
                    size: 'small',
                    onClick: () => setExpandedKeys([])
                }, '收起全部')
            ])
        }, React.createElement(Tree, {
            treeData: buildTreeData(),
            expandedKeys: expandedKeys,
            onExpand: setExpandedKeys,
            defaultExpandAll: false,
            style: { background: '#fafafa', padding: '16px', borderRadius: '6px' }
        })),

        // 当前配置预览
        React.createElement(Card, {
            key: 'preview',
            title: '配置预览',
            style: { marginTop: '24px' }
        }, React.createElement(Collapse, {
            ghost: true
        }, [
            React.createElement(Panel, {
                key: 'config',
                header: '查看完整配置 JSON'
            }, React.createElement('pre', {
                style: {
                    background: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    maxHeight: '300px',
                    overflow: 'auto'
                }
            }, JSON.stringify(menuConfig, null, 2)))
        ]))
    ]);
};

window.MenuManagement = MenuManagement; 