// 系统与资源管理页面 - 基于新功能规范重构
const DataManagement = () => {
    const { Row, Col, Card, Progress, Button, Space, Alert, Tag, Statistic, Badge, Table, Tabs, message, Modal, Form, Select, Input } = antd;
    const [resourceStats, setResourceStats] = React.useState({});
    const [alertSettings, setAlertSettings] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [alertModalVisible, setAlertModalVisible] = React.useState(false);
    const [form] = Form.useForm();

    React.useEffect(() => {
        loadResourceData();
        // 每30秒刷新一次资源监控数据
        const interval = setInterval(loadResourceData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadResourceData = () => {
        setLoading(true);
        setTimeout(() => {
            setResourceStats({
                realTimeResources: {
                    cpu: { usage: 68.5, threshold: 80 },
                    memory: { usage: 72.3, threshold: 85 },
                    storage: { usage: 45.8, threshold: 90 },
                    bandwidth: { usage: 34.2, threshold: 75 }
                },
                consumption: {
                    daily: {
                        cpu: { value: 65.2, unit: '%' },
                        memory: { value: 78.4, unit: 'GB' },
                        storage: { value: 234.5, unit: 'GB' },
                        bandwidth: { value: 456.7, unit: 'GB' }
                    },
                    weekly: {
                        cpu: { value: 68.7, unit: '%' },
                        memory: { value: 82.1, unit: 'GB' },
                        storage: { value: 1.2, unit: 'TB' },
                        bandwidth: { value: 2.8, unit: 'TB' }
                    },
                    monthly: {
                        cpu: { value: 71.3, unit: '%' },
                        memory: { value: 324.6, unit: 'GB' },
                        storage: { value: 4.8, unit: 'TB' },
                        bandwidth: { value: 12.4, unit: 'TB' }
                    }
                },
                apiMonitoring: {
                    totalCalls: 1256489,
                    successRate: 98.7,
                    avgResponseTime: 245,
                    errorRate: 1.3,
                    topAPIs: [
                        { name: '内容审核API', calls: 345678, success: 99.2, avgTime: 123 },
                        { name: '用户认证API', calls: 234567, success: 98.9, avgTime: 89 },
                        { name: '视频处理API', calls: 189234, success: 97.5, avgTime: 456 },
                        { name: '图片分析API', calls: 156789, success: 99.1, avgTime: 234 },
                        { name: '推送服务API', calls: 123456, success: 98.6, avgTime: 167 }
                    ]
                }
            });

            setAlertSettings({
                cpu: { enabled: true, threshold: 80 },
                memory: { enabled: true, threshold: 85 },
                storage: { enabled: true, threshold: 90 },
                bandwidth: { enabled: true, threshold: 75 },
                api_error: { enabled: true, threshold: 5 }
            });

            setLoading(false);
        }, 800);
    };

    // 渲染实时资源监控
    const renderRealTimeMonitoring = () => {
        const { realTimeResources } = resourceStats;
        
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '实时资源使用监控',
                description: '实时查看服务器集群的资源使用率，数据每30秒自动更新',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Row, { key: 'metrics', gutter: [16, 16] }, [
                React.createElement(Col, { key: 'cpu', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'resource-card' }, [
                        React.createElement('div', {
                            key: 'header',
                            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
                        }, [
                            React.createElement('span', {
                                key: 'title',
                                style: { fontWeight: 'bold', color: '#1890ff' }
                            }, 'CPU使用率'),
                            React.createElement(Badge, {
                                key: 'status',
                                status: realTimeResources?.cpu?.usage > realTimeResources?.cpu?.threshold ? 'error' : 'success',
                                text: realTimeResources?.cpu?.usage > realTimeResources?.cpu?.threshold ? '告警' : '正常'
                            })
                        ]),
                        React.createElement(Progress, {
                            key: 'progress',
                            type: 'circle',
                            percent: realTimeResources?.cpu?.usage || 0,
                            size: 80,
                            status: realTimeResources?.cpu?.usage > realTimeResources?.cpu?.threshold ? 'exception' : 'normal'
                        }),
                        React.createElement('div', {
                            key: 'detail',
                            style: { textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#666' }
                        }, `阈值: ${realTimeResources?.cpu?.threshold}%`)
                    ])
                ),
                React.createElement(Col, { key: 'memory', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'resource-card' }, [
                        React.createElement('div', {
                            key: 'header',
                            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
                        }, [
                            React.createElement('span', {
                                key: 'title',
                                style: { fontWeight: 'bold', color: '#52c41a' }
                            }, '内存使用率'),
                            React.createElement(Badge, {
                                key: 'status',
                                status: realTimeResources?.memory?.usage > realTimeResources?.memory?.threshold ? 'error' : 'success',
                                text: realTimeResources?.memory?.usage > realTimeResources?.memory?.threshold ? '告警' : '正常'
                            })
                        ]),
                        React.createElement(Progress, {
                            key: 'progress',
                            type: 'circle',
                            percent: realTimeResources?.memory?.usage || 0,
                            size: 80,
                            status: realTimeResources?.memory?.usage > realTimeResources?.memory?.threshold ? 'exception' : 'normal'
                        }),
                        React.createElement('div', {
                            key: 'detail',
                            style: { textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#666' }
                        }, `阈值: ${realTimeResources?.memory?.threshold}%`)
                    ])
                ),
                React.createElement(Col, { key: 'storage', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'resource-card' }, [
                        React.createElement('div', {
                            key: 'header',
                            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
                        }, [
                            React.createElement('span', {
                                key: 'title',
                                style: { fontWeight: 'bold', color: '#fa8c16' }
                            }, '存储空间占用'),
                            React.createElement(Badge, {
                                key: 'status',
                                status: realTimeResources?.storage?.usage > realTimeResources?.storage?.threshold ? 'error' : 'success',
                                text: realTimeResources?.storage?.usage > realTimeResources?.storage?.threshold ? '告警' : '正常'
                            })
                        ]),
                        React.createElement(Progress, {
                            key: 'progress',
                            type: 'circle',
                            percent: realTimeResources?.storage?.usage || 0,
                            size: 80,
                            status: realTimeResources?.storage?.usage > realTimeResources?.storage?.threshold ? 'exception' : 'normal'
                        }),
                        React.createElement('div', {
                            key: 'detail',
                            style: { textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#666' }
                        }, `阈值: ${realTimeResources?.storage?.threshold}%`)
                    ])
                ),
                React.createElement(Col, { key: 'bandwidth', xs: 24, sm: 12, md: 6 },
                    React.createElement(Card, { size: 'small', className: 'resource-card' }, [
                        React.createElement('div', {
                            key: 'header',
                            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
                        }, [
                            React.createElement('span', {
                                key: 'title',
                                style: { fontWeight: 'bold', color: '#f5222d' }
                            }, '网络带宽'),
                            React.createElement(Badge, {
                                key: 'status',
                                status: realTimeResources?.bandwidth?.usage > realTimeResources?.bandwidth?.threshold ? 'error' : 'success',
                                text: realTimeResources?.bandwidth?.usage > realTimeResources?.bandwidth?.threshold ? '告警' : '正常'
                            })
                        ]),
                        React.createElement(Progress, {
                            key: 'progress',
                            type: 'circle',
                            percent: realTimeResources?.bandwidth?.usage || 0,
                            size: 80,
                            status: realTimeResources?.bandwidth?.usage > realTimeResources?.bandwidth?.threshold ? 'exception' : 'normal'
                        }),
                        React.createElement('div', {
                            key: 'detail',
                            style: { textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#666' }
                        }, `阈值: ${realTimeResources?.bandwidth?.threshold}%`)
                    ])
                )
            ])
        ]);
    };

    // 渲染资源消耗统计
    const renderResourceConsumption = () => {
        const { consumption } = resourceStats;

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '资源消耗统计',
                description: '按天、周、月维度汇总核心资源的消耗数据',
                type: 'success',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Row, { key: 'periods', gutter: [16, 16] }, [
                React.createElement(Col, { key: 'daily', span: 8 },
                    React.createElement(Card, {
                        title: '📊 日消耗统计',
                        size: 'small'
                    }, React.createElement('div', {}, [
                        React.createElement(Row, { key: 'stats', gutter: 8 }, [
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: 'CPU平均',
                                    value: consumption?.daily?.cpu?.value,
                                    suffix: consumption?.daily?.cpu?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            ),
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '内存',
                                    value: consumption?.daily?.memory?.value,
                                    suffix: consumption?.daily?.memory?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            )
                        ]),
                        React.createElement(Row, { key: 'stats2', gutter: 8, style: { marginTop: '12px' } }, [
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '存储',
                                    value: consumption?.daily?.storage?.value,
                                    suffix: consumption?.daily?.storage?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            ),
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '带宽',
                                    value: consumption?.daily?.bandwidth?.value,
                                    suffix: consumption?.daily?.bandwidth?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            )
                        ])
                    ]))
                ),
                React.createElement(Col, { key: 'weekly', span: 8 },
                    React.createElement(Card, {
                        title: '📈 周消耗统计',
                        size: 'small'
                    }, React.createElement('div', {}, [
                        React.createElement(Row, { key: 'stats', gutter: 8 }, [
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: 'CPU平均',
                                    value: consumption?.weekly?.cpu?.value,
                                    suffix: consumption?.weekly?.cpu?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            ),
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '内存',
                                    value: consumption?.weekly?.memory?.value,
                                    suffix: consumption?.weekly?.memory?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            )
                        ]),
                        React.createElement(Row, { key: 'stats2', gutter: 8, style: { marginTop: '12px' } }, [
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '存储',
                                    value: consumption?.weekly?.storage?.value,
                                    suffix: consumption?.weekly?.storage?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            ),
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '带宽',
                                    value: consumption?.weekly?.bandwidth?.value,
                                    suffix: consumption?.weekly?.bandwidth?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            )
                        ])
                    ]))
                ),
                React.createElement(Col, { key: 'monthly', span: 8 },
                    React.createElement(Card, {
                        title: '📅 月消耗统计',
                        size: 'small'
                    }, React.createElement('div', {}, [
                        React.createElement(Row, { key: 'stats', gutter: 8 }, [
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: 'CPU平均',
                                    value: consumption?.monthly?.cpu?.value,
                                    suffix: consumption?.monthly?.cpu?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            ),
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '内存',
                                    value: consumption?.monthly?.memory?.value,
                                    suffix: consumption?.monthly?.memory?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            )
                        ]),
                        React.createElement(Row, { key: 'stats2', gutter: 8, style: { marginTop: '12px' } }, [
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '存储',
                                    value: consumption?.monthly?.storage?.value,
                                    suffix: consumption?.monthly?.storage?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            ),
                            React.createElement(Col, { span: 12 },
                                React.createElement(Statistic, {
                                    title: '带宽',
                                    value: consumption?.monthly?.bandwidth?.value,
                                    suffix: consumption?.monthly?.bandwidth?.unit,
                                    valueStyle: { fontSize: '14px' }
                                })
                            )
                        ])
                    ]))
                )
            ])
        ]);
    };

    // 渲染API调用监控
    const renderAPIMonitoring = () => {
        const { apiMonitoring } = resourceStats;

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: 'API调用监控',
                description: '监控所有第三方API调用，统计调用量、成功率、平均耗时',
                type: 'warning',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Row, { key: 'overview', gutter: [16, 16], style: { marginBottom: '16px' } }, [
                React.createElement(Col, { span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '总调用量',
                            value: apiMonitoring?.totalCalls,
                            precision: 0,
                            valueStyle: { color: '#1890ff' }
                        })
                    )
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '成功率',
                            value: apiMonitoring?.successRate,
                            suffix: '%',
                            valueStyle: { color: '#52c41a' }
                        })
                    )
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '平均耗时',
                            value: apiMonitoring?.avgResponseTime,
                            suffix: 'ms',
                            valueStyle: { color: '#fa8c16' }
                        })
                    )
                ),
                React.createElement(Col, { span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '错误率',
                            value: apiMonitoring?.errorRate,
                            suffix: '%',
                            valueStyle: { color: apiMonitoring?.errorRate > 5 ? '#f5222d' : '#52c41a' }
                        })
                    )
                )
            ]),

            React.createElement(Card, {
                key: 'api-table',
                title: 'API调用详情',
                size: 'small'
            }, React.createElement(Table, {
                dataSource: apiMonitoring?.topAPIs?.map((item, index) => ({ ...item, key: index })) || [],
                pagination: false,
                size: 'small',
                columns: [
                    {
                        title: 'API名称',
                        dataIndex: 'name',
                        width: 200,
                        render: (text) => React.createElement('span', {
                            style: { fontWeight: 'bold', color: '#1890ff' }
                        }, text)
                    },
                    {
                        title: '调用量',
                        dataIndex: 'calls',
                        width: 120,
                        render: (value) => value?.toLocaleString()
                    },
                    {
                        title: '成功率',
                        dataIndex: 'success',
                        width: 100,
                        render: (value) => React.createElement(Tag, {
                            color: value >= 99 ? 'green' : value >= 95 ? 'orange' : 'red'
                        }, `${value}%`)
                    },
                    {
                        title: '平均耗时',
                        dataIndex: 'avgTime',
                        width: 100,
                        render: (value) => `${value}ms`
                    },
        {
            title: '状态',
            width: 100,
                        render: (_, record) => React.createElement(Badge, {
                            status: record.success >= 99 ? 'success' : record.success >= 95 ? 'warning' : 'error',
                            text: record.success >= 99 ? '正常' : record.success >= 95 ? '警告' : '异常'
                        })
                    }
                ]
            }))
        ]);
    };

    // 资源预警设置
    const handleAlertSetting = () => {
        setAlertModalVisible(true);
        form.setFieldsValue(alertSettings);
    };

    const handleAlertSubmit = () => {
        form.validateFields().then(values => {
            setAlertSettings(values);
            message.success('预警设置已保存');
            setAlertModalVisible(false);
        });
    };

    const tabItems = [
        {
            key: 'realtime',
            label: '⚡ 实时监控',
            children: renderRealTimeMonitoring()
        },
        {
            key: 'consumption',
            label: '📊 消耗统计',
            children: renderResourceConsumption()
        },
        {
            key: 'api',
            label: '🔗 API监控',
            children: renderAPIMonitoring()
        }
    ];

    return React.createElement('div', { className: 'system-resource-page' }, [
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
            }, '系统与资源管理'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'alert',
                    onClick: handleAlertSetting
                }, '预警设置'),
                React.createElement(Button, {
                    key: 'refresh',
                    type: 'primary',
                    onClick: loadResourceData
                }, '刷新数据')
            ])
        ]),

        React.createElement(Tabs, {
            key: 'main-tabs',
            items: tabItems,
            defaultActiveKey: 'realtime'
        }),

        // 预警设置模态框
        React.createElement(Modal, {
            key: 'alert-modal',
            title: '资源预警设置',
            open: alertModalVisible,
            onCancel: () => setAlertModalVisible(false),
            onOk: handleAlertSubmit,
            width: 600
        }, React.createElement(Form, {
            form: form,
            layout: 'vertical'
        }, [
            React.createElement(Form.Item, {
                key: 'cpu-enabled',
                name: ['cpu', 'enabled'],
                label: 'CPU使用率预警',
                valuePropName: 'checked'
            }, React.createElement(antd.Switch)),
            React.createElement(Form.Item, {
                key: 'cpu-threshold',
                name: ['cpu', 'threshold'],
                label: 'CPU预警阈值(%)'
            }, React.createElement(Input, { type: 'number', min: 0, max: 100 })),
            React.createElement(Form.Item, {
                key: 'memory-enabled',
                name: ['memory', 'enabled'],
                label: '内存使用率预警',
                valuePropName: 'checked'
            }, React.createElement(antd.Switch)),
            React.createElement(Form.Item, {
                key: 'memory-threshold',
                name: ['memory', 'threshold'],
                label: '内存预警阈值(%)'
            }, React.createElement(Input, { type: 'number', min: 0, max: 100 })),
            React.createElement(Form.Item, {
                key: 'storage-enabled',
                name: ['storage', 'enabled'],
                label: '存储空间预警',
                valuePropName: 'checked'
            }, React.createElement(antd.Switch)),
            React.createElement(Form.Item, {
                key: 'storage-threshold',
                name: ['storage', 'threshold'],
                label: '存储预警阈值(%)'
            }, React.createElement(Input, { type: 'number', min: 0, max: 100 }))
        ]))
    ]);
};

window.DataManagement = DataManagement; 