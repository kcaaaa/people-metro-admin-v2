// 直播管理模块 - 独立的一级功能模块，支持三种直播类型
// 基于功能需求文档实现：外部链接直播、微赞直播、关联展会直播
const LiveManagement = () => {
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, DatePicker, Upload, Radio, Switch, Steps, Divider, InputNumber, Popconfirm } = antd;
    const { Search, TextArea } = Input;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const { Step } = Steps;
    
    // 状态管理
    const [loading, setLoading] = React.useState(false);
    const [liveList, setLiveList] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [currentStep, setCurrentStep] = React.useState(0); // 0: 类型选择, 1: 配置表单
    const [selectedLiveType, setSelectedLiveType] = React.useState(null);
    const [editingLive, setEditingLive] = React.useState(null);
    const [viewDetailModalVisible, setViewDetailModalVisible] = React.useState(false);
    const [selectedLive, setSelectedLive] = React.useState(null);
    
    // 表单实例
    const [liveForm] = Form.useForm();
    
    // 搜索和筛选状态
    const [searchText, setSearchText] = React.useState('');
    const [typeFilter, setTypeFilter] = React.useState('all');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [timeRange, setTimeRange] = React.useState(null);
    const [creatorFilter, setCreatorFilter] = React.useState('all');
    
    // 微赞相关状态
    const [channels, setChannels] = React.useState([]);
    const [isMultipleSessions, setIsMultipleSessions] = React.useState(false);
    const [sessions, setSessions] = React.useState([]);
    const [meetingMaterials, setMeetingMaterials] = React.useState([]);
    
    // 展会列表（用于关联展会直播）
    const [exhibitions, setExhibitions] = React.useState([]);
    
    // 初始化加载
    React.useEffect(() => {
        loadLiveList();
        loadChannels();
        loadExhibitions();
    }, []);
    
    // 加载直播列表
    const loadLiveList = async () => {
        setLoading(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 模拟数据
            const mockData = [
                {
                    id: 'live_001',
                    title: '城轨新技术发布会',
                    type: 'weizan',
                    typeLabel: '微赞直播',
                    status: 'not_started',
                    statusLabel: '未开始',
                    startTime: '2024-01-15 14:00:00',
                    endTime: null,
                    presenter: '张工程师',
                    channelId: 'vzan_001',
                    channelName: '展会直播频道',
                    coverUrl: 'https://placehold.co/120x68/e0e7ff/4f46e5?text=Live1',
                    description: '介绍最新的城市轨道交通技术发展趋势和创新应用',
                    enableRegistration: true,
                    registrationUrl: 'https://www.wjx.cn/jq/12345678.aspx',
                    isMultipleSessions: false,
                    externalUrl: null,
                    exhibitionId: null,
                    exhibitionName: null,
                    createdBy: '管理员',
                    createdAt: '2024-01-10 10:30:00',
                    updatedAt: '2024-01-10 10:30:00'
                },
                {
                    id: 'live_002',
                    title: '外部平台直播测试',
                    type: 'external',
                    typeLabel: '外部链接直播',
                    status: 'live',
                    statusLabel: '直播中',
                    startTime: '2024-01-12 09:00:00',
                    endTime: null,
                    presenter: null,
                    channelId: null,
                    channelName: null,
                    coverUrl: 'https://placehold.co/120x68/e0e7ff/4f46e5?text=Live2',
                    description: '通过外部平台进行的直播活动',
                    enableRegistration: false,
                    registrationUrl: null,
                    isMultipleSessions: false,
                    externalUrl: 'https://live.example.com/stream/12345',
                    exhibitionId: null,
                    exhibitionName: null,
                    createdBy: '运营人员',
                    createdAt: '2024-01-08 15:20:00',
                    updatedAt: '2024-01-12 09:00:00'
                },
                {
                    id: 'live_003',
                    title: '展会开幕式直播',
                    type: 'exhibition',
                    typeLabel: '关联展会直播',
                    status: 'not_started',
                    statusLabel: '未开始',
                    startTime: '2024-02-01 10:00:00',
                    endTime: null,
                    presenter: null,
                    channelId: null,
                    channelName: null,
                    coverUrl: 'https://placehold.co/120x68/e0e7ff/4f46e5?text=Live3',
                    description: '2024年城轨展会开幕式',
                    enableRegistration: false,
                    registrationUrl: null,
                    isMultipleSessions: false,
                    externalUrl: null,
                    exhibitionId: 'exhibition_001',
                    exhibitionName: '2024年城市轨道交通展会',
                    createdBy: '管理员',
                    createdAt: '2024-01-05 11:00:00',
                    updatedAt: '2024-01-05 11:00:00'
                }
            ];
            
            setLiveList(mockData);
        } catch (error) {
            console.error('加载直播列表失败:', error);
            message.error('加载直播列表失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 加载微赞频道列表
    const loadChannels = async () => {
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const mockChannels = [
                { id: 'vzan_001', name: '展会直播频道', description: '城轨展会活动专用直播频道' },
                { id: 'vzan_002', name: '技术分享频道', description: '技术讲座和专业分享直播' },
                { id: 'vzan_003', name: '协会活动频道', description: '协会官方会议和活动直播' }
            ];
            
            setChannels(mockChannels);
        } catch (error) {
            console.error('加载频道列表失败:', error);
        }
    };
    
    // 加载展会列表
    const loadExhibitions = async () => {
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const mockExhibitions = [
                { id: 'exhibition_001', name: '2024年城市轨道交通展会', startDate: '2024-02-01', endDate: '2024-02-03' },
                { id: 'exhibition_002', name: '2024年智能交通技术展', startDate: '2024-03-15', endDate: '2024-03-17' },
                { id: 'exhibition_003', name: '2024年轨道交通装备展', startDate: '2024-05-10', endDate: '2024-05-12' }
            ];
            
            setExhibitions(mockExhibitions);
        } catch (error) {
            console.error('加载展会列表失败:', error);
        }
    };
    
    // 筛选后的直播列表
    const filteredLiveList = React.useMemo(() => {
        return liveList.filter(live => {
            // 名称搜索
            if (searchText && !live.title.toLowerCase().includes(searchText.toLowerCase())) {
                return false;
            }
            
            // 类型筛选
            if (typeFilter !== 'all' && live.type !== typeFilter) {
                return false;
            }
            
            // 状态筛选
            if (statusFilter !== 'all' && live.status !== statusFilter) {
                return false;
            }
            
            // 创建人筛选
            if (creatorFilter !== 'all' && live.createdBy !== creatorFilter) {
                return false;
            }
            
            // 时间范围筛选
            if (timeRange && timeRange.length === 2) {
                const liveTime = new Date(live.startTime);
                const startTime = timeRange[0].startOf('day');
                const endTime = timeRange[1].endOf('day');
                if (liveTime < startTime || liveTime > endTime) {
                    return false;
                }
            }
            
            return true;
        });
    }, [liveList, searchText, typeFilter, statusFilter, creatorFilter, timeRange]);
    
    // 获取创建人列表（用于筛选）
    const creators = React.useMemo(() => {
        const creatorSet = new Set(liveList.map(live => live.createdBy));
        return Array.from(creatorSet);
    }, [liveList]);
    
    // 新建直播
    const handleCreateLive = () => {
        setEditingLive(null);
        setSelectedLiveType(null);
        setCurrentStep(0);
        liveForm.resetFields();
        setIsMultipleSessions(false);
        setSessions([]);
        setMeetingMaterials([]);
        setModalVisible(true);
    };
    
    // 选择直播类型
    const handleSelectLiveType = (type) => {
        setSelectedLiveType(type);
        setCurrentStep(1);
        
        // 根据类型设置表单默认值
        liveForm.setFieldsValue({
            type: type,
            status: 'not_started',
            enableRegistration: false,
            isMultipleSessions: false,
            allowDownload: true
        });
        
        // 如果是微赞直播，需要设置频道
        if (type === 'weizan') {
            liveForm.setFieldsValue({
                channelId: channels.length > 0 ? channels[0].id : null
            });
        }
    };
    
    // 返回类型选择
    const handleBackToTypeSelection = () => {
        setCurrentStep(0);
        setSelectedLiveType(null);
        liveForm.resetFields();
    };
    
    // 编辑直播
    const handleEditLive = (live) => {
        setEditingLive(live);
        setSelectedLiveType(live.type);
        setCurrentStep(1);
        
        // 设置表单值
        const formValues = {
            ...live,
            startTime: live.startTime ? window.moment(live.startTime) : null,
            endTime: live.endTime ? window.moment(live.endTime) : null
        };
        
        liveForm.setFieldsValue(formValues);
        
        // 设置多场直播状态
        if (live.isMultipleSessions) {
            setIsMultipleSessions(true);
            // 加载场次数据
            loadSessions(live.id);
        }
        
        // 加载会议资料
        loadMeetingMaterials(live.id);
        
        setModalVisible(true);
    };
    
    // 加载场次数据
    const loadSessions = async (liveId) => {
        // 模拟加载场次数据
        const mockSessions = [
            { id: 'session_001', sessionName: '开幕式', sessionTime: '2024-02-01 10:00:00', sessionUrl: 'https://live.example.com/session1' },
            { id: 'session_002', sessionName: '主题演讲', sessionTime: '2024-02-01 14:00:00', sessionUrl: 'https://live.example.com/session2' }
        ];
        setSessions(mockSessions);
    };
    
    // 加载会议资料
    const loadMeetingMaterials = async (liveId) => {
        // 模拟加载会议资料
        const mockMaterials = [
            { id: 'material_001', materialType: 'introduction', fileName: '会议介绍.pdf', fileUrl: '/files/introduction.pdf', allowDownload: true },
            { id: 'material_002', materialType: 'agenda', fileName: '会议议程.pdf', fileUrl: '/files/agenda.pdf', allowDownload: true },
            { id: 'material_003', materialType: 'materials', fileName: '会议资料.pdf', fileUrl: '/files/materials.pdf', allowDownload: false }
        ];
        setMeetingMaterials(mockMaterials);
    };
    
    // 删除直播
    const handleDeleteLive = async (live) => {
        if (live.status === 'live') {
            message.warning('进行中的直播不允许删除');
            return;
        }
        
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setLiveList(prev => prev.filter(item => item.id !== live.id));
            message.success('删除成功');
            
            // 如果是微赞直播，调用微赞API删除
            if (live.type === 'weizan' && live.channelId) {
                // await deleteWeizanLive(live.channelId);
            }
        } catch (error) {
            console.error('删除失败:', error);
            message.error('删除失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 开始直播
    const handleStartLive = async (live) => {
        if (live.status !== 'not_started') {
            message.warning('只有未开始的直播可以执行开始操作');
            return;
        }
        
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 更新状态
            setLiveList(prev => prev.map(item => 
                item.id === live.id 
                    ? { ...item, status: 'live', statusLabel: '直播中' }
                    : item
            ));
            
            message.success('直播已开始');
            
            // 如果是微赞直播，调用微赞API
            if (live.type === 'weizan') {
                // await startWeizanLive(live.channelId);
            }
        } catch (error) {
            console.error('开始直播失败:', error);
            message.error('开始直播失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 结束直播
    const handleEndLive = async (live) => {
        if (live.status !== 'live') {
            message.warning('只有进行中的直播可以执行结束操作');
            return;
        }
        
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const endTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            
            // 更新状态
            setLiveList(prev => prev.map(item => 
                item.id === live.id 
                    ? { ...item, status: 'ended', statusLabel: '已结束', endTime }
                    : item
            ));
            
            message.success('直播已结束');
            
            // 如果是微赞直播，调用微赞API
            if (live.type === 'weizan') {
                // await endWeizanLive(live.channelId);
            }
        } catch (error) {
            console.error('结束直播失败:', error);
            message.error('结束直播失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 生成回放
    const handleGenerateReplay = async (live) => {
        if (live.status !== 'ended') {
            message.warning('只有已结束的直播可以生成回放');
            return;
        }
        
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            message.success('回放生成任务已提交，预计5分钟内完成处理');
            
            // 如果是微赞直播，调用微赞API
            if (live.type === 'weizan') {
                // await generateWeizanReplay(live.channelId);
            }
        } catch (error) {
            console.error('生成回放失败:', error);
            message.error('生成回放失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 刷新状态
    const handleRefreshStatus = async (live) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 模拟状态更新
            if (live.type === 'weizan') {
                // const status = await getWeizanLiveStatus(live.channelId);
                // 更新状态
            }
            
            message.success('状态刷新成功');
        } catch (error) {
            console.error('刷新状态失败:', error);
            message.error('刷新状态失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 查看详情
    const handleViewDetail = (live) => {
        setSelectedLive(live);
        setViewDetailModalVisible(true);
    };
    
    // 表单提交
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            
            // 表单验证
            if (values.type === 'external' && !values.externalUrl) {
                message.error('外部链接直播必须填写外部链接');
                return;
            }
            
            if (values.type === 'weizan') {
                if (!values.presenter) {
                    message.error('微赞直播必须填写主讲人');
                    return;
                }
                if (!values.channelId) {
                    message.error('微赞直播必须选择所属频道');
                    return;
                }
                if (!values.coverUrl) {
                    message.error('微赞直播必须上传封面图片');
                    return;
                }
                if (values.enableRegistration && !values.registrationUrl) {
                    message.error('开启报名功能时必须填写问卷星报名链接');
                    return;
                }
            }
            
            if (values.type === 'exhibition' && !values.exhibitionId) {
                message.error('关联展会直播必须选择关联的展会');
                return;
            }
            
            // 验证时间
            if (values.startTime && values.startTime.isBefore(window.moment())) {
                message.error('开播时间不能早于当前时间');
                return;
            }
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const liveData = {
                ...values,
                id: editingLive ? editingLive.id : `live_${Date.now()}`,
                startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
                endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
                typeLabel: values.type === 'external' ? '外部链接直播' : 
                           values.type === 'weizan' ? '微赞直播' : '关联展会直播',
                statusLabel: values.status === 'not_started' ? '未开始' :
                            values.status === 'live' ? '直播中' : '已结束',
                createdBy: editingLive ? editingLive.createdBy : '当前用户',
                createdAt: editingLive ? editingLive.createdAt : new Date().toISOString().slice(0, 19).replace('T', ' '),
                updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
                channelName: values.channelId ? channels.find(c => c.id === values.channelId)?.name : null,
                exhibitionName: values.exhibitionId ? exhibitions.find(e => e.id === values.exhibitionId)?.name : null
            };
            
            if (editingLive) {
                // 更新
                setLiveList(prev => prev.map(item => 
                    item.id === editingLive.id ? liveData : item
                ));
                message.success('直播信息更新成功');
            } else {
                // 创建
                setLiveList(prev => [...prev, liveData]);
                message.success('直播创建成功');
                
                // 如果是微赞直播，调用微赞API创建
                if (values.type === 'weizan') {
                    // const weizanLive = await createWeizanLive(values);
                    // liveData.weizanTopicId = weizanLive.topic_id;
                    // liveData.pushUrl = weizanLive.push_url;
                    // liveData.streamKey = weizanLive.stream_key;
                }
            }
            
            // 关闭模态框
            setModalVisible(false);
            setCurrentStep(0);
            setSelectedLiveType(null);
            liveForm.resetFields();
            
        } catch (error) {
            console.error('保存失败:', error);
            message.error('保存失败，请检查表单数据或稍后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 重置筛选条件
    const handleResetFilters = () => {
        setSearchText('');
        setTypeFilter('all');
        setStatusFilter('all');
        setCreatorFilter('all');
        setTimeRange(null);
    };
    
    // 渲染类型选择界面
    const renderTypeSelection = () => {
        return React.createElement('div', {
            style: { padding: '40px 20px', textAlign: 'center' }
        }, [
            React.createElement('h3', {
                key: 'title',
                style: { marginBottom: '32px', fontSize: '18px', fontWeight: '600' }
            }, '请选择直播类型'),
            
            React.createElement(Row, {
                key: 'types',
                gutter: [24, 24],
                justify: 'center'
            }, [
                React.createElement(Col, { span: 8 }, [
                    React.createElement(Card, {
                        key: 'external',
                        hoverable: true,
                        style: {
                            cursor: 'pointer',
                            border: selectedLiveType === 'external' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        },
                        onClick: () => handleSelectLiveType('external')
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            style: { fontSize: '48px', marginBottom: '16px' }
                        }, '🔗'),
                        React.createElement('div', {
                            key: 'name',
                            style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' }
                        }, '外部链接直播'),
                        React.createElement('div', {
                            key: 'desc',
                            style: { fontSize: '14px', color: '#666' }
                        }, '通过外部平台进行直播，在本平台仅维护基本信息和状态')
                    ])
                ]),
                
                React.createElement(Col, { span: 8 }, [
                    React.createElement(Card, {
                        key: 'weizan',
                        hoverable: true,
                        style: {
                            cursor: 'pointer',
                            border: selectedLiveType === 'weizan' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        },
                        onClick: () => handleSelectLiveType('weizan')
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            style: { fontSize: '48px', marginBottom: '16px' }
                        }, '📺'),
                        React.createElement('div', {
                            key: 'name',
                            style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' }
                        }, '微赞直播'),
                        React.createElement('div', {
                            key: 'desc',
                            style: { fontSize: '14px', color: '#666' }
                        }, '基于微赞平台API进行创建和管理，支持丰富的互动功能')
                    ])
                ]),
                
                React.createElement(Col, { span: 8 }, [
                    React.createElement(Card, {
                        key: 'exhibition',
                        hoverable: true,
                        style: {
                            cursor: 'pointer',
                            border: selectedLiveType === 'exhibition' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        },
                        onClick: () => handleSelectLiveType('exhibition')
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            style: { fontSize: '48px', marginBottom: '16px' }
                        }, '🏢'),
                        React.createElement('div', {
                            key: 'name',
                            style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' }
                        }, '关联展会直播'),
                        React.createElement('div', {
                            key: 'desc',
                            style: { fontSize: '14px', color: '#666' }
                        }, '与平台现有展会功能关联，在APP中展示展会直播页面')
                    ])
                ])
            ])
        ]);
    };
    
    // 渲染外部链接直播配置表单
    const renderExternalLiveForm = () => {
        return React.createElement(Form, {
            form: liveForm,
            layout: 'vertical',
            onFinish: handleSubmit
        }, [
            React.createElement(Form.Item, {
                key: 'title',
                name: 'title',
                label: React.createElement('span', {}, [
                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                    React.createElement('span', { key: 'text' }, ' 直播名称')
                ]),
                rules: [{ required: true, message: '请输入直播名称' }]
            }, React.createElement(Input, { placeholder: '请输入直播名称' })),
            
            React.createElement(Form.Item, {
                key: 'startTime',
                name: 'startTime',
                label: React.createElement('span', {}, [
                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                    React.createElement('span', { key: 'text' }, ' 开播时间')
                ]),
                rules: [{ required: true, message: '请选择开播时间' }]
            }, React.createElement(DatePicker, {
                showTime: { format: 'HH:mm' },
                style: { width: '100%' },
                format: 'YYYY-MM-DD HH:mm',
                disabledDate: (current) => current && current < window.moment().startOf('day')
            })),
            
            React.createElement(Form.Item, {
                key: 'externalUrl',
                name: 'externalUrl',
                label: React.createElement('span', {}, [
                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                    React.createElement('span', { key: 'text' }, ' 外部直播链接')
                ]),
                rules: [
                    { required: true, message: '请输入外部直播链接' },
                    { type: 'url', message: '请输入有效的URL格式' }
                ]
            }, React.createElement(Input, { placeholder: 'https://live.example.com/stream/12345' })),
            
            React.createElement(Form.Item, {
                key: 'coverUrl',
                name: 'coverUrl',
                label: '直播封面图片',
                extra: '推荐尺寸: 1920x1080，支持jpg、png格式'
            }, React.createElement(Upload, {
                listType: 'picture-card',
                maxCount: 1,
                beforeUpload: () => false,
                onPreview: (file) => {
                    const url = file.url || file.preview;
                    if (url) window.open(url);
                }
            }, React.createElement('div', {}, [
                React.createElement('div', { key: 'icon', style: { fontSize: '24px', marginBottom: '8px' } }, '📷'),
                React.createElement('div', { key: 'text', style: { fontSize: '14px' } }, '上传封面')
            ]))),
            
            React.createElement(Form.Item, {
                key: 'description',
                name: 'description',
                label: '直播简介'
            }, React.createElement(TextArea, {
                rows: 4,
                placeholder: '请输入直播简介',
                maxLength: 500,
                showCount: true
            })),
            
            React.createElement(Form.Item, {
                key: 'status',
                name: 'status',
                label: '直播状态'
            }, React.createElement(Select, {}, [
                React.createElement(Option, { value: 'not_started' }, '未开始'),
                React.createElement(Option, { value: 'live' }, '直播中'),
                React.createElement(Option, { value: 'ended' }, '已结束')
            ]))
        ]);
    };
    
    // 渲染微赞直播配置表单
    const renderWeizanLiveForm = () => {
        return React.createElement(Form, {
            form: liveForm,
            layout: 'vertical',
            onFinish: handleSubmit
        }, [
            React.createElement(Divider, {
                key: 'basic-divider',
                orientation: 'left'
            }, '基本信息'),
            
            React.createElement(Row, { key: 'basic-row', gutter: 16 }, [
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        key: 'title',
                        name: 'title',
                        label: React.createElement('span', {}, [
                            React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                            React.createElement('span', { key: 'text' }, ' 直播名称')
                        ]),
                        rules: [{ required: true, message: '请输入直播名称' }]
                    }, React.createElement(Input, { placeholder: '请输入直播名称' }))
                ]),
                
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        key: 'presenter',
                        name: 'presenter',
                        label: React.createElement('span', {}, [
                            React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                            React.createElement('span', { key: 'text' }, ' 主讲人')
                        ]),
                        rules: [{ required: true, message: '请输入主讲人姓名' }]
                    }, React.createElement(Input, { placeholder: '请输入主讲人姓名' }))
                ])
            ]),
            
            React.createElement(Row, { key: 'time-channel-row', gutter: 16 }, [
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        key: 'startTime',
                        name: 'startTime',
                        label: React.createElement('span', {}, [
                            React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                            React.createElement('span', { key: 'text' }, ' 开播时间')
                        ]),
                        rules: [{ required: true, message: '请选择开播时间' }]
                    }, React.createElement(DatePicker, {
                        showTime: { format: 'HH:mm' },
                        style: { width: '100%' },
                        format: 'YYYY-MM-DD HH:mm',
                        disabledDate: (current) => current && current < window.moment().startOf('day')
                    }))
                ]),
                
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        key: 'channelId',
                        name: 'channelId',
                        label: React.createElement('span', {}, [
                            React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                            React.createElement('span', { key: 'text' }, ' 所属频道')
                        ]),
                        rules: [{ required: true, message: '请选择所属频道' }]
                    }, React.createElement(Select, {
                        placeholder: '请选择频道',
                        options: channels.map(ch => ({ value: ch.id, label: ch.name }))
                    }))
                ])
            ]),
            
            React.createElement(Form.Item, {
                key: 'coverUrl',
                name: 'coverUrl',
                label: React.createElement('span', {}, [
                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                    React.createElement('span', { key: 'text' }, ' 直播封面图片')
                ]),
                rules: [{ required: true, message: '请上传直播封面图片' }],
                extra: '推荐尺寸: 1920x1080，支持jpg、png格式'
            }, React.createElement(Upload, {
                listType: 'picture-card',
                maxCount: 1,
                beforeUpload: () => false,
                onPreview: (file) => {
                    const url = file.url || file.preview;
                    if (url) window.open(url);
                }
            }, React.createElement('div', {}, [
                React.createElement('div', { key: 'icon', style: { fontSize: '24px', marginBottom: '8px' } }, '📷'),
                React.createElement('div', { key: 'text', style: { fontSize: '14px' } }, '上传封面')
            ]))),
            
            React.createElement(Form.Item, {
                key: 'description',
                name: 'description',
                label: '直播简介'
            }, React.createElement(TextArea, {
                rows: 4,
                placeholder: '请输入直播简介',
                maxLength: 500,
                showCount: true
            })),
            
            React.createElement(Divider, {
                key: 'registration-divider',
                orientation: 'left'
            }, '报名功能配置'),
            
            React.createElement(Form.Item, {
                key: 'enableRegistration',
                name: 'enableRegistration',
                valuePropName: 'checked',
                label: '是否开启报名'
            }, React.createElement(Switch, {
                checkedChildren: '开启',
                unCheckedChildren: '关闭',
                onChange: (checked) => {
                    if (!checked) {
                        liveForm.setFieldsValue({ registrationUrl: null });
                    }
                }
            })),
            
            React.createElement(Form.Item, {
                key: 'registrationUrl',
                name: 'registrationUrl',
                label: '问卷星报名链接',
                dependencies: ['enableRegistration'],
                rules: [
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (getFieldValue('enableRegistration') && !value) {
                                return Promise.reject(new Error('开启报名时必须填写问卷星报名链接'));
                            }
                            return Promise.resolve();
                        }
                    })
                ]
            }, React.createElement(Input, {
                placeholder: 'https://www.wjx.cn/jq/12345678.aspx',
                disabled: !liveForm.getFieldValue('enableRegistration')
            })),
            
            React.createElement(Divider, {
                key: 'multiple-divider',
                orientation: 'left'
            }, '多场直播配置'),
            
            React.createElement(Form.Item, {
                key: 'isMultipleSessions',
                name: 'isMultipleSessions',
                valuePropName: 'checked',
                label: '是否多场直播'
            }, React.createElement(Switch, {
                checkedChildren: '多场',
                unCheckedChildren: '单场',
                onChange: (checked) => {
                    setIsMultipleSessions(checked);
                    if (!checked) {
                        setSessions([]);
                    }
                }
            })),
            
            isMultipleSessions && React.createElement(Form.List, {
                key: 'sessions',
                name: 'sessions',
                initialValue: sessions
            }, (fields, { add, remove }) => {
                return React.createElement('div', {}, [
                    ...fields.map((field, index) => React.createElement(Card, {
                        key: field.key,
                        title: `第${index + 1}场`,
                        extra: React.createElement(Button, {
                            type: 'link',
                            danger: true,
                            onClick: () => remove(field.name)
                        }, '删除'),
                        style: { marginBottom: '16px' }
                    }, [
                        React.createElement(Form.Item, {
                            key: 'sessionName',
                            name: [field.name, 'sessionName'],
                            label: '场次名称',
                            rules: [{ required: true, message: '请输入场次名称' }]
                        }, React.createElement(Input, { placeholder: '请输入场次名称' })),
                        
                        React.createElement(Form.Item, {
                            key: 'sessionTime',
                            name: [field.name, 'sessionTime'],
                            label: '场次时间',
                            rules: [{ required: true, message: '请选择场次时间' }]
                        }, React.createElement(DatePicker, {
                            showTime: { format: 'HH:mm' },
                            style: { width: '100%' },
                            format: 'YYYY-MM-DD HH:mm'
                        })),
                        
                        React.createElement(Form.Item, {
                            key: 'sessionUrl',
                            name: [field.name, 'sessionUrl'],
                            label: '场次直播链接',
                            rules: [
                                { required: true, message: '请输入场次直播链接' },
                                { type: 'url', message: '请输入有效的URL格式' }
                            ]
                        }, React.createElement(Input, { placeholder: 'https://live.example.com/session1' }))
                    ])),
                    
                    React.createElement(Form.Item, { key: 'add-session' }, [
                        React.createElement(Button, {
                            type: 'dashed',
                            onClick: () => add(),
                            block: true,
                            icon: React.createElement('span', {}, '➕')
                        }, '添加场次')
                    ])
                ]);
            }),
            
            React.createElement(Divider, {
                key: 'materials-divider',
                orientation: 'left'
            }, '会议资料管理'),
            
            React.createElement(Form.List, {
                key: 'meetingMaterials',
                name: 'meetingMaterials',
                initialValue: meetingMaterials
            }, (fields, { add, remove }) => {
                return React.createElement('div', {}, [
                    ...fields.map((field, index) => {
                        const materialType = liveForm.getFieldValue(['meetingMaterials', field.name, 'materialType']);
                        const materialTypeLabel = materialType === 'introduction' ? '会议介绍' :
                                                  materialType === 'agenda' ? '会议议程' : '会议资料';
                        
                        return React.createElement(Card, {
                            key: field.key,
                            title: materialTypeLabel || `资料${index + 1}`,
                            extra: React.createElement(Button, {
                                type: 'link',
                                danger: true,
                                onClick: () => remove(field.name)
                            }, '删除'),
                            style: { marginBottom: '16px' }
                        }, [
                            React.createElement(Form.Item, {
                                key: 'materialType',
                                name: [field.name, 'materialType'],
                                label: '资料类型',
                                rules: [{ required: true, message: '请选择资料类型' }]
                            }, React.createElement(Select, {
                                placeholder: '选择资料类型',
                                options: [
                                    { value: 'introduction', label: '会议介绍' },
                                    { value: 'agenda', label: '会议议程' },
                                    { value: 'materials', label: '会议资料' }
                                ]
                            })),
                            
                            React.createElement(Form.Item, {
                                key: 'file',
                                name: [field.name, 'file'],
                                label: 'PDF文件',
                                rules: [{ required: true, message: '请上传PDF文件' }],
                                extra: '仅支持PDF格式，单文件大小不超过50MB'
                            }, React.createElement(Upload, {
                                accept: '.pdf',
                                maxCount: 1,
                                beforeUpload: (file) => {
                                    const isValidType = file.type === 'application/pdf';
                                    if (!isValidType) {
                                        message.error('只能上传PDF格式文件！');
                                        return false;
                                    }
                                    const isValidSize = file.size / 1024 / 1024 < 50;
                                    if (!isValidSize) {
                                        message.error('文件大小不能超过50MB！');
                                        return false;
                                    }
                                    // 设置文件名
                                    liveForm.setFieldsValue({
                                        [`meetingMaterials[${field.name}].fileName`]: file.name
                                    });
                                    return false; // 阻止自动上传
                                }
                            }, React.createElement(Button, {
                                icon: React.createElement('span', {}, '📄')
                            }, '上传PDF文件'))),
                            
                            React.createElement(Form.Item, {
                                key: 'fileName',
                                name: [field.name, 'fileName'],
                                hidden: true
                            }, React.createElement(Input)),
                            
                            React.createElement(Form.Item, {
                                key: 'fileUrl',
                                name: [field.name, 'fileUrl'],
                                hidden: true
                            }, React.createElement(Input)),
                            
                            React.createElement(Form.Item, {
                                key: 'allowDownload',
                                name: [field.name, 'allowDownload'],
                                valuePropName: 'checked',
                                label: '允许下载'
                            }, React.createElement(Switch, {
                                checkedChildren: '允许',
                                unCheckedChildren: '禁止'
                            }))
                        ]);
                    }),
                    
                    React.createElement(Form.Item, { key: 'add-material' }, [
                        React.createElement(Button, {
                            type: 'dashed',
                            onClick: () => add(),
                            block: true,
                            icon: React.createElement('span', {}, '➕')
                        }, '添加会议资料')
                    ])
                ]);
            }),
            
            React.createElement(Divider, {
                key: 'settings-divider',
                orientation: 'left'
            }, '其他设置'),
            
            React.createElement(Row, { key: 'settings-row', gutter: 16 }, [
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        key: 'quality',
                        name: 'quality',
                        label: '画质设置'
                    }, React.createElement(Select, {
                        placeholder: '选择画质',
                        options: [
                            { value: '720p', label: '720P 高清' },
                            { value: '1080p', label: '1080P 超清 (推荐)' },
                            { value: '4k', label: '4K 超高清' }
                        ]
                    }))
                ]),
                
                React.createElement(Col, { span: 12 }, [
                    React.createElement(Form.Item, {
                        key: 'bitrate',
                        name: 'bitrate',
                        label: '码率设置'
                    }, React.createElement(Select, {
                        placeholder: '选择码率',
                        options: [
                            { value: '2000', label: '2Mbps (720P推荐)' },
                            { value: '4000', label: '4Mbps (1080P推荐)' },
                            { value: '8000', label: '8Mbps (4K推荐)' }
                        ]
                    }))
                ])
            ]),
            
            React.createElement(Form.Item, {
                key: 'status',
                name: 'status',
                label: '直播状态'
            }, React.createElement(Select, {}, [
                React.createElement(Option, { value: 'not_started' }, '未开始'),
                React.createElement(Option, { value: 'live' }, '直播中'),
                React.createElement(Option, { value: 'ended' }, '已结束')
            ]))
        ]);
    };
    
    // 渲染关联展会直播配置表单
    const renderExhibitionLiveForm = () => {
        return React.createElement(Form, {
            form: liveForm,
            layout: 'vertical',
            onFinish: handleSubmit
        }, [
            React.createElement(Form.Item, {
                key: 'title',
                name: 'title',
                label: React.createElement('span', {}, [
                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                    React.createElement('span', { key: 'text' }, ' 直播名称')
                ]),
                rules: [{ required: true, message: '请输入直播名称' }]
            }, React.createElement(Input, { placeholder: '请输入直播名称' })),
            
            React.createElement(Form.Item, {
                key: 'exhibitionId',
                name: 'exhibitionId',
                label: React.createElement('span', {}, [
                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                    React.createElement('span', { key: 'text' }, ' 关联展会')
                ]),
                rules: [{ required: true, message: '请选择关联的展会' }]
            }, React.createElement(Select, {
                placeholder: '请选择展会',
                options: exhibitions.map(ex => ({
                    value: ex.id,
                    label: `${ex.name} (${ex.startDate} - ${ex.endDate})`
                }))
            })),
            
            React.createElement(Form.Item, {
                key: 'startTime',
                name: 'startTime',
                label: React.createElement('span', {}, [
                    React.createElement('span', { key: 'star', style: { color: 'red' } }, '*'),
                    React.createElement('span', { key: 'text' }, ' 开播时间')
                ]),
                rules: [{ required: true, message: '请选择开播时间' }]
            }, React.createElement(DatePicker, {
                showTime: { format: 'HH:mm' },
                style: { width: '100%' },
                format: 'YYYY-MM-DD HH:mm',
                disabledDate: (current) => current && current < window.moment().startOf('day')
            })),
            
            React.createElement(Form.Item, {
                key: 'coverUrl',
                name: 'coverUrl',
                label: '直播封面图片',
                extra: '推荐尺寸: 1920x1080，支持jpg、png格式'
            }, React.createElement(Upload, {
                listType: 'picture-card',
                maxCount: 1,
                beforeUpload: () => false,
                onPreview: (file) => {
                    const url = file.url || file.preview;
                    if (url) window.open(url);
                }
            }, React.createElement('div', {}, [
                React.createElement('div', { key: 'icon', style: { fontSize: '24px', marginBottom: '8px' } }, '📷'),
                React.createElement('div', { key: 'text', style: { fontSize: '14px' } }, '上传封面')
            ]))),
            
            React.createElement(Form.Item, {
                key: 'description',
                name: 'description',
                label: '直播简介'
            }, React.createElement(TextArea, {
                rows: 4,
                placeholder: '请输入直播简介',
                maxLength: 500,
                showCount: true
            })),
            
            React.createElement(Form.Item, {
                key: 'status',
                name: 'status',
                label: '直播状态'
            }, React.createElement(Select, {}, [
                React.createElement(Option, { value: 'not_started' }, '未开始'),
                React.createElement(Option, { value: 'live' }, '直播中'),
                React.createElement(Option, { value: 'ended' }, '已结束')
            ]))
        ]);
    };
    
    // 渲染配置表单
    const renderConfigForm = () => {
        if (selectedLiveType === 'external') {
            return renderExternalLiveForm();
        } else if (selectedLiveType === 'weizan') {
            return renderWeizanLiveForm();
        } else if (selectedLiveType === 'exhibition') {
            return renderExhibitionLiveForm();
        }
        return null;
    };
    
    // 表格列定义
    const columns = [
        {
            title: '直播信息',
            dataIndex: 'title',
            width: 300,
            render: (text, record) => React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', gap: 12 }
            }, [
                record.coverUrl && React.createElement('img', {
                    key: 'cover',
                    src: record.coverUrl,
                    alt: text,
                    style: {
                        width: 100,
                        height: 56,
                        borderRadius: 4,
                        objectFit: 'cover'
                    }
                }),
                React.createElement('div', { key: 'info' }, [
                    React.createElement('div', {
                        key: 'title',
                        style: { fontWeight: 'bold', marginBottom: 4 }
                    }, text),
                    React.createElement('div', {
                        key: 'desc',
                        style: { fontSize: '12px', color: '#666' }
                    }, record.description || '暂无简介')
                ])
            ])
        },
        {
            title: '直播类型',
            dataIndex: 'typeLabel',
            width: 120,
            render: (text, record) => React.createElement(Tag, {
                color: record.type === 'external' ? 'blue' : record.type === 'weizan' ? 'green' : 'orange'
            }, text)
        },
        {
            title: '状态',
            dataIndex: 'statusLabel',
            width: 100,
            render: (text, record) => {
                const colorMap = {
                    'not_started': 'default',
                    'live': 'red',
                    'ended': 'green'
                };
                return React.createElement(Tag, { color: colorMap[record.status] }, text);
            }
        },
        {
            title: '开播时间',
            dataIndex: 'startTime',
            width: 160
        },
        {
            title: '创建人',
            dataIndex: 'createdBy',
            width: 100
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 160
        },
        {
            title: '操作',
            width: 280,
            fixed: 'right',
            render: (_, record) => React.createElement(Space, { size: 'small' }, [
                React.createElement(Button, {
                    key: 'view',
                    size: 'small',
                    onClick: () => handleViewDetail(record)
                }, '详情'),
                React.createElement(Button, {
                    key: 'edit',
                    size: 'small',
                    onClick: () => handleEditLive(record)
                }, '编辑'),
                record.status === 'not_started' && React.createElement(Button, {
                    key: 'start',
                    size: 'small',
                    type: 'primary',
                    onClick: () => handleStartLive(record)
                }, '开始'),
                record.status === 'live' && React.createElement(Button, {
                    key: 'end',
                    size: 'small',
                    danger: true,
                    onClick: () => handleEndLive(record)
                }, '结束'),
                record.status === 'ended' && record.type === 'weizan' && React.createElement(Button, {
                    key: 'replay',
                    size: 'small',
                    onClick: () => handleGenerateReplay(record)
                }, '生成回放'),
                record.type === 'weizan' && React.createElement(Button, {
                    key: 'refresh',
                    size: 'small',
                    onClick: () => handleRefreshStatus(record)
                }, '刷新'),
                React.createElement(Popconfirm, {
                    key: 'delete',
                    title: '确定要删除这个直播吗？',
                    onConfirm: () => handleDeleteLive(record),
                    okText: '确定',
                    cancelText: '取消'
                }, React.createElement(Button, {
                    size: 'small',
                    danger: true
                }, '删除'))
            ])
        }
    ];
    
    return React.createElement('div', { className: 'live-management-page' }, [
        // 页面头部
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
                style: { margin: 0, fontSize: '24px', fontWeight: 'bold' }
            }, '直播管理'),
            React.createElement(Button, {
                key: 'create',
                type: 'primary',
                onClick: handleCreateLive
            }, '新建直播')
        ]),
        
        // 搜索和筛选区域
        React.createElement(Card, {
            key: 'search',
            style: { marginBottom: '16px' },
            bodyStyle: { padding: '16px' }
        }, [
            React.createElement(Row, {
                key: 'search-row',
                gutter: [16, 16]
            }, [
                React.createElement(Col, { span: 6 }, [
                    React.createElement(Search, {
                        placeholder: '搜索直播名称',
                        value: searchText,
                        onChange: (e) => setSearchText(e.target.value),
                        onSearch: (value) => setSearchText(value),
                        allowClear: true,
                        enterButton: true
                    })
                ]),
                
                React.createElement(Col, { span: 4 }, [
                    React.createElement(Select, {
                        placeholder: '直播类型',
                        value: typeFilter,
                        onChange: setTypeFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部类型'),
                        React.createElement(Option, { value: 'external' }, '外部链接直播'),
                        React.createElement(Option, { value: 'weizan' }, '微赞直播'),
                        React.createElement(Option, { value: 'exhibition' }, '关联展会直播')
                    ])
                ]),
                
                React.createElement(Col, { span: 4 }, [
                    React.createElement(Select, {
                        placeholder: '状态',
                        value: statusFilter,
                        onChange: setStatusFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部状态'),
                        React.createElement(Option, { value: 'not_started' }, '未开始'),
                        React.createElement(Option, { value: 'live' }, '直播中'),
                        React.createElement(Option, { value: 'ended' }, '已结束')
                    ])
                ]),
                
                React.createElement(Col, { span: 4 }, [
                    React.createElement(Select, {
                        placeholder: '创建人',
                        value: creatorFilter,
                        onChange: setCreatorFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部创建人'),
                        ...creators.map(creator => React.createElement(Option, {
                            key: creator,
                            value: creator
                        }, creator))
                    ])
                ]),
                
                React.createElement(Col, { span: 6 }, [
                    React.createElement(RangePicker, {
                        placeholder: ['开始时间', '结束时间'],
                        value: timeRange,
                        onChange: setTimeRange,
                        style: { width: '100%' },
                        format: 'YYYY-MM-DD'
                    })
                ]),
                
                React.createElement(Col, { span: 4 }, [
                    React.createElement(Space, {}, [
                        React.createElement(Button, {
                            onClick: handleResetFilters
                        }, '重置'),
                        React.createElement(Button, {
                            type: 'primary',
                            onClick: loadLiveList
                        }, '刷新')
                    ])
                ])
            ])
        ]),
        
        // 直播列表表格
        React.createElement(Card, {
            key: 'table'
        }, [
            React.createElement(Table, {
                dataSource: filteredLiveList.map((item, index) => ({ ...item, key: index })),
                columns: columns,
                loading: loading,
                pagination: {
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条记录`
                },
                scroll: { x: 1400 }
            })
        ]),
        
        // 新建/编辑直播模态框
        React.createElement(Modal, {
            key: 'modal',
            title: editingLive ? '编辑直播' : '新建直播',
            open: modalVisible,
            onCancel: () => {
                setModalVisible(false);
                setCurrentStep(0);
                setSelectedLiveType(null);
                liveForm.resetFields();
            },
            width: currentStep === 0 ? 800 : 900,
            footer: currentStep === 0 ? null : [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setModalVisible(false);
                        setCurrentStep(0);
                        setSelectedLiveType(null);
                        liveForm.resetFields();
                    }
                }, '取消'),
                currentStep === 1 && React.createElement(Button, {
                    key: 'back',
                    onClick: handleBackToTypeSelection
                }, '上一步'),
                React.createElement(Button, {
                    key: 'submit',
                    type: 'primary',
                    loading: loading,
                    onClick: () => liveForm.submit()
                }, '保存')
            ],
            bodyStyle: { maxHeight: '70vh', overflowY: 'auto' }
        }, [
            currentStep === 0 ? renderTypeSelection() : renderConfigForm()
        ]),
        
        // 详情查看模态框
        React.createElement(Modal, {
            key: 'detail-modal',
            title: '直播详情',
            open: viewDetailModalVisible,
            onCancel: () => setViewDetailModalVisible(false),
            footer: [
                React.createElement(Button, {
                    key: 'close',
                    onClick: () => setViewDetailModalVisible(false)
                }, '关闭')
            ],
            width: 800
        }, selectedLive && React.createElement('div', {}, [
            React.createElement('p', { key: 'title' }, [
                React.createElement('strong', {}, '直播名称：'),
                selectedLive.title
            ]),
            React.createElement('p', { key: 'type' }, [
                React.createElement('strong', {}, '直播类型：'),
                selectedLive.typeLabel
            ]),
            React.createElement('p', { key: 'status' }, [
                React.createElement('strong', {}, '状态：'),
                React.createElement(Tag, {
                    color: selectedLive.status === 'not_started' ? 'default' :
                           selectedLive.status === 'live' ? 'red' : 'green'
                }, selectedLive.statusLabel)
            ]),
            React.createElement('p', { key: 'startTime' }, [
                React.createElement('strong', {}, '开播时间：'),
                selectedLive.startTime
            ]),
            selectedLive.endTime && React.createElement('p', { key: 'endTime' }, [
                React.createElement('strong', {}, '结束时间：'),
                selectedLive.endTime
            ]),
            selectedLive.presenter && React.createElement('p', { key: 'presenter' }, [
                React.createElement('strong', {}, '主讲人：'),
                selectedLive.presenter
            ]),
            selectedLive.channelName && React.createElement('p', { key: 'channel' }, [
                React.createElement('strong', {}, '所属频道：'),
                selectedLive.channelName
            ]),
            selectedLive.exhibitionName && React.createElement('p', { key: 'exhibition' }, [
                React.createElement('strong', {}, '关联展会：'),
                selectedLive.exhibitionName
            ]),
            selectedLive.externalUrl && React.createElement('p', { key: 'externalUrl' }, [
                React.createElement('strong', {}, '外部链接：'),
                React.createElement('a', {
                    href: selectedLive.externalUrl,
                    target: '_blank',
                    rel: 'noopener noreferrer'
                }, selectedLive.externalUrl)
            ]),
            selectedLive.description && React.createElement('div', { key: 'description' }, [
                React.createElement('strong', {}, '直播简介：'),
                React.createElement('p', { style: { marginTop: 8 } }, selectedLive.description)
            ])
        ]))
    ]);
};

// 导出组件
window.App.pages.LiveManagement = LiveManagement;
console.log('[LiveManagement] 组件挂载成功');
