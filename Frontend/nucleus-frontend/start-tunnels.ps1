Start-Process powershell -ArgumentList 'ngrok http 8080' -NoNewWindow
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList 'ngrok http 3000' -NoNewWindow
