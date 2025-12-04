@echo off
chcp 65001 >nul
REM ========================================================
REM 人民城轨2.0运营管理后台 - Git部署脚本
REM 用途：自动化提交和推送代码到Git仓库
REM 版本：V2.0
REM 日期：2024-12-19
REM ========================================================

setlocal enabledelayedexpansion

REM 设置颜色
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

echo %GREEN%========================================%NC%
echo %GREEN%  人民城轨2.0 Git部署脚本%NC%
echo %GREEN%========================================%NC%
echo.

REM 检查Git是否安装
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%错误：未检测到Git，请先安装Git%NC%
    pause
    exit /b 1
)

REM 获取当前目录
set "PROJECT_DIR=%~dp0..\.."
cd /d "%PROJECT_DIR%"

echo %GREEN%当前工作目录：%PROJECT_DIR%%NC%
echo.

REM 检查是否为Git仓库
if not exist ".git" (
    echo %RED%错误：当前目录不是Git仓库%NC%
    pause
    exit /b 1
)

REM 显示当前Git状态
echo %YELLOW%1. 检查Git状态...%NC%
git status --short
echo.

REM 询问是否继续
set /p CONFIRM="是否继续部署？(Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo 部署已取消
    pause
    exit /b 0
)

REM 添加所有更改的文件
echo.
echo %YELLOW%2. 添加所有更改的文件...%NC%
git add .
if %errorlevel% neq 0 (
    echo %RED%错误：添加文件失败%NC%
    pause
    exit /b 1
)
echo %GREEN%文件添加成功%NC%

REM 检查是否有需要提交的内容
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo %YELLOW%没有需要提交的更改%NC%
    goto :PUSH
)

REM 获取提交信息
echo.
set /p COMMIT_MSG="请输入提交信息（留空使用默认信息）："
if "%COMMIT_MSG%"=="" (
    set "COMMIT_MSG=更新项目代码和文档 - %date:~0,4%-%date:~5,2%-%date:~8,2% %time:~0,2%:%time:~3,2%:%time:~6,2%"
)

REM 提交更改
echo.
echo %YELLOW%3. 提交更改...%NC%
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo %RED%错误：提交失败%NC%
    pause
    exit /b 1
)
echo %GREEN%提交成功%NC%

:PUSH
REM 推送到远程仓库
echo.
echo %YELLOW%4. 推送到远程仓库...%NC%
git push origin main
if %errorlevel% neq 0 (
    echo %RED%错误：推送失败，请检查网络连接和仓库权限%NC%
    echo %YELLOW%提示：如果是因为远程分支有更新，请先执行 git pull%NC%
    pause
    exit /b 1
)
echo %GREEN%推送成功%NC%

REM 显示最终状态
echo.
echo %GREEN%========================================%NC%
echo %GREEN%  部署完成！%NC%
echo %GREEN%========================================%NC%
echo.
echo %YELLOW%当前Git状态：%NC%
git status --short
echo.

pause
endlocal

