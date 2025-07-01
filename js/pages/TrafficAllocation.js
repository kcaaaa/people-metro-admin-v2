// 平台流量分配配置页面 - 基于新功能规范
const TrafficAllocation = () => {
    const { Row, Col, Card, Button, Space, Alert, Slider, Switch, Form, Input, Select, message, Modal, Table, Tag, Tabs } = antd;
    const [form] = Form.useForm();
    const [weightSettings, setWeightSettings] = React.useState({});
    const [moduleSettings, setModuleSettings] = React.useState({});
    const [previewModalVisible, setPreviewModalVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        loadTrafficSettings();
    }, []);

    const loadTrafficSettings = () => {
        setLoading(true);
        setTimeout(() => {
            // 权重因子配置
            setWeightSettings({
                userBehavior: {
                    weight: 35,
                    enabled: true,
                    description: '基于用户历史行为偏好'
                },
                contentQuality: {
                    weight: 25,
                    enabled: true,
                    description: '内容质量评分系统'
                },
                timeliness: {
                    weight: 20,
                    enabled: true,
                    description: '内容发布时效性'
                },
                manualIntervention: {
                    weight: 15,
                    enabled: true,
                    description: '人工干预权重'
                },
                diversity: {
                    weight: 5,
                    enabled: true,
                    description: '内容多样性保证'
                }
            });

            // 分模块推荐规则
            setModuleSettings({
                homepage: {
                    name: '首页推荐',
                    algorithm: 'collaborative_filtering',
                    refreshRate: 30,
                    maxItems: 20,
                    filters: ['hot', 'personalized', 'latest'],
                    enabled: true
                },
                association: {
                    name: '协会页',
                    algorithm: 'content_based',
                    refreshRate: 60,
                    maxItems: 15,
                    filters: ['association_verified', 'industry_related'],
                    enabled: true
                },
                exhibition: {
                    name: '展会专区',
                    algorithm: 'hybrid',
                    refreshRate: 15,
                    maxItems: 25,
                    filters: ['exhibition_featured', 'location_based'],
                    enabled: true
                },
                search: {
                    name: '搜索结果',
                    algorithm: 'relevance_score',
                    refreshRate: 0,
                    maxItems: 50,
                    filters: ['keyword_match', 'popularity'],
                    enabled: true
                }
            });

            setLoading(false);
        }, 800);
    };

    // 渲染权重因子调整
    const renderWeightFactors = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '推荐算法权重配置',
                description: '调整不同推荐因子的权重，影响平台内容的流量分发。权重总和建议为100%',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Form, {
                key: 'weight-form',
                form: form,
                layout: 'vertical',
                initialValues: weightSettings
            }, [
                Object.keys(weightSettings).map(key => {
                    const setting = weightSettings[key];
                    return React.createElement(Card, {
                        key: key,
                        size: 'small',
                        style: { marginBottom: '16px' }
                    }, React.createElement(Row, { gutter: 16, align: 'middle' }, [
                        React.createElement(Col, { span: 4 },
                            React.createElement('div', {
                                style: { fontWeight: 'bold', color: '#1890ff' }
                            }, getFactorDisplayName(key))
                        ),
                        React.createElement(Col, { span: 2 },
                            React.createElement(Form.Item, {
                                name: [key, 'enabled'],
                                valuePropName: 'checked',
                                style: { margin: 0 }
                            }, React.createElement(Switch, {
                                size: 'small'
                            }))
                        ),
                        React.createElement(Col, { span: 10 },
                            React.createElement(Form.Item, {
                                name: [key, 'weight'],
                                style: { margin: 0 }
                            }, React.createElement(Slider, {
                                min: 0,
                                max: 100,
                                marks: { 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' },
                                tooltip: { formatter: value => `${value}%` }
                            }))
                        ),
                        React.createElement(Col, { span: 6 },
                            React.createElement('span', {
                                style: { fontSize: '12px', color: '#666' }
                            }, setting.description)
                        ),
                        React.createElement(Col, { span: 2 },
                            React.createElement('div', {
                                style: { 
                                    fontSize: '16px', 
                                    fontWeight: 'bold',
                                    color: '#1890ff',
                                    textAlign: 'center'
                                }
                            }, `${setting.weight}%`)
                        )
                    ]));
                })
            ]),

            React.createElement('div', {
                key: 'summary',
                style: { 
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px'
                }
            }, [
                React.createElement('div', {
                    key: 'total',
                    style: { 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }
                }, [
                    React.createElement('span', {
                        key: 'label',
                        style: { fontWeight: 'bold' }
                    }, '权重总计:'),
                    React.createElement('span', {
                        key: 'value',
                        style: { 
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: getTotalWeight() === 100 ? '#52c41a' : '#f5222d'
                        }
                    }, `${getTotalWeight()}%`)
                ]),
                getTotalWeight() !== 100 && React.createElement('div', {
                    key: 'warning',
                    style: { 
                        marginTop: '8px',
                        color: '#f5222d',
                        fontSize: '12px'
                    }
                }, '⚠️ 建议权重总和为100%以获得最佳推荐效果')
            ])
        ]);
    };

    // 渲染分模块推荐规则
    const renderModuleRules = () => {
        const columns = [
            {
                title: '模块名称',
                dataIndex: 'name',
                width: 120,
                render: (text, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'name',
                        style: { fontWeight: 'bold', color: '#1890ff' }
                    }, text),
                    React.createElement('div', {
                        key: 'status',
                        style: { fontSize: '12px' }
                    }, React.createElement(Tag, {
                        color: record.enabled ? 'green' : 'red',
                        size: 'small'
                    }, record.enabled ? '已启用' : '已禁用'))
                ])
            },
            {
                title: '推荐算法',
                dataIndex: 'algorithm',
                width: 150,
                render: (algorithm) => React.createElement(Tag, {
                    color: 'blue'
                }, getAlgorithmDisplayName(algorithm))
            },
            {
                title: '刷新频率',
                dataIndex: 'refreshRate',
                width: 100,
                render: (rate) => rate === 0 ? '实时' : `${rate}分钟`
            },
            {
                title: '最大推荐数',
                dataIndex: 'maxItems',
                width: 100
            },
            {
                title: '过滤条件',
                dataIndex: 'filters',
                width: 200,
                render: (filters) => React.createElement('div', {},
                    filters.map((filter, index) => 
                        React.createElement(Tag, {
                            key: index,
                            size: 'small',
                            style: { marginBottom: '2px' }
                        }, getFilterDisplayName(filter))
                    )
                )
            },
            {
                title: '操作',
                width: 120,
                render: (_, record, index) => React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        onClick: () => editModuleRule(Object.keys(moduleSettings)[index])
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'test',
                        size: 'small',
                        type: 'link',
                        onClick: () => testModule(Object.keys(moduleSettings)[index])
                    }, '测试')
                ])
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '分模块推荐规则配置',
                description: '为APP内的不同模块配置独立的推荐逻辑，支持个性化推荐策略',
                type: 'success',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Card, {
                key: 'module-table',
                title: '模块推荐配置',
                extra: React.createElement(Button, {
                    type: 'primary',
                    size: 'small',
                    onClick: () => message.info('批量配置功能开发中...')
                }, '批量配置')
            }, React.createElement(Table, {
                dataSource: Object.keys(moduleSettings).map(key => ({
                    key,
                    ...moduleSettings[key]
                })),
                columns: columns,
                pagination: false,
                size: 'small'
            }))
        ]);
    };

    // 工具函数
    const getFactorDisplayName = (key) => {
        const names = {
            userBehavior: '用户行为',
            contentQuality: '作品质量分',
            timeliness: '时效性',
            manualIntervention: '人工干预',
            diversity: '内容多样性'
        };
        return names[key] || key;
    };

    const getAlgorithmDisplayName = (algorithm) => {
        const names = {
            collaborative_filtering: '协同过滤',
            content_based: '基于内容',
            hybrid: '混合算法',
            relevance_score: '相关性评分'
        };
        return names[algorithm] || algorithm;
    };

    const getFilterDisplayName = (filter) => {
        const names = {
            hot: '热门',
            personalized: '个性化',
            latest: '最新',
            association_verified: '协会认证',
            industry_related: '行业相关',
            exhibition_featured: '展会精选',
            location_based: '地域相关',
            keyword_match: '关键词匹配',
            popularity: '热度排序'
        };
        return names[filter] || filter;
    };

    const getTotalWeight = () => {
        return Object.keys(weightSettings).reduce((total, key) => {
            return total + (weightSettings[key]?.weight || 0);
        }, 0);
    };

    const editModuleRule = (moduleKey) => {
        message.info(`编辑 ${moduleSettings[moduleKey]?.name} 规则...`);
    };

    const testModule = (moduleKey) => {
        message.loading(`测试 ${moduleSettings[moduleKey]?.name} 推荐效果...`, 2);
    };

    const saveSettings = () => {
        if (getTotalWeight() !== 100) {
            message.warning('权重总和不为100%，可能影响推荐效果，确定要保存吗？');
            return;
        }
        
        message.loading('保存配置中...', 1).then(() => {
            message.success('流量分配配置已保存！');
        });
    };

    const previewEffect = () => {
        setPreviewModalVisible(true);
    };

    const resetToDefault = () => {
        Modal.confirm({
            title: '重置为默认配置',
            content: '确定要重置为系统默认的推荐配置吗？此操作不可撤销。',
            onOk: () => {
                loadTrafficSettings();
                message.success('已重置为默认配置');
            }
        });
    };

    const tabItems = [
        {
            key: 'weights',
            label: '⚖️ 权重配置',
            children: renderWeightFactors()
        },
        {
            key: 'modules',
            label: '📱 模块规则',
            children: renderModuleRules()
        }
    ];

    return React.createElement('div', { className: 'traffic-allocation-page' }, [
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
            }, '平台流量分配配置'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'reset',
                    onClick: resetToDefault
                }, '重置默认'),
                React.createElement(Button, {
                    key: 'preview',
                    onClick: previewEffect
                }, '预览效果'),
                React.createElement(Button, {
                    key: 'save',
                    type: 'primary',
                    onClick: saveSettings
                }, '保存配置')
            ])
        ]),

        React.createElement(Tabs, {
            key: 'main-tabs',
            items: tabItems,
            defaultActiveKey: 'weights'
        }),

        // 预览效果模态框
        React.createElement(Modal, {
            key: 'preview-modal',
            title: '推荐效果预览',
            open: previewModalVisible,
            onCancel: () => setPreviewModalVisible(false),
            footer: null,
            width: 800
        }, React.createElement('div', {
            style: { textAlign: 'center', padding: '40px' }
        }, [
            React.createElement('div', {
                key: 'icon',
                style: { fontSize: '64px', marginBottom: '16px' }
            }, '📊'),
            React.createElement('div', {
                key: 'text',
                style: { fontSize: '16px', color: '#666' }
            }, '推荐效果预览功能开发中...')
        ]))
    ]);
};

window.TrafficAllocation = TrafficAllocation; 