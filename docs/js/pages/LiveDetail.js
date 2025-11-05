// 直播详情页面 - 包含多个tab展示直播信息
const LiveDetail = () => {
    const { Tabs, Card, Tag, Table, Button, Space, Spin, message, Image, Descriptions } = antd;
    const { TabPane } = Tabs;
    
    // 从URL或状态管理中获取直播ID
    const [liveId, setLiveId] = React.useState(null);
    const [liveData, setLiveData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [registrationStatistics, setRegistrationStatistics] = React.useState(null);
    const [loadingStatistics, setLoadingStatistics] = React.useState(false);
    
    // 会议资料、议程、介绍的数据
    const [meetingMaterials, setMeetingMaterials] = React.useState([]);
    const [agendaItems, setAgendaItems] = React.useState([]);
    const [introductionItems, setIntroductionItems] = React.useState([]);
    
    
    // 会议议程描述信息
    const [agendaDescription, setAgendaDescription] = React.useState({
        name: '',
        time: '',
        location: '',
        coverImage: null,
        description: ''
    });
    
    
    // 初始化：从URL或状态管理获取直播ID
    React.useEffect(() => {
        // 从window.StateManager获取当前选中的直播ID
        const urlParams = new URLSearchParams(window.location.search);
        const urlLiveId = urlParams.get('id');
        
        // 从StateManager的liveDetailData中获取
        let currentLiveId = urlLiveId;
        let storedLiveData = null;
        
        if (window.StateManager?.state?.liveDetailData) {
            const liveDetailData = window.StateManager.state.liveDetailData;
            // 获取最新的直播ID（取最后一个）
            const liveIds = Object.keys(liveDetailData);
            if (liveIds.length > 0) {
                currentLiveId = currentLiveId || liveIds[liveIds.length - 1];
                storedLiveData = liveDetailData[currentLiveId];
            }
        }
        
        if (currentLiveId) {
            setLiveId(currentLiveId);
            loadLiveDetail(currentLiveId, storedLiveData);
        } else {
            message.error('未找到直播ID');
            setLoading(false);
        }
    }, []);
    
    // 加载直播详情
    const loadLiveDetail = async (id, preloadedData) => {
        setLoading(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 如果已经有预加载的数据，使用它
            if (preloadedData) {
                const detailData = getLiveDetailData(id, preloadedData);
                setLiveData(detailData);
                setMeetingMaterials(detailData.materials || []);
                setAgendaItems(detailData.agenda || []);
                setIntroductionItems(detailData.introduction || []);
                if (detailData.agendaDescription) {
                    setAgendaDescription(detailData.agendaDescription);
                }
                setLoading(false);
                return;
            }
            
            // 否则从模拟数据中加载
            const detailData = getLiveDetailData(id);
            setLiveData(detailData);
            setMeetingMaterials(detailData.materials || []);
            setAgendaItems(detailData.agenda || []);
            setIntroductionItems(detailData.introduction || []);
            if (detailData.agendaDescription) {
                setAgendaDescription(detailData.agendaDescription);
            }
            
            // 如果是微赞直播且开启了报名功能，加载报名统计数据
            if (detailData.type === 'weizan' && detailData.enableRegistration) {
                loadRegistrationStatistics(id);
            }
        } catch (error) {
            console.error('加载直播详情失败:', error);
            message.error('加载直播详情失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 获取直播详情数据（根据ID返回对应的演示数据）
    const getLiveDetailData = (id, baseData) => {
        const base = baseData || {
            id: id,
            title: '城市轨道交通技术创新大会',
            type: 'weizan',
            typeLabel: '微赞直播',
            status: 'not_started',
            statusLabel: '未开始',
            startTime: '2024-01-15 14:00:00',
            endTime: null,
            coverUrl: 'https://placehold.co/120x68/e0e7ff/4f46e5?text=Live1',
            description: '介绍最新的城市轨道交通技术发展趋势和创新应用',
            enableRegistration: true,
            registrationUrl: 'https://www.wjx.cn/jq/12345678.aspx',
            isMultipleSessions: false,
            createdBy: '管理员',
            createdAt: '2024-01-10 10:30:00',
            updatedAt: '2024-01-10 10:30:00'
        };
        
        // 根据ID返回不同的详情数据
        const detailDataMap = {
            'live_001': {
                ...base,
                // 多场直播：会议资料
                materials: [
                    { id: 'mat_1', type: 'materials', fileName: '技术白皮书.pdf', fileUrl: 'https://example.com/mat1.pdf', allowDownload: true },
                    { id: 'mat_2', type: 'materials', fileName: '产品介绍.pdf', fileUrl: 'https://example.com/mat2.pdf', allowDownload: true },
                    { id: 'mat_3', type: 'materials', fileName: '会议议程表.pdf', fileUrl: 'https://example.com/mat3.pdf', allowDownload: false },
                    { id: 'mat_4', type: 'materials', fileName: '嘉宾介绍.pdf', fileUrl: 'https://example.com/mat4.pdf', allowDownload: true }
                ],
                // 多场直播：会议议程（图片列表，支持拖拽排序）
                agenda: [
                    { id: 'agenda_1', type: 'image', url: 'https://placehold.co/800x600/f0f0f0/333?text=第一天议程\\n上午场', order: 1 },
                    { id: 'agenda_2', type: 'image', url: 'https://placehold.co/800x600/e0e0e0/333?text=第一天议程\\n下午场', order: 2 },
                    { id: 'agenda_3', type: 'image', url: 'https://placehold.co/800x600/d0d0d0/333?text=第二天议程\\n上午场', order: 3 },
                    { id: 'agenda_4', type: 'image', url: 'https://placehold.co/800x600/c0c0c0/333?text=第二天议程\\n下午场', order: 4 },
                    { id: 'agenda_5', type: 'pdf', url: 'https://example.com/agenda.pdf', fileName: '详细议程.pdf', order: 5 }
                ],
                // 多场直播：会议介绍（PDF或图片列表，支持拖拽排序）
                introduction: [
                    { id: 'intro_1', type: 'pdf', fileName: '会议介绍.pdf', url: 'https://example.com/intro1.pdf', order: 1 },
                    { id: 'intro_2', type: 'image', url: 'https://placehold.co/800x600/d0d0d0/333?text=会议主题介绍', order: 2 },
                    { id: 'intro_3', type: 'image', url: 'https://placehold.co/800x600/c0c0c0/333?text=会议亮点', order: 3 },
                    { id: 'intro_4', type: 'image', url: 'https://placehold.co/800x600/b0b0b0/333?text=参会须知', order: 4 }
                ],
                // 多场直播：会议议程描述
                agendaDescription: {
                    name: '城市轨道交通技术创新大会',
                    time: '2024年1月15-16日 14:00-17:00',
                    location: '北京国际会议中心 三层会议厅',
                    coverImage: 'https://placehold.co/600x400/1890ff/fff?text=会议宣传图',
                    description: '本次大会将围绕城市轨道交通技术的最新发展趋势、创新应用案例等主题进行深入探讨。会议为期两天，包含多场专题报告和圆桌讨论，邀请行业专家、企业代表共同参与。'
                },
                // 多场直播：场次信息
                sessions: [
                    {
                        id: 'session_1',
                        title: '开幕式及主题演讲',
                        startTime: '2024-01-15 14:00:00',
                        endTime: '2024-01-15 15:30:00',
                        liveUrl: 'https://vzan.com/live/session_1',
                        status: 'not_started',
                        statusLabel: '未开始'
                    },
                    {
                        id: 'session_2',
                        title: '技术发展趋势专题报告',
                        startTime: '2024-01-15 16:00:00',
                        endTime: '2024-01-15 17:30:00',
                        liveUrl: 'https://vzan.com/live/session_2',
                        status: 'not_started',
                        statusLabel: '未开始'
                    },
                    {
                        id: 'session_3',
                        title: '创新应用案例分享',
                        startTime: '2024-01-16 09:00:00',
                        endTime: '2024-01-16 10:30:00',
                        liveUrl: 'https://vzan.com/live/session_3',
                        status: 'not_started',
                        statusLabel: '未开始'
                    },
                    {
                        id: 'session_4',
                        title: '圆桌讨论：行业未来展望',
                        startTime: '2024-01-16 14:00:00',
                        endTime: '2024-01-16 16:00:00',
                        liveUrl: 'https://vzan.com/live/session_4',
                        status: 'not_started',
                        statusLabel: '未开始'
                    }
                ]
            },
            'live_002': {
                ...base,
                title: '外部平台直播测试',
                type: 'external',
                typeLabel: '外部链接直播',
                status: 'live',
                statusLabel: '直播中',
                startTime: '2024-01-12 09:00:00',
                description: '通过外部平台进行的直播活动',
                enableRegistration: false,
                externalUrl: 'https://live.example.com/stream/12345',
                materials: [
                    { id: 'mat_1', type: 'materials', fileName: '直播说明.pdf', fileUrl: 'https://example.com/mat1.pdf', allowDownload: true }
                ],
                agenda: [
                    { id: 'agenda_1', type: 'image', url: 'https://placehold.co/800x600/f0f0f0/333?text=外部直播议程', order: 1 }
                ],
                introduction: [
                    { id: 'intro_1', type: 'image', url: 'https://placehold.co/800x600/d0d0d0/333?text=外部直播介绍', order: 1 }
                ],
                agendaDescription: {
                    name: '外部平台直播测试',
                    time: '2024年1月12日 09:00-12:00',
                    location: '线上直播平台',
                    coverImage: 'https://placehold.co/600x400/ff6b6b/fff?text=外部直播',
                    description: '通过外部平台进行的直播活动测试'
                }
            },
            'live_003': {
                ...base,
                title: '展会开幕式直播',
                type: 'exhibition',
                typeLabel: '关联展会直播',
                status: 'not_started',
                statusLabel: '未开始',
                startTime: '2024-02-01 10:00:00',
                description: '2024年城轨展会开幕式',
                enableRegistration: false,
                exhibitionId: 'exhibition_001',
                exhibitionName: '2024年城市轨道交通展会',
                materials: [],
                agenda: [
                    { id: 'agenda_1', type: 'pdf', url: 'https://example.com/exhibition_agenda.pdf', fileName: '展会开幕式议程.pdf', order: 1 },
                    { id: 'agenda_2', type: 'image', url: 'https://placehold.co/800x600/e0e0e0/333?text=开幕式流程', order: 2 }
                ],
                introduction: [
                    { id: 'intro_1', type: 'image', url: 'https://placehold.co/800x600/c0c0c0/333?text=展会介绍1', order: 1 },
                    { id: 'intro_2', type: 'image', url: 'https://placehold.co/800x600/b0b0b0/333?text=展会介绍2', order: 2 }
                ],
                agendaDescription: {
                    name: '2024年城市轨道交通展会开幕式',
                    time: '2024年2月1日 10:00-12:00',
                    location: '上海国际展览中心',
                    coverImage: 'https://placehold.co/600x400/51cf66/fff?text=展会开幕式',
                    description: '2024年城市轨道交通展会盛大开幕，邀请行业专家、企业代表共同参与。'
                }
            }
        };
        
        // 返回对应的详情数据，如果没有匹配则返回默认数据
        const detailData = detailDataMap[id] || {
            ...base,
            id: id,
            materials: [],
            agenda: [],
            introduction: [],
            agendaDescription: {
                name: base.title,
                time: base.startTime,
                location: '',
                coverImage: null,
                description: base.description
            }
        };
        
        return detailData;
    };
    
    // 加载报名统计数据
    const loadRegistrationStatistics = async (liveId) => {
        setLoadingStatistics(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 根据不同的直播ID返回不同的统计数据（用于演示）
            const statisticsMap = {
                'live_001': {
                    totalCount: 256,
                    fieldStatistics: [
                        {
                            fieldName: '单位',
                            fieldLabel: '所属单位',
                            statistics: [
                                { value: '北京地铁', count: 72, percentage: 28.1 },
                                { value: '上海地铁', count: 58, percentage: 22.7 },
                                { value: '广州地铁', count: 45, percentage: 17.6 },
                                { value: '深圳地铁', count: 38, percentage: 14.8 },
                                { value: '成都地铁', count: 25, percentage: 9.8 },
                                { value: '其他', count: 18, percentage: 7.0 }
                            ]
                        },
                        {
                            fieldName: '职位',
                            fieldLabel: '职位',
                            statistics: [
                                { value: '工程师', count: 108, percentage: 42.2 },
                                { value: '技术主管', count: 68, percentage: 26.6 },
                                { value: '部门经理', count: 45, percentage: 17.6 },
                                { value: '高级工程师', count: 28, percentage: 10.9 },
                                { value: '其他', count: 7, percentage: 2.7 }
                            ]
                        },
                        {
                            fieldName: '参会目的',
                            fieldLabel: '参会目的',
                            statistics: [
                                { value: '学习新技术', count: 142, percentage: 55.5 },
                                { value: '了解行业趋势', count: 68, percentage: 26.6 },
                                { value: '业务交流', count: 32, percentage: 12.5 },
                                { value: '寻找合作机会', count: 14, percentage: 5.5 }
                            ]
                        },
                        {
                            fieldName: '参加场次',
                            fieldLabel: '计划参加的场次',
                            statistics: [
                                { value: '全部场次', count: 156, percentage: 60.9 },
                                { value: '第一天上午', count: 45, percentage: 17.6 },
                                { value: '第一天下午', count: 32, percentage: 12.5 },
                                { value: '第二天上午', count: 18, percentage: 7.0 },
                                { value: '第二天下午', count: 5, percentage: 2.0 }
                            ]
                        }
                    ],
                    latestRegistrations: [
                        { name: '张工程师', company: '北京地铁', position: '工程师', registerTime: '2024-01-14 10:30:00' },
                        { name: '李主管', company: '上海地铁', position: '技术主管', registerTime: '2024-01-14 11:15:00' },
                        { name: '王经理', company: '广州地铁', position: '部门经理', registerTime: '2024-01-14 14:20:00' },
                        { name: '赵工程师', company: '深圳地铁', position: '工程师', registerTime: '2024-01-14 15:45:00' },
                        { name: '孙主管', company: '北京地铁', position: '技术主管', registerTime: '2024-01-14 16:10:00' },
                        { name: '周高级工程师', company: '成都地铁', position: '高级工程师', registerTime: '2024-01-14 17:20:00' },
                        { name: '吴工程师', company: '重庆地铁', position: '工程师', registerTime: '2024-01-14 18:05:00' }
                    ]
                }
            };
            
            const mockStatistics = statisticsMap[liveId] || {
                totalCount: 156,
                fieldStatistics: [
                    {
                        fieldName: '单位',
                        fieldLabel: '所属单位',
                        statistics: [
                            { value: '北京地铁', count: 45, percentage: 28.8 },
                            { value: '上海地铁', count: 38, percentage: 24.4 },
                            { value: '广州地铁', count: 32, percentage: 20.5 },
                            { value: '深圳地铁', count: 25, percentage: 16.0 },
                            { value: '其他', count: 16, percentage: 10.3 }
                        ]
                    },
                    {
                        fieldName: '职位',
                        fieldLabel: '职位',
                        statistics: [
                            { value: '工程师', count: 68, percentage: 43.6 },
                            { value: '技术主管', count: 42, percentage: 26.9 },
                            { value: '部门经理', count: 28, percentage: 17.9 },
                            { value: '其他', count: 18, percentage: 11.5 }
                        ]
                    },
                    {
                        fieldName: '参会目的',
                        fieldLabel: '参会目的',
                        statistics: [
                            { value: '学习新技术', count: 89, percentage: 57.1 },
                            { value: '了解行业趋势', count: 45, percentage: 28.8 },
                            { value: '业务交流', count: 22, percentage: 14.1 }
                        ]
                    }
                ],
                latestRegistrations: [
                    { name: '张工程师', company: '北京地铁', position: '工程师', registerTime: '2024-01-14 10:30:00' },
                    { name: '李主管', company: '上海地铁', position: '技术主管', registerTime: '2024-01-14 11:15:00' },
                    { name: '王经理', company: '广州地铁', position: '部门经理', registerTime: '2024-01-14 14:20:00' },
                    { name: '赵工程师', company: '深圳地铁', position: '工程师', registerTime: '2024-01-14 15:45:00' },
                    { name: '孙主管', company: '北京地铁', position: '技术主管', registerTime: '2024-01-14 16:10:00' }
                ]
            };
            
            setRegistrationStatistics(mockStatistics);
        } catch (error) {
            console.error('加载报名统计数据失败:', error);
            message.error('加载报名统计数据失败');
        } finally {
            setLoadingStatistics(false);
        }
    };
    
    
    // 渲染基础信息tab
    const renderBasicInfo = () => {
        if (!liveData) return null;
        
        return React.createElement('div', {}, [
            React.createElement(Descriptions, {
                key: 'basic',
                bordered: true,
                column: 2
            }, [
                React.createElement(Descriptions.Item, { key: 'title', label: '直播名称' }, liveData.title),
                React.createElement(Descriptions.Item, { key: 'type', label: '直播类型' }, liveData.typeLabel),
                React.createElement(Descriptions.Item, { key: 'status', label: '状态' }, 
                    React.createElement(Tag, {
                        color: liveData.status === 'not_started' ? 'default' :
                               liveData.status === 'live' ? 'red' : 'green'
                    }, liveData.statusLabel)
                ),
                React.createElement(Descriptions.Item, { key: 'isMultiple', label: '直播模式' }, 
                    liveData.isMultipleSessions ? '多场直播' : '单场直播'
                ),
                React.createElement(Descriptions.Item, { key: 'startTime', label: '开播时间' }, liveData.startTime),
                React.createElement(Descriptions.Item, { key: 'endTime', label: '结束时间' }, liveData.endTime || '未结束'),
                React.createElement(Descriptions.Item, { key: 'createdBy', label: '创建人' }, liveData.createdBy),
                React.createElement(Descriptions.Item, { key: 'createdAt', label: '创建时间' }, liveData.createdAt),
                React.createElement(Descriptions.Item, { key: 'description', label: '直播简介', span: 2 }, 
                    liveData.description || '暂无简介'
                ),
                liveData.coverUrl && React.createElement(Descriptions.Item, { key: 'cover', label: '封面图片', span: 2 },
                    React.createElement(Image, {
                        src: liveData.coverUrl,
                        width: 200,
                        alt: '封面'
                    })
                )
            ]),
            // 如果是多场直播，显示场次信息
            liveData.isMultipleSessions && liveData.sessions && liveData.sessions.length > 0 && React.createElement(Card, {
                key: 'sessions',
                title: '多场直播场次信息',
                style: { marginTop: 16 }
            }, React.createElement(Table, {
                columns: [
                    { title: '场次', dataIndex: 'title', key: 'title', width: '30%' },
                    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: '25%' },
                    { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: '25%' },
                    { 
                        title: '状态', 
                        dataIndex: 'statusLabel', 
                        key: 'status',
                        width: '20%',
                        render: (status) => React.createElement(Tag, { 
                            color: status === '直播中' ? 'red' : status === '已结束' ? 'default' : 'blue' 
                        }, status)
                    }
                ],
                dataSource: liveData.sessions,
                rowKey: 'id',
                pagination: false,
                size: 'small'
            }))
        ]);
    };
    
    // 渲染会议资料tab（只读模式）
    const renderMaterials = () => {
        return React.createElement('div', {}, [
            React.createElement('div', {
                key: 'header',
                style: {
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }
            }, [
                React.createElement('div', { key: 'title', style: { fontSize: '16px', fontWeight: 'bold' } }, '会议资料列表')
            ]),
            
            React.createElement(Table, {
                key: 'table',
                columns: [
                    {
                        title: '文件名称',
                        dataIndex: 'fileName',
                        key: 'fileName',
                        width: '40%',
                        render: (text) => React.createElement('span', { style: { fontWeight: 'bold' } }, text)
                    },
                    {
                        title: '文件类型',
                        dataIndex: 'type',
                        key: 'type',
                        width: '15%',
                        render: () => React.createElement(Tag, { color: 'blue' }, 'PDF')
                    },
                    {
                        title: '允许下载',
                        dataIndex: 'allowDownload',
                        key: 'allowDownload',
                        width: '15%',
                        render: (allowDownload) => React.createElement(Tag, {
                            color: allowDownload ? 'green' : 'red'
                        }, allowDownload ? '是' : '否')
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: '30%',
                        render: (_, record) => React.createElement(Space, {
                            size: 'small'
                        }, [
                            React.createElement(Button, {
                                key: 'view',
                                size: 'small',
                                type: 'link',
                                onClick: () => window.open(record.fileUrl, '_blank')
                            }, '查看'),
                            React.createElement(Button, {
                                key: 'download',
                                size: 'small',
                                type: 'link',
                                disabled: !record.allowDownload,
                                onClick: () => {
                                    if (record.allowDownload) {
                                        window.open(record.fileUrl);
                                    } else {
                                        message.warning('该文件不允许下载');
                                    }
                                }
                            }, '下载'),
                        ])
                    }
                ],
                dataSource: meetingMaterials,
                rowKey: 'id',
                pagination: meetingMaterials.length > 10 ? { pageSize: 10 } : false,
                locale: {
                    emptyText: React.createElement('div', {
                        style: { textAlign: 'center', padding: '40px 0', color: '#999' }
                    }, '暂无会议资料')
                }
            })
        ]);
    };
    
    // 渲染会议议程tab（只读模式）
    const renderAgenda = () => {
        return React.createElement('div', {}, [
            // 会议议程描述信息（只读）
            React.createElement(Card, {
                key: 'description',
                title: '会议议程描述',
                style: { marginBottom: 24 }
            }, [
                React.createElement(Descriptions, {
                    key: 'info',
                    bordered: true,
                    column: 2
                }, [
                    React.createElement(Descriptions.Item, { key: 'name', label: '会议名称' }, agendaDescription.name || '暂无'),
                    React.createElement(Descriptions.Item, { key: 'time', label: '会议时间' }, agendaDescription.time || '暂无'),
                    React.createElement(Descriptions.Item, { key: 'location', label: '会议地点' }, agendaDescription.location || '暂无'),
                    agendaDescription.coverImage && React.createElement(Descriptions.Item, { 
                        key: 'cover', 
                        label: '会议宣传图', 
                        span: 2 
                    }, React.createElement(Image, {
                        src: agendaDescription.coverImage,
                        width: 200,
                        height: 120,
                        style: { objectFit: 'cover', borderRadius: 4 }
                    })),
                    React.createElement(Descriptions.Item, { 
                        key: 'description', 
                        label: '会议简介', 
                        span: 2 
                    }, agendaDescription.description || '暂无')
                ])
            ]),
            
            // 议程图片/PDF列表（只读，不支持拖拽）
            React.createElement(Card, {
                key: 'items',
                title: '议程内容'
            }, agendaItems.length === 0 ? 
                React.createElement('div', { style: { textAlign: 'center', padding: '40px 0', color: '#999' } }, '暂无议程内容') :
                React.createElement('div', {
                    style: { display: 'flex', flexWrap: 'wrap', gap: 16 }
                }, agendaItems.map((item, index) =>
                    React.createElement('div', {
                        key: item.id,
                        style: {
                            border: '1px solid #d9d9d9',
                            borderRadius: 4,
                            padding: 8,
                            backgroundColor: '#fff',
                            position: 'relative',
                            width: '300px'
                        }
                    }, [
                        item.type === 'image' ? 
                            React.createElement(Image, {
                                key: 'img',
                                src: item.url,
                                width: '100%',
                                alt: `议程${index + 1}`,
                                preview: true
                            }) :
                            React.createElement('div', { key: 'pdf', style: { textAlign: 'center', padding: '40px 0' } }, [
                                React.createElement('div', { style: { fontSize: '48px', marginBottom: 8 } }, '📄'),
                                React.createElement('div', {}, item.fileName || 'PDF文件')
                            ]),
                        React.createElement('div', {
                            key: 'order',
                            style: {
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontSize: '12px'
                            }
                        }, `顺序 ${item.order}`)
                    ])
                ))
            )
        ]);
    };
    
    // 渲染会议介绍tab（只读模式）
    const renderIntroduction = () => {
        if (introductionItems.length === 0) {
            return React.createElement('div', { style: { textAlign: 'center', padding: '40px 0', color: '#999' } }, '暂无会议介绍');
        }
        
        return React.createElement('div', {
            style: { display: 'flex', flexWrap: 'wrap', gap: 16 }
        }, introductionItems.map((item, index) =>
            React.createElement('div', {
                key: item.id,
                style: {
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    padding: 8,
                    backgroundColor: '#fff',
                    position: 'relative',
                    width: item.type === 'image' ? '300px' : 'auto'
                }
            }, [
                item.type === 'image' ?
                    React.createElement(Image, {
                        key: 'img',
                        src: item.url,
                        width: '100%',
                        alt: `介绍${index + 1}`,
                        preview: true
                    }) :
                    React.createElement(Card, {
                        key: 'pdf',
                        style: { width: 300 },
                        actions: [
                            React.createElement(Button, {
                                key: 'view',
                                type: 'link',
                                onClick: () => window.open(item.url)
                            }, '查看PDF')
                        ]
                    }, [
                        React.createElement('div', { style: { fontSize: '48px', textAlign: 'center', marginBottom: 16 } }, '📄'),
                        React.createElement('div', { style: { textAlign: 'center', fontWeight: 'bold' } }, item.fileName || 'PDF文件')
                    ]),
                React.createElement('div', {
                    key: 'order',
                    style: {
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '12px'
                    }
                }, `顺序 ${item.order}`)
            ])
        ));
    };
    
    // 渲染报名统计tab
    const renderRegistrationStatistics = () => {
        if (!liveData || liveData.type !== 'weizan' || !liveData.enableRegistration) {
            return React.createElement('div', { style: { textAlign: 'center', padding: '40px 0', color: '#999' } }, '该直播未开启报名功能');
        }
        
        if (loadingStatistics) {
            return React.createElement('div', { style: { textAlign: 'center', padding: '40px 0' } },
                React.createElement(Spin, { size: 'large' })
            );
        }
        
        if (!registrationStatistics) {
            return React.createElement('div', { style: { textAlign: 'center', padding: '40px 0', color: '#999' } }, '暂无报名统计数据');
        }
        
        return React.createElement('div', {}, [
            // 总报名人数
            React.createElement(Card, {
                key: 'total-count',
                style: { marginBottom: 16, backgroundColor: '#f0f9ff' },
                bordered: false
            }, [
                React.createElement('div', { style: { textAlign: 'center' } }, [
                    React.createElement('div', {
                        style: { fontSize: '32px', fontWeight: 'bold', color: '#1890ff', marginBottom: 8 }
                    }, registrationStatistics.totalCount),
                    React.createElement('div', { style: { color: '#666' } }, '总报名人数')
                ])
            ]),
            
            // 字段统计
            ...registrationStatistics.fieldStatistics.map((fieldStat, index) =>
                React.createElement(Card, {
                    key: `field-stat-${index}`,
                    title: fieldStat.fieldLabel,
                    style: { marginBottom: 16 },
                    size: 'small'
                }, React.createElement(Table, {
                    columns: [
                        {
                            title: '选项',
                            dataIndex: 'value',
                            key: 'value',
                            width: '40%'
                        },
                        {
                            title: '人数',
                            dataIndex: 'count',
                            key: 'count',
                            width: '25%',
                            align: 'center'
                        },
                        {
                            title: '占比',
                            dataIndex: 'percentage',
                            key: 'percentage',
                            width: '35%',
                            render: (percentage) => React.createElement('div', {}, [
                                React.createElement('div', {
                                    style: {
                                        width: '100%',
                                        height: 8,
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        marginBottom: 4
                                    }
                                }, React.createElement('div', {
                                    style: {
                                        width: `${percentage}%`,
                                        height: '100%',
                                        backgroundColor: '#1890ff',
                                        transition: 'width 0.3s'
                                    }
                                })),
                                React.createElement('span', {}, `${percentage}%`)
                            ])
                        }
                    ],
                    dataSource: fieldStat.statistics,
                    pagination: false,
                    size: 'small',
                    rowKey: (record, idx) => `${fieldStat.fieldName}-${idx}`
                }))
            ),
            
            // 最新报名列表
            React.createElement(Card, {
                key: 'latest-registrations',
                title: '最新报名（最近5条）',
                style: { marginBottom: 16 },
                size: 'small'
            }, React.createElement(Table, {
                columns: [
                    {
                        title: '姓名',
                        dataIndex: 'name',
                        key: 'name',
                        width: '25%'
                    },
                    {
                        title: '单位',
                        dataIndex: 'company',
                        key: 'company',
                        width: '30%'
                    },
                    {
                        title: '职位',
                        dataIndex: 'position',
                        key: 'position',
                        width: '25%'
                    },
                    {
                        title: '报名时间',
                        dataIndex: 'registerTime',
                        key: 'registerTime',
                        width: '20%'
                    }
                ],
                dataSource: registrationStatistics.latestRegistrations,
                pagination: false,
                size: 'small',
                rowKey: (record, index) => `latest-${index}`
            }))
        ]);
    };
    
    if (loading) {
        return React.createElement('div', {
            style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px'
            }
        }, React.createElement(Spin, { size: 'large' }));
    }
    
    if (!liveData) {
        return React.createElement('div', {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: '#999'
            }
        }, '未找到直播信息');
    }
    
    return React.createElement('div', {
        style: {
            padding: '24px',
            background: '#f0f2f5',
            minHeight: '100vh'
        }
    }, [
        React.createElement('div', {
            key: 'header',
            style: {
                background: '#fff',
                padding: '16px 24px',
                marginBottom: 16,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { margin: 0 }
            }, liveData.title),
            React.createElement(Button, {
                key: 'back',
                onClick: () => {
                    // 返回直播管理页面
                    if (window.StateManager) {
                        window.StateManager.emit('page:change', { page: 'live-management' });
                    }
                }
            }, '返回列表')
        ]),
        
        React.createElement(Card, {
            key: 'content',
            style: { borderRadius: 8 }
        }, React.createElement(Tabs, {
            defaultActiveKey: 'basic',
            type: 'card'
        }, [
            React.createElement(TabPane, {
                key: 'basic',
                tab: React.createElement('span', {}, '📋 直播基础信息')
            }, renderBasicInfo()),
            
            // 只有微赞直播类型才显示以下tab
            liveData.type === 'weizan' && React.createElement(TabPane, {
                key: 'materials',
                tab: React.createElement('span', {}, '📄 会议资料')
            }, renderMaterials()),
            
            liveData.type === 'weizan' && React.createElement(TabPane, {
                key: 'agenda',
                tab: React.createElement('span', {}, '📅 会议议程')
            }, renderAgenda()),
            
            liveData.type === 'weizan' && React.createElement(TabPane, {
                key: 'introduction',
                tab: React.createElement('span', {}, '📖 会议介绍')
            }, renderIntroduction()),
            
            liveData.type === 'weizan' && liveData.enableRegistration && React.createElement(TabPane, {
                key: 'statistics',
                tab: React.createElement('span', {}, '📊 报名统计')
            }, renderRegistrationStatistics())
        ]))
    ]);
};

// 导出组件
window.App = window.App || {};
window.App.pages = window.App.pages || {};
window.App.pages.LiveDetail = LiveDetail;
console.log('[LiveDetail] 组件挂载成功');

