// 简洁白色系统主应用组件 - 集成状态管理和权限控制
const App = () => {
    const { Layout, message } = antd;
    const { Sider, Header, Content } = Layout;
    
    // 登录状态管理
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    
    const [currentPage, setCurrentPage] = React.useState('dashboard');
    const [collapsed, setCollapsed] = React.useState(false);
    const [user, setUser] = React.useState(null);
    
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

    // 检查登录状态
    const checkLoginStatus = () => {
        try {
            const userData = localStorage.getItem('userData');
            const userToken = localStorage.getItem('userToken');
            
            if (userData && userToken) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsLoggedIn(true);
                
                // 更新AuthUtils
                if (window.AuthUtils) {
                    window.AuthUtils.saveCurrentUser(parsedUser);
                }
                
                console.log('用户已登录:', parsedUser.name);
            } else {
                setIsLoggedIn(false);
                console.log('用户未登录');
            }
        } catch (error) {
            console.error('检查登录状态失败:', error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    // 登录成功处理
    const handleLogin = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
        
        // 更新AuthUtils
        if (window.AuthUtils) {
            window.AuthUtils.saveCurrentUser(userData);
        }
        
        // 初始化权限
        if (window.PermissionManager) {
            window.PermissionManager.setUserPermissions(
                userData.userId,
                userData.permissions || ['*'],
                'system'
            );
        }
        
        // 初始化状态管理器
        initializeStateManager();
        
        console.log('登录成功，用户信息:', userData);
    };

    // 初始化状态管理器和权限管理器
    const initializeStateManager = () => {
        // 确保StateManager和PermissionManager已初始化
        if (window.StateManager && window.PermissionManager) {
            console.log('State and Permission managers are ready');
            
            // 设置用户权限（如果还没有设置）
            const currentPermissions = window.PermissionManager.getCurrentUserPermissions();
            if (!currentPermissions || currentPermissions.length === 0) {
                // 设置用户权限
                window.PermissionManager.setUserPermissions(
                    user.userId, 
                    user.permissions || ['*'],
                    'system'
                );
            }
            
            // 加载初始通知
            loadInitialNotifications();
            
            // 监听状态变化
            setupStateListeners();
        }
    };

    // 初始化应用
    React.useEffect(() => {
        checkLoginStatus();
    }, []);

    // 用户登录后初始化
    React.useEffect(() => {
        if (isLoggedIn && user) {
            initializeStateManager();
        }
    }, [isLoggedIn, user]);

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
            });

            // 监听用户状态变更
            window.StateManager.on('user:statusChanged', (data) => {
                console.log('User status changed:', data);
            });

            // 监听投诉状态变更
            window.StateManager.on('complaint:statusChanged', (data) => {
                console.log('Complaint status changed:', data);
            });

            // 监听权限变更
            window.StateManager.on('permissions:changed', (data) => {
                console.log('Permissions changed:', data);
                if (data.userId === user.userId) {
                    console.log('Current user permissions updated');
                }
            });

            // 监听页面切换事件
            window.StateManager.on('page:change', (data) => {
                if (data && data.page) {
                    console.log('Page change event received:', data.page, data);
                    // 保存直播详情数据
                    if (data.liveId && data.liveData) {
                        if (!window.StateManager.state.liveDetailData) {
                            window.StateManager.state.liveDetailData = {};
                        }
                        window.StateManager.state.liveDetailData[data.liveId] = data.liveData;
                    }
                    handlePageChange(data.page);
                }
            });
        }
    };

    const handlePageChange = (page, params = {}) => {
        console.log('Changing page to:', page, 'with params:', params);
        
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
        
        // 存储页面参数
        if (params && Object.keys(params).length > 0) {
            window.App.currentPageParams = params;
        } else {
            window.App.currentPageParams = {};
        }
        
        setCurrentPage(page);
        
        // 记录页面访问日志
        if (window.StateManager) {
            window.StateManager.emit('page:accessed', {
                page,
                params,
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
    };

    const handleLogout = () => {
        console.log('用户退出登录');
        
        // 记录退出日志
        if (window.StateManager && user && user.userId) {
            window.StateManager.emit('user:logout', {
                userId: user.userId,
                timestamp: new Date().toISOString()
            });
        }
        
        // 清理本地数据
        localStorage.removeItem('userData');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userPreferences');
        localStorage.removeItem('recentActions');
        
        // 清理状态管理器
        if (window.StateManager) {
            window.StateManager.clearAllState();
        }
        
        // 清理AuthUtils
        if (window.AuthUtils) {
            window.AuthUtils.logout();
        }
        
        // 更新状态
        setUser(null);
        setIsLoggedIn(false);
        setCurrentPage('dashboard');
        setNotifications([]);
        setUnreadCount(0);
        
        // 显示退出成功提示
        message.success('已安全退出系统');
    };

    // 实时更新通知数据
    React.useEffect(() => {
        if (window.StateManager) {
            setNotifications(window.StateManager.state.notifications);
            setUnreadCount(window.StateManager.getUnreadNotificationCount());
        }
    }, [notifications.length]);

    // 页面组件导入
    const LiveStatsManagement = window.LiveStatsManagement;

    // 页面组件映射
    const getPageComponent = () => {
        console.log('Current page:', currentPage);
        console.log('Available components:', Object.keys(window.App.pages));
        
        const pageComponents = {
            'dashboard': window.App.pages.Dashboard,
            'Dashboard': window.App.pages.Dashboard,
            'content': window.App.pages.ContentManagement,
            'ContentManagement': window.App.pages.ContentManagement,
            'screen-management': window.App.pages.ScreenManagement,
            'ScreenManagement': window.App.pages.ScreenManagement,
            'complaint': window.App.pages.ComplaintManagement,
            'ComplaintManagement': window.App.pages.ComplaintManagement,
            'content-tags': window.App.pages.ContentTagManagement,
            'ContentTagManagement': window.App.pages.ContentTagManagement,
            'review': window.App.pages.ReviewManagement,
            'review-image': window.App.pages.ReviewManagement,
            'review-video': window.App.pages.ReviewManagement,
            'review-interaction': window.App.pages.ReviewManagement,
            'review-mechanism': window.App.pages.ReviewManagement,
            'ReviewManagement': window.App.pages.ReviewManagement,
            'exhibition-audit': window.App.pages.ExhibitionAuditManagement,
            'ExhibitionAuditManagement': window.App.pages.ExhibitionAuditManagement,
            'audit-flow': window.App.pages.AuditFlowManagement,
            'AuditFlowManagement': window.App.pages.AuditFlowManagement,
            'booth': window.App.pages.BoothManagement,
            'BoothManagement': window.App.pages.BoothManagement,
            'exhibitor': window.App.pages.ExhibitorManagement,
            'ExhibitorManagement': window.App.pages.ExhibitorManagement,
            'exhibitor-maintenance': window.App.pages.ExhibitorMaintenance,
            'ExhibitorMaintenance': window.App.pages.ExhibitorMaintenance,
            'live-management': window.App.pages.LiveManagement,
            'LiveManagement': window.App.pages.LiveManagement,
            'live-detail': window.App.pages.LiveDetail,
            'LiveDetail': window.App.pages.LiveDetail,
            'live-stats': window.App.pages.LiveStatsManagement,
            'stats': window.App.pages.BehaviorStats,
            'BehaviorStats': window.App.pages.BehaviorStats,
            'operational': window.App.pages.OperationalStats,
            'OperationalStats': window.App.pages.OperationalStats,
            'data': window.App.pages.DataManagement,
            'DataManagement': window.App.pages.DataManagement,
            'feedback': window.App.pages.FeedbackManagement,
            'FeedbackManagement': window.App.pages.FeedbackManagement,
            'message': window.App.pages.MessageManagement,
            'MessageManagement': window.App.pages.MessageManagement,
            'user': window.App.pages.UserManagement,
            'UserManagement': window.App.pages.UserManagement,
            'admin': window.App.pages.AdminManagement,
            'AdminManagement': window.App.pages.AdminManagement,
            'logs': window.App.pages.LogManagement,
            'LogManagement': window.App.pages.LogManagement,
            'settings': window.App.pages.SystemSettings,
            'SystemSettings': window.App.pages.SystemSettings,
            'version': window.App.pages.VersionManagement,
            'VersionManagement': window.App.pages.VersionManagement,
            'traffic': window.App.pages.TrafficAllocation,
            'TrafficAllocation': window.App.pages.TrafficAllocation,
            'menu': window.App.pages.MenuManagement,
            'MenuManagement': window.App.pages.MenuManagement,
            'personal': window.App.pages.PersonalCenter,
            'personal-center': window.App.pages.PersonalCenter,
            'PersonalCenter': window.App.pages.PersonalCenter,
            'profile': window.App.pages.UserProfile,
            'UserProfile': window.App.pages.UserProfile,
            'column-management': window.App.pages.ColumnManagement,
            'ColumnManagement': window.App.pages.ColumnManagement,
            'column-permission': window.App.pages.ColumnPermissionManagement,
            'ColumnPermissionManagement': window.App.pages.ColumnPermissionManagement,
            // 文创管理
            'cultural-product': window.App.pages.CulturalProductManagement,
            'CulturalProductManagement': window.App.pages.CulturalProductManagement,
            'cultural-category': window.App.pages.CulturalCategoryTagManagement,
            'CulturalCategoryTagManagement': window.App.pages.CulturalCategoryTagManagement,
            'cultural-display': window.App.pages.CulturalDisplayManagement,
            'CulturalDisplayManagement': window.App.pages.CulturalDisplayManagement,
            'cultural-contact': window.App.pages.CulturalContactManagement,
            'CulturalContactManagement': window.App.pages.CulturalContactManagement,
            'cultural-company': window.App.pages.CulturalCompanyManagement,
            'CulturalCompanyManagement': window.App.pages.CulturalCompanyManagement,
            // AI管理
            'ai-agents': window.App.pages.AIAgentManagement,
            'AIAgentManagement': window.App.pages.AIAgentManagement,
            'ai-knowledge': window.App.pages.AIKnowledgeManagement,
            'AIKnowledgeManagement': window.App.pages.AIKnowledgeManagement,
            'ai-knowledge-detail': window.App.pages.AIKnowledgeDetail,
            'AIKnowledgeDetail': window.App.pages.AIKnowledgeDetail,
            'ai-chat': window.App.pages.AIChat,
            'AIChat': window.App.pages.AIChat,
            'ai-categories': window.App.pages.AICategoryManagement,
            'AICategoryManagement': window.App.pages.AICategoryManagement,
            // 背景墙管理
            'background-wall': window.App.pages['background-wall'] || window.App.pages.BackgroundWallManagement,
            'BackgroundWallManagement': window.App.pages.BackgroundWallManagement,
            // 情景管理
            'scenario-management': window.App.pages['scenario-management'] || window.App.pages.ScenarioManagement,
            'ScenarioManagement': window.App.pages.ScenarioManagement,
            // 展会管理
            'exhibition-management': window.App.pages.ExhibitionManagement,
            'ExhibitionManagement': window.App.pages.ExhibitionManagement,
            'exhibition-registration': window.App.pages.ExhibitionRegistrationManagement,
            'ExhibitionRegistrationManagement': window.App.pages.ExhibitionRegistrationManagement
            };
        console.log('Looking for component:', currentPage);
        console.log('Available components:', Object.keys(window.App.pages || {}));
        console.log('Component mapping:', {
            operational: window.App.pages.OperationalStats,
            OperationalStats: window.App.pages.OperationalStats,
            LiveDetail: window.App.pages.LiveDetail,
            'live-detail': window.App.pages.LiveDetail
        });
        
        const Component = pageComponents[currentPage];
        console.log('Found component:', Component ? 'yes' : 'no');
        if (!Component && currentPage === 'LiveDetail') {
            console.warn('LiveDetail component not found in window.App.pages:', window.App.pages.LiveDetail);
            console.warn('All available pages:', Object.keys(window.App.pages || {}));
        }
        
        if (Component) {
            console.log('Rendering component for page:', currentPage);
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
            
            // 准备组件props
            const componentProps = {
                currentPage: currentPage,
                onPageChange: handlePageChange,
                // 传递当前页面的参数
                ...(window.App.currentPageParams || {})
            };
            
            return React.createElement(Component, componentProps);
        }
        
        console.log('Page component not found:', currentPage);
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

    // 系统加载中
    if (isLoading) {
        return React.createElement('div', {
            style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#f5f5f5'
            }
        }, React.createElement('div', {
            style: { textAlign: 'center' }
        }, [
            React.createElement('div', {
                key: 'logo',
                style: {
                    fontSize: '48px',
                    marginBottom: '16px'
                }
            }, '🚇'),
            React.createElement('div', {
                key: 'title',
                style: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: '#333'
                }
            }, '人民城轨2.0'),
            React.createElement('div', {
                key: 'loading',
                style: {
                    fontSize: '16px',
                    color: '#666'
                }
            }, '系统正在启动...')
        ]));
    }

    // 未登录显示登录页面
    if (!isLoggedIn) {
        return React.createElement(window.Login, {
            onLogin: handleLogin
        });
    }

    // 已登录显示主界面
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

// 将组件挂载到正确的命名空间
window.App = Object.assign(window.App || {}, {
    App: App,
    init: function() {
        const container = document.getElementById('app');
        if (!container) {
            console.error('找不到应用容器元素 #app');
            return;
        }
        
        try {
            ReactDOM.render(React.createElement(App), container);
            console.log('应用渲染成功');
        } catch (error) {
            console.error('应用渲染失败:', error);
            container.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
                    <div style="text-align: center; color: #ff4d4f;">
                        <h2>应用启动失败</h2>
                        <p>请检查浏览器控制台获取详细错误信息</p>
                        <button onclick="location.reload()" style="margin-top: 16px; padding: 8px 16px;">重新加载</button>
                    </div>
                </div>
            `;
        }
    }
});

// 在文档加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    if (window.App && window.App.init) {
        window.App.init();
    } else {
        console.error('应用初始化失败：找不到 window.App.init');
    }
});