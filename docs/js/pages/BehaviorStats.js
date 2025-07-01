// 用户行为统计页面 - 基于新功能规范重构
const BehaviorStats = () => {
    const { Row, Col, Card, Statistic, Button, Space, Select, DatePicker, Tabs, Table, Progress, Tag, Alert, Modal, Form, message } = antd;
    const [activeTab, setActiveTab] = React.useState('overview');
    const [basicData, setBasicData] = React.useState({});
    const [deepData, setDeepData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [dateRange, setDateRange] = React.useState(null);
    const [exportModalVisible, setExportModalVisible] = React.useState(false);
    const [form] = Form.useForm();

    React.useEffect(() => {
        loadBehaviorData();
    }, []);

    const loadBehaviorData = () => {
        setLoading(true);
        setTimeout(() => {
            // 基础行为数据
            setBasicData({
                overview: {
                    totalUsers: 125648,
                    activeUsers: 89234,
                    newUsers: 2456,
                    dailyActiveUsers: 45623,
                    weeklyActiveUsers: 78932,
                    monthlyActiveUsers: 89234
                },
                pageViews: {
                    totalPV: 1256489,
                    totalUV: 89234,
                    avgSessionTime: '8.5分钟',
                    bounceRate: 0.234,
                    pages: [
                        { page: '推荐页', pv: 456789, uv: 34567, avgTime: '12.3分钟', stayTime: 738 },
                        { page: '热门页', pv: 298765, uv: 28934, avgTime: '9.8分钟', stayTime: 588 },
                        { page: '关注页', pv: 234567, uv: 23456, avgTime: '7.6分钟', stayTime: 456 },
                        { page: '展会页', pv: 156789, uv: 18765, avgTime: '15.2分钟', stayTime: 912 },
                        { page: '协会页', pv: 109876, uv: 12345, avgTime: '6.4分钟', stayTime: 384 }
                    ]
                },
                interactions: {
                    totalLikes: 234567,
                    totalComments: 89456,
                    totalShares: 45623,
                    totalFollows: 23456,
                    totalCollects: 34567,
                    interactionsByType: [
                        { type: '点赞', count: 234567, growth: '+12.3%' },
                        { type: '评论', count: 89456, growth: '+8.7%' },
                        { type: '分享', count: 45623, growth: '+15.2%' },
                        { type: '关注', count: 23456, growth: '+6.8%' },
                        { type: '收藏', count: 34567, growth: '+9.4%' }
                    ]
                },
                publishing: {
                    totalPublications: 15623,
                    imageContent: 8945,
                    videoContent: 4567,
                    textContent: 2111,
                    avgPublishFreq: 2.3,
                    publishTrends: [
                        { date: '2024-01-01', count: 245 },
                        { date: '2024-01-08', count: 298 },
                        { date: '2024-01-15', count: 356 }
                    ]
                }
            });

            // 深度行为数据  
            setDeepData({
                videoAnalysis: {
                    totalViews: 789456,
                    totalPlayTime: 2345678, // 分钟
                    avgPlayTime: 3.2, // 分钟
                    completionRate: 0.567,
                    topVideos: [
                        { 
                            id: 'V001', 
                            title: '城轨信号系统技术分享',
                            views: 23456,
                            playTime: 89234, // 分钟
                            avgPlayTime: 3.8,
                            completionRate: 0.72,
                            dragCount: 1234,
                            pauseCount: 2345,
                            replayCount: 567
                        },
                        { 
                            id: 'V002', 
                            title: '智能列车控制系统介绍',
                            views: 18765,
                            playTime: 67543,
                            avgPlayTime: 3.6,
                            completionRate: 0.68,
                            dragCount: 987,
                            pauseCount: 1876,
                            replayCount: 432
                        },
                        { 
                            id: 'V003', 
                            title: '地铁安全运营规范',
                            views: 15623,
                            playTime: 45678,
                            avgPlayTime: 2.9,
                            completionRate: 0.63,
                            dragCount: 756,
                            pauseCount: 1543,
                            replayCount: 298
                        }
                    ]
                },
                searchAnalysis: {
                    totalSearches: 156789,
                    avgSearchesPerUser: 1.8,
                    topKeywords: [
                        { keyword: '信号系统', count: 15623, clickRate: 0.78 },
                        { keyword: '车辆制造', count: 12456, clickRate: 0.82 },
                        { keyword: '运营维护', count: 9876, clickRate: 0.75 },
                        { keyword: '展会信息', count: 8765, clickRate: 0.88 },
                        { keyword: '技术标准', count: 7654, clickRate: 0.79 },
                        { keyword: '协会活动', count: 6543, clickRate: 0.84 },
                        { keyword: '行业新闻', count: 5432, clickRate: 0.76 }
                    ],
                    noResultKeywords: [
                        { keyword: '新能源列车', count: 234 },
                        { keyword: '智能调度', count: 189 },
                        { keyword: '安全监控', count: 156 },
                        { keyword: '维修工具', count: 134 },
                        { keyword: '培训课程', count: 98 }
                    ],
                    searchFreq: {
                        total: 156789,
                        daily: 5226,
                        weekly: 36574,
                        monthly: 156789
                    }
                }
            });

            setLoading(false);
        }, 800);
    };

    // 导出数据
    const exportData = (dataType) => {
        setExportModalVisible(true);
        form.setFieldsValue({ dataType: dataType });
    };

    const handleExport = () => {
        const values = form.getFieldsValue();
        message.success(`正在导出${values.dataType}数据...`);
        setExportModalVisible(false);
        form.resetFields();
    };

    // 渲染概览数据
    const renderOverview = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '用户行为数据统计',
                description: '实时采集和分析用户在APP内的各项行为数据，为运营决策提供数据支撑',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '16px' }
            }),
            React.createElement(Row, { key: 'main-stats', gutter: [16, 16] }, [
                React.createElement(Col, { key: 'dau', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { className: 'dashboard-card' },
                        React.createElement(Statistic, {
                            title: '日活跃用户(DAU)',
                            value: basicData.overview?.dailyActiveUsers,
                            valueStyle: { color: '#2563eb' },
                            suffix: '人'
                        })
                    )
                ),
                React.createElement(Col, { key: 'wau', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { className: 'dashboard-card' },
                        React.createElement(Statistic, {
                            title: '周活跃用户(WAU)',
                            value: basicData.overview?.weeklyActiveUsers,
                            valueStyle: { color: '#22c55e' },
                            suffix: '人'
                        })
                    )
                ),
                React.createElement(Col, { key: 'mau', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { className: 'dashboard-card' },
                        React.createElement(Statistic, {
                            title: '月活跃用户(MAU)',
                            value: basicData.overview?.monthlyActiveUsers,
                            valueStyle: { color: '#8b5cf6' },
                            suffix: '人'
                        })
                    )
                ),
                React.createElement(Col, { key: 'total', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { className: 'dashboard-card' },
                        React.createElement(Statistic, {
                            title: '总用户数',
                            value: basicData.overview?.totalUsers,
                            valueStyle: { color: '#f59e42' },
                            suffix: '人'
                        })
                    )
                )
            ]),
            React.createElement(Row, { key: 'detail-stats', gutter: [16, 16], style: { marginTop: '16px' } }, [
                React.createElement(Col, { key: 'pv', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '页面浏览量(PV)',
                            value: basicData.pageViews?.totalPV,
                            precision: 0
                        })
                    )
                ),
                React.createElement(Col, { key: 'uv', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '独立访客(UV)',
                            value: basicData.pageViews?.totalUV,
                            precision: 0
                        })
                    )
                ),
                React.createElement(Col, { key: 'session', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '平均使用时长',
                            value: basicData.pageViews?.avgSessionTime || '8.5分钟'
                        })
                    )
                ),
                React.createElement(Col, { key: 'interactions', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '总互动次数',
                            value: basicData.interactions?.totalLikes + basicData.interactions?.totalComments + basicData.interactions?.totalShares || 0,
                            precision: 0
                        })
                    )
                )
            ])
        ]);
    };

    // 渲染基础行为数据
    const renderBasicBehavior = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '基础行为数据采集',
                description: '记录用户完整的访问路径、页面停留时长、来源页面等基础操作数据',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '16px' }
            }),
            React.createElement(Row, { key: 'basic-data', gutter: [16, 16] }, [
                // 页面浏览记录
                React.createElement(Col, { key: 'pages', span: 12 },
                    React.createElement(Card, {
                        title: '页面浏览记录(PV/UV)',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportData('页面浏览数据')
                        }, '导出数据')
                    }, React.createElement(Table, {
                        dataSource: basicData.pageViews?.pages || [],
                        pagination: false,
                        size: 'small',
                        columns: [
                            { title: '页面', dataIndex: 'page', width: 80 },
                            { title: 'PV', dataIndex: 'pv', width: 70, render: (val) => `${(val/1000).toFixed(1)}k` },
                            { title: 'UV', dataIndex: 'uv', width: 70, render: (val) => `${(val/1000).toFixed(1)}k` },
                            { title: '停留时长', dataIndex: 'avgTime', width: 90 },
                            { title: '平均停留', dataIndex: 'stayTime', width: 90, render: (val) => `${Math.floor(val/60)}分${val%60}秒` }
                        ]
                    }))
                ),
                // 交互行为记录
                React.createElement(Col, { key: 'interactions', span: 12 },
                    React.createElement(Card, {
                        title: '交互行为记录',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportData('交互行为数据')
                        }, '导出数据')
                    }, React.createElement(Table, {
                        dataSource: basicData.interactions?.interactionsByType || [],
                        pagination: false,
                        size: 'small',
                        columns: [
                            { title: '交互类型', dataIndex: 'type', width: 80 },
                            { title: '总次数', dataIndex: 'count', width: 90, render: (val) => val?.toLocaleString() },
                            { title: '增长率', dataIndex: 'growth', width: 70, 
                              render: (val) => React.createElement(Tag, {
                                  color: val?.startsWith('+') ? 'green' : 'red'
                              }, val)
                            }
                        ]
                    }))
                )
            ]),
            // 发布行为记录
            React.createElement(Row, { key: 'publishing', gutter: [16, 16], style: { marginTop: '16px' } }, [
                React.createElement(Col, { span: 24 },
                    React.createElement(Card, {
                        title: '发布行为记录',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportData('发布行为数据')
                        }, '导出数据')
                    }, React.createElement(Row, { gutter: 16 }, [
                        React.createElement(Col, { span: 6 },
                            React.createElement(Statistic, {
                                title: '总发布数',
                                value: basicData.publishing?.totalPublications,
                                valueStyle: { color: '#2563eb' }
                            })
                        ),
                        React.createElement(Col, { span: 6 },
                            React.createElement(Statistic, {
                                title: '图文内容',
                                value: basicData.publishing?.imageContent,
                                valueStyle: { color: '#22c55e' }
                            })
                        ),
                        React.createElement(Col, { span: 6 },
                            React.createElement(Statistic, {
                                title: '视频内容',
                                value: basicData.publishing?.videoContent,
                                valueStyle: { color: '#8b5cf6' }
                            })
                        ),
                        React.createElement(Col, { span: 6 },
                            React.createElement(Statistic, {
                                title: '平均发布频率',
                                value: basicData.publishing?.avgPublishFreq,
                                suffix: '次/天',
                                valueStyle: { color: '#f59e42' }
                            })
                        )
                    ]))
                )
            ])
        ]);
    };

    // 渲染深度行为数据
    const renderDeepBehavior = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '深度行为数据采集',
                description: '采集用户与内容交互的深度行为数据，包括视频播放数据和搜索行为数据',
                type: 'success',
                showIcon: true,
                style: { marginBottom: '16px' }
            }),
            React.createElement(Row, { key: 'deep-analysis', gutter: [16, 16] }, [
                // 视频播放数据
                React.createElement(Col, { key: 'video', span: 14 },
                    React.createElement(Card, {
                        title: '视频播放数据',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportData('视频播放数据')
                        }, '导出数据')
                    }, React.createElement('div', {}, [
                        React.createElement(Row, { key: 'video-overview', gutter: 16, style: { marginBottom: '16px' } }, [
                            React.createElement(Col, { span: 6 },
                                React.createElement(Statistic, {
                                    title: '总播放次数',
                                    value: deepData.videoAnalysis?.totalViews,
                                    precision: 0,
                                    valueStyle: { fontSize: '16px' }
                                })
                            ),
                            React.createElement(Col, { span: 6 },
                                React.createElement(Statistic, {
                                    title: '总播放时长',
                                    value: `${Math.floor((deepData.videoAnalysis?.totalPlayTime || 0) / 60)} 小时`,
                                    valueStyle: { fontSize: '16px' }
                                })
                            ),
                            React.createElement(Col, { span: 6 },
                                React.createElement(Statistic, {
                                    title: '平均播放时长',
                                    value: `${deepData.videoAnalysis?.avgPlayTime} 分钟`,
                                    valueStyle: { fontSize: '16px' }
                                })
                            ),
                            React.createElement(Col, { span: 6 },
                                React.createElement(Statistic, {
                                    title: '完播率',
                                    value: ((deepData.videoAnalysis?.completionRate || 0) * 100).toFixed(1),
                                    suffix: '%',
                                    valueStyle: { fontSize: '16px' }
                                })
                            )
                        ]),
                        React.createElement(Table, {
                            key: 'video-table',
                            dataSource: deepData.videoAnalysis?.topVideos || [],
                            pagination: false,
                            size: 'small',
                            columns: [
                                { title: '视频标题', dataIndex: 'title', ellipsis: true },
                                { title: '播放次数', dataIndex: 'views', width: 80, render: (val) => `${(val/1000).toFixed(1)}k` },
                                { title: '完播率', dataIndex: 'completionRate', width: 70, render: (val) => `${(val*100).toFixed(1)}%` },
                                { title: '拖拽次数', dataIndex: 'dragCount', width: 80 },
                                { title: '暂停次数', dataIndex: 'pauseCount', width: 80 },
                                { title: '重播次数', dataIndex: 'replayCount', width: 80 }
                            ]
                        })
                    ]))
                ),
                // 搜索行为数据
                React.createElement(Col, { key: 'search', span: 10 },
                    React.createElement(Card, {
                        title: '搜索行为数据',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportData('搜索行为数据')
                        }, '导出数据')
                    }, React.createElement('div', {}, [
                        React.createElement(Row, { key: 'search-stats', gutter: 8, style: { marginBottom: '16px' } }, [
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '总搜索次数',
                                    value: deepData.searchAnalysis?.totalSearches,
                                    precision: 0,
                                    valueStyle: { fontSize: '14px' }
                                })
                            ),
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '人均搜索',
                                    value: deepData.searchAnalysis?.avgSearchesPerUser,
                                    suffix: '次',
                                    valueStyle: { fontSize: '14px' }
                                })
                            )
                        ]),
                        React.createElement('div', {
                            key: 'hot-keywords',
                            style: { marginBottom: '16px' }
                        }, [
                            React.createElement('div', {
                                key: 'title',
                                style: { fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }
                            }, '热门搜索关键词'),
                            React.createElement('div', { key: 'keywords' },
                                deepData.searchAnalysis?.topKeywords?.slice(0, 7).map((item, index) =>
                                    React.createElement(Tag, {
                                        key: index,
                                        color: 'blue',
                                        style: { margin: '2px', fontSize: '11px' }
                                    }, `${item.keyword} (${item.count})`)
                                )
                            )
                        ]),
                        React.createElement('div', {
                            key: 'no-result',
                            style: { marginTop: '16px' }
                        }, [
                            React.createElement('div', {
                                key: 'title',
                                style: { fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }
                            }, '无结果搜索词'),
                            React.createElement('div', { key: 'keywords' },
                                deepData.searchAnalysis?.noResultKeywords?.map((item, index) =>
                                    React.createElement(Tag, {
                                        key: index,
                                        color: 'orange',
                                        style: { margin: '2px', fontSize: '11px' }
                                    }, `${item.keyword} (${item.count})`)
                                )
                            )
                        ])
                    ]))
                )
            ])
        ]);
    };

    // Tab配置
    const tabItems = [
        {
            key: 'overview',
            label: '数据概览',
            children: renderOverview()
        },
        {
            key: 'basic',
            label: '基础行为数据',
            children: renderBasicBehavior()
        },
        {
            key: 'deep',
            label: '深度行为数据',
            children: renderDeepBehavior()
        }
    ];

    return React.createElement('div', { className: 'behavior-stats-page' }, [
        React.createElement(Tabs, {
            key: 'main-tabs',
            activeKey: activeTab,
            onChange: setActiveTab,
            items: tabItems,
            style: { padding: '0 24px' }
        }),

        // 导出数据模态框
        React.createElement(Modal, {
            key: 'export-modal',
            title: '导出数据',
            open: exportModalVisible,
            onCancel: () => setExportModalVisible(false),
            onOk: handleExport,
            width: 500
        }, React.createElement(Form, {
            form: form,
            layout: 'vertical'
        }, [
            React.createElement(Form.Item, {
                key: 'dataType',
                name: 'dataType',
                label: '数据类型',
                rules: [{ required: true, message: '请选择数据类型' }]
            }, React.createElement(Select, {
                placeholder: '请选择要导出的数据类型',
                options: [
                    { value: '页面浏览数据', label: '页面浏览数据' },
                    { value: '交互行为数据', label: '交互行为数据' },
                    { value: '发布行为数据', label: '发布行为数据' },
                    { value: '视频播放数据', label: '视频播放数据' },
                    { value: '搜索行为数据', label: '搜索行为数据' }
                ]
            })),
            React.createElement(Form.Item, {
                key: 'dateRange',
                name: 'dateRange',
                label: '时间范围'
            }, React.createElement(DatePicker.RangePicker, {
                style: { width: '100%' }
            })),
            React.createElement(Form.Item, {
                key: 'format',
                name: 'format',
                label: '导出格式',
                initialValue: 'excel'
            }, React.createElement(Select, {
                options: [
                    { value: 'excel', label: 'Excel表格' },
                    { value: 'csv', label: 'CSV文件' },
                    { value: 'json', label: 'JSON数据' }
                ]
            }))
        ]))
    ]);
};

window.BehaviorStats = BehaviorStats; 