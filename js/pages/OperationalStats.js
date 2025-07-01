// 运营数据统计页面 - 基于新功能规范重构
const OperationalStats = () => {
    const { Row, Col, Card, Statistic, Button, Space, Select, DatePicker, Tabs, Table, Progress, Tag, Alert, Modal, Form, Tooltip, Badge, message } = antd;
    
    const [activeTab, setActiveTab] = React.useState('overview');
    const [coreData, setCoreData] = React.useState({});
    const [moduleData, setModuleData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [dateRange, setDateRange] = React.useState(null);
    const [exportModalVisible, setExportModalVisible] = React.useState(false);
    const [form] = Form.useForm();

    React.useEffect(() => {
        loadOperationalData();
    }, []);

    const loadOperationalData = () => {
        setLoading(true);
        setTimeout(() => {
            // 核心运营指标数据
            setCoreData({
                userActivity: {
                    dailyActive: 45623,
                    weeklyActive: 78932,
                    monthlyActive: 89234,
                    avgUsageTime: 8.5, // 分钟
                    growthRate: {
                        daily: '+5.2%',
                        weekly: '+8.7%',
                        monthly: '+12.3%'
                    }
                },
                contentCore: {
                    totalLikes: 234567,
                    totalComments: 89456,
                    totalShares: 45623,
                    completionRate: 0.672, // 完播率
                    engagement: {
                        likes: { value: 234567, growth: '+12.3%' },
                        comments: { value: 89456, growth: '+8.7%' },
                        shares: { value: 45623, growth: '+15.2%' },
                        completion: { value: 67.2, growth: '+3.8%' }
                    }
                },
                dailyTrends: {
                    dates: ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15'],
                    dau: [42300, 43800, 45200, 44600, 46100, 47200, 45623],
                    likes: [22400, 23100, 24500, 23800, 25200, 26300, 24800],
                    comments: [8200, 8600, 9100, 8800, 9400, 9800, 9200]
                }
            });

            // 分模块统计数据
            setModuleData({
                byUserType: [
                    {
                        userType: '行业用户发布',
                        contentCount: 8945,
                        viewCount: 456789,
                        likeCount: 45678,
                        commentCount: 12345,
                        shareCount: 6789,
                        avgEngagement: 0.142,
                        growth: '+8.5%'
                    },
                    {
                        userType: '展会用户发布',
                        contentCount: 4567,
                        viewCount: 298765,
                        likeCount: 29876,
                        commentCount: 8765,
                        shareCount: 4321,
                        avgEngagement: 0.156,
                        growth: '+12.3%'
                    },
                    {
                        userType: '协会用户发布',
                        contentCount: 2111,
                        viewCount: 189234,
                        likeCount: 18923,
                        commentCount: 5432,
                        shareCount: 2876,
                        avgEngagement: 0.168,
                        growth: '+15.7%'
                    }
                ],
                byContentTag: [
                    {
                        tag: '技术分享',
                        contentCount: 3456,
                        viewCount: 234567,
                        likeCount: 23456,
                        avgEngagement: 0.158,
                        hotIndex: 95
                    },
                    {
                        tag: '行业新闻',
                        contentCount: 2789,
                        viewCount: 189234,
                        likeCount: 18923,
                        avgEngagement: 0.134,
                        hotIndex: 87
                    },
                    {
                        tag: '展会活动',
                        contentCount: 2345,
                        viewCount: 156789,
                        likeCount: 15678,
                        avgEngagement: 0.145,
                        hotIndex: 82
                    },
                    {
                        tag: '政策解读',
                        contentCount: 1876,
                        viewCount: 123456,
                        likeCount: 12345,
                        avgEngagement: 0.128,
                        hotIndex: 76
                    },
                    {
                        tag: '设备介绍',
                        contentCount: 1654,
                        viewCount: 98765,
                        likeCount: 9876,
                        avgEngagement: 0.121,
                        hotIndex: 71
                    },
                    {
                        tag: '安全培训',
                        contentCount: 1432,
                        viewCount: 87654,
                        likeCount: 8765,
                        avgEngagement: 0.118,
                        hotIndex: 68
                    }
                ],
                contentAnalysis: {
                    totalContent: 15623,
                    imageContent: { count: 8945, percentage: 57.3 },
                    videoContent: { count: 4567, percentage: 29.2 },
                    textContent: { count: 2111, percentage: 13.5 },
                    qualityDistribution: {
                        high: { count: 4687, percentage: 30.0 },
                        medium: { count: 9374, percentage: 60.0 },
                        low: { count: 1562, percentage: 10.0 }
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

    // 渲染核心指标看板
    const renderCoreMetrics = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '核心运营指标',
                description: '展示平台核心运营数据，包括用户活跃度和内容核心数据',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),
            
            // 用户活跃度指标
            React.createElement(Card, {
                key: 'user-activity',
                title: '👥 用户活跃度',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, { gutter: [16, 16] }, [
                React.createElement(Col, { key: 'dau', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'metric-card' }, [
                        React.createElement(Statistic, {
                            key: 'stat',
                            title: '日活跃用户(DAU)',
                            value: coreData.userActivity?.dailyActive,
                            valueStyle: { color: '#2563eb', fontSize: '20px' },
                            suffix: '人'
                        }),
                        React.createElement('div', {
                            key: 'growth',
                            style: { marginTop: '8px', fontSize: '12px' }
                        }, [
                            React.createElement(Tag, {
                                key: 'tag',
                                color: 'green',
                                size: 'small'
                            }, coreData.userActivity?.growthRate?.daily)
                        ])
                    ])
                ),
                React.createElement(Col, { key: 'wau', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'metric-card' }, [
                        React.createElement(Statistic, {
                            key: 'stat',
                            title: '周活跃用户(WAU)',
                            value: coreData.userActivity?.weeklyActive,
                            valueStyle: { color: '#22c55e', fontSize: '20px' },
                            suffix: '人'
                        }),
                        React.createElement('div', {
                            key: 'growth',
                            style: { marginTop: '8px', fontSize: '12px' }
                        }, [
                            React.createElement(Tag, {
                                key: 'tag',
                                color: 'green',
                                size: 'small'
                            }, coreData.userActivity?.growthRate?.weekly)
                        ])
                    ])
                ),
                React.createElement(Col, { key: 'mau', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'metric-card' }, [
                        React.createElement(Statistic, {
                            key: 'stat',
                            title: '月活跃用户(MAU)',
                            value: coreData.userActivity?.monthlyActive,
                            valueStyle: { color: '#8b5cf6', fontSize: '20px' },
                            suffix: '人'
                        }),
                        React.createElement('div', {
                            key: 'growth',
                            style: { marginTop: '8px', fontSize: '12px' }
                        }, [
                            React.createElement(Tag, {
                                key: 'tag',
                                color: 'green',
                                size: 'small'
                            }, coreData.userActivity?.growthRate?.monthly)
                        ])
                    ])
                ),
                React.createElement(Col, { key: 'usage', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'metric-card' },
                        React.createElement(Statistic, {
                            title: '平均使用时长',
                            value: `${coreData.userActivity?.avgUsageTime} 分钟`,
                            valueStyle: { color: '#f59e42', fontSize: '20px' }
                        })
                    )
                )
            ])),

            // 内容核心数据
            React.createElement(Card, {
                key: 'content-core',
                title: '📊 内容核心数据',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, { gutter: [16, 16] }, [
                React.createElement(Col, { key: 'likes', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'metric-card' }, [
                        React.createElement(Statistic, {
                            key: 'stat',
                            title: '点赞量',
                            value: coreData.contentCore?.engagement?.likes?.value,
                            valueStyle: { color: '#ef4444', fontSize: '18px' },
                            precision: 0
                        }),
                        React.createElement('div', {
                            key: 'growth',
                            style: { marginTop: '8px', fontSize: '12px' }
                        }, [
                            React.createElement(Tag, {
                                key: 'tag',
                                color: 'green',
                                size: 'small'
                            }, coreData.contentCore?.engagement?.likes?.growth)
                        ])
                    ])
                ),
                React.createElement(Col, { key: 'comments', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'metric-card' }, [
                        React.createElement(Statistic, {
                            key: 'stat',
                            title: '评论量',
                            value: coreData.contentCore?.engagement?.comments?.value,
                            valueStyle: { color: '#3b82f6', fontSize: '18px' },
                            precision: 0
                        }),
                        React.createElement('div', {
                            key: 'growth',
                            style: { marginTop: '8px', fontSize: '12px' }
                        }, [
                            React.createElement(Tag, {
                                key: 'tag',
                                color: 'green',
                                size: 'small'
                            }, coreData.contentCore?.engagement?.comments?.growth)
                        ])
                    ])
                ),
                React.createElement(Col, { key: 'shares', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'metric-card' }, [
                        React.createElement(Statistic, {
                            key: 'stat',
                            title: '分享量',
                            value: coreData.contentCore?.engagement?.shares?.value,
                            valueStyle: { color: '#10b981', fontSize: '18px' },
                            precision: 0
                        }),
                        React.createElement('div', {
                            key: 'growth',
                            style: { marginTop: '8px', fontSize: '12px' }
                        }, [
                            React.createElement(Tag, {
                                key: 'tag',
                                color: 'green',
                                size: 'small'
                            }, coreData.contentCore?.engagement?.shares?.growth)
                        ])
                    ])
                ),
                React.createElement(Col, { key: 'completion', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'metric-card' }, [
                        React.createElement(Statistic, {
                            key: 'stat',
                            title: '完播率',
                            value: coreData.contentCore?.engagement?.completion?.value,
                            valueStyle: { color: '#8b5cf6', fontSize: '18px' },
                            suffix: '%'
                        }),
                        React.createElement('div', {
                            key: 'growth',
                            style: { marginTop: '8px', fontSize: '12px' }
                        }, [
                            React.createElement(Tag, {
                                key: 'tag',
                                color: 'green',
                                size: 'small'
                            }, coreData.contentCore?.engagement?.completion?.growth)
                        ])
                    ])
                )
            ]))
        ]);
    };

    // 渲染分模块数据统计
    const renderModuleStats = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '分模块数据统计',
                description: '按内容板块和作品标签分类统计数据，了解不同模块的表现情况',
                type: 'success',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            // 按用户类型统计
            React.createElement(Card, {
                key: 'by-user-type',
                title: '📋 按内容板块统计',
                extra: React.createElement(Button, {
                    size: 'small',
                    onClick: () => exportData('内容板块数据')
                }, '导出数据'),
                style: { marginBottom: '16px' }
            }, React.createElement(Table, {
                dataSource: moduleData.byUserType?.map((item, index) => ({ ...item, key: index })) || [],
                pagination: false,
                size: 'small',
                columns: [
                    {
                        title: '内容板块',
                        dataIndex: 'userType',
                        width: 120,
                        render: (text) => React.createElement('div', {
                            style: { fontWeight: 'bold', color: '#1890ff' }
                        }, text)
                    },
                    {
                        title: '内容数量',
                        dataIndex: 'contentCount',
                        width: 100,
                        render: (value) => value?.toLocaleString()
                    },
                    {
                        title: '总浏览量',
                        dataIndex: 'viewCount',
                        width: 120,
                        render: (value) => `${(value/1000).toFixed(1)}k`
                    },
                    {
                        title: '点赞数',
                        dataIndex: 'likeCount',
                        width: 100,
                        render: (value) => `${(value/1000).toFixed(1)}k`
                    },
                    {
                        title: '评论数',
                        dataIndex: 'commentCount',
                        width: 100,
                        render: (value) => `${(value/1000).toFixed(1)}k`
                    },
                    {
                        title: '分享数',
                        dataIndex: 'shareCount',
                        width: 100,
                        render: (value) => `${(value/1000).toFixed(1)}k`
                    },
                    {
                        title: '平均互动率',
                        dataIndex: 'avgEngagement',
                        width: 100,
                        render: (value) => `${(value * 100).toFixed(1)}%`
                    },
                    {
                        title: '增长率',
                        dataIndex: 'growth',
                        width: 80,
                        render: (growth) => React.createElement(Tag, {
                            color: growth?.startsWith('+') ? 'green' : 'red'
                        }, growth)
                    }
                ]
            })),

            // 按作品标签统计
            React.createElement(Card, {
                key: 'by-content-tag',
                title: '🏷️ 按作品标签统计',
                extra: React.createElement(Button, {
                    size: 'small',
                    onClick: () => exportData('作品标签数据')
                }, '导出数据'),
                style: { marginBottom: '16px' }
            }, React.createElement(Table, {
                dataSource: moduleData.byContentTag?.map((item, index) => ({ ...item, key: index })) || [],
                pagination: false,
                size: 'small',
                columns: [
                    {
                        title: '标签名称',
                        dataIndex: 'tag',
                        width: 100,
                        render: (text) => React.createElement(Tag, { color: 'blue' }, text)
                    },
                    {
                        title: '内容数量',
                        dataIndex: 'contentCount',
                        width: 100,
                        render: (value) => value?.toLocaleString()
                    },
                    {
                        title: '总浏览量',
                        dataIndex: 'viewCount',
                        width: 120,
                        render: (value) => `${(value/1000).toFixed(1)}k`
                    },
                    {
                        title: '点赞数',
                        dataIndex: 'likeCount',
                        width: 100,
                        render: (value) => `${(value/1000).toFixed(1)}k`
                    },
                    {
                        title: '平均互动率',
                        dataIndex: 'avgEngagement',
                        width: 100,
                        render: (value) => `${(value * 100).toFixed(1)}%`
                    },
                    {
                        title: '热度指数',
                        dataIndex: 'hotIndex',
                        width: 100,
                        render: (value) => React.createElement(Progress, {
                            percent: value,
                            size: 'small',
                            status: value >= 80 ? 'success' : value >= 60 ? 'normal' : 'exception'
                        })
                    }
                ]
            })),

            // 内容质量分析
            React.createElement(Card, {
                key: 'content-analysis',
                title: '📈 内容质量分析',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, { gutter: [16, 16] }, [
                React.createElement(Col, { span: 12 }, [
                    React.createElement('h4', {
                        key: 'title',
                        style: { marginBottom: '16px' }
                    }, '内容类型分布'),
                    React.createElement(Row, { key: 'content-types', gutter: 8 }, [
                        React.createElement(Col, { span: 8 },
                            React.createElement(Card, { size: 'small', style: { textAlign: 'center' } }, [
                                React.createElement('div', {
                                    key: 'count',
                                    style: { fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }
                                }, moduleData.contentAnalysis?.imageContent?.count),
                                React.createElement('div', {
                                    key: 'type',
                                    style: { fontSize: '12px', color: '#666' }
                                }, '图文内容'),
                                React.createElement('div', {
                                    key: 'percent',
                                    style: { fontSize: '12px', color: '#999' }
                                }, `${moduleData.contentAnalysis?.imageContent?.percentage}%`)
                            ])
                        ),
                        React.createElement(Col, { span: 8 },
                            React.createElement(Card, { size: 'small', style: { textAlign: 'center' } }, [
                                React.createElement('div', {
                                    key: 'count',
                                    style: { fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }
                                }, moduleData.contentAnalysis?.videoContent?.count),
                                React.createElement('div', {
                                    key: 'type',
                                    style: { fontSize: '12px', color: '#666' }
                                }, '视频内容'),
                                React.createElement('div', {
                                    key: 'percent',
                                    style: { fontSize: '12px', color: '#999' }
                                }, `${moduleData.contentAnalysis?.videoContent?.percentage}%`)
                            ])
                        ),
                        React.createElement(Col, { span: 8 },
                            React.createElement(Card, { size: 'small', style: { textAlign: 'center' } }, [
                                React.createElement('div', {
                                    key: 'count',
                                    style: { fontSize: '18px', fontWeight: 'bold', color: '#fa8c16' }
                                }, moduleData.contentAnalysis?.textContent?.count),
                                React.createElement('div', {
                                    key: 'type',
                                    style: { fontSize: '12px', color: '#666' }
                                }, '纯文本'),
                                React.createElement('div', {
                                    key: 'percent',
                                    style: { fontSize: '12px', color: '#999' }
                                }, `${moduleData.contentAnalysis?.textContent?.percentage}%`)
                            ])
                        )
                    ])
                ]),
                React.createElement(Col, { span: 12 }, [
                    React.createElement('h4', {
                        key: 'title',
                        style: { marginBottom: '16px' }
                    }, '内容质量分布'),
                    React.createElement(Row, { key: 'quality-dist', gutter: 8 }, [
                        React.createElement(Col, { span: 8 },
                            React.createElement(Card, { size: 'small', style: { textAlign: 'center' } }, [
                                React.createElement('div', {
                                    key: 'count',
                                    style: { fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }
                                }, moduleData.contentAnalysis?.qualityDistribution?.high?.count),
                                React.createElement('div', {
                                    key: 'type',
                                    style: { fontSize: '12px', color: '#666' }
                                }, '高质量'),
                                React.createElement('div', {
                                    key: 'percent',
                                    style: { fontSize: '12px', color: '#999' }
                                }, `${moduleData.contentAnalysis?.qualityDistribution?.high?.percentage}%`)
                            ])
                        ),
                        React.createElement(Col, { span: 8 },
                            React.createElement(Card, { size: 'small', style: { textAlign: 'center' } }, [
                                React.createElement('div', {
                                    key: 'count',
                                    style: { fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }
                                }, moduleData.contentAnalysis?.qualityDistribution?.medium?.count),
                                React.createElement('div', {
                                    key: 'type',
                                    style: { fontSize: '12px', color: '#666' }
                                }, '中等质量'),
                                React.createElement('div', {
                                    key: 'percent',
                                    style: { fontSize: '12px', color: '#999' }
                                }, `${moduleData.contentAnalysis?.qualityDistribution?.medium?.percentage}%`)
                            ])
                        ),
                        React.createElement(Col, { span: 8 },
                            React.createElement(Card, { size: 'small', style: { textAlign: 'center' } }, [
                                React.createElement('div', {
                                    key: 'count',
                                    style: { fontSize: '18px', fontWeight: 'bold', color: '#f5222d' }
                                }, moduleData.contentAnalysis?.qualityDistribution?.low?.count),
                                React.createElement('div', {
                                    key: 'type',
                                    style: { fontSize: '12px', color: '#666' }
                                }, '低质量'),
                                React.createElement('div', {
                                    key: 'percent',
                                    style: { fontSize: '12px', color: '#999' }
                                }, `${moduleData.contentAnalysis?.qualityDistribution?.low?.percentage}%`)
                            ])
                        )
                    ])
                ])
            ]))
        ]);
    };

    // Tab配置
    const tabItems = [
        {
            key: 'overview',
            label: '📊 核心指标',
            children: renderCoreMetrics()
        },
        {
            key: 'modules',
            label: '📋 分模块统计',
            children: renderModuleStats()
        }
    ];

    return React.createElement('div', { className: 'operational-stats-page' }, [
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
            title: '导出运营数据',
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
                    { value: '核心指标数据', label: '核心指标数据' },
                    { value: '内容板块数据', label: '内容板块数据' },
                    { value: '作品标签数据', label: '作品标签数据' },
                    { value: '内容质量数据', label: '内容质量数据' }
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

window.OperationalStats = OperationalStats; 