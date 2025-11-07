@echo off

REM ========================================================
REM AI管理功能模块部署脚本
REM 用途：自动化部署AI管理功能模块到生产/测试环境
REM 版本：V1.1
REM 日期：2024-01-21
REM 备注：此版本适配了使用原生JavaScript替代JSX语法的技术实现
REM ========================================================

setlocal enabledelayedexpansion

REM 设置环境变量
set "GIT_REPO_URL=https://github.com/your-org/people-metro-admin-v2.git"
set "BRANCH=main"
set "DEPLOY_DIR=d:\deploy\people-metro-admin-v2"
set "BACKUP_DIR=d:\backup\people-metro-admin-v2"
set "LOG_FILE=d:\logs\deploy_%date:~0,4%%date:~5,2%%date:~8,2%.log"

REM 创建日志目录
if not exist "d:\logs" mkdir "d:\logs"

REM 开始日志记录
echo ========== 部署开始：%date% %time% ========== >> %LOG_FILE%

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
    git clone %GIT_REPO_URL% "%DEPLOY_DIR%" >> %LOG_FILE% 2>&1
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
npm install >> %LOG_FILE% 2>&1

if %errorlevel% neq 0 (
    echo  依赖安装失败
    echo  依赖安装失败 >> %LOG_FILE%
    goto ERROR
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

if exist "%DEPLOY_DIR%\dist" (
    if exist "%DEPLOY_DIR%\dist_old" (
        rmdir /s /q "%DEPLOY_DIR%\dist_old"
    )
    
    if exist "%DEPLOY_DIR%\dist" (
        ren "%DEPLOY_DIR%\dist" "dist_old"
    )
    
    echo  构建结果已部署
    echo  构建结果已部署 >> %LOG_FILE%
) else (
    echo  构建结果不存在，部署失败
    echo  构建结果不存在，部署失败 >> %LOG_FILE%
    goto ERROR
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
if exist "%DEPLOY_DIR%\dist\index.html" (
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