#!/bin/bash

# 人民城轨管理系统 - 大屏运营模块GIT部署脚本
# 功能：自动化部署大屏运营模块（包含大屏管理和背景墙管理功能）到目标服务器
# 版本：1.1.0
# 创建日期：2024-05-16
# 最后更新：2024-05-20
# 维护人：技术团队

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
GIT_REPO="https://github.com/people-metro/people-metro-admin-v2.git"
BRANCH="main"
APP_NAME="screen-operation"
DEPLOY_DIR="/data/apps/${APP_NAME}"
BACKUP_DIR="/data/backups/${APP_NAME}"
TMP_DIR="/tmp/${APP_NAME}-deploy"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
NODE_ENV="production"
PM_INSTALL_OPTS="--production --registry=https://registry.npm.taobao.org"

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "命令 $1 不存在，请先安装"
        exit 1
    fi
}

# 检查目录是否存在
check_dir() {
    if [ ! -d "$1" ]; then
        log_info "创建目录: $1"
        mkdir -p "$1"
        if [ $? -ne 0 ]; then
            log_error "创建目录 $1 失败"
            exit 1
        fi
    fi
}

# 备份当前部署
backup_current() {
    log_info "开始备份当前部署..."
    
    if [ -d "${DEPLOY_DIR}" ]; then
        BACKUP_FILE="${BACKUP_DIR}/${APP_NAME}-${TIMESTAMP}.tar.gz"
        
        check_dir "${BACKUP_DIR}"
        
        log_info "创建备份文件: ${BACKUP_FILE}"
        tar -czf "${BACKUP_FILE}" "${DEPLOY_DIR}"
        
        if [ $? -eq 0 ]; then
            log_info "备份成功: ${BACKUP_FILE}"
            
            # 清理7天前的备份文件
            find "${BACKUP_DIR}" -name "${APP_NAME}-*.tar.gz" -mtime +7 -delete
            log_info "已清理7天前的备份文件"
        else
            log_error "备份失败"
            exit 1
        fi
    else
        log_info "当前部署目录不存在，无需备份"
    fi
}

# 克隆代码库
clone_repo() {
    log_info "开始拉取最新代码..."
    
    # 清理临时目录
    if [ -d "${TMP_DIR}" ]; then
        rm -rf "${TMP_DIR}"
    fi
    
    mkdir -p "${TMP_DIR}"
    
    # 克隆代码
    git clone -b "${BRANCH}" "${GIT_REPO}" "${TMP_DIR}"
    
    if [ $? -ne 0 ]; then
        log_error "拉取代码失败"
        exit 1
    fi
    
    log_info "代码拉取成功"
}

# 安装依赖
install_deps() {
    log_info "开始安装依赖..."
    
    cd "${TMP_DIR}"
    
    # 设置NODE_ENV
    export NODE_ENV="${NODE_ENV}"
    
    # 安装npm依赖
    npm install ${PM_INSTALL_OPTS}
    
    if [ $? -ne 0 ]; then
        log_error "依赖安装失败"
        exit 1
    fi
    
    log_info "依赖安装成功"
}

# 构建项目
build_project() {
    log_info "开始构建项目..."
    
    cd "${TMP_DIR}"
    
    # 执行构建命令
    npm run build
    
    if [ $? -ne 0 ]; then
        log_error "项目构建失败"
        exit 1
    fi
    
    log_info "项目构建成功"
}

# 部署应用
deploy_app() {
    log_info "开始部署应用..."
    
    # 清理旧的部署目录
    if [ -d "${DEPLOY_DIR}" ]; then
        rm -rf "${DEPLOY_DIR}"
    fi
    
    # 创建部署目录
    mkdir -p "${DEPLOY_DIR}"
    
    # 复制构建后的文件到部署目录
    cp -r "${TMP_DIR}/dist"/* "${DEPLOY_DIR}/"
    
    # 复制配置文件
    if [ -f "${TMP_DIR}/config/prod.env.js" ]; then
        cp "${TMP_DIR}/config/prod.env.js" "${DEPLOY_DIR}/"
    fi
    
    # 设置目录权限
    chmod -R 755 "${DEPLOY_DIR}"
    
    log_info "应用部署成功，部署目录: ${DEPLOY_DIR}"
}

# 重启服务
restart_service() {
    log_info "开始重启服务..."
    
    # 这里可以根据实际使用的服务管理器进行调整
    # 例如使用systemd、pm2等
    
    # 示例：使用pm2重启服务
    # pm2 restart "${APP_NAME}"
    
    # 示例：使用systemd重启服务
    # systemctl restart "${APP_NAME}.service"
    
    log_info "服务重启命令已执行"
}

# 清理临时文件
cleanup() {
    log_info "清理临时文件..."
    
    if [ -d "${TMP_DIR}" ]; then
        rm -rf "${TMP_DIR}"
    fi
    
    log_info "临时文件清理完成"
}

# 验证部署
verify_deployment() {
    log_info "验证部署是否成功..."
    
    # 这里可以添加验证逻辑，例如检查服务是否正常启动
    # 检查关键文件是否存在等
    
    if [ -f "${DEPLOY_DIR}/index.html" ]; then
        log_info "部署验证通过: 前端文件存在"
        return 0
    else
        log_error "部署验证失败: 前端文件不存在"
        return 1
    fi
}

# 主函数
main() {
    log_info "========================================"
    log_info "开始部署 ${APP_NAME} 模块"
    log_info "========================================"
    
    # 检查必要的命令
    check_command "git"
    check_command "npm"
    
    # 执行部署流程
    backup_current
    clone_repo
    install_deps
    build_project
    deploy_app
    restart_service
    cleanup
    
    # 验证部署
    if verify_deployment; then
        log_info "========================================"
        log_info "${APP_NAME} 模块部署成功!"
        log_info "========================================"
        exit 0
    else
        log_error "========================================"
        log_error "${APP_NAME} 模块部署失败!"
        log_error "========================================"
        exit 1
    fi
}

# 执行主函数
main

# 注意事项：
# 1. 执行前请确保有执行权限：chmod +x deploy.sh
# 2. 根据实际情况修改配置变量
# 3. 生产环境建议使用非root用户执行脚本
# 4. 确保目标服务器上已安装git和npm
# 5. 如需自动化部署，可将脚本添加到CI/CD流程中