// 运营数据统计页面 - 基于新功能规范重构
const OperationalStats = () => {
    const { Row, Col, Card, Statistic, Button, Space, Select, DatePicker, Tabs, Table, Progress, Tag, Alert, Modal, Form, Tooltip, Badge, message } = antd;
    
    const [activeTab, setActiveTab] = React.useState('overview');
    const [coreData, setCoreData] = React.useState({});
    const [moduleData, setModuleData] = React.useState({});
    const [userAnalysis, setUserAnalysis] = React.useState({});
    const [behaviorData, setBehaviorData] = React.useState({});
    const [channelData, setChannelData] = React.useState({});
    const [featureData, setFeatureData] = React.useState({});
    const [errorData, setErrorData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [dateRange, setDateRange] = React.useState(null);
    const [exportModalVisible, setExportModalVisible] = React.useState(false);
    const [exportType, setExportType] = React.useState('excel');
    const [exportLoading, setExportLoading] = React.useState(false);

    // 添加图表相关状态
    const [chartData, setChartData] = React.useState({
        userTrend: [],
        behaviorTrend: [],
        channelTrend: [],
        errorTrend: []
    });
    const [form] = Form.useForm();

    React.useEffect(() => {
        loadOperationalData();
        loadTrendData(); // 加载趋势数据
    }, []);

    const loadOperationalData = () => {
        setLoading(true);
        Promise.all([
            loadUserAnalysis(),
            loadBehaviorData(),
            loadChannelData(),
            loadFeatureData(),
            loadErrorData()
        ]).then(() => {
            setLoading(false);
        });
    };

    // 加载用户分析数据
    const loadUserAnalysis = async () => {
        // 模拟API调用
        const mockData = {
            totalUsers: 156789,
            activeUsers: {
                daily: 45623,
                weekly: 78932,
                monthly: 89234
            },
            newUsers: {
                today: 1234,
                weekly: 8765,
                monthly: 34567,
                growth: '+12.3%'
            },
            uninstallUsers: {
                today: 234,
                weekly: 1543,
                monthly: 6789,
                rate: '1.2%'
            },
            userPortrait: {
                regions: [
                    { name: '北京', value: 25 },
                    { name: '上海', value: 20 },
                    { name: '广州', value: 15 },
                    { name: '深圳', value: 12 },
                    { name: '其他', value: 28 }
                ],
                gender: [
                    { name: '男', value: 65 },
                    { name: '女', value: 35 }
                ],
                age: [
                    { range: '18-24', value: 15 },
                    { range: '25-34', value: 35 },
                    { range: '35-44', value: 30 },
                    { range: '45+', value: 20 }
                ]
            }
        };
        setUserAnalysis(mockData);
    };

    // 加载用户行为数据
    const loadBehaviorData = async () => {
        // 模拟API调用
        const mockData = {
            appLaunches: {
                today: 78945,
                avgPerUser: 3.2,
                trend: '+5.6%'
            },
            usageTime: {
                avgDaily: 25.5, // 分钟
                peakHours: ['10:00', '15:00', '20:00'],
                distribution: [
                    { range: '0-5分钟', percentage: 20 },
                    { range: '5-15分钟', percentage: 35 },
                    { range: '15-30分钟', percentage: 25 },
                    { range: '30分钟以上', percentage: 20 }
                ]
            },
            pageViews: {
                total: 345678,
                avgPerUser: 12.5,
                topPages: [
                    { name: '首页', views: 89234 },
                    { name: '视频列表', views: 67890 },
                    { name: '个人中心', views: 45678 }
                ]
            }
        };
        setBehaviorData(mockData);
    };

    // 加载渠道分析数据
    const loadChannelData = async () => {
        // 模拟API调用
        const mockData = {
            sources: [
                { name: '自然搜索', users: 34567, conversion: 0.156 },
                { name: '应用商店', users: 23456, conversion: 0.123 },
                { name: '社交分享', users: 12345, conversion: 0.098 },
                { name: '广告推广', users: 8901, conversion: 0.078 }
            ],
            trends: {
                dates: ['01-01', '01-02', '01-03', '01-04', '01-05'],
                organic: [1200, 1300, 1250, 1400, 1350],
                paid: [800, 850, 900, 850, 900]
            }
        };
        setChannelData(mockData);
    };

    // 加载功能使用数据
    const loadFeatureData = async () => {
        // 模拟API调用
        const mockData = {
            coreFeatures: [
                { name: '视频播放', usage: 0.856, avgTime: 15.5 },
                { name: '评论互动', usage: 0.456, avgTime: 5.2 },
                { name: '内容发布', usage: 0.234, avgTime: 8.7 }
            ],
            pageStayTime: {
                average: 4.5, // 分钟
                byPage: [
                    { page: '首页', time: 5.6 },
                    { page: '视频详情', time: 8.2 },
                    { page: '个人中心', time: 3.4 }
                ]
            }
        };
        setFeatureData(mockData);
    };

    // 加载异常情况数据
    const loadErrorData = async () => {
        // 模拟API调用
        const mockData = {
            crashes: {
                rate: 0.012,
                total: 234,
                trend: '-15.6%',
                distribution: [
                    { type: 'APP崩溃', count: 156 },
                    { type: '网络错误', count: 45 },
                    { type: '接口超时', count: 33 }
                ]
            },
            performance: {
                avgLoadTime: 2.3, // 秒
                byModule: [
                    { module: '首页加载', time: 1.8 },
                    { module: '视频播放', time: 2.5 },
                    { module: '图片加载', time: 1.2 }
                ]
            }
        };
        setErrorData(mockData);
    };

    // 加载趋势数据
    const loadTrendData = async () => {
        // 模拟API调用
        const mockData = {
            userTrend: {
                dates: ['2024-03-01', '2024-03-02', '2024-03-03', '2024-03-04', '2024-03-05'],
                totalUsers: [150000, 152000, 153500, 155000, 156789],
                activeUsers: [42000, 43500, 44200, 45000, 45623],
                newUsers: [1100, 1200, 1150, 1300, 1234]
            },
            behaviorTrend: {
                dates: ['2024-03-01', '2024-03-02', '2024-03-03', '2024-03-04', '2024-03-05'],
                launches: [75000, 76500, 77800, 78200, 78945],
                avgTime: [23.5, 24.2, 24.8, 25.1, 25.5],
                pageViews: [320000, 330000, 335000, 340000, 345678]
            },
            channelTrend: {
                dates: ['2024-03-01', '2024-03-02', '2024-03-03', '2024-03-04', '2024-03-05'],
                organic: [32000, 32800, 33500, 34000, 34567],
                paid: [22000, 22500, 23000, 23200, 23456]
            },
            errorTrend: {
                dates: ['2024-03-01', '2024-03-02', '2024-03-03', '2024-03-04', '2024-03-05'],
                crashRate: [0.015, 0.014, 0.013, 0.012, 0.012],
                avgLoadTime: [2.8, 2.6, 2.5, 2.4, 2.3]
            }
        };
        setChartData(mockData);
    };

    // 处理数据导出
    const handleExport = async (type) => {
        setExportLoading(true);
        try {
            // 模拟导出过程
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const exportData = {
                userAnalysis: {
                    totalUsers: userAnalysis.totalUsers,
                    activeUsers: userAnalysis.activeUsers,
                    newUsers: userAnalysis.newUsers,
                    uninstallUsers: userAnalysis.uninstallUsers,
                    userPortrait: userAnalysis.userPortrait
                },
                behaviorData: {
                    appLaunches: behaviorData.appLaunches,
                    usageTime: behaviorData.usageTime,
                    pageViews: behaviorData.pageViews
                },
                channelData: {
                    sources: channelData.sources,
                    trends: channelData.trends
                },
                featureData: {
                    coreFeatures: featureData.coreFeatures,
                    pageStayTime: featureData.pageStayTime
                },
                errorData: {
                    crashes: errorData.crashes,
                    performance: errorData.performance
                }
            };

            // 根据类型生成不同格式
            let fileName = '';
            let content = '';
            switch (type) {
                case 'excel':
                    fileName = '运营数据统计.xlsx';
                    content = '模拟Excel文件内容';
                    break;
                case 'csv':
                    fileName = '运营数据统计.csv';
                    content = '模拟CSV文件内容';
                    break;
                case 'json':
                    fileName = '运营数据统计.json';
                    content = JSON.stringify(exportData, null, 2);
                    break;
            }

            // 创建下载链接
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            message.success('数据导出成功！');
        } catch (error) {
            message.error('导出失败，请稍后重试');
        } finally {
            setExportLoading(false);
            setExportModalVisible(false);
        }
    };

    // 渲染用户分析面板
    const renderUserAnalysis = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '用户分析',
                description: '全面分析用户规模、活跃度和流失情况',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),
            
            // 用户规模指标
            React.createElement(Card, {
                key: 'user-scale',
                title: '用户规模',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, { gutter: [16, 16] }, [
                React.createElement(Col, { span: 6 },
                    React.createElement(Statistic, {
                        title: '总用户数',
                        value: userAnalysis.totalUsers,
                        valueStyle: { color: '#1890ff' }
                    })
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Statistic, {
                        title: '本月新增',
                        value: userAnalysis.newUsers?.monthly,
                        valueStyle: { color: '#52c41a' },
                        suffix: React.createElement(Tag, { color: 'green' }, userAnalysis.newUsers?.growth)
                    })
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Statistic, {
                        title: '本月注销',
                        value: userAnalysis.uninstallUsers?.monthly,
                        valueStyle: { color: '#ff4d4f' },
                        suffix: React.createElement(Tag, { color: 'red' }, userAnalysis.uninstallUsers?.rate)
                    })
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Statistic, {
                        title: '月活跃用户',
                        value: userAnalysis.activeUsers?.monthly,
                        valueStyle: { color: '#722ed1' }
                    })
                )
            ])),

            // 用户画像分析
            React.createElement(Card, {
                key: 'user-portrait',
                title: '用户画像分析',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, { gutter: [16, 16] }, [
                // 地域分布
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        title: '地域分布',
                        size: 'small'
                    }, userAnalysis.userPortrait?.regions.map(region => 
                        React.createElement('div', {
                            key: region.name,
                            style: { marginBottom: '8px' }
                        }, [
                            React.createElement('span', {
                                style: { marginRight: '8px' }
                            }, region.name),
                            React.createElement(Progress, {
                                percent: region.value,
                                size: 'small',
                                showInfo: true
                            })
                        ])
                    ))
                ),
                // 性别分布
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        title: '性别分布',
                        size: 'small'
                    }, userAnalysis.userPortrait?.gender.map(item => 
                        React.createElement('div', {
                            key: item.name,
                            style: { marginBottom: '8px' }
                        }, [
                            React.createElement('span', {
                                style: { marginRight: '8px' }
                            }, item.name),
                            React.createElement(Progress, {
                                percent: item.value,
                                size: 'small',
                                showInfo: true,
                                strokeColor: item.name === '男' ? '#1890ff' : '#f759ab'
                            })
                        ])
                    ))
                ),
                // 年龄分布
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        title: '年龄分布',
                        size: 'small'
                    }, userAnalysis.userPortrait?.age.map(item => 
                        React.createElement('div', {
                            key: item.range,
                            style: { marginBottom: '8px' }
                        }, [
                            React.createElement('span', {
                                style: { marginRight: '8px' }
                            }, item.range),
                            React.createElement(Progress, {
                                percent: item.value,
                                size: 'small',
                                showInfo: true,
                                strokeColor: '#722ed1'
                            })
                        ])
                    ))
                )
            ]))
        ]);
    };

    // 渲染用户行为分析面板
    const renderBehaviorAnalysis = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '用户行为分析',
                description: '分析用户使用习惯和行为特征',
                type: 'warning',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),
            
            // 基础行为指标
            React.createElement(Card, {
                key: 'basic-behavior',
                title: '基础行为指标',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, { gutter: [16, 16] }, [
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        size: 'small'
                    }, [
                        React.createElement(Statistic, {
                            title: '今日启动次数',
                            value: behaviorData.appLaunches?.today,
                            suffix: React.createElement(Tag, { color: 'blue' }, behaviorData.appLaunches?.trend)
                        }),
                        React.createElement('div', {
                            style: { marginTop: '8px', fontSize: '12px', color: '#666' }
                        }, `平均每用户 ${behaviorData.appLaunches?.avgPerUser} 次`)
                    ])
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        size: 'small'
                    }, [
                        React.createElement(Statistic, {
                            title: '平均使用时长',
                            value: behaviorData.usageTime?.avgDaily,
                            suffix: '分钟'
                        }),
                        React.createElement('div', {
                            style: { marginTop: '8px', fontSize: '12px', color: '#666' }
                        }, `高峰时段: ${behaviorData.usageTime?.peakHours?.join(', ')}`)
                    ])
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        size: 'small'
                    }, [
                        React.createElement(Statistic, {
                            title: '页面访问量',
                            value: behaviorData.pageViews?.total
                        }),
                        React.createElement('div', {
                            style: { marginTop: '8px', fontSize: '12px', color: '#666' }
                        }, `平均每用户 ${behaviorData.pageViews?.avgPerUser} 页`)
                    ])
                )
            ])),

            // 使用时长分布
            React.createElement(Card, {
                key: 'usage-distribution',
                title: '使用时长分布',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, { gutter: [16, 16] },
                behaviorData.usageTime?.distribution.map(item => 
                    React.createElement(Col, { span: 6, key: item.range },
                        React.createElement(Card, {
                            size: 'small',
                            style: { textAlign: 'center' }
                        }, [
                            React.createElement('div', {
                                style: { fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }
                            }, `${item.percentage}%`),
                            React.createElement('div', {
                                style: { fontSize: '12px', color: '#666' }
                            }, item.range)
                        ])
                    )
                )
            )),

            // 热门页面访问
            React.createElement(Card, {
                key: 'hot-pages',
                title: '热门页面访问',
                style: { marginBottom: '16px' }
            }, React.createElement(Table, {
                dataSource: behaviorData.pageViews?.topPages,
                pagination: false,
                columns: [
                    {
                        title: '页面名称',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: '访问量',
                        dataIndex: 'views',
                        key: 'views',
                        render: (text) => text.toLocaleString()
                    }
                ]
            }))
        ]);
    };

    // 渲染渠道分析面板
    const renderChannelAnalysis = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '渠道分析',
                description: '分析用户获取渠道和转化效果',
                type: 'success',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),
            
            // 渠道来源分析
            React.createElement(Card, {
                key: 'channel-sources',
                title: '渠道来源分析',
                style: { marginBottom: '16px' }
            }, React.createElement(Table, {
                dataSource: channelData.sources,
                pagination: false,
                columns: [
                    {
                        title: '渠道名称',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: '用户数',
                        dataIndex: 'users',
                        key: 'users',
                        render: (text) => text.toLocaleString()
                    },
                    {
                        title: '转化率',
                        dataIndex: 'conversion',
                        key: 'conversion',
                        render: (value) => React.createElement(Progress, {
                            percent: value * 100,
                            size: 'small',
                            format: (percent) => `${percent.toFixed(1)}%`
                        })
                    }
                ]
            }))
        ]);
    };

    // 渲染功能使用分析面板
    const renderFeatureAnalysis = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '功能使用分析',
                description: '分析核心功能的使用情况和用户停留时长',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),
            
            // 核心功能使用率
            React.createElement(Card, {
                key: 'core-features',
                title: '核心功能使用率',
                style: { marginBottom: '16px' }
            }, React.createElement(Table, {
                dataSource: featureData.coreFeatures,
                pagination: false,
                columns: [
                    {
                        title: '功能名称',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: '使用率',
                        dataIndex: 'usage',
                        key: 'usage',
                        render: (value) => React.createElement(Progress, {
                            percent: value * 100,
                            size: 'small',
                            format: (percent) => `${percent.toFixed(1)}%`
                        })
                    },
                    {
                        title: '平均使用时长',
                        dataIndex: 'avgTime',
                        key: 'avgTime',
                        render: (value) => `${value} 分钟`
                    }
                ]
            })),

            // 页面停留时长
            React.createElement(Card, {
                key: 'page-stay-time',
                title: '页面停留时长',
                style: { marginBottom: '16px' }
            }, [
                React.createElement(Statistic, {
                    key: 'avg-time',
                    title: '平均停留时长',
                    value: featureData.pageStayTime?.average,
                    suffix: '分钟',
                    style: { marginBottom: '16px' }
                }),
                React.createElement(Table, {
                    key: 'time-table',
                    dataSource: featureData.pageStayTime?.byPage,
                    pagination: false,
                    columns: [
                        {
                            title: '页面名称',
                            dataIndex: 'page',
                            key: 'page'
                        },
                        {
                            title: '停留时长',
                            dataIndex: 'time',
                            key: 'time',
                            render: (value) => `${value} 分钟`
                        }
                    ]
                })
            ])
        ]);
    };

    // 渲染异常情况分析面板
    const renderErrorAnalysis = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '异常情况分析',
                description: '监控应用崩溃率和性能表现',
                type: 'error',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),
            
            // 崩溃统计
            React.createElement(Card, {
                key: 'crash-stats',
                title: '崩溃统计',
                style: { marginBottom: '16px' }
            }, React.createElement(Row, { gutter: [16, 16] }, [
                React.createElement(Col, { span: 8 },
                    React.createElement(Statistic, {
                        title: '崩溃率',
                        value: errorData.crashes?.rate * 100,
                        precision: 2,
                        suffix: '%',
                        valueStyle: { color: '#ff4d4f' }
                    })
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Statistic, {
                        title: '崩溃总次数',
                        value: errorData.crashes?.total,
                        suffix: React.createElement(Tag, { color: 'green' }, errorData.crashes?.trend)
                    })
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Card, {
                        size: 'small',
                        title: '崩溃类型分布'
                    }, errorData.crashes?.distribution.map(item => 
                        React.createElement('div', {
                            key: item.type,
                            style: { marginBottom: '8px' }
                        }, [
                            React.createElement('span', {
                                style: { marginRight: '8px' }
                            }, item.type),
                            React.createElement('span', {
                                style: { color: '#ff4d4f' }
                            }, item.count)
                        ])
                    ))
                )
            ])),

            // 性能监控
            React.createElement(Card, {
                key: 'performance',
                title: '性能监控',
                style: { marginBottom: '16px' }
            }, [
                React.createElement(Statistic, {
                    key: 'avg-load',
                    title: '平均加载时间',
                    value: errorData.performance?.avgLoadTime,
                    suffix: '秒',
                    style: { marginBottom: '16px' }
                }),
                React.createElement(Table, {
                    key: 'performance-table',
                    dataSource: errorData.performance?.byModule,
                    pagination: false,
                    columns: [
                        {
                            title: '模块名称',
                            dataIndex: 'module',
                            key: 'module'
                        },
                        {
                            title: '加载时间',
                            dataIndex: 'time',
                            key: 'time',
                            render: (value) => `${value} 秒`
                        }
                    ]
                })
            ])
        ]);
    };

    // 渲染趋势图表
    const renderTrendChart = (data, config) => {
        if (!data || !data.dates) return null;

        return React.createElement(Card, {
            title: config.title,
            style: { marginBottom: '16px' }
        }, React.createElement('div', {
            style: { height: '300px' }
        }, React.createElement(Line, {
            data: {
                labels: data.dates,
                datasets: config.datasets.map(ds => ({
                    label: ds.label,
                    data: data[ds.key],
                    borderColor: ds.color,
                    tension: 0.1
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })));
    };

    // Tab配置
    const tabItems = [
        {
            key: 'user',
            label: '👥 用户分析',
            children: renderUserAnalysis()
        },
        {
            key: 'behavior',
            label: '📊 用户行为',
            children: renderBehaviorAnalysis()
        },
        {
            key: 'channel',
            label: '🔄 渠道分析',
            children: renderChannelAnalysis()
        },
        {
            key: 'feature',
            label: '⚡ 功能使用',
            children: renderFeatureAnalysis()
        },
        {
            key: 'error',
            label: '⚠️ 异常情况',
            children: renderErrorAnalysis()
        }
    ];

    // 添加导出模态框
    const renderExportModal = () => {
        return React.createElement(Modal, {
            title: '导出数据',
            open: exportModalVisible,
            onCancel: () => setExportModalVisible(false),
            footer: [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => setExportModalVisible(false)
                }, '取消'),
                React.createElement(Button, {
                    key: 'excel',
                    type: 'primary',
                    loading: exportLoading && exportType === 'excel',
                    onClick: () => handleExport('excel')
                }, '导出Excel'),
                React.createElement(Button, {
                    key: 'csv',
                    loading: exportLoading && exportType === 'csv',
                    onClick: () => handleExport('csv')
                }, '导出CSV'),
                React.createElement(Button, {
                    key: 'json',
                    loading: exportLoading && exportType === 'json',
                    onClick: () => handleExport('json')
                }, '导出JSON')
            ]
        }, [
            React.createElement(Alert, {
                message: '导出说明',
                description: '选择合适的格式导出数据，支持Excel、CSV和JSON格式。导出数据包含当前筛选条件下的所有统计数据。',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '16px' }
            }),
            React.createElement(Form, {
                layout: 'vertical'
            }, [
                React.createElement(Form.Item, {
                    label: '时间范围',
                    required: true
                }, React.createElement(DatePicker.RangePicker, {
                    style: { width: '100%' },
                    value: dateRange,
                    onChange: setDateRange
                }))
            ])
        ]);
    };

    return React.createElement('div', { className: 'operational-stats-page' }, [
        // 页面标题
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
            }, '运营数据统计'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(DatePicker.RangePicker, {
                    key: 'date-range',
                    value: dateRange,
                    onChange: setDateRange,
                    style: { width: 240 }
                }),
                React.createElement(Button, {
                    key: 'export',
                    onClick: () => setExportModalVisible(true)
                }, '导出数据'),
                React.createElement(Button, {
                    key: 'refresh',
                    type: 'primary',
                    onClick: loadOperationalData,
                    loading: loading
                }, '刷新数据')
            ])
        ]),

        // 主要内容Tab
        React.createElement(Tabs, {
            key: 'main-tabs',
            activeKey: activeTab,
            onChange: setActiveTab,
            items: tabItems,
            style: { padding: '0 24px' }
        }),

        // 导出模态框
        renderExportModal()
    ]);
};

// 确保组件被正确挂载到全局对象
(function(window) {
    if (window) {
        window.OperationalStats = OperationalStats;
        console.log('OperationalStats component registered to window object');
    }
})(window);
export default OperationalStats; 