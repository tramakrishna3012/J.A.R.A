# Check if venv exists
if (-not (Test-Path "backend\venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv backend\venv
}

# Activate venv
Write-Host "Activating virtual environment..."
& ".\backend\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing dependencies..."
pip install -r backend\requirements.txt
pip install playwright
playwright install chromium

# Start Server
Write-Host "Starting J.A.R.A Backend..."
cd backend
python -m uvicorn app.main:app --reload
