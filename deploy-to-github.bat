@echo off
setlocal enabledelayedexpansion

echo.
echo =================================================================
echo  🚇 人民城轨2.0 - 自动化部署至 'main' 分支的 '/docs' 目录
echo =================================================================
echo.
echo 此脚本将执行以下操作:
echo   1. 清理并重建 '/docs' 目录
echo   2. 将项目所有文件复制到 '/docs' 目录中
echo   3. 提交所有更改到 'main' 分支并推送
echo.

:: --- 步骤 1: 清理并重建 docs 目录 ---
echo [步骤 1/3] 正在清理并重建 '/docs' 目录...
if exist "docs" (
    echo   - 删除旧的 '/docs' 目录...
    rmdir /s /q docs
)
echo   - 创建新的 '/docs' 目录...
mkdir docs

echo.

:: --- 步骤 2: 复制项目文件到 docs 目录 ---
echo [步骤 2/3] 正在复制项目文件到 '/docs' 目录...
:: 使用 xcopy 复制所有文件和子目录，但不包括 docs 目录本身
xcopy . docs /e /i /h /y /exclude:exclude_files.txt

if !errorlevel! equ 0 (
    echo   - 文件复制成功。
) else (
    echo   - 文件复制失败，部署中止。
    pause
    exit /b 1
)

echo.

:: --- 步骤 3: 提交并推送到 main 分支 ---
echo [步骤 3/3] 正在提交并推送到 'main' 分支...
git add .
git commit -m "build: update docs for deployment"
git push origin main

if !errorlevel! equ 0 (
    echo.
    echo =================================================================
    echo  🎉 部署成功!
    echo =================================================================
    echo.
    echo  - 你的网站正在从 'main' 分支的 '/docs' 目录更新中...
    echo  - 请等待1-2分钟后访问: https://kcaaaa.github.io/people-metro-admin-v2/
    echo.
) else (
    echo.
    echo =================================================================
    echo  ❌ 部署失败!
    echo =================================================================
    echo.
    echo  - 原因: 'git push' 命令执行失败。
    echo  - 请检查网络或权限。
    echo.
)

pause
