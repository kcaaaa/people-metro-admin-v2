// 模拟数据工具类
window.MockData = {
    // 大屏管理数据
    getScreens: () => [
        { 
            id: 'screen_001',
            name: '主会场大屏',
            description: '展会主会场中央大屏',
            resolution: '1920x1080',
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-10'
        },
        {
            id: 'screen_002',
            name: '技术展示大屏',
            description: '技术创新展区大屏',
            resolution: '1920x1080',
            status: 'active',
            createdAt: '2024-01-02',
            updatedAt: '2024-01-08'
        },
        {
            id: 'screen_003',
            name: '互动体验大屏',
            description: '观众互动体验区大屏',
            resolution: '3840x2160',
            status: 'active',
            createdAt: '2024-01-03',
            updatedAt: '2024-01-09'
        },
        {
            id: 'screen_004',
            name: '嘉宾休息室大屏',
            description: 'VIP嘉宾休息区大屏',
            resolution: '1920x1080',
            status: 'active',
            createdAt: '2024-01-04',
            updatedAt: '2024-01-07'
        },
        {
            id: 'screen_005',
            name: '媒体采访大屏',
            description: '媒体中心采访区大屏',
            resolution: '1920x1080',
            status: 'maintenance',
            createdAt: '2024-01-05',
            updatedAt: '2024-01-12'
        },
        // 新增大屏示例
        {
            id: 'screen_006',
            name: '安全监控大屏',
            description: '实时安全监控与预警大屏',
            resolution: '2560x1440',
            status: 'active',
            createdAt: '2024-01-06',
            updatedAt: '2024-01-13'
        },
        {
            id: 'screen_007',
            name: '客流分析大屏',
            description: '实时客流数据分析大屏',
            resolution: '1920x1080',
            status: 'active',
            createdAt: '2024-01-07',
            updatedAt: '2024-01-14'
        },
        {
            id: 'screen_008',
            name: '应急指挥大屏',
            description: '应急事件处理与指挥大屏',
            resolution: '3840x2160',
            status: 'active',
            createdAt: '2024-01-08',
            updatedAt: '2024-01-15'
        },
        {
            id: 'screen_009',
            name: '线路状态大屏',
            description: '轨道交通线路运行状态大屏',
            resolution: '1920x1080',
            status: 'active',
            createdAt: '2024-01-09',
            updatedAt: '2024-01-16'
        },
        {
            id: 'screen_010',
            name: '商业广告大屏',
            description: '站内商业广告展示大屏',
            resolution: '1920x1080',
            status: 'active',
            createdAt: '2024-01-10',
            updatedAt: '2024-01-17'
        }
    ],

    // 情景管理数据
    getScenarios: () => [
        {
            id: 'scenario_001',
            name: '展会开幕情景',
            description: '展会开幕时的大屏展示情景',
            playMode: 'auto',
            defaultDuration: 30,
            screens: [
                { screenId: 'screen_001', name: '主会场大屏', duration: 45, order: 1 },
                { screenId: 'screen_002', name: '技术展示大屏', duration: 30, order: 2 },
                { screenId: 'screen_003', name: '互动体验大屏', duration: 60, order: 3 }
            ],
            createdAt: '2024-01-10',
            updatedAt: '2024-01-15'
        },
        {
            id: 'scenario_002',
            name: '技术论坛情景',
            description: '技术论坛期间的大屏展示情景',
            playMode: 'manual',
            defaultDuration: 0,
            screens: [
                { screenId: 'screen_001', name: '主会场大屏', duration: 0, order: 1 },
                { screenId: 'screen_004', name: '嘉宾休息室大屏', duration: 0, order: 2 }
            ],
            createdAt: '2024-01-12',
            updatedAt: '2024-01-14'
        },
        {
            id: 'scenario_003',
            name: '观众互动情景',
            description: '观众互动环节的大屏展示情景',
            playMode: 'auto',
            defaultDuration: 20,
            screens: [
                { screenId: 'screen_003', name: '互动体验大屏', duration: 30, order: 1 },
                { screenId: 'screen_001', name: '主会场大屏', duration: 20, order: 2 }
            ],
            createdAt: '2024-01-14',
            updatedAt: '2024-01-14'
        },
        // 新增情景模式示例
        {
            id: 'scenario_004',
            name: '安全监控情景',
            description: '日常安全监控与预警场景',
            playMode: 'auto',
            defaultDuration: 15,
            screens: [
                { screenId: 'screen_006', name: '安全监控大屏', duration: 30, order: 1 },
                { screenId: 'screen_007', name: '客流分析大屏', duration: 20, order: 2 },
                { screenId: 'screen_008', name: '应急指挥大屏', duration: 25, order: 3 }
            ],
            createdAt: '2024-01-16',
            updatedAt: '2024-01-16'
        },
        {
            id: 'scenario_005',
            name: '线路运营情景',
            description: '线路日常运营监控场景',
            playMode: 'auto',
            defaultDuration: 20,
            screens: [
                { screenId: 'screen_009', name: '线路状态大屏', duration: 40, order: 1 },
                { screenId: 'screen_007', name: '客流分析大屏', duration: 30, order: 2 }
            ],
            createdAt: '2024-01-17',
            updatedAt: '2024-01-18'
        },
        {
            id: 'scenario_006',
            name: '商业运营情景',
            description: '站内商业广告轮播场景',
            playMode: 'auto',
            defaultDuration: 10,
            screens: [
                { screenId: 'screen_010', name: '商业广告大屏', duration: 10, order: 1 },
                { screenId: 'screen_001', name: '主会场大屏', duration: 15, order: 2 }
            ],
            createdAt: '2024-01-18',
            updatedAt: '2024-01-19'
        },
        {
            id: 'scenario_007',
            name: '应急响应情景',
            description: '突发事件应急响应场景',
            playMode: 'manual',
            defaultDuration: 0,
            screens: [
                { screenId: 'screen_008', name: '应急指挥大屏', duration: 0, order: 1 },
                { screenId: 'screen_006', name: '安全监控大屏', duration: 0, order: 2 },
                { screenId: 'screen_009', name: '线路状态大屏', duration: 0, order: 3 },
                { screenId: 'screen_001', name: '主会场大屏', duration: 0, order: 4 }
            ],
            createdAt: '2024-01-19',
            updatedAt: '2024-01-19'
        },
        {
            id: 'scenario_008',
            name: '全设备监控情景',
            description: '全面监控所有大屏设备的场景',
            playMode: 'auto',
            defaultDuration: 15,
            screens: [
                { screenId: 'screen_001', name: '主会场大屏', duration: 15, order: 1 },
                { screenId: 'screen_002', name: '技术展示大屏', duration: 15, order: 2 },
                { screenId: 'screen_003', name: '互动体验大屏', duration: 15, order: 3 },
                { screenId: 'screen_004', name: '嘉宾休息室大屏', duration: 15, order: 4 },
                { screenId: 'screen_006', name: '安全监控大屏', duration: 15, order: 5 },
                { screenId: 'screen_007', name: '客流分析大屏', duration: 15, order: 6 },
                { screenId: 'screen_008', name: '应急指挥大屏', duration: 15, order: 7 },
                { screenId: 'screen_009', name: '线路状态大屏', duration: 15, order: 8 },
                { screenId: 'screen_010', name: '商业广告大屏', duration: 15, order: 9 }
            ],
            createdAt: '2024-01-20',
            updatedAt: '2024-01-20'
        },
        // 新增演示数据
        {
            id: 'scenario_009',
            name: '运营高峰时段情景',
            description: '早晚高峰期间的客流监控与引导场景',
            playMode: 'auto',
            defaultDuration: 10,
            screens: [
                { screenId: 'screen_007', name: '客流分析大屏', duration: 20, order: 1 },
                { screenId: 'screen_009', name: '线路状态大屏', duration: 15, order: 2 },
                { screenId: 'screen_001', name: '主会场大屏', duration: 10, order: 3 }
            ],
            createdAt: '2024-01-21',
            updatedAt: '2024-01-22'
        },
        {
            id: 'scenario_010',
            name: '夜间维护情景',
            description: '夜间设备维护期间的监控场景',
            playMode: 'manual',
            defaultDuration: 0,
            screens: [
                { screenId: 'screen_006', name: '安全监控大屏', duration: 0, order: 1 },
                { screenId: 'screen_008', name: '应急指挥大屏', duration: 0, order: 2 }
            ],
            createdAt: '2024-01-22',
            updatedAt: '2024-01-22'
        },
        {
            id: 'scenario_011',
            name: '节假日特殊模式情景',
            description: '节假日期间的特殊展示模式',
            playMode: 'auto',
            defaultDuration: 25,
            screens: [
                { screenId: 'screen_001', name: '主会场大屏', duration: 30, order: 1 },
                { screenId: 'screen_003', name: '互动体验大屏', duration: 25, order: 2 },
                { screenId: 'screen_010', name: '商业广告大屏', duration: 20, order: 3 },
                { screenId: 'screen_007', name: '客流分析大屏', duration: 15, order: 4 }
            ],
            createdAt: '2024-01-23',
            updatedAt: '2024-01-24'
        },
        {
            id: 'scenario_012',
            name: '媒体接待情景',
            description: '媒体参观访问时的展示场景',
            playMode: 'manual',
            defaultDuration: 0,
            screens: [
                { screenId: 'screen_002', name: '技术展示大屏', duration: 0, order: 1 },
                { screenId: 'screen_001', name: '主会场大屏', duration: 0, order: 2 },
                { screenId: 'screen_004', name: '嘉宾休息室大屏', duration: 0, order: 3 }
            ],
            createdAt: '2024-01-24',
            updatedAt: '2024-01-24'
        },
        {
            id: 'scenario_013',
            name: '教育培训情景',
            description: '员工培训和技能提升时的展示场景',
            playMode: 'auto',
            defaultDuration: 45,
            screens: [
                { screenId: 'screen_002', name: '技术展示大屏', duration: 60, order: 1 },
                { screenId: 'screen_008', name: '应急指挥大屏', duration: 45, order: 2 }
            ],
            createdAt: '2024-01-25',
            updatedAt: '2024-01-25'
        },
        {
            id: 'scenario_014',
            name: '设备巡检情景',
            description: '设备日常巡检监控场景',
            playMode: 'auto',
            defaultDuration: 20,
            screens: [
                { screenId: 'screen_006', name: '安全监控大屏', duration: 30, order: 1 },
                { screenId: 'screen_009', name: '线路状态大屏', duration: 25, order: 2 }
            ],
            createdAt: '2024-01-26',
            updatedAt: '2024-01-26'
        },
        {
            id: 'scenario_015',
            name: '特殊活动情景',
            description: '举办特殊活动时的定制化展示场景',
            playMode: 'auto',
            defaultDuration: 30,
            screens: [
                { screenId: 'screen_001', name: '主会场大屏', duration: 40, order: 1 },
                { screenId: 'screen_003', name: '互动体验大屏', duration: 35, order: 2 },
                { screenId: 'screen_010', name: '商业广告大屏', duration: 25, order: 3 }
            ],
            createdAt: '2024-01-27',
            updatedAt: '2024-01-28'
        }
    ],
    // 仪表盘统计数据
    getDashboardStats: () => ({
        pendingReviews: { value: 248, change: '+12%', trend: 'up' },
        totalUsers: { value: 156789, change: '+8.5%', trend: 'up' },
        violationRate: { value: 2.8, change: '-0.3%', trend: 'down' },
        alertCount: { value: 15, change: '+3', trend: 'up' },
        contentPublished: { value: 1234, change: '+15%', trend: 'up' },
        exhibitionCount: { value: 45, change: '+5', trend: 'up' },
        liveCount: { value: 3, change: '+1', trend: 'up' },
        liveUsers: { value: 2156, change: '+18%', trend: 'up' },
        activeLiveCount: { value: 1, change: '0', trend: 'stable' },
        activeLiveUsers: { value: 1248, change: '+156', trend: 'up' }
    }),

    // 审核队列数据
    getReviewQueue: () => [
        {
            id: 1,
            type: 'image',
            content: '地铁站内商业活动推广图片',
            author: '张三',
            submitTime: '2024-01-15 10:30:00',
            status: 'pending',
            aiScore: 0.85,
            violationType: null,
            priority: 'high'
        },
        {
            id: 2,
            type: 'video',
            content: '城轨安全宣传视频',
            author: '李四',
            submitTime: '2024-01-15 09:45:00',
            status: 'ai_review',
            aiScore: 0.92,
            violationType: null,
            priority: 'normal'
        },
        {
            id: 3,
            type: 'text',
            content: '乘客服务投诉建议',
            author: '王五',
            submitTime: '2024-01-15 08:20:00',
            status: 'manual_review',
            aiScore: 0.45,
            violationType: 'sensitive_words',
            priority: 'high'
        }
    ],

    // 用户管理数据
    getUserList: () => [
        {
            id: 1,
            username: 'zhang_san',
            realName: '张***',
            phone: '138****5678',
            email: 'zhang***@example.com',
            status: 'active',
            role: '普通用户',
            registerTime: '2023-12-01',
            lastLogin: '2024-01-15 10:30:00',
            riskLevel: 'low',
            certification: 'verified'
        },
        {
            id: 2,
            username: 'li_si',
            realName: '李***',
            phone: '139****9876',
            email: 'li***@example.com',
            status: 'suspended',
            role: '企业用户',
            registerTime: '2023-11-15',
            lastLogin: '2024-01-14 16:45:00',
            riskLevel: 'medium',
            certification: 'pending'
        }
    ],

    // 用户画像数据
    getUserProfile: () => ({
        basicStats: {
            totalUsers: 25648,
            activeUsers: 15627,
            newUsers: 1248,
            retentionRate: 0.73
        },
        demographics: {
            ageGroups: [
                { name: '18-25岁', value: 35, count: 8977 },
                { name: '26-35岁', value: 42, count: 10772 },
                { name: '36-45岁', value: 18, count: 4617 },
                { name: '45岁以上', value: 5, count: 1282 }
            ],
            genderDistribution: [
                { name: '男性', value: 52, count: 13337 },
                { name: '女性', value: 48, count: 12311 }
            ]
        },
        behaviorTags: [
            { tag: '通勤族', count: 12580, weight: 0.9 },
            { tag: '商务出行', count: 8450, weight: 0.7 },
            { tag: '旅游观光', count: 6320, weight: 0.6 },
            { tag: '学生群体', count: 5670, weight: 0.5 }
        ]
    }),

    // 行为统计数据
    getBehaviorStats: () => ({
        dailyActive: {
            dates: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
            values: [12580, 13240, 14560, 13890, 15240, 16780, 14530]
        },
        hourlyActive: {
            hours: Array.from({length: 24}, (_, i) => i),
            values: [200, 150, 100, 80, 60, 120, 800, 2500, 3200, 2800, 2400, 2600, 
                    3500, 2900, 2700, 3800, 4200, 4800, 4500, 3200, 2800, 1800, 1200, 600]
        },
        contentEngagement: {
            reads: 156780,
            likes: 23450,
            shares: 8920,
            comments: 12340
        }
    }),

    // 数据管理统计
    getDataManagement: () => ({
        storage: {
            total: 850.6,
            used: 645.2,
            available: 205.4,
            usage: 0.758
        },
        backup: {
            lastBackup: '2024-01-15 02:00:00',
            status: 'success',
            size: 245.8,
            retention: 30
        },
        monitoring: {
            apiCalls: 156780,
            errorRate: 0.012,
            avgResponseTime: 245,
            alerts: 3
        }
    }),

    // 系统设置数据
    getSystemSettings: () => ({
        aiSettings: {
            textThreshold: 0.7,
            imageThreshold: 0.8,
            videoThreshold: 0.75,
            autoReview: true
        },
        reviewFlow: {
            stages: ['AI初审', '人工复审', '终审'],
            timeouts: [300, 1800, 3600],
            escalation: true
        },
        alertRules: [
            { type: 'violation_rate', threshold: 5, enabled: true },
            { type: 'queue_backlog', threshold: 1000, enabled: true },
            { type: 'api_error', threshold: 0.05, enabled: true }
        ]
    }),

    // 趋势图数据生成器
    generateTrendData: (days = 7) => {
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                value: Math.floor(Math.random() * 1000) + 500
            });
        }
        return data;
    },

    // 实时数据模拟
    generateRealTimeData: () => ({
        timestamp: new Date().toISOString(),
        activeUsers: Math.floor(Math.random() * 1000) + 2000,
        pendingReviews: Math.floor(Math.random() * 50) + 100,
        systemLoad: Math.random() * 0.8 + 0.1
    }),

    // 直播管理模块数据
    liveManagementData: {
        // 直播列表
        liveList: [
            {
                id: 'live_001',
                title: '2024城轨创新技术论坛',
                exhibitionId: 'exhibition_001',
                exhibitionName: '中国城市轨道交通博览会',
                status: 'live', // live(直播中), scheduled(即将开始), ended(已结束), replay(可回放)
                startTime: '2024-01-15 14:00:00',
                endTime: '2024-01-15 16:00:00',
                actualStartTime: '2024-01-15 14:02:00',
                actualEndTime: null,
                presenter: '张教授',
                presenterAvatar: 'https://example.com/avatar1.jpg',
                cover: 'https://example.com/live-cover1.jpg',
                description: '探讨城轨最新技术发展趋势',
                pushUrl: 'rtmp://push.example.com/live/stream001',
                pullUrl: 'http://pull.example.com/live/stream001.flv',
                replayUrl: null,
                viewerCount: 1248,
                peakViewers: 2156,
                likeCount: 365,
                commentCount: 892,
                isImageLiveEnabled: true,
                isCommentEnabled: true,
                moderationLevel: 'medium', // strict(严格), medium(中等), loose(宽松)
                tags: ['技术论坛', '创新', '智能化'],
                createdBy: 'admin001',
                createdAt: '2024-01-10 10:00:00',
                updatedAt: '2024-01-15 14:02:00'
            },
            {
                id: 'live_002',
                title: '智能信号系统展示',
                exhibitionId: 'exhibition_002',
                exhibitionName: '轨道交通智能化展',
                status: 'scheduled',
                startTime: '2024-01-16 10:00:00',
                endTime: '2024-01-16 11:30:00',
                actualStartTime: null,
                actualEndTime: null,
                presenter: '李工程师',
                presenterAvatar: 'https://example.com/avatar2.jpg',
                cover: 'https://example.com/live-cover2.jpg',
                description: '最新智能信号控制系统演示',
                pushUrl: 'rtmp://push.example.com/live/stream002',
                pullUrl: 'http://pull.example.com/live/stream002.flv',
                replayUrl: null,
                viewerCount: 0,
                peakViewers: 0,
                likeCount: 0,
                commentCount: 0,
                isImageLiveEnabled: true,
                isCommentEnabled: true,
                moderationLevel: 'strict',
                tags: ['信号系统', '智能化', '演示'],
                createdBy: 'admin002',
                createdAt: '2024-01-12 15:30:00',
                updatedAt: '2024-01-12 15:30:00'
            },
            {
                id: 'live_003',
                title: '地铁安全运营研讨会',
                exhibitionId: 'exhibition_001',
                exhibitionName: '中国城市轨道交通博览会',
                status: 'ended',
                startTime: '2024-01-14 09:00:00',
                endTime: '2024-01-14 11:00:00',
                actualStartTime: '2024-01-14 09:05:00',
                actualEndTime: '2024-01-14 11:02:00',
                presenter: '王专家',
                presenterAvatar: 'https://example.com/avatar3.jpg',
                cover: 'https://example.com/live-cover3.jpg',
                description: '地铁运营安全管理经验分享',
                pushUrl: 'rtmp://push.example.com/live/stream003',
                pullUrl: 'http://pull.example.com/live/stream003.flv',
                replayUrl: 'http://replay.example.com/live/replay003.mp4',
                viewerCount: 0,
                peakViewers: 3245,
                likeCount: 567,
                commentCount: 1234,
                isImageLiveEnabled: false,
                isCommentEnabled: true,
                moderationLevel: 'medium',
                tags: ['安全运营', '管理', '经验分享'],
                createdBy: 'admin001',
                createdAt: '2024-01-10 16:00:00',
                updatedAt: '2024-01-14 11:05:00'
            }
        ],

        // 直播评论管理
        liveComments: [
            {
                id: 'comment_001',
                liveId: 'live_001',
                userId: 'user_123',
                username: '城轨爱好者',
                userAvatar: 'https://example.com/user-avatar1.jpg',
                content: '张教授讲得太好了！',
                timestamp: '2024-01-15 14:15:30',
                status: 'approved', // approved(已通过), pending(待审核), rejected(已拒绝), auto_blocked(自动拦截)
                moderationScore: 0.95, // AI审核得分 0-1
                violationReason: null,
                likeCount: 12,
                isHighlighted: false, // 是否置顶/高亮
                reviewedBy: null,
                reviewedAt: null,
                ipAddress: '192.168.1.100',
                deviceInfo: 'iPhone 15 Pro'
            },
            {
                id: 'comment_002',
                liveId: 'live_001',
                userId: 'user_456',
                username: '技术小白',
                userAvatar: 'https://example.com/user-avatar2.jpg',
                content: '有没有相关技术资料可以分享？',
                timestamp: '2024-01-15 14:18:45',
                status: 'approved',
                moderationScore: 0.98,
                violationReason: null,
                likeCount: 8,
                isHighlighted: false,
                reviewedBy: null,
                reviewedAt: null,
                ipAddress: '192.168.1.101',
                deviceInfo: 'Android 14'
            },
            {
                id: 'comment_003',
                liveId: 'live_001',
                userId: 'user_789',
                username: '违规用户',
                userAvatar: 'https://example.com/user-avatar3.jpg',
                content: '这里包含敏感词汇和违规内容',
                timestamp: '2024-01-15 14:20:15',
                status: 'auto_blocked',
                moderationScore: 0.15,
                violationReason: '包含敏感词汇',
                likeCount: 0,
                isHighlighted: false,
                reviewedBy: 'moderator_001',
                reviewedAt: '2024-01-15 14:20:16',
                ipAddress: '192.168.1.102',
                deviceInfo: 'Web Browser'
            }
        ],

        // 图片直播管理
        liveImages: [
            {
                id: 'img_001',
                liveId: 'live_001',
                title: '论坛现场',
                url: 'https://example.com/live-image1.jpg',
                thumbnailUrl: 'https://example.com/live-thumb1.jpg',
                description: '张教授正在演讲',
                uploadTime: '2024-01-15 14:10:30',
                uploadedBy: 'operator_001',
                uploaderName: '现场运营',
                status: 'approved', // approved(已通过), pending(待审核), rejected(已拒绝)
                moderationScore: 0.92,
                violationReason: null,
                viewCount: 245,
                likeCount: 18,
                fileSize: '2.3MB',
                resolution: '1920x1080',
                reviewedBy: null,
                reviewedAt: null,
                displayOrder: 1
            },
            {
                id: 'img_002',
                liveId: 'live_001',
                title: 'PPT展示',
                url: 'https://example.com/live-image2.jpg',
                thumbnailUrl: 'https://example.com/live-thumb2.jpg',
                description: '技术发展路线图',
                uploadTime: '2024-01-15 14:25:15',
                uploadedBy: 'operator_001',
                uploaderName: '现场运营',
                status: 'approved',
                moderationScore: 0.96,
                violationReason: null,
                viewCount: 189,
                likeCount: 23,
                fileSize: '1.8MB',
                resolution: '1920x1080',
                reviewedBy: null,
                reviewedAt: null,
                displayOrder: 2
            }
        ],

        // 回放管理
        replayList: [
            {
                id: 'replay_001',
                liveId: 'live_003',
                title: '地铁安全运营研讨会回放',
                url: 'http://replay.example.com/live/replay003.mp4',
                thumbnailUrl: 'https://example.com/replay-thumb1.jpg',
                duration: '01:57:23', // 时长
                fileSize: '1.2GB',
                resolution: '1920x1080',
                encoding: 'H.264',
                createdAt: '2024-01-14 11:05:00',
                status: 'available', // available(可用), processing(处理中), failed(失败)
                viewCount: 456,
                downloadCount: 23,
                isDownloadEnabled: true,
                isPublic: true, // 是否公开
                accessLevel: 'public', // public(公开), registered(注册用户), vip(VIP用户)
                transcodeProgress: 100, // 转码进度 0-100
                transcodeStatus: 'completed', // pending(等待), processing(处理中), completed(完成), failed(失败)
                chapters: [ // 章节标记
                    { time: '00:00:00', title: '开场介绍' },
                    { time: '00:15:30', title: '安全管理体系' },
                    { time: '00:45:20', title: '应急处置流程' },
                    { time: '01:20:15', title: '经验交流' },
                    { time: '01:50:30', title: '总结' }
                ]
            }
        ],

        // 直播统计数据
        liveStats: {
            today: {
                totalLives: 3,
                activeLives: 1,
                scheduledLives: 1,
                totalViewers: 1248,
                peakViewers: 2156,
                totalComments: 892,
                blockedComments: 45,
                totalImages: 15,
                approvedImages: 13
            },
            thisWeek: {
                totalLives: 12,
                avgViewersPerLive: 1856,
                totalWatchTime: '245h 30m',
                commentApprovalRate: 94.8,
                imageApprovalRate: 89.2,
                replayGenerationRate: 100
            },
            thisMonth: {
                totalLives: 45,
                totalViewers: 125000,
                totalWatchTime: '1250h 45m',
                mostPopularLive: '地铁安全运营研讨会',
                avgCommentCount: 456,
                topModerator: 'moderator_001'
            }
        },

        // 审核配置
        moderationConfig: {
            commentModeration: {
                autoApproval: true, // 自动审核
                aiThreshold: 0.8, // AI审核阈值
                sensitiveWords: ['违禁词1', '违禁词2', '政治敏感词'],
                maxCommentLength: 200,
                rateLimit: 10, // 每分钟评论限制
                bannedUsers: ['user_789'],
                moderationQueue: {
                    maxSize: 1000,
                    avgProcessTime: '2分钟'
                }
            },
            imageModeration: {
                autoApproval: false, // 图片需人工审核
                maxFileSize: '5MB',
                allowedFormats: ['JPG', 'PNG', 'GIF'],
                maxResolution: '4K',
                aiContentCheck: true,
                watermarkDetection: true
            }
        }
    }
    };
    
    // 生成唯一ID
    generateId: (prefix = 'id') => {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
;
