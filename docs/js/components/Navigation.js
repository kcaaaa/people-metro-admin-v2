// 导航组件
const Navigation = ({ currentPage, onPageChange, collapsed, onToggleCollapse }) => {
    const { Menu } = antd;
    
    const menuItems = [
        {
            key: 'dashboard',
            icon: '📊',
            label: '系统首页',
            title: '实时查看核心运营指标和待办事项',
            page: 'Dashboard'
        },
        {
            key: 'content',
            icon: '📄',
            label: '内容管理',
            title: '平台内容查看与管理',
            page: 'ContentManagement'
        },
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
        },
        {
            key: 'admin',
            icon: '👨‍💼',
            label: '管理员与权限',
            title: '管理员账号和权限管理',
            page: 'AdminManagement'
        },
        {
            key: 'user',
            icon: '👥',
            label: '用户管理',
            title: '用户信息查询与管理',
            page: 'UserManagement'
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
        },
        {
            key: 'version',
            icon: '📱',
            label: 'APP版本管理',
            title: 'APP版本发布和更新管理',
            page: 'VersionManagement'
        },
        {
            key: 'live',
            icon: '📺',
            label: '直播管理',
            title: '直播内容管理',
            page: 'LiveManagement'
        },
        {
            key: 'booth',
            icon: '🏢',
            label: '展位管理',
            title: '展会展位信息管理',
            page: 'BoothManagement'
        },
        {
            key: 'stats',
            icon: '📋',
            label: '行为统计',
            title: '用户行为数据统计',
            page: 'BehaviorStats'
        },
        {
            key: 'operational',
            icon: '📈',
            label: '运营数据统计',
            title: '核心运营指标与分模块统计',
            page: 'OperationalStats'
        },
        {
            key: 'data',
            icon: '💾',
            label: '运营数据管理',
            title: '系统资源监控与数据管理',
            page: 'DataManagement'
        },
        {
            key: 'traffic',
            icon: '🎯',
            label: '流量分配配置',
            title: '推荐算法与流量分配',
            page: 'TrafficAllocation'
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
        }
    ];

    const renderMenuItem = (item) => {
        return React.createElement(Menu.Item, {
            key: item.key,
            title: item.title
        }, [
            React.createElement('span', {
                key: 'icon',
                className: 'nav-icon'
            }, item.icon),
            !collapsed && React.createElement('span', {
                key: 'label'
            }, item.label)
        ]);
    };

    return React.createElement('div', {
        className: `main-nav ${collapsed ? 'collapsed' : ''}`,
        style: {
            width: collapsed ? '80px' : '240px',
            transition: 'width 0.3s'
        }
    }, [
        // 导航头部
        React.createElement('div', {
            key: 'header',
            style: {
                padding: '16px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between'
            }
        }, [
            React.createElement('div', {
                key: 'logo',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: collapsed ? '20px' : '16px',
                    fontWeight: 'bold',
                    color: '#2563eb'
                }
            }, [
                React.createElement('span', {
                    key: 'icon',
                    style: { marginRight: collapsed ? 0 : '8px' }
                }, '🚇'),
                !collapsed && React.createElement('span', {
                    key: 'text'
                }, '人民城轨2.0')
            ]),
            !collapsed && React.createElement('button', {
                key: 'toggle',
                onClick: onToggleCollapse,
                style: {
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px'
                },
                title: '收起菜单'
            }, '◀')
        ]),
        
        // 收起按钮（折叠状态）
        collapsed && React.createElement('div', {
            key: 'expand-btn',
            style: {
                padding: '8px',
                textAlign: 'center',
                borderBottom: '1px solid #e5e7eb'
            }
        }, React.createElement('button', {
            onClick: onToggleCollapse,
            style: {
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px'
            },
            title: '展开菜单'
        }, '▶')),
        
        // 菜单项
        React.createElement(Menu, {
            key: 'menu',
            mode: 'inline',
            selectedKeys: [currentPage],
            style: { 
                border: 'none',
                flex: 1
            },
            inlineCollapsed: collapsed,
            onClick: ({ key }) => {
                console.log('Navigation clicked:', key);
                onPageChange(key);
            }
        }, menuItems.map(renderMenuItem))
    ]);
};

window.Navigation = Navigation; 