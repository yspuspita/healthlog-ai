#!/bin/bash

echo "========================================="
echo "  HealthLog AI - Starting Application"
echo "========================================="
echo ""

# Check if GEMINI_API_KEY is set
if [ ! -f backend/.env ]; then
  echo "⚠️  WARNING: backend/.env not found!"
  echo "Please create backend/.env and add your GEMINI_API_KEY"
  echo ""
  exit 1
fi

# Start backend
echo "🚀 Starting Backend (FastAPI)..."
cd backend
source .venv/bin/activate
python3 main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend
echo "🚀 Starting Frontend (Vite)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=============================="
echo "  HealthLog AI - RUNNING"
echo "=============================="
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'; exit" INT
wait
