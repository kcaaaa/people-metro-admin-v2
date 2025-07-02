// 投诉管理页面组件
const ComplaintManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Tooltip, Modal, Form, message, Statistic, Row, Col, Avatar, Image } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { confirm } = Modal;

    // 状态管理
    const [complaints, setComplaints] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [sortBy, setSortBy] = React.useState('complaint_count');
    const [sortOrder, setSortOrder] = React.useState('desc');
    const [detailModalVisible, setDetailModalVisible] = React.useState(false);
    const [selectedComplaint, setSelectedComplaint] = React.useState(null);

    // 模拟投诉数据
    const mockComplaints = [
        {
            id: 'C001',
            video_id: 'V001',
            video_title: '城市轨道交通建设进展',
            video_cover: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300',
            video_duration: '05:32',
            publisher_id: 'U001',
            publisher_name: '城轨爱好者',
            publisher_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40',
            complaint_count: 15,
            complaint_types: ['内容不实', '诱导点击'],
            latest_complaint_time: '2024-01-15 14:30:00',
            first_complaint_time: '2024-01-14 09:15:00',
            status: 'pending',
            video_views: 12500,
            video_publish_time: '2024-01-10 16:20:00'
        },
        {
            id: 'C002',
            video_id: 'V002',
            video_title: '地铁施工现场揭秘',
            video_cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
            video_duration: '08:45',
            publisher_id: 'U002',
            publisher_name: '建设记录员',
            publisher_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40',
            complaint_count: 8,
            complaint_types: ['安全隐患'],
            latest_complaint_time: '2024-01-15 11:20:00',
            first_complaint_time: '2024-01-15 08:45:00',
            status: 'pending',
            video_views: 8900,
            video_publish_time: '2024-01-12 10:30:00'
        },
        {
            id: 'C003',
            video_id: 'V003',
            video_title: '高铁线路规划解读',
            video_cover: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=300',
            video_duration: '12:18',
            publisher_id: 'U003',
            publisher_name: '交通分析师',
            publisher_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40',
            complaint_count: 3,
            complaint_types: ['误导信息'],
            latest_complaint_time: '2024-01-14 16:45:00',
            first_complaint_time: '2024-01-14 14:20:00',
            status: 'processed',
            video_views: 5600,
            video_publish_time: '2024-01-11 14:15:00'
        },
        {
            id: 'C004',
            video_id: 'V004',
            video_title: '地铁运营维护内幕',
            video_cover: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300',
            video_duration: '06:52',
            publisher_id: 'U004',
            publisher_name: '运维工程师',
            publisher_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40',
            complaint_count: 22,
            complaint_types: ['泄露机密', '不当内容'],
            latest_complaint_time: '2024-01-15 18:30:00',
            first_complaint_time: '2024-01-13 12:00:00',
            status: 'pending',
            video_views: 18700,
            video_publish_time: '2024-01-09 11:45:00'
        },
        {
            id: 'C005',
            video_id: 'V005',
            video_title: '城际铁路建设现状',
            video_cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
            video_duration: '09:15',
            publisher_id: 'U005',
            publisher_name: '铁路观察员',
            publisher_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40',
            complaint_count: 6,
            complaint_types: ['内容重复'],
            latest_complaint_time: '2024-01-15 13:10:00',
            first_complaint_time: '2024-01-15 09:30:00',
            status: 'reviewing',
            video_views: 7200,
            video_publish_time: '2024-01-13 15:20:00'
        }
    ];

    // 加载数据
    React.useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = () => {
        setLoading(true);
        // 模拟API调用
        setTimeout(() => {
            setComplaints(mockComplaints);
            setLoading(false);
        }, 800);
    };

    // 过滤和排序数据
    const getFilteredAndSortedData = () => {
        let filteredData = [...complaints];

        // 搜索过滤
        if (searchText) {
            filteredData = filteredData.filter(item => 
                item.video_title.toLowerCase().includes(searchText.toLowerCase()) ||
                item.publisher_name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.complaint_types.some(type => type.includes(searchText))
            );
        }

        // 状态过滤
        if (statusFilter !== 'all') {
            filteredData = filteredData.filter(item => item.status === statusFilter);
        }

        // 排序
        filteredData.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case 'complaint_count':
                    aValue = a.complaint_count;
                    bValue = b.complaint_count;
                    break;
                case 'latest_complaint_time':
                    aValue = new Date(a.latest_complaint_time);
                    bValue = new Date(b.latest_complaint_time);
                    break;
                case 'video_views':
                    aValue = a.video_views;
                    bValue = b.video_views;
                    break;
                default:
                    return 0;
            }
            
            if (sortOrder === 'desc') {
                return bValue > aValue ? 1 : -1;
            } else {
                return aValue > bValue ? 1 : -1;
            }
        });

        return filteredData;
    };

    // 状态标签渲染
    const renderStatusTag = (status) => {
        const statusConfig = {
            'pending': { color: 'warning', text: '待处理' },
            'reviewing': { color: 'processing', text: '审核中' },
            'processed': { color: 'success', text: '已处理' },
            'rejected': { color: 'default', text: '已驳回' }
        };
        const config = statusConfig[status] || statusConfig['pending'];
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    // 投诉类型标签渲染
    const renderComplaintTypes = (types) => {
        const typeColors = {
            '内容不实': 'red',
            '诱导点击': 'orange',
            '安全隐患': 'red',
            '误导信息': 'orange',
            '泄露机密': 'red',
            '不当内容': 'red',
            '内容重复': 'blue'
        };
        
        return types.map(type => 
            React.createElement(Tag, {
                key: type,
                color: typeColors[type] || 'default',
                style: { marginBottom: '4px' }
            }, type)
        );
    };

    // 查看详情
    const handleViewDetail = (record) => {
        setSelectedComplaint(record);
        setDetailModalVisible(true);
    };

    // 视频下架
    const handleRemoveVideo = (record) => {
        confirm({
            title: '确认下架视频？',
            content: `确定要下架视频"${record.video_title}"吗？下架后用户将无法观看该视频。`,
            okText: '确认下架',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                setLoading(true);
                // 模拟API调用
                setTimeout(() => {
                    message.success('视频已成功下架');
                    // 更新数据状态
                    const updatedComplaints = complaints.map(item => 
                        item.id === record.id ? { ...item, status: 'processed' } : item
                    );
                    setComplaints(updatedComplaints);
                    setLoading(false);
                }, 1000);
            }
        });
    };

    // 账号封禁
    const handleBanAccount = (record) => {
        confirm({
            title: '确认封禁账号？',
            content: `确定要封禁用户"${record.publisher_name}"的账号吗？封禁后该用户将无法发布内容。`,
            okText: '确认封禁',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                setLoading(true);
                // 模拟API调用
                setTimeout(() => {
                    message.success('账号已成功封禁');
                    setLoading(false);
                }, 1000);
            }
        });
    };

    // 表格列定义
    const columns = [
        {
            title: '视频信息',
            key: 'video_info',
            width: 300,
            render: (_, record) => (
                React.createElement('div', {
                    style: { display: 'flex', alignItems: 'center' }
                }, [
                    React.createElement(Image, {
                        key: 'cover',
                        width: 80,
                        height: 45,
                        src: record.video_cover,
                        style: { borderRadius: '4px', marginRight: '12px' }
                    }),
                    React.createElement('div', { key: 'info' }, [
                        React.createElement('div', {
                            key: 'title',
                            style: { fontWeight: 500, marginBottom: '4px' }
                        }, record.video_title),
                        React.createElement('div', {
                            key: 'meta',
                            style: { fontSize: '12px', color: '#666' }
                        }, `时长: ${record.video_duration} | 播放: ${record.video_views.toLocaleString()}`)
                    ])
                ])
            )
        },
        {
            title: '发布者',
            key: 'publisher',
            width: 120,
            render: (_, record) => (
                React.createElement('div', {
                    style: { display: 'flex', alignItems: 'center' }
                }, [
                    React.createElement(Avatar, {
                        key: 'avatar',
                        size: 32,
                        src: record.publisher_avatar,
                        style: { marginRight: '8px' }
                    }),
                    React.createElement('span', { key: 'name' }, record.publisher_name)
                ])
            )
        },
        {
            title: '投诉量',
            dataIndex: 'complaint_count',
            key: 'complaint_count',
            width: 80,
            sorter: true,
            render: (count) => (
                React.createElement('span', {
                    style: { 
                        fontWeight: 'bold',
                        color: count > 10 ? '#ff4d4f' : count > 5 ? '#faad14' : '#52c41a'
                    }
                }, count)
            )
        },
        {
            title: '投诉类型',
            dataIndex: 'complaint_types',
            key: 'complaint_types',
            width: 150,
            render: renderComplaintTypes
        },
        {
            title: '最新投诉时间',
            dataIndex: 'latest_complaint_time',
            key: 'latest_complaint_time',
            width: 140,
            sorter: true,
            render: (time) => (
                React.createElement('span', {
                    style: { fontSize: '12px' }
                }, new Date(time).toLocaleString())
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: renderStatusTag
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                React.createElement(Space, { size: 'small' }, [
                    React.createElement(Button, {
                        key: 'detail',
                        type: 'link',
                        size: 'small',
                        onClick: () => handleViewDetail(record)
                    }, '查看详情'),
                    React.createElement(Button, {
                        key: 'remove',
                        type: 'link',
                        size: 'small',
                        danger: true,
                        disabled: record.status === 'processed',
                        onClick: () => handleRemoveVideo(record)
                    }, '下架视频'),
                    React.createElement(Button, {
                        key: 'ban',
                        type: 'link',
                        size: 'small',
                        danger: true,
                        onClick: () => handleBanAccount(record)
                    }, '封禁账号')
                ])
            )
        }
    ];

    // 统计数据
    const getStatistics = () => {
        const total = complaints.length;
        const pending = complaints.filter(item => item.status === 'pending').length;
        const processed = complaints.filter(item => item.status === 'processed').length;
        const highRisk = complaints.filter(item => item.complaint_count > 10).length;
        
        return { total, pending, processed, highRisk };
    };

    const stats = getStatistics();
    const filteredData = getFilteredAndSortedData();

    return React.createElement('div', {
        style: { padding: '0' }
    }, [
        // 页面标题
        React.createElement('div', {
            key: 'header',
            style: { marginBottom: '24px' }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { 
                    fontSize: '24px', 
                    fontWeight: '600', 
                    margin: '0 0 8px 0',
                    color: '#333'
                }
            }, '投诉管理'),
            React.createElement('p', {
                key: 'description',
                style: { 
                    color: '#666', 
                    fontSize: '14px',
                    margin: '0'
                }
            }, '管理用户投诉的视频内容，支持视频下架和账号封禁操作')
        ]),

        // 统计卡片
        React.createElement(Row, {
            key: 'stats',
            gutter: 16,
            style: { marginBottom: '24px' }
        }, [
            React.createElement(Col, { key: 'total', span: 6 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '总投诉数',
                    value: stats.total,
                    valueStyle: { color: '#1890ff' }
                }))
            ),
            React.createElement(Col, { key: 'pending', span: 6 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '待处理',
                    value: stats.pending,
                    valueStyle: { color: '#faad14' }
                }))
            ),
            React.createElement(Col, { key: 'processed', span: 6 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '已处理',
                    value: stats.processed,
                    valueStyle: { color: '#52c41a' }
                }))
            ),
            React.createElement(Col, { key: 'highRisk', span: 6 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '高风险(>10投诉)',
                    value: stats.highRisk,
                    valueStyle: { color: '#ff4d4f' }
                }))
            )
        ]),

        // 搜索和筛选
        React.createElement(Card, {
            key: 'filters',
            style: { marginBottom: '16px' }
        }, React.createElement(Row, {
            gutter: 16,
            align: 'middle'
        }, [
            React.createElement(Col, { key: 'search', span: 8 },
                React.createElement(Search, {
                    placeholder: '搜索视频标题、发布者或投诉类型',
                    value: searchText,
                    onChange: (e) => setSearchText(e.target.value),
                    style: { width: '100%' }
                })
            ),
            React.createElement(Col, { key: 'status', span: 4 },
                React.createElement(Select, {
                    value: statusFilter,
                    onChange: setStatusFilter,
                    style: { width: '100%' },
                    placeholder: '筛选状态'
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                    React.createElement(Option, { key: 'pending', value: 'pending' }, '待处理'),
                    React.createElement(Option, { key: 'reviewing', value: 'reviewing' }, '审核中'),
                    React.createElement(Option, { key: 'processed', value: 'processed' }, '已处理')
                ])
            ),
            React.createElement(Col, { key: 'sort', span: 4 },
                React.createElement(Select, {
                    value: sortBy,
                    onChange: setSortBy,
                    style: { width: '100%' },
                    placeholder: '排序方式'
                }, [
                    React.createElement(Option, { key: 'complaint_count', value: 'complaint_count' }, '投诉量'),
                    React.createElement(Option, { key: 'latest_complaint_time', value: 'latest_complaint_time' }, '投诉时间'),
                    React.createElement(Option, { key: 'video_views', value: 'video_views' }, '播放量')
                ])
            ),
            React.createElement(Col, { key: 'order', span: 4 },
                React.createElement(Select, {
                    value: sortOrder,
                    onChange: setSortOrder,
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'desc', value: 'desc' }, '降序'),
                    React.createElement(Option, { key: 'asc', value: 'asc' }, '升序')
                ])
            ),
            React.createElement(Col, { key: 'refresh', span: 4 },
                React.createElement(Button, {
                    onClick: loadComplaints,
                    loading: loading,
                    style: { width: '100%' }
                }, '刷新数据')
            )
        ])),

        // 数据表格
        React.createElement(Card, {
            key: 'table',
            title: `投诉列表 (${filteredData.length}条)`
        }, React.createElement(Table, {
            columns: columns,
            dataSource: filteredData,
            rowKey: 'id',
            loading: loading,
            pagination: {
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            },
            scroll: { x: 1200 }
        })),

        // 详情模态框
        selectedComplaint && React.createElement(Modal, {
            key: 'detailModal',
            title: '投诉详情',
            visible: detailModalVisible,
            onCancel: () => setDetailModalVisible(false),
            footer: [
                React.createElement(Button, {
                    key: 'close',
                    onClick: () => setDetailModalVisible(false)
                }, '关闭'),
                React.createElement(Button, {
                    key: 'remove',
                    type: 'primary',
                    danger: true,
                    onClick: () => {
                        setDetailModalVisible(false);
                        handleRemoveVideo(selectedComplaint);
                    }
                }, '下架视频'),
                React.createElement(Button, {
                    key: 'ban',
                    type: 'primary',
                    danger: true,
                    onClick: () => {
                        setDetailModalVisible(false);
                        handleBanAccount(selectedComplaint);
                    }
                }, '封禁账号')
            ],
            width: 800
        }, React.createElement('div', {
            style: { padding: '16px 0' }
        }, [
            React.createElement(Row, { key: 'video', gutter: 24 }, [
                React.createElement(Col, { span: 8 },
                    React.createElement(Image, {
                        width: '100%',
                        src: selectedComplaint.video_cover,
                        style: { borderRadius: '8px' }
                    })
                ),
                React.createElement(Col, { span: 16 }, [
                    React.createElement('h3', {
                        key: 'title',
                        style: { marginBottom: '16px' }
                    }, selectedComplaint.video_title),
                    React.createElement('p', { key: 'publisher' }, [
                        React.createElement('strong', {}, '发布者：'),
                        selectedComplaint.publisher_name
                    ]),
                    React.createElement('p', { key: 'duration' }, [
                        React.createElement('strong', {}, '视频时长：'),
                        selectedComplaint.video_duration
                    ]),
                    React.createElement('p', { key: 'views' }, [
                        React.createElement('strong', {}, '播放量：'),
                        selectedComplaint.video_views.toLocaleString()
                    ]),
                    React.createElement('p', { key: 'publishTime' }, [
                        React.createElement('strong', {}, '发布时间：'),
                        new Date(selectedComplaint.video_publish_time).toLocaleString()
                    ])
                ])
            ]),
            React.createElement('div', {
                key: 'complaint',
                style: { marginTop: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }
            }, [
                React.createElement('h4', {
                    key: 'complaintTitle',
                    style: { marginBottom: '12px' }
                }, '投诉信息'),
                React.createElement('p', { key: 'count' }, [
                    React.createElement('strong', {}, '投诉次数：'),
                    React.createElement('span', {
                        style: { color: '#ff4d4f', fontWeight: 'bold' }
                    }, selectedComplaint.complaint_count)
                ]),
                React.createElement('p', { key: 'types' }, [
                    React.createElement('strong', {}, '投诉类型：'),
                    React.createElement('div', { style: { marginTop: '8px' } },
                        renderComplaintTypes(selectedComplaint.complaint_types)
                    )
                ]),
                React.createElement('p', { key: 'firstTime' }, [
                    React.createElement('strong', {}, '首次投诉：'),
                    new Date(selectedComplaint.first_complaint_time).toLocaleString()
                ]),
                React.createElement('p', { key: 'latestTime' }, [
                    React.createElement('strong', {}, '最新投诉：'),
                    new Date(selectedComplaint.latest_complaint_time).toLocaleString()
                ])
            ])
        ]))
    ]);
};

window.ComplaintManagement = ComplaintManagement; 