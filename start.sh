#!/bin/bash

# Seattle Real Estate Investment Analyzer - Startup Script

echo "🏠 Starting Seattle Real Estate Investment Analyzer..."
echo "=================================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
fi

# Start the Flask server
echo "🚀 Starting Flask server..."
echo "📍 Frontend: http://localhost:5000"
echo "🔌 API: http://localhost:5000/api/"
echo "=================================================="
echo "Press Ctrl+C to stop the server"
echo ""

python app.py 