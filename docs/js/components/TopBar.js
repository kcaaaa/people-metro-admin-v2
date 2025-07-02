// RuoYi风格顶部操作栏组件
const TopBar = ({ currentPage, user, notifications, onSearch, onNotificationClick, onLogout, onPageChange }) => {
    const { Badge, Dropdown, Avatar, Space, Button, Tooltip, Modal, Input, Breadcrumb } = antd;
    const { Search } = Input;
    
    // 页面标题映射 - 用于面包屑导航
    const pageTitleMap = {
        'dashboard': { title: '首页', breadcrumb: ['首页'] },
        'content': { title: '内容管理', breadcrumb: ['内容管理', '内容管理'] },
        'complaint': { title: '投诉管理', breadcrumb: ['内容管理', '投诉管理'] },
        'content-tags': { title: '内容标签', breadcrumb: ['内容管理', '内容标签'] },
        'review': { title: 'AI审核', breadcrumb: ['审核管理', 'AI审核'] },
        'exhibition-audit': { title: '展会内容审核', breadcrumb: ['审核管理', '展会内容审核'] },
        'audit-flow': { title: '审核流程', breadcrumb: ['审核管理', '审核流程'] },
        'booth': { title: '展位管理', breadcrumb: ['展会管理', '展位管理'] },
        'live': { title: '论坛直播', breadcrumb: ['展会管理', '论坛直播'] },
        'stats': { title: '行为统计', breadcrumb: ['运营统计', '行为统计'] },
        'operational': { title: '运营数据统计', breadcrumb: ['运营统计', '运营数据统计'] },
        'data': { title: '运营数据管理', breadcrumb: ['运营统计', '运营数据管理'] },
        'feedback': { title: '用户反馈管理', breadcrumb: ['运营统计', '用户反馈管理'] },
        'message': { title: '消息管理', breadcrumb: ['运营统计', '消息管理'] },
        'user': { title: '用户管理', breadcrumb: ['系统管理', '用户管理'] },
        'admin': { title: '权限管理', breadcrumb: ['系统管理', '权限管理'] },
        'logs': { title: '日志管理', breadcrumb: ['系统管理', '日志管理'] },
        'settings': { title: '系统设置', breadcrumb: ['系统管理', '系统设置'] },
        'version': { title: 'APP版本管理', breadcrumb: ['系统管理', 'APP版本管理'] },
        'traffic': { title: '流量分配', breadcrumb: ['系统管理', '流量分配'] },
        'personal-center': { title: '个人中心', breadcrumb: ['个人中心'] },
        'profile': { title: '用户画像', breadcrumb: ['用户画像分析'] }
    };

    const currentPageInfo = pageTitleMap[currentPage] || { title: '未知页面', breadcrumb: ['未知页面'] };
    
    // 用户菜单配置
    const userMenuItems = [
        {
            key: 'profile',
            label: React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', gap: '8px' }
            }, [
                React.createElement('span', { key: 'icon' }, '👤'),
                React.createElement('span', { key: 'text' }, '个人中心')
            ])
        },
        {
            key: 'settings',
            label: React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', gap: '8px' }
            }, [
                React.createElement('span', { key: 'icon' }, '⚙️'),
                React.createElement('span', { key: 'text' }, '账户设置')
            ])
        },
        { type: 'divider' },
        {
            key: 'logout',
            label: React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d4f' }
            }, [
                React.createElement('span', { key: 'icon' }, '🚪'),
                React.createElement('span', { key: 'text' }, '退出登录')
            ]),
            danger: true
        }
    ];

    const handleUserMenuClick = ({ key }) => {
        switch(key) {
            case 'profile':
                console.log('跳转到个人中心');
                if (onPageChange) {
                    onPageChange('personal-center');
                }
                break;
            case 'settings':
                console.log('跳转到账户设置');
                if (onPageChange) {
                    onPageChange('personal-center');
                }
                break;
            case 'logout':
                Modal.confirm({
                    title: '确认退出',
                    content: '您确定要退出登录吗？退出后需要重新登录。',
                    okText: '确定退出',
                    cancelText: '取消',
                    okType: 'danger',
                    icon: React.createElement('span', { style: { fontSize: '18px' } }, '⚠️'),
                    onOk: () => {
                        console.log('用户确认退出');
                        if (onLogout) {
                            onLogout();
                        } else {
                            // 模拟退出登录
                            window.location.reload();
                        }
                    },
                });
                break;
            default:
                break;
        }
    };

    const userMenu = { items: userMenuItems, onClick: handleUserMenuClick };

    // 通知菜单
    const notificationItems = notifications?.length > 0
        ? [
            ...notifications.slice(0, 5).map((notif, i) => ({
                key: `notif-${i}`,
                label: React.createElement('div', {},
                    React.createElement('div', { style: { fontWeight: 'bold' } }, notif.title),
                    React.createElement('div', { style: { fontSize: '12px' } }, notif.content)
                ),
            })),
            { type: 'divider' },
            { key: 'view-all', label: React.createElement('div', { style: { textAlign: 'center' } }, '查看全部') },
        ]
        : [{ key: 'empty', label: React.createElement('div', { style: { textAlign: 'center', padding: '12px' } }, '暂无通知') }];

    const notificationMenu = { items: notificationItems, onClick: onNotificationClick };
    
    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    const displayName = user?.name || user?.username || '管理员';

    return React.createElement('div', { className: 'top-bar' },
        // Left Side
        React.createElement('div', { className: 'top-bar-left' },
            React.createElement('h1', { className: 'page-title-in-bar' }, '运营管理后台'),
        ),
        // Right Side
        React.createElement('div', { className: 'top-bar-right' },
            React.createElement(Space, { size: "middle" },
                React.createElement(Tooltip, { title: "帮助文档" },
                    React.createElement(Button, { 
                        shape: 'circle',
                        onClick: () => window.open('https://github.com/kcaaaa/renmin-chenggui-admin/wiki', '_blank')
                    }, '❓')
                ),
                React.createElement(Dropdown, { menu: notificationMenu, trigger: ['click'] },
                    React.createElement(Tooltip, { title: "通知" },
                        React.createElement(Badge, { count: unreadCount, size: 'small' },
                            React.createElement(Button, { shape: 'circle' }, '🔔')
                        )
                    )
                ),
                React.createElement(Dropdown, { menu: userMenu, trigger: ['click'] },
                    React.createElement(Space, { style: { cursor: 'pointer' } },
                        React.createElement(Avatar, {
                            style: { backgroundColor: '#1890ff' },
                            size: 'default'
                        }, displayName.charAt(0)),
                        React.createElement('span', {}, displayName)
                    )
                )
            )
        )
    );
};

window.TopBar = TopBar; 