# PowerShell script to move documentation files to new structure

# Function to move file if it exists
function Move-FileIfExists {
    param(
        [string]$source,
        [string]$destination
    )
    
    if (Test-Path $source) {
        Write-Host "Moving $source to $destination"
        Copy-Item -Path $source -Destination $destination -Force
        Write-Host "Successfully moved $source"
    } else {
        Write-Host "Warning: $source does not exist, skipping..."
    }
}

# Create directories if they don't exist
Write-Host "Creating directories..."

# Move files to the new structure
Write-Host "Moving documentation files to new structure..."

# 1-overview
Move-FileIfExists -source ".\README.md" -destination ".\documentation\1-overview\README.md"
Move-FileIfExists -source ".\快速启动指南.md" -destination ".\documentation\1-overview\快速启动指南.md"
Move-FileIfExists -source ".\GitHub Pages访问指南.md" -destination ".\documentation\1-overview\GitHub Pages访问指南.md"
Move-FileIfExists -source ".\CHANGELOG.md" -destination ".\documentation\1-overview\CHANGELOG.md"

# 2-requirements
Move-FileIfExists -source ".\总体需求文档.md" -destination ".\documentation\2-requirements\总体需求文档.md"
Move-FileIfExists -source ".\功能需求文档.md" -destination ".\documentation\2-requirements\功能需求文档.md"
Move-FileIfExists -source ".\大屏管理需求设计文档.md" -destination ".\documentation\2-requirements\大屏管理需求设计文档.md"
Move-FileIfExists -source ".\文创管理模块-功能需求文档.md" -destination ".\documentation\2-requirements\文创管理模块-功能需求文档.md"
Move-FileIfExists -source ".\直播管理模块功能需求文档.md" -destination ".\documentation\2-requirements\直播管理模块功能需求文档.md"

# 3-design/ui
Move-FileIfExists -source ".\产品说明\全局UI设计文档.md" -destination ".\documentation\3-design\ui\全局UI设计文档.md"
Move-FileIfExists -source ".\产品说明文档\全局UI设计文档.md" -destination ".\documentation\3-design\ui\产品说明文档-全局UI设计文档.md"
Move-FileIfExists -source ".\产品说明文档\AI管理功能UI设计文档.md" -destination ".\documentation\3-design\ui\AI管理功能UI设计文档.md"

# 3-design/functional
Move-FileIfExists -source ".\功能设计文档.md" -destination ".\documentation\3-design\functional\功能设计文档.md"
Move-FileIfExists -source ".\产品说明文档\AI管理功能设计文档.md" -destination ".\documentation\3-design\functional\AI管理功能设计文档.md"
Move-FileIfExists -source ".\产品说明文档\大屏管理功能设计文档.md" -destination ".\documentation\3-design\functional\大屏管理功能设计文档.md"

# 3-design/data
Move-FileIfExists -source ".\数据模型定义.md" -destination ".\documentation\3-design\data\数据模型定义.md"
Move-FileIfExists -source ".\完整数据展示说明.md" -destination ".\documentation\3-design\data\完整数据展示说明.md"

# 4-implementation
Move-FileIfExists -source ".\系统说明文档.md" -destination ".\documentation\4-implementation\系统说明文档.md"
Move-FileIfExists -source ".\人民城轨2.md" -destination ".\documentation\4-implementation\人民城轨2.md"
Move-FileIfExists -source ".\文档\人民城轨2.0技术文档.md" -destination ".\documentation\4-implementation\人民城轨2.0技术文档.md"

# 5-deployment
Move-FileIfExists -source ".\DEPLOYMENT.md" -destination ".\documentation\5-deployment\DEPLOYMENT.md"
Move-FileIfExists -source ".\文档\部署\部署问题记录文档.md" -destination ".\documentation\5-deployment\部署问题记录文档.md"
Move-FileIfExists -source ".\文档\部署\大屏管理模块部署问题记录文档.md" -destination ".\documentation\5-deployment\大屏管理模块部署问题记录文档.md"

# 6-development
Move-FileIfExists -source ".\CONTRIBUTING.md" -destination ".\documentation\6-development\CONTRIBUTING.md"
Move-FileIfExists -source ".\文档\Playwright安装说明.md" -destination ".\documentation\6-development\Playwright安装说明.md"

# 7-demo
Move-FileIfExists -source ".\DEMO演示指南.md" -destination ".\documentation\7-demo\DEMO演示指南.md"
Move-FileIfExists -source ".\demo\README.md" -destination ".\documentation\7-demo\README.md"
Move-FileIfExists -source ".\demo\Word风格编辑器说明.md" -destination ".\documentation\7-demo\Word风格编辑器说明.md"
Move-FileIfExists -source ".\demo\两种编辑器对比.md" -destination ".\documentation\7-demo\两种编辑器对比.md"
Move-FileIfExists -source ".\demo\使用说明-重要.md" -destination ".\documentation\7-demo\使用说明-重要.md"
Move-FileIfExists -source ".\demo\功能说明.md" -destination ".\documentation\7-demo\功能说明.md"
Move-FileIfExists -source ".\demo\快速开始.md" -destination ".\documentation\7-demo\快速开始.md"

# Copy DEPLOYMENT.md to root as required
Copy-Item -Path ".\documentation\5-deployment\DEPLOYMENT.md" -Destination ".\DEPLOYMENT.md" -Force

Write-Host "Documentation file moving process completed!"