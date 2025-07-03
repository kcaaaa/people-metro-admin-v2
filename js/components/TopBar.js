// RuoYi风格顶部操作栏组件
const TopBar = ({ currentPage, user, notifications, onNotificationClick, onLogout, onPageChange }) => {
    const { Badge, Dropdown, Avatar, Space, Button, Tooltip, Modal, Input, Breadcrumb, message } = antd;
    const { confirm } = Modal;
    
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
        'exhibitor': { title: '展商管理', breadcrumb: ['展会管理', '展商管理'] },
        'exhibitor-maintenance': { title: '展商维护', breadcrumb: ['展会管理', '展商维护'] },
        'live': { title: '论坛直播', breadcrumb: ['展会管理', '论坛直播'] },
        'stats': { title: '行为统计', breadcrumb: ['运营管理', '行为统计'] },
        'operational': { title: '运营数据统计', breadcrumb: ['运营管理', '运营数据统计'] },
        'data': { title: '运营数据管理', breadcrumb: ['运营管理', '运营数据管理'] },
        'feedback': { title: '用户反馈管理', breadcrumb: ['运营管理', '用户反馈管理'] },
        'message': { title: '消息管理', breadcrumb: ['运营管理', '消息管理'] },
        'user': { title: '用户管理', breadcrumb: ['系统管理', '用户管理'] },
        'admin': { title: '权限管理', breadcrumb: ['系统管理', '权限管理'] },
        'logs': { title: '日志管理', breadcrumb: ['系统管理', '日志管理'] },
        'settings': { title: '系统设置', breadcrumb: ['系统管理', '系统设置'] },
        'version': { title: 'APP版本管理', breadcrumb: ['系统管理', 'APP版本管理'] },
        'traffic': { title: '流量分配', breadcrumb: ['系统管理', '流量分配'] },
        'menu': { title: '菜单管理', breadcrumb: ['系统管理', '菜单管理'] },
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
                handleLogout();
                break;
            default:
                break;
        }
    };

    // 通知菜单配置
    const getNotificationItems = () => {
        if (!notifications || notifications.length === 0) {
            return [
                {
                    key: 'empty',
                    label: React.createElement('div', {
                        style: {
                            textAlign: 'center',
                            padding: '20px',
                            color: 'var(--ruoyi-text-secondary)'
                        }
                    }, [
                        React.createElement('div', { key: 'icon', style: { fontSize: '24px', marginBottom: '8px' } }, '📭'),
                        React.createElement('div', { key: 'text' }, '暂无通知')
                    ])
                }
            ];
        }

        const items = notifications.slice(0, 5).map((notif, i) => ({
            key: `notif-${i}`,
            label: React.createElement('div', {
                style: {
                    padding: '8px 4px',
                    borderBottom: i < Math.min(4, notifications.length - 1) ? '1px solid var(--ruoyi-border-extra-light)' : 'none'
                }
            }, [
                React.createElement('div', {
                    key: 'header',
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                    }
                }, [
                    React.createElement('span', {
                        key: 'title',
                        style: {
                            fontWeight: '500',
                            color: 'var(--ruoyi-text-primary)',
                            fontSize: '13px'
                        }
                    }, notif.title),
                    React.createElement('span', {
                        key: 'badge',
                        style: {
                            display: 'inline-block',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: notif.read ? 'transparent' : 'var(--ruoyi-danger)',
                            marginLeft: '8px'
                        }
                    })
                ]),
                React.createElement('div', {
                    key: 'content',
                    style: {
                        fontSize: '12px',
                        color: 'var(--ruoyi-text-secondary)',
                        lineHeight: '1.4',
                        marginBottom: '4px'
                    }
                }, notif.content),
                React.createElement('div', {
                    key: 'time',
                    style: {
                        fontSize: '11px',
                        color: 'var(--ruoyi-text-placeholder)'
                    }
                }, notif.time || '刚刚')
            ])
        }));

        // 添加"查看全部"选项
        if (notifications.length > 0) {
            items.push({ type: 'divider' });
            items.push({
                key: 'view-all',
                label: React.createElement('div', {
                    style: {
                        textAlign: 'center',
                        padding: '8px',
                        color: 'var(--ruoyi-primary)',
                        fontSize: '13px',
                        fontWeight: '500'
                    }
                }, '查看全部通知')
            });
        }

        return items;
    };

    const notificationMenu = {
        items: getNotificationItems(),
        onClick: ({ key }) => {
            if (key === 'view-all') {
                console.log('查看全部通知');
                if (onNotificationClick) {
                    onNotificationClick();
                }
            } else if (key.startsWith('notif-')) {
                console.log('点击通知:', key);
            }
        }
    };
    
    // 计算未读通知数量
    const unreadCount = notifications?.filter(n => !n.read).length || 0;
    const displayName = user?.name || user?.username || '管理员';

    // 处理退出登录
    const handleLogout = () => {
        confirm({
            title: '确认退出',
            content: '您确定要退出登录吗？退出后需要重新登录。',
            okText: '确定退出',
            cancelText: '取消',
            onOk() {
                message.loading('正在退出...');
                onLogout && onLogout();
            }
        });
    };

    return React.createElement('div', {
        className: 'top-bar',
        style: {
            background: 'var(--ruoyi-bg-white)',
            borderBottom: '1px solid var(--ruoyi-border-lighter)',
            padding: '0 24px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1000,
            boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
        }
    }, [
        // 左侧 - 面包屑导航
        React.createElement('div', {
            key: 'left',
            className: 'top-bar-left',
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flex: 1
            }
        }, [
            // 面包屑导航
            React.createElement(Breadcrumb, {
                key: 'breadcrumb',
                style: { margin: 0 },
                items: currentPageInfo.breadcrumb.map((item, index) => ({
                    title: React.createElement('span', {
                        style: {
                            color: index === currentPageInfo.breadcrumb.length - 1 
                                ? 'var(--ruoyi-text-primary)' 
                                : 'var(--ruoyi-text-secondary)',
                            fontWeight: index === currentPageInfo.breadcrumb.length - 1 ? '500' : '400',
                            fontSize: '14px'
                        }
                    }, item)
                }))
            }),
            
            // 页面标题（可选显示）
            React.createElement('div', {
                key: 'page-title',
                style: {
                    height: '20px',
                    width: '1px',
                    background: 'var(--ruoyi-border-base)',
                    margin: '0 8px'
                }
            }),
            React.createElement('span', {
                key: 'current-title',
                style: {
                    fontSize: '14px',
                    color: 'var(--ruoyi-text-regular)',
                    fontWeight: '400'
                }
            }, currentPageInfo.title)
        ]),

        // 右侧 - 操作区域
        React.createElement('div', {
            key: 'right',
            className: 'top-bar-right',
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }
        }, [
            // 通知中心
            React.createElement(Dropdown, {
                key: 'notifications',
                menu: notificationMenu,
                trigger: ['click'],
                placement: 'bottomRight',
                overlayStyle: {
                    width: '300px'
                }
            }, React.createElement(Tooltip, {
                title: '通知中心'
            }, React.createElement(Badge, {
                count: unreadCount,
                size: 'small',
                offset: [-2, 2]
            }, React.createElement(Button, {
                type: 'text',
                shape: 'circle',
                size: 'small',
                style: {
                    color: 'var(--ruoyi-text-secondary)',
                    border: 'none',
                    background: 'transparent'
                }
            }, '🔔')))),

            // 分隔线
            React.createElement('div', {
                key: 'divider',
                style: {
                    height: '16px',
                    width: '1px',
                    background: 'var(--ruoyi-border-base)',
                    margin: '0 4px'
                }
            }),

            // 用户信息
            React.createElement(Dropdown, {
                key: 'user-menu',
                menu: { items: userMenuItems, onClick: handleUserMenuClick },
                trigger: ['click'],
                placement: 'bottomRight'
            }, React.createElement('div', {
                className: 'user-info',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: 'var(--ruoyi-border-radius-base)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ':hover': {
                        background: 'var(--ruoyi-bg-lighter)'
                    }
                }
            }, [
                React.createElement('div', {
                    key: 'avatar',
                    className: 'user-avatar',
                    style: {
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'var(--ruoyi-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '500'
                    }
                }, displayName.charAt(0).toUpperCase()),
                React.createElement('span', {
                    key: 'name',
                    style: {
                        fontSize: '14px',
                        color: 'var(--ruoyi-text-primary)',
                        fontWeight: '400',
                        maxWidth: '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }
                }, displayName),
                React.createElement('span', {
                    key: 'arrow',
                    style: {
                        fontSize: '10px',
                        color: 'var(--ruoyi-text-placeholder)',
                        transform: 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                    }
                }, '▼')
            ]))
        ])
    ]);
};

window.TopBar = TopBar; 