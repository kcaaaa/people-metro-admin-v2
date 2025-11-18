@echo off
echo 正在同步文件到docs目录...

rem 创建docs目录（如果不存在）
if not exist "docs" mkdir docs

rem 复制必要文件
copy /Y index.html docs\
copy /Y .nojekyll docs\

rem 复制文档目录以确保文档在GitHub Pages上可用
if exist "documentation" (
    echo 复制文档目录...
    xcopy /Y /E /I documentation docs\documentation
)

rem 复制js目录
if exist "js" (
    echo 复制js目录...
    xcopy /Y /E /I js docs\js
)

rem 复制vendor目录
if exist "vendor" (
    echo 复制vendor目录...
    xcopy /Y /E /I vendor docs\vendor
)

rem 复制assets目录
if exist "assets" (
    echo 复制assets目录...
    xcopy /Y /E /I assets docs\assets
)

rem 复制demo目录
if exist "demo" (
    echo 复制demo目录...
    xcopy /Y /E /I demo docs\demo
)

rem 确保README.md在docs目录中可用
if exist "README.md" (
    copy /Y README.md docs\
)

echo 同步完成！