// 全局状态管理器 - 用于数据状态同步和事件驱动机制
const StateManager = {
    // 全局状态存储
    state: {
        // 内容状态管理
        contents: new Map(),
        // 用户状态管理  
        users: new Map(),
        // 审核队列状态
        auditQueues: new Map(),
        // 投诉状态管理
        complaints: new Map(),
        // 权限状态管理
        permissions: new Map(),
        // 通知状态管理
        notifications: [],
        // 系统状态监控
        systemStatus: {
            auditQueueCount: 0,
            pendingComplaints: 0,
            systemLoad: 0,
            lastUpdate: null
        },
        // 直播数据状态
        liveData: {
            lives: []
        },
        liveStats: {
            realtime: {
                viewCount: 0,
                likeCount: 0,
                shareCount: 0,
                onlineUsers: 0,
                peakOnlineUsers: 0,
                duration: '00:00:00',
                commentCount: 0
            },
            history: [],
            userPortrait: {
                regions: [],
                gender: [],
                age: [],
                platform: []
            }
        }
    },

    // 事件监听器
    listeners: new Map(),

    // 初始化状态管理器
    init() {
        console.log('StateManager initialized');
        this.loadInitialState();
        this.setupAutoSync();
        return this;
    },

    // 加载初始状态
    loadInitialState() {
        try {
            // 从localStorage恢复状态
            const savedState = localStorage.getItem('systemState');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                // 恢复Map类型的数据
                if (parsed.contents) {
                    this.state.contents = new Map(Object.entries(parsed.contents));
                }
                if (parsed.users) {
                    this.state.users = new Map(Object.entries(parsed.users));
                }
                if (parsed.auditQueues) {
                    this.state.auditQueues = new Map(Object.entries(parsed.auditQueues));
                }
                if (parsed.complaints) {
                    this.state.complaints = new Map(Object.entries(parsed.complaints));
                }
                if (parsed.permissions) {
                    this.state.permissions = new Map(Object.entries(parsed.permissions));
                }
                if (parsed.notifications) {
                    this.state.notifications = parsed.notifications;
                }
                if (parsed.systemStatus) {
                    this.state.systemStatus = { ...this.state.systemStatus, ...parsed.systemStatus };
                }
                if (parsed.liveData) {
                    this.state.liveData = { ...this.state.liveData, ...parsed.liveData };
                }
                if (parsed.liveStats) {
                    this.state.liveStats = { ...this.state.liveStats, ...parsed.liveStats };
                }
            }
        } catch (error) {
            console.warn('Failed to load initial state:', error);
        }
    },

    // 设置自动同步
    setupAutoSync() {
        // 每5秒自动保存状态到localStorage
        setInterval(() => {
            this.saveState();
        }, 5000);

        // 监听页面卸载，保存状态
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
    },

    // 保存状态到localStorage
    saveState() {
        try {
            const stateToSave = {
                contents: Object.fromEntries(this.state.contents),
                users: Object.fromEntries(this.state.users),
                auditQueues: Object.fromEntries(this.state.auditQueues),
                complaints: Object.fromEntries(this.state.complaints),
                permissions: Object.fromEntries(this.state.permissions),
                notifications: this.state.notifications,
                systemStatus: this.state.systemStatus,
                liveData: this.state.liveData,
                liveStats: this.state.liveStats
            };
            localStorage.setItem('systemState', JSON.stringify(stateToSave));
        } catch (error) {
            console.warn('Failed to save state:', error);
        }
    },

    // 注册事件监听器
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    },

    // 移除事件监听器
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    },

    // 触发事件
    emit(event, data) {
        console.log(`[StateManager] Event emitted: ${event}`, data);
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }

        // 记录操作日志
        this.recordOperationLog(event, data);
    },

    // === 内容状态管理 ===
    setContentStatus(contentId, status, details = {}) {
        const oldStatus = this.state.contents.get(contentId);
        const newContentState = {
            id: contentId,
            status: status,
            updateTime: new Date().toISOString(),
            ...details
        };

        this.state.contents.set(contentId, newContentState);
        
        // 触发内容状态变更事件
        this.emit('content:statusChanged', {
            contentId,
            oldStatus: oldStatus?.status,
            newStatus: status,
            details: newContentState
        });

        return newContentState;
    },

    getContentStatus(contentId) {
        return this.state.contents.get(contentId);
    },

    // === 用户状态管理 ===
    setUserStatus(userId, status, details = {}) {
        const oldStatus = this.state.users.get(userId);
        const newUserState = {
            id: userId,
            status: status,
            updateTime: new Date().toISOString(),
            ...details
        };

        this.state.users.set(userId, newUserState);

        // 触发用户状态变更事件
        this.emit('user:statusChanged', {
            userId,
            oldStatus: oldStatus?.status,
            newStatus: status,
            details: newUserState
        });

        return newUserState;
    },

    getUserStatus(userId) {
        return this.state.users.get(userId);
    },

    // === 权限状态管理 ===
    setUserPermissions(userId, permissions, operator) {
        const oldPermissions = this.state.permissions.get(userId);
        const newPermissionState = {
            userId,
            permissions,
            updateTime: new Date().toISOString(),
            operator
        };

        this.state.permissions.set(userId, newPermissionState);

        // 触发权限变更事件
        this.emit('permissions:changed', {
            userId,
            oldPermissions: oldPermissions?.permissions,
            newPermissions: permissions,
            operator,
            details: newPermissionState
        });

        return newPermissionState;
    },

    getUserPermissions(userId) {
        return this.state.permissions.get(userId);
    },

    // === 审核队列管理 ===
    updateAuditQueue(queueType, queueData) {
        this.state.auditQueues.set(queueType, {
            ...queueData,
            updateTime: new Date().toISOString()
        });

        // 更新系统状态
        this.updateSystemStatus('auditQueueCount', this.getTotalAuditCount());

        // 触发审核队列更新事件
        this.emit('audit:queueUpdated', {
            queueType,
            queueData,
            totalCount: this.getTotalAuditCount()
        });
    },

    getTotalAuditCount() {
        let total = 0;
        for (const [type, data] of this.state.auditQueues) {
            total += data.pending || 0;
        }
        return total;
    },

    // === 投诉状态管理 ===
    setComplaintStatus(complaintId, status, action = null) {
        const oldComplaint = this.state.complaints.get(complaintId);
        const newComplaintState = {
            id: complaintId,
            status,
            action,
            updateTime: new Date().toISOString(),
            ...oldComplaint
        };

        this.state.complaints.set(complaintId, newComplaintState);

        // 触发投诉状态变更事件
        this.emit('complaint:statusChanged', {
            complaintId,
            oldStatus: oldComplaint?.status,
            newStatus: status,
            action,
            details: newComplaintState
        });

        return newComplaintState;
    },

    // === 通知管理 ===
    addNotification(notification) {
        const newNotification = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };

        this.state.notifications.unshift(newNotification);

        // 只保留最近100条通知
        if (this.state.notifications.length > 100) {
            this.state.notifications = this.state.notifications.slice(0, 100);
        }

        // 触发新通知事件
        this.emit('notification:added', newNotification);

        return newNotification;
    },

    markNotificationRead(notificationId) {
        const notification = this.state.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.emit('notification:read', notification);
        }
    },

    getUnreadNotificationCount() {
        return this.state.notifications.filter(n => !n.read).length;
    },

    // === 系统状态监控 ===
    updateSystemStatus(key, value) {
        this.state.systemStatus[key] = value;
        this.state.systemStatus.lastUpdate = new Date().toISOString();

        // 触发系统状态更新事件
        this.emit('system:statusUpdated', {
            key,
            value,
            systemStatus: this.state.systemStatus
        });
    },

    getSystemStatus() {
        return this.state.systemStatus;
    },

    // === 直播数据管理 ===
    // 初始化直播数据状态
    initLiveData(initialLives = []) {
        this.state.liveData.lives = initialLives;
        this.emit('liveData:initialized', { lives: this.state.liveData.lives });
    },

    addLive(live) {
        this.state.liveData.lives.push(live);
        this.emit('liveData:added', live);
    },

    updateLive(liveId, updates) {
        const index = this.state.liveData.lives.findIndex(live => live.id === liveId);
        if (index > -1) {
            this.state.liveData.lives[index] = { ...this.state.liveData.lives[index], ...updates };
            this.emit('liveData:updated', { liveId, updates });
        }
    },

    deleteLive(liveId) {
        const initialLength = this.state.liveData.lives.length;
        this.state.liveData.lives = this.state.liveData.lives.filter(live => live.id !== liveId);
        if (this.state.liveData.lives.length < initialLength) {
            this.emit('liveData:deleted', liveId);
        }
    },

    getLiveInfo(liveId) {
        return this.state.liveData.lives.find(live => live.id === liveId);
    },

    updateLiveStats(liveId, stats) {
        // 更新实时数据
        if (stats.realtime) {
            this.state.liveStats.realtime = {
                ...this.state.liveStats.realtime,
                ...stats.realtime
            };
        }
        
        // 更新历史数据
        if (stats.history) {
            const existingIndex = this.state.liveStats.history.findIndex(h => h.id === liveId);
            if (existingIndex > -1) {
                this.state.liveStats.history[existingIndex] = {
                    ...this.state.liveStats.history[existingIndex],
                    ...stats.history
                };
            } else {
                this.state.liveStats.history.push({
                    id: liveId,
                    ...stats.history
                });
            }
        }
        
        // 更新用户画像
        if (stats.userPortrait) {
            this.state.liveStats.userPortrait = {
                ...this.state.liveStats.userPortrait,
                ...stats.userPortrait
            };
        }
        
        // 触发更新事件
        this.emit('liveStats:updated', {
            liveId,
            stats: this.state.liveStats
        });
    },

    // 获取直播统计数据
    getLiveStats(liveId) {
        return {
            realtime: this.state.liveStats.realtime,
            history: this.state.liveStats.history.find(h => h.id === liveId),
            userPortrait: this.state.liveStats.userPortrait
        };
    },

    // === 操作日志记录 ===
    recordOperationLog(event, data) {
        const log = {
            id: Date.now(),
            event,
            data,
            timestamp: new Date().toISOString(),
            user: AuthUtils.getCurrentUser()?.username || 'system'
        };

        // 这里可以发送到日志服务或保存到本地
        console.log('[OperationLog]', log);
        
        // 如果是重要操作，生成通知
        this.generateAutoNotification(event, data);
    },

    // === 自动通知生成 ===
    generateAutoNotification(event, data) {
        const notificationRules = {
            'content:statusChanged': (data) => {
                if (data.newStatus === 'rejected') {
                    return {
                        type: 'warning',
                        title: '内容审核被拒绝',
                        content: `内容 ${data.contentId} 审核未通过`,
                        targetUsers: [data.details.publisher]
                    };
                }
                if (data.newStatus === 'approved') {
                    return {
                        type: 'success',
                        title: '内容审核通过',
                        content: `内容 ${data.contentId} 已通过审核并发布`,
                        targetUsers: [data.details.publisher]
                    };
                }
            },
            'user:statusChanged': (data) => {
                if (data.newStatus === 'banned') {
                    return {
                        type: 'error',
                        title: '用户账号被封禁',
                        content: `用户 ${data.userId} 因违规行为被封禁`,
                        targetUsers: ['admin']
                    };
                }
            },
            'complaint:statusChanged': (data) => {
                if (data.action) {
                    return {
                        type: 'info',
                        title: '投诉处理完成',
                        content: `投诉 ${data.complaintId} 已处理，执行操作：${data.action}`,
                        targetUsers: ['admin', 'moderator']
                    };
                }
            }
        };

        const rule = notificationRules[event];
        if (rule) {
            const notification = rule(data);
            if (notification) {
                this.addNotification(notification);
            }
        }
    },

    // === 工具方法 ===
    // 获取所有状态数据
    getAllState() {
        return {
            contents: Object.fromEntries(this.state.contents),
            users: Object.fromEntries(this.state.users),
            auditQueues: Object.fromEntries(this.state.auditQueues),
            complaints: Object.fromEntries(this.state.complaints),
            permissions: Object.fromEntries(this.state.permissions),
            notifications: this.state.notifications,
            systemStatus: this.state.systemStatus,
            liveData: this.state.liveData,
            liveStats: this.state.liveStats
        };
    },

    // 清空所有状态（用于测试或重置）
    clearAllState() {
        this.state.contents.clear();
        this.state.users.clear();
        this.state.auditQueues.clear();
        this.state.complaints.clear();
        this.state.permissions.clear();
        this.state.notifications = [];
        this.state.systemStatus = {
            auditQueueCount: 0,
            pendingComplaints: 0,
            systemLoad: 0,
            lastUpdate: null
        };
        this.state.liveData.lives = [];
        this.state.liveStats.realtime = {
            viewCount: 0,
            likeCount: 0,
            shareCount: 0,
            onlineUsers: 0,
            peakOnlineUsers: 0,
            duration: '00:00:00',
            commentCount: 0
        };
        this.state.liveStats.history = [];
        this.state.liveStats.userPortrait = {
            regions: [],
            gender: [],
            age: [],
            platform: []
        };
        localStorage.removeItem('systemState');
        this.emit('system:stateCleared', {});
    }
};

// 自动初始化
if (typeof window !== 'undefined') {
    window.StateManager = StateManager.init();
}

// 导出
window.StateManager = StateManager; 