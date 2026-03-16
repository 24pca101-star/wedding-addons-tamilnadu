# Startup Script for Wedding Add-Ons PSD System

function Stop-ProcessOnPort($port) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
    if ($process) {
        Write-Output "Stopping process on port $port..."
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
    }
}

Write-Output "Cleaning up ports (3000, 5005, 5199)..."
Stop-ProcessOnPort 3000
Stop-ProcessOnPort 5005
Stop-ProcessOnPort 5199

Write-Output "Starting Node.js PSD Service (Port 5005)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/psd-node; `$env:PORT=5005; node --max-old-space-size=4096 server.js"

Write-Output "Starting .NET PSD Export Service (Port 5199)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/psd-dotnet/PsdEditorApi; dotnet run --urls http://localhost:5199"

Write-Output "Starting Frontend Development Server (Port 3000)..."
npm run dev
