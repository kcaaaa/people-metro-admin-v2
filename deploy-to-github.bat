@echo off
echo 开始部署到GitHub Pages...

:: 确保在正确的目录
cd /d %~dp0

:: 初始化git仓库（如果还没有初始化）
if not exist .git (
    echo 初始化Git仓库...
    git init
    git remote add origin https://github.com/kcaaaa/people-metro-admin-v2.git
)

:: 添加所有文件
echo 添加文件到Git...
git add .

:: 提交更改
echo 提交更改...
git commit -m "Update: 展商中心功能更新 - 移除登录验证"

:: 推送到main分支
echo 推送到main分支...
git push -u origin main

:: 部署到gh-pages分支
echo 部署到gh-pages分支...
git checkout -b gh-pages
git push -u origin gh-pages

echo 部署完成！
echo 请访问: https://kcaaaa.github.io/people-metro-admin-v2/
pause
