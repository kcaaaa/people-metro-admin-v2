@echo off
setlocal enabledelayedexpansion

echo.
echo =================================================================
echo  🚇 人民城轨2.0 - GitHub Pages 自动化部署脚本
echo =================================================================
echo.
echo 此脚本将执行以下操作:
echo   1. 提交所有本地更改到 'main' 分支
echo   2. 将当前目录的所有文件强制推送到 'gh-pages' 分支用于部署
echo.

:: --- 步骤 1: 提交源码到 main 分支 ---
echo [步骤 1/2] 正在提交源码到 'main' 分支...
git add .
git commit -m "chore: automated deployment update"
echo.
echo 推送 'main' 分支到远程仓库...
git push origin main
if !errorlevel! equ 0 (
    echo   - 'main' 分支已成功更新。
) else (
    echo   - 'main' 分支推送失败，请检查网络或权限。
)

echo.

:: --- 步骤 2: 部署到 gh-pages 分支 ---
echo [步骤 2/2] 正在将项目部署到 'gh-pages' 分支...

:: 使用 subtree 强制将当前目录部署到 gh-pages 分支
:: 这会创建一个干净的、只包含项目文件的分支，非常适合部署
git subtree push --prefix=. origin gh-pages

if !errorlevel! equ 0 (
    echo.
    echo =================================================================
    echo  🎉 部署成功!
    echo =================================================================
    echo.
    echo  - 你的网站正在更新中，请等待1-2分钟。
    echo  - 访问地址: https://kcaaaa.github.io/people-metro-admin-v2/
    echo.
    echo  - [重要提示] 请确保你的 GitHub Pages 设置正确:
    echo    - 仓库 -> Settings -> Pages
    echo    - Source: Deploy from a branch
    echo    - Branch: gh-pages
    echo    - Folder: /(root)
    echo.
) else (
    echo.
    echo =================================================================
    echo  ❌ 部署失败!
    echo =================================================================
    echo.
    echo  - 原因: 'git subtree push' 命令执行失败。
    echo  - 请检查 Git 是否安装正确，以及是否有远程仓库的推送权限。
    echo.
)

pause
