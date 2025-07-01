// 直播管理页面 - 基于微赞API重构，直接调用微赞接口
const LiveManagement = () => {
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Tabs, DatePicker, Upload, Radio, Switch, TimePicker } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { RangePicker: DateRangePicker } = DatePicker;
    
    const [activeTab, setActiveTab] = React.useState('channels');
    const [channelData, setChannelData] = React.useState({});
    const [liveData, setLiveData] = React.useState({});
    const [replayData, setReplayData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [channelModalVisible, setChannelModalVisible] = React.useState(false);
    const [liveModalVisible, setLiveModalVisible] = React.useState(false);
    const [editingLive, setEditingLive] = React.useState(null);
    const [viewDetailModalVisible, setViewDetailModalVisible] = React.useState(false);
    const [selectedLive, setSelectedLive] = React.useState(null);
    const [channelForm] = Form.useForm();
    const [liveForm] = Form.useForm();
    const [editingChannel, setEditingChannel] = React.useState(null);

    // 搜索和筛选状态
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [channelFilter, setChannelFilter] = React.useState('all');
    const [qualityFilter, setQualityFilter] = React.useState('all');
    const [accessLevelFilter, setAccessLevelFilter] = React.useState('all');
    const [timeRange, setTimeRange] = React.useState(null);
    const [selectedRows, setSelectedRows] = React.useState([]);

    // 微赞API配置 - 模拟环境
    const VZAN_CONFIG = {
        baseUrl: 'https://paas.vzan.com',
        appId: 'demo_app_id', // 演示用
        appSecret: 'demo_app_secret', // 演示用
        accessToken: 'demo_access_token' // 演示用
    };

    React.useEffect(() => {
        loadChannelData();
        loadLiveData();
        loadReplayData();
    }, [activeTab, searchText, statusFilter, channelFilter, qualityFilter, accessLevelFilter, timeRange]);

    // 重置筛选条件
    const resetFilters = () => {
        setSearchText('');
        setStatusFilter('all');
        setChannelFilter('all');
        setQualityFilter('all');
        setAccessLevelFilter('all');
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
            case 'channels': return channelData.channels || [];
            case 'lives': return liveData.lives || [];
            case 'replays': return replayData.replays || [];
            default: return [];
        }
    };

    // 获取Tab显示名称
    const getTabDisplayName = (tab) => {
        const names = {
            channels: '频道',
            lives: '直播',
            replays: '回放'
        };
        return names[tab] || '数据';
    };

    // 数据筛选逻辑
    const filterData = (data) => {
        if (!data || data.length === 0) return [];
        
        return data.filter(item => {
            // 根据不同Tab应用不同的筛选逻辑
            if (activeTab === 'channels') {
                return filterChannels(item);
            } else if (activeTab === 'lives') {
                return filterLives(item);
            } else if (activeTab === 'replays') {
                return filterReplays(item);
            }
            return true;
        });
    };

    // 频道筛选逻辑
    const filterChannels = (channel) => {
        // 文本搜索
        if (searchText && 
            !channel.name?.toLowerCase().includes(searchText.toLowerCase()) && 
            !channel.description?.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
        
        // 状态筛选
        if (statusFilter !== 'all' && channel.status !== statusFilter) {
            return false;
        }
        
        return true;
    };

    // 直播筛选逻辑
    const filterLives = (live) => {
        // 文本搜索
        if (searchText && 
            !live.title?.toLowerCase().includes(searchText.toLowerCase()) && 
            !live.description?.toLowerCase().includes(searchText.toLowerCase()) &&
            !live.presenter?.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
        
        // 状态筛选
        if (statusFilter !== 'all' && live.status !== statusFilter) {
            return false;
        }
        
        // 频道筛选
        if (channelFilter !== 'all' && live.channelId !== channelFilter) {
            return false;
        }
        
        // 画质筛选
        if (qualityFilter !== 'all' && live.quality !== qualityFilter) {
            return false;
        }
        
        // 访问权限筛选
        if (accessLevelFilter !== 'all' && live.accessLevel !== accessLevelFilter) {
            return false;
        }
        
        // 时间范围筛选
        if (timeRange && timeRange.length === 2) {
            const itemTime = new Date(live.startTime);
            const startTime = timeRange[0].startOf('day');
            const endTime = timeRange[1].endOf('day');
            if (itemTime < startTime || itemTime > endTime) {
                return false;
            }
        }
        
        return true;
    };

    // 回放筛选逻辑
    const filterReplays = (replay) => {
        // 文本搜索
        if (searchText && 
            !replay.title?.toLowerCase().includes(searchText.toLowerCase()) && 
            !replay.originalLive?.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
        
        // 状态筛选
        if (statusFilter !== 'all' && replay.status !== statusFilter) {
            return false;
        }
        
        // 画质筛选
        if (qualityFilter !== 'all' && replay.quality !== qualityFilter) {
            return false;
        }
        
        // 时间范围筛选
        if (timeRange && timeRange.length === 2) {
            const itemTime = new Date(replay.created);
            const startTime = timeRange[0].startOf('day');
            const endTime = timeRange[1].endOf('day');
            if (itemTime < startTime || itemTime > endTime) {
                return false;
            }
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
                getExtraFilterColumns(),
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
                                if (activeTab === 'channels') loadChannelData();
                                else if (activeTab === 'lives') loadLiveData();
                                else if (activeTab === 'replays') loadReplayData();
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
            channels: '搜索频道名称或描述',
            lives: '搜索直播标题、描述或主讲人',
            replays: '搜索回放标题或原始直播'
        };
        return placeholders[activeTab] || '搜索...';
    };

    // 获取状态筛选选项
    const getStatusFilterOptions = () => {
        const optionsMap = {
            channels: [
                React.createElement(Option, { value: 'all' }, '全部状态'),
                React.createElement(Option, { value: 'active' }, '启用'),
                React.createElement(Option, { value: 'inactive' }, '禁用')
            ],
            lives: [
                React.createElement(Option, { value: 'all' }, '全部状态'),
                React.createElement(Option, { value: 'live' }, '直播中'),
                React.createElement(Option, { value: 'scheduled' }, '即将开始'),
                React.createElement(Option, { value: 'ended' }, '已结束'),
                React.createElement(Option, { value: 'cancelled' }, '已取消')
            ],
            replays: [
                React.createElement(Option, { value: 'all' }, '全部状态'),
                React.createElement(Option, { value: 'available' }, '可用'),
                React.createElement(Option, { value: 'processing' }, '处理中'),
                React.createElement(Option, { value: 'failed' }, '失败')
            ]
        };
        return optionsMap[activeTab] || [React.createElement(Option, { value: 'all' }, '全部状态')];
    };

    // 获取额外筛选列
    const getExtraFilterColumns = () => {
        if (activeTab === 'lives') {
            return [
                React.createElement(Col, { span: 3 }, [
                    React.createElement(Select, {
                        placeholder: "频道筛选",
                        value: channelFilter,
                        onChange: setChannelFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部频道'),
                        React.createElement(Option, { value: 'vzan_001' }, '展会直播频道'),
                        React.createElement(Option, { value: 'vzan_002' }, '技术分享频道'),
                        React.createElement(Option, { value: 'vzan_003' }, '协会活动频道')
                    ])
                ]),
                React.createElement(Col, { span: 3 }, [
                    React.createElement(Select, {
                        placeholder: "画质筛选",
                        value: qualityFilter,
                        onChange: setQualityFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部画质'),
                        React.createElement(Option, { value: '1080p' }, '1080P'),
                        React.createElement(Option, { value: '720p' }, '720P'),
                        React.createElement(Option, { value: '480p' }, '480P')
                    ])
                ])
            ];
        } else if (activeTab === 'replays') {
            return [
                React.createElement(Col, { span: 3 }, [
                    React.createElement(Select, {
                        placeholder: "画质筛选",
                        value: qualityFilter,
                        onChange: setQualityFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部画质'),
                        React.createElement(Option, { value: '1080P' }, '1080P'),
                        React.createElement(Option, { value: '720P' }, '720P'),
                        React.createElement(Option, { value: '480P' }, '480P')
                    ])
                ]),
                React.createElement(Col, { span: 3 }, [])
            ];
        }
        return [
            React.createElement(Col, { span: 3 }, []),
            React.createElement(Col, { span: 3 }, [])
        ];
    };

    // 获取批量操作按钮
    const getBatchOperationButtons = () => {
        const buttons = [
            React.createElement(Button, {
                onClick: handleExport
            }, '导出数据'),
            React.createElement(Button, {
                onClick: () => {
                    if (activeTab === 'channels') loadChannelData();
                    else if (activeTab === 'lives') loadLiveData();
                    else if (activeTab === 'replays') loadReplayData();
                }
            }, '刷新')
        ];

        if (activeTab === 'lives' && selectedRows.length > 0) {
            buttons.unshift(
                React.createElement(Button, {
                    type: 'primary',
                    disabled: selectedRows.length === 0,
                    onClick: () => handleBatchLiveOperation('generateReplay')
                }, `批量生成回放 (${selectedRows.length})`),
                React.createElement(Button, {
                    danger: true,
                    disabled: selectedRows.length === 0,
                    onClick: () => handleBatchLiveOperation('end')
                }, `批量结束直播 (${selectedRows.length})`)
            );
        }

        return buttons;
    };

    // 批量直播操作
    const handleBatchLiveOperation = (action) => {
        if (selectedRows.length === 0) {
            message.warning('请选择要操作的直播');
            return;
        }

        const actionText = action === 'generateReplay' ? '生成回放' : '结束直播';
        Modal.confirm({
            title: `确认${actionText}选中的直播？`,
            content: `将对 ${selectedRows.length} 个直播执行${actionText}操作`,
            onOk: () => {
                setLoading(true);
                setTimeout(() => {
                    setSelectedRows([]);
                    loadLiveData();
                    message.success(`已${actionText} ${selectedRows.length} 个直播`);
                }, 1000);
            }
        });
    };

    // 模拟微赞API获取频道数据
    const loadChannelData = async () => {
        setLoading(true);
        try {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 模拟微赞API响应数据
            const mockVzanResponse = {
                code: 200,
                message: 'success',
                data: [
                    {
                        channel_id: 'vzan_001',
                        channel_name: '展会直播频道',
                        description: '城轨展会活动专用直播频道',
                        status: 1,
                        live_count: 15,
                        total_views: 125634,
                        create_time: '2024-01-10 10:00:00'
                    },
                    {
                        channel_id: 'vzan_002',
                        channel_name: '技术分享频道',
                        description: '技术讲座和专业分享直播',
                        status: 1,
                        live_count: 8,
                        total_views: 89245,
                        create_time: '2024-01-15 14:30:00'
                    },
                    {
                        channel_id: 'vzan_003',
                        channel_name: '协会活动频道',
                        description: '协会官方会议和活动直播',
                        status: 0,
                        live_count: 3,
                        total_views: 34567,
                        create_time: '2024-02-01 09:15:00'
                    }
                ]
            };
            
            setChannelData({
                channels: mockVzanResponse.data.map(channel => ({
                    id: channel.channel_id,
                    name: channel.channel_name,
                    description: channel.description || '',
                    status: channel.status === 1 ? 'active' : 'inactive',
                    liveCount: channel.live_count || 0,
                    totalViews: channel.total_views || 0,
                    provider: '微赞',
                    created: channel.create_time,
                    vzan_channel_id: channel.channel_id
                }))
            });
            
            message.success('频道数据加载成功');
        } catch (error) {
            console.error('获取频道数据失败:', error);
            message.error('获取频道数据失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // 模拟微赞API获取直播数据（话题管理）
    const loadLiveData = async () => {
        try {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // 模拟微赞话题API响应数据
            const mockTopicResponse = {
                code: 200,
                message: 'success',
                data: [
                    {
                        topic_id: 'vz_topic_001',
                        topic_name: '城轨新技术发布会',
                        description: '介绍最新的城市轨道交通技术发展趋势和创新应用',
                        host_name: '张工程师',
                        channel_name: '展会直播频道',
                        channel_id: 'vzan_001',
                        status: 1, // 直播中
                        start_time: '2024-01-15 14:00:00',
                        end_time: null,
                        current_viewers: 2456,
                        peak_viewers: 3421,
                        duration: 8130, // 秒
                        live_type: 'live',
                        access_type: 0, // 公开
                        enable_comment: 1,
                        auto_record: 1,
                        quality: '1080p',
                        cover_url: 'https://placehold.co/120x68/e0e7ff/4f46e5?text=Live1'
                    },
                    {
                        topic_id: 'vz_topic_002',
                        topic_name: '智能调度系统介绍',
                        description: '深入解析智能调度系统的核心技术和实施方案',
                        host_name: '李专家',
                        channel_name: '技术分享频道',
                        channel_id: 'vzan_002',
                        status: 0, // 未开始
                        start_time: '2024-01-16 09:30:00',
                        end_time: null,
                        current_viewers: 0,
                        peak_viewers: 0,
                        duration: 0,
                        live_type: 'live',
                        access_type: 1, // 注册用户
                        enable_comment: 1,
                        auto_record: 1,
                        quality: '1080p',
                        cover_url: 'https://placehold.co/120x68/e0e7ff/4f46e5?text=Live2'
                    },
                    {
                        topic_id: 'vz_topic_003',
                        topic_name: '安全运营管理讲座',
                        description: '城市轨道交通安全运营管理的实践经验分享',
                        host_name: '王主任',
                        channel_name: '协会活动频道',
                        channel_id: 'vzan_003',
                        status: 2, // 已结束
                        start_time: '2024-01-14 10:00:00',
                        end_time: '2024-01-14 11:45:20',
                        current_viewers: 0,
                        peak_viewers: 1876,
                        duration: 6320,
                        live_type: 'live',
                        access_type: 0,
                        enable_comment: 1,
                        auto_record: 1,
                        quality: '720p',
                        cover_url: 'https://placehold.co/120x68/e0e7ff/4f46e5?text=Live3'
                    }
                ]
            };
            
            setLiveData({
                lives: mockTopicResponse.data.map(topic => ({
                    id: topic.topic_id,
                    title: topic.topic_name,
                    description: topic.description || '',
                    presenter: topic.host_name || '',
                    channel: topic.channel_name || '',
                    channelId: topic.channel_id,
                    status: mapVzanStatus(topic.status),
                    startTime: topic.start_time,
                    endTime: topic.end_time,
                    viewers: topic.current_viewers || 0,
                    peakViewers: topic.peak_viewers || 0,
                    duration: formatDuration(topic.duration),
                    provider: '微赞',
                    vzan_topic_id: topic.topic_id,
                    cover: topic.cover_url || 'https://placehold.co/120x68/e0e7ff/4f46e5?text=Live',
                    liveType: topic.live_type || 'live',
                    accessLevel: mapAccessLevel(topic.access_type),
                    enableComment: topic.enable_comment === 1,
                    autoRecord: topic.auto_record === 1,
                    quality: topic.quality || '1080p'
                }))
            });
            
        } catch (error) {
            console.error('获取直播数据失败:', error);
            message.error('获取直播数据失败，请稍后重试');
        }
    };

    // 模拟微赞API获取回放数据
    const loadReplayData = async () => {
        try {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 模拟微赞回放API响应数据
            const mockReplayResponse = {
                code: 200,
                message: 'success',
                data: [
                    {
                        replay_id: 'vz_replay_001',
                        replay_name: '城轨技术峰会完整回放',
                        topic_name: '城轨新技术发布会',
                        topic_id: 'vz_topic_001',
                        duration: 8130,
                        file_size: 1288490188, // bytes
                        quality: '1080P',
                        status: 1, // 可用
                        play_count: 15634,
                        create_time: '2024-01-15 16:30:00'
                    },
                    {
                        replay_id: 'vz_replay_002',
                        replay_name: '智能化运维系统分享',
                        topic_name: '技术分享会议',
                        topic_id: 'vz_topic_002',
                        duration: 5445,
                        file_size: 891289600,
                        quality: '720P',
                        status: 0, // 处理中
                        play_count: 0,
                        create_time: '2024-01-14 11:45:00'
                    },
                    {
                        replay_id: 'vz_replay_003',
                        replay_name: '协会年度总结大会',
                        topic_name: '协会年度会议',
                        topic_id: 'vz_topic_003',
                        duration: 12015,
                        file_size: 2259517440,
                        quality: '1080P',
                        status: 1,
                        play_count: 8923,
                        create_time: '2024-01-13 18:20:00'
                    }
                ]
            };
            
            setReplayData({
                replays: mockReplayResponse.data.map(replay => ({
                    id: replay.replay_id,
                    title: replay.replay_name,
                    originalLive: replay.topic_name,
                    originalLiveId: replay.topic_id,
                    duration: formatDuration(replay.duration),
                    fileSize: formatFileSize(replay.file_size),
                    quality: replay.quality,
                    status: mapReplayStatus(replay.status),
                    views: replay.play_count || 0,
                    created: replay.create_time,
                    provider: '微赞',
                    vzan_replay_id: replay.replay_id
                }))
            });
            
        } catch (error) {
            console.error('获取回放数据失败:', error);
            message.error('获取回放数据失败，请稍后重试');
        }
    };

    // 工具函数：映射微赞状态到本系统状态
    const mapVzanStatus = (vzanStatus) => {
        const statusMap = {
            0: 'scheduled',  // 未开始
            1: 'live',       // 直播中
            2: 'ended',      // 已结束
            3: 'cancelled'   // 已取消
        };
        return statusMap[vzanStatus] || 'scheduled';
    };

    const mapAccessLevel = (accessType) => {
        const accessMap = {
            0: 'public',     // 公开
            1: 'registered', // 注册用户
            2: 'vip',        // VIP用户
            3: 'password'    // 密码保护
        };
        return accessMap[accessType] || 'public';
    };

    const mapReplayStatus = (status) => {
        const statusMap = {
            0: 'processing', // 处理中
            1: 'available',  // 可用
            2: 'failed'      // 失败
        };
        return statusMap[status] || 'processing';
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '00:00:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0MB';
        const gb = bytes / (1024 * 1024 * 1024);
        const mb = bytes / (1024 * 1024);
        return gb >= 1 ? `${gb.toFixed(1)}GB` : `${mb.toFixed(0)}MB`;
    };

    // 渲染频道管理
    const renderChannelManagement = () => {
        const channelColumns = [
            {
                title: '频道信息',
                dataIndex: 'name',
                width: 250,
                render: (text, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'name',
                        style: { fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }
                    }, text),
                    React.createElement('div', {
                        key: 'desc',
                        style: { fontSize: '12px', color: '#666' }
                    }, record.description),
                    React.createElement('div', {
                        key: 'provider',
                        style: { fontSize: '12px', color: '#999', marginTop: '4px' }
                    }, `微赞频道ID: ${record.vzan_channel_id}`)
                ])
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (status) => React.createElement(Tag, {
                    color: status === 'active' ? 'green' : 'default'
                }, status === 'active' ? '启用' : '禁用')
            },
            {
                title: '直播数量',
                dataIndex: 'liveCount',
                width: 100,
                render: (count) => React.createElement('span', {
                    style: { fontWeight: 'bold', color: '#1890ff' }
                }, count)
            },
            {
                title: '总观看量',
                dataIndex: 'totalViews',
                width: 120,
                render: (views) => views.toLocaleString()
            },
            {
                title: '创建时间',
                dataIndex: 'created',
                width: 120
            },
            {
                title: '操作',
                width: 150,
                render: (_, record) => React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        onClick: () => editChannel(record)
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'refresh',
                        size: 'small',
                        type: 'primary',
                        onClick: () => refreshChannelData(record)
                    }, '刷新数据')
                ])
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '频道管理 - 微赞API集成',
                description: '通过微赞开放平台API管理直播频道，实时获取频道数据和统计信息',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Card, {
                key: 'channel-table',
                title: '直播频道列表',
                extra: React.createElement(Space, {}, [
                    React.createElement(Button, {
                        onClick: () => createChannelViaMiczan()
                    }, '新建频道'),
                    React.createElement(Button, {
                        type: 'primary',
                        loading: loading,
                        onClick: () => loadChannelData()
                    }, '刷新频道')
                ])
            }, React.createElement(Table, {
                dataSource: channelData.channels?.map((item, index) => ({ ...item, key: index })) || [],
                columns: channelColumns,
                pagination: false,
                size: 'small',
                loading: loading
            }))
        ]);
    };

    // 渲染直播管理
    const renderLiveManagement = () => {
        const liveColumns = [
            {
                title: '直播信息',
                dataIndex: 'title',
                width: 350,
                render: (text, record) => React.createElement('div', {
                    style: { display: 'flex', alignItems: 'center', gap: 16 }
                }, [
                    React.createElement('img', {
                        key: 'cover',
                        src: record.cover,
                        alt: record.title,
                        style: { width: 120, height: 68, borderRadius: 8, objectFit: 'cover' }
                    }),
                    React.createElement('div', { key: 'info' }, [
                        React.createElement('div', {
                            key: 'title',
                            style: { fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }
                        }, text),
                        React.createElement('div', {
                            key: 'desc',
                            style: { fontSize: '12px', color: '#666', marginBottom: '4px' }
                        }, record.description),
                        React.createElement('div', {
                            key: 'presenter',
                            style: { fontSize: '12px', color: '#999' }
                        }, `主讲人: ${record.presenter}`),
                        React.createElement('div', {
                            key: 'vzan',
                            style: { fontSize: '12px', color: '#999' }
                        }, `微赞话题ID: ${record.vzan_topic_id}`)
                    ])
                ])
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (status) => {
                    const statusConfig = {
                        live: { color: 'red', text: '直播中' },
                        scheduled: { color: 'orange', text: '即将开始' },
                        ended: { color: 'green', text: '已结束' },
                        cancelled: { color: 'default', text: '已取消' }
                    };
                    const config = statusConfig[status] || { color: 'default', text: status };
                    return React.createElement(Tag, { color: config.color }, config.text);
                }
            },
            {
                title: '开播时间',
                dataIndex: 'startTime',
                width: 150
            },
            {
                title: '观看数据',
                dataIndex: 'viewers',
                width: 120,
                render: (viewers, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'current',
                        style: { fontSize: '14px', fontWeight: 'bold' }
                    }, `实时: ${viewers.toLocaleString()}`),
                    React.createElement('div', {
                        key: 'peak',
                        style: { fontSize: '12px', color: '#666' }
                    }, `峰值: ${record.peakViewers.toLocaleString()}`)
                ])
            },
            {
                title: '时长',
                dataIndex: 'duration',
                width: 100
            },
            {
                title: '操作',
                width: 250,
                render: (_, record) => React.createElement(Space, { size: 'small' }, [
                    React.createElement(Button, {
                        key: 'view',
                        size: 'small',
                        onClick: () => viewLiveDetail(record)
                    }, '查看'),
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        onClick: () => editLive(record)
                    }, '编辑'),
                    record.status === 'scheduled' && React.createElement(Button, {
                        key: 'start',
                        size: 'small',
                        type: 'primary',
                        onClick: () => startLiveViaMiczan(record)
                    }, '开播'),
                    record.status === 'live' && React.createElement(Button, {
                        key: 'end',
                        size: 'small',
                        danger: true,
                        onClick: () => endLiveViaMiczan(record)
                    }, '结束直播'),
                    record.status === 'ended' && React.createElement(Button, {
                        key: 'replay',
                        size: 'small',
                        onClick: () => generateReplayViaMiczan(record)
                    }, '生成回放'),
                    React.createElement(Button, {
                        key: 'refresh',
                        size: 'small',
                        onClick: () => refreshLiveStatus(record)
                    }, '刷新状态')
                ])
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '直播管理 - 微赞话题API',
                description: '通过微赞话题管理API创建和管理直播活动，实时获取直播状态和观看数据',
                type: 'success',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Card, {
                key: 'live-table',
                title: '直播活动列表',
                extra: React.createElement(Space, {}, [
                    React.createElement(Button, {
                        type: 'primary',
                        onClick: () => createNewLive()
                    }, '新建直播'),
                    React.createElement(Button, {
                        loading: loading,
                        onClick: () => loadLiveData()
                    }, '刷新数据')
                ])
            }, React.createElement(Table, {
                dataSource: liveData.lives?.map((item, index) => ({ ...item, key: index })) || [],
                columns: liveColumns,
                pagination: { pageSize: 10 },
                size: 'small',
                scroll: { x: 1200 },
                loading: loading
            }))
        ]);
    };

    // 渲染回放管理
    const renderReplayManagement = () => {
        const replayColumns = [
            {
                title: '回放信息',
                dataIndex: 'title',
                width: 200,
                render: (text, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'title',
                        style: { fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }
                    }, text),
                    React.createElement('div', {
                        key: 'original',
                        style: { fontSize: '12px', color: '#666' }
                    }, `原直播: ${record.originalLive}`),
                    React.createElement('div', {
                        key: 'vzan',
                        style: { fontSize: '12px', color: '#999', marginTop: '4px' }
                    }, `微赞回放ID: ${record.vzan_replay_id}`)
                ])
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (status) => {
                    const statusConfig = {
                        available: { color: 'green', text: '可播放' },
                        processing: { color: 'orange', text: '处理中' },
                        failed: { color: 'red', text: '处理失败' }
                    };
                    const config = statusConfig[status] || { color: 'default', text: status };
                    return React.createElement(Tag, { color: config.color }, config.text);
                }
            },
            {
                title: '时长',
                dataIndex: 'duration',
                width: 100
            },
            {
                title: '文件大小',
                dataIndex: 'fileSize',
                width: 100
            },
            {
                title: '画质',
                dataIndex: 'quality',
                width: 80
            },
            {
                title: '观看次数',
                dataIndex: 'views',
                width: 100,
                render: (views) => views.toLocaleString()
            },
            {
                title: '生成时间',
                dataIndex: 'created',
                width: 150
            },
            {
                title: '操作',
                width: 150,
                render: (_, record) => React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'play',
                        size: 'small',
                        type: 'primary',
                        disabled: record.status !== 'available',
                        onClick: () => playReplayViaMiczan(record)
                    }, '播放'),
                    React.createElement(Button, {
                        key: 'download',
                        size: 'small',
                        disabled: record.status !== 'available',
                        onClick: () => downloadReplayViaMiczan(record)
                    }, '下载')
                ])
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '回放管理 - 微赞回放API',
                description: '通过微赞回放API管理直播回放视频，支持在线播放和下载',
                type: 'warning',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Card, {
                key: 'replay-table',
                title: '回放视频列表',
                extra: React.createElement(Button, {
                    loading: loading,
                    onClick: () => loadReplayData()
                }, '刷新回放')
            }, React.createElement(Table, {
                dataSource: replayData.replays?.map((item, index) => ({ ...item, key: index })) || [],
                columns: replayColumns,
                pagination: false,
                size: 'small',
                loading: loading
            }))
        ]);
    };

    // 工具函数
    const editChannel = (channel) => {
        setEditingChannel(channel);
        channelForm.setFieldsValue(channel);
        setChannelModalVisible(true);
    };

    const refreshChannelData = async (channel) => {
        message.loading('正在刷新频道数据...', 1);
        try {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 模拟微赞API成功响应
            message.success(`频道"${channel.name}"数据刷新成功！`);
            loadChannelData(); // 重新加载列表
        } catch (error) {
            console.error('刷新频道数据失败:', error);
            message.error('刷新失败，请稍后重试');
        }
    };

    // 通过微赞API创建频道 - 模拟
    const createChannelViaMiczan = () => {
        setEditingChannel(null);
        channelForm.resetFields();
        setChannelModalVisible(true);
    };

    // 处理频道表单提交 - 模拟API调用
    const handleChannelSubmit = async (values) => {
        try {
            message.loading(editingChannel ? '正在更新频道...' : '正在创建频道...', 2);
            
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 模拟微赞API成功响应
            const mockResponse = {
                code: 200,
                message: 'success',
                data: {
                    channel_id: editingChannel?.vzan_channel_id || `vzan_${Date.now()}`,
                    channel_name: values.name,
                    description: values.description,
                    status: 1,
                    create_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
                }
            };

            message.success(editingChannel ? '频道更新成功！' : '频道创建成功！');
            setChannelModalVisible(false);
            channelForm.resetFields();
            setEditingChannel(null);
            loadChannelData(); // 重新加载频道列表
        } catch (error) {
            console.error('频道操作失败:', error);
            message.error('操作失败，请稍后重试');
        }
    };

    // 新建直播
    const createNewLive = () => {
        setEditingLive(null);
        liveForm.resetFields();
        liveForm.setFieldsValue({
            // 基本设置
            liveType: 'live',
            title: '',
            presenter: '',
            description: '',
            
            // 权限设置
            accessLevel: 'public',
            enableComment: true,
            enableLike: true,
            enableDanmu: false,
            
            // 录制设置
            autoRecord: true,
            recordQuality: '1080p',
            quality: '1080p',
            bitrate: '4000',
            
            // 营销设置
            enableBooking: true,
            remindTime: ['15', '60'],
            enableWechatShare: true,
            enableWeiboShare: false,
            enableQQShare: false
        });
        setLiveModalVisible(true);
    };

    // 编辑直播
    const editLive = (live) => {
        setEditingLive(live);
        liveForm.setFieldsValue({
            ...live,
            scheduleTime: live.startTime ? window.moment(live.startTime) : null
        });
        setLiveModalVisible(true);
    };

    // 查看直播详情
    const viewLiveDetail = (live) => {
        setSelectedLive(live);
        setViewDetailModalVisible(true);
    };

    // 通过微赞API开始直播 - 模拟
    const startLiveViaMiczan = async (live) => {
        try {
            message.loading('正在开启直播...', 2);
            
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1800));
            
            // 模拟微赞API成功响应
            const mockResponse = {
                code: 200,
                message: 'success',
                data: {
                    topic_id: live.vzan_topic_id,
                    status: 1, // 直播中
                    start_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    stream_url: `rtmp://live.vzan.com/live/${live.vzan_topic_id}`,
                    push_url: `rtmp://push.vzan.com/live/${live.vzan_topic_id}?auth=demo_token`
                }
            };

            // 更新本地状态
            setLiveData(prev => ({
                ...prev,
                lives: prev.lives.map(l => 
                    l.id === live.id 
                        ? { ...l, status: 'live', startTime: mockResponse.data.start_time }
                        : l
                )
            }));
            
            message.success('直播已开始！推流地址已生成');
        } catch (error) {
            console.error('开播失败:', error);
            message.error('开播失败，请稍后重试');
        }
    };

    // 通过微赞API结束直播 - 模拟
    const endLiveViaMiczan = async (live) => {
        try {
            message.loading('正在结束直播...', 2);
            
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 模拟微赞API成功响应
            const mockResponse = {
                code: 200,
                message: 'success',
                data: {
                    topic_id: live.vzan_topic_id,
                    status: 2, // 已结束
                    end_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    total_viewers: live.peakViewers,
                    duration: Math.floor((new Date() - new Date(live.startTime)) / 1000)
                }
            };

            // 更新本地状态
            setLiveData(prev => ({
                ...prev,
                lives: prev.lives.map(l => 
                    l.id === live.id 
                        ? { 
                            ...l, 
                            status: 'ended', 
                            endTime: mockResponse.data.end_time,
                            viewers: 0,
                            duration: formatDuration(mockResponse.data.duration)
                        }
                        : l
                )
            }));
            
            message.success('直播已结束！回放生成中...');
        } catch (error) {
            console.error('结束直播失败:', error);
            message.error('结束直播失败，请稍后重试');
        }
    };

    const refreshLiveStatus = async (live) => {
        try {
            message.loading('正在刷新直播状态...', 1);
            
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 模拟微赞API响应 - 随机更新观看人数
            const newViewers = live.status === 'live' ? 
                Math.max(0, live.viewers + Math.floor(Math.random() * 200 - 100)) : 
                live.viewers;

            setLiveData(prev => ({
                ...prev,
                lives: prev.lives.map(l => 
                    l.id === live.id 
                        ? { 
                            ...l, 
                            viewers: newViewers,
                            peakViewers: Math.max(l.peakViewers, newViewers)
                        }
                        : l
                )
            }));

            message.success(`"${live.title}"状态刷新成功！`);
        } catch (error) {
            console.error('刷新状态失败:', error);
            message.error('刷新失败，请稍后重试');
        }
    };

    const generateReplayViaMiczan = async (live) => {
        try {
            message.loading('正在生成回放...', 2);
            
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 模拟微赞API成功响应
            const mockResponse = {
                code: 200,
                message: 'success',
                data: {
                    replay_id: `vz_replay_${Date.now()}`,
                    topic_id: live.vzan_topic_id,
                    status: 0, // 处理中
                    estimated_time: 300 // 预计5分钟处理完成
                }
            };

            message.success('回放生成任务已提交！预计5分钟内完成处理');
            loadReplayData(); // 刷新回放列表
        } catch (error) {
            console.error('生成回放失败:', error);
            message.error('生成回放失败，请稍后重试');
        }
    };

    const playReplayViaMiczan = (replay) => {
        // 模拟跳转到微赞播放页面
        const playUrl = `${VZAN_CONFIG.baseUrl}/replay/play/${replay.vzan_replay_id}`;
        
        message.success(`正在打开回放播放页面...`);
        
        // 模拟打开新窗口
        setTimeout(() => {
            const demoUrl = `data:text/html,<html><body style="font-family:Arial;padding:40px;text-align:center;"><h2>🎬 微赞回放播放器 (演示)</h2><p>回放名称: ${replay.title}</p><p>时长: ${replay.duration}</p><p>画质: ${replay.quality}</p><div style="width:80%;height:400px;background:#000;margin:20px auto;display:flex;align-items:center;justify-content:center;color:white;">📺 播放器区域 (演示)</div><p><button onclick="window.close()" style="padding:10px 20px;background:#1890ff;color:white;border:none;border-radius:4px;cursor:pointer;">关闭</button></p></body></html>`;
            window.open(demoUrl, '_blank');
        }, 500);
    };

    const downloadReplayViaMiczan = async (replay) => {
        try {
            message.loading('正在获取下载链接...', 2);
            
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 模拟微赞API响应
            const mockResponse = {
                code: 200,
                message: 'success',
                data: {
                    download_url: `https://cdn.vzan.com/replays/${replay.vzan_replay_id}.mp4?auth=demo_token&expires=${Date.now() + 3600000}`,
                    expires_in: 3600 // 1小时后过期
                }
            };

            message.success('下载链接已生成！有效期1小时');
            
            // 模拟下载
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,这是模拟下载文件\n\n回放名称: ' + replay.title + '\n文件大小: ' + replay.fileSize + '\n画质: ' + replay.quality + '\n\n注：这是演示环境的模拟下载';
            link.download = `${replay.title}.txt`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('下载回放失败:', error);
            message.error('下载失败，请稍后重试');
        }
    };

    // 处理直播表单提交 - 模拟API调用
    const handleLiveSubmit = async (values) => {
        try {
            const { scheduleTime, channelId, ...rest } = values;
            const selectedChannel = channelData.channels?.find(ch => ch.id === channelId);
            
            message.loading(editingLive ? '正在更新直播...' : '正在创建直播...', 2);

            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 模拟微赞API成功响应
            const mockResponse = {
                code: 200,
                message: 'success',
                data: {
                    topic_id: editingLive?.vzan_topic_id || `vz_topic_${Date.now()}`,
                    topic_name: values.title,
                    description: values.description,
                    host_name: values.presenter,
                    channel_id: selectedChannel?.vzan_channel_id,
                    status: 0, // 未开始
                    start_time: scheduleTime ? scheduleTime.format('YYYY-MM-DD HH:mm:ss') : null,
                    push_url: `rtmp://push.vzan.com/live/topic_${Date.now()}?auth=demo_token`,
                    stream_key: `demo_stream_key_${Date.now()}`
                }
            };

            message.success(editingLive ? '直播信息更新成功！' : '直播创建成功！推流信息已生成');
            setLiveModalVisible(false);
            liveForm.resetFields();
            loadLiveData(); // 重新加载直播列表
        } catch (error) {
            console.error('直播操作失败:', error);
            message.error('操作失败，请检查表单数据或稍后重试');
        }
    };

    const tabItems = [
        {
            key: 'channels',
            label: '📺 频道管理',
            children: renderChannelManagement()
        },
        {
            key: 'lives',
            label: '🔴 直播管理',
            children: renderLiveManagement()
        },
        {
            key: 'replays',
            label: '📹 回放管理',
            children: renderReplayManagement()
        }
    ];

    return React.createElement('div', { className: 'live-management-page' }, [
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
            }, '直播管理'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'refresh',
                    onClick: () => {
                        loadChannelData();
                        loadLiveData();
                        loadReplayData();
                    }
                }, '刷新数据'),
                React.createElement(Button, {
                    key: 'weizan',
                    type: 'primary',
                    onClick: () => window.open('https://www.vzan.com', '_blank')
                }, '访问微赞后台')
            ])
        ]),

        React.createElement(Tabs, {
            key: 'main-tabs',
            items: tabItems,
            defaultActiveKey: 'channels'
        }),

        // 新增频道模态框
        React.createElement(Modal, {
            key: 'channel-modal',
            title: editingChannel ? '编辑频道' : '新建频道',
            open: channelModalVisible,
            onCancel: () => {
                setChannelModalVisible(false);
                channelForm.resetFields();
                setEditingChannel(null);
            },
            onOk: () => channelForm.submit(),
            okText: '保存',
            cancelText: '取消'
        }, React.createElement(Form, {
            form: channelForm,
            layout: 'vertical',
            onFinish: handleChannelSubmit
        }, [
            React.createElement(Form.Item, {
                key: 'name',
                name: 'name',
                label: '频道名称',
                rules: [{ required: true, message: '请输入频道名称' }]
            }, React.createElement(Input, { placeholder: '请输入频道名称' })),
            React.createElement(Form.Item, {
                key: 'description',
                name: 'description',
                label: '频道描述'
            }, React.createElement(Input.TextArea, { placeholder: '请输入频道描述' })),
            React.createElement(Alert, {
                key: 'info',
                message: '微赞API集成说明',
                description: '频道将通过微赞开放平台API创建，确保您已配置正确的API权限',
                type: 'info',
                showIcon: true,
                style: { marginTop: '16px' }
            })
        ])),

        // 新建/编辑直播模态框
        React.createElement(Modal, {
            key: 'live-modal',
            title: editingLive ? '编辑直播' : '新建直播',
            open: liveModalVisible,
            onCancel: () => {
                setLiveModalVisible(false);
                liveForm.resetFields();
            },
            onOk: () => liveForm.submit(),
            width: 900,
            okText: '保存',
            cancelText: '取消',
            bodyStyle: { maxHeight: '70vh', overflowY: 'auto' }
        }, React.createElement(Form, {
            form: liveForm,
            layout: 'vertical',
            onFinish: handleLiveSubmit
        }, [
            React.createElement(Tabs, { 
                defaultActiveKey: 'basic',
                type: 'card',
                style: { marginBottom: 0 }
            }, [
                React.createElement(Tabs.TabPane, { 
                    tab: React.createElement('span', {}, [
                        React.createElement('span', { key: 'icon', style: { marginRight: '8px' } }, '⚙️'),
                        React.createElement('span', { key: 'text' }, '基本设置')
                    ]), 
                    key: 'basic' 
                }, [
                    // 直播类型选择
                    React.createElement('div', {
                        key: 'type-section',
                        style: { 
                            background: '#f8fafc', 
                            padding: '16px', 
                            borderRadius: '8px', 
                            marginBottom: '24px',
                            border: '1px solid #e2e8f0'
                        }
                    }, [
                        React.createElement('h4', { 
                            key: 'type-title',
                            style: { 
                                margin: '0 0 12px 0', 
                                color: '#1e293b', 
                                fontSize: '14px',
                                fontWeight: '600'
                            } 
                        }, '直播类型'),
                        React.createElement(Form.Item, {
                            key: 'type-item',
                            name: 'liveType',
                            style: { marginBottom: 0 }
                        }, React.createElement(Radio.Group, {
                            style: { width: '100%' }
                        }, [
                            React.createElement(Radio.Button, { 
                                key: 'live',
                                value: 'live',
                                style: { 
                                    height: '48px', 
                                    lineHeight: '46px',
                                    flex: 1,
                                    textAlign: 'center',
                                    marginRight: '8px'
                                }
                            }, [
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'icon', style: { fontSize: '16px' } }, '📺'),
                                    React.createElement('div', { key: 'text', style: { fontSize: '12px', marginTop: '2px' } }, '实时直播')
                                ])
                            ]),
                            React.createElement(Radio.Button, { 
                                key: 'video',
                                value: 'video',
                                style: { 
                                    height: '48px', 
                                    lineHeight: '46px',
                                    flex: 1,
                                    textAlign: 'center',
                                    marginRight: '8px'
                                }
                            }, [
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'icon', style: { fontSize: '16px' } }, '🎬'),
                                    React.createElement('div', { key: 'text', style: { fontSize: '12px', marginTop: '2px' } }, '录播视频')
                                ])
                            ]),
                            React.createElement(Radio.Button, { 
                                key: 'image',
                                value: 'image',
                                style: { 
                                    height: '48px', 
                                    lineHeight: '46px',
                                    flex: 1,
                                    textAlign: 'center'
                                }
                            }, [
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'icon', style: { fontSize: '16px' } }, '🖼️'),
                                    React.createElement('div', { key: 'text', style: { fontSize: '12px', marginTop: '2px' } }, '图片直播')
                                ])
                            ])
                        ]))
                    ]),

                    // 基本信息
                    React.createElement(Row, { key: 'basic-info', gutter: [16, 16] }, [
                        React.createElement(Col, { span: 12 }, [
                            React.createElement(Form.Item, {
                                label: React.createElement('span', {}, [
                                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                                    React.createElement('span', { key: 'text' }, ' 直播标题')
                                ]),
                                name: 'title',
                                rules: [{ required: true, message: '请输入直播标题' }]
                            }, React.createElement(Input, { 
                                placeholder: '请输入直播标题',
                                maxLength: 50,
                                showCount: true
                            }))
                        ]),
                        React.createElement(Col, { span: 12 }, [
                            React.createElement(Form.Item, {
                                label: React.createElement('span', {}, [
                                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                                    React.createElement('span', { key: 'text' }, ' 主讲人')
                                ]),
                                name: 'presenter',
                                rules: [{ required: true, message: '请输入主讲人姓名' }]
                            }, React.createElement(Input, { 
                                placeholder: '请输入主讲人姓名',
                                maxLength: 20
                            }))
                        ])
                    ]),

                    React.createElement(Form.Item, {
                        key: 'description',
                        label: '直播简介',
                        name: 'description'
                    }, React.createElement(Input.TextArea, { 
                        rows: 3, 
                        placeholder: '介绍直播内容、主要议题、主讲人背景等（选填）',
                        maxLength: 200,
                        showCount: true
                    })),

                    // 时间和频道
                    React.createElement(Row, { key: 'time-channel', gutter: [16, 16] }, [
                        React.createElement(Col, { span: 12 }, [
                            React.createElement(Form.Item, {
                                label: React.createElement('span', {}, [
                                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                                    React.createElement('span', { key: 'text' }, ' 计划开播时间')
                                ]),
                                name: 'scheduleTime',
                                rules: [{ required: true, message: '请选择开播时间' }]
                            }, React.createElement(DatePicker, {
                                showTime: { format: 'HH:mm' },
                                style: { width: '100%' },
                                format: 'YYYY-MM-DD HH:mm',
                                placeholder: 'Select date',
                                disabledDate: (current) => current && current < window.moment().startOf('day')
                            }))
                        ]),
                        React.createElement(Col, { span: 12 }, [
                            React.createElement(Form.Item, {
                                label: React.createElement('span', {}, [
                                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                                    React.createElement('span', { key: 'text' }, ' 所属频道')
                                ]),
                                name: 'channelId',
                                rules: [{ required: true, message: '请选择频道' }]
                            }, React.createElement(Select, {
                                placeholder: '请选择频道',
                                allowClear: true,
                                options: channelData.channels?.map(ch => ({
                                    value: ch.id,
                                    label: React.createElement('div', {}, [
                                        React.createElement('div', { key: 'name', style: { fontWeight: '500' } }, ch.name),
                                        React.createElement('div', { key: 'desc', style: { fontSize: '12px', color: '#666' } }, ch.description)
                                    ])
                                })) || []
                            }))
                        ])
                    ]),

                    // 直播封面
                    React.createElement(Form.Item, {
                        key: 'cover',
                        label: '直播封面',
                        name: 'coverUrl',
                        extra: '推荐尺寸: 1920x1080，支持jpg、png格式，文件大小不超过5MB'
                    }, [
                        React.createElement(Upload, {
                            key: 'upload',
                            listType: 'picture-card',
                            maxCount: 1,
                            beforeUpload: (file) => {
                                const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';
                                if (!isValidType) {
                                    message.error('只能上传JPG/PNG格式的图片！');
                                }
                                const isValidSize = file.size / 1024 / 1024 < 5;
                                if (!isValidSize) {
                                    message.error('图片大小不能超过5MB！');
                                }
                                return false; // 阻止自动上传
                            },
                            onPreview: (file) => {
                                // 预览功能
                                const url = file.url || file.preview;
                                if (url) {
                                    window.open(url);
                                }
                            }
                        }, React.createElement('div', {}, [
                            React.createElement('div', { key: 'icon', style: { fontSize: '24px', marginBottom: '8px' } }, '📷'),
                            React.createElement('div', { key: 'text', style: { fontSize: '14px' } }, '上传封面')
                        ])),
                        React.createElement('div', {
                            key: 'templates',
                            style: { marginTop: '8px' }
                        }, [
                            React.createElement('span', { 
                                key: 'label',
                                style: { fontSize: '12px', color: '#666', marginRight: '8px' } 
                            }, '快速选择:'),
                            React.createElement(Button, { 
                                key: 'template1',
                                size: 'small', 
                                style: { marginRight: '8px' },
                                onClick: () => message.info('已选择模板1')
                            }, '商务模板'),
                            React.createElement(Button, { 
                                key: 'template2',
                                size: 'small',
                                style: { marginRight: '8px' },
                                onClick: () => message.info('已选择模板2')
                            }, '教育模板'),
                            React.createElement(Button, { 
                                key: 'template3',
                                size: 'small',
                                onClick: () => message.info('已选择模板3')
                            }, '科技模板')
                        ])
                    ])
                ]),

                React.createElement(Tabs.TabPane, { 
                    tab: React.createElement('span', {}, [
                        React.createElement('span', { key: 'icon', style: { marginRight: '8px' } }, '🛡️'),
                        React.createElement('span', { key: 'text' }, '权限设置')
                    ]), 
                    key: 'permissions' 
                }, [
                    // 观看权限
                    React.createElement('div', {
                        key: 'access-section',
                        style: { marginBottom: '24px' }
                    }, [
                        React.createElement('h4', { 
                            key: 'access-title',
                            style: { 
                                margin: '0 0 12px 0', 
                                color: '#1e293b', 
                                fontSize: '16px',
                                fontWeight: '600'
                            } 
                        }, '观看权限'),
                        React.createElement(Form.Item, {
                            name: 'accessLevel',
                            style: { marginBottom: 0 }
                        }, React.createElement(Radio.Group, {
                            style: { width: '100%' }
                        }, [
                            React.createElement('div', { key: 'public', style: { marginBottom: '12px' } }, [
                                React.createElement(Radio, { value: 'public' }, [
                                    React.createElement('div', { style: { display: 'inline-block', marginLeft: '8px' } }, [
                                        React.createElement('div', { key: 'title', style: { fontWeight: '500' } }, '🌍 公开直播'),
                                        React.createElement('div', { key: 'desc', style: { fontSize: '12px', color: '#666' } }, '所有人都可以观看，无需登录')
                                    ])
                                ])
                            ]),
                            React.createElement('div', { key: 'registered', style: { marginBottom: '12px' } }, [
                                React.createElement(Radio, { value: 'registered' }, [
                                    React.createElement('div', { style: { display: 'inline-block', marginLeft: '8px' } }, [
                                        React.createElement('div', { key: 'title', style: { fontWeight: '500' } }, '👤 注册用户'),
                                        React.createElement('div', { key: 'desc', style: { fontSize: '12px', color: '#666' } }, '需要注册登录后才能观看')
                                    ])
                                ])
                            ]),
                            React.createElement('div', { key: 'vip', style: { marginBottom: '12px' } }, [
                                React.createElement(Radio, { value: 'vip' }, [
                                    React.createElement('div', { style: { display: 'inline-block', marginLeft: '8px' } }, [
                                        React.createElement('div', { key: 'title', style: { fontWeight: '500' } }, '⭐ VIP专享'),
                                        React.createElement('div', { key: 'desc', style: { fontSize: '12px', color: '#666' } }, '仅VIP会员可以观看')
                                    ])
                                ])
                            ]),
                            React.createElement('div', { key: 'password', style: { marginBottom: '12px' } }, [
                                React.createElement(Radio, { value: 'password' }, [
                                    React.createElement('div', { style: { display: 'inline-block', marginLeft: '8px' } }, [
                                        React.createElement('div', { key: 'title', style: { fontWeight: '500' } }, '🔒 密码保护'),
                                        React.createElement('div', { key: 'desc', style: { fontSize: '12px', color: '#666' } }, '需要输入密码才能观看')
                                    ])
                                ])
                            ])
                        ]))
                    ]),

                    // 密码设置（条件显示）
                    React.createElement(Form.Item, {
                        key: 'password',
                        label: '观看密码',
                        name: 'accessPassword',
                        dependencies: ['accessLevel'],
                        rules: [
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (getFieldValue('accessLevel') === 'password' && !value) {
                                        return Promise.reject(new Error('请设置观看密码'));
                                    }
                                    return Promise.resolve();
                                }
                            })
                        ]
                    }, React.createElement(Input.Password, { 
                        placeholder: '请设置4-16位观看密码',
                        maxLength: 16
                    })),

                    // 互动设置
                    React.createElement('div', {
                        key: 'interaction-section',
                        style: { 
                            background: '#f8fafc', 
                            padding: '16px', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }
                    }, [
                        React.createElement('h4', { 
                            key: 'interaction-title',
                            style: { 
                                margin: '0 0 16px 0', 
                                color: '#1e293b', 
                                fontSize: '16px',
                                fontWeight: '600'
                            } 
                        }, '互动功能'),
                        React.createElement(Row, { gutter: [24, 16] }, [
                            React.createElement(Col, { span: 8 }, [
                                React.createElement(Form.Item, {
                                    label: '评论互动',
                                    name: 'enableComment',
                                    valuePropName: 'checked',
                                    style: { marginBottom: 0 }
                                }, React.createElement(Switch, {
                                    checkedChildren: '开启',
                                    unCheckedChildren: '关闭'
                                }))
                            ]),
                            React.createElement(Col, { span: 8 }, [
                                React.createElement(Form.Item, {
                                    label: '点赞功能',
                                    name: 'enableLike',
                                    valuePropName: 'checked',
                                    style: { marginBottom: 0 }
                                }, React.createElement(Switch, {
                                    checkedChildren: '开启',
                                    unCheckedChildren: '关闭'
                                }))
                            ]),
                            React.createElement(Col, { span: 8 }, [
                                React.createElement(Form.Item, {
                                    label: '弹幕功能',
                                    name: 'enableDanmu',
                                    valuePropName: 'checked',
                                    style: { marginBottom: 0 }
                                }, React.createElement(Switch, {
                                    checkedChildren: '开启',
                                    unCheckedChildren: '关闭'
                                }))
                            ])
                        ])
                    ])
                ]),

                React.createElement(Tabs.TabPane, { 
                    tab: React.createElement('span', {}, [
                        React.createElement('span', { key: 'icon', style: { marginRight: '8px' } }, '📹'),
                        React.createElement('span', { key: 'text' }, '录制设置')
                    ]), 
                    key: 'recording' 
                }, [
                    // 录制设置
                    React.createElement('div', {
                        key: 'record-section',
                        style: { marginBottom: '24px' }
                    }, [
                        React.createElement(Row, { gutter: [24, 16] }, [
                            React.createElement(Col, { span: 12 }, [
                                React.createElement(Form.Item, {
                                    label: '自动录制',
                                    name: 'autoRecord',
                                    valuePropName: 'checked',
                                    extra: '直播开始时自动开启录制功能'
                                }, React.createElement(Switch, {
                                    checkedChildren: '开启',
                                    unCheckedChildren: '关闭'
                                }))
                            ]),
                            React.createElement(Col, { span: 12 }, [
                                React.createElement(Form.Item, {
                                    label: '录制质量',
                                    name: 'recordQuality'
                                }, React.createElement(Select, {
                                    placeholder: '选择录制质量',
                                    options: [
                                        { value: '720p', label: '720P 标清 (节省存储)' },
                                        { value: '1080p', label: '1080P 高清 (推荐)' },
                                        { value: '4k', label: '4K 超清 (超大文件)' }
                                    ]
                                }))
                            ])
                        ])
                    ]),

                    // 推流设置
                    React.createElement('div', {
                        key: 'stream-section',
                        style: { 
                            background: '#f8fafc', 
                            padding: '16px', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }
                    }, [
                        React.createElement('h4', { 
                            key: 'stream-title',
                            style: { 
                                margin: '0 0 16px 0', 
                                color: '#1e293b', 
                                fontSize: '16px',
                                fontWeight: '600'
                            } 
                        }, '推流配置'),
                        React.createElement(Row, { gutter: [24, 16] }, [
                            React.createElement(Col, { span: 12 }, [
                                React.createElement(Form.Item, {
                                    label: '画质设置',
                                    name: 'quality'
                                }, React.createElement(Select, {
                                    options: [
                                        { value: '720p', label: '720P 高清' },
                                        { value: '1080p', label: '1080P 超清 (推荐)' },
                                        { value: '4k', label: '4K 超高清' }
                                    ]
                                }))
                            ]),
                            React.createElement(Col, { span: 12 }, [
                                React.createElement(Form.Item, {
                                    label: '码率设置',
                                    name: 'bitrate'
                                }, React.createElement(Select, {
                                    placeholder: '选择码率',
                                    options: [
                                        { value: '2000', label: '2Mbps (720P推荐)' },
                                        { value: '4000', label: '4Mbps (1080P推荐)' },
                                        { value: '8000', label: '8Mbps (4K推荐)' },
                                        { value: 'custom', label: '自定义码率' }
                                    ]
                                }))
                            ])
                        ]),
                        React.createElement(Form.Item, {
                            key: 'stream-key',
                            label: '推流密钥',
                            extra: '用于OBS等推流软件，创建后自动生成'
                        }, React.createElement(Input, { 
                            placeholder: '创建直播后自动生成推流密钥',
                            disabled: true,
                            addonAfter: React.createElement(Button, { 
                                size: 'small',
                                onClick: () => message.info('推流密钥将在创建后生成')
                            }, '生成')
                        }))
                    ])
                ]),

                React.createElement(Tabs.TabPane, { 
                    tab: React.createElement('span', {}, [
                        React.createElement('span', { key: 'icon', style: { marginRight: '8px' } }, '🎯'),
                        React.createElement('span', { key: 'text' }, '营销设置')
                    ]), 
                    key: 'marketing' 
                }, [
                    // 预约设置
                    React.createElement('div', {
                        key: 'booking-section',
                        style: { marginBottom: '24px' }
                    }, [
                        React.createElement('h4', { 
                            key: 'booking-title',
                            style: { 
                                margin: '0 0 16px 0', 
                                color: '#1e293b', 
                                fontSize: '16px',
                                fontWeight: '600'
                            } 
                        }, '预约提醒'),
                        React.createElement(Form.Item, {
                            key: 'enable-booking',
                            label: '开启预约',
                            name: 'enableBooking',
                            valuePropName: 'checked',
                            extra: '观众可以预约直播，系统将在开播前发送提醒'
                        }, React.createElement(Switch, {
                            checkedChildren: '开启',
                            unCheckedChildren: '关闭'
                        })),
                        React.createElement(Form.Item, {
                            key: 'booking-remind',
                            label: '提前提醒时间',
                            name: 'remindTime'
                        }, React.createElement(Select, {
                            placeholder: '选择提醒时间',
                            mode: 'multiple',
                            options: [
                                { value: '1', label: '开播前1分钟' },
                                { value: '5', label: '开播前5分钟' },
                                { value: '15', label: '开播前15分钟' },
                                { value: '30', label: '开播前30分钟' },
                                { value: '60', label: '开播前1小时' },
                                { value: '1440', label: '开播前1天' }
                            ]
                        }))
                    ]),

                    // 分享设置
                    React.createElement('div', {
                        key: 'share-section',
                        style: { 
                            background: '#f8fafc', 
                            padding: '16px', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }
                    }, [
                        React.createElement('h4', { 
                            key: 'share-title',
                            style: { 
                                margin: '0 0 16px 0', 
                                color: '#1e293b', 
                                fontSize: '16px',
                                fontWeight: '600'
                            } 
                        }, '分享推广'),
                        React.createElement(Row, { gutter: [24, 16] }, [
                            React.createElement(Col, { span: 8 }, [
                                React.createElement(Form.Item, {
                                    label: '微信分享',
                                    name: 'enableWechatShare',
                                    valuePropName: 'checked',
                                    style: { marginBottom: 0 }
                                }, React.createElement(Switch, {
                                    checkedChildren: '开启',
                                    unCheckedChildren: '关闭'
                                }))
                            ]),
                            React.createElement(Col, { span: 8 }, [
                                React.createElement(Form.Item, {
                                    label: '微博分享',
                                    name: 'enableWeiboShare',
                                    valuePropName: 'checked',
                                    style: { marginBottom: 0 }
                                }, React.createElement(Switch, {
                                    checkedChildren: '开启',
                                    unCheckedChildren: '关闭'
                                }))
                            ]),
                            React.createElement(Col, { span: 8 }, [
                                React.createElement(Form.Item, {
                                    label: 'QQ分享',
                                    name: 'enableQQShare',
                                    valuePropName: 'checked',
                                    style: { marginBottom: 0 }
                                }, React.createElement(Switch, {
                                    checkedChildren: '开启',
                                    unCheckedChildren: '关闭'
                                }))
                            ])
                        ]),
                        React.createElement(Form.Item, {
                            key: 'share-title-field',
                            label: '分享标题',
                            name: 'shareTitle',
                            extra: '不填写则使用直播标题'
                        }, React.createElement(Input, { 
                            placeholder: '自定义分享时显示的标题',
                            maxLength: 60
                        })),
                        React.createElement(Form.Item, {
                            key: 'share-desc',
                            label: '分享描述',
                            name: 'shareDescription',
                            extra: '不填写则使用直播简介'
                        }, React.createElement(Input.TextArea, { 
                            rows: 2,
                            placeholder: '自定义分享时显示的描述信息',
                            maxLength: 120
                        }))
                    ])
                ])
            ])
        ]))
    ]);
};

window.LiveManagement = LiveManagement; 