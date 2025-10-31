// 栏目权限管理器
class ColumnPermissionManager {
    constructor() {
        this.permissionCache = new Map();
        this.rolePermissions = new Map();
        this.userPermissions = new Map();
        this.initDefaultPermissions();
    }

    // 初始化默认权限
    initDefaultPermissions() {
        // 默认角色权限
        this.rolePermissions.set('admin', {
            publishRoles: ['admin', 'editor'],
            reviewRoles: ['admin', 'reviewer'],
            publishUsers: [],
            reviewUsers: [],
            requiresReview: false,
            supportsAutoPublish: true
        });

        this.rolePermissions.set('editor', {
            publishRoles: ['editor'],
            reviewRoles: [],
            publishUsers: [],
            reviewUsers: [],
            requiresReview: true,
            supportsAutoPublish: false
        });

        this.rolePermissions.set('reviewer', {
            publishRoles: [],
            reviewRoles: ['reviewer'],
            publishUsers: [],
            reviewUsers: [],
            requiresReview: true,
            supportsAutoPublish: false
        });

        // 默认栏目权限配置
        const defaultColumnPermissions = {
            'about': {
                publishRoles: ['admin', 'editor'],
                reviewRoles: ['admin', 'reviewer'],
                publishUsers: [],
                reviewUsers: [],
                requiresReview: true,
                supportsAutoPublish: false,
                specialRules: {
                    'about-documents': {
                        publishRoles: ['admin'],
                        reviewRoles: ['admin'],
                        requiresReview: true,
                        supportsAutoPublish: false
                    }
                }
            },
            'information': {
                publishRoles: ['admin', 'editor'],
                reviewRoles: ['admin', 'reviewer'],
                publishUsers: [],
                reviewUsers: [],
                requiresReview: true,
                supportsAutoPublish: false
            },
            'services': {
                publishRoles: ['admin', 'editor'],
                reviewRoles: ['admin', 'reviewer'],
                publishUsers: [],
                reviewUsers: [],
                requiresReview: true,
                supportsAutoPublish: false
            },
            'columns': {
                publishRoles: ['admin', 'editor'],
                reviewRoles: ['admin', 'reviewer'],
                publishUsers: [],
                reviewUsers: [],
                requiresReview: true,
                supportsAutoPublish: false,
                specialRules: {
                    'columns-special': {
                        publishRoles: ['admin'],
                        reviewRoles: ['admin'],
                        requiresReview: true,
                        supportsAutoPublish: false
                    }
                }
            }
        };

        // 设置默认权限到缓存
        Object.entries(defaultColumnPermissions).forEach(([columnKey, permissions]) => {
            this.permissionCache.set(columnKey, permissions);
        });
    }

    // 获取栏目权限
    getColumnPermissions(columnKey) {
        if (this.permissionCache.has(columnKey)) {
            return this.permissionCache.get(columnKey);
        }
        return this.getDefaultPermissions();
    }

    // 获取默认权限
    getDefaultPermissions() {
        return {
            publishRoles: ['admin'],
            reviewRoles: ['admin'],
            publishUsers: [],
            reviewUsers: [],
            requiresReview: true,
            supportsAutoPublish: false
        };
    }

    // 检查用户是否有发布权限
    canPublish(userId, userRoles, columnKey) {
        const permissions = this.getColumnPermissions(columnKey);
        
        // 检查角色权限
        const hasRolePermission = userRoles.some(role => 
            permissions.publishRoles.includes(role)
        );
        
        // 检查用户权限
        const hasUserPermission = permissions.publishUsers.includes(userId);
        
        return hasRolePermission || hasUserPermission;
    }

    // 检查用户是否有审核权限
    canReview(userId, userRoles, columnKey) {
        const permissions = this.getColumnPermissions(columnKey);
        
        // 检查角色权限
        const hasRolePermission = userRoles.some(role => 
            permissions.reviewRoles.includes(role)
        );
        
        // 检查用户权限
        const hasUserPermission = permissions.reviewUsers.includes(userId);
        
        return hasRolePermission || hasUserPermission;
    }

    // 检查栏目是否需要审核
    requiresReview(columnKey) {
        const permissions = this.getColumnPermissions(columnKey);
        return permissions.requiresReview;
    }

    // 检查栏目是否支持自动发布
    supportsAutoPublish(columnKey) {
        const permissions = this.getColumnPermissions(columnKey);
        return permissions.supportsAutoPublish;
    }

    // 更新栏目权限
    updateColumnPermissions(columnKey, newPermissions) {
        const oldPermissions = this.getColumnPermissions(columnKey);
        const updatedPermissions = { ...oldPermissions, ...newPermissions };
        
        this.permissionCache.set(columnKey, updatedPermissions);
        
        // 记录变更历史
        this.recordPermissionChange(columnKey, 'update', {
            old: oldPermissions,
            new: updatedPermissions
        });
        
        // 保存到数据库（模拟）
        this.savePermissionsToDatabase(columnKey, updatedPermissions);
        
        return true;
    }

    // 验证权限配置
    validatePermissions(permissions) {
        const errors = [];
        
        // 检查必填字段
        if (!permissions.publishRoles && !permissions.publishUsers) {
            errors.push('发布权限不能为空');
        }
        
        if (!permissions.reviewRoles && !permissions.reviewUsers) {
            errors.push('审核权限不能为空');
        }
        
        // 检查权限冲突
        const conflicts = this.checkPermissionConflicts(permissions);
        errors.push(...conflicts.map(c => c.description));
        
        return errors;
    }

    // 获取用户权限摘要
    getUserPermissionSummary(userId, userRoles) {
        const allColumns = this.getAllColumnKeys();
        const publishableColumns = [];
        const reviewableColumns = [];
        
        allColumns.forEach(columnKey => {
            if (this.canPublish(userId, userRoles, columnKey)) {
                publishableColumns.push(columnKey);
            }
            if (this.canReview(userId, userRoles, columnKey)) {
                reviewableColumns.push(columnKey);
            }
        });
        
        return {
            userId,
            userRoles,
            publishableColumns,
            reviewableColumns,
            totalPublishable: publishableColumns.length,
            totalReviewable: reviewableColumns.length
        };
    }

    // 获取所有栏目键
    getAllColumnKeys() {
        return Array.from(this.permissionCache.keys());
    }

    // 批量更新权限
    batchUpdatePermissions(updates) {
        const results = [];
        
        updates.forEach(update => {
            try {
                if (update.templateName) {
                    this.applyPermissionTemplate(update.columnKey, update.templateName);
                } else if (update.permissions) {
                    this.updateColumnPermissions(update.columnKey, update.permissions);
                }
                results.push({ columnKey: update.columnKey, success: true });
            } catch (error) {
                results.push({ columnKey: update.columnKey, success: false, error: error.message });
            }
        });
        
        return results;
    }

    // 获取权限模板
    getPermissionTemplates() {
        return {
            'public': {
                name: '公开栏目模板',
                description: '适用于公开信息栏目，允许编辑发布，需要审核',
                type: 'public',
                publishRoles: ['admin', 'editor'],
                reviewRoles: ['admin', 'reviewer'],
                publishUsers: [],
                reviewUsers: [],
                requiresReview: true,
                supportsAutoPublish: false
            },
            'internal': {
                name: '内部栏目模板',
                description: '适用于内部信息栏目，仅管理员可发布和审核',
                type: 'private',
                publishRoles: ['admin'],
                reviewRoles: ['admin'],
                publishUsers: [],
                reviewUsers: [],
                requiresReview: true,
                supportsAutoPublish: false
            },
            'auto-publish': {
                name: '自动发布模板',
                description: '适用于新闻资讯栏目，支持自动发布',
                type: 'public',
                publishRoles: ['admin', 'editor'],
                reviewRoles: ['admin'],
                publishUsers: [],
                reviewUsers: [],
                requiresReview: false,
                supportsAutoPublish: true
            },
            'strict-review': {
                name: '严格审核模板',
                description: '适用于重要栏目，需要严格审核流程',
                type: 'private',
                publishRoles: ['admin'],
                reviewRoles: ['admin', 'reviewer'],
                publishUsers: [],
                reviewUsers: [],
                requiresReview: true,
                supportsAutoPublish: false
            }
        };
    }

    // 应用权限模板
    applyPermissionTemplate(columnKey, templateName) {
        const templates = this.getPermissionTemplates();
        const template = templates[templateName];
        
        if (!template) {
            throw new Error(`权限模板 "${templateName}" 不存在`);
        }
        
        const templatePermissions = {
            publishRoles: template.publishRoles,
            reviewRoles: template.reviewRoles,
            publishUsers: template.publishUsers,
            reviewUsers: template.reviewUsers,
            requiresReview: template.requiresReview,
            supportsAutoPublish: template.supportsAutoPublish
        };
        
        this.updateColumnPermissions(columnKey, templatePermissions);
        
        // 记录模板应用历史
        this.recordPermissionChange(columnKey, 'template', {
            templateName,
            template: templatePermissions
        });
        
        return true;
    }

    // 获取权限变更历史
    getPermissionChangeHistory(columnKey, limit = 10) {
        const history = this.permissionCache.get(`${columnKey}_history`) || [];
        return history.slice(0, limit);
    }

    // 检查权限冲突
    checkPermissionConflicts(permissions) {
        const conflicts = [];
        
        // 检查用户同时拥有发布和审核权限
        const publishUsers = permissions.publishUsers || [];
        const reviewUsers = permissions.reviewUsers || [];
        const conflictingUsers = publishUsers.filter(user => reviewUsers.includes(user));
        
        if (conflictingUsers.length > 0) {
            conflicts.push({
                type: '用户权限冲突',
                description: `用户 ${conflictingUsers.join(', ')} 同时拥有发布和审核权限，可能导致权限冲突`
            });
        }
        
        // 检查自动发布和需要审核的设置冲突
        if (permissions.supportsAutoPublish && permissions.requiresReview) {
            conflicts.push({
                type: '发布设置冲突',
                description: '同时启用自动发布和需要审核可能导致逻辑冲突'
            });
        }
        
        // 检查角色权限冲突
        const publishRoles = permissions.publishRoles || [];
        const reviewRoles = permissions.reviewRoles || [];
        const conflictingRoles = publishRoles.filter(role => reviewRoles.includes(role));
        
        if (conflictingRoles.length > 0) {
            conflicts.push({
                type: '角色权限冲突',
                description: `角色 ${conflictingRoles.join(', ')} 同时拥有发布和审核权限`
            });
        }
        
        return conflicts;
    }

    // 记录权限变更
    recordPermissionChange(columnKey, type, details) {
        const history = this.permissionCache.get(`${columnKey}_history`) || [];
        const record = {
            time: new Date().toLocaleString(),
            type: type,
            operator: 'admin', // 这里应该从当前用户上下文获取
            action: this.getActionDescription(type),
            details: this.getDetailsDescription(type, details)
        };
        
        history.unshift(record);
        this.permissionCache.set(`${columnKey}_history`, history.slice(0, 50)); // 保留最近50条记录
    }

    // 获取操作描述
    getActionDescription(type) {
        const descriptions = {
            'add': '添加权限配置',
            'update': '更新权限配置',
            'delete': '删除权限配置',
            'template': '应用权限模板'
        };
        return descriptions[type] || '未知操作';
    }

    // 获取详情描述
    getDetailsDescription(type, details) {
        switch (type) {
            case 'update':
                return `权限配置已更新`;
            case 'template':
                return `应用了模板: ${details.templateName}`;
            default:
                return '权限配置变更';
        }
    }

    // 保存权限到数据库（模拟）
    savePermissionsToDatabase(columnKey, permissions) {
        // 这里应该是实际的数据库保存逻辑
        console.log(`[ColumnPermissionManager] 保存权限到数据库: ${columnKey}`, permissions);
        return true;
    }

    // 清除权限缓存
    clearPermissionCache() {
        this.permissionCache.clear();
        this.initDefaultPermissions();
    }

    // 重新加载权限
    reloadPermissions() {
        this.clearPermissionCache();
        // 这里应该从数据库重新加载权限配置
        console.log('[ColumnPermissionManager] 重新加载权限配置');
    }
}

// 创建全局实例
const columnPermissionManager = new ColumnPermissionManager();
window.columnPermissionManager = columnPermissionManager;
window.ColumnPermissionManager = ColumnPermissionManager;

console.log('[ColumnPermissionManager] 栏目权限管理器初始化成功');
