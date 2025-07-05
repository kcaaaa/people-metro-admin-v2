@echo off
echo Syncing files to docs directory...

xcopy /y /s js\* docs\js\
xcopy /y index.html docs\

echo Sync completed!
pause 