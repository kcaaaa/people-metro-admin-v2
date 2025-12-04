# 人民城轨2.0 项目部署脚本
# 用于自动化项目的克隆、构建和部署流程

# 设置错误时停止脚本
$ErrorActionPreference = "Stop"

# 定义变量
$REPO_URL = "https://github.com/your-organization/people-metro-admin-v2.git"  # Git仓库地址
$DEPLOY_DIR = "D:\deploy\people-metro-admin-v2"  # 部署目录
$ENV_NAME = "production"  # 环境名称（production/staging/test）
$NODE_VERSION = "16.13.0"  # Node.js版本

Write-Host "===== 人民城轨2.0 项目部署脚本 =====" -ForegroundColor Cyan
Write-Host "环境: $ENV_NAME" -ForegroundColor Yellow
Write-Host "部署目录: $DEPLOY_DIR" -ForegroundColor Yellow
Write-Host "开始时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Yellow
Write-Host ""

# 1. 检查部署目录是否存在
if (Test-Path $DEPLOY_DIR) {
    Write-Host "部署目录已存在，清理旧文件..." -ForegroundColor Green
    Remove-Item -Path "$DEPLOY_DIR\*" -Recurse -Force
} else {
    Write-Host "创建部署目录..." -ForegroundColor Green
    New-Item -Path $DEPLOY_DIR -ItemType Directory -Force
}

# 2. 克隆Git仓库
Write-Host "克隆Git仓库..." -ForegroundColor Green
Set-Location $DEPLOY_DIR
& git clone $REPO_URL .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Git克隆失败！" -ForegroundColor Red
    exit 1
}

# 3. 安装依赖
Write-Host "安装项目依赖..." -ForegroundColor Green
& npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "依赖安装失败！" -ForegroundColor Red
    exit 1
}

# 4. 构建项目
Write-Host "构建项目..." -ForegroundColor Green
& npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "项目构建失败！" -ForegroundColor Red
    exit 1
}

# 5. 部署到服务器（示例：复制到IIS站点目录）
$IIS_SITE_DIR = "D:\inetpub\wwwroot\people-metro-admin-v2"

if (Test-Path $IIS_SITE_DIR) {
    Write-Host "清理IIS站点目录..." -ForegroundColor Green
    Remove-Item -Path "$IIS_SITE_DIR\*" -Recurse -Force
} else {
    Write-Host "创建IIS站点目录..." -ForegroundColor Green
    New-Item -Path $IIS_SITE_DIR -ItemType Directory -Force
}

Write-Host "复制构建文件到IIS站点目录..." -ForegroundColor Green
Copy-Item -Path "$DEPLOY_DIR\dist\*" -Destination $IIS_SITE_DIR -Recurse -Force

if ($LASTEXITCODE -ne 0) {
    Write-Host "文件复制失败！" -ForegroundColor Red
    exit 1
}

# 6. 重启IIS站点（可选）
# Write-Host "重启IIS站点..." -ForegroundColor Green
# & iisreset

Write-Host ""
Write-Host "===== 部署完成 =====" -ForegroundColor Cyan
Write-Host "结束时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Yellow
Write-Host "部署目录: $DEPLOY_DIR" -ForegroundColor Yellow
Write-Host "IIS站点目录: $IIS_SITE_DIR" -ForegroundColor Yellow
Write-Host ""