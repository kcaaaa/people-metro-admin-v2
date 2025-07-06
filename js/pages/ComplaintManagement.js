// 投诉管理页面组件
const ComplaintManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Tooltip, Modal, Form, message, Statistic, Row, Col, Avatar, Image, Progress, InputNumber, DatePicker, Alert, Descriptions } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { confirm } = Modal;

    // 状态管理
    const [complaints, setComplaints] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [sortBy, setSortBy] = React.useState('complaint_count');
    const [sortOrder, setSortOrder] = React.useState('desc');
    const [detailModalVisible, setDetailModalVisible] = React.useState(false);
    const [selectedComplaint, setSelectedComplaint] = React.useState(null);
    
    // 限流相关状态
    const [limitModalVisible, setLimitModalVisible] = React.useState(false);
    const [limitForm] = Form.useForm();
    const [selectedVideoForLimit, setSelectedVideoForLimit] = React.useState(null);

    // 配置管理状态
    const [configModalVisible, setConfigModalVisible] = React.useState(false);
    const [configForm] = Form.useForm();
    const [recommendationConfig, setRecommendationConfig] = React.useState({
        // 投诉次数阈值配置
        complaintThresholds: [
            { minCount: 1, maxCount: 5, level: 'light', percentage: 20, duration: 3 },
            { minCount: 6, maxCount: 10, level: 'light', percentage: 30, duration: 5 },
            { minCount: 11, maxCount: 15, level: 'medium', percentage: 50, duration: 7 },
            { minCount: 16, maxCount: 25, level: 'medium', percentage: 60, duration: 10 },
            { minCount: 26, maxCount: 999, level: 'heavy', percentage: 80, duration: 14 }
        ],
        // 投诉类型权重配置
        complaintTypeWeights: {
            '内容不实': 10,
            '诱导点击': 8,
            '安全隐患': 20,
            '误导信息': 12,
            '泄露机密': 25,
            '不当内容': 18,
            '内容重复': 5
        },
        // 播放量影响系数配置
        viewsImpactConfig: {
            enabled: true,
            thresholds: [
                { minViews: 0, maxViews: 1000, multiplier: 0.8 }, // 低播放量降低处罚
                { minViews: 1001, maxViews: 10000, multiplier: 1.0 }, // 标准处理
                { minViews: 10001, maxViews: 100000, multiplier: 1.2 }, // 高播放量加重处罚
                { minViews: 100001, maxViews: 999999999, multiplier: 1.5 } // 超高播放量重点关注
            ]
        },
        // 时间衰减配置
        timeDecayConfig: {
            enabled: true,
            recentDays: 7, // 近期投诉权重
            recentMultiplier: 1.5, // 近期投诉权重倍数
            oldMultiplier: 0.7 // 较旧投诉权重倍数
        }
    });

    // 模拟投诉数据 - 增加限流相关字段
    const mockComplaints = [
        {
            id: 'C001',
            video_id: 'V001',
            video_title: '城市轨道交通建设进展',
            video_cover: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300',
            video_duration: '05:32',
            publisher_id: 'U001',
            publisher_name: '城轨爱好者',
            publisher_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40',
            complaint_count: 15,
            complaint_types: ['内容不实', '诱导点击'],
            latest_complaint_time: '2024-01-15 14:30:00',
            first_complaint_time: '2024-01-14 09:15:00',
            status: 'pending',
            video_views: 12500,
            video_publish_time: '2024-01-10 16:20:00',
            // 限流相关字段
            limit_status: 'limited', // none | limited | expired
            limit_level: 'medium', // light | medium | heavy
            limit_percentage: 50, // 限流比例
            limit_start_time: '2024-01-15 16:00:00',
            limit_end_time: '2024-01-22 16:00:00',
            limit_reason: '投诉量过高，内容存疑'
        },
        {
            id: 'C002',
            video_id: 'V002',
            video_title: '地铁施工现场揭秘',
            video_cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
            video_duration: '08:45',
            publisher_id: 'U002',
            publisher_name: '建设记录员',
            publisher_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40',
            complaint_count: 8,
            complaint_types: ['安全隐患'],
            latest_complaint_time: '2024-01-15 11:20:00',
            first_complaint_time: '2024-01-15 08:45:00',
            status: 'pending',
            video_views: 8900,
            video_publish_time: '2024-01-12 10:30:00',
            limit_status: 'none'
        },
        {
            id: 'C003',
            video_id: 'V003',
            video_title: '高铁线路规划解读',
            video_cover: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=300',
            video_duration: '12:18',
            publisher_id: 'U003',
            publisher_name: '交通分析师',
            publisher_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40',
            complaint_count: 3,
            complaint_types: ['误导信息'],
            latest_complaint_time: '2024-01-14 16:45:00',
            first_complaint_time: '2024-01-14 14:20:00',
            status: 'processed',
            video_views: 5600,
            video_publish_time: '2024-01-11 14:15:00',
            limit_status: 'expired',
            limit_level: 'light',
            limit_percentage: 30,
            limit_start_time: '2024-01-12 10:00:00',
            limit_end_time: '2024-01-14 10:00:00',
            limit_reason: '投诉处理后自动解除'
        },
        {
            id: 'C004',
            video_id: 'V004',
            video_title: '地铁运营维护内幕',
            video_cover: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300',
            video_duration: '06:52',
            publisher_id: 'U004',
            publisher_name: '运维工程师',
            publisher_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40',
            complaint_count: 22,
            complaint_types: ['泄露机密', '不当内容'],
            latest_complaint_time: '2024-01-15 18:30:00',
            first_complaint_time: '2024-01-13 12:00:00',
            status: 'pending',
            video_views: 18700,
            video_publish_time: '2024-01-09 11:45:00',
            limit_status: 'limited',
            limit_level: 'heavy',
            limit_percentage: 80,
            limit_start_time: '2024-01-15 19:00:00',
            limit_end_time: '2024-01-29 19:00:00',
            limit_reason: '严重违规内容，重度限流'
        },
        {
            id: 'C005',
            video_id: 'V005',
            video_title: '城际铁路建设现状',
            video_cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
            video_duration: '09:15',
            publisher_id: 'U005',
            publisher_name: '铁路观察员',
            publisher_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40',
            complaint_count: 6,
            complaint_types: ['内容重复'],
            latest_complaint_time: '2024-01-15 13:10:00',
            first_complaint_time: '2024-01-15 09:30:00',
            status: 'reviewing',
            video_views: 7200,
            video_publish_time: '2024-01-13 15:20:00',
            limit_status: 'none'
        }
    ];

    // 限流等级配置
    const limitLevels = {
        light: { 
            label: '轻度限流', 
            color: 'orange', 
            defaultPercentage: 30,
            description: '降低30%推送量，适用于轻微违规内容'
        },
        medium: { 
            label: '中度限流', 
            color: 'warning', 
            defaultPercentage: 50,
            description: '降低50%推送量，适用于明显违规内容'
        },
        heavy: { 
            label: '重度限流', 
            color: 'error', 
            defaultPercentage: 80,
            description: '降低80%推送量，适用于严重违规内容'
        }
    };

    // 加载数据
    React.useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = () => {
        setLoading(true);
        // 模拟API调用
        setTimeout(() => {
            setComplaints(mockComplaints);
            setLoading(false);
        }, 800);
    };

    // 过滤和排序数据
    const getFilteredAndSortedData = () => {
        let filteredData = [...complaints];

        // 搜索过滤
        if (searchText) {
            filteredData = filteredData.filter(item => 
                item.video_title.toLowerCase().includes(searchText.toLowerCase()) ||
                item.publisher_name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.complaint_types.some(type => type.includes(searchText))
            );
        }

        // 状态过滤
        if (statusFilter !== 'all') {
            filteredData = filteredData.filter(item => item.status === statusFilter);
        }

        // 排序
        filteredData.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case 'complaint_count':
                    aValue = a.complaint_count;
                    bValue = b.complaint_count;
                    break;
                case 'latest_complaint_time':
                    aValue = new Date(a.latest_complaint_time);
                    bValue = new Date(b.latest_complaint_time);
                    break;
                case 'video_views':
                    aValue = a.video_views;
                    bValue = b.video_views;
                    break;
                default:
                    return 0;
            }
            
            if (sortOrder === 'desc') {
                return bValue > aValue ? 1 : -1;
            } else {
                return aValue > bValue ? 1 : -1;
            }
        });

        return filteredData;
    };

    // 状态标签渲染
    const renderStatusTag = (status) => {
        const statusConfig = {
            'pending': { color: 'warning', text: '待处理' },
            'reviewing': { color: 'processing', text: '审核中' },
            'processed': { color: 'success', text: '已处理' },
            'rejected': { color: 'default', text: '已驳回' }
        };
        const config = statusConfig[status] || statusConfig['pending'];
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    // 限流状态标签渲染
    const renderLimitStatusTag = (record) => {
        if (record.limit_status === 'none') {
            return React.createElement(Tag, { color: 'default' }, '未限流');
        }
        
        if (record.limit_status === 'expired') {
            return React.createElement(Tag, { color: 'default' }, '已过期');
        }
        
        if (record.limit_status === 'limited') {
            const levelConfig = limitLevels[record.limit_level];
            return React.createElement(Tooltip, {
                title: `限流${record.limit_percentage}%，结束时间：${new Date(record.limit_end_time).toLocaleString()}`
            }, React.createElement(Tag, { 
                color: levelConfig.color 
            }, `${levelConfig.label} ${record.limit_percentage}%`));
        }
        
        return null;
    };

    // 投诉类型标签渲染
    const renderComplaintTypes = (types) => {
        const typeColors = {
            '内容不实': 'red',
            '诱导点击': 'orange',
            '安全隐患': 'red',
            '误导信息': 'orange',
            '泄露机密': 'red',
            '不当内容': 'red',
            '内容重复': 'blue'
        };
        
        return types.map(type => 
            React.createElement(Tag, {
                key: type,
                color: typeColors[type] || 'default',
                style: { marginBottom: '4px' }
            }, type)
        );
    };

    // 查看详情
    const handleViewDetail = (record) => {
        setSelectedComplaint(record);
        setDetailModalVisible(true);
    };

    // 基于配置的智能推荐算法
    const calculateRecommendation = (record) => {
        const config = recommendationConfig;
        
        // 1. 基础投诉次数评分
        let baseScore = 0;
        let baseConfig = null;
        
        for (const threshold of config.complaintThresholds) {
            if (record.complaint_count >= threshold.minCount && record.complaint_count <= threshold.maxCount) {
                baseScore = threshold.percentage;
                baseConfig = threshold;
                break;
            }
        }
        
        // 2. 投诉类型权重加成
        let typeWeightSum = 0;
        record.complaint_types.forEach(type => {
            typeWeightSum += config.complaintTypeWeights[type] || 5;
        });
        const avgTypeWeight = typeWeightSum / record.complaint_types.length;
        const typeMultiplier = 1 + (avgTypeWeight - 10) / 100; // 以10为基准，每增减1分影响1%
        
        // 3. 播放量影响系数
        let viewsMultiplier = 1.0;
        if (config.viewsImpactConfig.enabled) {
            for (const threshold of config.viewsImpactConfig.thresholds) {
                if (record.video_views >= threshold.minViews && record.video_views <= threshold.maxViews) {
                    viewsMultiplier = threshold.multiplier;
                    break;
                }
            }
        }
        
        // 4. 时间衰减影响
        let timeMultiplier = 1.0;
        if (config.timeDecayConfig.enabled) {
            const latestComplaintDate = new Date(record.latest_complaint_time);
            const daysDiff = (new Date() - latestComplaintDate) / (1000 * 60 * 60 * 24);
            
            if (daysDiff <= config.timeDecayConfig.recentDays) {
                timeMultiplier = config.timeDecayConfig.recentMultiplier;
            } else {
                timeMultiplier = config.timeDecayConfig.oldMultiplier;
            }
        }
        
        // 5. 综合计算
        let finalPercentage = Math.round(baseScore * typeMultiplier * viewsMultiplier * timeMultiplier);
        finalPercentage = Math.max(1, Math.min(95, finalPercentage)); // 限制在1-95%范围内
        
        // 6. 根据最终比例确定等级和时长
        let finalLevel = baseConfig?.level || 'light';
        let finalDuration = baseConfig?.duration || 7;
        
        if (finalPercentage >= 70) {
            finalLevel = 'heavy';
            finalDuration = Math.max(finalDuration, 14);
        } else if (finalPercentage >= 40) {
            finalLevel = 'medium';
            finalDuration = Math.max(finalDuration, 7);
        } else {
            finalLevel = 'light';
            finalDuration = Math.max(finalDuration, 3);
        }
        
        return {
            level: finalLevel,
            percentage: finalPercentage,
            duration: finalDuration,
            details: {
                baseScore,
                typeMultiplier: Math.round(typeMultiplier * 100) / 100,
                viewsMultiplier,
                timeMultiplier: Math.round(timeMultiplier * 100) / 100,
                avgTypeWeight: Math.round(avgTypeWeight * 10) / 10
            }
        };
    };

    // 视频限流
    const handleLimitVideo = (record) => {
        setSelectedVideoForLimit(record);
        setLimitModalVisible(true);
        
        // 使用新的智能推荐算法
        const recommendation = calculateRecommendation(record);
        
        // 设置表单默认值
        limitForm.setFieldsValue({
            limit_level: recommendation.level,
            limit_percentage: recommendation.percentage,
            duration_days: recommendation.duration,
            limit_reason: `智能推荐：投诉${record.complaint_count}次，综合评分${recommendation.percentage}%`
        });
    };

    // 限流等级变化时的处理
    const handleLimitLevelChange = (level) => {
        const levelConfig = limitLevels[level];
        if (levelConfig) {
            // 更新推荐的限流比例，但允许用户手动修改
            limitForm.setFieldsValue({
                limit_percentage: levelConfig.defaultPercentage
            });
        }
    };

    // 重置为智能推荐配置
    const resetToRecommended = () => {
        if (!selectedVideoForLimit) return;
        
        const recommendation = calculateRecommendation(selectedVideoForLimit);
        
        limitForm.setFieldsValue({
            limit_level: recommendation.level,
            limit_percentage: recommendation.percentage,
            duration_days: recommendation.duration,
            limit_reason: `智能推荐：投诉${selectedVideoForLimit.complaint_count}次，综合评分${recommendation.percentage}%（详细：基础${recommendation.details.baseScore}% × 类型权重${recommendation.details.typeMultiplier} × 播放量系数${recommendation.details.viewsMultiplier} × 时间系数${recommendation.details.timeMultiplier}）`
        });
        
        message.success('已重置为智能推荐配置');
    };

    // 快捷配置选项
    const quickConfigs = [
        {
            name: '轻度处理',
            level: 'light',
            percentage: 20,
            duration: 3,
            reason: '轻微违规，短期限流观察'
        },
        {
            name: '常规处理',
            level: 'medium',
            percentage: 50,
            duration: 7,
            reason: '明显违规，中等强度限流'
        },
        {
            name: '严厉处理',
            level: 'heavy',
            percentage: 80,
            duration: 14,
            reason: '严重违规，重度限流处理'
        },
        {
            name: '极限处理',
            level: 'heavy',
            percentage: 90,
            duration: 30,
            reason: '极度严重违规，最大限度限流'
        }
    ];

    // 应用快捷配置
    const applyQuickConfig = (config) => {
        limitForm.setFieldsValue({
            limit_level: config.level,
            limit_percentage: config.percentage,
            duration_days: config.duration,
            limit_reason: config.reason
        });
        message.success(`已应用"${config.name}"配置`);
    };

    // 配置管理功能
    const saveRecommendationConfig = async (values) => {
        try {
            setLoading(true);
            
            // 处理表单数据，构建新的配置
            const newConfig = {
                complaintThresholds: values.complaintThresholds || recommendationConfig.complaintThresholds,
                complaintTypeWeights: values.complaintTypeWeights || recommendationConfig.complaintTypeWeights,
                viewsImpactConfig: values.viewsImpactConfig || recommendationConfig.viewsImpactConfig,
                timeDecayConfig: values.timeDecayConfig || recommendationConfig.timeDecayConfig
            };
            
            console.log('保存推荐配置:', newConfig);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setRecommendationConfig(newConfig);
            message.success('推荐配置保存成功！');
            setConfigModalVisible(false);
            
        } catch (error) {
            message.error('配置保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 重置配置为默认值
    const resetConfigToDefault = () => {
        const defaultConfig = {
            complaintThresholds: [
                { minCount: 1, maxCount: 5, level: 'light', percentage: 20, duration: 3 },
                { minCount: 6, maxCount: 10, level: 'light', percentage: 30, duration: 5 },
                { minCount: 11, maxCount: 15, level: 'medium', percentage: 50, duration: 7 },
                { minCount: 16, maxCount: 25, level: 'medium', percentage: 60, duration: 10 },
                { minCount: 26, maxCount: 999, level: 'heavy', percentage: 80, duration: 14 }
            ],
            complaintTypeWeights: {
                '内容不实': 10,
                '诱导点击': 8,
                '安全隐患': 20,
                '误导信息': 12,
                '泄露机密': 25,
                '不当内容': 18,
                '内容重复': 5
            },
            viewsImpactConfig: {
                enabled: true,
                thresholds: [
                    { minViews: 0, maxViews: 1000, multiplier: 0.8 },
                    { minViews: 1001, maxViews: 10000, multiplier: 1.0 },
                    { minViews: 10001, maxViews: 100000, multiplier: 1.2 },
                    { minViews: 100001, maxViews: 999999999, multiplier: 1.5 }
                ]
            },
            timeDecayConfig: {
                enabled: true,
                recentDays: 7,
                recentMultiplier: 1.5,
                oldMultiplier: 0.7
            }
        };
        
        setRecommendationConfig(defaultConfig);
        configForm.setFieldsValue(defaultConfig);
        message.success('已重置为默认配置');
    };

    // 应用预设配置方案
    const applyPresetConfig = (presetName) => {
        const presets = {
            strict: {
                complaintThresholds: [
                    { minCount: 1, maxCount: 3, level: 'light', percentage: 30, duration: 5 },
                    { minCount: 4, maxCount: 8, level: 'medium', percentage: 50, duration: 7 },
                    { minCount: 9, maxCount: 12, level: 'medium', percentage: 70, duration: 10 },
                    { minCount: 13, maxCount: 20, level: 'heavy', percentage: 85, duration: 14 },
                    { minCount: 21, maxCount: 999, level: 'heavy', percentage: 95, duration: 21 }
                ],
                complaintTypeWeights: {
                    '内容不实': 15,
                    '诱导点击': 12,
                    '安全隐患': 25,
                    '误导信息': 18,
                    '泄露机密': 30,
                    '不当内容': 25,
                    '内容重复': 8
                },
                viewsImpactConfig: {
                    enabled: true,
                    thresholds: [
                        { minViews: 0, maxViews: 1000, multiplier: 0.7 },
                        { minViews: 1001, maxViews: 10000, multiplier: 1.0 },
                        { minViews: 10001, maxViews: 100000, multiplier: 1.3 },
                        { minViews: 100001, maxViews: 999999999, multiplier: 1.6 }
                    ]
                },
                timeDecayConfig: {
                    enabled: true,
                    recentDays: 5,
                    recentMultiplier: 1.8,
                    oldMultiplier: 0.6
                }
            },
            lenient: {
                complaintThresholds: [
                    { minCount: 1, maxCount: 8, level: 'light', percentage: 15, duration: 3 },
                    { minCount: 9, maxCount: 15, level: 'light', percentage: 25, duration: 5 },
                    { minCount: 16, maxCount: 25, level: 'medium', percentage: 40, duration: 7 },
                    { minCount: 26, maxCount: 40, level: 'medium', percentage: 55, duration: 10 },
                    { minCount: 41, maxCount: 999, level: 'heavy', percentage: 75, duration: 14 }
                ],
                complaintTypeWeights: {
                    '内容不实': 8,
                    '诱导点击': 6,
                    '安全隐患': 15,
                    '误导信息': 10,
                    '泄露机密': 20,
                    '不当内容': 15,
                    '内容重复': 4
                },
                viewsImpactConfig: {
                    enabled: true,
                    thresholds: [
                        { minViews: 0, maxViews: 1000, multiplier: 0.9 },
                        { minViews: 1001, maxViews: 10000, multiplier: 1.0 },
                        { minViews: 10001, maxViews: 100000, multiplier: 1.1 },
                        { minViews: 100001, maxViews: 999999999, multiplier: 1.3 }
                    ]
                },
                timeDecayConfig: {
                    enabled: true,
                    recentDays: 10,
                    recentMultiplier: 1.3,
                    oldMultiplier: 0.8
                }
            }
        };
        
        const selectedPreset = presets[presetName];
        if (selectedPreset) {
            setRecommendationConfig(selectedPreset);
            configForm.setFieldsValue(selectedPreset);
            
            const presetNames = {
                strict: '严格模式',
                lenient: '宽松模式'
            };
            message.success(`已应用${presetNames[presetName]}配置`);
        }
    };

    // 打开配置管理界面
    const openConfigModal = () => {
        setConfigModalVisible(true);
        configForm.setFieldsValue(recommendationConfig);
    };

    // 解除限流
    const handleRemoveLimit = (record) => {
        confirm({
            title: '确认解除限流？',
            content: `确定要解除视频"${record.video_title}"的限流吗？解除后推送量将恢复正常。`,
            okText: '确认解除',
            cancelText: '取消',
            onOk() {
                setLoading(true);
                setTimeout(() => {
                    message.success('限流已成功解除');
                    // 更新数据状态
                    const updatedComplaints = complaints.map(item => 
                        item.id === record.id ? { 
                            ...item, 
                            limit_status: 'none',
                            limit_end_time: new Date().toISOString()
                        } : item
                    );
                    setComplaints(updatedComplaints);
                    setLoading(false);
                }, 1000);
            }
        });
    };

    // 提交限流配置
    const handleLimitSubmit = async (values) => {
        try {
            setLoading(true);
            
            const startTime = new Date();
            const endTime = new Date();
            endTime.setDate(endTime.getDate() + values.duration_days);
            
            const limitData = {
                ...values,
                video_id: selectedVideoForLimit.video_id,
                limit_start_time: startTime.toISOString(),
                limit_end_time: endTime.toISOString(),
                operator: '当前管理员'
            };
            
            console.log('限流配置:', limitData);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 更新数据状态
            const updatedComplaints = complaints.map(item => 
                item.id === selectedVideoForLimit.id ? { 
                    ...item, 
                    limit_status: 'limited',
                    limit_level: values.limit_level,
                    limit_percentage: values.limit_percentage,
                    limit_start_time: startTime.toISOString(),
                    limit_end_time: endTime.toISOString(),
                    limit_reason: values.limit_reason
                } : item
            );
            setComplaints(updatedComplaints);
            
            message.success(`视频限流设置成功！限流${values.limit_percentage}%，持续${values.duration_days}天`);
            
            setLimitModalVisible(false);
            limitForm.resetFields();
            setSelectedVideoForLimit(null);
            
        } catch (error) {
            message.error('限流设置失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 视频下架
    const handleRemoveVideo = (record) => {
        confirm({
            title: '确认下架视频？',
            content: `确定要下架视频"${record.video_title}"吗？下架后用户将无法观看该视频。`,
            okText: '确认下架',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                setLoading(true);
                // 模拟API调用
                setTimeout(() => {
                    message.success('视频已成功下架');
                    // 更新数据状态
                    const updatedComplaints = complaints.map(item => 
                        item.id === record.id ? { ...item, status: 'processed' } : item
                    );
                    setComplaints(updatedComplaints);
                    setLoading(false);
                }, 1000);
            }
        });
    };

    // 账号封禁
    const handleBanAccount = (record) => {
        confirm({
            title: '确认封禁账号？',
            content: `确定要封禁用户"${record.publisher_name}"的账号吗？封禁后该用户将无法发布内容。`,
            okText: '确认封禁',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                setLoading(true);
                // 模拟API调用
                setTimeout(() => {
                    message.success('账号已成功封禁');
                    setLoading(false);
                }, 1000);
            }
        });
    };

    // 忽略投诉
    const handleIgnoreComplaint = (record) => {
        confirm({
            title: '确认忽略投诉？',
            content: `确定要忽略对视频"${record.video_title}"的投诉吗？操作后该投诉将标记为已处理。`,
            okText: '确认忽略',
            cancelText: '取消',
            onOk() {
                setLoading(true);
                // 模拟API调用
                setTimeout(() => {
                    message.success('投诉已忽略');
                    // 更新数据状态
                    const updatedComplaints = complaints.map(item => 
                        item.id === record.id ? { ...item, status: 'processed', action: 'ignored' } : item
                    );
                    setComplaints(updatedComplaints);
                    setLoading(false);
                }, 1000);
            }
        });
    };

    // 表格列定义
    const columns = [
        {
            title: '视频信息',
            key: 'video_info',
            width: 300,
            render: (_, record) => (
                React.createElement('div', {
                    style: { display: 'flex', alignItems: 'center' }
                }, [
                    React.createElement(Image, {
                        key: 'cover',
                        width: 80,
                        height: 45,
                        src: record.video_cover,
                        style: { borderRadius: '4px', marginRight: '12px' }
                    }),
                    React.createElement('div', { key: 'info' }, [
                        React.createElement('div', {
                            key: 'title',
                            style: { fontWeight: 500, marginBottom: '4px' }
                        }, record.video_title),
                        React.createElement('div', {
                            key: 'meta',
                            style: { fontSize: '12px', color: '#666' }
                        }, `时长: ${record.video_duration} | 播放: ${record.video_views.toLocaleString()}`)
                    ])
                ])
            )
        },
        {
            title: '发布者',
            key: 'publisher',
            width: 120,
            render: (_, record) => (
                React.createElement('div', {
                    style: { display: 'flex', alignItems: 'center' }
                }, [
                    React.createElement(Avatar, {
                        key: 'avatar',
                        size: 32,
                        src: record.publisher_avatar,
                        style: { marginRight: '8px' }
                    }),
                    React.createElement('span', { key: 'name' }, record.publisher_name)
                ])
            )
        },
        {
            title: '投诉量',
            dataIndex: 'complaint_count',
            key: 'complaint_count',
            width: 80,
            sorter: true,
            render: (count) => (
                React.createElement('span', {
                    style: { 
                        fontWeight: 'bold',
                        color: count > 10 ? '#ff4d4f' : count > 5 ? '#faad14' : '#52c41a'
                    }
                }, count)
            )
        },
        {
            title: '投诉类型',
            dataIndex: 'complaint_types',
            key: 'complaint_types',
            width: 150,
            render: renderComplaintTypes
        },
        {
            title: '限流状态',
            key: 'limit_status',
            width: 120,
            render: (_, record) => renderLimitStatusTag(record)
        },
        {
            title: '最新投诉时间',
            dataIndex: 'latest_complaint_time',
            key: 'latest_complaint_time',
            width: 140,
            sorter: true,
            render: (time) => (
                React.createElement('span', {
                    style: { fontSize: '12px' }
                }, new Date(time).toLocaleString())
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: renderStatusTag
        },
        {
            title: '操作',
            key: 'actions',
            width: 260,
            render: (_, record) => {
                const isLimited = record.limit_status === 'limited';
                const canLimit = record.limit_status === 'none' || record.limit_status === 'expired';
                
                return React.createElement(Space, { 
                    size: 'small',
                    direction: 'vertical'
                }, [
                    React.createElement(Space, { key: 'row1', size: 'small' }, [
                        React.createElement(Button, {
                            key: 'detail',
                            type: 'link',
                            size: 'small',
                            onClick: () => handleViewDetail(record)
                        }, '查看详情'),
                        canLimit && React.createElement(Button, {
                            key: 'limit',
                            type: 'link',
                            size: 'small',
                            style: { color: '#fa8c16' },
                            onClick: () => handleLimitVideo(record)
                        }, '限流'),
                        isLimited && React.createElement(Button, {
                            key: 'remove-limit',
                            type: 'link',
                            size: 'small',
                            onClick: () => handleRemoveLimit(record)
                        }, '解除限流')
                    ]),
                    React.createElement(Space, { key: 'row2', size: 'small' }, [
                        React.createElement(Button, {
                            key: 'ignore',
                            type: 'link',
                            size: 'small',
                            disabled: record.status === 'processed',
                            onClick: () => handleIgnoreComplaint(record)
                        }, '忽略投诉'),
                        React.createElement(Button, {
                            key: 'remove',
                            type: 'link',
                            size: 'small',
                            danger: true,
                            disabled: record.status === 'processed',
                            onClick: () => handleRemoveVideo(record)
                        }, '下架视频'),
                        React.createElement(Button, {
                            key: 'ban',
                            type: 'link',
                            size: 'small',
                            danger: true,
                            onClick: () => handleBanAccount(record)
                        }, '封禁账号')
                    ])
                ])
            }
        }
    ];

    // 统计数据
    const getStatistics = () => {
        const total = complaints.length;
        const pending = complaints.filter(item => item.status === 'pending').length;
        const processed = complaints.filter(item => item.status === 'processed').length;
        const highRisk = complaints.filter(item => item.complaint_count > 10).length;
        const limited = complaints.filter(item => item.limit_status === 'limited').length;
        
        return { total, pending, processed, highRisk, limited };
    };

    // 渲染限流配置模态框
    const renderLimitModal = () => {
        return React.createElement(Modal, {
            title: `视频限流设置 - ${selectedVideoForLimit?.video_title}`,
            visible: limitModalVisible,
            onCancel: () => {
                setLimitModalVisible(false);
                limitForm.resetFields();
                setSelectedVideoForLimit(null);
            },
            footer: [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setLimitModalVisible(false);
                        limitForm.resetFields();
                        setSelectedVideoForLimit(null);
                    }
                }, '取消'),
                React.createElement(Button, {
                    key: 'confirm',
                    type: 'primary',
                    loading: loading,
                    onClick: () => limitForm.submit()
                }, '确认限流')
            ],
            width: 700
        }, React.createElement(Form, {
            form: limitForm,
            layout: 'vertical',
            onFinish: handleLimitSubmit
        }, [
            React.createElement(Alert, {
                key: 'info',
                type: 'info',
                message: '限流说明',
                description: '限流后该视频在APP中的推送量将按设定比例降低，但不影响用户主动搜索和观看。支持智能推荐和手动调整。',
                style: { marginBottom: 24 },
                showIcon: true
            }),

            // 智能推荐信息
            selectedVideoForLimit && React.createElement('div', {
                key: 'recommendation',
                style: { marginBottom: 24, padding: 16, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }
            }, [
                React.createElement('h4', {
                    key: 'title',
                    style: { marginBottom: 12, color: '#389e0d' }
                }, '🤖 智能推荐算法分析'),
                React.createElement('div', {
                    key: 'analysis',
                    style: { fontSize: 14, lineHeight: 1.6 }
                }, (() => {
                    const recommendation = calculateRecommendation(selectedVideoForLimit);
                    const details = recommendation.details;
                    
                    return [
                        React.createElement('div', { 
                            key: 'formula',
                            style: { marginBottom: 12, padding: 12, background: '#fff', borderRadius: 4, fontFamily: 'monospace' }
                        }, [
                            React.createElement('strong', { key: 'title' }, '计算公式：'),
                            React.createElement('div', { 
                                key: 'content',
                                style: { marginTop: 4, color: '#1890ff' }
                            }, `最终限流比例 = 基础分数 × 类型权重系数 × 播放量系数 × 时间系数`)
                        ]),
                        React.createElement(Row, { key: 'calculation', gutter: 16 }, [
                            React.createElement(Col, { key: 'base', span: 6 }, [
                                React.createElement('div', { 
                                    key: 'label',
                                    style: { fontWeight: 'bold', color: '#722ed1' }
                                }, '📊 基础分数'),
                                React.createElement('div', { key: 'value' }, `${details.baseScore}%`),
                                React.createElement('div', { 
                                    key: 'desc',
                                    style: { fontSize: 12, color: '#666' }
                                }, `${selectedVideoForLimit.complaint_count}次投诉`)
                            ]),
                            React.createElement(Col, { key: 'type', span: 6 }, [
                                React.createElement('div', { 
                                    key: 'label',
                                    style: { fontWeight: 'bold', color: '#fa541c' }
                                }, '⚖️ 类型权重'),
                                React.createElement('div', { key: 'value' }, `×${details.typeMultiplier}`),
                                React.createElement('div', { 
                                    key: 'desc',
                                    style: { fontSize: 12, color: '#666' }
                                }, `平均${details.avgTypeWeight}分`)
                            ]),
                            React.createElement(Col, { key: 'views', span: 6 }, [
                                React.createElement('div', { 
                                    key: 'label',
                                    style: { fontWeight: 'bold', color: '#13c2c2' }
                                }, '👀 播放量系数'),
                                React.createElement('div', { key: 'value' }, `×${details.viewsMultiplier}`),
                                React.createElement('div', { 
                                    key: 'desc',
                                    style: { fontSize: 12, color: '#666' }
                                }, `${selectedVideoForLimit.video_views.toLocaleString()}次播放`)
                            ]),
                            React.createElement(Col, { key: 'time', span: 6 }, [
                                React.createElement('div', { 
                                    key: 'label',
                                    style: { fontWeight: 'bold', color: '#52c41a' }
                                }, '⏰ 时间系数'),
                                React.createElement('div', { key: 'value' }, `×${details.timeMultiplier}`),
                                React.createElement('div', { 
                                    key: 'desc',
                                    style: { fontSize: 12, color: '#666' }
                                }, '最新投诉时间')
                            ])
                        ]),
                        React.createElement('div', {
                            key: 'result',
                            style: { 
                                marginTop: 16, 
                                padding: 12, 
                                background: '#fff2e8', 
                                border: '1px solid #ffbb96',
                                borderRadius: 4,
                                textAlign: 'center'
                            }
                        }, [
                            React.createElement('div', {
                                key: 'title',
                                style: { fontWeight: 'bold', marginBottom: 8 }
                            }, '🎯 推荐结果'),
                            React.createElement('div', {
                                key: 'content',
                                style: { fontSize: 16, color: '#fa541c' }
                            }, `${limitLevels[recommendation.level].label} ${recommendation.percentage}% (${recommendation.duration}天)`)
                        ])
                    ];
                })())
            ]),

            // 快捷配置
            React.createElement('div', {
                key: 'quick-config',
                style: { marginBottom: 24 }
            }, [
                React.createElement('div', {
                    key: 'header',
                    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }
                }, [
                    React.createElement('h4', {
                        key: 'title',
                        style: { margin: 0 }
                    }, '⚡ 快捷配置'),
                    React.createElement(Button, {
                        key: 'reset',
                        size: 'small',
                        onClick: resetToRecommended
                    }, '🎯 重置为智能推荐')
                ]),
                React.createElement('div', {
                    key: 'buttons',
                    style: { display: 'flex', gap: 8, flexWrap: 'wrap' }
                }, quickConfigs.map(config => 
                    React.createElement(Button, {
                        key: config.name,
                        size: 'small',
                        onClick: () => applyQuickConfig(config),
                        style: { 
                            borderColor: config.level === 'heavy' ? '#ff4d4f' : 
                                         config.level === 'medium' ? '#faad14' : '#52c41a',
                            color: config.level === 'heavy' ? '#ff4d4f' : 
                                   config.level === 'medium' ? '#faad14' : '#52c41a'
                        }
                    }, config.name)
                ))
            ]),

            React.createElement(Row, { key: 'main-config', gutter: 16 }, [
                React.createElement(Col, { key: 'level', span: 12 },
                    React.createElement(Form.Item, {
                        label: '限流等级',
                        name: 'limit_level',
                        rules: [{ required: true, message: '请选择限流等级' }]
                    }, React.createElement(Select, {
                        placeholder: '请选择限流等级',
                        onChange: handleLimitLevelChange
                    }, Object.keys(limitLevels).map(level => 
                        React.createElement(Option, { key: level, value: level }, 
                            React.createElement('div', {}, [
                                React.createElement('div', { 
                                    key: 'label',
                                    style: { fontWeight: 'bold' }
                                }, limitLevels[level].label),
                                React.createElement('div', { 
                                    key: 'desc',
                                    style: { fontSize: 12, color: '#999' } 
                                }, limitLevels[level].description)
                            ])
                        )
                    )))
                ),
                React.createElement(Col, { key: 'percentage', span: 12 },
                    React.createElement(Form.Item, {
                        label: '限流比例 (%)',
                        name: 'limit_percentage',
                        rules: [
                            { required: true, message: '请输入限流比例' },
                            { type: 'number', min: 1, max: 95, message: '限流比例必须在1-95之间' }
                        ]
                    }, React.createElement(InputNumber, {
                        min: 1,
                        max: 95,
                        style: { width: '100%' },
                        placeholder: '可手动调整',
                        formatter: value => `${value}%`,
                        parser: value => value.replace('%', ''),
                        onChange: (value) => {
                            if (value && value !== limitForm.getFieldValue('limit_percentage')) {
                                // 用户手动修改时的提示
                                setTimeout(() => {
                                    const currentLevel = limitForm.getFieldValue('limit_level');
                                    const defaultPercentage = limitLevels[currentLevel]?.defaultPercentage;
                                    if (defaultPercentage && Math.abs(value - defaultPercentage) > 10) {
                                        message.info('您已自定义限流比例，偏离系统推荐值较多');
                                    }
                                }, 100);
                            }
                        }
                    }))
                )
            ]),

            React.createElement(Row, { key: 'duration-config', gutter: 16 }, [
                React.createElement(Col, { key: 'duration', span: 12 },
                    React.createElement(Form.Item, {
                        label: '限流时长 (天)',
                        name: 'duration_days',
                        rules: [
                            { required: true, message: '请输入限流时长' },
                            { type: 'number', min: 1, max: 90, message: '限流时长必须在1-90天之间' }
                        ]
                    }, React.createElement(InputNumber, {
                        min: 1,
                        max: 90,
                        style: { width: '100%' },
                        placeholder: '1-90天',
                        addonAfter: '天'
                    }))
                ),
                React.createElement(Col, { key: 'preview', span: 12 },
                    React.createElement('div', {
                        style: { marginTop: 30 }
                    }, React.createElement(Form.Item, {
                        shouldUpdate: (prevValues, currentValues) => {
                            return prevValues.limit_percentage !== currentValues.limit_percentage ||
                                   prevValues.duration_days !== currentValues.duration_days;
                        }
                    }, ({ getFieldValue }) => {
                        const percentage = getFieldValue('limit_percentage') || 0;
                        const duration = getFieldValue('duration_days') || 0;
                        const originalViews = selectedVideoForLimit?.video_views || 0;
                        const estimatedReduction = Math.round(originalViews * percentage / 100);
                        
                        return React.createElement('div', {
                            style: { 
                                padding: 12, 
                                background: '#f0f0f0', 
                                borderRadius: 6,
                                fontSize: 12
                            }
                        }, [
                            React.createElement('div', { key: 'title', style: { fontWeight: 'bold', marginBottom: 4 } }, '📈 效果预览'),
                            React.createElement('div', { key: 'reduction' }, `预计减少推送: ${estimatedReduction.toLocaleString()} 次`),
                            React.createElement('div', { key: 'duration' }, `限流期限: ${duration}天`),
                            React.createElement('div', { 
                                key: 'end-date',
                                style: { color: '#666' }
                            }, duration > 0 ? `结束时间: ${new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toLocaleDateString()}` : '')
                        ]);
                    }))
                )
            ]),

            React.createElement(Form.Item, {
                key: 'reason',
                label: '限流原因',
                name: 'limit_reason',
                rules: [
                    { required: true, message: '请输入限流原因' },
                    { max: 200, message: '限流原因不能超过200个字符' }
                ]
            }, React.createElement(Input.TextArea, {
                rows: 3,
                placeholder: '请详细说明限流原因，便于后续审核和申诉处理。支持智能填充或手动编辑。',
                maxLength: 200,
                showCount: true
            })),

            React.createElement(Alert, {
                key: 'warning',
                type: 'warning',
                message: '操作提醒',
                description: '限流操作将立即生效，请确认配置无误。如需紧急处理，建议先使用轻度限流观察效果。',
                style: { marginTop: 16 },
                showIcon: true
            })
        ]));
    };

    const stats = getStatistics();
    const filteredData = getFilteredAndSortedData();

    return React.createElement('div', {
        style: { padding: '0' }
    }, [
        // 页面标题
        React.createElement('div', {
            key: 'header',
            style: { marginBottom: '24px' }
        }, [
            React.createElement('div', {
                key: 'title-row',
                style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                }
            }, [
                React.createElement('h2', {
                    key: 'title',
                    style: { 
                        fontSize: '24px', 
                        fontWeight: '600', 
                        margin: '0',
                        color: '#333'
                    }
                }, '投诉管理'),
                React.createElement(Space, { key: 'actions' }, [
                    React.createElement(Button, {
                        key: 'config',
                        type: 'primary',
                        icon: React.createElement('span', {}, '⚙️'),
                        onClick: openConfigModal,
                        style: { 
                            background: '#722ed1',
                            borderColor: '#722ed1'
                        }
                    }, '智能推荐配置'),
                    React.createElement(Button, {
                        key: 'refresh',
                        onClick: loadComplaints,
                        loading: loading
                    }, '刷新数据')
                ])
            ]),
            React.createElement('div', {
                key: 'description',
                style: { 
                    color: '#666', 
                    fontSize: '14px',
                    margin: '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16
                }
            }, [
                React.createElement('span', { key: 'main-desc' }, '管理用户投诉的视频内容，支持视频限流、下架和账号封禁操作'),
                React.createElement('span', { 
                    key: 'separator',
                    style: { color: '#d9d9d9' }
                }, '|'),
                React.createElement('span', { 
                    key: 'config-status',
                    style: { 
                        color: '#722ed1',
                        fontSize: '12px',
                        background: '#f9f0ff',
                        padding: '2px 8px',
                        borderRadius: 4,
                        border: '1px solid #d3adf7'
                    }
                }, `🤖 智能推荐已启用 (基于${recommendationConfig.complaintThresholds.length}级阈值配置)`)
            ])
        ]),

        // 统计卡片
        React.createElement(Row, {
            key: 'stats',
            gutter: 16,
            style: { marginBottom: '24px' }
        }, [
            React.createElement(Col, { key: 'total', span: 4 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '总投诉数',
                    value: stats.total,
                    valueStyle: { color: '#1890ff' }
                }))
            ),
            React.createElement(Col, { key: 'pending', span: 4 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '待处理',
                    value: stats.pending,
                    valueStyle: { color: '#faad14' }
                }))
            ),
            React.createElement(Col, { key: 'processed', span: 4 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '已处理',
                    value: stats.processed,
                    valueStyle: { color: '#52c41a' }
                }))
            ),
            React.createElement(Col, { key: 'highRisk', span: 4 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '高风险',
                    value: stats.highRisk,
                    valueStyle: { color: '#ff4d4f' },
                    suffix: '个'
                }))
            ),
            React.createElement(Col, { key: 'limited', span: 4 },
                React.createElement(Card, {
                    style: { textAlign: 'center' }
                }, React.createElement(Statistic, {
                    title: '限流中',
                    value: stats.limited,
                    valueStyle: { color: '#fa8c16' },
                    suffix: '个'
                }))
            )
        ]),

        // 搜索和筛选
        React.createElement(Card, {
            key: 'filters',
            style: { marginBottom: '16px' }
        }, React.createElement(Row, {
            gutter: 16,
            align: 'middle'
        }, [
            React.createElement(Col, { key: 'search', span: 8 },
                React.createElement(Search, {
                    placeholder: '搜索视频标题、发布者或投诉类型',
                    value: searchText,
                    onChange: (e) => setSearchText(e.target.value),
                    style: { width: '100%' }
                })
            ),
            React.createElement(Col, { key: 'status', span: 4 },
                React.createElement(Select, {
                    value: statusFilter,
                    onChange: setStatusFilter,
                    style: { width: '100%' },
                    placeholder: '筛选状态'
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                    React.createElement(Option, { key: 'pending', value: 'pending' }, '待处理'),
                    React.createElement(Option, { key: 'reviewing', value: 'reviewing' }, '审核中'),
                    React.createElement(Option, { key: 'processed', value: 'processed' }, '已处理')
                ])
            ),
            React.createElement(Col, { key: 'sort', span: 4 },
                React.createElement(Select, {
                    value: sortBy,
                    onChange: setSortBy,
                    style: { width: '100%' },
                    placeholder: '排序方式'
                }, [
                    React.createElement(Option, { key: 'complaint_count', value: 'complaint_count' }, '投诉量'),
                    React.createElement(Option, { key: 'latest_complaint_time', value: 'latest_complaint_time' }, '投诉时间'),
                    React.createElement(Option, { key: 'video_views', value: 'video_views' }, '播放量')
                ])
            ),
            React.createElement(Col, { key: 'order', span: 4 },
                React.createElement(Select, {
                    value: sortOrder,
                    onChange: setSortOrder,
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'desc', value: 'desc' }, '降序'),
                    React.createElement(Option, { key: 'asc', value: 'asc' }, '升序')
                ])
            ),
            React.createElement(Col, { key: 'limit-filter', span: 4 },
                React.createElement(Select, {
                    placeholder: '限流状态',
                    allowClear: true,
                    onChange: (value) => {
                        // 这里可以添加限流状态筛选逻辑
                        message.info(`筛选${value || '全部'}限流状态`);
                    },
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'none', value: 'none' }, '未限流'),
                    React.createElement(Option, { key: 'limited', value: 'limited' }, '限流中'),
                    React.createElement(Option, { key: 'expired', value: 'expired' }, '已过期')
                ])
            )
        ])),

        // 数据表格
        React.createElement(Card, {
            key: 'table',
            title: React.createElement('div', {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
            }, [
                React.createElement('span', { key: 'title' }, `投诉列表 (${filteredData.length}条)`),
                React.createElement(Space, { key: 'actions' }, [
                    React.createElement(Button, {
                        key: 'config-link',
                        size: 'small',
                        type: 'link',
                        icon: React.createElement('span', {}, '⚙️'),
                        onClick: openConfigModal,
                        style: { color: '#722ed1' }
                    }, '智能推荐配置'),
                    React.createElement(Button, {
                        key: 'export',
                        size: 'small',
                        onClick: () => message.info('导出功能开发中')
                    }, '导出数据')
                ])
            ])
        }, React.createElement(Table, {
            columns: columns,
            dataSource: filteredData,
            rowKey: 'id',
            loading: loading,
            pagination: {
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            },
            scroll: { x: 1400 }
        })),

        // 详情模态框
        selectedComplaint && React.createElement(Modal, {
            key: 'detailModal',
            title: '投诉详情',
            visible: detailModalVisible,
            onCancel: () => setDetailModalVisible(false),
            footer: [
                React.createElement(Button, {
                    key: 'close',
                    onClick: () => setDetailModalVisible(false)
                }, '关闭'),
                selectedComplaint.limit_status === 'none' && React.createElement(Button, {
                    key: 'limit',
                    type: 'primary',
                    style: { backgroundColor: '#fa8c16', borderColor: '#fa8c16' },
                    onClick: () => {
                        setDetailModalVisible(false);
                        handleLimitVideo(selectedComplaint);
                    }
                }, '设置限流'),
                React.createElement(Button, {
                    key: 'remove',
                    type: 'primary',
                    danger: true,
                    onClick: () => {
                        setDetailModalVisible(false);
                        handleRemoveVideo(selectedComplaint);
                    }
                }, '下架视频'),
                React.createElement(Button, {
                    key: 'ban',
                    type: 'primary',
                    danger: true,
                    onClick: () => {
                        setDetailModalVisible(false);
                        handleBanAccount(selectedComplaint);
                    }
                }, '封禁账号')
            ],
            width: 800
        }, React.createElement('div', {}, [
            // 视频信息
            React.createElement(Descriptions, {
                key: 'video',
                title: '视频信息',
                bordered: true,
                column: 2,
                style: { marginBottom: '24px' }
            }, [
                React.createElement(Descriptions.Item, {
                    key: 'title',
                    label: '视频标题',
                    span: 2
                }, selectedComplaint.video_title),
                React.createElement(Descriptions.Item, {
                    key: 'publisher',
                    label: '发布者'
                }, selectedComplaint.publisher_name),
                React.createElement(Descriptions.Item, {
                    key: 'duration',
                    label: '视频时长'
                }, selectedComplaint.video_duration),
                React.createElement(Descriptions.Item, {
                    key: 'views',
                    label: '播放量'
                }, selectedComplaint.video_views.toLocaleString()),
                React.createElement(Descriptions.Item, {
                    key: 'publish_time',
                    label: '发布时间'
                }, new Date(selectedComplaint.video_publish_time).toLocaleString())
            ]),

            // 限流信息（如果存在）
            selectedComplaint.limit_status !== 'none' && React.createElement(Descriptions, {
                key: 'limit',
                title: '限流信息',
                bordered: true,
                column: 2,
                style: { marginBottom: '24px' }
            }, [
                React.createElement(Descriptions.Item, {
                    key: 'status',
                    label: '限流状态'
                }, renderLimitStatusTag(selectedComplaint)),
                React.createElement(Descriptions.Item, {
                    key: 'percentage',
                    label: '限流比例'
                }, `${selectedComplaint.limit_percentage}%`),
                React.createElement(Descriptions.Item, {
                    key: 'start_time',
                    label: '开始时间'
                }, new Date(selectedComplaint.limit_start_time).toLocaleString()),
                React.createElement(Descriptions.Item, {
                    key: 'end_time',
                    label: '结束时间'
                }, new Date(selectedComplaint.limit_end_time).toLocaleString()),
                React.createElement(Descriptions.Item, {
                    key: 'reason',
                    label: '限流原因',
                    span: 2
                }, selectedComplaint.limit_reason)
            ]),

            // 投诉信息
            React.createElement('div', {
                key: 'complaint',
                style: { marginTop: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }
            }, [
                React.createElement('h4', {
                    key: 'complaintTitle',
                    style: { marginBottom: '12px' }
                }, '投诉信息'),
                React.createElement('p', { key: 'count' }, [
                    React.createElement('strong', {}, '投诉次数：'),
                    React.createElement('span', {
                        style: { color: '#ff4d4f', fontWeight: 'bold' }
                    }, selectedComplaint.complaint_count)
                ]),
                React.createElement('p', { key: 'types' }, [
                    React.createElement('strong', {}, '投诉类型：'),
                    React.createElement('div', { style: { marginTop: '8px' } },
                        renderComplaintTypes(selectedComplaint.complaint_types)
                    )
                ]),
                React.createElement('p', { key: 'firstTime' }, [
                    React.createElement('strong', {}, '首次投诉：'),
                    new Date(selectedComplaint.first_complaint_time).toLocaleString()
                ]),
                React.createElement('p', { key: 'latestTime' }, [
                    React.createElement('strong', {}, '最新投诉：'),
                    new Date(selectedComplaint.latest_complaint_time).toLocaleString()
                ])
            ])
        ])),

        // 限流配置模态框
        renderLimitModal(),

        // 配置管理模态框 (简化版)
        React.createElement(Modal, {
            key: 'configModal',
            title: '限流规则配置',
            visible: configModalVisible,
            onCancel: () => {
                setConfigModalVisible(false);
                configForm.resetFields();
            },
            footer: [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setConfigModalVisible(false);
                        configForm.resetFields();
                    }
                }, '取消'),
                React.createElement(Button, {
                    key: 'strict',
                    onClick: () => applyPresetConfig('strict')
                }, '严格模式'),
                React.createElement(Button, {
                    key: 'lenient',
                    onClick: () => applyPresetConfig('lenient')
                }, '宽松模式'),
                React.createElement(Button, {
                    key: 'reset',
                    onClick: resetConfigToDefault
                }, '重置默认'),
                React.createElement(Button, {
                    key: 'save',
                    type: 'primary',
                    loading: loading,
                    onClick: () => {
                        message.success('限流规则配置已保存！');
                        setConfigModalVisible(false);
                    }
                }, '保存配置')
            ],
            width: 1000
        }, React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'info',
                type: 'info',
                message: '限流规则说明',
                description: '设置投诉量达到指定阈值时自动应用的限流策略。运维人员可以配置：投诉量 > 100次 → 重度限流，投诉量 > 50次 → 中度限流等规则。',
                style: { marginBottom: 24 },
                showIcon: true
            }),

            // 规则配置表格
            React.createElement('div', {
                key: 'rules-section',
                style: { marginBottom: 24 }
            }, [
                React.createElement('h3', {
                    key: 'title',
                    style: { marginBottom: 16, color: '#1890ff' }
                }, '📋 投诉量限流规则'),
                React.createElement('div', {
                    key: 'example',
                    style: { 
                        marginBottom: 16, 
                        padding: 12, 
                        background: '#e6f7ff', 
                        border: '1px solid #91d5ff',
                        borderRadius: 4,
                        fontSize: 13
                    }
                }, [
                    React.createElement('strong', { key: 'title' }, '💡 配置示例：'),
                    React.createElement('div', { key: 'content', style: { marginTop: 4 } }, 
                        '投诉量 1-5次 → 轻度限流20% (3天)，投诉量 6-15次 → 中度限流50% (7天)，投诉量 16+次 → 重度限流80% (14天)'
                    )
                ]),
                React.createElement('div', {
                    key: 'rules-table',
                    style: { 
                        border: '1px solid #d9d9d9',
                        borderRadius: 6,
                        overflow: 'hidden'
                    }
                }, [
                    // 表头
                    React.createElement('div', {
                        key: 'header',
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '160px 120px 120px 120px 100px 1fr',
                            background: '#fafafa',
                            padding: '12px',
                            borderBottom: '1px solid #d9d9d9',
                            fontWeight: 'bold',
                            fontSize: 13
                        }
                    }, [
                        React.createElement('div', { key: 'condition' }, '🎯 投诉量条件'),
                        React.createElement('div', { key: 'level' }, '📊 限流等级'),
                        React.createElement('div', { key: 'percentage' }, '📉 限流比例'),
                        React.createElement('div', { key: 'duration' }, '⏱️ 限流时长'),
                        React.createElement('div', { key: 'status' }, '✅ 状态'),
                        React.createElement('div', { key: 'description' }, '📝 效果说明')
                    ]),
                    
                    // 规则行
                    recommendationConfig.complaintThresholds.map((rule, index) => 
                        React.createElement('div', {
                            key: index,
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '160px 120px 120px 120px 100px 1fr',
                                padding: '12px',
                                borderBottom: index < recommendationConfig.complaintThresholds.length - 1 ? '1px solid #f0f0f0' : 'none',
                                background: index % 2 === 0 ? '#fff' : '#fafafa',
                                alignItems: 'center'
                            }
                        }, [
                            React.createElement('div', { 
                                key: 'condition',
                                style: { display: 'flex', alignItems: 'center' }
                            }, [
                                React.createElement(InputNumber, {
                                    key: 'min',
                                    size: 'small',
                                    min: 1,
                                    max: 999,
                                    value: rule.minCount,
                                    onChange: (value) => {
                                        const newConfig = { ...recommendationConfig };
                                        newConfig.complaintThresholds[index].minCount = value;
                                        setRecommendationConfig(newConfig);
                                    },
                                    style: { width: 50 }
                                }),
                                React.createElement('span', { 
                                    key: 'to',
                                    style: { margin: '0 4px', fontSize: 12 }
                                }, '~'),
                                React.createElement(InputNumber, {
                                    key: 'max',
                                    size: 'small',
                                    min: rule.minCount || 1,
                                    max: 999,
                                    value: rule.maxCount === 999 ? null : rule.maxCount,
                                    placeholder: '∞',
                                    onChange: (value) => {
                                        const newConfig = { ...recommendationConfig };
                                        newConfig.complaintThresholds[index].maxCount = value || 999;
                                        setRecommendationConfig(newConfig);
                                    },
                                    style: { width: 50 }
                                }),
                                React.createElement('span', { 
                                    key: 'unit',
                                    style: { marginLeft: 4, fontSize: 12, color: '#666' }
                                }, '次')
                            ]),
                            React.createElement(Select, {
                                key: 'level',
                                size: 'small',
                                value: rule.level,
                                onChange: (value) => {
                                    const newConfig = { ...recommendationConfig };
                                    newConfig.complaintThresholds[index].level = value;
                                    // 自动更新默认比例
                                    newConfig.complaintThresholds[index].percentage = limitLevels[value].defaultPercentage;
                                    setRecommendationConfig(newConfig);
                                },
                                style: { width: '100%' }
                            }, Object.keys(limitLevels).map(level => 
                                React.createElement(Option, { key: level, value: level }, 
                                    limitLevels[level].label
                                )
                            )),
                            React.createElement(InputNumber, {
                                key: 'percentage',
                                size: 'small',
                                min: 1,
                                max: 95,
                                value: rule.percentage,
                                onChange: (value) => {
                                    const newConfig = { ...recommendationConfig };
                                    newConfig.complaintThresholds[index].percentage = value;
                                    setRecommendationConfig(newConfig);
                                },
                                formatter: value => `${value}%`,
                                parser: value => value.replace('%', ''),
                                style: { width: '100%' }
                            }),
                            React.createElement(InputNumber, {
                                key: 'duration',
                                size: 'small',
                                min: 1,
                                max: 90,
                                value: rule.duration,
                                onChange: (value) => {
                                    const newConfig = { ...recommendationConfig };
                                    newConfig.complaintThresholds[index].duration = value;
                                    setRecommendationConfig(newConfig);
                                },
                                addonAfter: '天',
                                style: { width: '100%' }
                            }),
                            React.createElement('div', {
                                key: 'status',
                                style: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
                            }, React.createElement(Tag, {
                                color: limitLevels[rule.level].color,
                                size: 'small'
                            }, '启用')),
                            React.createElement('div', {
                                key: 'description',
                                style: { 
                                    fontSize: 12, 
                                    color: '#666',
                                    lineHeight: 1.4
                                }
                            }, `投诉${rule.minCount}${rule.maxCount === 999 ? '+' : '-' + rule.maxCount}次 → ${limitLevels[rule.level].label}${rule.percentage}% (${rule.duration}天)`)
                        ])
                    )
                ])
            ]),

            // 投诉类型权重配置 (简化版)
            React.createElement('div', {
                key: 'types-section',
                style: { marginBottom: 24 }
            }, [
                React.createElement('h3', {
                    key: 'title',
                    style: { marginBottom: 16, color: '#fa541c' }
                }, '⚖️ 投诉类型权重'),
                React.createElement('div', {
                    key: 'description',
                    style: { marginBottom: 12, color: '#666', fontSize: 13 }
                }, '不同投诉类型的严重程度权重，影响最终限流比例计算'),
                React.createElement(Row, { key: 'types', gutter: [16, 12] },
                    Object.entries(recommendationConfig.complaintTypeWeights).map(([type, weight]) => 
                        React.createElement(Col, { key: type, span: 6 },
                            React.createElement('div', {
                                style: { 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: 4,
                                    background: weight >= 20 ? '#fff2f0' : weight >= 15 ? '#fffbe6' : '#f6ffed'
                                }
                            }, [
                                React.createElement('span', {
                                    key: 'label',
                                    style: { 
                                        flex: 1, 
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: weight >= 20 ? '#ff4d4f' : weight >= 15 ? '#faad14' : '#52c41a'
                                    }
                                }, type),
                                React.createElement(InputNumber, {
                                    key: 'weight',
                                    size: 'small',
                                    min: 1,
                                    max: 50,
                                    value: weight,
                                    onChange: (value) => {
                                        const newConfig = { ...recommendationConfig };
                                        newConfig.complaintTypeWeights[type] = value;
                                        setRecommendationConfig(newConfig);
                                    },
                                    style: { width: 60 }
                                }),
                                React.createElement('span', {
                                    key: 'unit',
                                    style: { marginLeft: 4, fontSize: 12, color: '#999' }
                                }, '分')
                            ])
                        )
                    )
                )
            ]),

            React.createElement(Alert, {
                key: 'usage',
                type: 'warning',
                message: '使用说明',
                description: [
                    '• 运维人员可以设置不同投诉量阈值对应的限流策略',
                    '• 系统将根据视频投诉量自动匹配对应的限流规则',
                    '• 投诉类型权重会影响最终限流比例的计算',
                    '• 配置保存后立即生效，请谨慎操作'
                ].join('\n'),
                style: { marginTop: 24 },
                showIcon: true
            })
        ]))
    ]);
};

window.App.pages.ComplaintManagement = ComplaintManagement;
console.log('[ComplaintManagement] 组件挂载成功'); 