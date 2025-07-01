// 用户画像分析页面 - 完整版本
const UserProfile = () => {
    const { Row, Col, Card, Statistic, Progress, Tag, Button, Space, Table, Tabs, Select, Input, DatePicker, Modal, Form, Transfer, TreeSelect, Alert, Descriptions, Timeline, Badge } = antd;
    const [activeTab, setActiveTab] = React.useState('overview');
    const [profileData, setProfileData] = React.useState({});
    const [userSegments, setUserSegments] = React.useState([]);
    const [behaviorAnalysis, setBehaviorAnalysis] = React.useState({});
    const [attributeAnalysis, setAttributeAnalysis] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [selectedSegment, setSelectedSegment] = React.useState(null);
    const [exportModalVisible, setExportModalVisible] = React.useState(false);
    const [segmentModalVisible, setSegmentModalVisible] = React.useState(false);
    const [form] = Form.useForm();

    React.useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = () => {
        setLoading(true);
        setTimeout(() => {
            // 模拟完整的用户画像数据
            setProfileData({
                totalUsers: 125648,
                activeUsers: 89234,
                newUsers: 2456,
                retentionRate: 0.762,
                lastUpdate: '2024-01-15 14:30:25'
            });

            setAttributeAnalysis({
                industryDistribution: [
                    { name: '车辆制造', count: 28456, percentage: 22.6 },
                    { name: '信号系统', count: 21345, percentage: 17.0 },
                    { name: '运营维护', count: 19234, percentage: 15.3 },
                    { name: '基建工程', count: 17892, percentage: 14.2 },
                    { name: '科研院所', count: 15623, percentage: 12.4 },
                    { name: '其他', count: 23098, percentage: 18.5 }
                ],
                companySize: [
                    { name: '大型企业(>1000人)', count: 45623, percentage: 36.3 },
                    { name: '中型企业(100-1000人)', count: 38234, percentage: 30.4 },
                    { name: '小型企业(<100人)', count: 25891, percentage: 20.6 },
                    { name: '科研院所', count: 15900, percentage: 12.7 }
                ],
                certificationStatus: [
                    { name: '实名认证', count: 98456, percentage: 78.4, color: 'green' },
                    { name: '企业认证', count: 67234, percentage: 53.5, color: 'blue' },
                    { name: '协会认证', count: 12345, percentage: 9.8, color: 'purple' },
                    { name: '未认证', count: 27192, percentage: 21.6, color: 'orange' }
                ]
            });

            setBehaviorAnalysis({
                moduleAccess: [
                    { module: '推荐模块', visits: 234567, avgTime: '8.5分钟', activeRate: 85.2 },
                    { module: '热门模块', visits: 189234, avgTime: '6.2分钟', activeRate: 72.1 },
                    { module: '关注模块', visits: 145678, avgTime: '5.8分钟', activeRate: 68.9 },
                    { module: '展会模块', visits: 98765, avgTime: '12.3分钟', activeRate: 45.6 },
                    { module: '协会模块', visits: 76543, avgTime: '9.1分钟', activeRate: 38.2 },
                    { module: 'AI助手', visits: 54321, avgTime: '4.2分钟', activeRate: 28.7 }
                ],
                contentPreferences: [
                    { type: '技术分享', users: 45623, engagement: 92.3 },
                    { type: '行业新闻', users: 38234, engagement: 87.1 },
                    { type: '政策解读', users: 29876, engagement: 78.9 },
                    { type: '展会视频', users: 25431, engagement: 85.6 },
                    { type: '设备介绍', users: 21234, engagement: 72.4 },
                    { type: '案例分析', users: 18765, engagement: 89.2 }
                ],
                activeTimeDistribution: [
                    { time: '08:00-10:00', users: 28456, percentage: 22.6 },
                    { time: '10:00-12:00', users: 35234, percentage: 28.0 },
                    { time: '14:00-16:00', users: 32891, percentage: 26.2 },
                    { time: '16:00-18:00', users: 25623, percentage: 20.4 },
                    { time: '19:00-21:00', users: 22345, percentage: 17.8 },
                    { time: '21:00-23:00', users: 15432, percentage: 12.3 }
                ],
                behaviorTags: [
                    { tag: '技术专家', count: 15623, weight: 0.92 },
                    { tag: '行业新人', count: 12456, weight: 0.88 },
                    { tag: '设备采购', count: 9876, weight: 0.85 },
                    { tag: '政策关注', count: 8765, weight: 0.82 },
                    { tag: '展会参与', count: 7654, weight: 0.79 },
                    { tag: '学术研究', count: 6543, weight: 0.76 },
                    { tag: '项目管理', count: 5432, weight: 0.73 },
                    { tag: '投资决策', count: 4321, weight: 0.70 }
                ]
            });

            setUserSegments([
                {
                    id: 'segment_001',
                    name: '技术专家群体',
                    description: '高频访问技术内容，活跃于技术讨论',
                    userCount: 15623,
                    tags: ['技术专家', '高活跃度', '内容贡献者'],
                    characteristics: {
                        avgSessionTime: '15.2分钟',
                        contentEngagement: '94.5%',
                        retentionRate: '89.2%'
                    }
                },
                {
                    id: 'segment_002', 
                    name: '采购决策群体',
                    description: '关注设备信息，参与展会活动',
                    userCount: 12456,
                    tags: ['设备采购', '展会参与', '决策者'],
                    characteristics: {
                        avgSessionTime: '12.8分钟',
                        contentEngagement: '87.3%',
                        retentionRate: '76.8%'
                    }
                },
                {
                    id: 'segment_003',
                    name: '行业新人群体', 
                    description: '学习导向，关注基础知识和政策',
                    userCount: 18765,
                    tags: ['行业新人', '学习导向', '政策关注'],
                    characteristics: {
                        avgSessionTime: '8.6分钟',
                        contentEngagement: '72.1%',
                        retentionRate: '65.4%'
                    }
                }
            ]);

            setLoading(false);
        }, 800);
    };

    // 渲染概览数据卡片
    const renderOverviewCards = () => {
        return React.createElement(Row, { gutter: [16, 16] }, [
            React.createElement(Col, { key: 'total', xs: 24, sm: 12, md: 6 },
                React.createElement(Card, { className: 'dashboard-card' },
                    React.createElement(Statistic, {
                        title: '总用户数',
                        value: profileData.totalUsers,
                        valueStyle: { color: '#2563eb' },
                        suffix: '人'
                    })
                )
            ),
            React.createElement(Col, { key: 'active', xs: 24, sm: 12, md: 6 },
                React.createElement(Card, { className: 'dashboard-card' },
                    React.createElement(Statistic, {
                        title: '活跃用户',
                        value: profileData.activeUsers,
                        valueStyle: { color: '#22c55e' },
                        suffix: '人'
                    })
                )
            ),
            React.createElement(Col, { key: 'new', xs: 24, sm: 12, md: 6 },
                React.createElement(Card, { className: 'dashboard-card' },
                    React.createElement(Statistic, {
                        title: '新增用户',
                        value: profileData.newUsers,
                        valueStyle: { color: '#f59e42' },
                        suffix: '人'
                    })
                )
            ),
            React.createElement(Col, { key: 'retention', xs: 24, sm: 12, md: 6 },
                React.createElement(Card, { className: 'dashboard-card' },
                    React.createElement(Statistic, {
                        title: '留存率',
                        value: (profileData.retentionRate * 100).toFixed(1),
                        valueStyle: { color: '#8b5cf6' },
                        suffix: '%'
                    })
                )
            )
        ]);
    };

    // 渲染基础属性分析
    const renderAttributeAnalysis = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '基础属性分析',
                description: '基于用户注册信息、认证数据生成的静态属性画像，每日更新一次',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '16px' }
            }),
            React.createElement(Row, { key: 'charts', gutter: [16, 16] }, [
                // 行业分布
                React.createElement(Col, { key: 'industry', span: 8 },
                    React.createElement(Card, {
                        title: '行业分布',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportSegmentData('industry')
                        }, '导出')
                    }, React.createElement('div', { style: { padding: '16px 0' } },
                        attributeAnalysis.industryDistribution?.map((item, index) =>
                            React.createElement('div', {
                                key: index,
                                style: { marginBottom: '12px' }
                            }, [
                                React.createElement('div', {
                                    key: 'label',
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '4px',
                                        fontSize: '13px'
                                    }
                                }, [
                                    React.createElement('span', { key: 'name' }, item.name),
                                    React.createElement('span', { key: 'count' }, `${item.count}人 (${item.percentage}%)`)
                                ]),
                                React.createElement(Progress, {
                                    key: 'progress',
                                    percent: item.percentage,
                                    size: 'small',
                                    showInfo: false,
                                    strokeColor: ['#2563eb', '#22c55e', '#f59e42', '#8b5cf6', '#ec4899', '#64748b'][index % 6]
                                })
                            ])
                        )
                    ))
                ),
                // 企业规模
                React.createElement(Col, { key: 'company', span: 8 },
                    React.createElement(Card, {
                        title: '企业规模分布',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportSegmentData('company')
                        }, '导出')
                    }, React.createElement('div', { style: { padding: '16px 0' } },
                        attributeAnalysis.companySize?.map((item, index) =>
                            React.createElement('div', {
                                key: index,
                                style: { marginBottom: '12px' }
                            }, [
                                React.createElement('div', {
                                    key: 'label',
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '4px',
                                        fontSize: '13px'
                                    }
                                }, [
                                    React.createElement('span', { key: 'name' }, item.name),
                                    React.createElement('span', { key: 'count' }, `${item.count}人 (${item.percentage}%)`)
                                ]),
                                React.createElement(Progress, {
                                    key: 'progress',
                                    percent: item.percentage,
                                    size: 'small',
                                    showInfo: false,
                                    strokeColor: ['#2563eb', '#22c55e', '#f59e42', '#8b5cf6'][index]
                                })
                            ])
                        )
                    ))
                ),
                // 认证状态
                React.createElement(Col, { key: 'certification', span: 8 },
                    React.createElement(Card, {
                        title: '认证状态分布',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportSegmentData('certification')
                        }, '导出')
                    }, React.createElement('div', { style: { padding: '16px 0' } },
                        attributeAnalysis.certificationStatus?.map((item, index) =>
                            React.createElement('div', {
                                key: index,
                                style: { marginBottom: '12px' }
                            }, [
                                React.createElement('div', {
                                    key: 'label',
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '4px',
                                        fontSize: '13px'
                                    }
                                }, [
                                    React.createElement('span', { key: 'name' }, [
                                        React.createElement(Badge, {
                                            key: 'badge',
                                            color: item.color,
                                            style: { marginRight: '6px' }
                                        }),
                                        item.name
                                    ]),
                                    React.createElement('span', { key: 'count' }, `${item.count}人 (${item.percentage}%)`)
                                ]),
                                React.createElement(Progress, {
                                    key: 'progress',
                                    percent: item.percentage,
                                    size: 'small',
                                    showInfo: false,
                                    strokeColor: item.color
                                })
                            ])
                        )
                    ))
                )
            ])
        ]);
    };

    // 渲染行为标签分析  
    const renderBehaviorAnalysis = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                message: '行为标签分析',
                description: '基于用户APP内行为数据生成的动态标签，实时更新用户兴趣偏好和行为模式',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '16px' }
            }),
            React.createElement(Row, { key: 'behavior-data', gutter: [16, 16] }, [
                // 模块访问分析
                React.createElement(Col, { key: 'module-access', span: 12 },
                    React.createElement(Card, {
                        title: '模块访问频率',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportSegmentData('module_access')
                        }, '导出分析')
                    }, React.createElement(Table, {
                        dataSource: behaviorAnalysis.moduleAccess,
                        pagination: false,
                        size: 'small',
                        columns: [
                            { title: '模块', dataIndex: 'module', width: 100 },
                            { title: '访问次数', dataIndex: 'visits', width: 80, render: (val) => `${(val / 1000).toFixed(1)}k` },
                            { title: '平均时长', dataIndex: 'avgTime', width: 80 },
                            { title: '活跃率', dataIndex: 'activeRate', width: 70, render: (val) => `${val}%` }
                        ]
                    }))
                ),
                // 内容偏好分析
                React.createElement(Col, { key: 'content-pref', span: 12 },
                    React.createElement(Card, {
                        title: '内容偏好分析',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportSegmentData('content_preferences')
                        }, '导出分析')
                    }, React.createElement(Table, {
                        dataSource: behaviorAnalysis.contentPreferences,
                        pagination: false,
                        size: 'small',
                        columns: [
                            { title: '内容类型', dataIndex: 'type', width: 100 },
                            { title: '关注用户', dataIndex: 'users', width: 80, render: (val) => `${(val / 1000).toFixed(1)}k` },
                            { title: '参与度', dataIndex: 'engagement', width: 70, render: (val) => `${val}%` }
                        ]
                    }))
                )
            ]),
            React.createElement(Row, { key: 'time-tags', gutter: [16, 16], style: { marginTop: '16px' } }, [
                // 活跃时段分析
                React.createElement(Col, { key: 'active-time', span: 12 },
                    React.createElement(Card, {
                        title: '用户活跃时段',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportSegmentData('active_time')
                        }, '导出数据')
                    }, React.createElement('div', { style: { padding: '16px 0' } },
                        behaviorAnalysis.activeTimeDistribution?.map((item, index) =>
                            React.createElement('div', {
                                key: index,
                                style: { marginBottom: '10px' }
                            }, [
                                React.createElement('div', {
                                    key: 'label',
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '4px',
                                        fontSize: '13px'
                                    }
                                }, [
                                    React.createElement('span', { key: 'time' }, item.time),
                                    React.createElement('span', { key: 'users' }, `${item.users}人 (${item.percentage}%)`)
                                ]),
                                React.createElement(Progress, {
                                    key: 'progress',
                                    percent: item.percentage,
                                    size: 'small',
                                    showInfo: false,
                                    strokeColor: '#22c55e'
                                })
                            ])
                        )
                    ))
                ),
                // 行为标签云
                React.createElement(Col, { key: 'behavior-tags', span: 12 },
                    React.createElement(Card, {
                        title: '行为标签分布',
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => exportSegmentData('behavior_tags')
                        }, '导出标签')
                    }, React.createElement('div', { style: { padding: '16px', minHeight: '280px' } },
                        behaviorAnalysis.behaviorTags?.map((tag, index) =>
                            React.createElement(Tag, {
                                key: index,
                                color: 'blue',
                                style: {
                                    margin: '4px',
                                    padding: '6px 12px',
                                    fontSize: Math.min(16, 10 + tag.weight * 8) + 'px',
                                    fontWeight: tag.weight > 0.8 ? 'bold' : 'normal'
                                }
                            }, `${tag.tag} (${tag.count})`)
                        )
                    ))
                )
            ])
        ]);
    };

    // 渲染用户分群
    const renderUserSegments = () => {
        return React.createElement('div', {}, [
            React.createElement('div', {
                key: 'header',
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }
            }, [
                React.createElement(Alert, {
                    key: 'info',
                    message: '用户分群管理',
                    description: '基于用户画像数据进行的智能分群，支持自定义分群规则和导出',
                    type: 'info',
                    showIcon: true,
                    style: { flex: 1, marginRight: '16px' }
                }),
                React.createElement(Button, {
                    key: 'create',
                    type: 'primary',
                    onClick: () => setSegmentModalVisible(true)
                }, '创建分群')
            ]),
            React.createElement(Row, { key: 'segments', gutter: [16, 16] },
                userSegments.map((segment, index) =>
                    React.createElement(Col, { key: segment.id, span: 8 },
                        React.createElement(Card, {
                            title: segment.name,
                            extra: React.createElement(Space, {}, [
                                React.createElement(Button, {
                                    key: 'view',
                                    size: 'small',
                                    onClick: () => viewSegmentDetail(segment)
                                }, '详情'),
                                React.createElement(Button, {
                                    key: 'export',
                                    size: 'small',
                                    type: 'primary',
                                    onClick: () => exportSegmentUsers(segment)
                                }, '导出')
                            ])
                        }, React.createElement('div', {}, [
                            React.createElement(Statistic, {
                                key: 'count',
                                title: '用户数量',
                                value: segment.userCount,
                                suffix: '人',
                                style: { marginBottom: '16px' }
                            }),
                            React.createElement('div', {
                                key: 'description',
                                style: { marginBottom: '12px', color: '#64748b', fontSize: '13px' }
                            }, segment.description),
                            React.createElement('div', {
                                key: 'tags',
                                style: { marginBottom: '12px' }
                            }, segment.tags.map((tag, tagIndex) =>
                                React.createElement(Tag, {
                                    key: tagIndex,
                                    size: 'small',
                                    color: 'blue'
                                }, tag)
                            )),
                            React.createElement(Descriptions, {
                                key: 'characteristics',
                                size: 'small',
                                column: 1,
                                items: [
                                    { label: '平均时长', children: segment.characteristics.avgSessionTime },
                                    { label: '参与度', children: segment.characteristics.contentEngagement },
                                    { label: '留存率', children: segment.characteristics.retentionRate }
                                ]
                            })
                        ]))
                    )
                )
            )
        ]);
    };

    // 导出相关函数
    const exportSegmentData = (type) => {
        antd.message.loading(`正在导出${type}数据...`, 2);
        setTimeout(() => {
            antd.message.success(`${type}数据导出成功`);
        }, 2000);
    };

    const exportSegmentUsers = (segment) => {
        setSelectedSegment(segment);
        setExportModalVisible(true);
    };

    const viewSegmentDetail = (segment) => {
        Modal.info({
            title: `分群详情 - ${segment.name}`,
            width: 600,
            content: React.createElement(Descriptions, {
                bordered: true,
                column: 1,
                items: [
                    { label: '分群名称', children: segment.name },
                    { label: '用户数量', children: `${segment.userCount} 人` },
                    { label: '分群描述', children: segment.description },
                    { label: '平均会话时长', children: segment.characteristics.avgSessionTime },
                    { label: '内容参与度', children: segment.characteristics.contentEngagement },
                    { label: '用户留存率', children: segment.characteristics.retentionRate },
                    { label: '分群标签', children: segment.tags.join(', ') }
                ]
            })
        });
    };

    const handleExportConfirm = () => {
        form.validateFields().then(values => {
            console.log('导出配置:', values);
            antd.message.loading('正在生成导出文件...', 3);
            setTimeout(() => {
                antd.message.success('用户画像数据导出成功！');
                setExportModalVisible(false);
                form.resetFields();
            }, 3000);
        });
    };

    // Tab配置
    const tabItems = [
        {
            key: 'overview',
            label: React.createElement('span', {}, ['📊 ', '概览总览']),
            children: React.createElement('div', {}, [
                renderOverviewCards(),
                React.createElement('div', {
                    key: 'update-info',
                    style: {
                        marginTop: '16px',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: '#64748b',
                        fontSize: '12px'
                    }
                }, `数据更新时间：${profileData.lastUpdate || '加载中...'}，每小时自动刷新`)
            ])
        },
        {
            key: 'attributes',
            label: React.createElement('span', {}, ['👤 ', '基础属性']),
            children: renderAttributeAnalysis()
        },
        {
            key: 'behavior',
            label: React.createElement('span', {}, ['🎯 ', '行为标签']),
            children: renderBehaviorAnalysis()
        },
        {
            key: 'segments',
            label: React.createElement('span', {}, ['👥 ', '用户分群']),
            children: renderUserSegments()
        }
    ];

    return React.createElement('div', {}, [
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
            }, '用户画像分析'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'refresh',
                    icon: React.createElement('span', {}, '🔄'),
                    onClick: loadProfileData,
                    loading: loading
                }, '刷新数据'),
                React.createElement(Button, {
                    key: 'export-all',
                    type: 'primary',
                    icon: React.createElement('span', {}, '📤'),
                    onClick: () => setExportModalVisible(true)
                }, '批量导出'),
                React.createElement(Button, {
                    key: 'settings',
                    icon: React.createElement('span', {}, '⚙️')
                }, '配置管理')
            ])
        ]),

        // 主要内容Tab
        React.createElement(Tabs, {
            key: 'tabs',
            activeKey: activeTab,
            onChange: setActiveTab,
            items: tabItems,
            size: 'large'
        }),

        // 导出模态框
        React.createElement(Modal, {
            key: 'exportModal',
            title: '批量导出用户画像数据',
            open: exportModalVisible,
            onCancel: () => setExportModalVisible(false),
            onOk: handleExportConfirm,
            width: 600
        }, React.createElement(Form, {
            form: form,
            layout: 'vertical'
        }, [
            React.createElement(Form.Item, {
                key: 'exportType',
                label: '导出类型',
                name: 'exportType',
                rules: [{ required: true, message: '请选择导出类型' }]
            }, React.createElement(Select, {
                placeholder: '请选择导出类型',
                options: [
                    { value: 'all', label: '全量用户画像' },
                    { value: 'active', label: '活跃用户画像' },
                    { value: 'segment', label: '特定分群数据' },
                    { value: 'tags', label: '行为标签数据' },
                    { value: 'attributes', label: '基础属性数据' }
                ]
            })),
            React.createElement(Form.Item, {
                key: 'fields',
                label: '导出字段',
                name: 'fields'
            }, React.createElement(Select, {
                mode: 'multiple',
                placeholder: '选择要导出的字段',
                options: [
                    { value: 'userId', label: '用户ID' },
                    { value: 'basicInfo', label: '基本信息' },
                    { value: 'industryTags', label: '行业标签' },
                    { value: 'behaviorTags', label: '行为标签' },
                    { value: 'activityData', label: '活跃数据' },
                    { value: 'contentPrefs', label: '内容偏好' },
                    { value: 'certificationStatus', label: '认证状态' }
                ]
            })),
            React.createElement(Form.Item, {
                key: 'format',
                label: '文件格式',
                name: 'format',
                initialValue: 'csv'
            }, React.createElement(Select, {
                options: [
                    { value: 'csv', label: 'CSV格式' },
                    { value: 'excel', label: 'Excel格式' },
                    { value: 'json', label: 'JSON格式' }
                ]
            })),
            React.createElement(Alert, {
                key: 'warning',
                message: '数据安全提醒',
                description: '导出数据包含用户敏感信息，请确保符合数据保护法规，仅用于授权的业务用途。',
                type: 'warning',
                showIcon: true
            })
        ]))
    ]);
};

window.UserProfile = UserProfile; 