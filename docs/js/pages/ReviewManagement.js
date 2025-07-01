// 审核管理页面 - 基于新功能规范重构
const ReviewManagement = () => {
    const { Tabs, Table, Card, Button, Space, Tag, Input, Select, Modal, Progress, Alert, Tooltip, Row, Col, Descriptions, Badge, Statistic, Form, message, DatePicker, RangePicker } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { RangePicker: DateRangePicker } = DatePicker;
    
    const [activeTab, setActiveTab] = React.useState('image');
    const [imageQueue, setImageQueue] = React.useState([]);
    const [videoQueue, setVideoQueue] = React.useState([]);
    const [interactionQueue, setInteractionQueue] = React.useState([]);
    const [specialQueue, setSpecialQueue] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState(null);
    
    // 搜索和筛选状态
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [typeFilter, setTypeFilter] = React.useState('all');
    const [authorTypeFilter, setAuthorTypeFilter] = React.useState('all');
    const [timeRange, setTimeRange] = React.useState(null);
    const [priorityFilter, setPriorityFilter] = React.useState('all');
    
    const [stats, setStats] = React.useState({
        image: { pending: 145, approved: 892, rejected: 23 },
        video: { pending: 56, approved: 234, rejected: 12 },
        interaction: { pending: 389, approved: 1567, rejected: 45 },
        special: { pending: 8, approved: 67, rejected: 3 }
    });

    React.useEffect(() => {
        loadCurrentQueue();
    }, [activeTab, searchText, statusFilter, typeFilter, authorTypeFilter, timeRange, priorityFilter]);

    // 重置筛选条件
    const resetFilters = () => {
        setSearchText('');
        setStatusFilter('all');
        setTypeFilter('all');
        setAuthorTypeFilter('all');
        setTimeRange(null);
        setPriorityFilter('all');
    };

    // 导出数据
    const handleExport = () => {
        const currentData = getCurrentData();
        const filteredData = filterData(currentData);
        
        message.loading('正在导出数据...', 2);
        setTimeout(() => {
            message.success(`已导出 ${filteredData.length} 条${getTabDisplayName(activeTab)}数据`);
        }, 2000);
    };

    // 获取当前Tab的数据
    const getCurrentData = () => {
        switch(activeTab) {
            case 'image': return imageQueue;
            case 'video': return videoQueue;
            case 'interaction': return interactionQueue;
            case 'special': return specialQueue;
            default: return [];
        }
    };

    // 获取Tab显示名称
    const getTabDisplayName = (tab) => {
        const names = {
            image: '图文内容',
            video: '视频内容', 
            interaction: '互动内容',
            special: '特殊审核'
        };
        return names[tab] || '内容';
    };

    // 数据筛选逻辑
    const filterData = (data) => {
        return data.filter(item => {
            // 文本搜索
            if (searchText && !item.title?.toLowerCase().includes(searchText.toLowerCase()) && 
                !item.content?.toLowerCase().includes(searchText.toLowerCase()) &&
                !item.author?.toLowerCase().includes(searchText.toLowerCase())) {
                return false;
            }
            
            // 状态筛选
            if (statusFilter !== 'all' && item.status !== statusFilter) {
                return false;
            }
            
            // 类型筛选
            if (typeFilter !== 'all' && item.type !== typeFilter) {
                return false;
            }
            
            // 作者类型筛选
            if (authorTypeFilter !== 'all' && item.authorType !== authorTypeFilter) {
                return false;
            }
            
            // 优先级筛选
            if (priorityFilter !== 'all' && item.priority !== priorityFilter) {
                return false;
            }
            
            // 时间范围筛选
            if (timeRange && timeRange.length === 2) {
                const itemTime = new Date(item.submitTime);
                const startTime = timeRange[0].startOf('day');
                const endTime = timeRange[1].endOf('day');
                if (itemTime < startTime || itemTime > endTime) {
                    return false;
                }
            }
            
            return true;
        });
    };

    // 渲染搜索和筛选工具栏
    const renderSearchToolbar = () => {
        return React.createElement(Card, {
            style: { marginBottom: '16px' },
            bodyStyle: { padding: '16px' }
        }, [
            React.createElement(Row, {
                key: 'search-row',
                gutter: [16, 16],
                align: 'middle'
            }, [
                React.createElement(Col, { span: 6 }, [
                    React.createElement(Search, {
                        placeholder: `搜索${getTabDisplayName(activeTab)}名称、内容或作者`,
                        value: searchText,
                        onChange: (e) => setSearchText(e.target.value),
                        onSearch: (value) => setSearchText(value),
                        allowClear: true,
                        enterButton: true
                    })
                ]),
                React.createElement(Col, { span: 3 }, [
                    React.createElement(Select, {
                        placeholder: "状态筛选",
                        value: statusFilter,
                        onChange: setStatusFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部状态'),
                        React.createElement(Option, { value: 'pending' }, '待审核'),
                        React.createElement(Option, { value: 'ai_reviewing' }, 'AI审核中'),
                        React.createElement(Option, { value: 'manual_review' }, '人工复审'),
                        React.createElement(Option, { value: 'approved' }, '已通过'),
                        React.createElement(Option, { value: 'rejected' }, '未通过'),
                        React.createElement(Option, { value: 'pending_dingding' }, '等待钉钉审批'),
                        React.createElement(Option, { value: 'joint_review' }, '联合审核中')
                    ])
                ]),
                React.createElement(Col, { span: 3 }, [
                    React.createElement(Select, {
                        placeholder: "作者类型",
                        value: authorTypeFilter,
                        onChange: setAuthorTypeFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部作者'),
                        React.createElement(Option, { value: 'user' }, '普通用户'),
                        React.createElement(Option, { value: 'association' }, '协会'),
                        React.createElement(Option, { value: 'exhibition' }, '会展')
                    ])
                ]),
                React.createElement(Col, { span: 3 }, [
                    React.createElement(Select, {
                        placeholder: "优先级",
                        value: priorityFilter,
                        onChange: setPriorityFilter,
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { value: 'all' }, '全部优先级'),
                        React.createElement(Option, { value: 'high' }, '高优先级'),
                        React.createElement(Option, { value: 'normal' }, '普通优先级'),
                        React.createElement(Option, { value: 'low' }, '低优先级')
                    ])
                ]),
                React.createElement(Col, { span: 5 }, [
                    React.createElement(DateRangePicker, {
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
                            onClick: resetFilters
                        }, '重置'),
                        React.createElement(Button, {
                            type: 'primary',
                            onClick: () => loadCurrentQueue()
                        }, '搜索')
                    ])
                ])
            ])
        ]);
    };

    // 渲染批量操作工具栏
    const renderBatchToolbar = () => {
        const currentData = getCurrentData();
        const filteredData = filterData(currentData);
        
        return React.createElement(Card, {
            style: { marginBottom: '16px' },
            bodyStyle: { padding: '12px 16px' }
        }, [
            React.createElement(Row, {
                key: 'batch-row',
                justify: 'space-between',
                align: 'middle'
            }, [
                React.createElement(Col, {}, [
                    React.createElement(Space, {}, [
                        React.createElement('span', {
                            style: { color: '#666' }
                        }, `共 ${filteredData.length} 条记录`),
                        selectedRows.length > 0 && React.createElement('span', {
                            style: { color: '#1890ff' }
                        }, `已选择 ${selectedRows.length} 条`)
                    ])
                ]),
                React.createElement(Col, {}, [
                    React.createElement(Space, {}, [
                        React.createElement(Button, {
                            type: 'primary',
                            disabled: selectedRows.length === 0,
                            onClick: () => handleBatchReview('approve')
                        }, `批量通过 (${selectedRows.length})`),
                        React.createElement(Button, {
                            danger: true,
                            disabled: selectedRows.length === 0,
                            onClick: () => handleBatchReview('reject')
                        }, `批量拒绝 (${selectedRows.length})`),
                        React.createElement(Button, {
                            onClick: handleExport
                        }, '导出数据'),
                        React.createElement(Button, {
                            onClick: () => loadCurrentQueue()
                        }, '刷新')
                    ])
                ])
            ])
        ]);
    };

    const loadCurrentQueue = () => {
        switch(activeTab) {
            case 'image':
                loadImageQueue();
                break;
            case 'video':
            loadVideoQueue();
                break;
            case 'interaction':
                loadInteractionQueue();
                break;
            case 'special':
                loadSpecialQueue();
                break;
            default:
                loadImageQueue();
        }
    };

    const loadImageQueue = () => {
        setLoading(true);
        setTimeout(() => {
            const mockQueue = [
                {
                    id: 'IMG001',
                    key: 'IMG001',
                    type: 'image',
                    title: '智能列车展示图片',
                    content: '展示最新智能列车技术的高清图片集，包含列车外观设计、内部座椅布局、智能控制面板等多个角度的专业摄影作品。这些图片清晰展示了现代城市轨道交通的技术进步和人性化设计理念。',
                    fullContent: `# 智能列车技术展示

## 项目概述
本次展示的智能列车采用了最新的自动驾驶技术和智能控制系统，代表了城市轨道交通的未来发展方向。

## 技术特点
- **自动驾驶**: 采用AI智能驾驶系统，提高运行安全性
- **节能环保**: 使用新型电池技术，降低能耗30%
- **智能服务**: 车内配备智能助手，提供个性化服务

## 设计理念
以人为本，科技创新，绿色出行。`,
                    author: '北京轨道交通协会',
                    authorType: 'association',
                    authorInfo: {
                        name: '北京轨道交通协会',
                        role: '官方认证协会',
                        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                        verified: true,
                        memberSince: '2020-03-15'
                    },
                    submitTime: '2024-01-15 14:30:25',
                    status: 'pending',
                    priority: 'high',
                    mediaFiles: [
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop',
                            name: '列车外观1.jpg',
                            size: '2.1MB',
                            resolution: '1920x1080'
                        },
                        {
                            type: 'image', 
                            url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=300&h=200&fit=crop',
                            name: '车厢内部.jpg',
                            size: '1.8MB',
                            resolution: '1920x1080'
                        },
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
                            name: '控制面板.jpg',
                            size: '1.5MB', 
                            resolution: '1920x1080'
                        },
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                            name: '站台对接.jpg',
                            size: '2.3MB',
                            resolution: '1920x1080'
                        },
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=300&h=200&fit=crop',
                            name: '技术细节.jpg',
                            size: '1.8MB',
                            resolution: '1920x1080'
                        }
                    ],
                    aiResult: {
                        score: 0.92,
                        riskLevel: 'low',
                        detectedIssues: [],
                        suggestion: 'recommend_approve'
                    },
                    imageCount: 5,
                    totalSize: '8.5MB'
                },
                {
                    id: 'IMG002',
                    key: 'IMG002',
                    type: 'image',
                    title: '地铁安全宣传海报',
                    content: '地铁安全乘车须知宣传海报，包含乘车安全注意事项、紧急情况处理方法、站台安全提示等重要信息，旨在提高乘客的安全意识和自我保护能力。',
                    fullContent: `# 地铁安全乘车指南

## 乘车前准备
- 检查随身物品，避免携带危险品
- 提前了解路线和换乘信息
- 准备好车票或交通卡

## 进站安全事项  
- 有序排队，先下后上
- 注意站台缝隙，小心脚下
- 紧急情况请按紧急按钮

## 车厢内安全
- 抓好扶手，注意防滑
- 为老弱病残孕让座
- 保持车厢内清洁

## 紧急处理
如遇紧急情况请：
1. 保持冷静，听从工作人员指挥
2. 有序疏散，不要拥挤
3. 拨打应急电话求助`,
                    author: '用户_张设计师',
                    authorType: 'user',
                    authorInfo: {
                        name: '张设计师',
                        role: '认证设计师',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                        verified: false,
                        memberSince: '2023-08-20'
                    },
                    submitTime: '2024-01-15 16:45:12',
                    status: 'ai_reviewing',
                    priority: 'normal',
                    mediaFiles: [
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1580522154071-c6ca47aff15c?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1580522154071-c6ca47aff15c?w=300&h=200&fit=crop',
                            name: '安全海报1.jpg',
                            size: '4.5MB',
                            resolution: '2048x1536'
                        },
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
                            name: '安全海报2.jpg',
                            size: '3.8MB',
                            resolution: '2048x1536'
                        },
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=300&h=200&fit=crop',
                            name: '应急指南.jpg',
                            size: '4.0MB',
                            resolution: '2048x1536'
                        }
                    ],
                    aiResult: {
                        score: 0.76,
                        riskLevel: 'medium',
                        detectedIssues: ['文字水印', '二维码'],
                        suggestion: 'require_manual_review'
                    },
                    imageCount: 3,
                    totalSize: '12.3MB'
                },
                {
                    id: 'IMG003',
                    key: 'IMG003',
                    type: 'image',
                    title: '展会现场照片',
                    content: '2024城轨展会现场活动照片，记录了展会期间的精彩瞬间，包括新产品发布、技术交流、商务洽谈等活动场景，展现了行业的蓬勃发展和创新活力。',
                    fullContent: `# 2024城轨展会现场纪实

## 展会概况
时间：2024年1月10-12日
地点：北京国际展览中心
规模：500家参展商，10万平方米展示面积

## 主要活动
### 开幕式
- 行业领导致辞
- 新技术发布
- 战略合作签约

### 技术展示
- 智能列车模拟驾驶
- 5G通信解决方案
- 自动化控制系统

### 商务活动
- 一对一商务洽谈
- 技术交流研讨会
- 项目合作对接

## 展会成果
- 签约项目总额超过200亿元
- 达成合作意向300余项
- 技术交流活动50余场`,
                    author: '会展公司_小李',
                    authorType: 'exhibition',
                    authorInfo: {
                        name: '小李',
                        role: '展会摄影师',
                        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c2b2?w=100&h=100&fit=crop&crop=face',
                        verified: true,
                        memberSince: '2022-05-10'
                    },
                    submitTime: '2024-01-14 09:15:30',
                    status: 'approved',
                    priority: 'normal',
                    mediaFiles: [
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop',
                            name: '展会现场1.jpg',
                            size: '2.8MB',
                            resolution: '1920x1080'
                        },
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=200&fit=crop',
                            name: '产品展示.jpg',
                            size: '3.2MB',
                            resolution: '1920x1080'
                        },
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1559223607-b4d0555ae3c9?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1559223607-b4d0555ae3c9?w=300&h=200&fit=crop',
                            name: '技术交流.jpg', 
                            size: '2.5MB',
                            resolution: '1920x1080'
                        },
                        {
                            type: 'image',
                            url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop',
                            thumbnail: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop',
                            name: '签约仪式.jpg',
                            size: '2.7MB',
                            resolution: '1920x1080'
                        }
                    ],
                    aiResult: {
                        score: 0.95,
                        riskLevel: 'low',
                        detectedIssues: [],
                        suggestion: 'auto_approve'
                    },
                    imageCount: 12,
                    totalSize: '25.8MB'
                }
            ];
            setImageQueue(mockQueue);
            setLoading(false);
        }, 500);
    };

    const loadVideoQueue = () => {
        setLoading(true);
        setTimeout(() => {
            const mockQueue = [
                {
                    id: 'VID001',
                    key: 'VID001',
                    type: 'video',
                    title: '城轨技术创新展示',
                    content: '展示最新的城市轨道交通技术和创新成果，包含智能驾驶演示、5G通信应用、节能环保技术等前沿内容，为行业发展提供技术参考和创新思路。',
                    fullContent: `# 城轨技术创新成果展示

## 视频简介
本视频全面展示了2024年城市轨道交通领域的最新技术创新成果，通过实地拍摄和动画演示，生动呈现了智能化、绿色化、数字化的发展趋势。

## 主要内容
### 1. 智能驾驶技术 (00:30-02:15)
- 自动驾驶系统演示
- AI决策过程展示  
- 安全保障机制介绍

### 2. 5G通信应用 (02:16-03:45)
- 车地通信系统
- 乘客信息服务
- 运营调度优化

### 3. 节能环保技术 (03:46-05:42)
- 再生制动技术
- 智能能耗管理
- 绿色材料应用

## 技术特点
- **高可靠性**: 99.9%的系统可用性
- **节能环保**: 能耗降低30%以上
- **智能化**: 全流程自动化运营`,
                    author: '中国城轨协会',
                    authorType: 'association',
                    authorInfo: {
                        name: '中国城市轨道交通协会',
                        role: '权威行业组织',
                        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
                        verified: true,
                        memberSince: '2019-01-01'
                    },
                    submitTime: '2024-01-15 14:30:25',
                    status: 'pending',
                    priority: 'high',
                    duration: '05:42',
                    fileSize: '126.5MB',
                    resolution: '1920x1080',
                    mediaFiles: [
                        {
                            type: 'video',
                            url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                            thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop',
                            name: '城轨创新技术展示.mp4',
                            size: '126.5MB',
                            duration: '05:42',
                            resolution: '1920x1080',
                            format: 'MP4'
                        }
                    ],
                    aiResult: {
                        score: 0.89,
                        riskLevel: 'low',
                        detectedIssues: [],
                        frameAnalysis: { totalFrames: 8256, riskFrames: 2 },
                        audioAnalysis: { hasSensitiveWords: false, qualityScore: 0.88 },
                        suggestion: 'recommend_approve'
                    }
                },
                {
                    id: 'VID002',
                    key: 'VID002',
                    type: 'video',
                    title: '智能控制系统演示',
                    content: '展示新一代智能列车自动控制系统的核心功能和操作流程，包含系统架构介绍、关键技术分析、实际应用案例等专业内容。',
                    fullContent: `# 智能列车控制系统深度解析

## 系统概述
新一代智能列车自动控制系统(IACS)采用人工智能和大数据技术，实现了列车运行的全自动化控制和智能化管理。

## 核心技术
### 1. 多传感器融合
- 激光雷达定位
- 视觉识别系统
- 惯性导航技术

### 2. AI决策引擎
- 深度学习算法
- 实时路径规划
- 智能故障诊断

### 3. 安全保障系统
- 多重安全冗余
- 故障自动检测
- 应急处理机制

## 应用案例
在北京地铁19号线的试点应用中，该系统表现出色：
- 准点率提升至99.8%
- 能耗降低25%
- 故障率下降60%

## 技术优势
相比传统控制系统，IACS具有更高的智能化水平和安全性能。`,
                    author: '用户_张工程师',
                    authorType: 'user',
                    authorInfo: {
                        name: '张工程师',
                        role: '高级工程师',
                        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                        verified: false,
                        memberSince: '2023-03-15'
                    },
                    submitTime: '2024-01-15 16:45:12',
                    status: 'manual_review',
                    priority: 'normal',
                    duration: '03:28',
                    fileSize: '89.2MB',
                    resolution: '1920x1080',
                    mediaFiles: [
                        {
                            type: 'video',
                            url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                            thumbnail: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=300&h=200&fit=crop',
                            name: '智能控制系统演示.mp4',
                            size: '89.2MB',
                            duration: '03:28',
                            resolution: '1920x1080',
                            format: 'MP4'
                        }
                    ],
                    aiResult: {
                        score: 0.65,
                        riskLevel: 'medium',
                        detectedIssues: ['可能涉及技术机密'],
                        frameAnalysis: { totalFrames: 5024, riskFrames: 8 },
                        audioAnalysis: { hasSensitiveWords: true, qualityScore: 0.75 },
                        suggestion: 'require_manual_review'
                    }
                }
            ];
            setVideoQueue(mockQueue);
            setLoading(false);
        }, 800);
    };

    const loadInteractionQueue = () => {
        setLoading(true);
        setTimeout(() => {
            const mockQueue = [
                {
                    id: 'INT001',
                    key: 'INT001',
                    type: 'comment',
                    content: '这个技术真的很棒，希望能够早日投入使用！',
                    author: '用户_科技爱好者',
                    authorType: 'user',
                    targetContent: '智能列车控制系统介绍',
                    submitTime: '2024-01-15 18:30:25',
                    status: 'pending',
                    aiResult: {
                        score: 0.95,
                        riskLevel: 'low',
                        detectedIssues: [],
                        suggestion: 'auto_approve'
                    }
                },
                {
                    id: 'INT002',
                    key: 'INT002',
                    type: 'private_message',
                    content: '您好，我对贵公司的产品很感兴趣，能否提供详细资料？联系方式：138****8888',
                    author: '用户_采购经理',
                    authorType: 'user',
                    targetContent: '发送给：会展公司_展台负责人',
                    submitTime: '2024-01-15 17:15:40',
                    status: 'manual_review',
                    aiResult: {
                        score: 0.72,
                        riskLevel: 'medium',
                        detectedIssues: ['包含联系方式'],
                        suggestion: 'require_manual_review'
                    }
                },
                {
                    id: 'INT003',
                    key: 'INT003',
                    type: 'share_content',
                    content: '分享一个超棒的城轨技术视频！快来看看吧 #城市轨道交通 #技术创新',
                    author: '用户_技术分享',
                    authorType: 'user',
                    targetContent: '城轨技术创新展示视频',
                    submitTime: '2024-01-15 16:22:15',
                    status: 'approved',
                    aiResult: {
                        score: 0.88,
                        riskLevel: 'low',
                        detectedIssues: [],
                        suggestion: 'auto_approve'
                    }
                }
            ];
            setInteractionQueue(mockQueue);
            setLoading(false);
        }, 600);
    };

    const loadSpecialQueue = () => {
        setLoading(true);
        setTimeout(() => {
            const mockQueue = [
                {
                    id: 'SPE001',
                    key: 'SPE001',
                    type: 'association_content',
                    title: '2024年城轨行业发展报告',
                    content: '详细分析2024年城市轨道交通行业发展现状与趋势',
                    author: '中国城市轨道交通协会',
                    authorType: 'association',
                    submitTime: '2024-01-15 10:30:25',
                    status: 'pending_dingding',
                    priority: 'high',
                    workflow: 'dingding_approval',
                    aiResult: {
                        score: 0.94,
                        riskLevel: 'low',
                        detectedIssues: [],
                        suggestion: 'require_special_approval'
                    },
                    approvalStatus: 'waiting_dingding'
                },
                {
                    id: 'SPE002',
                    key: 'SPE002',
                    type: 'exhibition_content',
                    title: '参展企业产品展示视频',
                    content: '华为公司5G城轨通信解决方案展示',
                    author: '华为技术有限公司',
                    authorType: 'exhibition',
                    submitTime: '2024-01-15 14:45:12',
                    status: 'joint_review',
                    priority: 'normal',
                    workflow: 'exhibition_joint_review',
                    aiResult: {
                        score: 0.87,
                        riskLevel: 'low',
                        detectedIssues: [],
                        suggestion: 'require_joint_approval'
                    },
                    approvalStatus: 'platform_approved_waiting_organizer'
                }
            ];
            setSpecialQueue(mockQueue);
            setLoading(false);
        }, 700);
    };

    // 状态标签渲染
    const renderStatusTag = (status) => {
        const statusConfig = {
            pending: { color: 'orange', text: '待审核' },
            ai_reviewing: { color: 'blue', text: 'AI审核中' },
            manual_review: { color: 'purple', text: '人工复审' },
            approved: { color: 'green', text: '已通过' },
            rejected: { color: 'red', text: '未通过' },
            pending_dingding: { color: 'cyan', text: '等待钉钉审批' },
            joint_review: { color: 'gold', text: '联合审核中' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    // 类型标签渲染
    const renderTypeTag = (type) => {
        const typeConfig = {
            image: { color: 'blue', text: '图文', icon: '🖼️' },
            video: { color: 'purple', text: '视频', icon: '🎥' },
            comment: { color: 'green', text: '评论', icon: '💬' },
            private_message: { color: 'orange', text: '私信', icon: '✉️' },
            share_content: { color: 'cyan', text: '分享', icon: '🔄' },
            association_content: { color: 'red', text: '协会内容', icon: '🏛️' },
            exhibition_content: { color: 'purple', text: '会展内容', icon: '🏢' }
        };
        const config = typeConfig[type] || { color: 'default', text: type, icon: '📄' };
        return React.createElement(Tag, { color: config.color }, [
            React.createElement('span', { key: 'icon' }, config.icon),
            ` ${config.text}`
        ]);
    };

    // 作者类型标签
    const renderAuthorTypeTag = (type) => {
        const config = {
            user: { color: 'default', text: '普通用户' },
            association: { color: 'blue', text: '协会' },
            exhibition: { color: 'purple', text: '会展' }
        };
        const t = config[type] || config.user;
        return React.createElement(Tag, { color: t.color, size: 'small' }, t.text);
    };

    // AI评分渲染 - 优化版
    const renderAIScore = (score, record) => {
        if (record.status === 'ai_reviewing') {
            return React.createElement(Tag, { color: "blue" }, "AI审核中");
        }
        if (score === undefined || score === null) {
            return React.createElement(Tag, {}, "无评分");
        }

        let status = 'success';
        if (score < 0.5) status = 'exception';
        else if (score < 0.8) status = 'normal';
        
        const percent = Math.round(score * 100);

        return React.createElement('div', {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '100%' }
        }, 
            React.createElement(Progress, {
                type: 'circle',
                percent: percent,
                width: 35, // 缩小尺寸
                format: () => `${percent}`, // 直接在圈内显示百分比
                status: status,
            })
        );
    };

    // 批量操作
    const handleBatchReview = (action) => {
        if (selectedRows.length === 0) {
            message.warning('请选择要操作的内容');
            return;
        }

        Modal.confirm({
            title: `确认${action === 'approve' ? '通过' : '拒绝'}选中的内容？`,
            content: `将对 ${selectedRows.length} 条内容执行${action === 'approve' ? '通过' : '拒绝'}操作`,
            onOk: () => {
                setLoading(true);
                setTimeout(() => {
                    setSelectedRows([]);
                    loadCurrentQueue();
                    message.success(`已${action === 'approve' ? '通过' : '拒绝'} ${selectedRows.length} 条内容`);
                }, 1000);
            }
        });
    };

    // 单个审核操作
    const handleSingleReview = (record, action, reason = '') => {
        setLoading(true);
        setTimeout(() => {
            loadCurrentQueue();
            message.success(`内容 ${record.id} ${action === 'approve' ? '审核通过' : '审核拒绝'}`);
        }, 800);
        setModalVisible(false);
    };

    // 查看详情
    const showDetail = (record) => {
        setCurrentItem(record);
        setModalVisible(true);
    };

    // 通用表格列配置
    const getCommonColumns = (specificColumns = []) => [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 100,
            fixed: 'left'
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: 100,
            render: renderTypeTag
        },
        ...specificColumns,
        {
            title: '作者',
            dataIndex: 'author',
            width: 150,
            render: (text, record) => React.createElement('div', {}, [
                React.createElement('div', { key: 'name' }, text),
                React.createElement('div', { key: 'type', style: { marginTop: '4px' } }, 
                    renderAuthorTypeTag(record.authorType))
            ])
        },
        {
            title: '提交时间',
            dataIndex: 'submitTime',
            width: 150,
            sorter: true
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 120,
            render: renderStatusTag
        },
        {
            title: 'AI评分',
            dataIndex: ['aiResult', 'score'],
            width: 90, // 调整列宽
            render: renderAIScore
        },
        {
            title: '操作',
            width: 200, // 增加列宽以防止折叠
            fixed: 'right',
            render: (_, record) => {
                const actions = [
                    React.createElement(Button, {
                        key: 'detail',
                        type: 'link', // 优化为链接按钮，更紧凑
                        size: 'small',
                        onClick: () => showDetail(record)
                    }, '详情'),
                ];

                // 根据状态条件渲染审核按钮
                if (record.status === 'pending' || record.status === 'manual_review') {
                    actions.push(
                        React.createElement(Button, {
                            key: 'approve',
                            type: 'primary',
                            size: 'small',
                            onClick: () => handleSingleReview(record, 'approve')
                        }, '通过')
                    );
                    actions.push(
                        React.createElement(Button, {
                            key: 'reject',
                            type: 'link', // 优化为链接按钮，更紧凑
                            danger: true,
                            size: 'small',
                            onClick: () => handleSingleReview(record, 'reject')
                        }, '拒绝')
                    );
                }
                
                return React.createElement(Space, { size: 'small' }, actions);
            }
        }
    ];

    // 图文审核列配置
    const imageColumns = getCommonColumns([
        {
            title: '内容标题',
            dataIndex: 'title',
            ellipsis: true,
            render: (text, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'title',
                    style: { fontWeight: 'bold', marginBottom: '4px' }
                }, text),
                React.createElement('div', {
                    key: 'meta',
                    style: { fontSize: '12px', color: '#666' }
                }, `${record.imageCount} 张图片 | ${record.totalSize}`)
            ])
        }
    ]);

    // 视频审核列配置
    const videoColumns = getCommonColumns([
        {
            title: '视频信息',
            dataIndex: 'title',
            width: 250,
            render: (text, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'title',
                        style: { fontWeight: 'bold', marginBottom: '4px' }
                    }, text),
                    React.createElement('div', {
                        key: 'meta',
                        style: { fontSize: '12px', color: '#666' }
                }, `${record.duration} | ${record.fileSize} | ${record.resolution}`)
            ])
        }
    ]);

    // 互动审核列配置
    const interactionColumns = getCommonColumns([
        {
            title: '互动内容',
            dataIndex: 'content',
            ellipsis: true,
            render: (text, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'content',
                    style: { marginBottom: '4px' }
                }, text),
                record.targetContent && React.createElement('div', {
                    key: 'target',
                    style: { fontSize: '12px', color: '#666' }
                }, `关联：${record.targetContent}`)
            ])
        }
    ]);

    // 特殊流程列配置
    const specialColumns = getCommonColumns([
        {
            title: '内容标题',
            dataIndex: 'title',
            ellipsis: true
        },
        {
            title: '审批流程',
            dataIndex: 'workflow',
            width: 120,
            render: (workflow) => {
                const workflowMap = {
                    'dingding_approval': { color: 'blue', text: '钉钉审批' },
                    'exhibition_joint_review': { color: 'purple', text: '联合审核' }
                };
                const config = workflowMap[workflow] || { color: 'default', text: workflow };
                return React.createElement(Tag, { color: config.color }, config.text);
            }
        },
        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            width: 150,
            render: (status) => {
                const statusMap = {
                    'waiting_dingding': { color: 'orange', text: '等待钉钉审批' },
                    'platform_approved_waiting_organizer': { color: 'blue', text: '平台通过，等待主办方' },
                    'organizer_approved_waiting_platform': { color: 'cyan', text: '主办方通过，等待平台' },
                    'both_approved': { color: 'green', text: '双方通过' }
                };
                const config = statusMap[status] || { color: 'default', text: status };
                return React.createElement(Tag, { color: config.color, size: 'small' }, config.text);
            }
        }
    ]);

    // Tab配置
    const tabItems = [
        {
            key: 'image',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon' }, '🖼️ '),
                '图文审核',
                React.createElement(Badge, {
                    key: 'badge',
                    count: stats.image.pending,
                    size: 'small',
                    style: { marginLeft: 8 }
                })
            ]),
            children: React.createElement('div', {}, [
                renderSearchToolbar(),
                renderBatchToolbar(),
                React.createElement(Table, {
                    columns: imageColumns,
                    dataSource: filterData(imageQueue),
                    loading: loading,
                    rowSelection: {
                        selectedRowKeys: selectedRows,
                        onChange: setSelectedRows
                    },
                    scroll: { x: 1200 },
                    pagination: {
                        total: filterData(imageQueue).length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
                    }
                })
            ])
        },
        {
            key: 'video',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon' }, '🎥 '),
                '视频审核',
                React.createElement(Badge, {
                    key: 'badge',
                    count: stats.video.pending,
                    size: 'small',
                    style: { marginLeft: 8 }
                })
            ]),
            children: React.createElement('div', {}, [
                renderSearchToolbar(),
                renderBatchToolbar(),
                React.createElement(Table, {
                    columns: videoColumns,
                    dataSource: filterData(videoQueue),
                    loading: loading,
                    rowSelection: {
                        selectedRowKeys: selectedRows,
                        onChange: setSelectedRows
                    },
                    scroll: { x: 1200 },
                    pagination: {
                        total: filterData(videoQueue).length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
                    }
                })
            ])
        },
        {
            key: 'interaction',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon' }, '💬 '),
                '互动审核',
                React.createElement(Badge, {
                    key: 'badge',
                    count: stats.interaction.pending,
                    size: 'small',
                    style: { marginLeft: 8 }
                })
            ]),
            children: React.createElement('div', {}, [
                renderSearchToolbar(),
                renderBatchToolbar(),
                React.createElement(Table, {
                    columns: interactionColumns,
                    dataSource: filterData(interactionQueue),
                    loading: loading,
                    rowSelection: {
                        selectedRowKeys: selectedRows,
                        onChange: setSelectedRows
                    },
                    scroll: { x: 1200 },
                    pagination: {
                        total: filterData(interactionQueue).length,
                        pageSize: 15,
                        showSizeChanger: true,
                        showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
                    }
                })
            ])
        },
        {
            key: 'special',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon' }, '⚡ '),
                '特殊流程',
                React.createElement(Badge, {
                    key: 'badge',
                    count: stats.special.pending,
                    size: 'small',
                    style: { marginLeft: 8 }
                })
            ]),
            children: React.createElement('div', {}, [
                React.createElement(Alert, {
                    message: '特殊审批流程',
                    description: '协会内容需钉钉审批，会展内容需联合审核',
                    type: 'info',
                    showIcon: true,
                    style: { marginBottom: '16px' }
                }),
                renderSearchToolbar(),
                renderBatchToolbar(),
                React.createElement(Table, {
                    columns: specialColumns,
                    dataSource: filterData(specialQueue),
                    loading: loading,
                    scroll: { x: 1200 },
                    pagination: {
                        total: filterData(specialQueue).length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
                    }
                })
            ])
        }
    ];

    return React.createElement('div', { className: 'review-management-page' }, [
        // 统计卡片
        React.createElement(Row, {
            key: 'stats',
            gutter: 16,
            style: { marginBottom: 24 }
        }, [
            React.createElement(Col, { key: 'image-stat', span: 6 },
                React.createElement(Card, { size: 'small' }, 
                    React.createElement(Statistic, {
                        title: '图文审核',
                        value: stats.image.pending,
                        suffix: '/ 待审核',
                        valueStyle: { color: '#faad14' }
                    })
                )
            ),
            React.createElement(Col, { key: 'video-stat', span: 6 },
                React.createElement(Card, { size: 'small' }, 
                    React.createElement(Statistic, {
                        title: '视频审核',
                        value: stats.video.pending,
                        suffix: '/ 待审核',
                        valueStyle: { color: '#722ed1' }
                    })
                )
            ),
            React.createElement(Col, { key: 'interaction-stat', span: 6 },
                React.createElement(Card, { size: 'small' }, 
                    React.createElement(Statistic, {
                        title: '互动审核',
                        value: stats.interaction.pending,
                        suffix: '/ 待审核',
                        valueStyle: { color: '#13c2c2' }
                    })
                )
            ),
            React.createElement(Col, { key: 'special-stat', span: 6 },
                React.createElement(Card, { size: 'small' }, 
                    React.createElement(Statistic, {
                        title: '特殊流程',
                        value: stats.special.pending,
                        suffix: '/ 待审核',
                        valueStyle: { color: '#f5222d' }
                    })
                )
            )
        ]),

        // 主要内容Tab
        React.createElement(Tabs, {
            key: 'main-tabs',
            activeKey: activeTab,
            onChange: (key) => {
                setActiveTab(key);
                setSelectedRows([]); // 切换Tab时清空选择
            },
            items: tabItems
        }),

        // 详情模态框
        React.createElement(Modal, {
            key: 'detail-modal',
            title: '内容审核详情',
            open: modalVisible,
            onCancel: () => setModalVisible(false),
            width: 1200,
            footer: currentItem && (currentItem.status === 'pending' || currentItem.status === 'manual_review') ? [
                React.createElement(Button, {
                    key: 'reject',
                    danger: true,
                    onClick: () => {
                        Modal.confirm({
                            title: '确认拒绝',
                            content: '确定要拒绝这条内容吗？',
                            onOk: () => handleSingleReview(currentItem, 'reject')
                        });
                    }
                }, '拒绝'),
                React.createElement(Button, {
                    key: 'approve',
                    type: 'primary',
                    onClick: () => handleSingleReview(currentItem, 'approve')
                }, '通过')
            ] : [
                React.createElement(Button, {
                    key: 'close',
                    onClick: () => setModalVisible(false)
                }, '关闭')
            ]
        }, currentItem ? React.createElement('div', {}, [
            // 发布人信息
            React.createElement(Card, {
                key: 'author-info',
                size: 'small',
                style: { marginBottom: '16px' },
                title: '发布人信息'
            }, [
                React.createElement(Row, {
                    gutter: 16,
                    align: 'middle'
                }, [
                    React.createElement(Col, { span: 4 }, [
                        React.createElement('img', {
                            src: currentItem.authorInfo?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                            alt: currentItem.author,
                            style: {
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }
                        })
                    ]),
                    React.createElement(Col, { span: 20 }, [
                        React.createElement('div', {
                            style: { marginBottom: '4px' }
                        }, [
                            React.createElement('span', {
                                style: { fontSize: '16px', fontWeight: 'bold', marginRight: '8px' }
                            }, currentItem.authorInfo?.name || currentItem.author),
                            currentItem.authorInfo?.verified && React.createElement(Tag, {
                                color: 'blue',
                                size: 'small'
                            }, '✓ 已认证'),
                            React.createElement(Tag, {
                                color: 'green',
                                size: 'small'
                            }, currentItem.authorInfo?.role || '用户')
                        ]),
                        React.createElement('div', {
                            style: { color: '#666', fontSize: '12px' }
                        }, [
                            React.createElement('span', {}, `加入时间：${currentItem.authorInfo?.memberSince || '未知'}`),
                            React.createElement('span', {
                                style: { marginLeft: '16px' }
                            }, `发布时间：${currentItem.submitTime}`)
                        ])
                    ])
                ])
            ]),
            
            // 内容信息
            React.createElement(Card, {
                key: 'content-info',
                size: 'small',
                style: { marginBottom: '16px' },
                title: '内容详情'
            }, [
                React.createElement('div', {
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement('h3', {
                        style: { margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }
                    }, currentItem.title || '内容标题'),
                    React.createElement('div', {
                        style: { marginBottom: '12px' }
                    }, [
                        renderTypeTag(currentItem.type),
                        React.createElement(Tag, {
                            color: 'orange',
                            style: { marginLeft: '8px' }
                        }, `${currentItem.priority === 'high' ? '高' : currentItem.priority === 'normal' ? '普通' : '低'}优先级`),
                        renderStatusTag(currentItem.status)
                    ])
                ]),
                React.createElement('div', {
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement('h4', {
                        style: { margin: '0 0 8px 0' }
                    }, '内容简介'),
                    React.createElement('div', {
                        style: { 
                            padding: '12px',
                            background: '#f5f5f5',
                            borderRadius: '6px',
                            lineHeight: '1.6'
                        }
                    }, currentItem.content)
                ]),
                currentItem.fullContent && React.createElement('div', {
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement('h4', {
                        style: { margin: '0 0 8px 0' }
                    }, '详细内容'),
                    React.createElement('div', {
                        style: { 
                            padding: '16px',
                            background: '#fafafa',
                            borderRadius: '6px',
                            lineHeight: '1.8',
                            maxHeight: '300px',
                            overflow: 'auto',
                            whiteSpace: 'pre-line'
                        }
                    }, currentItem.fullContent)
                ])
            ]),
            
            // 媒体文件预览
            currentItem.mediaFiles && currentItem.mediaFiles.length > 0 && React.createElement(Card, {
                key: 'media-preview',
                size: 'small',
                style: { marginBottom: '16px' },
                title: currentItem.type === 'video' ? '视频预览' : '图片预览'
            }, [
                currentItem.type === 'video' ? 
                // 视频预览
                React.createElement('div', {}, [
                    React.createElement('div', {
                        style: { marginBottom: '16px' }
                    }, [
                        React.createElement('video', {
                            controls: true,
                            style: {
                                width: '100%',
                                maxHeight: '400px',
                                borderRadius: '6px'
                            },
                            poster: currentItem.mediaFiles[0].thumbnail
                        }, [
                            React.createElement('source', {
                                src: currentItem.mediaFiles[0].url,
                                type: 'video/mp4'
                            }),
                            '您的浏览器不支持视频播放'
                        ])
                    ]),
                    React.createElement(Descriptions, {
                        column: 4,
                        size: 'small',
                        items: [
                            { label: '文件名', children: currentItem.mediaFiles[0].name },
                            { label: '时长', children: currentItem.duration },
                            { label: '大小', children: currentItem.fileSize },
                            { label: '分辨率', children: currentItem.resolution }
                        ]
                    })
                ]) :
                // 图片预览
                React.createElement('div', {}, [
                    React.createElement(Row, {
                        gutter: [8, 8]
                    }, currentItem.mediaFiles.map((file, index) =>
                        React.createElement(Col, {
                            key: index,
                            span: 6
                        }, [
                            React.createElement('div', {
                                style: {
                                    position: 'relative',
                                    cursor: 'pointer',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    border: '1px solid #d9d9d9'
                                },
                                onClick: () => {
                                    // 图片预览功能
                                    const imageViewer = React.createElement(Modal, {
                                        title: file.name,
                                        open: true,
                                        onCancel: () => document.body.removeChild(document.body.lastChild),
                                        footer: null,
                                        width: '80%',
                                        centered: true
                                    }, React.createElement('img', {
                                        src: file.url,
                                        alt: file.name,
                                        style: {
                                            width: '100%',
                                            height: 'auto'
                                        }
                                    }));
                                    
                                    const container = document.createElement('div');
                                    document.body.appendChild(container);
                                    ReactDOM.render(imageViewer, container);
                                }
                            }, [
                                React.createElement('img', {
                                    src: file.thumbnail,
                                    alt: file.name,
                                    style: {
                                        width: '100%',
                                        height: '120px',
                                        objectFit: 'cover'
                                    }
                                }),
                                React.createElement('div', {
                                    style: {
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                        color: 'white',
                                        padding: '8px',
                                        fontSize: '12px'
                                    }
                                }, [
                                    React.createElement('div', {
                                        style: { fontWeight: 'bold' }
                                    }, file.name),
                                    React.createElement('div', {}, `${file.size} | ${file.resolution}`)
                                ])
                            ])
                        ])
                    )),
                    React.createElement('div', {
                        style: { 
                            marginTop: '12px',
                            fontSize: '12px',
                            color: '#666',
                            textAlign: 'center'
                        }
                    }, `共 ${currentItem.mediaFiles.length} 张图片，总大小 ${currentItem.totalSize}`)
                ])
            ]),
            
            React.createElement(Descriptions, {
                key: 'basic-info',
                title: '基本信息',
                bordered: true,
                column: 2,
                items: [
                    { label: 'ID', children: currentItem.id },
                    { label: '类型', children: renderTypeTag(currentItem.type) },
                    { label: '状态', children: renderStatusTag(currentItem.status) },
                    { label: '优先级', children: `${currentItem.priority === 'high' ? '高' : currentItem.priority === 'normal' ? '普通' : '低'}优先级` }
                ]
            }),
            
            React.createElement('div', {
                key: 'ai-analysis',
                style: { marginTop: 24 }
            }, [
                React.createElement('h4', { key: 'ai-title' }, 'AI分析结果'),
                React.createElement(Row, { key: 'ai-content', gutter: 16 }, [
                    React.createElement(Col, { key: 'score', span: 8 },
                        React.createElement(Card, { size: 'small', title: 'AI评分' },
                        React.createElement('div', { style: { textAlign: 'center' } },
                                renderAIScore(currentItem.aiResult?.score || 0, currentItem)
                            )
                        )
                    ),
                    React.createElement(Col, { key: 'risk', span: 8 },
                        React.createElement(Card, { size: 'small', title: '风险等级' },
                            React.createElement(Tag, {
                                color: currentItem.aiResult?.riskLevel === 'low' ? 'green' : 
                                       currentItem.aiResult?.riskLevel === 'medium' ? 'orange' : 'red'
                            }, currentItem.aiResult?.riskLevel || 'unknown')
                        )
                    ),
                    React.createElement(Col, { key: 'suggestion', span: 8 },
                        React.createElement(Card, { size: 'small', title: 'AI建议' },
                            React.createElement(Tag, {
                                color: currentItem.aiResult?.suggestion === 'auto_approve' ? 'green' : 
                                       currentItem.aiResult?.suggestion === 'recommend_approve' ? 'blue' : 'orange'
                            }, {
                                'auto_approve': '自动通过',
                                'recommend_approve': '建议通过',
                                'require_manual_review': '需人工审核'
                            }[currentItem.aiResult?.suggestion] || currentItem.aiResult?.suggestion)
                        )
                    )
                ])
            ]),

            currentItem.aiResult?.detectedIssues?.length > 0 && React.createElement('div', {
                key: 'detected-issues',
                style: { marginTop: 16 }
            }, [
                React.createElement('h5', { key: 'issues-title' }, '检测到的问题'),
                React.createElement('div', { key: 'issues-list' },
                    currentItem.aiResult.detectedIssues.map((issue, index) =>
                        React.createElement(Tag, {
                            key: index,
                            color: 'red',
                            style: { marginBottom: 8 }
                        }, issue)
                    )
                )
            ])
        ]) : null)
    ]);
};

window.ReviewManagement = ReviewManagement; 