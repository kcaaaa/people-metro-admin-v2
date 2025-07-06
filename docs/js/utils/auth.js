// 认证工具 - 用于处理用户登录、权限等
window.AuthUtils = {
    // 获取当前登录用户
    getCurrentUser() {
        try {
            const userData = localStorage.getItem('userData');
            return userData ? JSON.parse(userData) : null;
        } catch (err) {
            console.error('[AuthUtils] 获取用户信息失败:', err);
            return null;
        }
    },

    // 保存当前用户
    saveCurrentUser(user) {
        try {
            if (!user) {
                localStorage.removeItem('userData');
            } else {
                localStorage.setItem('userData', JSON.stringify(user));
            }
        } catch (err) {
            console.error('[AuthUtils] 保存用户信息失败:', err);
        }
    },

    // 是否已登录
    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    // 退出登录
    logout() {
        try {
            localStorage.removeItem('userData');
            if (window.StateManager) {
                window.StateManager.emit('user:logout', {});
            }
        } catch (err) {
            console.error('[AuthUtils] 退出登录失败:', err);
        }
    },

    // 检查权限
    hasPermission(perm) {
        try {
            const user = this.getCurrentUser();
            if (!user || !user.permissions) return false;
            if (user.permissions.includes('*')) return true;
            return user.permissions.includes(perm);
        } catch (err) {
            console.error('[AuthUtils] 检查权限失败:', err);
            return false;
        }
    },

    // 检查一组权限
    hasAnyPermission(perms = []) {
        try {
            if (perms.length === 0) return true;
            const user = this.getCurrentUser();
            if (!user || !user.permissions) return false;
            if (user.permissions.includes('*')) return true;
            return perms.some(p => user.permissions.includes(p));
        } catch (err) {
            console.error('[AuthUtils] 检查权限失败:', err);
            return false;
        }
    }
};

console.log('[AuthUtils] 初始化完成'); 