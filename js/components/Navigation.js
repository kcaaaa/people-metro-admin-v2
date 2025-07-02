// RuoYi风格导航组件
const Navigation = ({ currentPage, onPageChange, collapsed, onToggleCollapse }) => {
    const { Menu } = antd;
    
    // 菜单项配置 - 符合若依风格的图标和分组
    const menuItems = [
        {
            key: 'dashboard',
            icon: '📊',
            label: '首页',
            title: '系统首页 - 实时查看核心运营指标和待办事项',
            page: 'Dashboard'
        },
        // 内容管理分组
        {
            key: 'content-group',
            type: 'group',
            label: '内容管理',
            children: [
                {
                    key: 'content',
                    icon: '📄',
                    label: '内容管理',
                    title: '平台内容查看与管理',
                    page: 'ContentManagement'
                }
            ]
        },
        // 审核管理分组
        {
            key: 'review-group',
            type: 'group',
            label: '审核管理',
            children: [
                {
                    key: 'review',
                    icon: '🔍',
                    label: 'AI审核',
                    title: 'AI内容审核与管理',
                    page: 'ReviewManagement'
                },
                {
                    key: 'audit-flow',
                    icon: '⚙️',
                    label: '审核流程管理',
                    title: '配置和管理审核流程模板',
                    page: 'AuditFlowManagement'
                }
            ]
        },
        // 展会管理分组
        {
            key: 'exhibition-group',
            type: 'group',
            label: '展会管理',
            children: [
                {
                    key: 'booth',
                    icon: '🏢',
                    label: '展位管理',
                    title: '展会展位信息管理',
                    page: 'BoothManagement'
                },
                {
                    key: 'live',
                    icon: '📺',
                    label: '论坛直播',
                    title: '论坛直播内容管理',
                    page: 'LiveManagement'
                }
            ]
        },
        // 运营统计分组
        {
            key: 'operation-stats-group',
            type: 'group',
            label: '运营统计',
            children: [
                {
                    key: 'stats',
                    icon: '📈',
                    label: '行为统计',
                    title: '用户行为数据统计',
                    page: 'BehaviorStats'
                },
                {
                    key: 'operational',
                    icon: '📊',
                    label: '运营数据统计',
                    title: '核心运营指标与分模块统计',
                    page: 'OperationalStats'
                },
                {
                    key: 'data',
                    icon: '💾',
                    label: '运营数据管理',
                    title: '运营数据资源监控与管理',
                    page: 'DataManagement'
                },
                {
                    key: 'feedback',
                    icon: '💭',
                    label: '用户反馈管理',
                    title: '处理用户反馈和建议',
                    page: 'FeedbackManagement'
                },
                {
                    key: 'message',
                    icon: '💬',
                    label: '消息管理',
                    title: 'APP系统消息推送管理',
                    page: 'MessageManagement'
                }
            ]
        },
        // 系统管理分组
        {
            key: 'system-group',
            type: 'group',
            label: '系统管理',
            children: [
                {
                    key: 'user',
                    icon: '👥',
                    label: '用户管理',
                    title: '用户信息查询与管理',
                    page: 'UserManagement'
                },
                {
                    key: 'admin',
                    icon: '👨‍💼',
                    label: '管理员与权限',
                    title: '管理员账号和权限管理',
                    page: 'AdminManagement'
                },
                {
                    key: 'logs',
                    icon: '📋',
                    label: '日志管理',
                    title: '等保三级合规日志管理',
                    page: 'LogManagement'
                },
                {
                    key: 'settings',
                    icon: '⚙️',
                    label: '系统设置',
                    title: '系统配置与管理',
                    page: 'SystemSettings'
                },
                {
                    key: 'version',
                    icon: '📱',
                    label: 'APP版本管理',
                    title: 'APP版本发布和更新管理',
                    page: 'VersionManagement'
                },
                {
                    key: 'traffic',
                    icon: '🎯',
                    label: '流量分配',
                    title: '推荐算法与流量分配配置',
                    page: 'TrafficAllocation'
                }
            ]
        }
    ];

    // 递归渲染菜单项
    const renderMenuItem = (item) => {
        if (item.type === 'group') {
            // 分组标题（仅在展开状态显示）
            if (collapsed) {
                return item.children.map(child => renderMenuItem(child));
            }
            
            return [
                // 分组分隔线和标题
                React.createElement('div', {
                    key: `${item.key}-divider`,
                    style: {
                        height: '1px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        margin: '12px 16px',
                        marginTop: '20px'
                    }
                }),
                React.createElement('div', {
                    key: `${item.key}-title`,
                    style: {
                        color: 'rgba(255, 255, 255, 0.45)',
                        fontSize: '12px',
                        fontWeight: '500',
                        padding: '8px 16px 8px 16px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        lineHeight: '1.5'
                    }
                }, item.label),
                // 分组菜单项
                ...item.children.map(child => renderMenuItem(child))
            ];
        }
        
        return React.createElement(Menu.Item, {
            key: item.key,
            title: item.title,
            style: {
                display: 'flex',
                alignItems: 'center'
            }
        }, [
            React.createElement('span', {
                key: 'icon',
                className: 'nav-icon',
                style: {
                    fontSize: '16px',
                    width: '20px',
                    marginRight: collapsed ? 0 : '12px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                }
            }, item.icon),
            !collapsed && React.createElement('span', {
                key: 'label',
                style: {
                    fontSize: '14px',
                    fontWeight: '400'
                }
            }, item.label)
        ]);
    };

    // 获取扁平化的菜单项（用于选中状态）
    const getFlatMenuItems = (items) => {
        let flatItems = [];
        items.forEach(item => {
            if (item.type === 'group') {
                flatItems = flatItems.concat(item.children);
            } else {
                flatItems.push(item);
            }
        });
        return flatItems;
    };

    const flatMenuItems = getFlatMenuItems(menuItems);

    return React.createElement('div', {
        className: `main-nav ${collapsed ? 'collapsed' : ''}`,
        style: {
            width: collapsed ? '64px' : '260px',
            transition: 'all 0.2s ease'
        }
    }, [
        // 导航头部 - Logo区域
        React.createElement('div', {
            key: 'header',
            className: 'nav-header',
            style: {
                height: '50px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: collapsed ? '0' : '0 16px',
                position: 'relative'
            }
        }, [
            // Logo和标题
            React.createElement('div', {
                key: 'logo',
                className: 'nav-logo',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                },
                onClick: () => onPageChange('dashboard')
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'logo-icon',
                    style: {
                        fontSize: '20px',
                        marginRight: collapsed ? 0 : '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        background: 'var(--ruoyi-primary)',
                        borderRadius: '4px',
                        transition: 'all 0.3s ease'
                    }
                }, '🚇'),
                !collapsed && React.createElement('span', {
                    key: 'text',
                    className: 'logo-text',
                    style: {
                        fontSize: '16px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                    }
                }, '人民城轨2.0')
            ]),
            
            // 折叠按钮（展开状态）
            !collapsed && React.createElement('button', {
                key: 'toggle',
                className: 'nav-toggle',
                onClick: onToggleCollapse,
                style: {
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.65)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '2px',
                    fontSize: '12px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                title: '收起菜单',
                onMouseEnter: (e) => {
                    e.target.style.color = '#FFFFFF';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                },
                onMouseLeave: (e) => {
                    e.target.style.color = 'rgba(255, 255, 255, 0.65)';
                    e.target.style.background = 'none';
                }
            }, '◀')
        ]),
        
        // 展开按钮（折叠状态）
        collapsed && React.createElement('div', {
            key: 'expand-btn',
            style: {
                padding: '8px',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }
        }, React.createElement('button', {
            className: 'nav-toggle',
            onClick: onToggleCollapse,
            style: {
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.65)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '2px',
                fontSize: '12px',
                transition: 'all 0.2s ease'
            },
            title: '展开菜单',
            onMouseEnter: (e) => {
                e.target.style.color = '#FFFFFF';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            },
            onMouseLeave: (e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.65)';
                e.target.style.background = 'none';
            }
        }, '▶')),
        
        // 菜单容器
        React.createElement('div', {
            key: 'menu-container',
            style: {
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingTop: '8px',
                paddingBottom: '16px'
            }
        }, [
            // 渲染菜单
            React.createElement(Menu, {
                key: 'menu',
                mode: 'inline',
                selectedKeys: [currentPage],
                style: { 
                    background: 'transparent',
                    border: 'none',
                    flex: 1
                },
                inlineCollapsed: collapsed,
                onClick: ({ key }) => {
                    console.log('Navigation clicked:', key);
                    const clickedItem = flatMenuItems.find(item => item.key === key);
                    if (clickedItem) {
                        onPageChange(key);
                    }
                }
            }, menuItems.map(renderMenuItem).flat()),
            
            // 底部版本信息（仅展开状态显示）
            !collapsed && React.createElement('div', {
                key: 'version-info',
                style: {
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.45)',
                    fontSize: '11px',
                    lineHeight: '1.4',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '12px'
                }
            }, [
                React.createElement('div', {
                    key: 'version',
                    style: { marginBottom: '4px' }
                }, 'Version 2.2'),
                React.createElement('div', {
                    key: 'copyright'
                }, '© 2024 人民城轨')
            ])
        ])
    ]);
};

window.Navigation = Navigation; 