// 消息管理页面 - APP系统消息推送管理
const MessageManagement = () => {
    console.log('MessageManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Tabs, DatePicker, Radio, Switch, TreeSelect, Divider, Statistic, Progress, Tooltip, Descriptions, Badge, Upload } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { RangePicker: DateRangePicker } = DatePicker;
    const { TextArea } = Input;
    
    const [activeTab, setActiveTab] = React.useState('push');
    
    // 状态管理
    const [pushModalVisible, setPushModalVisible] = React.useState(false);
    const [templateModalVisible, setTemplateModalVisible] = React.useState(false);
    const [previewModalVisible, setPreviewModalVisible] = React.useState(false);
    const [editingMessage, setEditingMessage] = React.useState(null);
    const [editingTemplate, setEditingTemplate] = React.useState(null);
    const [selectedMessage, setSelectedMessage] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    
    const [pushForm] = Form.useForm();
    const [templateForm] = Form.useForm();
    
    // 搜索和筛选状态
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [typeFilter, setTypeFilter] = React.useState('all');
    const [priorityFilter, setPriorityFilter] = React.useState('all');
    const [targetFilter, setTargetFilter] = React.useState('all');
    const [timeRange, setTimeRange] = React.useState(null);
    
    // 模拟数据
    const [messageData, setMessageData] = React.useState({
        // 推送记录
        pushRecords: [
            {
                id: 'msg_001',
                title: '系统维护通知',
                content: '系统将于今晚22:00-23:00进行例行维护，请提前做好相关准备。',
                type: 'system',
                category: '系统维护',
                targetType: 'all',
                targetCount: 125634,
                sentCount: 125634,
                readCount: 89245,
                status: 'sent',
                priority: 'high',
                sendTime: '2024-01-15 18:00:00',
                creator: '系统管理员',
                icon: '🔧'
            },
            {
                id: 'msg_002',
                title: '内容审核结果',
                content: '您提交的视频内容已通过审核，现已正式发布。',
                type: 'review',
                category: '审核通知',
                targetType: 'user',
                targetCount: 1,
                sentCount: 1,
                readCount: 1,
                status: 'sent',
                priority: 'normal',
                sendTime: '2024-01-15 15:32:00',
                creator: '审核系统',
                icon: '✅'
            },
            {
                id: 'msg_003',
                title: '春节活动通知',
                content: '新春佳节即将到来，参与活动赢取丰厚奖品！',
                type: 'activity',
                category: '活动推广',
                targetType: 'group',
                targetCount: 45678,
                sentCount: 0,
                readCount: 0,
                status: 'scheduled',
                priority: 'normal',
                sendTime: '2024-01-16 10:00:00',
                creator: '运营团队',
                icon: '🎉'
            }
        ],
        
        // 消息模板
        templates: [
            {
                id: 'tpl_001',
                name: '系统维护通知模板',
                title: '系统维护通知',
                content: '系统将于{maintenance_time}进行维护，预计{duration}，请提前做好准备。',
                type: 'system',
                category: '系统维护',
                variables: ['maintenance_time', 'duration'],
                usageCount: 15,
                creator: '系统管理员',
                created: '2024-01-10 10:00:00',
                icon: '🔧'
            },
            {
                id: 'tpl_002',
                name: '审核结果通知模板',
                title: '内容审核结果',
                content: '您的{content_type}审核{result}，{additional_info}',
                type: 'review',
                category: '审核通知',
                variables: ['content_type', 'result', 'additional_info'],
                usageCount: 1245,
                creator: '审核系统',
                created: '2024-01-05 14:30:00',
                icon: '✅'
            },
            {
                id: 'tpl_003',
                name: '活动推广模板',
                title: '{activity_name}',
                content: '{activity_description}，活动时间：{activity_time}，快来参与吧！',
                type: 'activity',
                category: '活动推广',
                variables: ['activity_name', 'activity_description', 'activity_time'],
                usageCount: 89,
                creator: '运营团队',
                created: '2024-01-08 16:20:00',
                icon: '🎉'
            }
        ],
        
        // 统计数据
        statistics: {
            totalPush: 125635,
            todayPush: 2456,
            readRate: 71.2,
            clickRate: 24.8,
            activeTemplates: 12,
            scheduledMessages: 5
        }
    });

    React.useEffect(() => {
        loadMessageData();
    }, []);

    // 模拟加载数据
    const loadMessageData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            message.success('消息数据加载成功');
        } catch (error) {
            message.error('数据加载失败');
        } finally {
            setLoading(false);
        }
    };

    // 消息类型配置
    const MESSAGE_TYPES = {
        system: { label: '系统消息', color: 'blue', icon: '🔔' },
        review: { label: '审核消息', color: 'green', icon: '✅' },
        activity: { label: '活动消息', color: 'orange', icon: '🎉' },
        security: { label: '安全提醒', color: 'red', icon: '🛡️' },
        update: { label: '更新通知', color: 'purple', icon: '🆙' }
    };

    // 优先级配置
    const PRIORITY_CONFIG = {
        high: { label: '高优先级', color: 'red' },
        normal: { label: '普通', color: 'default' },
        low: { label: '低优先级', color: 'green' }
    };

    // 状态配置
    const STATUS_CONFIG = {
        draft: { label: '草稿', color: 'default' },
        scheduled: { label: '待发送', color: 'orange' },
        sending: { label: '发送中', color: 'blue' },
        sent: { label: '已发送', color: 'green' },
        failed: { label: '发送失败', color: 'red' }
    };

    // 重置筛选条件
    const resetFilters = () => {
        setSearchText('');
        setStatusFilter('all');
        setTypeFilter('all');
        setPriorityFilter('all');
        setTargetFilter('all');
        setTimeRange(null);
    };

    // 导出数据
    const handleExport = () => {
        const currentData = getCurrentData();
        const filteredData = filterData(currentData);
        
        message.loading('正在导出数据...', 2);
        setTimeout(() => {
            message.success(`已导出 ${filteredData.length} 条${getTabDisplayName(activeTab)}数据`);
        }, 2000);
    };

    // 获取当前Tab的数据
    const getCurrentData = () => {
        switch(activeTab) {
            case 'push': return messageData.pushRecords;
            case 'template': return messageData.templates;
            case 'records': return messageData.pushRecords;
            case 'schedules': return [];
            default: return [];
        }
    };

    // 获取Tab显示名称
    const getTabDisplayName = (tab) => {
        const names = {
            push: '推送记录',
            template: '消息模板',
            records: '推送记录',
            schedules: '定时推送'
        };
        return names[tab] || '数据';
    };

    // 数据筛选逻辑
    const filterData = (data) => {
        if (!data || data.length === 0) return [];
        
        return data.filter(item => {
            // 根据不同Tab应用不同的筛选逻辑
            if (activeTab === 'push') {
                return filterPushRecords(item);
            } else if (activeTab === 'template') {
                return filterTemplates(item);
            } else if (activeTab === 'records') {
                return filterPushRecords(item);
            } else if (activeTab === 'schedules') {
                return filterSchedules(item);
            }
            return true;
        });
    };

    // 消息筛选逻辑
    const filterPushRecords = (record) => {
        // 文本搜索
        if (searchText && 
            !record.title?.toLowerCase().includes(searchText.toLowerCase()) && 
            !record.content?.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
        
        // 状态筛选
        if (statusFilter !== 'all' && record.status !== statusFilter) {
            return false;
        }
        
        // 类型筛选
        if (typeFilter !== 'all' && record.type !== typeFilter) {
            return false;
        }
        
        // 优先级筛选
        if (priorityFilter !== 'all' && record.priority !== priorityFilter) {
            return false;
        }
        
        // 目标用户筛选
        if (targetFilter !== 'all' && record.targetType !== targetFilter) {
            return false;
        }
        
        // 时间范围筛选
        if (timeRange && timeRange.length === 2) {
            const itemTime = new Date(record.sendTime);
            const startTime = timeRange[0].startOf('day');
            const endTime = timeRange[1].endOf('day');
            if (itemTime < startTime || itemTime > endTime) {
                return false;
            }
        }
        
        return true;
    };

    // 模板筛选逻辑
    const filterTemplates = (template) => {
        // 文本搜索
        if (searchText && 
            !template.name?.toLowerCase().includes(searchText.toLowerCase()) && 
            !template.content?.toLowerCase().includes(searchText.toLowerCase()) &&
            !template.title?.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
        
        // 状态筛选
        if (statusFilter !== 'all' && template.status !== statusFilter) {
            return false;
        }
        
        // 类型筛选
        if (typeFilter !== 'all' && template.type !== typeFilter) {
            return false;
        }
        
        return true;
    };

    // 定时推送筛选逻辑
    const filterSchedules = (schedule) => {
        // 文本搜索
        if (searchText && 
            !schedule.name?.toLowerCase().includes(searchText.toLowerCase()) && 
            !schedule.messageTitle?.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
        
        // 状态筛选
        if (statusFilter !== 'all' && schedule.status !== statusFilter) {
            return false;
        }
        
        // 类型筛选
        if (typeFilter !== 'all' && schedule.messageType !== typeFilter) {
            return false;
        }
        
        return true;
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
                        placeholder: getSearchPlaceholder(),
                        value: searchText,
                        onChange: (e) => setSearchText(e.target.value),
                        onSearch: (value) => setSearchText(value),
                        allowClear: true,
                        enterButton: true
                    })
                ]),
                React.createElement(Col, { span: 3 }, [
                    React.createElement(Select, {
                        placeholder: "状态筛选",
                        value: statusFilter,
                        onChange: setStatusFilter,
                        style: { width: '100%' }
                    }, getStatusFilterOptions())
                ]),
                React.createElement(Col, { span: 3 }, [
                    React.createElement(Select, {
                        placeholder: "类型筛选",
                        value: typeFilter,
                        onChange: setTypeFilter,
                        style: { width: '100%' }
                    }, getTypeFilterOptions())
                ]),
                getExtraFilterColumn(),
                React.createElement(Col, { span: 5 }, [
                    React.createElement(DateRangePicker, {
                        placeholder: ['开始时间', '结束时间'],
                        value: timeRange,
                        onChange: setTimeRange,
                        style: { width: '100%' },
                        format: 'YYYY-MM-DD'
                    })
                ]),
                React.createElement(Col, { span: 4 }, [
                    React.createElement(Space, {}, [
                        React.createElement(Button, {
                            onClick: resetFilters
                        }, '重置'),
                        React.createElement(Button, {
                            type: 'primary',
                            onClick: () => {
                                if (activeTab === 'push') loadMessageData();
                                else if (activeTab === 'template') loadMessageData();
                                else if (activeTab === 'records') loadMessageData();
                                else if (activeTab === 'schedules') loadMessageData();
                            }
                        }, '搜索')
                    ])
                ])
            ])
        ]);
    };

    // 渲染批量操作工具栏
    const renderBatchToolbar = () => {
        const currentData = getCurrentData();
        const filteredData = filterData(currentData);
        
        return React.createElement(Card, {
            style: { marginBottom: '16px' },
            bodyStyle: { padding: '12px 16px' }
        }, [
            React.createElement(Row, {
                key: 'batch-row',
                justify: 'space-between',
                align: 'middle'
            }, [
                React.createElement(Col, {}, [
                    React.createElement(Space, {}, [
                        React.createElement('span', {
                            style: { color: '#666' }
                        }, `共 ${filteredData.length} 条记录`),
                        selectedRows.length > 0 && React.createElement('span', {
                            style: { color: '#1890ff' }
                        }, `已选择 ${selectedRows.length} 条`)
                    ])
                ]),
                React.createElement(Col, {}, [
                    React.createElement(Space, {}, getBatchOperationButtons())
                ])
            ])
        ]);
    };

    // 获取搜索框占位符
    const getSearchPlaceholder = () => {
        const placeholders = {
            push: '搜索消息标题或内容',
            template: '搜索模板名称、内容或描述',
            records: '搜索推送标题或内容',
            schedules: '搜索计划名称或消息标题'
        };
        return placeholders[activeTab] || '搜索...';
    };

    // 获取状态筛选选项
    const getStatusFilterOptions = () => {
        const optionsMap = {
            push: [
                React.createElement(Option, { value: 'all' }, '全部状态'),
                React.createElement(Option, { value: 'sent' }, '已发送'),
                React.createElement(Option, { value: 'scheduled' }, '待发送'),
                React.createElement(Option, { value: 'failed' }, '发送失败'),
                React.createElement(Option, { value: 'expired' }, '已过期')
            ],
            template: [
                React.createElement(Option, { value: 'all' }, '全部状态'),
                React.createElement(Option, { value: 'active' }, '启用'),
                React.createElement(Option, { value: 'inactive' }, '禁用')
            ],
            records: [
                React.createElement(Option, { value: 'all' }, '全部状态'),
                React.createElement(Option, { value: 'success' }, '推送成功'),
                React.createElement(Option, { value: 'failed' }, '推送失败'),
                React.createElement(Option, { value: 'pending' }, '推送中')
            ],
            schedules: [
                React.createElement(Option, { value: 'all' }, '全部状态'),
                React.createElement(Option, { value: 'active' }, '启用'),
                React.createElement(Option, { value: 'paused' }, '暂停'),
                React.createElement(Option, { value: 'completed' }, '已完成'),
                React.createElement(Option, { value: 'cancelled' }, '已取消')
            ]
        };
        return optionsMap[activeTab] || [React.createElement(Option, { value: 'all' }, '全部状态')];
    };

    // 获取类型筛选选项
    const getTypeFilterOptions = () => {
        const optionsMap = {
            push: [
                React.createElement(Option, { value: 'all' }, '全部类型'),
                React.createElement(Option, { value: 'system' }, '系统消息'),
                React.createElement(Option, { value: 'review' }, '审核消息'),
                React.createElement(Option, { value: 'activity' }, '活动消息'),
                React.createElement(Option, { value: 'security' }, '安全提醒'),
                React.createElement(Option, { value: 'update' }, '更新通知')
            ],
            template: [
                React.createElement(Option, { value: 'all' }, '全部类型'),
                React.createElement(Option, { value: 'system' }, '系统通知'),
                React.createElement(Option, { value: 'review' }, '审核通知'),
                React.createElement(Option, { value: 'activity' }, '活动推广'),
                React.createElement(Option, { value: 'security' }, '安全提醒'),
                React.createElement(Option, { value: 'update' }, '更新公告')
            ],
            records: [
                React.createElement(Option, { value: 'all' }, '全部类型'),
                React.createElement(Option, { value: 'system' }, '系统通知'),
                React.createElement(Option, { value: 'review' }, '审核通知'),
                React.createElement(Option, { value: 'activity' }, '活动推广'),
                React.createElement(Option, { value: 'security' }, '安全提醒')
            ],
            schedules: [
                React.createElement(Option, { value: 'all' }, '全部类型'),
                React.createElement(Option, { value: 'system' }, '系统通知'),
                React.createElement(Option, { value: 'activity' }, '活动推广'),
                React.createElement(Option, { value: 'security' }, '安全提醒')
            ]
        };
        return optionsMap[activeTab] || [React.createElement(Option, { value: 'all' }, '全部类型')];
    };

    // 获取额外筛选列
    const getExtraFilterColumn = () => {
        if (activeTab === 'push') {
            return React.createElement(Col, { span: 3 }, [
                React.createElement(Select, {
                    placeholder: "优先级",
                    value: priorityFilter,
                    onChange: setPriorityFilter,
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { value: 'all' }, '全部优先级'),
                    React.createElement(Option, { value: 'high' }, '高优先级'),
                    React.createElement(Option, { value: 'normal' }, '普通优先级'),
                    React.createElement(Option, { value: 'low' }, '低优先级')
                ])
            ]);
        }
        return React.createElement(Col, { span: 3 }, []);
    };

    // 获取批量操作按钮
    const getBatchOperationButtons = () => {
        const buttons = [
            React.createElement(Button, {
                onClick: handleExport
            }, '导出数据'),
            React.createElement(Button, {
                onClick: () => {
                    if (activeTab === 'push') loadMessageData();
                    else if (activeTab === 'template') loadMessageData();
                    else if (activeTab === 'records') loadMessageData();
                    else if (activeTab === 'schedules') loadMessageData();
                }
            }, '刷新')
        ];

        if (activeTab === 'push' && selectedRows.length > 0) {
            buttons.unshift(
                React.createElement(Button, {
                    type: 'primary',
                    disabled: selectedRows.length === 0,
                    onClick: () => handleBatchMessageOperation('publish')
                }, `批量发布 (${selectedRows.length})`),
                React.createElement(Button, {
                    danger: true,
                    disabled: selectedRows.length === 0,
                    onClick: () => handleBatchMessageOperation('delete')
                }, `批量删除 (${selectedRows.length})`)
            );
        }

        return buttons;
    };

    // 批量消息操作
    const handleBatchMessageOperation = (action) => {
        if (selectedRows.length === 0) {
            message.warning('请选择要操作的消息');
            return;
        }

        const actionText = action === 'publish' ? '发布' : '删除';
        Modal.confirm({
            title: `确认${actionText}选中的消息？`,
            content: `将对 ${selectedRows.length} 条消息执行${actionText}操作`,
            onOk: () => {
                setLoading(true);
                setTimeout(() => {
                    setSelectedRows([]);
                    loadMessageData();
                    message.success(`已${actionText} ${selectedRows.length} 条消息`);
                }, 1000);
            }
        });
    };

    // 渲染推送管理
    const renderPushManagement = () => {
        const columns = [
            {
                title: '消息信息',
                dataIndex: 'title',
                width: 300,
                render: (text, record) => React.createElement('div', {
                    style: { display: 'flex', alignItems: 'flex-start', gap: 12 }
                }, [
                    React.createElement('div', {
                        key: 'icon',
                        style: {
                            fontSize: '24px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f0f2f5',
                            borderRadius: '8px'
                        }
                    }, record.icon),
                    React.createElement('div', { key: 'info' }, [
                        React.createElement('div', {
                            key: 'title',
                            style: { fontWeight: 'bold', marginBottom: '4px' }
                        }, text),
                        React.createElement('div', {
                            key: 'content',
                            style: { 
                                fontSize: '12px', 
                                color: '#666', 
                                lineHeight: '1.4',
                                maxWidth: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }
                        }, record.content),
                        React.createElement('div', {
                            key: 'meta',
                            style: { marginTop: '4px' }
                        }, [
                            React.createElement(Tag, {
                                key: 'type',
                                color: MESSAGE_TYPES[record.type]?.color,
                                size: 'small'
                            }, MESSAGE_TYPES[record.type]?.label),
                            React.createElement(Tag, {
                                key: 'priority',
                                color: PRIORITY_CONFIG[record.priority]?.color,
                                size: 'small'
                            }, PRIORITY_CONFIG[record.priority]?.label)
                        ])
                    ])
                ])
            },
            {
                title: '目标用户',
                dataIndex: 'targetType',
                width: 120,
                render: (targetType, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'type',
                        style: { fontWeight: '500' }
                    }, targetType === 'all' ? '全体用户' : targetType === 'group' ? '分组用户' : '个人用户'),
                    React.createElement('div', {
                        key: 'count',
                        style: { fontSize: '12px', color: '#666' }
                    }, `${record.targetCount.toLocaleString()}人`)
                ])
            },
            {
                title: '发送统计',
                dataIndex: 'sentCount',
                width: 150,
                render: (sentCount, record) => {
                    const readRate = record.sentCount > 0 ? ((record.readCount / record.sentCount) * 100).toFixed(1) : 0;
                    return React.createElement('div', {}, [
                        React.createElement('div', {
                            key: 'sent',
                            style: { fontSize: '14px', fontWeight: '500' }
                        }, `已发送: ${sentCount.toLocaleString()}`),
                        React.createElement('div', {
                            key: 'read',
                            style: { fontSize: '12px', color: '#666' }
                        }, `已读: ${record.readCount.toLocaleString()}`),
                        React.createElement('div', {
                            key: 'rate',
                            style: { fontSize: '12px', marginTop: '2px' }
                        }, [
                            React.createElement('span', { key: 'label' }, '阅读率: '),
                            React.createElement('span', {
                                key: 'value',
                                style: { 
                                    color: readRate > 70 ? '#52c41a' : readRate > 40 ? '#faad14' : '#ff4d4f',
                                    fontWeight: '500'
                                }
                            }, `${readRate}%`)
                        ])
                    ]);
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (status) => React.createElement(Tag, {
                    color: STATUS_CONFIG[status]?.color
                }, STATUS_CONFIG[status]?.label)
            },
            {
                title: '发送时间',
                dataIndex: 'sendTime',
                width: 150,
                render: (time, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'time',
                        style: { fontSize: '14px' }
                    }, time),
                    React.createElement('div', {
                        key: 'creator',
                        style: { fontSize: '12px', color: '#666' }
                    }, `创建人: ${record.creator}`)
                ])
            },
            {
                title: '操作',
                width: 200,
                render: (_, record) => React.createElement(Space, { size: 'small' }, [
                    React.createElement(Button, {
                        key: 'preview',
                        size: 'small',
                        onClick: () => previewMessage(record)
                    }, '预览'),
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        onClick: () => editMessage(record),
                        disabled: record.status === 'sent'
                    }, '编辑'),
                    record.status === 'scheduled' && React.createElement(Button, {
                        key: 'send',
                        size: 'small',
                        type: 'primary',
                        onClick: () => sendMessageNow(record)
                    }, '立即发送'),
                    React.createElement(Button, {
                        key: 'delete',
                        size: 'small',
                        danger: true,
                        onClick: () => deleteMessage(record),
                        disabled: record.status === 'sending'
                    }, '删除')
                ])
            }
        ];

        return React.createElement('div', {}, [
            // 统计卡片
            React.createElement(Row, {
                key: 'statistics',
                gutter: [16, 16],
                style: { marginBottom: '24px' }
            }, [
                React.createElement(Col, { span: 6 }, [
                    React.createElement(Card, { size: 'small' }, [
                        React.createElement(Statistic, {
                            title: '总推送量',
                            value: messageData.statistics.totalPush,
                            prefix: '📊',
                            valueStyle: { color: '#1890ff' }
                        })
                    ])
                ]),
                React.createElement(Col, { span: 6 }, [
                    React.createElement(Card, { size: 'small' }, [
                        React.createElement(Statistic, {
                            title: '今日推送',
                            value: messageData.statistics.todayPush,
                            prefix: '📈',
                            valueStyle: { color: '#52c41a' }
                        })
                    ])
                ]),
                React.createElement(Col, { span: 6 }, [
                    React.createElement(Card, { size: 'small' }, [
                        React.createElement(Statistic, {
                            title: '平均阅读率',
                            value: messageData.statistics.readRate,
                            suffix: '%',
                            prefix: '👁️',
                            valueStyle: { color: '#fa8c16' }
                        })
                    ])
                ]),
                React.createElement(Col, { span: 6 }, [
                    React.createElement(Card, { size: 'small' }, [
                        React.createElement(Statistic, {
                            title: '点击转化率',
                            value: messageData.statistics.clickRate,
                            suffix: '%',
                            prefix: '🎯',
                            valueStyle: { color: '#eb2f96' }
                        })
                    ])
                ])
            ]),

            React.createElement(Card, {
                key: 'push-table',
                title: '消息推送记录',
                extra: React.createElement(Space, {}, [
                    React.createElement(Button, {
                        type: 'primary',
                        onClick: () => createNewMessage()
                    }, '新建推送'),
                    React.createElement(Button, {
                        onClick: () => loadMessageData()
                    }, '刷新数据')
                ])
            }, React.createElement(Table, {
                dataSource: messageData.pushRecords?.map((item, index) => ({ ...item, key: index })) || [],
                columns: columns,
                pagination: { pageSize: 10 },
                size: 'small',
                scroll: { x: 1200 },
                loading: loading
            }))
        ]);
    };

    // 渲染模板管理
    const renderTemplateManagement = () => {
        const templateColumns = [
            {
                title: '模板信息',
                dataIndex: 'name',
                width: 300,
                render: (text, record) => React.createElement('div', {
                    style: { display: 'flex', alignItems: 'flex-start', gap: 12 }
                }, [
                    React.createElement('div', {
                        key: 'icon',
                        style: {
                            fontSize: '24px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f0f2f5',
                            borderRadius: '8px'
                        }
                    }, record.icon),
                    React.createElement('div', { key: 'info' }, [
                        React.createElement('div', {
                            key: 'name',
                            style: { fontWeight: 'bold', marginBottom: '4px' }
                        }, text),
                        React.createElement('div', {
                            key: 'title',
                            style: { fontSize: '12px', color: '#666', marginBottom: '4px' }
                        }, `标题: ${record.title}`),
                        React.createElement('div', {
                            key: 'variables',
                            style: { fontSize: '12px', color: '#999' }
                        }, `变量: ${record.variables.join(', ')}`)
                    ])
                ])
            },
            {
                title: '类型分类',
                dataIndex: 'type',
                width: 150,
                render: (type, record) => React.createElement('div', {}, [
                    React.createElement(Tag, {
                        key: 'type',
                        color: MESSAGE_TYPES[type]?.color
                    }, MESSAGE_TYPES[type]?.label),
                    React.createElement('div', {
                        key: 'category',
                        style: { fontSize: '12px', color: '#666', marginTop: '4px' }
                    }, record.category)
                ])
            },
            {
                title: '使用统计',
                dataIndex: 'usageCount',
                width: 120,
                render: (count) => React.createElement('div', {
                    style: { textAlign: 'center' }
                }, [
                    React.createElement('div', {
                        key: 'count',
                        style: { fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }
                    }, count.toLocaleString()),
                    React.createElement('div', {
                        key: 'label',
                        style: { fontSize: '12px', color: '#666' }
                    }, '次使用')
                ])
            },
            {
                title: '创建信息',
                dataIndex: 'created',
                width: 150,
                render: (time, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'time',
                        style: { fontSize: '14px' }
                    }, time),
                    React.createElement('div', {
                        key: 'creator',
                        style: { fontSize: '12px', color: '#666' }
                    }, `创建人: ${record.creator}`)
                ])
            },
            {
                title: '操作',
                width: 200,
                render: (_, record) => React.createElement(Space, { size: 'small' }, [
                    React.createElement(Button, {
                        key: 'use',
                        size: 'small',
                        type: 'primary',
                        onClick: () => useTemplate(record)
                    }, '使用模板'),
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        onClick: () => editTemplate(record)
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'copy',
                        size: 'small',
                        onClick: () => copyTemplate(record)
                    }, '复制'),
                    React.createElement(Button, {
                        key: 'delete',
                        size: 'small',
                        danger: true,
                        onClick: () => deleteTemplate(record)
                    }, '删除')
                ])
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'template-info',
                message: '消息模板管理',
                description: '创建和管理可重复使用的消息模板，支持变量替换，提高推送效率',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Card, {
                key: 'template-table',
                title: '消息模板库',
                extra: React.createElement(Space, {}, [
                    React.createElement(Button, {
                        type: 'primary',
                        onClick: () => createNewTemplate()
                    }, '新建模板'),
                    React.createElement(Button, {
                        onClick: () => loadMessageData()
                    }, '刷新')
                ])
            }, React.createElement(Table, {
                dataSource: messageData.templates?.map((item, index) => ({ ...item, key: index })) || [],
                columns: templateColumns,
                pagination: { pageSize: 10 },
                size: 'small',
                loading: loading
            }))
        ]);
    };

    // 功能函数
    const createNewMessage = () => {
        setEditingMessage(null);
        pushForm.resetFields();
        pushForm.setFieldsValue({
            type: 'system',
            priority: 'normal',
            targetType: 'all',
            sendType: 'immediate',
            enableSound: true,
            enableVibration: false
        });
        setPushModalVisible(true);
    };

    const editMessage = (message) => {
        setEditingMessage(message);
        pushForm.setFieldsValue({
            ...message,
            sendTime: message.sendTime ? window.moment(message.sendTime) : null
        });
        setPushModalVisible(true);
    };

    const previewMessage = (message) => {
        setSelectedMessage(message);
        setPreviewModalVisible(true);
    };

    const sendMessageNow = async (message) => {
        try {
            message.loading('正在发送消息...', 2);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 更新状态
            setMessageData(prev => ({
                ...prev,
                pushRecords: prev.pushRecords.map(record => 
                    record.id === message.id 
                        ? { ...record, status: 'sent', sendTime: new Date().toISOString().slice(0, 19).replace('T', ' ') }
                        : record
                )
            }));
            
            message.success('消息发送成功！');
        } catch (error) {
            message.error('发送失败，请稍后重试');
        }
    };

    const deleteMessage = async (messageRecord) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setMessageData(prev => ({
                ...prev,
                pushRecords: prev.pushRecords.filter(record => record.id !== messageRecord.id)
            }));
            
            message.success('消息删除成功');
        } catch (error) {
            message.error('删除失败');
        }
    };

    const createNewTemplate = () => {
        setEditingTemplate(null);
        templateForm.resetFields();
        templateForm.setFieldsValue({
            type: 'system',
            variables: []
        });
        setTemplateModalVisible(true);
    };

    const editTemplate = (template) => {
        setEditingTemplate(template);
        templateForm.setFieldsValue(template);
        setTemplateModalVisible(true);
    };

    const useTemplate = (template) => {
        pushForm.setFieldsValue({
            type: template.type,
            title: template.title,
            content: template.content,
            priority: 'normal',
            targetType: 'all',
            sendType: 'immediate'
        });
        setPushModalVisible(true);
    };

    const copyTemplate = async (template) => {
        try {
            const newTemplate = {
                ...template,
                id: `tpl_${Date.now()}`,
                name: `${template.name} (副本)`,
                usageCount: 0,
                created: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            
            setMessageData(prev => ({
                ...prev,
                templates: [...prev.templates, newTemplate]
            }));
            
            message.success('模板复制成功');
        } catch (error) {
            message.error('复制失败');
        }
    };

    const deleteTemplate = async (template) => {
        try {
            setMessageData(prev => ({
                ...prev,
                templates: prev.templates.filter(t => t.id !== template.id)
            }));
            
            message.success('模板删除成功');
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handlePushSubmit = async (values) => {
        try {
            message.loading('正在保存消息...', 2);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const newMessage = {
                id: editingMessage?.id || `msg_${Date.now()}`,
                ...values,
                targetCount: values.targetType === 'all' ? 125634 : values.targetType === 'group' ? 45678 : 1,
                sentCount: values.sendType === 'immediate' ? (values.targetType === 'all' ? 125634 : values.targetType === 'group' ? 45678 : 1) : 0,
                readCount: 0,
                status: values.sendType === 'immediate' ? 'sent' : 'scheduled',
                sendTime: values.sendType === 'immediate' ? 
                    new Date().toISOString().slice(0, 19).replace('T', ' ') : 
                    values.sendTime.format('YYYY-MM-DD HH:mm:ss'),
                creator: '当前用户',
                icon: MESSAGE_TYPES[values.type]?.icon || '📢'
            };

            if (editingMessage) {
                setMessageData(prev => ({
                    ...prev,
                    pushRecords: prev.pushRecords.map(record => 
                        record.id === editingMessage.id ? newMessage : record
                    )
                }));
            } else {
                setMessageData(prev => ({
                    ...prev,
                    pushRecords: [newMessage, ...prev.pushRecords]
                }));
            }

            message.success(editingMessage ? '消息更新成功！' : '消息创建成功！');
            setPushModalVisible(false);
            pushForm.resetFields();
        } catch (error) {
            message.error('操作失败，请稍后重试');
        }
    };

    const handleTemplateSubmit = async (values) => {
        try {
            message.loading('正在保存模板...', 1);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newTemplate = {
                id: editingTemplate?.id || `tpl_${Date.now()}`,
                ...values,
                usageCount: editingTemplate?.usageCount || 0,
                creator: '当前用户',
                created: editingTemplate?.created || new Date().toISOString().slice(0, 19).replace('T', ' '),
                icon: MESSAGE_TYPES[values.type]?.icon || '📢'
            };

            if (editingTemplate) {
                setMessageData(prev => ({
                    ...prev,
                    templates: prev.templates.map(template => 
                        template.id === editingTemplate.id ? newTemplate : template
                    )
                }));
            } else {
                setMessageData(prev => ({
                    ...prev,
                    templates: [...prev.templates, newTemplate]
                }));
            }

            message.success(editingTemplate ? '模板更新成功！' : '模板创建成功！');
            setTemplateModalVisible(false);
            templateForm.resetFields();
        } catch (error) {
            message.error('操作失败，请稍后重试');
        }
    };

    const tabItems = [
        {
            key: 'push',
            label: '📤 推送管理',
            children: renderPushManagement()
        },
        {
            key: 'template',
            label: '📋 模板管理',
            children: renderTemplateManagement()
        }
    ];

    console.log('Creating MessageManagement JSX...');

    return React.createElement('div', { className: 'message-management-page' }, [
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
                style: { margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }
            }, '💬 消息管理'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'refresh',
                    onClick: () => loadMessageData()
                }, '刷新数据'),
                React.createElement(Button, {
                    key: 'help',
                    type: 'default',
                    onClick: () => message.info('消息管理帮助文档')
                }, '使用帮助')
            ])
        ]),

        React.createElement(Tabs, {
            key: 'main-tabs',
            items: tabItems,
            defaultActiveKey: 'push'
        }),

        // 新建/编辑推送Modal
        React.createElement(Modal, {
            key: 'push-modal',
            title: editingMessage ? '编辑消息推送' : '新建消息推送',
            open: pushModalVisible,
            onCancel: () => {
                setPushModalVisible(false);
                pushForm.resetFields();
            },
            onOk: () => pushForm.submit(),
            width: 800,
            okText: '确认发送',
            cancelText: '取消'
        }, React.createElement(Form, {
            form: pushForm,
            layout: 'vertical',
            onFinish: handlePushSubmit
        }, [
            React.createElement(Row, { key: 'basic-info', gutter: [16, 16] }, [
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        label: '消息类型',
                        name: 'type',
                        rules: [{ required: true, message: '请选择消息类型' }]
                    }, React.createElement(Select, {
                        placeholder: '选择消息类型',
                        options: Object.entries(MESSAGE_TYPES).map(([key, config]) => ({
                            value: key,
                            label: React.createElement('span', {}, [
                                React.createElement('span', { key: 'icon', style: { marginRight: '8px' } }, config.icon),
                                React.createElement('span', { key: 'label' }, config.label)
                            ])
                        }))
                    }))
                ]),
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        label: '优先级',
                        name: 'priority',
                        rules: [{ required: true, message: '请选择优先级' }]
                    }, React.createElement(Select, {
                        options: Object.entries(PRIORITY_CONFIG).map(([key, config]) => ({
                            value: key,
                            label: config.label
                        }))
                    }))
                ])
            ]),

            React.createElement(Form.Item, {
                key: 'title',
                label: '消息标题',
                name: 'title',
                rules: [{ required: true, message: '请输入消息标题' }]
            }, React.createElement(Input, { 
                placeholder: '请输入消息标题',
                maxLength: 50,
                showCount: true
            })),

            React.createElement(Form.Item, {
                key: 'content',
                label: '消息内容',
                name: 'content',
                rules: [{ required: true, message: '请输入消息内容' }]
            }, React.createElement(Input.TextArea, { 
                rows: 4,
                placeholder: '请输入消息内容，支持使用模板变量',
                maxLength: 200,
                showCount: true
            })),

            React.createElement(Row, { key: 'target-settings', gutter: [16, 16] }, [
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        label: '推送目标',
                        name: 'targetType',
                        rules: [{ required: true, message: '请选择推送目标' }]
                    }, React.createElement(Radio.Group, {}, [
                        React.createElement(Radio, { key: 'all', value: 'all' }, '全体用户'),
                        React.createElement(Radio, { key: 'group', value: 'group' }, '分组用户'),
                        React.createElement(Radio, { key: 'user', value: 'user' }, '指定用户')
                    ]))
                ]),
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        label: '发送方式',
                        name: 'sendType',
                        rules: [{ required: true, message: '请选择发送方式' }]
                    }, React.createElement(Radio.Group, {}, [
                        React.createElement(Radio, { key: 'immediate', value: 'immediate' }, '立即发送'),
                        React.createElement(Radio, { key: 'scheduled', value: 'scheduled' }, '定时发送')
                    ]))
                ])
            ]),

            React.createElement(Form.Item, {
                key: 'send-time',
                label: '发送时间',
                name: 'sendTime',
                dependencies: ['sendType'],
                rules: [
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (getFieldValue('sendType') === 'scheduled' && !value) {
                                return Promise.reject(new Error('请选择发送时间'));
                            }
                            return Promise.resolve();
                        }
                    })
                ]
            }, React.createElement(DatePicker, {
                showTime: { format: 'HH:mm' },
                style: { width: '100%' },
                format: 'YYYY-MM-DD HH:mm',
                placeholder: '选择发送时间',
                disabledDate: (current) => current && current < window.moment().startOf('day')
            })),

            React.createElement(Divider, { key: 'divider' }),

            React.createElement(Row, { key: 'notification-settings', gutter: [16, 16] }, [
                React.createElement(Col, { span: 8 }, [
                    React.createElement(Form.Item, {
                        label: '推送声音',
                        name: 'enableSound',
                        valuePropName: 'checked'
                    }, React.createElement(Switch, {
                        checkedChildren: '开启',
                        unCheckedChildren: '关闭'
                    }))
                ]),
                React.createElement(Col, { span: 8 }, [
                    React.createElement(Form.Item, {
                        label: '震动提醒',
                        name: 'enableVibration',
                        valuePropName: 'checked'
                    }, React.createElement(Switch, {
                        checkedChildren: '开启',
                        unCheckedChildren: '关闭'
                    }))
                ]),
                React.createElement(Col, { span: 8 }, [
                    React.createElement(Form.Item, {
                        label: '强制推送',
                        name: 'forcePush',
                        valuePropName: 'checked'
                    }, React.createElement(Switch, {
                        checkedChildren: '开启',
                        unCheckedChildren: '关闭'
                    }))
                ])
            ])
        ])),

        // 模板Modal
        React.createElement(Modal, {
            key: 'template-modal',
            title: editingTemplate ? '编辑消息模板' : '新建消息模板',
            open: templateModalVisible,
            onCancel: () => {
                setTemplateModalVisible(false);
                templateForm.resetFields();
            },
            onOk: () => templateForm.submit(),
            width: 600,
            okText: '保存',
            cancelText: '取消'
        }, React.createElement(Form, {
            form: templateForm,
            layout: 'vertical',
            onFinish: handleTemplateSubmit
        }, [
            React.createElement(Form.Item, {
                key: 'name',
                label: '模板名称',
                name: 'name',
                rules: [{ required: true, message: '请输入模板名称' }]
            }, React.createElement(Input, { placeholder: '请输入模板名称' })),

            React.createElement(Row, { key: 'template-basic', gutter: [16, 16] }, [
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        label: '消息类型',
                        name: 'type',
                        rules: [{ required: true, message: '请选择消息类型' }]
                    }, React.createElement(Select, {
                        placeholder: '选择消息类型',
                        options: Object.entries(MESSAGE_TYPES).map(([key, config]) => ({
                            value: key,
                            label: config.label
                        }))
                    }))
                ]),
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        label: '分类标签',
                        name: 'category',
                        rules: [{ required: true, message: '请输入分类标签' }]
                    }, React.createElement(Input, { placeholder: '如：系统维护、审核通知等' }))
                ])
            ]),

            React.createElement(Form.Item, {
                key: 'title',
                label: '消息标题模板',
                name: 'title',
                rules: [{ required: true, message: '请输入标题模板' }]
            }, React.createElement(Input, { 
                placeholder: '支持变量，如：{activity_name}',
                maxLength: 50
            })),

            React.createElement(Form.Item, {
                key: 'content',
                label: '消息内容模板',
                name: 'content',
                rules: [{ required: true, message: '请输入内容模板' }]
            }, React.createElement(Input.TextArea, { 
                rows: 4,
                placeholder: '支持变量替换，如：{user_name}、{time}等',
                maxLength: 200
            })),

            React.createElement(Form.Item, {
                key: 'variables',
                label: '模板变量',
                name: 'variables',
                extra: '输入模板中使用的变量名，用逗号分隔'
            }, React.createElement(Select, {
                mode: 'tags',
                placeholder: '输入变量名，如：user_name, activity_time',
                style: { width: '100%' }
            }))
        ])),

        // 预览Modal
        React.createElement(Modal, {
            key: 'preview-modal',
            title: '消息预览',
            open: previewModalVisible,
            onCancel: () => setPreviewModalVisible(false),
            footer: React.createElement(Button, {
                type: 'primary',
                onClick: () => setPreviewModalVisible(false)
            }, '关闭'),
            width: 400
        }, selectedMessage && React.createElement('div', {
            style: {
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '8px',
                fontFamily: 'PingFang SC, Helvetica, Arial, sans-serif'
            }
        }, [
            React.createElement('div', {
                key: 'header',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    fontSize: '14px',
                    color: '#666'
                }
            }, [
                React.createElement('span', { key: 'icon', style: { marginRight: '8px', fontSize: '18px' } }, selectedMessage.icon),
                React.createElement('span', { key: 'type' }, MESSAGE_TYPES[selectedMessage.type]?.label)
            ]),
            React.createElement('div', {
                key: 'title',
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '8px'
                }
            }, selectedMessage.title),
            React.createElement('div', {
                key: 'content',
                style: {
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.5'
                }
            }, selectedMessage.content),
            React.createElement('div', {
                key: 'time',
                style: {
                    fontSize: '12px',
                    color: '#999',
                    marginTop: '12px',
                    textAlign: 'right'
                }
            }, selectedMessage.sendTime)
        ]))
    ]);
};

console.log('MessageManagement component defined');
window.MessageManagement = MessageManagement;
console.log('MessageManagement attached to window object'); 