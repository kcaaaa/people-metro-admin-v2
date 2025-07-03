// 权限管理系统 - 细粒度权限控制
const PermissionManager = {
    // 权限定义
    PERMISSIONS: {
        // 系统管理权限
        SYSTEM: {
            USER_VIEW: 'system:user:view',
            USER_CREATE: 'system:user:create',
            USER_EDIT: 'system:user:edit',
            USER_DELETE: 'system:user:delete',
            USER_IMPORT: 'system:user:import',
            
            ADMIN_VIEW: 'system:admin:view',
            ADMIN_MANAGE: 'system:admin:manage',
            
            ROLE_VIEW: 'system:role:view',
            ROLE_MANAGE: 'system:role:manage',
            
            PERMISSION_VIEW: 'system:permission:view',
            PERMISSION_MANAGE: 'system:permission:manage',
            
            SETTING_VIEW: 'system:setting:view',
            SETTING_MANAGE: 'system:setting:manage',
            
            LOG_VIEW: 'system:log:view',
            LOG_EXPORT: 'system:log:export',
            
            MENU_MANAGE: 'system:menu:manage'
        },
        
        // 内容管理权限
        CONTENT: {
            VIEW: 'content:view',
            CREATE: 'content:create',
            EDIT: 'content:edit',
            DELETE: 'content:delete',
            PUBLISH: 'content:publish',
            
            TAG_VIEW: 'content:tag:view',
            TAG_MANAGE: 'content:tag:manage',
            
            COMPLAINT_VIEW: 'content:complaint:view',
            COMPLAINT_HANDLE: 'content:complaint:handle',
            COMPLAINT_LIMIT: 'content:complaint:limit'
        },
        
        // 审核管理权限
        AUDIT: {
            IMAGE_VIEW: 'audit:image:view',
            IMAGE_REVIEW: 'audit:image:review',
            
            VIDEO_VIEW: 'audit:video:view',
            VIDEO_REVIEW: 'audit:video:review',
            
            INTERACTION_VIEW: 'audit:interaction:view',
            INTERACTION_REVIEW: 'audit:interaction:review',
            
            EXHIBITION_VIEW: 'audit:exhibition:view',
            EXHIBITION_REVIEW: 'audit:exhibition:review',
            
            FLOW_VIEW: 'audit:flow:view',
            FLOW_MANAGE: 'audit:flow:manage'
        },
        
        // 展会管理权限
        EXHIBITION: {
            BOOTH_VIEW: 'exhibition:booth:view',
            BOOTH_MANAGE: 'exhibition:booth:manage',
            
            EXHIBITOR_VIEW: 'exhibition:exhibitor:view',
            EXHIBITOR_MANAGE: 'exhibition:exhibitor:manage',
            
            LIVE_VIEW: 'exhibition:live:view',
            LIVE_MANAGE: 'exhibition:live:manage'
        },
        
        // 运营管理权限
        OPERATION: {
            STATS_VIEW: 'operation:stats:view',
            STATS_EXPORT: 'operation:stats:export',
            
            DATA_VIEW: 'operation:data:view',
            DATA_MANAGE: 'operation:data:manage',
            DATA_EXPORT: 'operation:data:export',
            
            FEEDBACK_VIEW: 'operation:feedback:view',
            FEEDBACK_MANAGE: 'operation:feedback:manage',
            
            MESSAGE_VIEW: 'operation:message:view',
            MESSAGE_SEND: 'operation:message:send'
        }
    },

    // 预定义角色
    ROLES: {
        SUPER_ADMIN: {
            name: '超级管理员',
            permissions: ['*'], // 拥有所有权限
            level: 100
        },
        SYSTEM_ADMIN: {
            name: '系统管理员',
            permissions: [
                'system:*',
                'content:view',
                'audit:*:view',
                'operation:stats:view'
            ],
            level: 90
        },
        CONTENT_ADMIN: {
            name: '内容管理员',
            permissions: [
                'content:*',
                'audit:*',
                'operation:stats:view',
                'system:user:view'
            ],
            level: 80
        },
        AUDIT_ADMIN: {
            name: '审核管理员',
            permissions: [
                'audit:*',
                'content:view',
                'content:complaint:*',
                'operation:stats:view'
            ],
            level: 70
        },
        EXHIBITION_ADMIN: {
            name: '展会管理员',
            permissions: [
                'exhibition:*',
                'audit:exhibition:*',
                'content:view',
                'operation:stats:view'
            ],
            level: 60
        },
        OPERATION_ADMIN: {
            name: '运营管理员',
            permissions: [
                'operation:*',
                'content:view',
                'audit:*:view',
                'exhibition:*:view'
            ],
            level: 50
        },
        MODERATOR: {
            name: '版主',
            permissions: [
                'content:view',
                'content:complaint:view',
                'audit:*:view',
                'audit:*:review'
            ],
            level: 40
        },
        VIEWER: {
            name: '查看者',
            permissions: [
                'content:view',
                'audit:*:view',
                'exhibition:*:view',
                'operation:stats:view'
            ],
            level: 10
        }
    },

    // 页面权限映射
    PAGE_PERMISSIONS: {
        'dashboard': [],
        'content': ['content:view'],
        'complaint': ['content:complaint:view'],
        'content-tags': ['content:tag:view'],
        'review': ['audit:image:view', 'audit:video:view'],
        'exhibition-audit': ['audit:exhibition:view'],
        'audit-flow': ['audit:flow:view'],
        'booth': ['exhibition:booth:view'],
        'exhibitor': ['exhibition:exhibitor:view'],
        'live': ['exhibition:live:view'],
        'stats': ['operation:stats:view'],
        'operational': ['operation:stats:view'],
        'data': ['operation:data:view'],
        'feedback': ['operation:feedback:view'],
        'message': ['operation:message:view'],
        'user': ['system:user:view'],
        'admin': ['system:admin:view'],
        'logs': ['system:log:view'],
        'settings': ['system:setting:view'],
        'version': ['system:setting:view'],
        'traffic': ['system:setting:view'],
        'menu': ['system:menu:manage']
    },

    // 初始化权限管理器
    init() {
        console.log('PermissionManager initialized');
        this.loadUserPermissions();
        this.setupPermissionListeners();
        return this;
    },

    // 加载用户权限
    loadUserPermissions() {
        const currentUser = AuthUtils.getCurrentUser();
        if (currentUser && currentUser.userId) {
            // 从StateManager获取用户权限
            const permissionState = window.StateManager?.getUserPermissions(currentUser.userId);
            if (permissionState) {
                this.currentUserPermissions = permissionState.permissions;
            } else {
                // 如果没有权限记录，根据角色设置默认权限
                this.setDefaultPermissionsByRole(currentUser.role);
            }
        }
    },

    // 根据角色设置默认权限
    setDefaultPermissionsByRole(roleName) {
        const role = this.ROLES[roleName?.toUpperCase()];
        if (role) {
            this.currentUserPermissions = role.permissions;
            
            // 保存到StateManager
            const currentUser = AuthUtils.getCurrentUser();
            if (currentUser && window.StateManager) {
                window.StateManager.setUserPermissions(
                    currentUser.userId, 
                    role.permissions, 
                    'system'
                );
            }
        } else {
            // 默认为查看者权限
            this.currentUserPermissions = this.ROLES.VIEWER.permissions;
        }
    },

    // 设置权限监听器
    setupPermissionListeners() {
        if (window.StateManager) {
            // 监听权限变更事件
            window.StateManager.on('permissions:changed', (data) => {
                const currentUser = AuthUtils.getCurrentUser();
                if (currentUser && currentUser.userId === data.userId) {
                    // 更新当前用户权限
                    this.currentUserPermissions = data.newPermissions;
                    
                    // 刷新页面权限
                    this.refreshPagePermissions();
                    
                    // 通知权限变更
                    this.notifyPermissionChange(data);
                }
            });
        }
    },

    // 权限检查核心方法
    hasPermission(permission) {
        if (!permission) return true;
        if (!this.currentUserPermissions) return false;

        // 超级管理员拥有所有权限
        if (this.currentUserPermissions.includes('*')) return true;

        // 精确匹配
        if (this.currentUserPermissions.includes(permission)) return true;

        // 通配符匹配
        for (const userPerm of this.currentUserPermissions) {
            if (userPerm.endsWith(':*')) {
                const prefix = userPerm.slice(0, -1); // 移除最后的*
                if (permission.startsWith(prefix)) return true;
            }
        }

        return false;
    },

    // 批量权限检查
    hasAnyPermission(permissions) {
        if (!permissions || permissions.length === 0) return true;
        return permissions.some(permission => this.hasPermission(permission));
    },

    // 检查所有权限
    hasAllPermissions(permissions) {
        if (!permissions || permissions.length === 0) return true;
        return permissions.every(permission => this.hasPermission(permission));
    },

    // 页面访问权限检查
    canAccessPage(pageName) {
        const requiredPermissions = this.PAGE_PERMISSIONS[pageName];
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true; // 无权限要求的页面可以访问
        }
        return this.hasAnyPermission(requiredPermissions);
    },

    // 操作权限检查
    canPerformAction(action, context = {}) {
        // 根据操作类型和上下文检查权限
        const actionPermissions = this.getActionPermissions(action, context);
        return this.hasAnyPermission(actionPermissions);
    },

    // 获取操作所需权限
    getActionPermissions(action, context) {
        const actionMap = {
            // 内容操作
            'content:create': ['content:create'],
            'content:edit': ['content:edit'],
            'content:delete': ['content:delete'],
            'content:publish': ['content:publish'],
            
            // 审核操作
            'audit:approve': ['audit:image:review', 'audit:video:review', 'audit:interaction:review'],
            'audit:reject': ['audit:image:review', 'audit:video:review', 'audit:interaction:review'],
            
            // 投诉处理
            'complaint:handle': ['content:complaint:handle'],
            'complaint:limit': ['content:complaint:limit'],
            
            // 用户管理
            'user:create': ['system:user:create'],
            'user:edit': ['system:user:edit'],
            'user:delete': ['system:user:delete'],
            'user:ban': ['system:user:edit'],
            
            // 系统设置
            'system:config': ['system:setting:manage'],
            'system:backup': ['system:setting:manage'],
            
            // 数据导出
            'data:export': ['operation:data:export', 'system:log:export']
        };

        return actionMap[action] || [];
    },

    // 获取用户角色级别
    getUserLevel() {
        const currentUser = AuthUtils.getCurrentUser();
        if (!currentUser) return 0;

        for (const [roleKey, role] of Object.entries(this.ROLES)) {
            if (this.hasAllPermissions(role.permissions)) {
                return role.level;
            }
        }
        return 0;
    },

    // 权限提升检查
    canElevatePermission(targetPermission) {
        const userLevel = this.getUserLevel();
        
        // 只有高级别用户才能提升权限
        if (userLevel < 80) return false;
        
        // 检查目标权限的级别
        const targetLevel = this.getPermissionLevel(targetPermission);
        return userLevel > targetLevel;
    },

    // 获取权限级别
    getPermissionLevel(permission) {
        if (permission === '*') return 100;
        if (permission.startsWith('system:')) return 90;
        if (permission.startsWith('audit:')) return 70;
        if (permission.startsWith('content:')) return 60;
        if (permission.startsWith('operation:')) return 50;
        return 10;
    },

    // 刷新页面权限
    refreshPagePermissions() {
        // 隐藏没有权限的页面元素
        this.updatePageElements();
        
        // 更新导航菜单
        this.updateNavigationMenu();
        
        // 通知页面组件刷新
        if (window.StateManager) {
            window.StateManager.emit('permissions:refreshed', {
                userId: AuthUtils.getCurrentUser()?.userId,
                permissions: this.currentUserPermissions
            });
        }
    },

    // 更新页面元素显示
    updatePageElements() {
        // 查找所有带有权限控制的元素
        const permissionElements = document.querySelectorAll('[data-permission]');
        
        permissionElements.forEach(element => {
            const requiredPermission = element.getAttribute('data-permission');
            const hasAccess = this.hasPermission(requiredPermission);
            
            if (hasAccess) {
                element.style.display = '';
                element.removeAttribute('disabled');
            } else {
                element.style.display = 'none';
                element.setAttribute('disabled', 'true');
            }
        });
    },

    // 更新导航菜单
    updateNavigationMenu() {
        // 触发导航菜单重新渲染
        window.dispatchEvent(new Event('permissionsUpdated'));
    },

    // 通知权限变更
    notifyPermissionChange(data) {
        if (window.StateManager) {
            window.StateManager.addNotification({
                type: 'info',
                title: '权限已更新',
                content: `您的权限已由 ${data.operator} 更新，请刷新页面以获得最新权限`,
                action: {
                    text: '立即刷新',
                    handler: () => window.location.reload()
                }
            });
        }
    },

    // 权限装饰器（用于方法权限控制）
    requirePermission(permission) {
        return function(target, propertyKey, descriptor) {
            const originalMethod = descriptor.value;
            
            descriptor.value = function(...args) {
                if (!PermissionManager.hasPermission(permission)) {
                    console.warn(`权限不足: 需要权限 ${permission}`);
                    if (window.StateManager) {
                        window.StateManager.addNotification({
                            type: 'warning',
                            title: '权限不足',
                            content: `您没有执行此操作的权限：${permission}`
                        });
                    }
                    return;
                }
                
                return originalMethod.apply(this, args);
            };
            
            return descriptor;
        };
    },

    // 获取用户所有权限
    getCurrentUserPermissions() {
        return [...(this.currentUserPermissions || [])];
    },

    // 设置用户权限
    setUserPermissions(userId, permissions, operator) {
        if (window.StateManager) {
            window.StateManager.setUserPermissions(userId, permissions, operator);
        }
        
        // 如果是当前用户，立即更新
        const currentUser = AuthUtils.getCurrentUser();
        if (currentUser && currentUser.userId === userId) {
            this.currentUserPermissions = permissions;
            this.refreshPagePermissions();
        }
    },

    // 权限调试信息
    getDebugInfo() {
        const currentUser = AuthUtils.getCurrentUser();
        return {
            currentUser: currentUser,
            permissions: this.currentUserPermissions,
            userLevel: this.getUserLevel(),
            canAccessPages: Object.keys(this.PAGE_PERMISSIONS).reduce((acc, page) => {
                acc[page] = this.canAccessPage(page);
                return acc;
            }, {})
        };
    },

    // 清空权限缓存
    clearPermissionCache() {
        this.currentUserPermissions = null;
        this.loadUserPermissions();
    }
};

// 权限控制React Hook（如果需要在React组件中使用）
const usePermission = (permission) => {
    const [hasAccess, setHasAccess] = React.useState(false);
    
    React.useEffect(() => {
        setHasAccess(PermissionManager.hasPermission(permission));
        
        // 监听权限变更
        const handlePermissionUpdate = () => {
            setHasAccess(PermissionManager.hasPermission(permission));
        };
        
        if (window.StateManager) {
            window.StateManager.on('permissions:refreshed', handlePermissionUpdate);
            
            return () => {
                window.StateManager.off('permissions:refreshed', handlePermissionUpdate);
            };
        }
    }, [permission]);
    
    return hasAccess;
};

// 权限控制HOC（高阶组件）
const withPermission = (permission) => {
    return (WrappedComponent) => {
        return (props) => {
            const hasAccess = usePermission(permission);
            
            if (!hasAccess) {
                return React.createElement('div', {
                    style: { 
                        textAlign: 'center', 
                        padding: '50px',
                        color: '#999' 
                    }
                }, '您没有访问此功能的权限');
            }
            
            return React.createElement(WrappedComponent, props);
        };
    };
};

// 自动初始化
if (typeof window !== 'undefined') {
    window.PermissionManager = PermissionManager.init();
    window.usePermission = usePermission;
    window.withPermission = withPermission;
}

// 导出
window.PermissionManager = PermissionManager; 