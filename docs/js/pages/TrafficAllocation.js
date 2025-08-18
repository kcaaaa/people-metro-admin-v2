// 平台流量分配配置页面 - 简化版本
const TrafficAllocation = () => {
    const { Row, Col, Card, Button, Space, Alert, Slider, Switch, Form, Input, Select, message, Modal, Table, Tag, Tabs, DatePicker } = antd;
    const [form] = Form.useForm();
    const [userSearchForm] = Form.useForm();
    const [weightSettings, setWeightSettings] = React.useState({});
    const [moduleSettings, setModuleSettings] = React.useState({});
    const [userTypeWeights, setUserTypeWeights] = React.useState({});
    const [searchResults, setSearchResults] = React.useState([]);
    const [userContents, setUserContents] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [weightAdjustModalVisible, setWeightAdjustModalVisible] = React.useState(false);
    const [contentWeightModalVisible, setContentWeightModalVisible] = React.useState(false);
    const [currentAdjustTarget, setCurrentAdjustTarget] = React.useState(null);
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

            // 用户类型权重配置
            setUserTypeWeights({
                exhibitor: {
                    name: '展商用户',
                    baseWeight: 1.5,
                    description: '参展企业用户，优先推荐其发布的产品和服务内容',
                    enabled: true,
                    userCount: 156
                },
                association: {
                    name: '协会用户',
                    baseWeight: 1.2,
                    description: '协会认证用户，权威性内容获得额外曝光',
                    enabled: true,
                    userCount: 89
                },
                regular: {
                    name: '普通用户',
                    baseWeight: 1.0,
                    description: '普通注册用户，基础推荐权重',
                    enabled: true,
                    userCount: 4567
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

    // 更新用户类型权重
    const updateUserTypeWeight = (typeKey, value) => {
        setUserTypeWeights(prev => ({
            ...prev,
            [typeKey]: {
                ...prev[typeKey],
                baseWeight: value
            }
        }));
    };

    // 更新用户类型状态
    const updateUserTypeStatus = (typeKey, enabled) => {
        setUserTypeWeights(prev => ({
            ...prev,
            [typeKey]: {
                ...prev[typeKey],
                enabled: enabled
            }
        }));
    };

    // 处理用户搜索
    const handleUserSearch = (values) => {
        setLoading(true);
        // 模拟搜索API调用
        setTimeout(() => {
            const mockResults = [
                {
                    userId: 'user_001',
                    username: 'test_user',
                    nickname: '测试用户',
                    userType: '展商用户',
                    currentWeight: 1.5,
                    contentCount: 12
                },
                {
                    userId: 'user_002',
                    username: 'demo_user',
                    nickname: '演示用户',
                    userType: '协会用户',
                    currentWeight: 1.0,
                    contentCount: 8
                }
            ];
            setSearchResults(mockResults);
            setLoading(false);
            message.success(`找到 ${mockResults.length} 个用户`);
        }, 1000);
    };

    // 调整用户权重
    const handleAdjustUserWeight = (user) => {
        setCurrentAdjustTarget(user);
        setWeightAdjustModalVisible(true);
    };

    // 查看用户作品
    const handleViewUserContents = (user) => {
        setSelectedUser(user);
        // 模拟获取用户作品
        const mockContents = [
            {
                contentId: 'content_001',
                title: '轨道交通新技术展示',
                type: '视频',
                publishTime: '2024-01-10',
                currentWeight: 1.0,
                views: 1520,
                likes: 45,
                comments: 12
            },
            {
                contentId: 'content_002',
                title: '城市轨道发展趋势',
                type: '图文',
                publishTime: '2024-01-08',
                currentWeight: 1.2,
                views: 890,
                likes: 23,
                comments: 8
            }
        ];
        setUserContents(mockContents);
    };

    // 调整作品权重
    const handleAdjustContentWeight = (content) => {
        setCurrentAdjustTarget(content);
        setContentWeightModalVisible(true);
    };

    // 渲染用户类型权重配置
    const renderUserTypeWeights = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '用户类型权重配置',
                description: '为不同类型用户设置基础推荐权重系数，影响其发布内容的整体曝光机会',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Row, {
                key: 'type-cards',
                gutter: [24, 24]
            }, Object.keys(userTypeWeights).map(typeKey => {
                const userType = userTypeWeights[typeKey];
                return React.createElement(Col, {
                    key: typeKey,
                    span: 8
                }, React.createElement(Card, {
                    size: 'small',
                    style: { textAlign: 'center', minHeight: '280px' }
                }, [
                    React.createElement('div', {
                        key: 'header',
                        style: { marginBottom: '16px' }
                    }, [
                        React.createElement('h3', {
                            key: 'name',
                            style: { margin: 0, color: '#1890ff', fontSize: '18px' }
                        }, userType.name),
                        React.createElement('p', {
                            key: 'desc',
                            style: { margin: '8px 0', fontSize: '12px', color: '#666', lineHeight: '1.4' }
                        }, userType.description),
                        React.createElement('div', {
                            key: 'count',
                            style: { fontSize: '12px', color: '#999' }
                        }, `当前用户数: ${userType.userCount}`)
                    ]),
                    
                    React.createElement('div', {
                        key: 'weight-control',
                        style: { margin: '20px 0' }
                    }, [
                        React.createElement('div', {
                            key: 'current-weight',
                            style: { 
                                fontSize: '32px', 
                                fontWeight: 'bold', 
                                color: '#1890ff',
                                marginBottom: '16px'
                            }
                        }, `×${userType.baseWeight}`),
                        
                        React.createElement('div', {
                            key: 'weight-slider',
                            style: { padding: '0 16px' }
                        }, [
                            React.createElement(Slider, {
                                min: 0.1,
                                max: 3.0,
                                step: 0.1,
                                value: userType.baseWeight,
                                onChange: (value) => updateUserTypeWeight(typeKey, value),
                                tooltip: { formatter: value => `×${value}` },
                                marks: { 
                                    0.1: '0.1×', 
                                    1.0: '1.0×', 
                                    2.0: '2.0×', 
                                    3.0: '3.0×' 
                                }
                            })
                        ])
                    ]),

                    React.createElement('div', {
                        key: 'status-control',
                        style: { marginTop: '16px' }
                    }, [
                        React.createElement('div', {
                            key: 'status-label',
                            style: { fontSize: '12px', marginBottom: '8px' }
                        }, '启用状态:'),
                        React.createElement(Switch, {
                            checked: userType.enabled,
                            onChange: (checked) => updateUserTypeStatus(typeKey, checked),
                            checkedChildren: '启用',
                            unCheckedChildren: '禁用'
                        })
                    ])
                ]));
            }))
        ]);
    };

    // 渲染精准流量控制
    const renderPrecisionControl = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '精准流量控制',
                description: '搜索特定用户，调整其内容推荐权重或针对单个作品进行流量控制',
                type: 'success',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            // 用户搜索区域
            React.createElement(Card, {
                key: 'search-card',
                title: '🔍 用户搜索',
                style: { marginBottom: '24px' }
            }, [
                React.createElement(Form, {
                    key: 'search-form',
                    form: userSearchForm,
                    layout: 'inline',
                    onFinish: handleUserSearch
                }, [
                    React.createElement(Form.Item, {
                        key: 'search-type',
                        name: 'searchType',
                        initialValue: 'username'
                    }, React.createElement(Select, {
                        style: { width: 120 },
                        options: [
                            { value: 'username', label: '用户名' },
                            { value: 'phone', label: '手机号' },
                            { value: 'userId', label: '用户ID' },
                            { value: 'nickname', label: '昵称' }
                        ]
                    })),
                    
                    React.createElement(Form.Item, {
                        key: 'search-keyword',
                        name: 'keyword',
                        rules: [{ required: true, message: '请输入搜索关键词' }]
                    }, React.createElement(Input, {
                        placeholder: '输入搜索关键词',
                        style: { width: 300 }
                    })),
                    
                    React.createElement(Form.Item, {
                        key: 'search-submit'
                    }, React.createElement(Button, {
                        type: 'primary',
                        htmlType: 'submit',
                        loading: loading
                    }, '搜索用户'))
                ])
            ]),

            // 搜索结果
            searchResults.length > 0 && React.createElement(Card, {
                key: 'search-results',
                title: '搜索结果',
                style: { marginBottom: '24px' }
            }, [
                React.createElement(Table, {
                    key: 'results-table',
                    dataSource: searchResults,
                    columns: [
                        {
                            title: '用户信息',
                            key: 'userInfo',
                            render: (_, record) => React.createElement('div', {}, [
                                React.createElement('div', {
                                    key: 'name',
                                    style: { fontWeight: 'bold' }
                                }, record.nickname || record.username),
                                React.createElement('div', {
                                    key: 'type',
                                    style: { fontSize: '12px', color: '#666' }
                                }, `${record.userType} | ID: ${record.userId}`)
                            ])
                        },
                        {
                            title: '当前权重',
                            dataIndex: 'currentWeight',
                            render: (weight) => React.createElement('span', {
                                style: { fontWeight: 'bold', color: '#1890ff' }
                            }, `×${weight}`)
                        },
                        {
                            title: '发布作品',
                            dataIndex: 'contentCount',
                            render: (count) => `${count} 个`
                        },
                        {
                            title: '操作',
                            key: 'actions',
                            render: (_, record) => React.createElement(Space, {}, [
                                React.createElement(Button, {
                                    key: 'adjust-user',
                                    size: 'small',
                                    onClick: () => handleAdjustUserWeight(record)
                                }, '调整用户权重'),
                                React.createElement(Button, {
                                    key: 'view-contents',
                                    size: 'small',
                                    type: 'link',
                                    onClick: () => handleViewUserContents(record)
                                }, '查看作品')
                            ])
                        }
                    ],
                    pagination: false,
                    size: 'small'
                })
            ]),

            // 用户作品列表
            selectedUser && userContents.length > 0 && React.createElement(Card, {
                key: 'user-contents',
                title: `${selectedUser.nickname || selectedUser.username} 的作品列表`,
                extra: React.createElement(Button, {
                    size: 'small',
                    onClick: () => setSelectedUser(null)
                }, '关闭')
            }, [
                React.createElement(Table, {
                    key: 'contents-table',
                    dataSource: userContents,
                    columns: [
                        {
                            title: '作品信息',
                            key: 'contentInfo',
                            render: (_, record) => React.createElement('div', {}, [
                                React.createElement('div', {
                                    key: 'title',
                                    style: { fontWeight: 'bold' }
                                }, record.title),
                                React.createElement('div', {
                                    key: 'meta',
                                    style: { fontSize: '12px', color: '#666' }
                                }, `${record.type} | ${record.publishTime}`)
                            ])
                        },
                        {
                            title: '当前权重',
                            dataIndex: 'currentWeight',
                            render: (weight) => React.createElement('span', {
                                style: { fontWeight: 'bold', color: '#1890ff' }
                            }, `×${weight}`)
                        },
                        {
                            title: '数据表现',
                            key: 'performance',
                            render: (_, record) => React.createElement('div', {
                                style: { fontSize: '12px' }
                            }, `${record.views}浏览 ${record.likes}赞 ${record.comments}评论`)
                        },
                        {
                            title: '操作',
                            key: 'actions',
                            render: (_, record) => React.createElement(Button, {
                                size: 'small',
                                onClick: () => handleAdjustContentWeight(record)
                            }, '调整权重')
                        }
                    ],
                    pagination: { pageSize: 10 },
                    size: 'small'
                })
            ])
        ]);
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
        },
        {
            key: 'userTypes',
            label: '👥 用户类型权重',
            children: renderUserTypeWeights()
        },
        {
            key: 'precision',
            label: '🎯 精准流量控制',
            children: renderPrecisionControl()
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
        ])),

        // 用户权重调整模态框
        React.createElement(Modal, {
            key: 'weight-adjust-modal',
            title: '调整用户权重',
            open: weightAdjustModalVisible,
            onCancel: () => setWeightAdjustModalVisible(false),
            onOk: () => {
                message.success('用户权重已调整');
                setWeightAdjustModalVisible(false);
            },
            width: 600
        }, currentAdjustTarget && React.createElement('div', {}, [
            React.createElement('div', {
                key: 'user-info',
                style: { marginBottom: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '6px' }
            }, [
                React.createElement('h4', {
                    key: 'name',
                    style: { margin: '0 0 8px 0' }
                }, currentAdjustTarget.nickname || currentAdjustTarget.username),
                React.createElement('p', {
                    key: 'type',
                    style: { margin: 0, color: '#666' }
                }, `${currentAdjustTarget.userType} | ID: ${currentAdjustTarget.userId}`)
            ]),
            
            React.createElement('div', {
                key: 'weight-control',
                style: { marginBottom: '24px' }
            }, [
                React.createElement('div', {
                    key: 'label',
                    style: { marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }
                }, '推荐权重系数:'),
                React.createElement('div', {
                    key: 'current',
                    style: { textAlign: 'center', marginBottom: '16px' }
                }, [
                    React.createElement('span', {
                        key: 'weight-value',
                        style: { fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }
                    }, `×${currentAdjustTarget.currentWeight}`)
                ]),
                React.createElement(Slider, {
                    key: 'weight-slider',
                    min: 0.1,
                    max: 5.0,
                    step: 0.1,
                    value: currentAdjustTarget.currentWeight,
                    tooltip: { formatter: value => `×${value}` },
                    marks: { 
                        0.1: '0.1×', 
                        1.0: '1.0×', 
                        2.0: '2.0×', 
                        3.0: '3.0×',
                        5.0: '5.0×' 
                    }
                })
            ]),

            React.createElement('div', {
                key: 'reason-control'
            }, [
                React.createElement('div', {
                    key: 'reason-label',
                    style: { marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }
                }, '调整原因:'),
                React.createElement(Input.TextArea, {
                    key: 'reason-input',
                    placeholder: '请输入权重调整的原因...',
                    rows: 3
                })
            ]),

            React.createElement('div', {
                key: 'time-control',
                style: { marginTop: '16px' }
            }, [
                React.createElement('div', {
                    key: 'time-label',
                    style: { marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }
                }, '生效时间:'),
                React.createElement(Select, {
                    key: 'time-select',
                    defaultValue: 'permanent',
                    style: { width: '100%' },
                    options: [
                        { value: 'permanent', label: '永久生效' },
                        { value: '7days', label: '7天后恢复' },
                        { value: '30days', label: '30天后恢复' },
                        { value: 'custom', label: '自定义时间' }
                    ]
                })
            ])
        ])),

        // 作品权重调整模态框
        React.createElement(Modal, {
            key: 'content-weight-modal',
            title: '调整作品权重',
            open: contentWeightModalVisible,
            onCancel: () => setContentWeightModalVisible(false),
            onOk: () => {
                message.success('作品权重已调整');
                setContentWeightModalVisible(false);
            },
            width: 600
        }, currentAdjustTarget && React.createElement('div', {}, [
            React.createElement('div', {
                key: 'content-info',
                style: { marginBottom: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '6px' }
            }, [
                React.createElement('h4', {
                    key: 'title',
                    style: { margin: '0 0 8px 0' }
                }, currentAdjustTarget.title),
                React.createElement('p', {
                    key: 'meta',
                    style: { margin: 0, color: '#666' }
                }, `${currentAdjustTarget.type} | 发布时间: ${currentAdjustTarget.publishTime}`)
            ]),
            
            React.createElement('div', {
                key: 'performance',
                style: { marginBottom: '24px', padding: '12px', background: '#fafafa', borderRadius: '4px' }
            }, [
                React.createElement('div', {
                    key: 'performance-title',
                    style: { marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }
                }, '作品表现:'),
                React.createElement('div', {
                    key: 'performance-data',
                    style: { fontSize: '12px', color: '#666' }
                }, `${currentAdjustTarget.views || 0}浏览 ${currentAdjustTarget.likes || 0}赞 ${currentAdjustTarget.comments || 0}评论`)
            ]),

            React.createElement('div', {
                key: 'weight-control',
                style: { marginBottom: '24px' }
            }, [
                React.createElement('div', {
                    key: 'label',
                    style: { marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }
                }, '推荐权重系数:'),
                React.createElement('div', {
                    key: 'current',
                    style: { textAlign: 'center', marginBottom: '16px' }
                }, [
                    React.createElement('span', {
                        key: 'weight-value',
                        style: { fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }
                    }, `×${currentAdjustTarget.currentWeight || 1.0}`)
                ]),
                React.createElement(Slider, {
                    key: 'weight-slider',
                    min: 0.1,
                    max: 5.0,
                    step: 0.1,
                    value: currentAdjustTarget.currentWeight || 1.0,
                    tooltip: { formatter: value => `×${value}` },
                    marks: { 
                        0.1: '0.1×', 
                        1.0: '1.0×', 
                        2.0: '2.0×', 
                        3.0: '3.0×',
                        5.0: '5.0×' 
                    }
                })
            ]),

            React.createElement('div', {
                key: 'reason-control'
            }, [
                React.createElement('div', {
                    key: 'reason-label',
                    style: { marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }
                }, '调整原因:'),
                React.createElement(Input.TextArea, {
                    key: 'reason-input',
                    placeholder: '请输入权重调整的原因...',
                    rows: 3
                })
            ])
        ]))
    ]);
};

window.App.pages.TrafficAllocation = TrafficAllocation;
console.log('[TrafficAllocation] 组件挂载成功');