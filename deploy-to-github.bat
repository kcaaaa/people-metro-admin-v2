@echo off
chcp 65001 >nul
echo.
echo =========================================
echo   人民城轨2.0运营管理后台 - GitHub部署
echo =========================================
echo.

echo 📋 部署前准备清单：
echo    1. 已在GitHub创建 people-metro-admin-v2 仓库
echo    2. 仓库设置为Public
echo    3. 已配置本地Git用户名和邮箱
echo.

set /p username="请输入您的GitHub用户名: "

if "%username%"=="" (
    echo ❌ 错误：GitHub用户名不能为空！
    pause
    exit /b 1
)

echo.
echo 🔄 正在配置远程仓库...
git remote set-url origin https://github.com/%username%/people-metro-admin-v2.git

echo.
echo 📤 正在推送代码到GitHub...
git push -u origin main

if %errorlevel% == 0 (
    echo.
    echo ✅ 部署成功！
    echo.
    echo 🔗 相关链接：
    echo    GitHub仓库: https://github.com/%username%/people-metro-admin-v2
    echo    在线预览: https://%username%.github.io/people-metro-admin-v2/
    echo.
    echo 🔧 后续配置步骤：
    echo    1. 访问GitHub仓库页面
    echo    2. Settings → Pages
    echo    3. Source选择 "Deploy from a branch"
    echo    4. Branch选择 "main"，Folder选择 "/docs"
    echo    5. 等待GitHub Actions自动部署
    echo.
    echo 💡 提示：首次部署可能需要几分钟时间
    echo.
) else (
    echo.
    echo ❌ 部署失败，请检查：
    echo    1. GitHub仓库权限是否正确
    echo    2. 网络连接是否正常
    echo    3. Git配置是否正确
    echo.
)

echo 按任意键退出...
pause >nul
