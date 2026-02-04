#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies with CPU-only PyTorch to save space (Critical for Render Free Tier)
pip install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Install Playwright browsers (Chromium only to save space)
playwright install chromium
