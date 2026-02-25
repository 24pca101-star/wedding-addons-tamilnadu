# Startup Script for Wedding Add-Ons PSD System

echo "Starting Node.js PSD Service (Port 5001)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/psd-node; node --max-old-space-size=4096 server.js"

echo "Starting .NET PSD Export Service (Port 5199)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/psd-dotnet/PsdEditorApi; dotnet run --urls http://localhost:5199"

echo "Starting Frontend Development Server (Port 3000)..."
npm run dev
