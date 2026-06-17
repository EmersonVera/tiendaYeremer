# Levanta el backend (Django) y el frontend (Vite) en sus propias ventanas de PowerShell.
$root = $PSScriptRoot

Start-Process powershell -ArgumentList @(
    '-NoExit', '-Command',
    "cd '$root\backend'; venv\Scripts\Activate.ps1; python manage.py runserver"
)

Start-Process powershell -ArgumentList @(
    '-NoExit', '-Command',
    "cd '$root\frontend'; npm run dev"
)

Write-Host "Backend en http://localhost:8000 y frontend en http://localhost:5173 abriendose en ventanas separadas..."
