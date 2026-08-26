Write-Host "Downloading Portable Git (No admin rights required)..." -ForegroundColor Cyan
Invoke-WebRequest -Uri "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/MinGit-2.44.0-64-bit.zip" -OutFile "mingit.zip"

Write-Host "Extracting Portable Git..." -ForegroundColor Cyan
Expand-Archive -Path "mingit.zip" -DestinationPath "mingit" -Force

$git = ".\mingit\cmd\git.exe"

Write-Host "Initializing Git repository..." -ForegroundColor Cyan
& $git init
& $git add backend frontend render.yaml docker-compose.yml k8s terraform README.md

# Check if there are changes to commit before committing
$status = & $git status --porcelain
if ($status) {
    Write-Host "Committing files..." -ForegroundColor Cyan
    & $git commit -m "initial commit: full-stack airbnb clone devops project"
}

Write-Host "Setting main branch and remote origin..." -ForegroundColor Cyan
& $git branch -M main
# Remove origin if it exists to avoid errors
& $git remote remove origin 2>$null
& $git remote add origin https://github.com/sridharNaiduKompalli/airbnb-clone.git

Write-Host "======================================================" -ForegroundColor Green
Write-Host "Pushing to GitHub..." -ForegroundColor Green
Write-Host "A browser window or popup will appear asking you to sign in to GitHub." -ForegroundColor Yellow
Write-Host "Please complete the sign-in to authorize the upload." -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Green

& $git push -u origin main

Write-Host "Upload complete! You can now check your GitHub repository." -ForegroundColor Green
