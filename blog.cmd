@echo off
setlocal

where.exe node.exe >nul 2>&1
if errorlevel 1 goto bundled
where.exe pnpm >nul 2>&1
if not errorlevel 1 goto run

:bundled
set "BLOG_RUNTIME=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies"
if not exist "%BLOG_RUNTIME%\node\bin\node.exe" goto missing
if not exist "%BLOG_RUNTIME%\bin\fallback\pnpm.cmd" goto missing
set "PATH=%BLOG_RUNTIME%\node\bin;%BLOG_RUNTIME%\bin\fallback;%PATH%"

:run
pushd "%~dp0" || exit /b 1
if "%~1"=="" (
  call pnpm dev
) else (
  call pnpm %*
)
set "BLOG_EXIT=%ERRORLEVEL%"
popd
exit /b %BLOG_EXIT%

:missing
>&2 echo Node.js 24 and pnpm 11 are required. See README.md for setup.
exit /b 1
