@echo off
rem Serves the Drip Studio at http://localhost:8807 so "Download PNG" and "Save library" work. Close this window to stop it.
cd /d "%~dp0"
start "" "http://localhost:8807/"
python tools\serve.py 8807
