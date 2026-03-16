# Startup Script for Wedding Add-Ons PSD System

Write-Output "Starting Node.js PSD Service (Port 5005)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/psd-node; node --max-old-space-size=4096 server.js"

Write-Output "Starting .NET PSD Export Service (Port 5199)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/psd-dotnet/PsdEditorApi; dotnet run --urls http://localhost:5199"

Write-Output "Starting Frontend Development Server (Port 3000)..."
npm run dev
