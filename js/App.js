// RuoYi风格主应用组件
const App = () => {
    const { Layout } = antd;
    const { Sider, Header, Content } = Layout;
    
    const [currentPage, setCurrentPage] = React.useState('dashboard');
    const [collapsed, setCollapsed] = React.useState(false);
    const [user, setUser] = React.useState({ 
        name: '系统管理员', 
        role: 'admin',
        username: 'admin'
    });
    const [notifications, setNotifications] = React.useState([
        {
            type: 'warning',
            title: '系统维护通知',
            content: '系统将于今晚24:00-02:00进行维护升级，期间可能影响部分功能使用',
            time: '5分钟前',
            read: false
        },
        {
            type: 'success',
            title: '版本更新',
            content: '人民城轨2.0 v2.2版本已发布，新增若依风格界面和批量操作功能',
            time: '30分钟前',
            read: false
        },
        {
            type: 'info',
            title: '数据统计',
            content: '本月用户活跃度较上月增长15%，内容审核效率提升20%',
            time: '1小时前',
            read: true
        },
        {
            type: 'warning',
            title: '安全提醒',
            content: '检测到异常登录行为，请及时检查系统安全设置',
            time: '2小时前',
            read: true
        }
    ]);

    const handlePageChange = (page) => {
        console.log('页面切换到:', page);
        setCurrentPage(page);
        
        // 添加页面切换动画效果
        const contentElement = document.querySelector('.main-content .ant-layout-content');
        if (contentElement) {
            contentElement.style.opacity = '0.7';
            setTimeout(() => {
                contentElement.style.opacity = '1';
                contentElement.classList.add('page-fade-in');
            }, 100);
        }
    };

    const handleToggleCollapse = () => {
        setCollapsed(!collapsed);
        console.log('侧边栏折叠状态:', !collapsed);
    };

    const handleSearch = (value) => {
        console.log('全局搜索:', value);
        // 实现全局搜索逻辑
        if (value.trim()) {
            // 模拟搜索结果处理
            alert(`搜索功能开发中，搜索内容：${value}`);
        }
    };

    const handleNotificationClick = () => {
        console.log('查看全部通知');
        // 可以跳转到通知管理页面
        setCurrentPage('notifications');
    };

    const handleLogout = () => {
        console.log('用户退出登录');
        // 实现登出逻辑
        // 清除用户信息、token等
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // 重新加载页面或跳转到登录页
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    const renderContent = () => {
        const pageComponents = {
            'dashboard': window.Dashboard,
            'Dashboard': window.Dashboard,
            'content': window.ContentManagement,
            'ContentManagement': window.ContentManagement,
            'review': window.ReviewManagement,
            'review-image': window.ReviewManagement,
            'review-video': window.ReviewManagement,
            'review-interaction': window.ReviewManagement,
            'review-mechanism': window.ReviewManagement,
            'ReviewManagement': window.ReviewManagement,
            'audit-flow': window.AuditFlowManagement,
            'AuditFlowManagement': window.AuditFlowManagement,
            'admin': window.AdminManagement,
            'AdminManagement': window.AdminManagement,
            'live': window.LiveManagement,
            'LiveManagement': window.LiveManagement,
            'user': window.UserManagement,
            'UserManagement': window.UserManagement,
            'profile': window.UserProfile,
            'UserProfile': window.UserProfile,
            'feedback': window.FeedbackManagement,
            'FeedbackManagement': window.FeedbackManagement,
            'message': window.MessageManagement,
            'MessageManagement': window.MessageManagement,
            'version': window.VersionManagement,
            'VersionManagement': window.VersionManagement,
            'booth': window.BoothManagement,
            'BoothManagement': window.BoothManagement,
            'stats': window.BehaviorStats,
            'BehaviorStats': window.BehaviorStats,
            'operational': window.OperationalStats,
            'OperationalStats': window.OperationalStats,
            'data': window.DataManagement,
            'DataManagement': window.DataManagement,
            'traffic': window.TrafficAllocation,
            'TrafficAllocation': window.TrafficAllocation,
            'logs': window.LogManagement,
            'LogManagement': window.LogManagement,
            'settings': window.SystemSettings,
            'SystemSettings': window.SystemSettings
        };

        const PageComponent = pageComponents[currentPage] || window.Dashboard;
        
        if (PageComponent) {
            return React.createElement(PageComponent);
        } else {
            // 404页面
            return React.createElement('div', {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '60vh',
                    textAlign: 'center'
                }
            }, [
                React.createElement('div', {
                    key: 'icon',
                    style: { fontSize: '64px', marginBottom: '16px' }
                }, '🚧'),
                React.createElement('h2', {
                    key: 'title',
                    style: { 
                        color: 'var(--ruoyi-text-primary)',
                        marginBottom: '8px'
                    }
                }, '页面开发中'),
                React.createElement('p', {
                    key: 'description',
                    style: { 
                        color: 'var(--ruoyi-text-secondary)',
                        marginBottom: '24px'
                    }
                }, `${currentPage} 页面正在开发中，敬请期待...`),
                React.createElement('button', {
                    key: 'back-btn',
                    onClick: () => handlePageChange('dashboard'),
                    style: {
                        padding: '8px 16px',
                        background: 'var(--ruoyi-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }
                }, '返回首页')
            ]);
        }
    };

    // 响应式处理
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // 初始化检查

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return React.createElement(ErrorBoundary, {}, 
        React.createElement(Layout, {
            className: 'app-container',
            style: { minHeight: '100vh' }
        }, [
            // 左侧导航栏
            React.createElement(Sider, {
                key: 'sider',
                width: collapsed ? 64 : 260,
                collapsed: collapsed,
                collapsible: false,
                style: {
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1001,
                    background: '#001529'
                }
            }, React.createElement(Navigation, {
                currentPage: currentPage,
                onPageChange: handlePageChange,
                collapsed: collapsed,
                onToggleCollapse: handleToggleCollapse
            })),

            // 右侧主体内容
            React.createElement(Layout, {
                key: 'main',
                className: 'main-content',
                style: { 
                    marginLeft: collapsed ? 64 : 260,
                    transition: 'margin-left 0.2s ease',
                    minHeight: '100vh'
                }
            }, [
                // 顶部操作栏
                React.createElement(Header, {
                    key: 'header',
                    style: { 
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        left: collapsed ? 64 : 260,
                        zIndex: 1000,
                        padding: 0,
                        height: 50,
                        transition: 'left 0.2s ease',
                        background: 'var(--ruoyi-bg-white)',
                        borderBottom: '1px solid var(--ruoyi-border-lighter)',
                        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
                    }
                }, React.createElement(TopBar, {
                    currentPage: currentPage,
                    user: user,
                    notifications: notifications,
                    onSearch: handleSearch,
                    onNotificationClick: handleNotificationClick,
                    onLogout: handleLogout
                })),

                // 主内容区域
                React.createElement(Content, {
                    key: 'content',
                    style: {
                        marginTop: 50,
                        padding: '24px',
                        background: 'var(--ruoyi-bg-page)',
                        minHeight: 'calc(100vh - 50px)',
                        overflow: 'auto'
                    }
                }, [
                    // 添加内容包装器，便于统一样式
                    React.createElement('div', {
                        key: 'content-wrapper',
                        className: 'page-content',
                        style: {
                            maxWidth: '100%',
                            margin: '0 auto',
                            animation: 'fadeIn 0.3s ease-out'
                        }
                    }, renderContent())
                ])
            ])
        ])
    );
};

window.App = App; 