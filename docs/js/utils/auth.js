// 认证工具 - 用于处理用户登录、权限等
const AuthUtils = {
    // 获取当前登录用户
    getCurrentUser() {
        try {
            // 尝试从 localStorage 获取用户信息
            const userData = localStorage.getItem('userData');
            if (userData) {
                return JSON.parse(userData);
            }

            // 如果没有，返回一个默认的系统管理员用户（仅用于开发）
            return {
                userId: 'admin_001',
                username: 'admin',
                name: '系统管理员',
                role: 'admin',
                permissions: ['*'] 
            };
        } catch (error) {
            console.error('获取用户信息失败:', error);
            return null;
        }
    },

    // 保存用户信息
    saveCurrentUser(user) {
        if (!user) {
            localStorage.removeItem('userData');
            return;
        }
        localStorage.setItem('userData', JSON.stringify(user));
    },

    // 检查用户是否登录
    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    // 退出登录
    logout() {
        localStorage.removeItem('userData');
        // 可以在这里触发一个全局的退出事件
        window.StateManager.emit('user:logout', {});
    },

    // 检查是否有指定权限
    hasPermission(permission) {
        const user = this.getCurrentUser();
        if (!user || !user.permissions) {
            return false;
        }
        // 支持通配符权限
        if (user.permissions.includes('*')) {
            return true;
        }
        return user.permissions.includes(permission);
    },
    
    // 检查是否有任何一个权限
    hasAnyPermission(permissions = []) {
        if (permissions.length === 0) {
            return true; // 如果不需要任何权限，则认为有权限
        }
        const user = this.getCurrentUser();
        if (!user || !user.permissions) {
            return false;
        }
        if (user.permissions.includes('*')) {
            return true;
        }
        return permissions.some(p => user.permissions.includes(p));
    }
};

window.AuthUtils = AuthUtils;
console.log('[AuthUtils] window.AuthUtils 挂载成功'); 