# PowerShell script to update internal links in documentation files

# Function to update links in a file
function Update-LinksInFile {
    param(
        [string]$filePath
    )
    
    if (-not (Test-Path $filePath)) {
        Write-Host "Warning: $filePath does not exist, skipping..."
        return
    }
    
    Write-Host "Updating links in $filePath"
    
    # Read the file content
    $content = Get-Content -Path $filePath -Raw
    
    # Define the link replacements
    $linkReplacements = @{
        # Overview files
        "\[README\.md\]\(\.\/README\.md\)" = "[README.md](../1-overview/README.md)"
        "\[快速启动指南\.md\]\(\.\/快速启动指南\.md\)" = "[快速启动指南.md](../1-overview/快速启动指南.md)"
        "\[GitHub Pages访问指南\.md\]\(\.\/GitHub Pages访问指南\.md\)" = "[GitHub Pages访问指南.md](../1-overview/GitHub Pages访问指南.md)"
        "\[CHANGELOG\.md\]\(\.\/CHANGELOG\.md\)" = "[CHANGELOG.md](../1-overview/CHANGELOG.md)"
        
        # Requirements files
        "\[总体需求文档\.md\]\(\.\/总体需求文档\.md\)" = "[总体需求文档.md](../2-requirements/总体需求文档.md)"
        "\[功能需求文档\.md\]\(\.\/功能需求文档\.md\)" = "[功能需求文档.md](../2-requirements/功能需求文档.md)"
        "\[大屏管理需求设计文档\.md\]\(\.\/大屏管理需求设计文档\.md\)" = "[大屏管理需求设计文档.md](../2-requirements/大屏管理需求设计文档.md)"
        "\[文创管理模块-功能需求文档\.md\]\(\.\/文创管理模块-功能需求文档\.md\)" = "[文创管理模块-功能需求文档.md](../2-requirements/文创管理模块-功能需求文档.md)"
        "\[直播管理模块功能需求文档\.md\]\(\.\/直播管理模块功能需求文档\.md\)" = "[直播管理模块功能需求文档.md](../2-requirements/直播管理模块功能需求文档.md)"
        
        # UI Design files
        "\[全局UI设计文档\.md\]\(\.\/产品说明\/全局UI设计文档\.md\)" = "[全局UI设计文档.md](../3-design/ui/全局UI设计文档.md)"
        "\[全局UI设计文档\.md\]\(\.\/产品说明文档\/全局UI设计文档\.md\)" = "[全局UI设计文档.md](../3-design/ui/全局UI设计文档.md)"
        "\[AI管理功能UI设计文档\.md\]\(\.\/产品说明文档\/AI管理功能UI设计文档\.md\)" = "[AI管理功能UI设计文档.md](../3-design/ui/AI管理功能UI设计文档.md)"
        
        # Functional Design files
        "\[功能设计文档\.md\]\(\.\/功能设计文档\.md\)" = "[功能设计文档.md](../3-design/functional/功能设计文档.md)"
        "\[AI管理功能设计文档\.md\]\(\.\/产品说明文档\/AI管理功能设计文档\.md\)" = "[AI管理功能设计文档.md](../3-design/functional/AI管理功能设计文档.md)"
        "\[大屏管理功能设计文档\.md\]\(\.\/产品说明文档\/大屏管理功能设计文档\.md\)" = "[大屏管理功能设计文档.md](../3-design/functional/大屏管理功能设计文档.md)"
        
        # Data Design files
        "\[数据模型定义\.md\]\(\.\/数据模型定义\.md\)" = "[数据模型定义.md](../3-design/data/数据模型定义.md)"
        "\[完整数据展示说明\.md\]\(\.\/完整数据展示说明\.md\)" = "[完整数据展示说明.md](../3-design/data/完整数据展示说明.md)"
        
        # Implementation files
        "\[系统说明文档\.md\]\(\.\/系统说明文档\.md\)" = "[系统说明文档.md](../4-implementation/系统说明文档.md)"
        "\[人民城轨2\.md\]\(\.\/人民城轨2\.md\)" = "[人民城轨2.md](../4-implementation/人民城轨2.md)"
        "\[人民城轨2\.0技术文档\.md\]\(\.\/文档\/人民城轨2\.0技术文档\.md\)" = "[人民城轨2.0技术文档.md](../4-implementation/人民城轨2.0技术文档.md)"
        
        # Deployment files
        "\[DEPLOYMENT\.md\]\(\.\/DEPLOYMENT\.md\)" = "[DEPLOYMENT.md](../5-deployment/DEPLOYMENT.md)"
        "\[部署问题记录文档\.md\]\(\.\/文档\/部署\/部署问题记录文档\.md\)" = "[部署问题记录文档.md](../5-deployment/部署问题记录文档.md)"
        "\[大屏管理模块部署问题记录文档\.md\]\(\.\/文档\/部署\/大屏管理模块部署问题记录文档\.md\)" = "[大屏管理模块部署问题记录文档.md](../5-deployment/大屏管理模块部署问题记录文档.md)"
        
        # Development files
        "\[CONTRIBUTING\.md\]\(\.\/CONTRIBUTING\.md\)" = "[CONTRIBUTING.md](../6-development/CONTRIBUTING.md)"
        "\[Playwright安装说明\.md\]\(\.\/文档\/Playwright安装说明\.md\)" = "[Playwright安装说明.md](../6-development/Playwright安装说明.md)"
        
        # Demo files
        "\[DEMO演示指南\.md\]\(\.\/DEMO演示指南\.md\)" = "[DEMO演示指南.md](../7-demo/DEMO演示指南.md)"
        "\[README\.md\]\(\.\/demo\/README\.md\)" = "[README.md](../7-demo/README.md)"
        "\[Word风格编辑器说明\.md\]\(\.\/demo\/Word风格编辑器说明\.md\)" = "[Word风格编辑器说明.md](../7-demo/Word风格编辑器说明.md)"
        "\[两种编辑器对比\.md\]\(\.\/demo\/两种编辑器对比\.md\)" = "[两种编辑器对比.md](../7-demo/两种编辑器对比.md)"
        "\[使用说明-重要\.md\]\(\.\/demo\/使用说明-重要\.md\)" = "[使用说明-重要.md](../7-demo/使用说明-重要.md)"
        "\[功能说明\.md\]\(\.\/demo\/功能说明\.md\)" = "[功能说明.md](../7-demo/功能说明.md)"
        "\[快速开始\.md\]\(\.\/demo\/快速开始\.md\)" = "[快速开始.md](../7-demo/快速开始.md)"
        
        # Special case for the missing files mentioned in README.md
        "\[大屏可视化编辑使用指南\.md\]\(\.\/大屏可视化编辑使用指南\.md\)" = "[大屏可视化编辑使用指南（待更新）](../7-demo/README.md#大屏可视化编辑使用)"
        "\[大屏管理Demo使用说明\.md\]\(\.\/大屏管理Demo使用说明\.md\)" = "[大屏管理Demo使用说明（待更新）](../7-demo/README.md#大屏管理demo使用)"
    }
    
    # Update the content with the replacements
    $updatedContent = $content
    foreach ($pattern in $linkReplacements.Keys) {
        $updatedContent = $updatedContent -replace $pattern, $linkReplacements[$pattern]
    }
    
    # Write the updated content back to the file
    Set-Content -Path $filePath -Value $updatedContent
    Write-Host "Links updated in $filePath"
}

# Update links in the root README.md
Update-LinksInFile -filePath ".\documentation\1-overview\README.md"

# Update links in other documentation files
$documentationFiles = Get-ChildItem -Path ".\documentation" -Recurse -Filter "*.md"
foreach ($file in $documentationFiles) {
    # Skip the README.md since we already updated it
    if ($file.FullName -ne "$PWD\documentation\1-overview\README.md") {
        Update-LinksInFile -filePath $file.FullName
    }
}

# Also update the root README.md (main entry point)
if (Test-Path ".\README.md") {
    Update-LinksInFile -filePath ".\README.md"
}

Write-Host "All documentation links have been updated!"