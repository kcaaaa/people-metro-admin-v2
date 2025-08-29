// 栏目权限管理器
class ColumnPermissionManager {
    constructor() {
        this.permissionCache = new Map();
        this.rolePermissions = new Map();
        this.userPermissions = new Map();
        this.initDefaultPermissions();
    }

    // 初始化默认权限配置
    initDefaultPermissions() {
        // 默认角色权限
        this.rolePermissions.set('content_editor', {
            name: '内容编辑',
            permissions: ['publish', 'edit_own', 'view_content'],
            columns: ['*'] // 所有栏目
        });

        this.rolePermissions.set('column_manager', {
            name: '栏目管理员',
            permissions: ['publish', 'edit_all', 'delete', 'review', 'manage_permissions'],
            columns: ['*']
        });

        this.rolePermissions.set('content_reviewer', {
            name: '内容审核员',
            permissions: ['review', 'reject', 'approve', 'view_content'],
            columns: ['*']
        });

        this.rolePermissions.set('senior_reviewer', {
            name: '高级审核员',
            permissions: ['review', 'reject', 'approve', 'view_content', 'manage_reviewers'],
            columns: ['*']
        });

        this.rolePermissions.set('content_manager', {
            name: '内容管理员',
            permissions: ['publish', 'edit_all', 'delete', 'review', 'manage_permissions', 'manage_columns'],
            columns: ['*']
        });

        this.rolePermissions.set('chief_editor', {
            name: '总编辑',
            permissions: ['*'], // 所有权限
            columns: ['*']
        });

        // 默认栏目权限配置
        this.defaultColumnPermissions = {
            'about': {
                publishRoles: ['content_editor', 'column_manager'],
                publishUsers: [],
                reviewRoles: ['content_reviewer', 'senior_reviewer'],
                reviewUsers: [],
                autoPublish: false,
                requireReview: true,
                specialRules: {
                    'about-documents': {
                        requireReview: true,
                        reviewRoles: ['senior_reviewer', 'chief_editor']
                    }
                }
            },
            'information': {
                publishRoles: ['content_editor', 'column_manager'],
                publishUsers: [],
                reviewRoles: ['content_reviewer', 'senior_reviewer'],
                reviewUsers: [],
                autoPublish: false,
                requireReview: true
            },
            'services': {
                publishRoles: ['content_editor', 'column_manager'],
                publishUsers: [],
                reviewRoles: ['content_reviewer', 'senior_reviewer'],
                reviewUsers: [],
                autoPublish: false,
                requireReview: true,
                specialRules: {
                    'service-policy': {
                        requireReview: true,
                        reviewRoles: ['senior_reviewer', 'chief_editor']
                    }
                }
            },
            'columns': {
                publishRoles: ['content_editor', 'column_manager', 'guest_editor'],
                publishUsers: [],
                reviewRoles: ['content_reviewer', 'senior_reviewer'],
                reviewUsers: [],
                autoPublish: false,
                requireReview: true
            }
        };
    }

    // 获取栏目权限配置
    getColumnPermissions(columnKey) {
        // 先从缓存获取
        if (this.permissionCache.has(columnKey)) {
            return this.permissionCache.get(columnKey);
        }

        // 获取默认配置
        let permissions = this.defaultColumnPermissions[columnKey] || this.getDefaultPermissions();
        
        // 缓存权限配置
        this.permissionCache.set(columnKey, permissions);
        
        return permissions;
    }

    // 获取默认权限配置
    getDefaultPermissions() {
        return {
            publishRoles: ['content_editor'],
            publishUsers: [],
            reviewRoles: ['content_reviewer'],
            reviewUsers: [],
            autoPublish: false,
            requireReview: true
        };
    }

    // 检查用户是否有发布权限
    canPublish(userId, userRoles, columnKey) {
        const permissions = this.getColumnPermissions(columnKey);
        
        // 检查用户角色权限
        for (const role of userRoles) {
            if (permissions.publishRoles.includes(role)) {
                return true;
            }
        }
        
        // 检查特定用户权限
        if (permissions.publishUsers.includes(userId)) {
            return true;
        }
        
        return false;
    }

    // 检查用户是否有审核权限
    canReview(userId, userRoles, columnKey) {
        const permissions = this.getColumnPermissions(columnKey);
        
        // 检查用户角色权限
        for (const role of userRoles) {
            if (permissions.reviewRoles.includes(role)) {
                return true;
            }
        }
        
        // 检查特定用户权限
        if (permissions.reviewUsers.includes(userId)) {
            return true;
        }
        
        return false;
    }

    // 检查栏目是否需要审核
    requiresReview(columnKey) {
        const permissions = this.getColumnPermissions(columnKey);
        return permissions.requireReview;
    }

    // 检查栏目是否支持自动发布
    supportsAutoPublish(columnKey) {
        const permissions = this.getColumnPermissions(columnKey);
        return permissions.autoPublish;
    }

    // 更新栏目权限配置
    updateColumnPermissions(columnKey, newPermissions) {
        // 验证权限配置
        if (!this.validatePermissions(newPermissions)) {
            throw new Error('权限配置格式不正确');
        }
        
        // 更新权限配置
        this.permissionCache.set(columnKey, newPermissions);
        
        // 这里应该调用API保存到数据库
        this.savePermissionsToDatabase(columnKey, newPermissions);
        
        return true;
    }

    // 验证权限配置格式
    validatePermissions(permissions) {
        const requiredFields = ['publishRoles', 'publishUsers', 'reviewRoles', 'reviewUsers'];
        
        for (const field of requiredFields) {
            if (!Array.isArray(permissions[field])) {
                return false;
            }
        }
        
        if (typeof permissions.autoPublish !== 'boolean') {
            return false;
        }
        
        if (typeof permissions.requireReview !== 'boolean') {
            return false;
        }
        
        return true;
    }

    // 获取用户在所有栏目的权限摘要
    getUserPermissionSummary(userId, userRoles) {
        const summary = {
            canPublish: [],
            canReview: [],
            totalColumns: 0,
            accessibleColumns: 0
        };
        
        // 遍历所有栏目检查权限
        const allColumns = this.getAllColumnKeys();
        summary.totalColumns = allColumns.length;
        
        for (const columnKey of allColumns) {
            if (this.canPublish(userId, userRoles, columnKey)) {
                summary.canPublish.push(columnKey);
                summary.accessibleColumns++;
            }
            
            if (this.canReview(userId, userRoles, columnKey)) {
                summary.canReview.push(columnKey);
            }
        }
        
        return summary;
    }

    // 获取所有栏目键
    getAllColumnKeys() {
        const keys = [];
        
        // 主栏目
        for (const mainKey of Object.keys(this.defaultColumnPermissions)) {
            keys.push(mainKey);
            
            // 子栏目
            const mainPermissions = this.defaultColumnPermissions[mainKey];
            if (mainPermissions.specialRules) {
                for (const subKey of Object.keys(mainPermissions.specialRules)) {
                    keys.push(subKey);
                }
            }
        }
        
        return keys;
    }

    // 批量更新权限配置
    batchUpdatePermissions(updates) {
        const results = [];
        
        for (const update of updates) {
            try {
                const success = this.updateColumnPermissions(update.columnKey, update.permissions);
                results.push({
                    columnKey: update.columnKey,
                    success: true,
                    message: '权限更新成功'
                });
            } catch (error) {
                results.push({
                    columnKey: update.columnKey,
                    success: false,
                    message: error.message
                });
            }
        }
        
        return results;
    }

    // 获取权限配置模板
    getPermissionTemplates() {
        return {
            'strict': {
                name: '严格模式',
                description: '所有内容必须经过审核，仅允许特定角色发布',
                config: {
                    publishRoles: ['column_manager', 'content_manager'],
                    publishUsers: [],
                    reviewRoles: ['senior_reviewer', 'chief_editor'],
                    reviewUsers: [],
                    autoPublish: false,
                    requireReview: true
                }
            },
            'moderate': {
                name: '适中模式',
                description: '大部分内容需要审核，允许编辑角色发布',
                config: {
                    publishRoles: ['content_editor', 'column_manager'],
                    publishUsers: [],
                    reviewRoles: ['content_reviewer', 'senior_reviewer'],
                    reviewUsers: [],
                    autoPublish: false,
                    requireReview: true
                }
            },
            'loose': {
                name: '宽松模式',
                description: '允许自动发布，仅对敏感内容进行审核',
                config: {
                    publishRoles: ['content_editor', 'column_manager', 'guest_editor'],
                    publishUsers: [],
                    reviewRoles: ['content_reviewer'],
                    reviewUsers: [],
                    autoPublish: true,
                    requireReview: false
                }
            }
        };
    }

    // 应用权限模板
    applyPermissionTemplate(columnKey, templateName) {
        const templates = this.getPermissionTemplates();
        const template = templates[templateName];
        
        if (!template) {
            throw new Error(`权限模板 ${templateName} 不存在`);
        }
        
        const newPermissions = { ...template.config };
        return this.updateColumnPermissions(columnKey, newPermissions);
    }

    // 获取权限变更历史
    getPermissionChangeHistory(columnKey, limit = 10) {
        // 这里应该从数据库获取权限变更历史
        // 暂时返回模拟数据
        return [
            {
                id: 1,
                columnKey: columnKey,
                changedBy: 'admin_001',
                changedAt: '2024-01-15 10:30:00',
                oldPermissions: { publishRoles: ['content_editor'] },
                newPermissions: { publishRoles: ['content_editor', 'column_manager'] },
                reason: '增加栏目管理员发布权限'
            }
        ].slice(0, limit);
    }

    // 检查权限冲突
    checkPermissionConflicts(permissions) {
        const conflicts = [];
        
        // 检查发布用户和审核用户是否有重叠
        const publishUsers = new Set(permissions.publishUsers);
        const reviewUsers = new Set(permissions.reviewUsers);
        
        for (const userId of publishUsers) {
            if (reviewUsers.has(userId)) {
                conflicts.push({
                    type: 'user_conflict',
                    message: `用户 ${userId} 同时具有发布和审核权限，可能存在利益冲突`,
                    severity: 'warning'
                });
            }
        }
        
        // 检查是否启用了自动发布但要求审核
        if (permissions.autoPublish && permissions.requireReview) {
            conflicts.push({
                type: 'logic_conflict',
                message: '启用了自动发布但要求审核，逻辑冲突',
                severity: 'error'
            });
        }
        
        return conflicts;
    }

    // 保存权限到数据库（模拟）
    savePermissionsToDatabase(columnKey, permissions) {
        console.log(`保存栏目 ${columnKey} 的权限配置到数据库:`, permissions);
        // 这里应该调用实际的API保存权限配置
    }

    // 清除权限缓存
    clearPermissionCache() {
        this.permissionCache.clear();
    }

    // 重新加载权限配置
    reloadPermissions() {
        this.clearPermissionCache();
        this.initDefaultPermissions();
    }
}

// 创建全局实例
const columnPermissionManager = new ColumnPermissionManager();

// 导出实例和类
window.columnPermissionManager = columnPermissionManager;
window.ColumnPermissionManager = ColumnPermissionManager;

console.log('[ColumnPermissionManager] 栏目权限管理器初始化成功');
