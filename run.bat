@echo off
REM Navigate to your project folder
cd /d "C:\path\to\your\canteen_project"

REM Activate virtual environment (if using one)
call venv\Scripts\activate

REM Start Flask app
start cmd /k "set FLASK_APP=app.py && set FLASK_ENV=development && flask run"

REM Start ngrok for port 5000
start cmd /k "ngrok http 5000"

REM Keep the main window open
pause
