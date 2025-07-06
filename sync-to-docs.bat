@echo off
echo 正在同步文件到docs目录...

rem 创建docs目录（如果不存在）
if not exist "docs" mkdir docs

rem 复制必要文件
copy /Y index.html docs\
copy /Y .nojekyll docs\

rem 复制js目录
if exist "js" (
    xcopy /Y /E /I js docs\js
)

rem 复制vendor目录
if exist "vendor" (
    xcopy /Y /E /I vendor docs\vendor
)

rem 复制assets目录
if exist "assets" (
    xcopy /Y /E /I assets docs\assets
)

echo 同步完成！ 