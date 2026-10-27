"""
AegisBurn AI - FastAPI Application Backend
Provides full REST API endpoints for Semiconductor Burn-in ML Screening:
- GET  /api/health
- GET  /api/demo
- POST /api/analyze
- GET  /api/history
- POST /api/history
- GET  /api/settings
- POST /api/settings
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ml_engine import (
    generate_training_dataset,
    generate_new_components_dataset,
    run_python_ml_screening
)

app = FastAPI(
    title="AegisBurn AI - Semiconductor Early-Burn-In Screening API",
    description="Python Backend with FastAPI, NumPy, Pandas, Scikit-Learn",
    version="2.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HISTORY_FILE = "analysis_history.json"
SETTINGS_FILE = "settings.json"


def load_history() -> List[Dict[str, Any]]:
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return [
        {
            "analysis_id": "ANALYSIS #1042",
            "training_file": "training_dataset.csv (1,000 reference rows)",
            "new_file": "new_components_dataset (3).csv (1,000 device rows)",
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "components": 1000,
            "high_risk": 116,
            "status": "Completed",
            "avg_anomaly_score": 29.8
        }
    ]


def save_history(data: List[Dict[str, Any]]):
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error writing history: {e}")


def load_settings() -> Dict[str, Any]:
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "user_name": "Dr. Sarah Chen",
        "email": "s.chen@aegisburn.ai",
        "low_risk_threshold": 35,
        "medium_risk_threshold": 70,
        "missing_data_policy": "median",
        "model_profile": "rf_regressor_isolation_forest"
    }


def save_settings(data: Dict[str, Any]):
    try:
        with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error writing settings: {e}")


# Initialize active demo cache (1,000 components)
_demo_cache: Optional[Dict[str, Any]] = None


def get_or_create_demo_analysis() -> Dict[str, Any]:
    global _demo_cache
    if _demo_cache is None:
        train_data = generate_training_dataset(1000)
        new_data = generate_new_components_dataset(1000)
        screening = run_python_ml_screening(train_data, new_data)
        _demo_cache = {
            "analysis_id": "ANALYSIS #1042",
            "timestamp": datetime.utcnow().isoformat(),
            "training_filename": "training_dataset.csv (Historical Reference - 1,000 rows)",
            "new_filename": "new_components_dataset (3).csv (Unseen Batch - 1,000 DUTs)",
            "dashboard": screening["dashboard"],
            "results": screening["results"],
            "model_metrics": screening["model_metrics"],
            "batch_summaries": screening["batch_summaries"]
        }
    return _demo_cache


@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "engine": "Python FastAPI + Scikit-Learn + NumPy + Pandas",
        "python_version": "3.11",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/api/demo")
def get_demo_analysis():
    return get_or_create_demo_analysis()


class AnalyzeRequest(BaseModel):
    training_data: Optional[List[Dict[str, Any]]] = None
    new_data: Optional[List[Dict[str, Any]]] = None
    training_filename: Optional[str] = "training_dataset.csv"
    new_filename: Optional[str] = "new_components_dataset.csv"
    settings: Optional[Dict[str, Any]] = None


@app.post("/api/analyze")
def analyze_screening(req: AnalyzeRequest):
    train_rows = req.training_data if req.training_data and len(req.training_data) > 0 else generate_training_dataset(1000)
    target_rows = req.new_data if req.new_data and len(req.new_data) > 0 else generate_new_components_dataset(1000)

    user_settings = req.settings or load_settings()
    low_th = float(user_settings.get("low_risk_threshold", 35))
    med_th = float(user_settings.get("medium_risk_threshold", 70))

    screening = run_python_ml_screening(
        train_rows,
        target_rows,
        low_thresh=low_th,
        med_thresh=med_th
    )

    analysis_id = f"ANALYSIS #{int(datetime.utcnow().timestamp()) % 9000 + 1000}"
    response_data = {
        "analysis_id": analysis_id,
        "timestamp": datetime.utcnow().isoformat(),
        "training_filename": req.training_filename or "training_dataset.csv",
        "new_filename": req.new_filename or "new_components_dataset.csv",
        "dashboard": screening["dashboard"],
        "results": screening["results"],
        "model_metrics": screening["model_metrics"],
        "batch_summaries": screening["batch_summaries"]
    }

    # Record in history
    history = load_history()
    history.insert(0, {
        "analysis_id": analysis_id,
        "training_file": f"{req.training_filename or 'training.csv'} ({len(train_rows)} rows)",
        "new_file": f"{req.new_filename or 'new_components.csv'} ({len(target_rows)} rows)",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "components": len(target_rows),
        "high_risk": screening["dashboard"]["high_risk_count"],
        "status": "Completed",
        "avg_anomaly_score": screening["dashboard"]["avg_anomaly_score"]
    })
    save_history(history[:25])

    return response_data


@app.get("/api/history")
def get_history():
    return load_history()


@app.post("/api/history")
def add_history(item: Dict[str, Any] = Body(...)):
    history = load_history()
    history.insert(0, item)
    save_history(history[:25])
    return {"status": "ok", "count": len(history)}


@app.get("/api/settings")
def get_settings():
    return load_settings()


@app.post("/api/settings")
def update_settings(settings: Dict[str, Any] = Body(...)):
    current = load_settings()
    current.update(settings)
    save_settings(current)
    return current


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
