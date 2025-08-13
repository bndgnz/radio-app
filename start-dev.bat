@echo off
echo Killing existing Node processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1

echo Clearing Next.js cache...
if exist .next rmdir /s /q .next

echo Starting development server...
npm run dev