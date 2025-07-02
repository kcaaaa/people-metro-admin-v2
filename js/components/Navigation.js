// RuoYi风格导航组件 - 分级菜单版本
const Navigation = ({ currentPage, onPageChange, collapsed, onToggleCollapse }) => {
    const { Menu } = antd;
    const { SubMenu } = Menu;
    
    // 菜单项配置 - 真正的分级结构
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
        // 如果有子菜单，渲染SubMenu
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
                ])
            }, item.children.map(child => renderMenuItem(child)));
        }
        
        // 普通菜单项
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
            // 查找包含当前页面的父菜单
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
            background: 'linear-gradient(180deg, #304156 0%, #2c3e50 100%)', // 柔和的深灰蓝渐变
            minHeight: '100vh',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)', // 添加阴影
            borderRight: '1px solid rgba(255, 255, 255, 0.1)' // 边框分隔
        }
    }, [
        // 导航头部 - Logo区域
        React.createElement('div', {
            key: 'header',
            className: 'nav-header',
            style: {
                height: '50px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: collapsed ? '0' : '0 16px',
                position: 'relative',
                backdropFilter: 'blur(10px)' // 毛玻璃效果
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
                        background: 'linear-gradient(135deg, #409EFF 0%, #1890ff 100%)',
                        borderRadius: '6px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                    }
                }, '🚇'),
                !collapsed && React.createElement('span', {
                    key: 'text',
                    className: 'logo-text',
                    style: {
                        fontSize: '16px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
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
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                title: '收起菜单',
                onMouseEnter: (e) => {
                    e.target.style.color = '#FFFFFF';
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                },
                onMouseLeave: (e) => {
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                }
            }, '◀')
        ]),
        
        // 展开按钮（折叠状态）
        collapsed && React.createElement('div', {
            key: 'expand-btn',
            style: {
                padding: '8px',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
            }
        }, React.createElement('button', {
            className: 'nav-toggle',
            onClick: onToggleCollapse,
            style: {
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '4px',
                fontSize: '12px',
                transition: 'all 0.2s ease'
            },
            title: '展开菜单',
            onMouseEnter: (e) => {
                e.target.style.color = '#FFFFFF';
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1.1)';
            },
            onMouseLeave: (e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1)';
            }
        }, '▶')),
        
        // 菜单容器
        React.createElement('div', {
            key: 'menu-container',
            style: {
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingTop: '12px',
                paddingBottom: '16px'
            }
        }, [
            // 更新自定义样式
            React.createElement('style', {
                key: 'menu-styles'
            }, `
                .main-nav .ant-menu-dark {
                    background: transparent;
                    color: rgba(255, 255, 255, 0.9);
                }
                .main-nav .ant-menu-dark .ant-menu-item,
                .main-nav .ant-menu-dark .ant-menu-submenu-title {
                    color: rgba(255, 255, 255, 0.85);
                    margin: 2px 8px;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .main-nav .ant-menu-dark .ant-menu-item:hover,
                .main-nav .ant-menu-dark .ant-menu-submenu-title:hover {
                    color: #fff;
                    background: linear-gradient(135deg, rgba(64, 158, 255, 0.15) 0%, rgba(24, 144, 255, 0.25) 100%);
                    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
                    transform: translateX(2px);
                }
                .main-nav .ant-menu-dark .ant-menu-item-selected {
                    background: linear-gradient(135deg, #409EFF 0%, #1890ff 100%);
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
                    font-weight: 500;
                }
                .main-nav .ant-menu-dark .ant-menu-submenu-selected .ant-menu-submenu-title {
                    color: #409EFF;
                    background: rgba(64, 158, 255, 0.1);
                }
                .main-nav .ant-menu-dark .ant-menu-submenu-open .ant-menu-submenu-title {
                    color: #fff;
                    background: rgba(255, 255, 255, 0.05);
                }
                .main-nav .ant-menu-dark .ant-menu-submenu .ant-menu-sub {
                    background: rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(10px);
                    border-radius: 0 0 8px 8px;
                    margin: 0 8px;
                    padding: 4px 0;
                }
                .main-nav .ant-menu-dark .ant-menu-submenu .ant-menu-sub .ant-menu-item {
                    margin: 1px 4px;
                    padding-left: 32px !important;
                    border-radius: 4px;
                    font-size: 13px;
                }
                .main-nav .ant-menu-dark .ant-menu-submenu .ant-menu-sub .ant-menu-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateX(4px);
                }
                .main-nav .ant-menu-dark .ant-menu-submenu .ant-menu-sub .ant-menu-item-selected {
                    background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
                    color: #fff;
                    box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
                }
                /* 滚动条样式 */
                .main-nav .ant-menu::-webkit-scrollbar {
                    width: 4px;
                }
                .main-nav .ant-menu::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                }
                .main-nav .ant-menu::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                }
                .main-nav .ant-menu::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `),
            
            // 渲染菜单
            React.createElement(Menu, {
                key: 'menu',
                mode: 'inline',
                theme: 'dark',
                selectedKeys: [currentPage],
                defaultOpenKeys: getDefaultOpenKeys(),
                style: { 
                    background: 'transparent',
                    border: 'none',
                    flex: 1,
                    color: 'rgba(255, 255, 255, 0.9)'
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
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '11px',
                    lineHeight: '1.4',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    paddingTop: '12px',
                    background: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '6px',
                    backdropFilter: 'blur(10px)'
                }
            }, [
                React.createElement('div', {
                    key: 'version',
                    style: { marginBottom: '4px', fontWeight: '500' }
                }, 'Version 2.2'),
                React.createElement('div', {
                    key: 'copyright'
                }, '© 2024 人民城轨')
            ])
        ])
    ]);
};

window.Navigation = Navigation; 