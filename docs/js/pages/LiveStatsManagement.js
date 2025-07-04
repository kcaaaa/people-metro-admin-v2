// 直播数据管理页面
const LiveStatsManagement = () => {
    console.log('LiveStatsManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Alert, Table, Modal, Form, Input, Select, message, Tabs, Statistic, DatePicker, Progress, Tooltip, Badge } = antd;
    const { RangePicker } = DatePicker;
    const { TabPane } = Tabs;
    
    // 状态管理
    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('realtime');
    const [selectedLive, setSelectedLive] = React.useState(null);
    const [reportModalVisible, setReportModalVisible] = React.useState(false);
    const [dateRange, setDateRange] = React.useState([]);
    
    // 模拟实时数据
    const [realtimeStats, setRealtimeStats] = React.useState({
        viewCount: 1234,
        likeCount: 567,
        shareCount: 89,
        onlineUsers: 432,
        peakOnlineUsers: 1500,
        duration: '01:23:45',
        commentCount: 234
    });

    // 模拟历史直播数据
    const [liveHistory] = React.useState([
        {
            id: 'live_001',
            title: '2024城轨创新发展论坛',
            startTime: '2024-03-15 14:00:00',
            endTime: '2024-03-15 16:30:00',
            status: 'ended',
            viewCount: 12345,
            peakOnlineUsers: 2000,
            uniqueViewers: 8000,
            duration: '02:30:00',
            avgWatchTime: '00:45:30',
            likeCount: 3456,
            commentCount: 789,
            shareCount: 234,
            replayViews: 5678
        },
        {
            id: 'live_002',
            title: '智慧地铁技术研讨会',
            startTime: '2024-03-10 09:30:00',
            endTime: '2024-03-10 11:45:00',
            status: 'ended',
            viewCount: 8901,
            peakOnlineUsers: 1500,
            uniqueViewers: 6000,
            duration: '02:15:00',
            avgWatchTime: '00:40:15',
            likeCount: 2345,
            commentCount: 567,
            shareCount: 178,
            replayViews: 3456
        }
    ]);

    // 模拟用户画像数据
    const userPortrait = {
        // 地域分布
        regions: [
            { name: '北京', value: 25 },
            { name: '上海', value: 20 },
            { name: '广州', value: 15 },
            { name: '深圳', value: 12 },
            { name: '其他', value: 28 }
        ],
        // 性别分布
        gender: [
            { name: '男', value: 65 },
            { name: '女', value: 35 }
        ],
        // 年龄分布
        age: [
            { range: '18-24', value: 15 },
            { range: '25-34', value: 35 },
            { range: '35-44', value: 30 },
            { range: '45+', value: 20 }
        ],
        // 终端来源
        platform: [
            { name: 'PC', value: 45 },
            { name: '微信', value: 40 },
            { name: '其他', value: 15 }
        ]
    };

    // 表格列配置
    const columns = [
        {
            title: '直播信息',
            dataIndex: 'title',
            width: 300,
            render: (text, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'title',
                    style: { fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }
                }, text),
                React.createElement('div', {
                    key: 'time',
                    style: { color: '#666', fontSize: '12px' }
                }, `${record.startTime} ~ ${record.endTime}`)
            ])
        },
        {
            title: '观看数据',
            dataIndex: 'viewCount',
            width: 200,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'views',
                    style: { marginBottom: '4px' }
                }, `总观看：${record.viewCount}`),
                React.createElement('div', {
                    key: 'unique',
                    style: { color: '#1890ff' }
                }, `独立观众：${record.uniqueViewers}`)
            ])
        },
        {
            title: '互动数据',
            dataIndex: 'interaction',
            width: 200,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'likes',
                    style: { marginBottom: '4px' }
                }, `点赞：${record.likeCount}`),
                React.createElement('div', {
                    key: 'comments',
                    style: { marginBottom: '4px' }
                }, `评论：${record.commentCount}`),
                React.createElement('div', {
                    key: 'shares'
                }, `分享：${record.shareCount}`)
            ])
        },
        {
            title: '时长',
            dataIndex: 'duration',
            width: 150,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'duration',
                    style: { marginBottom: '4px' }
                }, `直播时长：${record.duration}`),
                React.createElement('div', {
                    key: 'avg'
                }, `平均观看：${record.avgWatchTime}`)
            ])
        },
        {
            title: '回放',
            dataIndex: 'replayViews',
            width: 100,
            render: (views) => `${views} 次`
        },
        {
            title: '操作',
            width: 120,
            render: (_, record) => React.createElement(Space, { size: 'small' }, [
                React.createElement(Button, {
                    key: 'report',
                    type: 'primary',
                    size: 'small',
                    onClick: () => {
                        setSelectedLive(record);
                        setReportModalVisible(true);
                    }
                }, '查看报告')
            ])
        }
    ];

    // 渲染实时监控面板
    const renderRealtimePanel = () => {
        return React.createElement(Card, {
            title: '实时数据监控',
            extra: React.createElement(Button, {
                type: 'primary',
                onClick: () => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                        message.success('数据已刷新');
                    }, 1000);
                }
            }, '刷新数据')
        }, [
            React.createElement(Row, {
                key: 'stats',
                gutter: [16, 16]
            }, [
                React.createElement(Col, { span: 6 },
                    React.createElement(Card, {
                        style: { textAlign: 'center' }
                    }, React.createElement(Statistic, {
                        title: '当前观看人数',
                        value: realtimeStats.onlineUsers,
                        prefix: '👥',
                        valueStyle: { color: '#1890ff' }
                    }))
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Card, {
                        style: { textAlign: 'center' }
                    }, React.createElement(Statistic, {
                        title: '累计观看次数',
                        value: realtimeStats.viewCount,
                        prefix: '👁️',
                        valueStyle: { color: '#52c41a' }
                    }))
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Card, {
                        style: { textAlign: 'center' }
                    }, React.createElement(Statistic, {
                        title: '点赞数',
                        value: realtimeStats.likeCount,
                        prefix: '👍',
                        valueStyle: { color: '#fa8c16' }
                    }))
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Card, {
                        style: { textAlign: 'center' }
                    }, React.createElement(Statistic, {
                        title: '分享数',
                        value: realtimeStats.shareCount,
                        prefix: '🔄',
                        valueStyle: { color: '#722ed1' }
                    }))
                )
            ]),
            React.createElement(Row, {
                key: 'details',
                gutter: [16, 16],
                style: { marginTop: '16px' }
            }, [
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        title: '峰值记录',
                        size: 'small'
                    }, React.createElement(Statistic, {
                        title: '最高同时在线',
                        value: realtimeStats.peakOnlineUsers,
                        suffix: '人'
                    }))
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        title: '直播时长',
                        size: 'small'
                    }, React.createElement(Statistic, {
                        value: realtimeStats.duration
                    }))
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        title: '互动评论',
                        size: 'small'
                    }, React.createElement(Statistic, {
                        value: realtimeStats.commentCount,
                        suffix: '条'
                    }))
                )
            ])
        ]);
    };

    // 渲染历史直播列表
    const renderHistoryList = () => {
        return React.createElement(Card, {
            title: '历史直播记录',
            extra: React.createElement(Space, {}, [
                React.createElement(RangePicker, {
                    value: dateRange,
                    onChange: setDateRange
                }),
                React.createElement(Button, {
                    type: 'primary'
                }, '查询')
            ])
        }, React.createElement(Table, {
            dataSource: liveHistory,
            columns: columns,
            rowKey: 'id',
            pagination: {
                total: liveHistory.length,
                pageSize: 10,
                showTotal: (total) => `共 ${total} 条记录`
            }
        }));
    };

    // 渲染用户画像分析
    const renderUserPortrait = () => {
        return [
            // 地域分布
            React.createElement(Card, {
                key: 'region',
                title: '观众地域分布',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, {
                gutter: 16
            }, userPortrait.regions.map(region => 
                React.createElement(Col, { span: 4, key: region.name },
                    React.createElement('div', {
                        style: { textAlign: 'center' }
                    }, [
                        React.createElement('div', {
                            key: 'value',
                            style: { fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }
                        }, `${region.value}%`),
                        React.createElement('div', {
                            key: 'name',
                            style: { color: '#666' }
                        }, region.name)
                    ])
                )
            ))),

            // 用户属性
            React.createElement(Row, {
                key: 'attributes',
                gutter: 16
            }, [
                // 性别分布
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        title: '性别分布'
                    }, userPortrait.gender.map(item => 
                        React.createElement('div', {
                            key: item.name,
                            style: { marginBottom: '16px' }
                        }, [
                            React.createElement('div', {
                                style: { marginBottom: '8px' }
                            }, `${item.name}：${item.value}%`),
                            React.createElement(Progress, {
                                percent: item.value,
                                showInfo: false,
                                strokeColor: item.name === '男' ? '#1890ff' : '#f759ab'
                            })
                        ])
                    ))
                ),

                // 年龄分布
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        title: '年龄分布'
                    }, userPortrait.age.map(item => 
                        React.createElement('div', {
                            key: item.range,
                            style: { marginBottom: '16px' }
                        }, [
                            React.createElement('div', {
                                style: { marginBottom: '8px' }
                            }, `${item.range}：${item.value}%`),
                            React.createElement(Progress, {
                                percent: item.value,
                                showInfo: false,
                                strokeColor: '#722ed1'
                            })
                        ])
                    ))
                ),

                // 终端来源
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        title: '终端来源'
                    }, userPortrait.platform.map(item => 
                        React.createElement('div', {
                            key: item.name,
                            style: { marginBottom: '16px' }
                        }, [
                            React.createElement('div', {
                                style: { marginBottom: '8px' }
                            }, `${item.name}：${item.value}%`),
                            React.createElement(Progress, {
                                percent: item.value,
                                showInfo: false,
                                strokeColor: '#52c41a'
                            })
                        ])
                    ))
                )
            ])
        ];
    };

    // 渲染直播报告弹窗
    const renderReportModal = () => {
        if (!selectedLive) return null;

        return React.createElement(Modal, {
            title: '直播数据报告',
            visible: reportModalVisible,
            width: 800,
            footer: React.createElement(Button, {
                type: 'primary',
                onClick: () => setReportModalVisible(false)
            }, '关闭'),
            onCancel: () => setReportModalVisible(false)
        }, [
            // 基础信息
            React.createElement(Card, {
                key: 'basic',
                title: '基础信息',
                style: { marginBottom: '16px' }
            }, React.createElement(Descriptions, {
                column: 2
            }, [
                React.createElement(Descriptions.Item, { label: '直播标题' }, selectedLive.title),
                React.createElement(Descriptions.Item, { label: '直播时间' }, `${selectedLive.startTime} ~ ${selectedLive.endTime}`),
                React.createElement(Descriptions.Item, { label: '直播时长' }, selectedLive.duration),
                React.createElement(Descriptions.Item, { label: '平均观看时长' }, selectedLive.avgWatchTime)
            ])),

            // 观看数据
            React.createElement(Card, {
                key: 'viewership',
                title: '观看数据',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, {
                gutter: 16
            }, [
                React.createElement(Col, { span: 6 },
                    React.createElement(Statistic, {
                        title: '总观看次数',
                        value: selectedLive.viewCount,
                        prefix: '👁️'
                    })
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Statistic, {
                        title: '最高同时在线',
                        value: selectedLive.peakOnlineUsers,
                        prefix: '👥'
                    })
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Statistic, {
                        title: '独立观众数',
                        value: selectedLive.uniqueViewers,
                        prefix: '🎯'
                    })
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Statistic, {
                        title: '回放观看次数',
                        value: selectedLive.replayViews,
                        prefix: '🔄'
                    })
                )
            ])),

            // 互动数据
            React.createElement(Card, {
                key: 'interaction',
                title: '互动数据',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, {
                gutter: 16
            }, [
                React.createElement(Col, { span: 8 },
                    React.createElement(Statistic, {
                        title: '点赞数',
                        value: selectedLive.likeCount,
                        prefix: '👍'
                    })
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Statistic, {
                        title: '评论数',
                        value: selectedLive.commentCount,
                        prefix: '💬'
                    })
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Statistic, {
                        title: '分享数',
                        value: selectedLive.shareCount,
                        prefix: '🔄'
                    })
                )
            ])),

            // 用户画像
            React.createElement(Card, {
                key: 'portrait',
                title: '用户画像分析'
            }, renderUserPortrait())
        ]);
    };

    return React.createElement('div', { className: 'live-stats-page' }, [
        // 页面标题
        React.createElement('div', {
            key: 'header',
            style: { marginBottom: '24px' }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }
            }, '📺 直播数据管理'),
            React.createElement('div', {
                key: 'description',
                style: { color: '#666', marginTop: '8px' }
            }, '实时监控直播数据，分析直播效果和用户行为')
        ]),

        // 功能区域
        React.createElement(Tabs, {
            key: 'tabs',
            activeKey: activeTab,
            onChange: setActiveTab
        }, [
            React.createElement(TabPane, {
                key: 'realtime',
                tab: '实时监控'
            }, renderRealtimePanel()),

            React.createElement(TabPane, {
                key: 'history',
                tab: '历史记录'
            }, renderHistoryList()),

            React.createElement(TabPane, {
                key: 'portrait',
                tab: '用户画像'
            }, renderUserPortrait())
        ]),

        // 直播报告弹窗
        renderReportModal()
    ]);
};

console.log('LiveStatsManagement component defined');
window.LiveStatsManagement = LiveStatsManagement;
console.log('[LiveStatsManagement] window.LiveStatsManagement 挂载成功'); 