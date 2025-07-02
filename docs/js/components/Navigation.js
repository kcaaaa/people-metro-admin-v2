// 简洁白色系统导航组件
const Navigation = ({ currentPage, onPageChange, collapsed, onToggleCollapse }) => {
    const { Menu } = antd;
    const { SubMenu } = Menu;
    
    // 菜单项配置
    const menuItems = [
        {
            key: 'dashboard',
            icon: '📊',
            label: '首页',
            title: '系统首页 - 实时查看核心运营指标和待办事项',
            page: 'Dashboard'
        },
        {
            key: 'content-management',
            icon: '📄',
            label: '内容管理',
            title: '内容管理模块',
            children: [
                {
                    key: 'content',
                    icon: '📄',
                    label: '内容管理',
                    title: '平台内容查看与管理',
                    page: 'ContentManagement'
                },
                {
                    key: 'complaint',
                    icon: '⚠️',
                    label: '投诉管理',
                    title: '用户投诉视频管理与处理',
                    page: 'ComplaintManagement'
                }
            ]
        },
        {
            key: 'audit-management',
            icon: '🔍',
            label: '审核管理',
            title: '审核管理模块',
            children: [
                {
                    key: 'review',
                    icon: '🔍',
                    label: 'AI审核',
                    title: 'AI内容审核与管理',
                    page: 'ReviewManagement'
                },
                {
                    key: 'exhibition-audit',
                    icon: '🏢',
                    label: '展会内容审核',
                    title: '展会板块内容专项审核管理',
                    page: 'ExhibitionAuditManagement'
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
        {
            key: 'exhibition-management',
            icon: '🏢',
            label: '展会管理',
            title: '展会管理模块',
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
        {
            key: 'operation-statistics',
            icon: '📊',
            label: '运营统计',
            title: '运营统计模块',
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
        {
            key: 'system-management',
            icon: '⚙️',
            label: '系统管理',
            title: '系统管理模块',
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
        if (item.children && item.children.length > 0) {
            return React.createElement(SubMenu, {
                key: item.key,
                title: React.createElement('span', {
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
                            textAlign: 'center'
                        }
                    }, item.icon),
                    !collapsed && React.createElement('span', {
                        key: 'label',
                        style: {
                            fontSize: '14px',
                            fontWeight: '400'
                        }
                    }, item.label)
                ])
            }, item.children.map(child => renderMenuItem(child)));
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
                    textAlign: 'center'
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

    // 获取扁平化的菜单项
    const getFlatMenuItems = (items) => {
        let flatItems = [];
        items.forEach(item => {
            if (item.children && item.children.length > 0) {
                flatItems = flatItems.concat(item.children);
            } else {
                flatItems.push(item);
            }
        });
        return flatItems;
    };

    const flatMenuItems = getFlatMenuItems(menuItems);

    // 根据当前页面获取默认展开的SubMenu
    const getDefaultOpenKeys = () => {
        const currentItem = flatMenuItems.find(item => item.key === currentPage);
        if (currentItem) {
            for (let menu of menuItems) {
                if (menu.children && menu.children.some(child => child.key === currentPage)) {
                    return [menu.key];
                }
            }
        }
        return [];
    };

    return React.createElement('div', {
        className: `main-nav ${collapsed ? 'collapsed' : ''}`,
        style: {
            width: collapsed ? '64px' : '260px',
            transition: 'all 0.2s ease',
            background: '#f8f9fa',
            minHeight: '100vh',
            borderRight: '1px solid #e8e8e8'
        }
    }, [
        // 导航头部
        React.createElement('div', {
            key: 'header',
            className: 'nav-header',
            style: {
                height: '60px',
                background: '#ffffff',
                borderBottom: '1px solid #e8e8e8',
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
                    color: '#333333',
                    fontSize: '18px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                },
                onClick: () => onPageChange('dashboard'),
                onMouseEnter: (e) => {
                    e.currentTarget.style.color = '#1890ff';
                },
                onMouseLeave: (e) => {
                    e.currentTarget.style.color = '#333333';
                }
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'logo-icon',
                    style: {
                        fontSize: '24px',
                        marginRight: collapsed ? 0 : '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        background: '#1890ff',
                        borderRadius: '6px',
                        transition: 'all 0.3s ease'
                    }
                }, '🚇'),
                !collapsed && React.createElement('span', {
                    key: 'text',
                    className: 'logo-text',
                    style: {
                        fontSize: '18px',
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
                    background: '#f5f5f5',
                    border: '1px solid #e8e8e8',
                    color: '#666666',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    transition: 'all 0.2s ease'
                },
                title: '收起菜单',
                onMouseEnter: (e) => {
                    e.target.style.color = '#1890ff';
                    e.target.style.borderColor = '#1890ff';
                    e.target.style.background = '#e6f7ff';
                },
                onMouseLeave: (e) => {
                    e.target.style.color = '#666666';
                    e.target.style.borderColor = '#e8e8e8';
                    e.target.style.background = '#f5f5f5';
                }
            }, '◀')
        ]),
        
        // 展开按钮（折叠状态）
        collapsed && React.createElement('div', {
            key: 'expand-btn',
            style: {
                padding: '8px',
                textAlign: 'center',
                borderBottom: '1px solid #e8e8e8'
            }
        }, React.createElement('button', {
            className: 'nav-toggle',
            onClick: onToggleCollapse,
            style: {
                background: '#f5f5f5',
                border: '1px solid #e8e8e8',
                color: '#666666',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '4px',
                fontSize: '12px',
                transition: 'all 0.2s ease'
            },
            title: '展开菜单',
            onMouseEnter: (e) => {
                e.target.style.color = '#1890ff';
                e.target.style.borderColor = '#1890ff';
                e.target.style.background = '#e6f7ff';
            },
            onMouseLeave: (e) => {
                e.target.style.color = '#666666';
                e.target.style.borderColor = '#e8e8e8';
                e.target.style.background = '#f5f5f5';
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
                theme: 'light',
                selectedKeys: [currentPage],
                defaultOpenKeys: getDefaultOpenKeys(),
                style: { 
                    background: 'transparent',
                    border: 'none',
                    flex: 1,
                    color: '#333333'
                },
                inlineCollapsed: collapsed,
                onClick: ({ key }) => {
                    console.log('Navigation clicked:', key);
                    const clickedItem = flatMenuItems.find(item => item.key === key);
                    if (clickedItem) {
                        onPageChange(key);
                    }
                }
            }, menuItems.map(renderMenuItem)),
            
            // 底部版本信息（仅展开状态显示）
            !collapsed && React.createElement('div', {
                key: 'version-info',
                style: {
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    textAlign: 'center',
                    color: '#999999',
                    fontSize: '11px',
                    lineHeight: '1.4',
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: '12px',
                    background: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #f0f0f0'
                }
            }, [
                React.createElement('div', {
                    key: 'version',
                    style: { marginBottom: '4px', fontWeight: '500', color: '#666666' }
                }, 'Version 2.2'),
                React.createElement('div', {
                    key: 'copyright'
                }, '© 2024 人民城轨')
            ])
        ])
    ]);
};

window.Navigation = Navigation; 