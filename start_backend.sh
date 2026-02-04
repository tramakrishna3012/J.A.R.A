#!/bin/bash
cd backend
# Check for venv
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate venv
if [[ "$OSTYPE" == "msys" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install reqs
echo "Installing dependencies..."
pip install -r requirements.txt
pip install playwright
playwright install chromium

# Run server
echo "Starting J.A.R.A Backend..."
uvicorn app.main:app --reload
