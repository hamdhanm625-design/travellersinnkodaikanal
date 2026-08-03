@echo off
title TRAVELLERS INN TOURS AND TRAVELS - Backend Server
echo =================================================================
echo Starting Travellers Inn Kodaikanal REST API & Web Server...
echo Owner: Sulthan Ibrahim | Contact: 9894119264
echo =================================================================
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 5000
pause
