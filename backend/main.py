"""HealthLog AI Backend — FastAPI Server"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import modules
import database
import agent

# Initialize FastAPI
app = FastAPI(
    title="HealthLog AI API",
    description="Backend API for HealthLog AI - Personal Health Journal with AI Assistant",
    version="1.0.0"
)

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global chat agent (lazy initialization)
chat_agent = None


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    database.init_db()
    print("✓ FastAPI server started")


# ==================== Pydantic Models ====================

class HealthLogCreate(BaseModel):
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    mood: Optional[int] = Field(None, ge=1, le=10)
    energy: Optional[int] = Field(None, ge=1, le=10)
    sleep_hours: Optional[float] = Field(None, ge=0, le=24)
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    symptoms: Optional[str] = None
    symptom_severity: Optional[int] = Field(None, ge=1, le=10)
    medications: Optional[str] = None
    exercise_type: Optional[str] = None
    exercise_mins: Optional[int] = Field(None, ge=0)
    water_ml: Optional[int] = Field(None, ge=0)
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    diet_notes: Optional[str] = None
    notes: Optional[str] = None
    weight_kg: Optional[float] = Field(None, ge=0, le=500)
    height_cm: Optional[float] = Field(None, ge=0, le=300)
    heart_rate: Optional[int] = Field(None, ge=0, le=300)


class ChatRequest(BaseModel):
    message: str
    thread_id: str = "default"


class ClearChatRequest(BaseModel):
    thread_id: str = "default"


class AnalyzeRequest(BaseModel):
    days: int = 30


class ReportRequest(BaseModel):
    period_start: str
    period_end: str


# ==================== Endpoints ====================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/logs")
async def save_log(log: HealthLogCreate):
    """Save a health log entry"""
    try:
        # Validate date format
        datetime.strptime(log.date, "%Y-%m-%d")

        success = database.save_log(log.dict())

        if success:
            return {"success": True, "date": log.date}
        else:
            raise HTTPException(status_code=500, detail="Failed to save log")

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/logs")
async def get_logs(days: int = 30):
    """Get health logs"""
    try:
        # Limit to max 90 days
        days = min(days, 90)

        logs = database.get_logs(days)
        return logs

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/logs/{date}")
async def delete_log(date: str):
    """Delete a health log entry by date"""
    try:
        # Validate date format
        datetime.strptime(date, "%Y-%m-%d")

        success = database.delete_log(date)
        if success:
            return {"success": True}
        else:
            raise HTTPException(status_code=404, detail="Log not found")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stats")
async def get_stats(days: int = 7):
    """Get health statistics"""
    try:
        stats = database.get_stats(days)
        return stats

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat with AI assistant"""
    global chat_agent

    try:
        # Get API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "PLACEHOLDER_REPLACE_WITH_REAL_KEY":
            raise HTTPException(
                status_code=500,
                detail="GEMINI_API_KEY not configured. Please set it in .env file."
            )

        # Lazy initialize agent
        if chat_agent is None:
            chat_agent = agent.create_chat_agent(api_key)

        # Get health data context
        health_data = database.get_logs_for_ai(30)

        # Save user message
        database.save_chat_message(request.thread_id, "user", request.message)

        # Run agent
        response = agent.run_chat(
            chat_agent,
            request.message,
            request.thread_id,
            health_data
        )

        # Save AI response
        database.save_chat_message(request.thread_id, "assistant", response)

        return {
            "response": response,
            "thread_id": request.thread_id
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.delete("/api/chat/clear")
async def clear_chat(request: ClearChatRequest):
    """Clear chat history"""
    try:
        database.clear_chat_history(request.thread_id)
        return {"success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    """Run pattern detection analysis"""
    try:
        # Get API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "PLACEHOLDER_REPLACE_WITH_REAL_KEY":
            raise HTTPException(
                status_code=500,
                detail="GEMINI_API_KEY not configured. Please set it in .env file."
            )

        # Get health data
        health_data = database.get_logs_for_ai(request.days)

        # Run analysis
        result = agent.run_analysis(api_key, health_data)

        return {"result": result}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


@app.post("/api/report")
async def generate_report(request: ReportRequest):
    """Generate doctor report"""
    try:
        # Get API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "PLACEHOLDER_REPLACE_WITH_REAL_KEY":
            raise HTTPException(
                status_code=500,
                detail="GEMINI_API_KEY not configured. Please set it in .env file."
            )

        # Validate dates
        start_date = datetime.strptime(request.period_start, "%Y-%m-%d")
        end_date = datetime.strptime(request.period_end, "%Y-%m-%d")

        if end_date < start_date:
            raise HTTPException(status_code=400, detail="End date must be after start date")

        # Get health data for the period
        # Note: This is a simple implementation. For production, filter by date range.
        health_data = database.get_logs_for_ai(90)

        # Generate report
        report_content = agent.run_report(
            api_key,
            health_data,
            request.period_start,
            request.period_end
        )

        # Save report
        report_id = database.save_report(
            report_content,
            request.period_start,
            request.period_end
        )

        return {
            "report": report_content,
            "id": report_id
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report error: {str(e)}")


@app.get("/api/reports")
async def get_reports(limit: int = 10):
    """Get past reports"""
    try:
        reports = database.get_reports(limit)
        return reports

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/insight")
async def get_quick_insight():
    """Get quick insight for dashboard"""
    try:
        # Get API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "PLACEHOLDER_REPLACE_WITH_REAL_KEY":
            return {"insight": "📝 Catat kesehatanmu setiap hari untuk insight yang lebih personal!"}

        # Get health data (7 days)
        health_data = database.get_logs_for_ai(7)

        # Generate insight
        insight = agent.run_quick_insight(api_key, health_data)

        return {"insight": insight}

    except Exception as e:
        # Graceful fallback
        return {"insight": "📝 Catat kesehatanmu setiap hari untuk insight yang lebih personal!"}


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle all uncaught exceptions"""
    return {
        "error": "Internal server error",
        "detail": str(exc)
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
