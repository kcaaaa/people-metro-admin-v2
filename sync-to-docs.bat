@echo off
echo Syncing files to docs directory...

rem Create necessary directories if they don't exist
if not exist "docs\vendor" mkdir "docs\vendor"
if not exist "docs\js" mkdir "docs\js"

rem Sync JavaScript files
xcopy /y /s js\* docs\js\

rem Sync vendor files
xcopy /y /s vendor\* docs\vendor\

rem Sync index.html
xcopy /y index.html docs\

echo Sync completed!
pause 