// 模拟数据工具类
window.MockData = {
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