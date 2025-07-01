// 认证工具函数
const AuthUtils = {
    // 检查是否已登录
    isAuthenticated() {
        const token = localStorage.getItem('userToken');
        const userData = localStorage.getItem('userData');
        return !!(token && userData);
    },

    // 获取当前用户信息
    getCurrentUser() {
        try {
            const userData = localStorage.getItem('userData');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('获取用户信息失败:', error);
            return null;
        }
    },

    // 获取token
    getToken() {
        return localStorage.getItem('userToken');
    },

    // 登录
    login(userData) {
        try {
            const token = 'admin_token_' + Date.now();
            localStorage.setItem('userToken', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // 记录登录日志
            this.logActivity('login', {
                username: userData.username,
                loginTime: new Date().toISOString(),
                userAgent: navigator.userAgent
            });
            
            return true;
        } catch (error) {
            console.error('登录状态保存失败:', error);
            return false;
        }
    },

    // 退出登录
    logout() {
        try {
            const currentUser = this.getCurrentUser();
            
            // 记录退出日志
            if (currentUser) {
                this.logActivity('logout', {
                    username: currentUser.username,
                    logoutTime: new Date().toISOString()
                });
            }
            
            // 清除认证信息
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            
            // 清除其他可能的用户相关数据
            localStorage.removeItem('userPreferences');
            localStorage.removeItem('recentActions');
            
            return true;
        } catch (error) {
            console.error('退出登录失败:', error);
            return false;
        }
    },

    // 验证用户凭据
    validateCredentials(username, password) {
        // 这里可以扩展为多个管理员账户
        const validCredentials = [
            { username: 'admin', password: 'admin123', role: 'admin', name: '系统管理员' },
            // 可以添加更多管理员账户
            // { username: 'manager', password: 'manager123', role: 'manager', name: '运营经理' }
        ];

        return validCredentials.find(cred => 
            cred.username === username && cred.password === password
        );
    },

    // 检查登录状态是否过期
    isTokenExpired() {
        const token = this.getToken();
        if (!token) return true;

        try {
            // 从token中提取时间戳
            const timestamp = parseInt(token.split('_').pop());
            const now = Date.now();
            const expireTime = 24 * 60 * 60 * 1000; // 24小时过期

            return (now - timestamp) > expireTime;
        } catch (error) {
            console.error('Token过期检查失败:', error);
            return true;
        }
    },

    // 刷新认证状态
    refreshAuth() {
        if (this.isTokenExpired()) {
            this.logout();
            return false;
        }
        return true;
    },

    // 记录用户活动日志
    logActivity(action, details = {}) {
        try {
            const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
            const activity = {
                id: Date.now(),
                action,
                details,
                timestamp: new Date().toISOString(),
                ip: 'localhost', // 在实际应用中应该获取真实IP
                userAgent: navigator.userAgent
            };

            activities.unshift(activity);
            
            // 只保留最近100条记录
            if (activities.length > 100) {
                activities.splice(100);
            }

            localStorage.setItem('userActivities', JSON.stringify(activities));
        } catch (error) {
            console.error('记录用户活动失败:', error);
        }
    },

    // 获取用户活动日志
    getUserActivities(limit = 10) {
        try {
            const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
            return activities.slice(0, limit);
        } catch (error) {
            console.error('获取用户活动失败:', error);
            return [];
        }
    },

    // 设置用户偏好
    setUserPreference(key, value) {
        try {
            const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
            preferences[key] = value;
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
            return true;
        } catch (error) {
            console.error('设置用户偏好失败:', error);
            return false;
        }
    },

    // 获取用户偏好
    getUserPreference(key, defaultValue = null) {
        try {
            const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
            return preferences[key] !== undefined ? preferences[key] : defaultValue;
        } catch (error) {
            console.error('获取用户偏好失败:', error);
            return defaultValue;
        }
    },

    // 检查权限
    hasPermission(permission) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        // 管理员拥有所有权限
        if (currentUser.role === 'admin') return true;

        // 这里可以实现更细粒度的权限控制
        const rolePermissions = {
            'manager': ['read', 'write'],
            'operator': ['read'],
            'viewer': ['read']
        };

        const userPermissions = rolePermissions[currentUser.role] || [];
        return userPermissions.includes(permission);
    },

    // 生成安全的随机token
    generateToken() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `admin_${timestamp}_${random}`;
    }
};

// 全局可用
window.AuthUtils = AuthUtils; 