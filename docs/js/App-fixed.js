// 修复版主应用组件
const App = () => {
    const { Layout, message } = antd;
    const { Sider, Header, Content } = Layout;
    
    const [currentPage, setCurrentPage] = React.useState('dashboard');
    const [collapsed, setCollapsed] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [renderKey, setRenderKey] = React.useState(0); // 强制重新渲染的key
    
    const [notifications, setNotifications] = React.useState([
        {
            type: 'warning',
            title: '系统升级',
            content: '系统将于今晚24:00进行维护升级',
            time: '10分钟前',
            read: false
        },
        {
            type: 'info',
            title: '新版本发布',
            content: 'v2.1.0版本已发布，新增批量操作功能',
            time: '1小时前',
            read: true
        }
    ]);

    // 初始化认证状态
    React.useEffect(() => {
        checkAuthStatus();
        
        // 设置定时检查认证状态
        const authCheckInterval = setInterval(() => {
            if (!AuthUtils.refreshAuth()) {
                handleLogout();
            }
        }, 5 * 60 * 1000); // 每5分钟检查一次

        return () => clearInterval(authCheckInterval);
    }, []);

    // 检查认证状态
    const checkAuthStatus = () => {
        try {
            setLoading(true);
            
            if (AuthUtils.isAuthenticated() && !AuthUtils.isTokenExpired()) {
                const userData = AuthUtils.getCurrentUser();
                if (userData) {
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('用户已登录:', userData.name);
                } else {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
                AuthUtils.logout(); // 清除过期的认证信息
            }
        } catch (error) {
            console.error('认证状态检查失败:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // 处理登录
    const handleLogin = (userData) => {
        try {
            setUser(userData);
            setIsAuthenticated(true);
            message.success(`欢迎回来，${userData.name}！`);
            
            // 记录登录成功
            AuthUtils.logActivity('login_success', {
                username: userData.username,
                loginTime: new Date().toISOString()
            });
        } catch (error) {
            console.error('登录处理失败:', error);
            message.error('登录处理失败，请重试');
        }
    };

    // 处理退出登录
    const handleLogout = () => {
        try {
            const currentUser = AuthUtils.getCurrentUser();
            AuthUtils.logout();
            setUser(null);
            setIsAuthenticated(false);
            setCurrentPage('dashboard'); // 重置到首页
            
            message.info(currentUser ? `${currentUser.name}，您已安全退出` : '已退出登录');
        } catch (error) {
            console.error('退出登录失败:', error);
            message.error('退出登录失败');
        }
    };

    const handlePageChange = (page) => {
        console.log('🚀 [FIXED] 页面切换开始');
        console.log('🎯 [FIXED] 目标页面:', page);
        console.log('📍 [FIXED] 当前页面:', currentPage);
        
        // 设置新页面
        setCurrentPage(page);
        
        // 强制重新渲染
        setRenderKey(prev => prev + 1);
        
        console.log('✅ [FIXED] 页面状态已更新');
        console.log('🔄 [FIXED] 强制重新渲染 key:', renderKey + 1);
        
        // 记录页面访问
        if (isAuthenticated) {
            AuthUtils.logActivity('page_visit', {
                page: page,
                timestamp: new Date().toISOString()
            });
        }
    };

    const handleToggleCollapse = () => {
        setCollapsed(!collapsed);
        
        // 保存用户偏好
        if (isAuthenticated) {
            AuthUtils.setUserPreference('sidebarCollapsed', !collapsed);
        }
    };

    const handleNotificationClick = () => {
        console.log('查看全部通知');
        handlePageChange('notifications');
    };

    // 加载用户偏好设置
    React.useEffect(() => {
        if (isAuthenticated) {
            const savedCollapsed = AuthUtils.getUserPreference('sidebarCollapsed', false);
            setCollapsed(savedCollapsed);
        }
    }, [isAuthenticated]);

    // 监听页面变化
    React.useEffect(() => {
        console.log('📱 [FIXED] useEffect 触发 - 页面:', currentPage);
        console.log('🔧 [FIXED] renderKey:', renderKey);
    }, [currentPage, renderKey]);

    const renderContent = () => {
        console.log('🎨 [FIXED] renderContent 开始渲染');
        console.log('📄 [FIXED] 当前页面:', currentPage);
        console.log('🔑 [FIXED] renderKey:', renderKey);
        
        // 专门处理内容管理页面
        if (currentPage === 'content') {
            console.log('📝 [FIXED] 准备渲染内容管理页面');
            console.log('🔍 [FIXED] ContentManagement 组件可用:', !!window.ContentManagement);
            
            if (window.ContentManagement) {
                console.log('✅ [FIXED] 找到 ContentManagement 组件，开始创建');
                try {
                    const contentComponent = React.createElement(window.ContentManagement, { key: `content-${renderKey}` });
                    console.log('🎉 [FIXED] ContentManagement 组件创建成功');
                    return contentComponent;
                } catch (error) {
                    console.error('❌ [FIXED] ContentManagement 创建失败:', error);
                    return React.createElement('div', {
                        style: { 
                            padding: '24px', 
                            background: '#fff',
                            margin: '24px',
                            borderRadius: '8px',
                            border: '1px solid #ff4d4f',
                            textAlign: 'center'
                        }
                    }, [
                        React.createElement('h2', { key: 'title', style: { color: '#ff4d4f' } }, '内容管理组件加载失败'),
                        React.createElement('p', { key: 'error' }, error.message),
                        React.createElement('button', {
                            key: 'reload',
                            onClick: () => location.reload(),
                            style: { padding: '8px 16px', marginTop: '16px' }
                        }, '重新加载')
                    ]);
                }
            } else {
                console.error('❌ [FIXED] ContentManagement 组件未找到');
                return React.createElement('div', {
                    style: { 
                        padding: '24px', 
                        background: '#fff',
                        margin: '24px',
                        borderRadius: '8px',
                        border: '1px solid #ff7875',
                        textAlign: 'center'
                    }
                }, [
                    React.createElement('h2', { key: 'title', style: { color: '#ff4d4f' } }, 'ContentManagement 组件未加载'),
                    React.createElement('p', { key: 'msg' }, '请检查 js/pages/ContentManagement.js 文件是否正确加载'),
                    React.createElement('button', {
                        key: 'reload',
                        onClick: () => location.reload(),
                        style: { padding: '8px 16px', marginTop: '16px' }
                    }, '重新加载')
                ]);
            }
        }
        
        // 组件映射表 - 简化版本
        const pageComponents = {
            'dashboard': window.Dashboard,
            'review': window.ReviewManagement,
            'audit-flow': window.AuditFlowManagement,
            'admin': window.AdminManagement,
            'user': window.UserManagement,
            'feedback': window.FeedbackManagement,
            'message': window.MessageManagement,
            'version': window.VersionManagement,
            'live': window.LiveManagement,
            'booth': window.BoothManagement,
            'stats': window.BehaviorStats,
            'operational': window.OperationalStats,
            'data': window.DataManagement,
            'traffic': window.TrafficAllocation,
            'logs': window.LogManagement,
            'settings': window.SystemSettings,
            'profile': window.UserProfile
        };
        
        const PageComponent = pageComponents[currentPage];
        console.log('🔍 [FIXED] 查找组件:', currentPage, '结果:', !!PageComponent);
        
        if (PageComponent) {
            console.log('✅ [FIXED] 渲染页面组件:', currentPage);
            try {
                return React.createElement(PageComponent, { key: `${currentPage}-${renderKey}` });
            } catch (error) {
                console.error('❌ [FIXED] 页面组件渲染失败:', error);
                return React.createElement('div', {
                    style: { padding: '24px', textAlign: 'center' }
                }, `页面组件 ${currentPage} 渲染失败: ${error.message}`);
            }
        }
        
        // 默认返回Dashboard
        console.log('🏠 [FIXED] 使用默认 Dashboard');
        return window.Dashboard ? 
            React.createElement(window.Dashboard, { key: `dashboard-${renderKey}` }) : 
            React.createElement('div', {
                style: { padding: '24px', textAlign: 'center' }
            }, '页面加载失败');
    };

    // 加载中状态
    if (loading) {
        return React.createElement('div', {
            className: 'loading-spinner'
        }, [
            React.createElement('div', {
                key: 'loading-content',
                style: { textAlign: 'center' }
            }, [
                React.createElement('div', {
                    key: 'icon',
                    style: { fontSize: '48px', marginBottom: '16px' }
                }, '🚇'),
                React.createElement('div', {
                    key: 'title',
                    style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }
                }, '人民城轨2.0运营管理后台'),
                React.createElement('div', {
                    key: 'message',
                    style: { marginTop: '16px', color: '#64748b' }
                }, '正在验证登录状态...')
            ])
        ]);
    }

    // 未登录状态，显示登录页面
    if (!isAuthenticated) {
        return React.createElement(window.LoginPage, {
            onLogin: handleLogin
        });
    }

    // 已登录状态，显示主应用界面
    return React.createElement(ErrorBoundary, {}, 
        React.createElement(Layout, {
            className: 'app-container',
            style: { minHeight: '100vh' }
        }, [
            // 左侧导航
            React.createElement(Sider, {
                key: 'sider',
                width: collapsed ? 80 : 240,
                collapsed: collapsed,
                collapsible: false,
                style: {
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0
                }
            }, React.createElement(Navigation, {
                currentPage: currentPage,
                onPageChange: handlePageChange,
                collapsed: collapsed,
                onToggleCollapse: handleToggleCollapse
            })),

            // 右侧主体
            React.createElement(Layout, {
                key: 'main',
                style: { 
                    marginLeft: collapsed ? 80 : 240,
                    transition: 'margin-left 0.3s'
                }
            }, [
                // 顶部操作栏
                React.createElement(Header, {
                    key: 'header',
                    style: { 
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        left: collapsed ? 80 : 240,
                        zIndex: 1000,
                        padding: 0,
                        height: 64,
                        transition: 'left 0.3s'
                    }
                }, React.createElement(TopBar, {
                    user: user,
                    notifications: notifications,
                    onNotificationClick: handleNotificationClick,
                    onLogout: handleLogout
                })),

                // 主内容区 - 使用renderKey确保重新渲染
                React.createElement(Content, {
                    key: `main-content-${currentPage}-${renderKey}`,
                    style: {
                        marginTop: 64,
                        padding: '24px',
                        background: '#f5f7fa',
                        minHeight: 'calc(100vh - 64px)'
                    }
                }, renderContent())
            ])
        ])
    );
};

console.log('🚀 [FIXED] App 组件定义完成，准备挂载到 window');
window.App = App;
console.log('✅ [FIXED] App 组件已挂载到 window.App'); 