@echo off
setlocal enabledelayedexpansion
echo 开始部署到GitHub Pages...

:: 确保在正确的目录
cd /d %~dp0

:: 初始化git仓库（如果还没有初始化）
if not exist .git (
    echo 初始化Git仓库...
    git init
    git remote add origin https://github.com/kcaaaa/people-metro-admin-v2.git
)

:: 同步文件到docs目录
echo 同步文件到docs目录...
call sync-to-docs.bat

:: 添加所有文件（排除node_modules和临时文件）
echo 添加文件到Git...
git add --all -- ':!node_modules/' ':!*.tmp' ':!*.temp'

:: 获取当前日期和时间作为提交信息
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ("%time%") do (set mytime=%%a%%b)
set commit_message="Update: 文档结构优化和系统更新 - %mydate%_%mytime%"

:: 提交更改
echo 提交更改...
git commit -m !commit_message!

:: 推送到main分支
echo 推送到main分支...
git push -u origin main

:: 检查gh-pages分支是否存在，如果不存在则创建
for /f %%i in ('git branch -r') do (
    if "%%i" == "origin/gh-pages" (
        set gh_pages_exists=true
    )
)

if "!gh_pages_exists!" == "true" (
    echo 切换到gh-pages分支...
    git checkout gh-pages
) else (
    echo 创建gh-pages分支...
    git checkout -b gh-pages
)

:: 确保docs目录下的内容被推送到gh-pages
echo 推送更新到gh-pages分支...
git add --all
git commit -m !commit_message! || echo 没有变更需要提交

git push -u origin gh-pages

:: 切回main分支
git checkout main

echo 部署完成！
echo 请访问: https://kcaaaa.github.io/people-metro-admin-v2/
pause