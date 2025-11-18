@echo off
REM 人民城轨2.0管理系统 - GIT部署脚本
REM 用途：自动化将项目部署到GitHub Pages和生产环境
REM 版本：V2.1
REM 日期：2025-11-18
REM 备注：此版本增强了情景管理功能模块的部署支持，优化了错误处理机制，添加了依赖检查功能

setlocal enabledelayedexpansion

REM 设置环境变量
set "GIT_REPO=https://github.com/username/people-metro-admin-v2.git"
set "GIT_REPO_URL=%GIT_REPO%"
set "BRANCH=main"
set "DEPLOY_BRANCH=gh-pages"
set "SOURCE_DIR=d:\桌面\人民城轨2.0\people-metro-admin-v2"
set "BUILD_DIR=docs"
set "TEMP_DEPLOY_DIR=temp-deploy"
set "DEPLOY_DIR=d:\deploy\people-metro-admin-v2"
set "BACKUP_DIR=d:\backup\people-metro-admin-v2"
set "LOG_FILE=d:\logs\deploy_%date:~0,4%%date:~5,2%%date:~8,2%.log"

REM 显示当前配置
echo.[92m==============================================[0m
echo.[92m人民城轨2.0管理系统 - GIT部署脚本[0m
echo.[92m==============================================[0m
echo.

REM 检查Git是否安装
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo.[91m错误：未找到Git。请先安装Git并添加到系统PATH中。[0m
exit /b 1
)

REM 创建必要的目录结构
if not exist "d:\logs" mkdir "d:\logs"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
if not exist "%DEPLOY_DIR%" mkdir "%DEPLOY_DIR%"

REM 开始日志记录
echo ========== 部署开始：%date% %time% ========== >> %LOG_FILE%

echo.[94m请选择部署模式：[0m
echo. [1] GitHub Pages部署
echo. [2] 生产环境部署
echo. [3] 仅情景管理功能模块部署
echo.请输入选择(1-3)：
set /p "DEPLOY_MODE="

if not defined DEPLOY_MODE set DEPLOY_MODE=1

if "%DEPLOY_MODE%"=="1" (
    echo.[94m选择模式：GitHub Pages部署[0m
) else if "%DEPLOY_MODE%"=="2" (
    echo.[94m选择模式：生产环境部署[0m
) else if "%DEPLOY_MODE%"=="3" (
    echo.[94m选择模式：仅情景管理功能模块部署[0m
) else (
    echo.[93m警告：无效的选择，默认使用GitHub Pages部署模式。[0m
    set DEPLOY_MODE=1
)

echo 1. 检查并创建部署目录...
echo 1. 检查并创建部署目录... >> %LOG_FILE%
if not exist "%DEPLOY_DIR%" (
    echo  创建部署目录: %DEPLOY_DIR%
    echo  创建部署目录: %DEPLOY_DIR% >> %LOG_FILE%
    mkdir "%DEPLOY_DIR%"
)

REM 备份当前部署版本
if exist "%DEPLOY_DIR%\dist" (
    echo 2. 备份当前版本...
    echo 2. 备份当前版本... >> %LOG_FILE%
    
    set "BACKUP_TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
    set "BACKUP_TIMESTAMP=!BACKUP_TIMESTAMP: =0!"
    
    if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
    
    echo  备份到: %BACKUP_DIR%\backup_%BACKUP_TIMESTAMP%
    echo  备份到: %BACKUP_DIR%\backup_%BACKUP_TIMESTAMP% >> %LOG_FILE%
    
    xcopy "%DEPLOY_DIR%\dist" "%BACKUP_DIR%\backup_%BACKUP_TIMESTAMP%" /s /e /i /h /c /k /y 1>> %LOG_FILE% 2>&1
    
    if %errorlevel% equ 0 (
        echo  备份成功
        echo  备份成功 >> %LOG_FILE%
    ) else (
        echo  备份失败，但继续部署 >> %LOG_FILE%
    )
)

REM 克隆或更新代码仓库
echo 3. 拉取最新代码...
echo 3. 拉取最新代码... >> %LOG_FILE%

if exist "%DEPLOY_DIR%\.git" (
    echo  更新现有仓库...
    echo  更新现有仓库... >> %LOG_FILE%
    cd "%DEPLOY_DIR%"
    git fetch origin >> %LOG_FILE% 2>&1
    git checkout %BRANCH% >> %LOG_FILE% 2>&1
    git pull origin %BRANCH% >> %LOG_FILE% 2>&1
) else (
    echo  克隆新仓库...
    echo  克隆新仓库... >> %LOG_FILE%
    git clone %GIT_REPO% "%DEPLOY_DIR%" >> %LOG_FILE% 2>&1
    cd "%DEPLOY_DIR%"
    git checkout %BRANCH% >> %LOG_FILE% 2>&1
)

if %errorlevel% neq 0 (
    echo  拉取代码失败，请检查网络连接和仓库权限
    echo  拉取代码失败，请检查网络连接和仓库权限 >> %LOG_FILE%
    goto ERROR
)

REM 安装依赖
echo 4. 安装依赖包...
echo 4. 安装依赖包... >> %LOG_FILE%
cd "%DEPLOY_DIR%"

REM 检查并使用npm dedupe优化依赖
echo  执行依赖优化...
echo  执行依赖优化... >> %LOG_FILE%
npm dedupe >> %LOG_FILE% 2>&1

REM 安装依赖
npm install >> %LOG_FILE% 2>&1

if %errorlevel% neq 0 (
    echo  依赖安装失败，尝试使用淘宝镜像...
    echo  依赖安装失败，尝试使用淘宝镜像... >> %LOG_FILE%
    npm config set registry https://registry.npmmirror.com/
    npm install >> %LOG_FILE% 2>&1
    
    if %errorlevel% neq 0 (
        echo  依赖安装再次失败，请检查网络连接和package.json配置
        echo  依赖安装再次失败，请检查网络连接和package.json配置 >> %LOG_FILE%
        goto ERROR
    )
)

REM 构建项目
echo 5. 构建项目...
echo 5. 构建项目... >> %LOG_FILE%
npm run build >> %LOG_FILE% 2>&1

if %errorlevel% neq 0 (
    echo  项目构建失败
    echo  项目构建失败 >> %LOG_FILE%
    goto ERROR
)

REM 部署构建结果
echo 6. 部署构建结果...
echo 6. 部署构建结果... >> %LOG_FILE%

REM 根据部署模式执行不同的部署逻辑
if "%DEPLOY_MODE%"=="1" (
    REM GitHub Pages部署
    echo  执行GitHub Pages部署...
    echo  执行GitHub Pages部署... >> %LOG_FILE%
    
    REM 创建临时部署目录
    mkdir "%DEPLOY_DIR%\%TEMP_DEPLOY_DIR%" 2>nul
    
    REM 复制构建产物到临时目录
    xcopy "%DEPLOY_DIR%\dist" "%DEPLOY_DIR%\%TEMP_DEPLOY_DIR%" /s /e /i /h /c /k /y 1>> %LOG_FILE% 2>&1
    
    REM 创建.nojekyll文件，确保GitHub Pages正确处理以下划线开头的目录
    echo. > "%DEPLOY_DIR%\%TEMP_DEPLOY_DIR%\.nojekyll"
    echo  创建.nojekyll文件完成 >> %LOG_FILE%
    
    REM 切换到gh-pages分支并推送
    cd "%DEPLOY_DIR%\%TEMP_DEPLOY_DIR%"
    git init >> %LOG_FILE% 2>&1
    git config user.name "部署脚本"
    git config user.email "deploy-script@example.com"
    git add . >> %LOG_FILE% 2>&1
    git commit -m "Deploy to GitHub Pages: %date% %time%" >> %LOG_FILE% 2>&1
    git remote add origin %GIT_REPO% >> %LOG_FILE% 2>&1 2>nul || git remote set-url origin %GIT_REPO% >> %LOG_FILE% 2>&1
    git push -f origin HEAD:%DEPLOY_BRANCH% >> %LOG_FILE% 2>&1
    
    REM 清理临时目录
    cd "%DEPLOY_DIR%"
    rmdir /s /q "%TEMP_DEPLOY_DIR%"
    
    echo  GitHub Pages部署完成
    echo  GitHub Pages部署完成 >> %LOG_FILE%
) else if "%DEPLOY_MODE%"=="2" (
    REM 生产环境部署
    if exist "%DEPLOY_DIR%\dist" (
        if exist "%DEPLOY_DIR%\dist_old" (
            rmdir /s /q "%DEPLOY_DIR%\dist_old"
        )
        
        ren "%DEPLOY_DIR%\dist" "dist_old"
        
        echo  构建结果已部署到生产环境
        echo  构建结果已部署到生产环境 >> %LOG_FILE%
    ) else (
        echo  构建结果不存在，部署失败
        echo  构建结果不存在，部署失败 >> %LOG_FILE%
        goto ERROR
    )
) else if "%DEPLOY_MODE%"=="3" (
    REM 仅情景管理功能模块部署
    echo  执行情景管理功能模块部署...
    echo  执行情景管理功能模块部署... >> %LOG_FILE%
    
    REM 创建情景管理模块专用部署目录
    set "SCENARIO_DEPLOY_DIR=%DEPLOY_DIR%\scenario-module"
    if not exist "%SCENARIO_DEPLOY_DIR%" mkdir "%SCENARIO_DEPLOY_DIR%"
    
    REM 复制情景管理模块相关文件
    echo  复制情景管理模块文件...
    echo  复制情景管理模块文件... >> %LOG_FILE%
    
    REM 复制核心组件
    if exist "%DEPLOY_DIR%\dist\js\pages\ScenarioManagement_v2.js" (
        mkdir "%SCENARIO_DEPLOY_DIR%\js\pages" 2>nul
        copy "%DEPLOY_DIR%\dist\js\pages\ScenarioManagement_v2.js" "%SCENARIO_DEPLOY_DIR%\js\pages\" >> %LOG_FILE% 2>&1
    )
    
    REM 复制相关资源和配置文件
    xcopy "%DEPLOY_DIR%\dist\assets" "%SCENARIO_DEPLOY_DIR%\assets" /s /e /i /h /c /k /y 1>> %LOG_FILE% 2>&1
    
    echo  情景管理模块部署完成
    echo  情景管理模块部署完成 >> %LOG_FILE%
)

REM 清理旧文件
echo 7. 清理旧文件...
echo 7. 清理旧文件... >> %LOG_FILE%
if exist "%DEPLOY_DIR%\dist_old" (
    rmdir /s /q "%DEPLOY_DIR%\dist_old"
    echo  旧文件已清理
    echo  旧文件已清理 >> %LOG_FILE%
)

REM 验证部署
echo 8. 验证部署结果...
echo 8. 验证部署结果... >> %LOG_FILE%
if "%DEPLOY_MODE%"=="1" (
    echo  GitHub Pages部署验证：请在浏览器中访问 https://username.github.io/people-metro-admin-v2/
) else if exist "%DEPLOY_DIR%\dist_old\index.html" (
    echo  部署验证成功
    echo  部署验证成功 >> %LOG_FILE%
) else (
    echo  部署验证失败，index.html不存在
    echo  部署验证失败，index.html不存在 >> %LOG_FILE%
    goto ERROR
)

echo ========== 部署完成：%date% %time% ==========
echo ========== 部署完成：%date% %time% ========== >> %LOG_FILE%
echo 部署日志已保存至: %LOG_FILE%

goto END

:ERROR
echo ========== 部署失败：%date% %time% ==========
echo ========== 部署失败：%date% %time% ========== >> %LOG_FILE%
echo 详细错误信息请查看日志文件: %LOG_FILE%

:END
endlocal
pause