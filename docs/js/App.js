// 简洁白色系统主应用组件 - 集成状态管理和权限控制
const App = () => {
    const { Layout } = antd;
    const { Sider, Header, Content } = Layout;
    
    const [currentPage, setCurrentPage] = React.useState('dashboard');
    const [collapsed, setCollapsed] = React.useState(false);
    const [user, setUser] = React.useState({ 
        name: '系统管理员', 
        role: 'admin',
        username: 'admin',
        userId: 'admin_001'
    });
    
    // 使用状态管理器的通知
    const [notifications, setNotifications] = React.useState([]);
    const [unreadCount, setUnreadCount] = React.useState(0);
    
    // 系统状态监控
    const [systemStatus, setSystemStatus] = React.useState({
        auditQueueCount: 0,
        pendingComplaints: 0,
        systemLoad: 0,
        lastUpdate: null
    });

    // 初始化状态管理器和权限管理器
    React.useEffect(() => {
        // 确保StateManager和PermissionManager已初始化
        if (window.StateManager && window.PermissionManager) {
            console.log('State and Permission managers are ready');
            
            // 设置用户权限（如果还没有设置）
            const currentPermissions = window.PermissionManager.getCurrentUserPermissions();
            if (!currentPermissions || currentPermissions.length === 0) {
                // 设置默认管理员权限
                window.PermissionManager.setUserPermissions(
                    user.userId, 
                    ['*', 'complaint'], // 添加 'complaint' 权限
                    'system'
                );
            }
            
            // 加载初始通知
            loadInitialNotifications();
            
            // 监听状态变化
            setupStateListeners();
        }
    }, []);

    // 加载初始通知
    const loadInitialNotifications = () => {
        if (window.StateManager) {
            // 从状态管理器获取通知
            const stateNotifications = window.StateManager.state.notifications;
            if (stateNotifications && stateNotifications.length > 0) {
                setNotifications(stateNotifications);
                setUnreadCount(window.StateManager.getUnreadNotificationCount());
            } else {
                // 添加一些初始通知
                const initialNotifications = [
                    {
                        type: 'info',
                        title: '系统初始化完成',
                        content: '状态管理器和权限控制系统已成功启动',
                        time: '刚刚'
                    },
                    {
                        type: 'success',
                        title: '权限加载完成',
                        content: '用户权限已成功加载，可以正常使用系统功能',
                        time: '1分钟前'
                    }
                ];
                
                initialNotifications.forEach(notif => {
                    window.StateManager.addNotification(notif);
                });
            }
        }
    };

    // 设置状态监听器
    const setupStateListeners = () => {
        if (window.StateManager) {
            // 监听新通知
            window.StateManager.on('notification:added', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(window.StateManager.getUnreadNotificationCount());
            });

            // 监听通知已读
            window.StateManager.on('notification:read', (notification) => {
                setUnreadCount(window.StateManager.getUnreadNotificationCount());
            });

            // 监听系统状态更新
            window.StateManager.on('system:statusUpdated', (data) => {
                setSystemStatus(data.systemStatus);
            });

            // 监听内容状态变更
            window.StateManager.on('content:statusChanged', (data) => {
                console.log('Content status changed:', data);
                // 可以在这里触发相关UI更新
            });

            // 监听用户状态变更
            window.StateManager.on('user:statusChanged', (data) => {
                console.log('User status changed:', data);
                // 可以在这里触发相关UI更新
            });

            // 监听投诉状态变更
            window.StateManager.on('complaint:statusChanged', (data) => {
                console.log('Complaint status changed:', data);
                // 可以在这里触发相关UI更新
            });

            // 监听权限变更
            window.StateManager.on('permissions:changed', (data) => {
                console.log('Permissions changed:', data);
                if (data.userId === user.userId) {
                    // 当前用户权限变更，可能需要重新加载页面或更新UI
                    console.log('Current user permissions updated');
                }
            });
        }
    };

    const handlePageChange = (page) => {
        console.log('Changing page to:', page);
        
        // 检查页面访问权限
        if (window.PermissionManager && !window.PermissionManager.canAccessPage(page)) {
            // 权限不足，显示提示并添加通知
            if (window.StateManager) {
                window.StateManager.addNotification({
                    type: 'warning',
                    title: '访问被拒绝',
                    content: `您没有访问"${page}"页面的权限，请联系管理员获取相应权限`,
                    time: '刚刚'
                });
            }
            return;
        }
        
        setCurrentPage(page);
        
        // 记录页面访问日志
        if (window.StateManager) {
            window.StateManager.emit('page:accessed', {
                page,
                user: user.username,
                timestamp: new Date().toISOString()
            });
        }
    };

    const handleToggleCollapse = () => {
        setCollapsed(!collapsed);
        console.log('侧边栏折叠状态:', !collapsed);
    };

    const handleNotificationClick = (notificationId) => {
        console.log('通知点击:', notificationId);
        
        // 标记通知为已读
        if (window.StateManager && notificationId) {
            window.StateManager.markNotificationRead(notificationId);
        }
        
        // 可以根据通知类型跳转到相应页面
        // 这里可以添加更多的通知处理逻辑
    };

    const handleLogout = () => {
        console.log('用户退出登录');
        
        // 记录退出日志
        if (window.StateManager) {
            window.StateManager.emit('user:logout', {
                userId: user.userId,
                timestamp: new Date().toISOString()
            });
        }
        
        // 清理本地数据
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // 清理状态管理器（可选）
        if (window.StateManager) {
            // window.StateManager.clearAllState(); // 根据需要决定是否清理所有状态
        }
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    // 实时更新通知数据
    React.useEffect(() => {
        if (window.StateManager) {
            setNotifications(window.StateManager.state.notifications);
            setUnreadCount(window.StateManager.getUnreadNotificationCount());
        }
    }, [notifications.length]);

    // 页面组件映射
    const getPageComponent = () => {
        const pageComponents = {
            'dashboard': window.Dashboard,
            'Dashboard': window.Dashboard,
            'content': window.ContentManagement,
            'ContentManagement': window.ContentManagement,
            'complaint': window.ComplaintManagement,
            'ComplaintManagement': window.ComplaintManagement,
            'content-tags': window.ContentTagManagement,
            'ContentTagManagement': window.ContentTagManagement,
            'review': window.ReviewManagement,
            'review-image': window.ReviewManagement,
            'review-video': window.ReviewManagement,
            'review-interaction': window.ReviewManagement,
            'review-mechanism': window.ReviewManagement,
            'ReviewManagement': window.ReviewManagement,
            'exhibition-audit': window.ExhibitionAuditManagement,
            'ExhibitionAuditManagement': window.ExhibitionAuditManagement,
            'audit-flow': window.AuditFlowManagement,
            'AuditFlowManagement': window.AuditFlowManagement,
            'booth': window.BoothManagement,
            'BoothManagement': window.BoothManagement,
            'exhibitor': window.ExhibitorManagement,
            'ExhibitorManagement': window.ExhibitorManagement,
            'live': window.LiveManagement,
            'LiveManagement': window.LiveManagement,
            'stats': window.BehaviorStats,
            'BehaviorStats': window.BehaviorStats,
            'operational': window.OperationalStats,
            'OperationalStats': window.OperationalStats,
            'data': window.DataManagement,
            'DataManagement': window.DataManagement,
            'feedback': window.FeedbackManagement,
            'FeedbackManagement': window.FeedbackManagement,
            'message': window.MessageManagement,
            'MessageManagement': window.MessageManagement,
            'user': window.UserManagement,
            'UserManagement': window.UserManagement,
            'admin': window.AdminManagement,
            'AdminManagement': window.AdminManagement,
            'logs': window.LogManagement,
            'LogManagement': window.LogManagement,
            'settings': window.SystemSettings,
            'SystemSettings': window.SystemSettings,
            'version': window.VersionManagement,
            'VersionManagement': window.VersionManagement,
            'traffic': window.TrafficAllocation,
            'TrafficAllocation': window.TrafficAllocation,
            'menu': window.MenuManagement,
            'MenuManagement': window.MenuManagement,
            'personal': window.PersonalCenter,
            'personal-center': window.PersonalCenter,
            'PersonalCenter': window.PersonalCenter
        };

        const Component = pageComponents[currentPage];
        if (Component) {
            // 使用权限HOC包装组件（如果需要）
            if (window.PermissionManager) {
                const requiredPermissions = window.PermissionManager.PAGE_PERMISSIONS[currentPage];
                if (requiredPermissions && requiredPermissions.length > 0) {
                    // 检查权限
                    const hasPermission = window.PermissionManager.hasAnyPermission(requiredPermissions);
                    if (!hasPermission) {
                        return React.createElement('div', {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '400px',
                                color: '#666'
                            }
                        }, [
                            React.createElement('h3', { key: 'title' }, '🔒 权限不足'),
                            React.createElement('p', { key: 'desc' }, '您没有访问此页面的权限，请联系管理员获取相应权限。'),
                            React.createElement('p', { key: 'permissions' }, `需要权限：${requiredPermissions.join(', ')}`)
                        ]);
                    }
                }
            }
            
            return React.createElement(Component);
        }
        
        return React.createElement('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px',
                fontSize: '16px',
                color: '#666'
            }
        }, `页面 "${currentPage}" 不存在`);
    };

    return React.createElement(Layout, {
        style: { minHeight: '100vh', background: '#f5f5f5' }
    }, [
        // 侧边栏
        React.createElement(Sider, {
            key: 'sider',
            trigger: null,
            collapsible: true,
            collapsed: collapsed,
            width: 260,
            collapsedWidth: 64,
            style: {
                background: '#fff',
                boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
            }
        }, React.createElement(window.Navigation, {
            currentPage: currentPage,
            onPageChange: handlePageChange,
            collapsed: collapsed,
            onToggleCollapse: handleToggleCollapse
        })),

        // 主内容区域
        React.createElement(Layout, {
            key: 'main'
        }, [
            // 顶部导航栏
            React.createElement(Header, {
                key: 'header',
                style: {
                    background: '#fff',
                    padding: 0,
                    height: '64px',
                    lineHeight: '64px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 1
                }
            }, React.createElement(window.TopBar, {
                currentPage: currentPage,
                user: user,
                notifications: notifications,
                onNotificationClick: handleNotificationClick,
                onLogout: handleLogout,
                onPageChange: handlePageChange
            })),

            // 内容区域
            React.createElement(Content, {
                key: 'content',
                style: {
                    margin: '16px',
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }
            }, [
                React.createElement('div', {
                    key: 'page-content',
                    style: {
                        padding: '24px',
                        minHeight: 'calc(100vh - 128px)'
                    }
                }, getPageComponent())
            ])
        ])
    ]);
};

window.App = App; 