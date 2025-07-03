// 简洁白色系统导航组件 - 集成权限控制和状态管理
const Navigation = ({ currentPage, onPageChange, collapsed, onToggleCollapse }) => {
    const { Menu } = antd;
    const { SubMenu } = Menu;
    
    // 菜单配置状态
    const [menuConfig, setMenuConfig] = React.useState(() => {
        const saved = localStorage.getItem('menuConfig');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Failed to parse menu config from localStorage');
            }
        }
        return null; // 使用默认配置
    });

    // 权限状态
    const [userPermissions, setUserPermissions] = React.useState([]);
    const [refreshKey, setRefreshKey] = React.useState(0);

    // 监听菜单配置变化
    React.useEffect(() => {
        const handleMenuConfigChange = () => {
            const saved = localStorage.getItem('menuConfig');
            if (saved) {
                try {
                    setMenuConfig(JSON.parse(saved));
                } catch (e) {
                    console.warn('Failed to parse menu config from localStorage');
                }
            }
        };

        window.addEventListener('menuConfigChanged', handleMenuConfigChange);
        
        return () => {
            window.removeEventListener('menuConfigChanged', handleMenuConfigChange);
        };
    }, []);

    // 监听权限变更
    React.useEffect(() => {
        // 初始加载权限
        if (window.PermissionManager) {
            setUserPermissions(window.PermissionManager.getCurrentUserPermissions());
        }

        // 监听权限更新事件
        const handlePermissionUpdate = () => {
            if (window.PermissionManager) {
                setUserPermissions(window.PermissionManager.getCurrentUserPermissions());
                setRefreshKey(prev => prev + 1);
            }
        };

        // 监听状态管理器的权限变更事件
        if (window.StateManager) {
            window.StateManager.on('permissions:refreshed', handlePermissionUpdate);
        }

        // 监听传统的权限更新事件
        window.addEventListener('permissionsUpdated', handlePermissionUpdate);

        return () => {
            if (window.StateManager) {
                window.StateManager.off('permissions:refreshed', handlePermissionUpdate);
            }
            window.addEventListener('permissionsUpdated', handlePermissionUpdate);
        };
    }, []);

    // 检查菜单项是否应该显示
    const shouldShowMenuItem = (menuKey) => {
        // 首先检查菜单配置是否启用
        if (menuConfig && menuConfig[menuKey] && !menuConfig[menuKey].enabled) {
            return false;
        }

        // 暂时禁用权限过滤，显示所有菜单（调试用）
        // TODO: 在测试完成后恢复权限控制
        /*
        // 然后检查用户权限
        if (window.PermissionManager) {
            return window.PermissionManager.canAccessPage(menuKey);
        }
        */

        return true; // 暂时显示所有菜单
    };

    // 检查一级菜单是否有可访问的子菜单
    const hasAccessibleSubMenus = (parentKey, subMenus) => {
        return subMenus.some(subMenu => shouldShowMenuItem(subMenu.key));
    };

    // 内容管理子菜单
    const contentSubMenus = [
        { key: 'content', icon: '📄', label: '内容管理' },
        { key: 'complaint', icon: '📞', label: '投诉管理' },
        { key: 'content-tags', icon: '🏷️', label: '内容标签' }
    ];

    // 审核管理子菜单
    const auditSubMenus = [
        { key: 'review', icon: '🤖', label: 'AI审核' },
        { key: 'exhibition-audit', icon: '🏢', label: '展会内容审核' },
        { key: 'audit-flow', icon: '⚙️', label: '审核流程管理' }
    ];

    // 展会管理子菜单
    const exhibitionSubMenus = [
        { key: 'booth', icon: '🏗️', label: '展位管理' },
        { key: 'exhibitor', icon: '🏢', label: '参展公司管理' },
        { key: 'live', icon: '📺', label: '论坛直播' }
    ];

    // 运营管理子菜单
    const operationSubMenus = [
        { key: 'stats', icon: '📊', label: '行为统计' },
        { key: 'operational', icon: '📈', label: '运营数据统计' },
        { key: 'data', icon: '🗃️', label: '运营数据管理' },
        { key: 'feedback', icon: '💬', label: '用户反馈管理' },
        { key: 'message', icon: '📨', label: '消息管理' }
    ];

    // 系统管理子菜单
    const systemSubMenus = [
        { key: 'user', icon: '👥', label: '用户管理' },
        { key: 'admin', icon: '🔐', label: '权限管理' },
        { key: 'logs', icon: '📋', label: '日志管理' },
        { key: 'settings', icon: '⚙️', label: '系统设置' },
        { key: 'version', icon: '📱', label: 'APP版本管理' },
        { key: 'traffic', icon: '🔄', label: '流量分配' },
        { key: 'menu', icon: '📋', label: '菜单管理' }
    ];

    // 渲染子菜单项
    const renderSubMenuItems = (subMenus) => {
        return subMenus
            .filter(subMenu => shouldShowMenuItem(subMenu.key))
            .map(subMenu => 
                React.createElement(Menu.Item, {
                    key: subMenu.key,
                    className: `nav-menu-item ${currentPage === subMenu.key ? 'ant-menu-item-selected' : ''}`
                }, [
                    React.createElement('span', { 
                        key: 'icon', 
                        className: 'nav-icon',
                        style: { marginRight: '8px' }
                    }, subMenu.icon),
                    React.createElement('span', { 
                        key: 'label',
                        className: 'nav-label' 
                    }, subMenu.label)
                ])
            );
    };

    // 渲染子菜单
    const renderSubMenu = (key, icon, title, subMenus) => {
        // 检查是否有可访问的子菜单
        if (!hasAccessibleSubMenus(key, subMenus)) {
            return null;
        }

        return React.createElement(SubMenu, {
            key,
            icon: React.createElement('span', { 
                className: 'nav-icon',
                style: { marginRight: '8px' }
            }, icon),
            title: React.createElement('span', { className: 'nav-label' }, title),
            className: 'nav-submenu'
        }, renderSubMenuItems(subMenus));
    };

    // 获取选中的菜单键
    const getSelectedKeys = () => {
        return [currentPage];
    };

    // 获取展开的菜单键
    const getOpenKeys = () => {
        const openKeys = [];
        
        if (contentSubMenus.some(item => item.key === currentPage)) {
            openKeys.push('content-management');
        }
        if (auditSubMenus.some(item => item.key === currentPage)) {
            openKeys.push('audit-management');
        }
        if (exhibitionSubMenus.some(item => item.key === currentPage)) {
            openKeys.push('exhibition-management');
        }
        if (operationSubMenus.some(item => item.key === currentPage)) {
            openKeys.push('operation-statistics');
        }
        if (systemSubMenus.some(item => item.key === currentPage)) {
            openKeys.push('system-management');
        }
        
        return openKeys;
    };

    return React.createElement('div', {
        key: refreshKey, // 使用refreshKey强制重新渲染
        className: 'navigation-container',
        style: {
            height: '100vh',
            background: '#fff',
            borderRight: '1px solid #f0f0f0'
        }
    }, [
        // 头部Logo区域
        React.createElement('div', {
            key: 'header',
            className: 'nav-header',
            style: {
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                padding: collapsed ? '0' : '0 16px',
                borderBottom: '1px solid #f0f0f0',
                background: '#fff'
            }
        }, [
            // Logo和标题
            !collapsed && React.createElement('div', {
                key: 'logo',
                className: 'nav-logo',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#1890ff'
                }
            }, [
                React.createElement('span', { 
                    key: 'icon',
                    style: { fontSize: '20px', marginRight: '8px' } 
                }, '🚄'),
                React.createElement('span', { key: 'text' }, '人民城轨2.0')
            ]),
            
            // 折叠按钮
            React.createElement('button', {
                key: 'toggle',
                onClick: onToggleCollapse,
                className: 'nav-toggle-btn',
                style: {
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#666',
                    padding: '4px'
                }
            }, collapsed ? '▶' : '◀')
        ]),

        // 菜单区域
        React.createElement('div', {
            key: 'menu',
            className: 'nav-menu-container',
            style: {
                flex: 1,
                overflow: 'auto'
            }
        }, React.createElement(Menu, {
            mode: 'inline',
            selectedKeys: getSelectedKeys(),
            openKeys: getOpenKeys(),
            inlineCollapsed: collapsed,
            onClick: ({ key }) => {
                console.log('Navigation menu clicked:', key);
                onPageChange(key);
            },
            style: {
                height: '100%',
                borderRight: 0,
                background: '#fff'
            },
            className: 'nav-menu'
        }, [
            // 首页
            shouldShowMenuItem('dashboard') && React.createElement(Menu.Item, {
                key: 'dashboard',
                className: `nav-menu-item ${currentPage === 'dashboard' ? 'ant-menu-item-selected' : ''}`
            }, [
                React.createElement('span', { 
                    key: 'icon', 
                    className: 'nav-icon',
                    style: { marginRight: '8px' }
                }, '🏠'),
                React.createElement('span', { 
                    key: 'label',
                    className: 'nav-label' 
                }, '首页')
            ]),

            // 内容管理
            renderSubMenu('content-management', '📚', '内容管理', contentSubMenus),

            // 审核管理  
            renderSubMenu('audit-management', '🔍', '审核管理', auditSubMenus),

            // 展会管理
            renderSubMenu('exhibition-management', '🏛️', '展会管理', exhibitionSubMenus),

            // 运营管理
            renderSubMenu('operation-statistics', '📊', '运营管理', operationSubMenus),

            // 系统管理
            renderSubMenu('system-management', '⚙️', '系统管理', systemSubMenus)
        ].filter(Boolean))) // 过滤掉null值
    ]);
};

window.Navigation = Navigation; 