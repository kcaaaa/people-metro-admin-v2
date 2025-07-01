// 主应用组件
const App = () => {
    const { Layout } = antd;
    const { Sider, Header, Content } = Layout;
    
    const [currentPage, setCurrentPage] = React.useState('dashboard');
    const [collapsed, setCollapsed] = React.useState(false);
    const [user, setUser] = React.useState({ name: '管理员', role: 'admin' });
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

    const handlePageChange = (page) => {
        console.log('页面切换到:', page);
        setCurrentPage(page);
    };

    const handleToggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const handleSearch = (value) => {
        console.log('搜索:', value);
        // 这里可以实现全局搜索逻辑
    };

    const handleNotificationClick = () => {
        console.log('查看全部通知');
        // 这里可以实现通知页面跳转
    };

    const renderContent = () => {
        switch(currentPage) {
            case 'dashboard':
            case 'Dashboard':
                return React.createElement(window.Dashboard);
            case 'review':
            case 'review-image':
            case 'review-video':
            case 'review-interaction':
            case 'review-mechanism':
            case 'ReviewManagement':
                return React.createElement(window.ReviewManagement);
            case 'live':
            case 'LiveManagement':
                return React.createElement(window.LiveManagement);
            case 'user':
            case 'UserManagement':
                return React.createElement(window.UserManagement);
            case 'profile':
            case 'UserProfile':
                return React.createElement(window.UserProfile);
            case 'stats':
            case 'BehaviorStats':
                return React.createElement(window.BehaviorStats);
            case 'data':
            case 'DataManagement':
                return React.createElement(window.DataManagement);
            case 'settings':
            case 'SystemSettings':
                return React.createElement(window.SystemSettings);
            default:
                return React.createElement(window.Dashboard);
        }
    };

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
                    onSearch: handleSearch,
                    onNotificationClick: handleNotificationClick
                })),

                // 主内容区
                React.createElement(Content, {
                    key: 'content',
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

window.App = App; 