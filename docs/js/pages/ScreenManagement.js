// 大屏管理页面 - 可视化编辑版本
const ScreenManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, Switch, message, Row, Col, Statistic, Tabs, Progress, Badge, Dropdown, Menu, Tooltip, Drawer } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { TabPane } = Tabs;
    const { TextArea } = Input;

    // 状态管理
    const [activeTab, setActiveTab] = React.useState('list');
    const [loading, setLoading] = React.useState(false);
    const [screenList, setScreenList] = React.useState([
        {
            id: 1,
            name: '人民城轨数据大屏-日常版',
            type: '日常',
            resolution: '4800x1350',
            status: 'running',
            refreshInterval: 30,
            viewCount: 1234,
            lastUpdate: '2025-05-16 10:30:15',
            modules: 9,
            activeModules: 9
        },
        {
            id: 2,
            name: '协会概况',
            type: '协会版',
            resolution: '4800x1350',
            status: 'running',
            refreshInterval: 30,
            viewCount: 856,
            lastUpdate: '2025-05-16 10:30:15',
            modules: 8,
            activeModules: 8
        },
        {
            id: 3,
            name: '标准部',
            type: '标准版',
            resolution: '4800x1350',
            status: 'running',
            refreshInterval: 30,
            viewCount: 432,
            lastUpdate: '2025-05-16 10:30:15',
            modules: 6,
            activeModules: 6
        },
        {
            id: 4,
            name: '行业概况',
            type: '行业版',
            resolution: '4800x1350',
            status: 'running',
            refreshInterval: 30,
            viewCount: 678,
            lastUpdate: '2025-05-16 10:30:15',
            modules: 7,
            activeModules: 7
        },
        {
            id: 5,
            name: '评审部',
            type: '评审版',
            resolution: '4800x1350',
            status: 'running',
            refreshInterval: 30,
            viewCount: 234,
            lastUpdate: '2025-05-16 10:30:15',
            modules: 5,
            activeModules: 5
        },
        {
            id: 6,
            name: '人民城轨数据大屏-展会版',
            type: '展会',
            resolution: '4800x1350',
            status: 'stopped',
            refreshInterval: 60,
            viewCount: 567,
            lastUpdate: '2025-05-15 18:20:00',
            modules: 9,
            activeModules: 0
        },
        {
            id: 7,
            name: '人民城轨数据大屏-特殊活动版',
            type: '特殊活动',
            resolution: '4800x1350',
            status: 'maintenance',
            refreshInterval: 30,
            viewCount: 89,
            lastUpdate: '2025-05-14 09:15:00',
            modules: 9,
            activeModules: 7
        }
    ]);

    const [editingScreen, setEditingScreen] = React.useState(null);
    const [editDrawerVisible, setEditDrawerVisible] = React.useState(false);
    const [selectedModule, setSelectedModule] = React.useState(null);
    const [contentModalVisible, setContentModalVisible] = React.useState(false);
    const [controlModalVisible, setControlModalVisible] = React.useState(false);
    const [editForm] = Form.useForm();

    // 大屏模块数据
    const [screenModules, setScreenModules] = React.useState({
        weather: {
            name: '天气信息',
            type: 'weather',
            data: {
                city: '北京',
                date: '05月16日 | 周三',
                current: { temp: 33, weather: '晴转多云', wind: '东风2级' },
                forecast: [
                    { day: '昨天', date: '05/15', weather: '多云转晴', temp: '22~32℃' },
                    { day: '今天', date: '05/16', weather: '多云转晴', temp: '22~32℃' },
                    { day: '周四', date: '05/17', weather: '多云转晴', temp: '22~32℃' },
                    { day: '周五', date: '05/18', weather: '多云转晴', temp: '22~32℃' },
                    { day: '周六', date: '05/19', weather: '多云转晴', temp: '22~32℃' }
                ]
            }
        },
        traffic: {
            name: '限行尾号',
            type: 'traffic',
            data: {
                todayLimit: { numbers: '3, 8', time: '07:00-20:00' },
                tomorrowLimit: { numbers: '4, 9', time: '07:00-20:00' },
                weekSchedule: ['1/6', '2/7', '3/8', '4/9', '5/0', '不限', '不限']
            }
        },
        news: {
            name: '行业新闻',
            type: 'news',
            data: [
                { id: 1, title: '北京地铁八角游乐园站将封站到27年', date: '2025-05-28', image: 'https://via.placeholder.com/133x89' },
                { id: 2, title: '2025年福州市交通运输行业职工劳动...', date: '2025-05-28', image: 'https://via.placeholder.com/133x89' },
                { id: 3, title: '国内首个明挖车站主体结构钢筋模块...', date: '2025-05-28', image: 'https://via.placeholder.com/133x89' },
                { id: 4, title: '天津发出轨道交通文明出行倡议', date: '2025-05-27', image: 'https://via.placeholder.com/133x89' },
                { id: 5, title: '换乘地铁"免安检"!杭州又一枢纽跟进', date: '2025-05-28', image: 'https://via.placeholder.com/133x89' }
            ]
        },
        partyNews: {
            name: '党建园地',
            type: 'party_news',
            data: [
                { id: 1, title: '全国人大代表、协会会长佘才高传达学习贯彻习近平总书记重要讲话和全国两会精神', date: '2024-03-12', image: 'https://via.placeholder.com/206x123' },
                { id: 2, title: '协会党支部推进主题教育集中学习研讨', date: '2024-01-05', image: 'https://via.placeholder.com/206x123' },
                { id: 3, title: '中国城市轨道交通协会举行主题教育专题党课', date: '2023-12-29', image: 'https://via.placeholder.com/206x123' }
            ]
        },
        workPlan: {
            name: '工作规划',
            type: 'work_plan',
            data: [
                { id: 1, title: '城轨业主领导人峰会', month: '6月' },
                { id: 2, title: '2025北京-青岛国际城市轨道交通展...', month: '9月' },
                { id: 3, title: '首届中国城市轨道交通学术年会', month: '9月' },
                { id: 4, title: '第二届中国城市轨道交通科普展示会', month: '9月' },
                { id: 5, title: '第二届中国城市轨道交通高技术成果...', month: '9月' }
            ]
        },
        memberStats: {
            name: '会员单位概况',
            type: 'member_stats',
            data: {
                total: 1129,
                categories: [
                    { name: '副会长会员名录', value: 28 },
                    { name: '常务理事会员名录', value: 92 },
                    { name: '理事会员名录', value: 384 },
                    { name: '普通会员名录', value: 625 },
                    { name: '申请入会单位', value: 18 }
                ]
            }
        },
        industryStats: {
            name: '行业统计',
            type: 'industry_stats',
            data: {
                title: '2024年各城市城轨交通运营总里程（公里）',
                cities: [
                    { name: '上海', value: 850 }, { name: '北京', value: 780 },
                    { name: '广州', value: 620 }, { name: '成都', value: 580 },
                    { name: '深圳', value: 520 }, { name: '武汉', value: 480 }
                ]
            }
        },
        brandActivity: {
            name: '品牌活动',
            type: 'brand_activity',
            data: {
                title: 'Metrotrains',
                image: 'https://via.placeholder.com/1700x387',
                description: '品牌活动图片展示'
            }
        },
        live: {
            name: '活动直播',
            type: 'live',
            data: {
                title: '活动直播',
                videoUrl: 'https://via.placeholder.com/553x562',
                isLive: true
            }
        },
        // 协会概况模块
        associationInfo: {
            name: '协会基本信息',
            type: 'association_info',
            data: {
                fullName: '中国城市轨道交通协会',
                englishName: 'China Association of Metros',
                established: '2013年12月',
                nature: '全国性行业组织',
                members: '1129家会员单位',
                coverage: '覆盖全国59个城市'
            }
        },
        organization: {
            name: '组织结构',
            type: 'organization',
            data: {
                president: '佘才高',
                vicePresidents: ['韦明', '马超', '李国勇', '肖杰', '许建平'],
                secretaryGeneral: '宋敏华',
                committees: ['标准化委员会', '职业教育委员会', '科技创新委员会', '绿色智能委员会']
            }
        },
        development: {
            name: '发展历程',
            type: 'development',
            data: [
                { year: '2013', event: '协会成立，获民政部批准' },
                { year: '2015', event: '会员单位突破500家' },
                { year: '2019', event: '获职称评审授权' },
                { year: '2022', event: '会员单位突破1000家' },
                { year: '2024', event: '获正高级职称评审资格' }
            ]
        },
        achievements: {
            name: '主要成就',
            type: 'achievements',
            data: {
                standards: '发布行业标准156项',
                training: '培训专业人才18000人次',
                conferences: '举办大型会议300余场',
                awards: '获国家级奖项23项'
            }
        },
        services: {
            name: '服务内容',
            type: 'services',
            data: [
                { category: '标准制定', items: ['技术标准', '管理规范', '质量认证'] },
                { category: '人才培养', items: ['职业培训', '职称评审', '学术交流'] },
                { category: '行业服务', items: ['展览展示', '咨询服务', '信息发布'] }
            ]
        },
        contact: {
            name: '联系方式',
            type: 'contact',
            data: {
                address: '北京市海淀区复兴路12号',
                phone: '010-88521234',
                email: 'info@camet.org.cn',
                website: 'www.camet.org.cn',
                wechat: '中国城市轨道交通协会'
            }
        },
        // 标准部模块
        standardStats: {
            name: '标准制定统计',
            type: 'standard_stats',
            data: {
                total: 156,
                published: 143,
                drafting: 13,
                categories: [
                    { name: '技术标准', count: 89 },
                    { name: '管理标准', count: 42 },
                    { name: '工作标准', count: 25 }
                ]
            }
        },
        technicalSpecs: {
            name: '技术规范',
            type: 'technical_specs',
            data: [
                { code: 'T/CAMET 01001-2024', name: '城市轨道交通车辆技术条件', status: '已发布' },
                { code: 'T/CAMET 01002-2024', name: '城市轨道交通信号系统技术规范', status: '已发布' },
                { code: 'T/CAMET 01003-2024', name: '城市轨道交通供电系统技术要求', status: '征求意见' }
            ]
        },
        qualityCert: {
            name: '质量认证',
            type: 'quality_cert',
            data: {
                certifiedCompanies: 89,
                certifiedProducts: 234,
                categories: ['车辆制造', '信号系统', '供电设备', '轨道设备']
            }
        },
        standardRelease: {
            name: '标准发布',
            type: 'standard_release',
            data: [
                { title: '城轨交通碳排放核算技术规范', date: '2024-12', status: '最新' },
                { title: '城轨交通智能运维系统技术要求', date: '2024-11', status: '最新' },
                { title: '城轨交通安全风险分级管控指南', date: '2024-10', status: '已发布' }
            ]
        },
        workflow: {
            name: '工作流程',
            type: 'workflow',
            data: {
                steps: ['立项申请', '起草', '征求意见', '技术审查', '批准发布', '宣贯实施']
            }
        },
        latestStandards: {
            name: '最新标准',
            type: 'latest_standards',
            data: [
                { code: 'T/CAMET 04023-2024', name: '城市轨道交通绿色车站评价标准', date: '2024-12-15' },
                { code: 'T/CAMET 04024-2024', name: '城市轨道交通智能检测技术规范', date: '2024-12-10' },
                { code: 'T/CAMET 04025-2024', name: '城市轨道交通应急预案编制指南', date: '2024-12-05' }
            ]
        },
        applicationCases: {
            name: '标准应用案例',
            type: 'application_cases',
            data: [
                { project: '北京地铁17号线', standard: 'T/CAMET 01001-2024', effect: '提升车辆性能20%' },
                { project: '上海地铁18号线', standard: 'T/CAMET 01002-2024', effect: '降低故障率35%' },
                { project: '广州地铁22号线', standard: 'T/CAMET 01003-2024', effect: '节能减排15%' }
            ]
        },
        // 行业概况模块
        cityDistribution: {
            name: '城市分布统计',
            type: 'city_distribution',
            data: {
                totalCities: 59,
                totalLines: 361,
                totalMileage: 12160.77,
                regions: [
                    { name: '华东', cities: 23, mileage: 4580 },
                    { name: '华北', cities: 12, mileage: 2890 },
                    { name: '华南', cities: 11, mileage: 2450 },
                    { name: '西南', cities: 8, mileage: 1560 },
                    { name: '其他', cities: 5, mileage: 680 }
                ]
            }
        },
        operationMileage: {
            name: '运营里程统计',
            type: 'operation_mileage',
            data: [
                { city: '上海', mileage: 850, lines: 20 },
                { city: '北京', mileage: 780, lines: 27 },
                { city: '广州', mileage: 620, lines: 16 },
                { city: '成都', mileage: 580, lines: 14 },
                { city: '深圳', mileage: 520, lines: 16 },
                { city: '武汉', mileage: 480, lines: 13 },
                { city: '杭州', mileage: 420, lines: 11 },
                { city: '重庆', mileage: 405, lines: 10 }
            ]
        },
        passengerVolume: {
            name: '客运量统计',
            type: 'passenger_volume',
            data: {
                totalAnnual: 322.57,
                dailyAverage: 88.3,
                topCities: [
                    { city: '北京', volume: 38.5 },
                    { city: '上海', volume: 35.2 },
                    { city: '广州', volume: 28.6 },
                    { city: '深圳', volume: 21.3 }
                ]
            }
        },
        vehicleTypes: {
            name: '车辆制式分布',
            type: 'vehicle_types',
            data: {
                types: [
                    { name: 'A型车', percentage: 45, count: 12500 },
                    { name: 'B型车', percentage: 35, count: 9800 },
                    { name: 'L型车', percentage: 12, count: 3200 },
                    { name: '有轨电车', percentage: 8, count: 2100 }
                ]
            }
        },
        headwayStats: {
            name: '发车间隔统计',
            type: 'headway_stats',
            data: {
                minInterval: 90,
                avgInterval: 180,
                peakInterval: 120,
                offPeakInterval: 300
            }
        },
        automatedLines: {
            name: '全自动运行线路',
            type: 'automated_lines',
            data: {
                totalLines: 54,
                totalMileage: 1484.43,
                cities: 23,
                latestProjects: [
                    { city: '北京', line: '地铁17号线', length: 49.7 },
                    { city: '上海', line: '地铁18号线', length: 36.8 },
                    { city: '深圳', line: '地铁12号线', length: 40.5 }
                ]
            }
        },
        cityGroupDistribution: {
            name: '城市群分布',
            type: 'city_group_distribution',
            data: [
                { name: '京津冀', mileage: 2890, percentage: 24 },
                { name: '长三角', mileage: 3580, percentage: 29 },
                { name: '珠三角', mileage: 2450, percentage: 20 },
                { name: '成渝', mileage: 1560, percentage: 13 },
                { name: '其他', mileage: 1680, percentage: 14 }
            ]
        },
        systemRatio: {
            name: '制式占比分布',
            type: 'system_ratio',
            data: [
                { name: '地铁', percentage: 78, mileage: 9485 },
                { name: '轻轨', percentage: 12, mileage: 1459 },
                { name: '单轨', percentage: 5, mileage: 608 },
                { name: '有轨电车', percentage: 5, mileage: 608 }
            ]
        },
        // 评审部模块
        reviewIntro: {
            name: '职称评审介绍',
            type: 'review_intro',
            data: {
                scope: '非公有制经济领域城轨交通专业技术人员',
                levels: ['初级', '中级', '高级', '正高级'],
                specialties: ['城轨运输', '城轨车辆', '城轨电务', '城轨线路工程'],
                directions: 8,
                totalApplied: 2897,
                totalPassed: 1752,
                years: 6
            }
        },
        applicationStats: {
            name: '申报情况统计',
            type: 'application_stats',
            data: [
                { year: '2019', count: 73 },
                { year: '2020', count: 102 },
                { year: '2021-2022', count: 1095 },
                { year: '2023', count: 780 },
                { year: '2024', count: 847 }
            ]
        },
        passStats: {
            name: '评审通过情况',
            type: 'pass_stats',
            data: [
                { year: '2019', count: 21 },
                { year: '2020', count: 49 },
                { year: '2021-2022', count: 684 },
                { year: '2023', count: 496 },
                { year: '2024', count: 502 }
            ]
        },
        applicantUnits: {
            name: '申报人员单位属性',
            type: 'applicant_units',
            data: {
                member: { count: 1450, percentage: 50 },
                nonMember: { count: 1447, percentage: 50 }
            }
        },
        passUnits: {
            name: '通过人员单位属性',
            type: 'pass_units',
            data: {
                member: { count: 876, percentage: 50 },
                nonMember: { count: 876, percentage: 50 }
            }
        },
        professionalRatio: {
            name: '专业占比统计',
            type: 'professional_ratio',
            data: [
                { name: '城市轨道车辆', applied: 455, passed: 270 },
                { name: '城市轨道运输', applied: 337, passed: 202 },
                { name: '城市轨道线路', applied: 498, passed: 273 },
                { name: '城市轨道电务', applied: 1607, passed: 1007 }
            ]
        },
        regionalDistribution: {
            name: '地域分布统计',
            type: 'regional_distribution',
            data: [
                { province: '北京', applied: 720, passed: 410 },
                { province: '上海', applied: 91, passed: 60 },
                { province: '广东', applied: 1151, passed: 728 },
                { province: '四川', applied: 244, passed: 154 },
                { province: '江苏', applied: 83, passed: 56 },
                { province: '浙江', applied: 57, passed: 26 }
            ]
        },
        levelStats: {
            name: '各级别人数统计',
            type: 'level_stats',
            data: {
                junior: { applied: 904, passed: 604 },
                intermediate: { applied: 1170, passed: 753 },
                senior: { applied: 786, passed: 382 },
                seniorProfessional: { applied: 37, passed: 13 }
            }
        }
    });

    // 获取状态标签
    const getStatusTag = (status) => {
        const statusMap = {
            running: { color: 'green', text: '🟢 运行中' },
            stopped: { color: 'default', text: '🔴 已停止' },
            maintenance: { color: 'orange', text: '🟡 维护中' }
        };
        const config = statusMap[status] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    // 操作菜单
    const getActionMenu = (record) => {
        return React.createElement(Menu, {
            onClick: ({ key }) => handleMenuAction(key, record)
        }, [
            React.createElement(Menu.Item, { key: 'edit' }, '🖥️ 可视化编辑'),
            React.createElement(Menu.Item, { key: 'control' }, '🎛️ 实时控制'),
            React.createElement(Menu.Item, { key: 'monitor' }, '📊 运行监控'),
            React.createElement(Menu.Divider, { key: 'divider' }),
            record.status === 'running' ? 
                React.createElement(Menu.Item, { key: 'stop', danger: true }, '⏸️ 停止运行') :
                React.createElement(Menu.Item, { key: 'start' }, '▶️ 启动运行')
        ]);
    };

    // 处理菜单操作
    const handleMenuAction = (action, record) => {
        switch(action) {
            case 'edit':
                setEditingScreen(record);
                setActiveTab('editor');
                message.success('进入可视化编辑模式');
                break;
            case 'control':
                setEditingScreen(record);
                setControlModalVisible(true);
                break;
            case 'monitor':
                setActiveTab('monitor');
                message.info('切换到监控页面');
                break;
            case 'start':
                handleStartScreen(record);
                break;
            case 'stop':
                handleStopScreen(record);
                break;
        }
    };

    // 启动大屏
    const handleStartScreen = (record) => {
        setLoading(true);
        setTimeout(() => {
            setScreenList(prev => prev.map(item => 
                item.id === record.id ? { ...item, status: 'running' } : item
            ));
            setLoading(false);
            message.success(`大屏"${record.name}"已启动`);
        }, 1000);
    };

    // 停止大屏
    const handleStopScreen = (record) => {
        setLoading(true);
        setTimeout(() => {
            setScreenList(prev => prev.map(item => 
                item.id === record.id ? { ...item, status: 'stopped' } : item
            ));
            setLoading(false);
            message.warning(`大屏"${record.name}"已停止`);
        }, 1000);
    };

    // 点击模块进行编辑
    const handleModuleClick = (moduleKey, moduleName) => {
        setSelectedModule(moduleKey);
        setEditDrawerVisible(true);
        editForm.setFieldsValue(screenModules[moduleKey].data);
    };

    // 保存模块内容
    const handleSaveModule = async () => {
        try {
            const values = await editForm.validateFields();
            setScreenModules(prev => ({
                ...prev,
                [selectedModule]: {
                    ...prev[selectedModule],
                    data: values
                }
            }));
            message.success('模块内容已更新');
            setEditDrawerVisible(false);
        } catch (error) {
            message.error('请完善表单信息');
        }
    };

    // 紧急播报
    const handleEmergencyBroadcast = () => {
        Modal.confirm({
            title: '📢 紧急播报',
            content: React.createElement('div', {}, [
                React.createElement('p', { key: 'desc' }, '确定向所有运行中的大屏发送紧急播报消息吗？'),
                React.createElement(TextArea, {
                    key: 'input',
                    id: 'broadcastInput',
                    placeholder: '请输入播报内容...',
                    rows: 4,
                    style: { marginTop: 16 }
                })
            ]),
            okText: '立即发布',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                message.success('紧急播报已发送到所有大屏');
            }
        });
    };

    // 渲染真实大屏界面
    const renderScreenEditor = () => {
        if (!editingScreen) return null;

        return React.createElement('div', {
            style: {
                background: '#f0f2f5',
                minHeight: 'calc(100vh - 200px)',
                padding: '12px'
            }
        }, [
            // 精简工具栏
            React.createElement('div', {
                key: 'toolbar',
                style: {
                    background: '#fff',
                    padding: '8px 16px',
                    marginBottom: '8px',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }
            }, [
                React.createElement(Button, {
                    key: 'back',
                    onClick: () => setActiveTab('list')
                }, '← 返回列表'),
                React.createElement('div', {
                    key: 'center',
                    style: { display: 'flex', alignItems: 'center', gap: 12 }
                }, [
                    React.createElement('span', { key: 'icon', style: { fontSize: 16 } }, '💡'),
                    React.createElement('span', { key: 'text', style: { fontSize: 14 } }, '点击下方大屏中的任意模块即可编辑内容，修改后点击"保存修改"应用到大屏')
                ]),
                React.createElement(Space, { key: 'right' }, [
                    React.createElement(Tag, {
                        key: 'status',
                        color: editingScreen.status === 'running' ? 'green' : 'default',
                        size: 'small'
                    }, editingScreen.status === 'running' ? '🟢 运行中' : '🔴 已停止'),
                    React.createElement(Button, {
                        key: 'preview',
                        type: 'primary',
                        size: 'small',
                        onClick: () => message.success('预览功能演示')
                    }, '👁️ 预览大屏'),
                    React.createElement(Button, {
                        key: 'save',
                        type: 'primary',
                        size: 'small'
                    }, '💾 保存修改')
                ])
            ]),

            // 真实大屏界面（放大显示）
            React.createElement('div', {
                key: 'screen',
                style: {
                    background: '#165faf',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transform: 'scale(0.4)',
                    transformOrigin: 'top left',
                    width: '4800px',
                    height: '1350px',
                    position: 'relative',
                    margin: '0 auto'
                }
            }, renderScreenContent(editingScreen))
        ]);
    };

    // 渲染单个模块（可点击编辑）
    const renderModule = (moduleKey, position) => {
        const module = screenModules[moduleKey];
        if (!module) return null;

        return React.createElement('div', {
            key: moduleKey,
            style: {
                position: 'absolute',
                ...position,
                background: 'rgba(25, 74, 122, 0.9)',
                border: '2px solid #4174a7',
                borderRadius: '6px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                overflow: 'hidden'
            },
            onClick: () => handleModuleClick(moduleKey, module.name),
            onMouseEnter: (e) => {
                e.currentTarget.style.background = 'rgba(25, 74, 122, 1)';
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(65, 116, 167, 0.5)';
            },
            onMouseLeave: (e) => {
                e.currentTarget.style.background = 'rgba(25, 74, 122, 0.9)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
            }
        }, [
            // 编辑图标
            React.createElement('div', {
                key: 'edit-icon',
                style: {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    fontSize: '14px',
                    color: '#fff'
                }
            }, '✏️ 点击编辑'),

            // 模块标题
            React.createElement('div', {
                key: 'title',
                style: {
                    color: '#fff',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginBottom: '12px'
                }
            }, module.name),

            // 模块内容预览
            React.createElement('div', {
                key: 'content',
                style: {
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '16px'
                }
            }, renderModulePreview(moduleKey, module))
        ]);
    };

    // 渲染模块内容预览
    const renderModulePreview = (moduleKey, module) => {
        switch(moduleKey) {
            case 'weather':
                return `${module.data.city} ${module.data.current.temp}℃ ${module.data.current.weather}`;
            case 'traffic':
                return `今日限行: ${module.data.todayLimit.numbers}`;
            case 'news':
                return `${module.data.length} 条新闻`;
            case 'partyNews':
                return `${module.data.length} 条党建资讯`;
            case 'workPlan':
                return `${module.data.length} 项工作规划`;
            case 'memberStats':
                return `会员总数: ${module.data.total}`;
            case 'industryStats':
                return `${module.data.cities.length} 个城市数据`;
            case 'brandActivity':
                return module.data.title;
            case 'live':
                return module.data.isLive ? '🔴 直播中' : '暂无直播';
            // 协会概况模块
            case 'associationInfo':
                return `${module.data.fullName} | ${module.data.members}`;
            case 'organization':
                return `会长：${module.data.president} | ${module.data.committees.length}个专业委员会`;
            case 'development':
                return `${module.data.length}个重要里程碑`;
            case 'achievements':
                return `${module.data.standards} | ${module.data.training}`;
            case 'services':
                return `${module.data.length}大服务类别`;
            case 'contact':
                return `${module.data.address} | ${module.data.phone}`;
            // 标准部模块
            case 'standardStats':
                return `已发布标准${module.data.published}项 | 在编${module.data.drafting}项`;
            case 'technicalSpecs':
                return `${module.data.length}项技术规范`;
            case 'qualityCert':
                return `认证企业${module.data.certifiedCompanies}家 | 认证产品${module.data.certifiedProducts}个`;
            case 'standardRelease':
                return `最新发布${module.data.length}项标准`;
            case 'workflow':
                return `标准制定流程：${module.data.steps.length}个步骤`;
            case 'latestStandards':
                return `${module.data.length}项最新标准`;
            case 'applicationCases':
                return `${module.data.length}个应用案例`;
            // 行业概况模块
            case 'cityDistribution':
                return `全国${module.data.totalCities}个城市 | ${module.data.totalLines}条线路 | ${module.data.totalMileage}公里`;
            case 'operationMileage':
                return `${module.data.length}个主要城市运营数据`;
            case 'passengerVolume':
                return `年客运量${module.data.totalAnnual}亿人次 | 日均${module.data.dailyAverage}万人次`;
            case 'vehicleTypes':
                return `${module.data.types.length}种车辆制式`;
            case 'headwayStats':
                return `最小间隔${module.data.minInterval}秒 | 平均${module.data.avgInterval}秒`;
            case 'automatedLines':
                return `${module.data.totalLines}条全自动线路 | ${module.data.totalMileage}公里`;
            case 'cityGroupDistribution':
                return `${module.data.length}个城市群分布`;
            case 'systemRatio':
                return `${module.data.length}种制式占比统计`;
            // 评审部模块
            case 'reviewIntro':
                return `${module.data.years}年职称评审 | 累计申报${module.data.totalApplied}人 | 通过${module.data.totalPassed}人`;
            case 'applicationStats':
                return `${module.data.length}年申报统计数据`;
            case 'passStats':
                return `${module.data.length}年通过统计数据`;
            case 'applicantUnits':
                return `会员单位${module.data.member.percentage}% | 非会员${module.data.nonMember.percentage}%`;
            case 'passUnits':
                return `会员单位${module.data.member.percentage}% | 非会员${module.data.nonMember.percentage}%`;
            case 'professionalRatio':
                return `${module.data.length}个专业类别统计`;
            case 'regionalDistribution':
                return `${module.data.length}个省市地域分布`;
            case 'levelStats':
                return `初级${module.data.junior.passed}人 | 中级${module.data.intermediate.passed}人 | 高级${module.data.senior.passed}人`;
            default:
                return '点击编辑内容';
        }
    };

    // 渲染编辑抽屉
    const renderEditDrawer = () => {
        if (!selectedModule) return null;
        
        const module = screenModules[selectedModule];
        
        return React.createElement(Drawer, {
            title: `编辑模块：${module.name}`,
            visible: editDrawerVisible,
            onClose: () => setEditDrawerVisible(false),
            width: 600,
            footer: React.createElement('div', {
                style: { textAlign: 'right' }
            }, React.createElement(Space, {}, [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => setEditDrawerVisible(false)
                }, '取消'),
                React.createElement(Button, {
                    key: 'save',
                    type: 'primary',
                    onClick: handleSaveModule
                }, '保存')
            ]))
        }, React.createElement(Form, {
            form: editForm,
            layout: 'vertical'
        }, renderModuleEditForm(selectedModule, module)));
    };

    // 渲染不同模块的编辑表单
    const renderModuleEditForm = (moduleKey, module) => {
        switch(moduleKey) {
            case 'news':
                return renderNewsEditForm(module);
            case 'partyNews':
                return renderPartyNewsEditForm(module);
            case 'workPlan':
                return renderWorkPlanEditForm(module);
            case 'traffic':
                return renderTrafficEditForm(module);
            case 'memberStats':
                return renderMemberStatsEditForm(module);
            default:
                return React.createElement('div', {
                    style: { padding: 40, textAlign: 'center', color: '#666' }
                }, `${module.name}内容编辑功能`);
        }
    };

    // 新闻编辑表单
    const renderNewsEditForm = (module) => {
        return React.createElement('div', {}, [
            React.createElement('h4', { key: 'title', style: { marginBottom: 16 } }, '行业新闻列表'),
            module.data.map((news, index) => 
                React.createElement(Card, {
                    key: news.id,
                    size: 'small',
                    style: { marginBottom: 12 }
                }, [
                    React.createElement(Form.Item, {
                        key: `title-${index}`,
                        label: `新闻${index + 1}标题`,
                        name: [index, 'title'],
                        initialValue: news.title
                    }, React.createElement(Input, { placeholder: '请输入新闻标题' })),
                    React.createElement(Row, { key: 'row', gutter: 16 }, [
                        React.createElement(Col, { key: 'date', span: 12 },
                            React.createElement(Form.Item, {
                                label: '发布日期',
                                name: [index, 'date'],
                                initialValue: news.date
                            }, React.createElement(Input, { placeholder: '2025-05-28' }))
                        ),
                        React.createElement(Col, { key: 'actions', span: 12 },
                            React.createElement('div', { style: { paddingTop: 30 } },
                                React.createElement(Space, {}, [
                                    React.createElement(Button, { key: 'up', size: 'small' }, '↑'),
                                    React.createElement(Button, { key: 'down', size: 'small' }, '↓'),
                                    React.createElement(Button, { key: 'delete', size: 'small', danger: true }, '删除')
                                ])
                            )
                        )
                    ])
                ])
            ),
            React.createElement(Button, {
                key: 'add',
                type: 'dashed',
                block: true,
                style: { marginTop: 16 }
            }, '+ 添加新闻')
        ]);
    };

    // 党建新闻编辑表单
    const renderPartyNewsEditForm = (module) => {
        return React.createElement('div', {}, [
            React.createElement('h4', { key: 'title', style: { marginBottom: 16 } }, '党建园地内容'),
            module.data.map((news, index) =>
                React.createElement(Card, {
                    key: news.id,
                    size: 'small',
                    style: { marginBottom: 12 }
                }, [
                    React.createElement(Form.Item, {
                        key: `title-${index}`,
                        label: `标题`,
                        initialValue: news.title
                    }, React.createElement(TextArea, { rows: 2, placeholder: '请输入标题' })),
                    React.createElement(Form.Item, {
                        key: `date-${index}`,
                        label: '日期',
                        initialValue: news.date
                    }, React.createElement(Input, { placeholder: '2024-03-12' })),
                    React.createElement(Button, {
                        key: 'delete',
                        danger: true,
                        size: 'small'
                    }, '删除此项')
                ])
            ),
            React.createElement(Button, {
                key: 'add',
                type: 'dashed',
                block: true
            }, '+ 添加党建资讯')
        ]);
    };

    // 工作规划编辑表单
    const renderWorkPlanEditForm = (module) => {
        return React.createElement('div', {}, [
            React.createElement('h4', { key: 'title', style: { marginBottom: 16 } }, '近期工作规划'),
            module.data.map((plan, index) =>
                React.createElement(Card, {
                    key: plan.id,
                    size: 'small',
                    style: { marginBottom: 8 }
                }, React.createElement(Row, { gutter: 16, align: 'middle' }, [
                    React.createElement(Col, { key: 'title', span: 16 },
                        React.createElement(Input, {
                            defaultValue: plan.title,
                            placeholder: '活动名称'
                        })
                    ),
                    React.createElement(Col, { key: 'month', span: 4 },
                        React.createElement(Input, {
                            defaultValue: plan.month,
                            placeholder: '月份'
                        })
                    ),
                    React.createElement(Col, { key: 'actions', span: 4 },
                        React.createElement(Button, {
                            danger: true,
                            size: 'small',
                            block: true
                        }, '删除')
                    )
                ]))
            ),
            React.createElement(Button, {
                key: 'add',
                type: 'dashed',
                block: true,
                style: { marginTop: 12 }
            }, '+ 添加工作规划')
        ]);
    };

    // 限行尾号编辑表单
    const renderTrafficEditForm = (module) => {
        return React.createElement('div', {}, [
            React.createElement(Form.Item, {
                key: 'today',
                label: '今日限行尾号',
                name: ['todayLimit', 'numbers'],
                initialValue: module.data.todayLimit.numbers
            }, React.createElement(Input, { placeholder: '例如：3, 8' })),
            
            React.createElement(Form.Item, {
                key: 'tomorrow',
                label: '明日限行尾号',
                name: ['tomorrowLimit', 'numbers'],
                initialValue: module.data.tomorrowLimit.numbers
            }, React.createElement(Input, { placeholder: '例如：4, 9' })),
            
            React.createElement(Form.Item, {
                key: 'time',
                label: '限行时间',
                name: ['todayLimit', 'time'],
                initialValue: module.data.todayLimit.time
            }, React.createElement(Input, { placeholder: '例如：07:00-20:00' })),

            React.createElement('h4', { key: 'week-title', style: { marginTop: 24 } }, '本周限行安排'),
            React.createElement('div', { key: 'week-schedule' },
                module.data.weekSchedule.map((limit, index) =>
                    React.createElement(Form.Item, {
                        key: `day-${index}`,
                        label: `星期${['一', '二', '三', '四', '五', '六', '日'][index]}`
                    }, React.createElement(Input, {
                        defaultValue: limit,
                        placeholder: '例如：1/6 或 不限'
                    }))
                )
            )
        ]);
    };

    // 会员统计编辑表单
    const renderMemberStatsEditForm = (module) => {
        return React.createElement('div', {}, [
            React.createElement(Form.Item, {
                key: 'total',
                label: '会员单位总数',
                name: 'total',
                initialValue: module.data.total
            }, React.createElement(Input, { type: 'number', placeholder: '1129' })),
            
            React.createElement('h4', { key: 'categories-title', style: { marginTop: 24 } }, '会员分类统计'),
            module.data.categories.map((category, index) =>
                React.createElement(Form.Item, {
                    key: index,
                    label: category.name
                }, React.createElement(Input, {
                    type: 'number',
                    defaultValue: category.value,
                    placeholder: '数量'
                }))
            )
        ]);
    };

    // 实时控制弹窗
    const renderControlModal = () => {
        return React.createElement(Modal, {
            title: '🎛️ 实时控制中心',
            visible: controlModalVisible,
            onCancel: () => setControlModalVisible(false),
            footer: [
                React.createElement(Button, {
                    key: 'close',
                    onClick: () => setControlModalVisible(false)
                }, '关闭')
            ],
            width: 700
        }, React.createElement('div', {}, [
            React.createElement(Card, {
                key: 'actions',
                size: 'small',
                title: '快捷操作',
                style: { marginBottom: 16 }
            }, React.createElement(Space, { direction: 'vertical', style: { width: '100%' } }, [
                React.createElement(Button, {
                    key: 'refresh',
                    block: true,
                    size: 'large',
                    onClick: () => message.success('全屏刷新指令已发送')
                }, '🔄 刷新全屏'),
                React.createElement(Button, {
                    key: 'screenshot',
                    block: true,
                    size: 'large',
                    onClick: () => message.success('屏幕截图已保存')
                }, '📷 截取屏幕'),
                React.createElement(Button, {
                    key: 'broadcast',
                    block: true,
                    size: 'large',
                    type: 'primary',
                    danger: true,
                    onClick: handleEmergencyBroadcast
                }, '📢 紧急播报')
            ])),

            React.createElement(Card, {
                key: 'modules',
                size: 'small',
                title: '模块控制'
            }, React.createElement('div', { style: { maxHeight: 400, overflowY: 'auto' } },
                Object.entries(screenModules).map(([key, module]) =>
                    React.createElement('div', {
                        key: key,
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px',
                            borderBottom: '1px solid #f0f0f0'
                        }
                    }, [
                        React.createElement('div', { key: 'info' }, [
                            React.createElement('div', {
                                key: 'name',
                                style: { fontWeight: 'bold' }
                            }, module.name),
                            React.createElement('div', {
                                key: 'status',
                                style: { fontSize: 12, color: '#666', marginTop: 4 }
                            }, `状态: 🟢 显示 | 更新: ${new Date().toLocaleTimeString()}`)
                        ]),
                        React.createElement(Space, { key: 'actions' }, [
                            React.createElement(Button, {
                                key: 'hide',
                                size: 'small',
                                onClick: () => message.success(`${module.name}已隐藏`)
                            }, '隐藏'),
                            React.createElement(Button, {
                                key: 'refresh',
                                size: 'small',
                                type: 'primary',
                                onClick: () => message.success(`${module.name}已刷新`)
                            }, '刷新')
                        ])
                    ])
                )
            ))
        ]));
    };

    // 表格列定义
    const columns = [
        {
            title: '大屏名称',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            render: (text, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'name',
                    style: { fontWeight: 'bold', marginBottom: 4 }
                }, text),
                React.createElement('div', {
                    key: 'meta',
                    style: { fontSize: 12, color: '#666' }
                }, `${record.type} | ${record.resolution}`)
            ])
        },
        {
            title: '状态',
            key: 'status',
            width: 120,
            render: (_, record) => getStatusTag(record.status)
        },
        {
            title: '模块状态',
            key: 'modules',
            width: 120,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'count',
                    style: { fontSize: 14 }
                }, `${record.activeModules}/${record.modules}`),
                React.createElement('div', {
                    key: 'label',
                    style: { fontSize: 12, color: '#666' }
                }, '活跃/总数')
            ])
        },
        {
            title: '访问统计',
            key: 'views',
            width: 100,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'count',
                    style: { fontSize: 14, fontWeight: 'bold' }
                }, record.viewCount),
                React.createElement('div', {
                    key: 'label',
                    style: { fontSize: 12, color: '#666' }
                }, '次访问')
            ])
        },
        {
            title: '最后更新',
            dataIndex: 'lastUpdate',
            key: 'lastUpdate',
            width: 150
        },
        {
            title: '刷新间隔',
            key: 'refresh',
            width: 100,
            render: (_, record) => `${record.refreshInterval}秒`
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            fixed: 'right',
            render: (_, record) => React.createElement(Space, {}, [
                React.createElement(Tooltip, {
                    key: 'edit',
                    title: '可视化编辑'
                }, React.createElement(Button, {
                    type: 'primary',
                    size: 'small',
                    onClick: () => handleMenuAction('edit', record)
                }, '🖥️ 配置')),
                React.createElement(Dropdown, {
                    key: 'more',
                    overlay: getActionMenu(record),
                    trigger: ['click']
                }, React.createElement(Button, {
                    type: 'link',
                    size: 'small'
                }, '更多 ▼'))
            ])
        }
    ];

    // 渲染列表页面
    const renderListPage = () => {
        return React.createElement('div', {}, [
            // 统计卡片
            React.createElement(Row, {
                key: 'stats',
                gutter: 16,
                style: { marginBottom: 24 }
            }, [
                React.createElement(Col, { key: 'total', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '大屏总数',
                            value: screenList.length,
                            prefix: '🖥️',
                            valueStyle: { color: '#1890ff' }
                        })
                    )
                ),
                React.createElement(Col, { key: 'running', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '运行中',
                            value: screenList.filter(s => s.status === 'running').length,
                            prefix: '🟢',
                            valueStyle: { color: '#52c41a' }
                        })
                    )
                ),
                React.createElement(Col, { key: 'views', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '总访问量',
                            value: screenList.reduce((sum, s) => sum + s.viewCount, 0),
                            prefix: '👁️',
                            valueStyle: { color: '#faad14' }
                        })
                    )
                ),
                React.createElement(Col, { key: 'modules', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '活跃模块',
                            value: screenList.reduce((sum, s) => sum + s.activeModules, 0),
                            suffix: `/ ${screenList.reduce((sum, s) => sum + s.modules, 0)}`,
                            prefix: '📊',
                            valueStyle: { color: '#722ed1' }
                        })
                    )
                )
            ]),

            // 筛选栏
            React.createElement(Card, {
                key: 'filters',
                size: 'small',
                style: { marginBottom: 16 }
            }, React.createElement(Row, { gutter: 16, align: 'middle' }, [
                React.createElement(Col, { key: 'search', span: 12 },
                    React.createElement(Search, {
                        placeholder: '搜索大屏名称',
                        enterButton: true
                    })
                ),
                React.createElement(Col, { key: 'type', span: 4 },
                    React.createElement(Select, {
                        placeholder: '大屏类型',
                        style: { width: '100%' },
                        defaultValue: 'all'
                    }, [
                        React.createElement(Option, { key: 'all', value: 'all' }, '全部类型'),
                        React.createElement(Option, { key: 'daily', value: 'daily' }, '日常'),
                        React.createElement(Option, { key: 'exhibition', value: 'exhibition' }, '展会'),
                        React.createElement(Option, { key: 'special', value: 'special' }, '特殊活动')
                    ])
                ),
                React.createElement(Col, { key: 'status', span: 4 },
                    React.createElement(Select, {
                        placeholder: '运行状态',
                        style: { width: '100%' },
                        defaultValue: 'all'
                    }, [
                        React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                        React.createElement(Option, { key: 'running', value: 'running' }, '运行中'),
                        React.createElement(Option, { key: 'stopped', value: 'stopped' }, '已停止'),
                        React.createElement(Option, { key: 'maintenance', value: 'maintenance' }, '维护中')
                    ])
                ),
                React.createElement(Col, { key: 'actions', span: 4 },
                    React.createElement(Button, {
                        type: 'primary',
                        block: true,
                        icon: React.createElement('span', {}, '➕')
                    }, '新建大屏')
                )
            ])),

            // 大屏列表表格
            React.createElement(Card, { key: 'table' },
                React.createElement(Table, {
                    columns: columns,
                    dataSource: screenList,
                    loading: loading,
                    rowKey: 'id',
                    pagination: {
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 个大屏`
                    },
                    scroll: { x: 1200 }
                })
            )
        ]);
    };

    // 渲染监控页面
    const renderMonitorPage = () => {
        return React.createElement('div', {}, [
            React.createElement(Card, {
                key: 'info',
                size: 'small',
                style: { marginBottom: 16 }
            }, React.createElement('div', {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
            }, [
                React.createElement('div', { key: 'left' }, [
                    React.createElement('span', { key: 'label', style: { marginRight: 12 } }, '当前大屏:'),
                    React.createElement(Select, {
                        key: 'select',
                        style: { width: 300 },
                        defaultValue: 1
                    }, screenList.map(screen =>
                        React.createElement(Option, { key: screen.id, value: screen.id },
                            `${screen.name} ${screen.status === 'running' ? '🟢' : '🔴'}`
                        )
                    ))
                ]),
                React.createElement('div', { key: 'right' }, [
                    React.createElement(Badge, {
                        key: 'badge',
                        status: 'success',
                        text: '运行状态: 正常'
                    }),
                    React.createElement('span', { key: 'divider', style: { margin: '0 12px' } }, '|'),
                    React.createElement('span', { key: 'update' }, '最后更新: 2025-05-16 10:30:15')
                ])
            ])),

            // 系统指标
            React.createElement(Card, {
                key: 'metrics',
                title: '📊 系统指标',
                style: { marginBottom: 16 }
            }, React.createElement(Row, { gutter: 16 }, [
                React.createElement(Col, { key: 'm1', span: 6 },
                    React.createElement(Statistic, {
                        title: '在线设备',
                        value: 3,
                        suffix: '台'
                    })
                ),
                React.createElement(Col, { key: 'm2', span: 6 },
                    React.createElement(Statistic, {
                        title: '数据源状态',
                        value: '9/9',
                        valueStyle: { color: '#52c41a' }
                    })
                ),
                React.createElement(Col, { key: 'm3', span: 6 },
                    React.createElement(Statistic, {
                        title: 'API调用成功率',
                        value: 100,
                        suffix: '%',
                        valueStyle: { color: '#52c41a' }
                    })
                ),
                React.createElement(Col, { key: 'm4', span: 6 },
                    React.createElement(Statistic, {
                        title: '错误数',
                        value: 0,
                        valueStyle: { color: '#52c41a' }
                    })
                )
            ])),

            // 模块状态
            React.createElement(Card, {
                key: 'module-status',
                title: '📊 模块运行状态'
            }, React.createElement(Table, {
                size: 'small',
                pagination: false,
                columns: [
                    { title: '模块名称', key: 'name', render: (_, record) => record.name },
                    {
                        title: '数据状态',
                        key: 'status',
                        render: (_, record) => React.createElement(Tag, {
                            color: record.status === 'normal' ? 'green' : 'orange'
                        }, record.status === 'normal' ? '✓ 正常' : '⚠️ 延迟')
                    },
                    {
                        title: 'API状态',
                        key: 'loading',
                        render: (_, record) => React.createElement(Tag, {
                            color: record.loading === 'success' ? 'green' : 'default'
                        }, record.loading === 'success' ? '✓ 正常' : '- 缓存')
                    },
                    { title: '响应时间', dataIndex: 'apiTime', key: 'apiTime' }
                ],
                dataSource: Object.values(screenModules).map((module, index) => ({
                    name: module.name,
                    status: index === 4 ? 'warning' : 'normal',
                    loading: [1, 5].includes(index) ? 'cached' : 'success',
                    apiTime: [1, 5].includes(index) ? '-' : `${150 + index * 50}ms`
                })),
                rowKey: 'name'
            }))
        ]);
    };

    // 根据界面类型渲染不同的内容
    const renderScreenContent = (screen) => {
        if (!screen) return [];
        
        const screenType = screen.type;
        
        switch(screenType) {
            case '协会版':
                return renderAssociationOverview();
            case '标准版':
                return renderStandardDepartment();
            case '行业版':
                return renderIndustryOverview();
            case '评审版':
                return renderReviewDepartment();
            default:
                return renderDefaultScreen();
        }
    };

    // 协会概况界面
    const renderAssociationOverview = () => {
        return [
            // 顶部标题
            React.createElement('div', {
                key: 'header',
                style: {
                    position: 'absolute',
                    top: '33px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '1001px',
                    height: '130px',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                },
                onMouseEnter: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)',
                onMouseLeave: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }, '中国城市轨道交通协会概况'),
            
            // 协会基本信息模块
            renderModule('associationInfo', {
                left: '20px',
                top: '200px',
                width: '600px',
                height: '400px'
            }),
            
            // 组织结构模块
            renderModule('organization', {
                left: '650px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 发展历程模块
            renderModule('development', {
                left: '1480px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 主要成就模块
            renderModule('achievements', {
                left: '2310px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 会员统计模块
            renderModule('memberStats', {
                left: '3140px',
                top: '200px',
                width: '600px',
                height: '400px'
            }),
            
            // 服务内容模块
            renderModule('services', {
                left: '20px',
                top: '650px',
                width: '1200px',
                height: '300px'
            }),
            
            // 联系方式模块
            renderModule('contact', {
                left: '1250px',
                top: '650px',
                width: '1200px',
                height: '300px'
            }),
            
            // 最新动态模块
            renderModule('news', {
                left: '2500px',
                top: '650px',
                width: '1200px',
                height: '300px'
            })
        ];
    };

    // 标准部界面
    const renderStandardDepartment = () => {
        return [
            // 顶部标题
            React.createElement('div', {
                key: 'header',
                style: {
                    position: 'absolute',
                    top: '33px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '1001px',
                    height: '130px',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                },
                onMouseEnter: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)',
                onMouseLeave: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }, '标准部工作展示'),
            
            // 标准制定统计
            renderModule('standardStats', {
                left: '20px',
                top: '200px',
                width: '600px',
                height: '400px'
            }),
            
            // 技术规范模块
            renderModule('technicalSpecs', {
                left: '650px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 质量认证模块
            renderModule('qualityCert', {
                left: '1480px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 标准发布模块
            renderModule('standardRelease', {
                left: '2310px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 工作流程模块
            renderModule('workflow', {
                left: '3140px',
                top: '200px',
                width: '600px',
                height: '400px'
            }),
            
            // 最新标准模块
            renderModule('latestStandards', {
                left: '20px',
                top: '650px',
                width: '1800px',
                height: '300px'
            }),
            
            // 标准应用案例
            renderModule('applicationCases', {
                left: '1850px',
                top: '650px',
                width: '1800px',
                height: '300px'
            })
        ];
    };

    // 行业概况界面
    const renderIndustryOverview = () => {
        return [
            // 顶部标题
            React.createElement('div', {
                key: 'header',
                style: {
                    position: 'absolute',
                    top: '33px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '1001px',
                    height: '130px',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                },
                onMouseEnter: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)',
                onMouseLeave: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }, '行业概况数据展示'),
            
            // 城市分布统计
            renderModule('cityDistribution', {
                left: '20px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 运营里程统计
            renderModule('operationMileage', {
                left: '850px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 客运量统计
            renderModule('passengerVolume', {
                left: '1680px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 车辆制式分布
            renderModule('vehicleTypes', {
                left: '2510px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 发车间隔统计
            renderModule('headwayStats', {
                left: '3340px',
                top: '200px',
                width: '600px',
                height: '400px'
            }),
            
            // 全自动运行线路
            renderModule('automatedLines', {
                left: '20px',
                top: '650px',
                width: '1200px',
                height: '300px'
            }),
            
            // 城市群分布
            renderModule('cityGroupDistribution', {
                left: '1250px',
                top: '650px',
                width: '1200px',
                height: '300px'
            }),
            
            // 制式占比分布
            renderModule('systemRatio', {
                left: '2500px',
                top: '650px',
                width: '1200px',
                height: '300px'
            })
        ];
    };

    // 评审部界面
    const renderReviewDepartment = () => {
        return [
            // 顶部标题
            React.createElement('div', {
                key: 'header',
                style: {
                    position: 'absolute',
                    top: '33px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '1001px',
                    height: '130px',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                },
                onMouseEnter: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)',
                onMouseLeave: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }, '评审部工作展示'),
            
            // 职称评审介绍
            renderModule('reviewIntro', {
                left: '20px',
                top: '200px',
                width: '1200px',
                height: '400px'
            }),
            
            // 申报情况统计
            renderModule('applicationStats', {
                left: '1250px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 评审通过情况
            renderModule('passStats', {
                left: '2080px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 申报人员单位属性
            renderModule('applicantUnits', {
                left: '2910px',
                top: '200px',
                width: '800px',
                height: '400px'
            }),
            
            // 通过人员单位属性
            renderModule('passUnits', {
                left: '3740px',
                top: '200px',
                width: '600px',
                height: '400px'
            }),
            
            // 专业占比统计
            renderModule('professionalRatio', {
                left: '20px',
                top: '650px',
                width: '1200px',
                height: '300px'
            }),
            
            // 地域分布统计
            renderModule('regionalDistribution', {
                left: '1250px',
                top: '650px',
                width: '1200px',
                height: '300px'
            }),
            
            // 各级别人数统计
            renderModule('levelStats', {
                left: '2500px',
                top: '650px',
                width: '1200px',
                height: '300px'
            })
        ];
    };

    // 默认界面（日常版）
    const renderDefaultScreen = () => {
        return [
            // 顶部标题
            React.createElement('div', {
                key: 'header',
                style: {
                    position: 'absolute',
                    top: '33px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '1001px',
                    height: '130px',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                },
                onMouseEnter: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)',
                onMouseLeave: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }, '中国城市轨道交通协会'),

            // 标语
            React.createElement('div', {
                key: 'slogan',
                style: {
                    position: 'absolute',
                    top: '190px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#fff',
                    fontSize: '44px',
                    whiteSpace: 'nowrap'
                }
            }, '遵守法规加强自律，发挥桥梁纽带作用，诚为政府企业服务，推动行业科学发展。'),

            // 左上 - 天气信息
            renderModule('weather', {
                left: '20px',
                top: '20px',
                width: '600px',
                height: '460px'
            }),

            // 左中 - 限行尾号
            renderModule('traffic', {
                left: '20px',
                top: '500px',
                width: '600px',
                height: '280px'
            }),

            // 左下 - 工作规划
            renderModule('workPlan', {
                left: '22px',
                top: '800px',
                width: '600px',
                height: '526px'
            }),

            // 中上 - 党建园地
            renderModule('partyNews', {
                left: '642px',
                top: '280px',
                width: '1745px',
                height: '500px'
            }),

            // 中下 - 会员单位概况
            renderModule('memberStats', {
                left: '642px',
                top: '800px',
                width: '1745px',
                height: '526px'
            }),

            // 右上 - 品牌活动
            renderModule('brandActivity', {
                left: '2412px',
                top: '280px',
                width: '1745px',
                height: '500px'
            }),

            // 右中 - 行业统计
            renderModule('industryStats', {
                left: '2412px',
                top: '800px',
                width: '1745px',
                height: '526px'
            }),

            // 右侧上 - 行业新闻
            renderModule('news', {
                left: '4181px',
                top: '20px',
                width: '597px',
                height: '643px'
            }),

            // 右侧下 - 活动直播
            renderModule('live', {
                left: '4181px',
                top: '683px',
                width: '597px',
                height: '643px'
            })
        ];
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '🖥️ 大屏管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '可视化编辑大屏内容，实时监控运行状态'
            )
        ]),

        React.createElement(Tabs, {
            key: 'tabs',
            activeKey: activeTab,
            onChange: setActiveTab,
            size: 'large'
        }, [
            React.createElement(TabPane, {
                key: 'list',
                tab: React.createElement('span', {}, ['📋 ', '大屏列表'])
            }, renderListPage()),
            
            React.createElement(TabPane, {
                key: 'editor',
                tab: React.createElement('span', {}, ['🖥️ ', '可视化编辑'])
            }, renderScreenEditor()),
            
            React.createElement(TabPane, {
                key: 'monitor',
                tab: React.createElement('span', {}, ['📊 ', '运行监控'])
            }, renderMonitorPage())
        ]),

        // 编辑抽屉
        renderEditDrawer(),
        
        // 实时控制弹窗
        renderControlModal()
    ]);
};

window.App.pages.ScreenManagement = ScreenManagement;
console.log('[ScreenManagement] 组件挂载成功');
