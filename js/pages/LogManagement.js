// 日志管理页面 - 等保三级合规日志管理
const LogManagement = () => {
    console.log('LogManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Tabs, DatePicker, Radio, Switch, TreeSelect, Divider, Statistic, Progress, Tooltip, Descriptions, Badge } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { RangePicker: DateRangePicker } = DatePicker;
    const { TextArea } = Input;
    
    const [activeTab, setActiveTab] = React.useState('audit');
    
    // 状态管理
    const [logModalVisible, setLogModalVisible] = React.useState(false);
    const [configModalVisible, setConfigModalVisible] = React.useState(false);
    const [selectedLog, setSelectedLog] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    
    // 搜索和筛选状态
    const [searchText, setSearchText] = React.useState('');
    const [logTypeFilter, setLogTypeFilter] = React.useState('all');
    const [levelFilter, setLevelFilter] = React.useState('all');
    const [userFilter, setUserFilter] = React.useState('all');
    const [timeRange, setTimeRange] = React.useState(null);
    
    // 模拟数据
    const [logData, setLogData] = React.useState({
        // 安全审计日志
        auditLogs: [
            {
                id: 'audit_001',
                type: 'login',
                level: 'info',
                user: '系统管理员',
                userId: 'admin_001',
                operation: '后台登录',
                ip: '192.168.1.100',
                device: 'Windows 10 - Chrome 120',
                result: 'success',
                details: '管理员成功登录后台系统',
                timestamp: '2024-01-15 09:30:25',
                location: '北京市朝阳区',
                sessionId: 'sess_1234567890'
            },
            {
                id: 'audit_002',
                type: 'permission',
                level: 'warning',
                user: '运营专员',
                userId: 'op_002',
                operation: '权限变更',
                ip: '192.168.1.105',
                device: 'Windows 11 - Edge 118',
                result: 'success',
                details: '为用户"张三"添加了"内容审核"权限',
                timestamp: '2024-01-15 10:15:30',
                targetUser: '张三',
                targetUserId: 'user_12345',
                permissionChange: '添加内容审核权限'
            },
            {
                id: 'audit_003',
                type: 'config',
                level: 'warning',
                user: '系统管理员',
                userId: 'admin_001',
                operation: '系统配置变更',
                ip: '192.168.1.100',
                result: 'success',
                details: 'AI审核阈值从0.8调整为0.7',
                timestamp: '2024-01-15 11:20:15',
                configKey: 'ai_review_threshold',
                oldValue: '0.8',
                newValue: '0.7'
            },
            {
                id: 'audit_004',
                type: 'data_access',
                level: 'info',
                user: '数据分析师',
                userId: 'analyst_001',
                operation: '敏感数据访问',
                ip: '192.168.1.110',
                result: 'success',
                details: '导出了用户行为统计数据（包含1000条记录）',
                timestamp: '2024-01-15 14:45:20',
                dataType: '用户行为数据',
                recordCount: 1000
            },
            {
                id: 'audit_005',
                type: 'abnormal',
                level: 'error',
                user: '未知用户',
                userId: 'unknown',
                operation: '异常登录尝试',
                ip: '203.119.89.156',
                device: 'Unknown Device',
                result: 'failed',
                details: '连续5次密码错误，IP已被临时封禁',
                timestamp: '2024-01-15 15:30:45',
                attemptCount: 5,
                blockDuration: '30分钟'
            }
        ],
        
        // 业务操作日志
        businessLogs: [
            {
                id: 'biz_001',
                type: 'content_review',
                level: 'info',
                user: '审核员A',
                userId: 'reviewer_001',
                operation: '内容审核',
                result: 'approved',
                details: '图文内容审核通过',
                timestamp: '2024-01-15 09:45:30',
                contentId: 'content_12345',
                contentType: '图文',
                contentTitle: '城轨技术发展趋势分析',
                reviewTime: '3分钟',
                aiScore: 85,
                reason: '内容健康，符合平台规范'
            },
            {
                id: 'biz_002',
                type: 'content_publish',
                level: 'info',
                user: '企业用户_华为',
                userId: 'corp_huawei',
                operation: '内容发布',
                result: 'success',
                details: '发布视频内容到展会模块',
                timestamp: '2024-01-15 10:20:15',
                contentId: 'content_12346',
                contentType: '视频',
                contentTitle: '5G技术在轨道交通中的应用',
                publishModule: '展会模块',
                fileSize: '45.2MB',
                duration: '8分30秒'
            },
            {
                id: 'biz_003',
                type: 'user_management',
                level: 'warning',
                user: '用户管理员',
                userId: 'user_admin_001',
                operation: '用户封禁',
                result: 'success',
                details: '因发布违规内容封禁用户7天',
                timestamp: '2024-01-15 11:30:20',
                targetUser: '违规用户123',
                targetUserId: 'user_54321',
                banDuration: '7天',
                banReason: '发布不当内容'
            },
            {
                id: 'biz_004',
                type: 'message_push',
                level: 'info',
                user: '运营专员',
                userId: 'op_002',
                operation: '消息推送',
                result: 'success',
                details: '系统维护通知推送给全体用户',
                timestamp: '2024-01-15 16:00:00',
                messageType: '系统通知',
                targetCount: 125634,
                sentCount: 125634,
                title: '系统维护通知'
            },
            {
                id: 'biz_005',
                type: 'data_export',
                level: 'warning',
                user: '数据分析师',
                userId: 'analyst_001',
                operation: '数据导出',
                result: 'success',
                details: '导出用户注册数据（近30天）',
                timestamp: '2024-01-15 17:15:30',
                dataType: '用户注册数据',
                timeRange: '近30天',
                recordCount: 5678,
                fileFormat: 'Excel'
            }
        ],
        
        // 系统运行日志
        systemLogs: [
            {
                id: 'sys_001',
                type: 'performance',
                level: 'info',
                operation: '系统性能监控',
                details: 'CPU使用率正常，内存使用率偏高',
                timestamp: '2024-01-15 09:00:00',
                cpuUsage: '45%',
                memoryUsage: '78%',
                diskUsage: '60%',
                networkIO: '正常'
            },
            {
                id: 'sys_002',
                type: 'api_call',
                level: 'info',
                operation: 'API调用监控',
                details: 'AI审核服务调用成功',
                timestamp: '2024-01-15 09:30:15',
                apiName: '/api/content/ai-review',
                responseTime: '1.2秒',
                statusCode: 200,
                requestSize: '2.5MB'
            },
            {
                id: 'sys_003',
                type: 'backup',
                level: 'info',
                operation: '数据备份',
                details: '定时数据备份任务执行成功',
                timestamp: '2024-01-15 03:00:00',
                backupType: '增量备份',
                dataSize: '1.2GB',
                duration: '15分钟',
                backupPath: '/backup/20240115/'
            },
            {
                id: 'sys_004',
                type: 'error',
                level: 'error',
                operation: '系统异常',
                details: '数据库连接超时，已自动重连',
                timestamp: '2024-01-15 14:30:45',
                errorCode: 'DB_TIMEOUT',
                affectedUsers: 0,
                recoveryTime: '30秒'
            }
        ],
        
        // 统计数据
        statistics: {
            totalLogs: 125678,
            todayLogs: 2456,
            errorLogs: 23,
            warningLogs: 145,
            criticalEvents: 2,
            storageUsage: 68.5
        }
    });

    React.useEffect(() => {
        loadLogData();
    }, []);

    // 模拟加载数据
    const loadLogData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            message.success('日志数据加载成功');
        } catch (error) {
            message.error('数据加载失败');
        } finally {
            setLoading(false);
        }
    };

    // 日志类型配置
    const LOG_TYPES = {
        // 安全审计日志类型
        login: { label: '登录日志', color: 'blue', icon: '🔑' },
        permission: { label: '权限变更', color: 'orange', icon: '🔐' },
        config: { label: '配置变更', color: 'purple', icon: '⚙️' },
        data_access: { label: '数据访问', color: 'cyan', icon: '📊' },
        abnormal: { label: '异常行为', color: 'red', icon: '⚠️' },
        
        // 业务操作日志类型
        content_review: { label: '内容审核', color: 'green', icon: '✅' },
        content_publish: { label: '内容发布', color: 'blue', icon: '📝' },
        user_management: { label: '用户管理', color: 'orange', icon: '👥' },
        message_push: { label: '消息推送', color: 'purple', icon: '💬' },
        data_export: { label: '数据导出', color: 'magenta', icon: '📤' },
        
        // 系统运行日志类型
        performance: { label: '性能监控', color: 'blue', icon: '📈' },
        api_call: { label: 'API调用', color: 'cyan', icon: '🔗' },
        backup: { label: '数据备份', color: 'green', icon: '💾' },
        error: { label: '系统错误', color: 'red', icon: '❌' }
    };

    // 日志级别配置
    const LOG_LEVELS = {
        info: { label: '信息', color: 'blue' },
        warning: { label: '警告', color: 'orange' },
        error: { label: '错误', color: 'red' },
        critical: { label: '严重', color: 'magenta' }
    };

    // 操作结果配置
    const RESULT_CONFIG = {
        success: { label: '成功', color: 'green' },
        failed: { label: '失败', color: 'red' },
        approved: { label: '通过', color: 'green' },
        rejected: { label: '拒绝', color: 'red' }
    };

    // 重置筛选条件
    const resetFilters = () => {
        setSearchText('');
        setLogTypeFilter('all');
        setLevelFilter('all');
        setUserFilter('all');
        setTimeRange(null);
    };

    // 导出日志
    const handleExport = () => {
        const currentData = getCurrentData();
        const filteredData = filterData(currentData);
        
        message.loading('正在导出日志数据...', 2);
        setTimeout(() => {
            message.success(`已导出 ${filteredData.length} 条${getTabDisplayName(activeTab)}数据`);
        }, 2000);
    };

    // 获取当前Tab的数据
    const getCurrentData = () => {
        switch(activeTab) {
            case 'audit': return logData.auditLogs;
            case 'business': return logData.businessLogs;
            case 'system': return logData.systemLogs;
            default: return [];
        }
    };

    // 获取Tab显示名称
    const getTabDisplayName = (tab) => {
        const names = {
            audit: '安全审计日志',
            business: '业务操作日志',
            system: '系统运行日志'
        };
        return names[tab] || '日志';
    };

    // 数据筛选逻辑
    const filterData = (data) => {
        if (!data || data.length === 0) return [];
        
        return data.filter(item => {
            // 文本搜索
            if (searchText && 
                !item.operation?.toLowerCase().includes(searchText.toLowerCase()) && 
                !item.details?.toLowerCase().includes(searchText.toLowerCase()) &&
                !item.user?.toLowerCase().includes(searchText.toLowerCase())) {
                return false;
            }
            
            // 日志类型筛选
            if (logTypeFilter !== 'all' && item.type !== logTypeFilter) {
                return false;
            }
            
            // 级别筛选
            if (levelFilter !== 'all' && item.level !== levelFilter) {
                return false;
            }
            
            // 用户筛选
            if (userFilter !== 'all' && item.userId !== userFilter) {
                return false;
            }
            
            // 时间范围筛选
            if (timeRange && timeRange.length === 2) {
                const itemTime = new Date(item.timestamp);
                const startTime = timeRange[0].startOf('day');
                const endTime = timeRange[1].endOf('day');
                if (itemTime < startTime || itemTime > endTime) {
                    return false;
                }
            }
            
            return true;
        });
    };

    // 查看日志详情
    const viewLogDetails = (log) => {
        setSelectedLog(log);
        setLogModalVisible(true);
    };

    // 渲染搜索和筛选工具栏
    const renderSearchToolbar = () => {
        return React.createElement(Card, {
            style: { marginBottom: '16px' },
            bodyStyle: { padding: '16px' }
        }, [
            React.createElement(Row, {
                key: 'search-row',
                gutter: [16, 16],
                align: 'middle'
            }, [
                React.createElement(Col, { span: 6 }, [
                    React.createElement(Search, {
                        placeholder: '搜索操作、详情或用户名',
                        value: searchText,
                        onChange: (e) => setSearchText(e.target.value),
                        onSearch: (value) => setSearchText(value),
                        allowClear: true,
                        enterButton: true
                    })
                ]),
                React.createElement(Col, { span: 3 }, [
                    React.createElement(Select, {
                        placeholder: "日志类型",
                        value: logTypeFilter,
                        onChange: setLogTypeFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部类型'),
                        ...Object.entries(LOG_TYPES).map(([key, config]) =>
                            React.createElement(Option, { key: key, value: key }, config.label)
                        )
                    ])
                ]),
                React.createElement(Col, { span: 3 }, [
                    React.createElement(Select, {
                        placeholder: "日志级别",
                        value: levelFilter,
                        onChange: setLevelFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部级别'),
                        ...Object.entries(LOG_LEVELS).map(([key, config]) =>
                            React.createElement(Option, { key: key, value: key }, config.label)
                        )
                    ])
                ]),
                React.createElement(Col, { span: 6 }, [
                    React.createElement(DateRangePicker, {
                        placeholder: ['开始时间', '结束时间'],
                        value: timeRange,
                        onChange: setTimeRange,
                        style: { width: '100%' },
                        format: 'YYYY-MM-DD HH:mm',
                        showTime: true
                    })
                ]),
                React.createElement(Col, { span: 6 }, [
                    React.createElement(Space, {}, [
                        React.createElement(Button, {
                            onClick: resetFilters
                        }, '重置'),
                        React.createElement(Button, {
                            type: 'primary',
                            onClick: () => loadLogData()
                        }, '搜索'),
                        React.createElement(Button, {
                            onClick: handleExport
                        }, '导出')
                    ])
                ])
            ])
        ]);
    };

    // 渲染统计卡片
    const renderStatistics = () => {
        return React.createElement(Row, {
            gutter: [16, 16],
            style: { marginBottom: '16px' }
        }, [
            React.createElement(Col, { span: 4 }, [
                React.createElement(Card, {
                    size: 'small'
                }, React.createElement(Statistic, {
                    title: '总日志数',
                    value: logData.statistics.totalLogs,
                    prefix: '📋'
                }))
            ]),
            React.createElement(Col, { span: 4 }, [
                React.createElement(Card, {
                    size: 'small'
                }, React.createElement(Statistic, {
                    title: '今日日志',
                    value: logData.statistics.todayLogs,
                    prefix: '📅'
                }))
            ]),
            React.createElement(Col, { span: 4 }, [
                React.createElement(Card, {
                    size: 'small'
                }, React.createElement(Statistic, {
                    title: '错误日志',
                    value: logData.statistics.errorLogs,
                    prefix: '❌',
                    valueStyle: { color: '#f5222d' }
                }))
            ]),
            React.createElement(Col, { span: 4 }, [
                React.createElement(Card, {
                    size: 'small'
                }, React.createElement(Statistic, {
                    title: '警告日志',
                    value: logData.statistics.warningLogs,
                    prefix: '⚠️',
                    valueStyle: { color: '#fa8c16' }
                }))
            ]),
            React.createElement(Col, { span: 4 }, [
                React.createElement(Card, {
                    size: 'small'
                }, React.createElement(Statistic, {
                    title: '严重事件',
                    value: logData.statistics.criticalEvents,
                    prefix: '🚨',
                    valueStyle: { color: '#f5222d' }
                }))
            ]),
            React.createElement(Col, { span: 4 }, [
                React.createElement(Card, {
                    size: 'small'
                }, React.createElement(Statistic, {
                    title: '存储使用率',
                    value: logData.statistics.storageUsage,
                    suffix: '%',
                    prefix: '💾'
                }))
            ])
        ]);
    };

    // 渲染安全审计日志
    const renderAuditLogs = () => {
        const columns = [
            {
                title: '日志类型',
                dataIndex: 'type',
                width: 120,
                render: (type) => {
                    const config = LOG_TYPES[type];
                    return React.createElement(Tag, {
                        color: config?.color || 'default'
                    }, [
                        React.createElement('span', { key: 'icon' }, config?.icon),
                        React.createElement('span', { key: 'label', style: { marginLeft: '4px' } }, config?.label)
                    ]);
                }
            },
            {
                title: '级别',
                dataIndex: 'level',
                width: 80,
                render: (level) => {
                    const config = LOG_LEVELS[level];
                    return React.createElement(Tag, {
                        color: config?.color || 'default'
                    }, config?.label);
                }
            },
            {
                title: '用户',
                dataIndex: 'user',
                width: 120,
                render: (user, record) => React.createElement('div', {}, [
                    React.createElement('div', { key: 'name', style: { fontWeight: 'bold' } }, user),
                    React.createElement('div', { 
                        key: 'id', 
                        style: { fontSize: '12px', color: '#666' } 
                    }, record.userId)
                ])
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 120
            },
            {
                title: '结果',
                dataIndex: 'result',
                width: 80,
                render: (result) => {
                    const config = RESULT_CONFIG[result];
                    return React.createElement(Tag, {
                        color: config?.color || 'default'
                    }, config?.label);
                }
            },
            {
                title: 'IP地址',
                dataIndex: 'ip',
                width: 120
            },
            {
                title: '时间',
                dataIndex: 'timestamp',
                width: 150
            },
            {
                title: '操作',
                width: 100,
                render: (_, record) => React.createElement(Button, {
                    size: 'small',
                    type: 'link',
                    onClick: () => viewLogDetails(record)
                }, '详情')
            }
        ];

        const filteredData = filterData(logData.auditLogs);

        return React.createElement(Table, {
            columns: columns,
            dataSource: filteredData.map((item, index) => ({ ...item, key: index })),
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                pageSizeOptions: ['10', '20', '50', '100']
            },
            size: 'small',
            loading: loading,
            scroll: { x: 1000 }
        });
    };

    // 渲染业务操作日志
    const renderBusinessLogs = () => {
        const columns = [
            {
                title: '日志类型',
                dataIndex: 'type',
                width: 120,
                render: (type) => {
                    const config = LOG_TYPES[type];
                    return React.createElement(Tag, {
                        color: config?.color || 'default'
                    }, [
                        React.createElement('span', { key: 'icon' }, config?.icon),
                        React.createElement('span', { key: 'label', style: { marginLeft: '4px' } }, config?.label)
                    ]);
                }
            },
            {
                title: '用户',
                dataIndex: 'user',
                width: 120,
                render: (user, record) => React.createElement('div', {}, [
                    React.createElement('div', { key: 'name', style: { fontWeight: 'bold' } }, user),
                    React.createElement('div', { 
                        key: 'id', 
                        style: { fontSize: '12px', color: '#666' } 
                    }, record.userId)
                ])
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 120
            },
            {
                title: '详情',
                dataIndex: 'details',
                width: 200,
                ellipsis: true
            },
            {
                title: '结果',
                dataIndex: 'result',
                width: 80,
                render: (result) => {
                    const config = RESULT_CONFIG[result];
                    return React.createElement(Tag, {
                        color: config?.color || 'default'
                    }, config?.label);
                }
            },
            {
                title: '时间',
                dataIndex: 'timestamp',
                width: 150
            },
            {
                title: '操作',
                width: 100,
                render: (_, record) => React.createElement(Button, {
                    size: 'small',
                    type: 'link',
                    onClick: () => viewLogDetails(record)
                }, '详情')
            }
        ];

        const filteredData = filterData(logData.businessLogs);

        return React.createElement(Table, {
            columns: columns,
            dataSource: filteredData.map((item, index) => ({ ...item, key: index })),
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                pageSizeOptions: ['10', '20', '50', '100']
            },
            size: 'small',
            loading: loading,
            scroll: { x: 1000 }
        });
    };

    // 渲染系统运行日志
    const renderSystemLogs = () => {
        const columns = [
            {
                title: '日志类型',
                dataIndex: 'type',
                width: 120,
                render: (type) => {
                    const config = LOG_TYPES[type];
                    return React.createElement(Tag, {
                        color: config?.color || 'default'
                    }, [
                        React.createElement('span', { key: 'icon' }, config?.icon),
                        React.createElement('span', { key: 'label', style: { marginLeft: '4px' } }, config?.label)
                    ]);
                }
            },
            {
                title: '级别',
                dataIndex: 'level',
                width: 80,
                render: (level) => {
                    const config = LOG_LEVELS[level];
                    return React.createElement(Tag, {
                        color: config?.color || 'default'
                    }, config?.label);
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 150
            },
            {
                title: '详情',
                dataIndex: 'details',
                width: 250,
                ellipsis: true
            },
            {
                title: '时间',
                dataIndex: 'timestamp',
                width: 150
            },
            {
                title: '操作',
                width: 100,
                render: (_, record) => React.createElement(Button, {
                    size: 'small',
                    type: 'link',
                    onClick: () => viewLogDetails(record)
                }, '详情')
            }
        ];

        const filteredData = filterData(logData.systemLogs);

        return React.createElement(Table, {
            columns: columns,
            dataSource: filteredData.map((item, index) => ({ ...item, key: index })),
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                pageSizeOptions: ['10', '20', '50', '100']
            },
            size: 'small',
            loading: loading,
            scroll: { x: 1000 }
        });
    };

    // 渲染日志详情弹窗
    const renderLogDetailsModal = () => {
        if (!selectedLog) return null;

        const logType = LOG_TYPES[selectedLog.type];
        const logLevel = LOG_LEVELS[selectedLog.level];

        return React.createElement(Modal, {
            title: React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', gap: '8px' }
            }, [
                React.createElement('span', { key: 'icon' }, logType?.icon),
                React.createElement('span', { key: 'label' }, `${logType?.label}详情`)
            ]),
            open: logModalVisible,
            onCancel: () => setLogModalVisible(false),
            footer: React.createElement(Button, {
                onClick: () => setLogModalVisible(false)
            }, '关闭'),
            width: 800
        }, React.createElement(Descriptions, {
            bordered: true,
            column: 2,
            size: 'small'
        }, [
            React.createElement(Descriptions.Item, {
                key: 'type',
                label: '日志类型'
            }, React.createElement(Tag, {
                color: logType?.color
            }, logType?.label)),
            React.createElement(Descriptions.Item, {
                key: 'level',
                label: '日志级别'
            }, React.createElement(Tag, {
                color: logLevel?.color
            }, logLevel?.label)),
            React.createElement(Descriptions.Item, {
                key: 'timestamp',
                label: '发生时间'
            }, selectedLog.timestamp),
            React.createElement(Descriptions.Item, {
                key: 'user',
                label: '操作用户'
            }, `${selectedLog.user} (${selectedLog.userId})`),
            React.createElement(Descriptions.Item, {
                key: 'operation',
                label: '操作类型'
            }, selectedLog.operation),
            React.createElement(Descriptions.Item, {
                key: 'result',
                label: '操作结果'
            }, React.createElement(Tag, {
                color: RESULT_CONFIG[selectedLog.result]?.color
            }, RESULT_CONFIG[selectedLog.result]?.label)),
            selectedLog.ip && React.createElement(Descriptions.Item, {
                key: 'ip',
                label: 'IP地址'
            }, selectedLog.ip),
            selectedLog.device && React.createElement(Descriptions.Item, {
                key: 'device',
                label: '设备信息'
            }, selectedLog.device),
            React.createElement(Descriptions.Item, {
                key: 'details',
                label: '详细信息',
                span: 2
            }, selectedLog.details),
            // 根据日志类型显示特定字段
            selectedLog.contentId && React.createElement(Descriptions.Item, {
                key: 'contentId',
                label: '内容ID'
            }, selectedLog.contentId),
            selectedLog.targetUser && React.createElement(Descriptions.Item, {
                key: 'targetUser',
                label: '目标用户'
            }, `${selectedLog.targetUser} (${selectedLog.targetUserId})`),
            selectedLog.configKey && React.createElement(Descriptions.Item, {
                key: 'configChange',
                label: '配置变更'
            }, `${selectedLog.configKey}: ${selectedLog.oldValue} → ${selectedLog.newValue}`),
            selectedLog.recordCount && React.createElement(Descriptions.Item, {
                key: 'recordCount',
                label: '记录数量'
            }, selectedLog.recordCount),
            selectedLog.apiName && React.createElement(Descriptions.Item, {
                key: 'apiName',
                label: 'API接口'
            }, selectedLog.apiName),
            selectedLog.responseTime && React.createElement(Descriptions.Item, {
                key: 'responseTime',
                label: '响应时间'
            }, selectedLog.responseTime)
        ]));
    };

    // Tab配置
    const tabItems = [
        {
            key: 'audit',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon' }, '🔐'),
                React.createElement('span', { key: 'text', style: { marginLeft: '4px' } }, '安全审计日志')
            ]),
            children: React.createElement('div', {}, [
                renderSearchToolbar(),
                React.createElement(Card, {
                    title: '安全审计日志',
                    extra: React.createElement(Badge, {
                        count: logData.auditLogs.length,
                        showZero: true,
                        style: { backgroundColor: '#1890ff' }
                    }),
                    bodyStyle: { padding: '0' }
                }, renderAuditLogs())
            ])
        },
        {
            key: 'business',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon' }, '💼'),
                React.createElement('span', { key: 'text', style: { marginLeft: '4px' } }, '业务操作日志')
            ]),
            children: React.createElement('div', {}, [
                renderSearchToolbar(),
                React.createElement(Card, {
                    title: '业务操作日志',
                    extra: React.createElement(Badge, {
                        count: logData.businessLogs.length,
                        showZero: true,
                        style: { backgroundColor: '#52c41a' }
                    }),
                    bodyStyle: { padding: '0' }
                }, renderBusinessLogs())
            ])
        },
        {
            key: 'system',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon' }, '⚙️'),
                React.createElement('span', { key: 'text', style: { marginLeft: '4px' } }, '系统运行日志')
            ]),
            children: React.createElement('div', {}, [
                renderSearchToolbar(),
                React.createElement(Card, {
                    title: '系统运行日志',
                    extra: React.createElement(Badge, {
                        count: logData.systemLogs.length,
                        showZero: true,
                        style: { backgroundColor: '#722ed1' }
                    }),
                    bodyStyle: { padding: '0' }
                }, renderSystemLogs())
            ])
        }
    ];

    return React.createElement('div', {}, [
        // 页面头部
        React.createElement('div', {
            key: 'header',
            style: {
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }
        }, [
            React.createElement('div', {
                key: 'title-section'
            }, [
                React.createElement('h2', {
                    key: 'title',
                    style: { margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }
                }, [
                    React.createElement('span', { key: 'icon', style: { marginRight: '8px' } }, '📋'),
                    React.createElement('span', { key: 'text' }, '日志管理')
                ]),
                React.createElement('p', {
                    key: 'description',
                    style: { margin: 0, color: '#64748b' }
                }, '等保三级合规日志管理，提供完整的审计追踪能力')
            ]),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'refresh',
                    onClick: loadLogData
                }, '刷新'),
                React.createElement(Button, {
                    key: 'export',
                    onClick: handleExport
                }, '导出日志'),
                React.createElement(Button, {
                    key: 'config',
                    type: 'primary',
                    onClick: () => setConfigModalVisible(true)
                }, '日志配置')
            ])
        ]),

        // 统计信息
        renderStatistics(),

        // 安全提醒
        React.createElement(Alert, {
            key: 'security-notice',
            message: '等保三级合规提醒',
            description: '所有日志数据已加密存储，访问行为被完整记录。日志保存期：一般日志6个月，重要日志1年以上。',
            type: 'info',
            showIcon: true,
            style: { marginBottom: '24px' }
        }),

        // 日志内容
        React.createElement(Tabs, {
            key: 'log-tabs',
            activeKey: activeTab,
            onChange: setActiveTab,
            items: tabItems,
            size: 'large'
        }),

        // 日志详情弹窗
        renderLogDetailsModal()
    ]);
};

window.LogManagement = LogManagement; 