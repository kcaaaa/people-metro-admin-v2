// 增强版首页页面 - 完全可交互
const Dashboard = () => {
    const { Row, Col, Card, Statistic, Button, Space, Alert, Progress, Tooltip, Modal, Form, Select, DatePicker, message, Tabs, Table } = antd;
    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const { TabPane } = Tabs;
    
    const [stats, setStats] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [alerts, setAlerts] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [exportModalVisible, setExportModalVisible] = React.useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = React.useState(false);
    const [quickActionsLoading, setQuickActionsLoading] = React.useState({});
    const [recentActivities, setRecentActivities] = React.useState([]);
    const [systemHealth, setSystemHealth] = React.useState({});
    const [exportForm] = Form.useForm();
    const [settingsForm] = Form.useForm();

    React.useEffect(() => {
        loadDashboardData();
        loadRecentActivities();
        loadSystemHealth();
        
        // 定时刷新数据
        const interval = setInterval(() => {
            if (!refreshing) {
                loadDashboardData(true); // 静默刷新
            }
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // 加载仪表板数据
    const loadDashboardData = async (silent = false) => {
        if (!silent) setLoading(true);
        
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, silent ? 200 : 1000));
            
            setStats(MockData.getDashboardStats());
            setAlerts([
                {
                    id: 1,
                    type: 'warning',
                    message: '审核队列积压',
                    description: '当前待审核内容超过1000条，建议及时处理',
                    time: '5分钟前',
                    actionable: true,
                    action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'review' }))
                },
                {
                    id: 2,
                    type: 'info',
                    message: '系统维护通知',
                    description: '系统将于今晚24:00进行例行维护，预计耗时2小时',
                    time: '1小时前',
                    actionable: false
                },
                {
                    id: 3,
                    type: 'success',
                    message: '数据备份完成',
                    description: '今日数据备份已完成，备份文件大小：2.3GB',
                    time: '2小时前',
                    actionable: false
                }
            ]);
            
            if (!silent) {
                message.success('数据刷新完成');
            }
        } catch (error) {
            message.error('数据加载失败');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    // 加载近期活动
    const loadRecentActivities = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setRecentActivities([
                {
                    id: 1,
                    type: 'user_register',
                    title: '新用户注册',
                    description: '用户"张三"完成注册并通过审核',
                    time: '10分钟前',
                    icon: '👤'
                },
                {
                    id: 2,
                    type: 'content_publish',
                    title: '内容发布',
                    description: '发布了新视频"城轨建设进展"',
                    time: '25分钟前',
                    icon: '📹'
                },
                {
                    id: 3,
                    type: 'audit_complete',
                    title: '审核完成',
                    description: '批量审核了15条待审核内容',
                    time: '1小时前',
                    icon: '✅'
                },
                {
                    id: 4,
                    type: 'live_start',
                    title: '直播开始',
                    description: '展会直播"轨道交通展览"开始播出',
                    time: '2小时前',
                    icon: '🎬'
                }
            ]);
        } catch (error) {
            console.error('加载近期活动失败:', error);
        }
    };

    // 加载系统健康状态
    const loadSystemHealth = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            setSystemHealth({
                cpu: { usage: 65, status: 'normal' },
                memory: { usage: 78, status: 'warning' },
                disk: { usage: 45, status: 'normal' },
                network: { usage: 32, status: 'normal' },
                database: { responseTime: 120, status: 'normal' },
                api: { responseTime: 85, status: 'normal' }
            });
        } catch (error) {
            console.error('加载系统健康状态失败:', error);
        }
    };

    // 手动刷新数据
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                loadDashboardData(),
                loadRecentActivities(),
                loadSystemHealth()
            ]);
        } finally {
            setRefreshing(false);
        }
    };

    // 导出报表
    const handleExport = () => {
        setExportModalVisible(true);
    };

    // 确认导出
    const handleExportConfirm = async () => {
        try {
            const values = await exportForm.validateFields();
            message.loading('正在生成报表...', 0);
            
            // 模拟导出过程
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            message.destroy();
            message.success('报表导出成功！文件已保存到下载目录');
            setExportModalVisible(false);
            exportForm.resetFields();
        } catch (error) {
            message.error('导出失败，请稍后重试');
        }
    };

    // 打开设置
    const handleSettings = () => {
        setSettingsModalVisible(true);
        // 加载当前设置
        settingsForm.setFieldsValue({
            refreshInterval: 30,
            alertLevel: 'medium',
            dataRetention: 90,
            autoBackup: true
        });
    };

    // 保存设置
    const handleSettingsSave = async () => {
        try {
            const values = await settingsForm.validateFields();
            message.loading('正在保存设置...', 0);
            
            // 模拟保存过程
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.destroy();
            message.success('设置保存成功');
            setSettingsModalVisible(false);
        } catch (error) {
            message.error('设置保存失败');
        }
    };

    // 快捷操作处理
    const handleQuickAction = async (action) => {
        setQuickActionsLoading(prev => ({ ...prev, [action]: true }));
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            switch (action) {
                case 'batch-review':
                    message.success('批量审核已启动，正在后台处理...');
                    // 这里可以跳转到审核页面
                    break;
                case 'user-export':
                    message.success('用户数据导出已开始，完成后将通知您');
                    break;
                case 'backup':
                    message.success('数据备份已启动，预计需要10分钟');
                    break;
                case 'system-check':
                    message.success('系统健康检查完成，所有服务运行正常');
                    await loadSystemHealth(); // 重新加载系统状态
                    break;
                default:
                    message.info(`执行操作: ${action}`);
            }
        } catch (error) {
            message.error('操作执行失败');
        } finally {
            setQuickActionsLoading(prev => ({ ...prev, [action]: false }));
        }
    };

    // 处理告警操作
    const handleAlertAction = (alert) => {
        if (alert.actionable && alert.action) {
            alert.action();
        }
        
        // 关闭告警
        setAlerts(prev => prev.filter(a => a.id !== alert.id));
        message.success('告警已处理');
    };

    // 统计卡片配置
    const statCards = [
        {
            key: 'pendingReview',
            title: '待审核内容',
            value: stats.pendingReview?.value || 0,
            change: stats.pendingReview?.change || '0%',
            trend: stats.pendingReview?.trend || 'stable',
            icon: '🔍',
            color: '#f59e42',
            clickable: true,
            onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'review' }))
        },
        {
            key: 'activeUsers',
            title: '活跃用户',
            value: stats.activeUsers?.value || 0,
            change: stats.activeUsers?.change || '0%',
            trend: stats.activeUsers?.trend || 'stable',
            icon: '👥',
            color: '#22c55e',
            clickable: true,
            onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'user' }))
        },
        {
            key: 'violationRate',
            title: '违规率',
            value: `${stats.violationRate?.value || 0}%`,
            change: stats.violationRate?.change || '0%',
            trend: stats.violationRate?.trend || 'stable',
            icon: '⚠️',
            color: '#ef4444',
            clickable: true,
            onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'logs' }))
        },
        {
            key: 'contentPublished',
            title: '内容发布',
            value: stats.contentPublished?.value || 0,
            change: stats.contentPublished?.change || '0%',
            trend: stats.contentPublished?.trend || 'stable',
            icon: '📝',
            color: '#2563eb',
            clickable: true,
            onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'content' }))
        },
        {
            key: 'liveCount',
            title: '今日直播',
            value: stats.liveCount?.value || 0,
            change: stats.liveCount?.change || '0%',
            trend: stats.liveCount?.trend || 'stable',
            icon: '🎥',
            color: '#f59e42',
            clickable: true,
            onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'live' }))
        },
        {
            key: 'exhibitionData',
            title: '展会数据',
            value: stats.exhibitionData?.value || 0,
            change: stats.exhibitionData?.change || '0',
            trend: stats.exhibitionData?.trend || 'stable',
            icon: '🏢',
            color: '#8b5cf6',
            clickable: true,
            onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'booth' }))
        }
    ];

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return '📈';
            case 'down': return '📉';
            default: return '➡️';
        }
    };

    const getTrendColor = (trend) => {
        switch (trend) {
            case 'up': return '#22c55e';
            case 'down': return '#ef4444';
            default: return '#64748b';
        }
    };

    const getSystemHealthColor = (status) => {
        switch (status) {
            case 'normal': return '#22c55e';
            case 'warning': return '#f59e42';
            case 'error': return '#ef4444';
            default: return '#64748b';
        }
    };

    const renderStatCard = (card) => {
        return React.createElement(Col, {
            key: card.key,
            xs: 24,
            sm: 12,
            md: 8,
            lg: 8,
            xl: 4
        }, React.createElement(Card, {
            className: 'dashboard-card',
            hoverable: card.clickable,
            loading: loading,
            style: { 
                height: '140px',
                cursor: card.clickable ? 'pointer' : 'default'
            },
            bodyStyle: { padding: '20px' },
            onClick: card.clickable ? card.onClick : undefined
        }, [
            React.createElement('div', {
                key: 'content',
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                }
            }, [
                React.createElement('div', {
                    key: 'info',
                    style: { flex: 1 }
                }, [
                    React.createElement('div', {
                        key: 'title',
                        style: {
                            fontSize: '14px',
                            color: '#64748b',
                            marginBottom: '8px'
                        }
                    }, card.title),
                    React.createElement(Statistic, {
                        key: 'value',
                        value: card.value,
                        valueStyle: {
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: card.color
                        }
                    }),
                    React.createElement('div', {
                        key: 'change',
                        style: {
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '12px',
                            color: getTrendColor(card.trend)
                        }
                    }, [
                        React.createElement('span', {
                            key: 'icon',
                            style: { marginRight: '4px' }
                        }, getTrendIcon(card.trend)),
                        React.createElement('span', {
                            key: 'text'
                        }, card.change)
                    ])
                ]),
                React.createElement('div', {
                    key: 'icon',
                    style: {
                        fontSize: '32px',
                        opacity: 0.6
                    }
                }, card.icon)
            ])
        ]));
    };

    // 监听导航事件
    React.useEffect(() => {
        const handleNavigation = (event) => {
            const targetPage = event.detail;
            if (window.App && typeof window.App === 'function') {
                // 触发页面切换逻辑
                console.log('触发页面切换:', targetPage);
                // 这里需要调用App组件的页面切换函数
                // 暂时使用消息提示
                message.info(`导航到: ${targetPage} 页面`);
            }
        };

        window.addEventListener('navigate', handleNavigation);
        return () => window.removeEventListener('navigate', handleNavigation);
    }, []);

    return React.createElement('div', {
        style: { padding: '0' }
    }, [
        // 页面标题和快捷操作
        React.createElement('div', {
            key: 'header',
            style: {
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: {
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1e293b'
                }
            }, '系统首页'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Tooltip, {
                    key: 'refresh',
                    title: '刷新数据'
                }, React.createElement(Button, {
                    icon: React.createElement('span', {}, '🔄'),
                    loading: refreshing,
                    onClick: handleRefresh
                }, '刷新')),
                React.createElement(Tooltip, {
                    key: 'export',
                    title: '导出报表'
                }, React.createElement(Button, {
                    type: 'primary',
                    icon: React.createElement('span', {}, '📊'),
                    onClick: handleExport
                }, '导出报表')),
                React.createElement(Tooltip, {
                    key: 'settings',
                    title: '首页设置'
                }, React.createElement(Button, {
                    icon: React.createElement('span', {}, '⚙️'),
                    onClick: handleSettings
                }, '设置'))
            ])
        ]),

        // 报警通知区域
        alerts.length > 0 && React.createElement('div', {
            key: 'alerts',
            style: { marginBottom: '24px' }
        }, alerts.map((alert) => 
            React.createElement(Alert, {
                key: `alert-${alert.id}`,
                type: alert.type,
                message: alert.message,
                description: alert.description,
                showIcon: true,
                closable: true,
                style: { marginBottom: '8px' },
                onClose: () => setAlerts(prev => prev.filter(a => a.id !== alert.id)),
                action: alert.actionable ? React.createElement(Button, {
                    size: 'small',
                    type: 'text',
                    onClick: () => handleAlertAction(alert)
                }, '处理') : null
            })
        )),

        // 统计卡片
        React.createElement(Row, {
            key: 'stats',
            gutter: [16, 16],
            style: { marginBottom: '24px' }
        }, statCards.map(renderStatCard)),

        // 主要内容区域
        React.createElement(Row, {
            key: 'main-content',
            gutter: [16, 16]
        }, [
            // 左侧主要区域
            React.createElement(Col, {
                key: 'main',
                xs: 24,
                lg: 16
            }, React.createElement(Tabs, {
                defaultActiveKey: 'trend'
            }, [
                React.createElement(TabPane, {
                    key: 'trend',
                    tab: '📈 数据趋势'
                }, React.createElement(Card, {
                    extra: React.createElement(Space, {}, [
                        React.createElement(Button, {
                            key: 'week',
                            size: 'small',
                            type: 'primary'
                        }, '7天'),
                        React.createElement(Button, {
                            key: 'month',
                            size: 'small'
                        }, '30天')
                    ])
                }, React.createElement('div', {
                    style: {
                        height: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8fafc',
                        borderRadius: '4px'
                    }
                }, React.createElement('div', {
                    style: { textAlign: 'center', color: '#64748b' }
                }, [
                    React.createElement('div', {
                        key: 'icon',
                        style: { fontSize: '48px', marginBottom: '16px' }
                    }, '📈'),
                    React.createElement('div', {
                        key: 'text'
                    }, '数据趋势图表区域'),
                    React.createElement('div', {
                        key: 'desc',
                        style: { marginTop: '8px', fontSize: '12px' }
                    }, '点击上方按钮切换时间范围')
                ])))),
                
                React.createElement(TabPane, {
                    key: 'activities',
                    tab: '📝 近期活动'
                }, React.createElement(Card, {}, React.createElement('div', {
                    style: { maxHeight: '300px', overflowY: 'auto' }
                }, recentActivities.map(activity =>
                    React.createElement('div', {
                        key: activity.id,
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 0',
                            borderBottom: '1px solid #f0f0f0'
                        }
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            style: {
                                fontSize: '24px',
                                marginRight: '12px',
                                width: '40px',
                                textAlign: 'center'
                            }
                        }, activity.icon),
                        React.createElement('div', {
                            key: 'content',
                            style: { flex: 1 }
                        }, [
                            React.createElement('div', {
                                key: 'title',
                                style: { fontWeight: 'bold', marginBottom: '4px' }
                            }, activity.title),
                            React.createElement('div', {
                                key: 'desc',
                                style: { fontSize: '14px', color: '#666' }
                            }, activity.description),
                            React.createElement('div', {
                                key: 'time',
                                style: { fontSize: '12px', color: '#999', marginTop: '4px' }
                            }, activity.time)
                        ])
                    ])
                ))))
            ])),

            // 右侧操作面板
            React.createElement(Col, {
                key: 'sidebar',
                xs: 24,
                lg: 8
            }, [
                // 快捷操作
                React.createElement(Card, {
                    key: 'quick-actions',
                    title: '快捷操作',
                    style: { marginBottom: '16px' }
                }, React.createElement(Space, {
                    direction: 'vertical',
                    style: { width: '100%' },
                    size: 'middle'
                }, [
                    React.createElement(Button, {
                        key: 'batch-review',
                        type: 'primary',
                        block: true,
                        size: 'large',
                        icon: React.createElement('span', {}, '🔍'),
                        loading: quickActionsLoading['batch-review'],
                        onClick: () => handleQuickAction('batch-review')
                    }, '批量审核'),
                    React.createElement(Button, {
                        key: 'user-export',
                        block: true,
                        size: 'large',
                        icon: React.createElement('span', {}, '👥'),
                        loading: quickActionsLoading['user-export'],
                        onClick: () => handleQuickAction('user-export')
                    }, '用户数据导出'),
                    React.createElement(Button, {
                        key: 'backup',
                        block: true,
                        size: 'large',
                        icon: React.createElement('span', {}, '💾'),
                        loading: quickActionsLoading['backup'],
                        onClick: () => handleQuickAction('backup')
                    }, '数据备份'),
                    React.createElement(Button, {
                        key: 'system-check',
                        block: true,
                        size: 'large',
                        icon: React.createElement('span', {}, '🔧'),
                        loading: quickActionsLoading['system-check'],
                        onClick: () => handleQuickAction('system-check')
                    }, '系统健康检查')
                ])),

                // 系统状态
                React.createElement(Card, {
                    key: 'system-status',
                    title: '系统状态',
                    extra: React.createElement(Button, {
                        size: 'small',
                        type: 'text',
                        icon: React.createElement('span', {}, '🔄'),
                        onClick: loadSystemHealth
                    }, '刷新')
                }, React.createElement('div', {}, [
                    Object.entries(systemHealth).map(([key, value]) => {
                        const labels = {
                            cpu: 'CPU使用率',
                            memory: '内存使用率',
                            disk: '磁盘使用率',
                            network: '网络使用率',
                            database: '数据库响应',
                            api: 'API响应时间'
                        };
                        
                        return React.createElement('div', {
                            key: key,
                            style: { marginBottom: '12px' }
                        }, [
                            React.createElement('div', {
                                key: 'label',
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '4px'
                                }
                            }, [
                                React.createElement('span', {
                                    key: 'name',
                                    style: { fontSize: '12px', color: '#64748b' }
                                }, labels[key]),
                                React.createElement('span', {
                                    key: 'value',
                                    style: {
                                        fontSize: '12px',
                                        color: getSystemHealthColor(value.status)
                                    }
                                }, value.usage ? `${value.usage}%` : `${value.responseTime}ms`)
                            ]),
                            React.createElement(Progress, {
                                key: 'progress',
                                percent: value.usage || Math.min(value.responseTime, 100),
                                size: 'small',
                                strokeColor: getSystemHealthColor(value.status),
                                showInfo: false
                            })
                        ]);
                    })
                ]))
            ])
        ]),

        // 导出报表模态框
        React.createElement(Modal, {
            key: 'export-modal',
            title: '导出报表',
            visible: exportModalVisible,
            onOk: handleExportConfirm,
            onCancel: () => setExportModalVisible(false),
            width: 500
        }, React.createElement(Form, {
            form: exportForm,
            layout: 'vertical'
        }, [
            React.createElement(Form.Item, {
                key: 'type',
                name: 'reportType',
                label: '报表类型',
                rules: [{ required: true, message: '请选择报表类型' }]
            }, React.createElement(Select, {
                placeholder: '选择报表类型'
            }, [
                React.createElement(Option, { key: 'overview', value: 'overview' }, '总览报表'),
                React.createElement(Option, { key: 'user', value: 'user' }, '用户统计报表'),
                React.createElement(Option, { key: 'content', value: 'content' }, '内容统计报表'),
                React.createElement(Option, { key: 'audit', value: 'audit' }, '审核统计报表')
            ])),
            React.createElement(Form.Item, {
                key: 'range',
                name: 'dateRange',
                label: '时间范围',
                rules: [{ required: true, message: '请选择时间范围' }]
            }, React.createElement(RangePicker, { style: { width: '100%' } })),
            React.createElement(Form.Item, {
                key: 'format',
                name: 'format',
                label: '导出格式',
                initialValue: 'excel'
            }, React.createElement(Select, {}, [
                React.createElement(Option, { key: 'excel', value: 'excel' }, 'Excel (.xlsx)'),
                React.createElement(Option, { key: 'csv', value: 'csv' }, 'CSV (.csv)'),
                React.createElement(Option, { key: 'pdf', value: 'pdf' }, 'PDF (.pdf)')
            ]))
        ])),

        // 设置模态框
        React.createElement(Modal, {
            key: 'settings-modal',
            title: '首页设置',
            visible: settingsModalVisible,
            onOk: handleSettingsSave,
            onCancel: () => setSettingsModalVisible(false),
            width: 500
        }, React.createElement(Form, {
            form: settingsForm,
            layout: 'vertical'
        }, [
            React.createElement(Form.Item, {
                key: 'refresh',
                name: 'refreshInterval',
                label: '数据刷新间隔（秒）'
            }, React.createElement(Select, {}, [
                React.createElement(Option, { key: '10', value: 10 }, '10秒'),
                React.createElement(Option, { key: '30', value: 30 }, '30秒'),
                React.createElement(Option, { key: '60', value: 60 }, '1分钟'),
                React.createElement(Option, { key: '300', value: 300 }, '5分钟')
            ])),
            React.createElement(Form.Item, {
                key: 'alert',
                name: 'alertLevel',
                label: '告警级别'
            }, React.createElement(Select, {}, [
                React.createElement(Option, { key: 'low', value: 'low' }, '低'),
                React.createElement(Option, { key: 'medium', value: 'medium' }, '中'),
                React.createElement(Option, { key: 'high', value: 'high' }, '高')
            ])),
            React.createElement(Form.Item, {
                key: 'retention',
                name: 'dataRetention',
                label: '数据保留天数'
            }, React.createElement(Select, {}, [
                React.createElement(Option, { key: '30', value: 30 }, '30天'),
                React.createElement(Option, { key: '90', value: 90 }, '90天'),
                React.createElement(Option, { key: '180', value: 180 }, '180天'),
                React.createElement(Option, { key: '365', value: 365 }, '1年')
            ]))
        ]))
    ]);
};

window.Dashboard = Dashboard; 