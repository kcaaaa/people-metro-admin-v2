// 内容管理页面
const ContentManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, Switch, message, Row, Col, Statistic, DatePicker, Tabs } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const { TabPane } = Tabs;

    const [loading, setLoading] = React.useState(false);
    const [contentList, setContentList] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [filters, setFilters] = React.useState({
        contentType: 'all',
        status: 'all',
        board: 'all',
        keyword: '',
        dateRange: null
    });
    const [selectedContent, setSelectedContent] = React.useState(null);
    const [detailModalVisible, setDetailModalVisible] = React.useState(false);
    const [statusModalVisible, setStatusModalVisible] = React.useState(false);
    const [form] = Form.useForm();

    // 模拟数据
    const mockContentData = [
        {
            id: 1,
            title: '城轨建设最新进展',
            type: 'video',
            board: 'industry',
            publisher: '张三',
            publisherId: 1001,
            publishTime: '2024-01-15 14:30:00',
            status: 'published',
            auditStatus: 'passed',
            viewCount: 12580,
            likeCount: 234,
            commentCount: 56,
            shareCount: 89,
            duration: '3:45',
            thumbnail: '/images/video-thumb-1.jpg',
            tags: ['城轨建设', '最新进展'],
            description: '介绍最新的城轨建设进展情况...'
        },
        {
            id: 2,
            title: '轨道交通技术创新分享',
            type: 'image',
            board: 'association',
            publisher: '李四',
            publisherId: 1002,
            publishTime: '2024-01-14 16:20:00',
            status: 'published',
            auditStatus: 'passed',
            viewCount: 8960,
            likeCount: 156,
            commentCount: 32,
            shareCount: 45,
            imageCount: 5,
            tags: ['技术创新', '分享'],
            description: '轨道交通领域的技术创新案例分享...'
        },
        {
            id: 3,
            title: '展会现场精彩瞬间',
            type: 'video',
            board: 'exhibition',
            publisher: '王五',
            publisherId: 1003,
            publishTime: '2024-01-13 10:15:00',
            status: 'pending',
            auditStatus: 'manual_pending',
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            shareCount: 0,
            duration: '2:30',
            tags: ['展会', '精彩瞬间'],
            description: '记录展会现场的精彩瞬间...'
        }
    ];

    // 统计数据
    const statsData = {
        totalContent: 1250,
        todayContent: 45,
        pendingReview: 23,
        publishedToday: 38
    };

    React.useEffect(() => {
        loadContentList();
    }, [pagination.current, pagination.pageSize, filters]);

    const loadContentList = async () => {
        setLoading(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 800));
            
            let filteredData = [...mockContentData];
            
            // 应用过滤器
            if (filters.contentType !== 'all') {
                filteredData = filteredData.filter(item => item.type === filters.contentType);
            }
            if (filters.status !== 'all') {
                filteredData = filteredData.filter(item => item.status === filters.status);
            }
            if (filters.board !== 'all') {
                filteredData = filteredData.filter(item => item.board === filters.board);
            }
            if (filters.keyword) {
                filteredData = filteredData.filter(item => 
                    item.title.includes(filters.keyword) || 
                    item.description.includes(filters.keyword)
                );
            }
            
            setContentList(filteredData);
            setPagination(prev => ({
                ...prev,
                total: filteredData.length
            }));
        } catch (error) {
            message.error('加载内容列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (contentId, newStatus) => {
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setContentList(prev => 
                prev.map(item => 
                    item.id === contentId 
                        ? { ...item, status: newStatus }
                        : item
                )
            );
            message.success('状态更新成功');
        } catch (error) {
            message.error('状态更新失败');
        }
    };

    const handleBatchOperation = async (operation, selectedIds) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.success(`批量${operation}操作完成`);
            loadContentList();
        } catch (error) {
            message.error(`批量${operation}操作失败`);
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status) => {
        const statusMap = {
            published: { color: 'green', text: '已发布' },
            pending: { color: 'orange', text: '待审核' },
            rejected: { color: 'red', text: '已拒绝' },
            draft: { color: 'gray', text: '草稿' }
        };
        const config = statusMap[status] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    const getAuditStatusTag = (status) => {
        const statusMap = {
            passed: { color: 'green', text: '审核通过' },
            rejected: { color: 'red', text: '审核拒绝' },
            ai_pending: { color: 'blue', text: 'AI审核中' },
            manual_pending: { color: 'orange', text: '人工审核中' },
            pending: { color: 'gray', text: '待审核' }
        };
        const config = statusMap[status] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    const getBoardTag = (board) => {
        const boardMap = {
            association: { color: 'blue', text: '协会发布' },
            industry: { color: 'green', text: '行业发布' },
            exhibition: { color: 'purple', text: '展会发布' },
            content: { color: 'orange', text: '内容发布' }
        };
        const config = boardMap[board] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    const columns = [
        {
            title: '内容信息',
            key: 'content',
            width: 300,
            render: (_, record) => React.createElement('div', {
                style: { display: 'flex', alignItems: 'center' }
            }, [
                React.createElement('div', {
                    key: 'thumb',
                    style: {
                        width: 60,
                        height: 60,
                        background: '#f0f0f0',
                        borderRadius: 4,
                        marginRight: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24
                    }
                }, record.type === 'video' ? '🎬' : '🖼️'),
                React.createElement('div', { key: 'info' }, [
                    React.createElement('div', {
                        key: 'title',
                        style: { fontWeight: 'bold', marginBottom: 4 }
                    }, record.title),
                    React.createElement('div', {
                        key: 'meta',
                        style: { fontSize: 12, color: '#666' }
                    }, [
                        getBoardTag(record.board),
                        React.createElement('span', {
                            key: 'publisher',
                            style: { marginLeft: 8 }
                        }, `发布者：${record.publisher}`)
                    ])
                ])
            ])
        },
        {
            title: '发布时间',
            dataIndex: 'publishTime',
            width: 150,
            sorter: true
        },
        {
            title: '状态',
            key: 'status',
            width: 120,
            render: (_, record) => React.createElement('div', {}, [
                getStatusTag(record.status),
                React.createElement('br', { key: 'br' }),
                getAuditStatusTag(record.auditStatus)
            ])
        },
        {
            title: '数据统计',
            key: 'stats',
            width: 150,
            render: (_, record) => React.createElement('div', {
                style: { fontSize: 12 }
            }, [
                React.createElement('div', { key: 'view' }, `观看：${record.viewCount}`),
                React.createElement('div', { key: 'like' }, `点赞：${record.likeCount}`),
                React.createElement('div', { key: 'comment' }, `评论：${record.commentCount}`)
            ])
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record) => React.createElement(Space, {}, [
                React.createElement(Button, {
                    key: 'view',
                    type: 'link',
                    size: 'small',
                    onClick: () => {
                        setSelectedContent(record);
                        setDetailModalVisible(true);
                    }
                }, '查看详情'),
                React.createElement(Button, {
                    key: 'status',
                    type: 'link',
                    size: 'small',
                    onClick: () => {
                        setSelectedContent(record);
                        setStatusModalVisible(true);
                    }
                }, '状态管理'),
                record.status === 'published' ? 
                    React.createElement(Button, {
                        key: 'hide',
                        type: 'link',
                        size: 'small',
                        danger: true,
                        onClick: () => handleStatusChange(record.id, 'hidden')
                    }, '下架') :
                    React.createElement(Button, {
                        key: 'publish',
                        type: 'link',
                        size: 'small',
                        onClick: () => handleStatusChange(record.id, 'published')
                    }, '发布')
            ])
        }
    ];

    const renderStatsCards = () => {
        return React.createElement(Row, { gutter: 16, style: { marginBottom: 24 } }, [
            React.createElement(Col, { key: 'total', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '总内容数',
                        value: statsData.totalContent,
                        prefix: '📄'
                    })
                )
            ),
            React.createElement(Col, { key: 'today', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '今日新增',
                        value: statsData.todayContent,
                        prefix: '📈'
                    })
                )
            ),
            React.createElement(Col, { key: 'pending', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '待审核',
                        value: statsData.pendingReview,
                        prefix: '⏳'
                    })
                )
            ),
            React.createElement(Col, { key: 'published', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '今日发布',
                        value: statsData.publishedToday,
                        prefix: '✅'
                    })
                )
            )
        ]);
    };

    const renderFilters = () => {
        return React.createElement(Card, {
            size: 'small',
            style: { marginBottom: 16 }
        }, React.createElement(Row, { gutter: 16, align: 'middle' }, [
            React.createElement(Col, { key: 'type', span: 4 },
                React.createElement(Select, {
                    placeholder: '内容类型',
                    value: filters.contentType,
                    onChange: (value) => setFilters(prev => ({ ...prev, contentType: value })),
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部类型'),
                    React.createElement(Option, { key: 'video', value: 'video' }, '视频'),
                    React.createElement(Option, { key: 'image', value: 'image' }, '图文')
                ])
            ),
            React.createElement(Col, { key: 'status', span: 4 },
                React.createElement(Select, {
                    placeholder: '发布状态',
                    value: filters.status,
                    onChange: (value) => setFilters(prev => ({ ...prev, status: value })),
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                    React.createElement(Option, { key: 'published', value: 'published' }, '已发布'),
                    React.createElement(Option, { key: 'pending', value: 'pending' }, '待审核'),
                    React.createElement(Option, { key: 'rejected', value: 'rejected' }, '已拒绝'),
                    React.createElement(Option, { key: 'draft', value: 'draft' }, '草稿')
                ])
            ),
            React.createElement(Col, { key: 'board', span: 4 },
                React.createElement(Select, {
                    placeholder: '发布板块',
                    value: filters.board,
                    onChange: (value) => setFilters(prev => ({ ...prev, board: value })),
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部板块'),
                    React.createElement(Option, { key: 'association', value: 'association' }, '协会发布'),
                    React.createElement(Option, { key: 'industry', value: 'industry' }, '行业发布'),
                    React.createElement(Option, { key: 'exhibition', value: 'exhibition' }, '展会发布'),
                    React.createElement(Option, { key: 'content', value: 'content' }, '内容发布')
                ])
            ),
            React.createElement(Col, { key: 'date', span: 6 },
                React.createElement(RangePicker, {
                    placeholder: ['开始日期', '结束日期'],
                    value: filters.dateRange,
                    onChange: (dates) => setFilters(prev => ({ ...prev, dateRange: dates })),
                    style: { width: '100%' }
                })
            ),
            React.createElement(Col, { key: 'search', span: 6 },
                React.createElement(Search, {
                    placeholder: '搜索标题或内容',
                    value: filters.keyword,
                    onChange: (e) => setFilters(prev => ({ ...prev, keyword: e.target.value })),
                    onSearch: loadContentList,
                    enterButton: true
                })
            )
        ]));
    };

    const renderDetailModal = () => {
        if (!selectedContent) return null;

        return React.createElement(Modal, {
            title: '内容详情',
            visible: detailModalVisible,
            onCancel: () => setDetailModalVisible(false),
            footer: [
                React.createElement(Button, {
                    key: 'close',
                    onClick: () => setDetailModalVisible(false)
                }, '关闭')
            ],
            width: 800
        }, React.createElement('div', {}, [
            React.createElement('h3', { key: 'title' }, selectedContent.title),
            React.createElement('p', { key: 'desc' }, selectedContent.description),
            React.createElement('div', { key: 'meta', style: { marginTop: 16 } }, [
                React.createElement('p', { key: 'publisher' }, `发布者：${selectedContent.publisher}`),
                React.createElement('p', { key: 'time' }, `发布时间：${selectedContent.publishTime}`),
                React.createElement('p', { key: 'board' }, ['发布板块：', getBoardTag(selectedContent.board)]),
                React.createElement('p', { key: 'type' }, `内容类型：${selectedContent.type === 'video' ? '视频' : '图文'}`),
                selectedContent.duration && React.createElement('p', { key: 'duration' }, `视频时长：${selectedContent.duration}`),
                selectedContent.imageCount && React.createElement('p', { key: 'images' }, `图片数量：${selectedContent.imageCount}张`)
            ])
        ]));
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '内容管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '查看和管理平台所有内容，包括视频、图文等各类型内容的状态管理'
            )
        ]),

        renderStatsCards(),
        renderFilters(),

        React.createElement(Card, { key: 'table-card' }, [
            React.createElement('div', {
                key: 'table-header',
                style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 16 
                }
            }, [
                React.createElement('h3', { key: 'title' }, '内容列表'),
                React.createElement(Space, { key: 'actions' }, [
                    React.createElement(Button, {
                        key: 'refresh',
                        onClick: loadContentList
                    }, '刷新'),
                    React.createElement(Button, {
                        key: 'export',
                        type: 'primary'
                    }, '导出数据')
                ])
            ]),

            React.createElement(Table, {
                key: 'table',
                columns: columns,
                dataSource: contentList,
                loading: loading,
                pagination: {
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                    onChange: (page, pageSize) => {
                        setPagination(prev => ({ ...prev, current: page, pageSize }));
                    }
                },
                rowKey: 'id',
                scroll: { x: 1000 }
            })
        ]),

        renderDetailModal()
    ]);
};

window.ContentManagement = ContentManagement; 