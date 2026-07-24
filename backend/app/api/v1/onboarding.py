from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from supabase import Client
from app.infrastructure.supabase.client import get_supabase_client
from app.dependencies.auth import get_current_user_id
import datetime

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

class OnboardingSubmitRequest(BaseModel):
    education: str = Field(..., description="User's primary field of study")
    subjects: List[str] = Field(..., description="List of subjects currently being studied")
    primaryGoals: List[str] = Field(..., description="Achievement goals for using Mr Owl AI")
    heardFrom: str = Field(..., description="Referral channel source")
    interests: List[str] = Field(default=[], description="User's interests outside of studies")
    learningStyles: List[str] = Field(..., description="User's preferred learning methods")
    dailyStudyTime: str = Field(..., description="Selected daily study duration target")
    nextExam: Optional[str] = Field(default=None, description="Optional exam date string in YYYY-MM-DD format")
    dashboardFocus: str = Field(..., description="Initial home view focus selection")

@router.post("/submit", status_code=status.HTTP_200_OK)
def submit_onboarding(
    payload: OnboardingSubmitRequest,
    user_id: str = Depends(get_current_user_id),
    supabase_client: Client = Depends(get_supabase_client)
):
    """
    Submits onboarding responses using PostgreSQL RPC procedure,
    or falls back to direct table upserts if stored procedure is absent in Supabase schema.
    """
    params = {
        "p_user_id": user_id,
        "p_education": payload.education,
        "p_subjects": payload.subjects,
        "p_primary_goals": payload.primaryGoals,
        "p_heard_from": payload.heardFrom,
        "p_interests": payload.interests,
        "p_learning_styles": payload.learningStyles,
        "p_daily_study_time": payload.dailyStudyTime,
        "p_next_exam": payload.nextExam if payload.nextExam else None,
        "p_dashboard_focus": payload.dashboardFocus
    }

    # 1. Attempt PostgreSQL stored procedure RPC execution
    try:
        response = supabase_client.rpc("submit_onboarding", params).execute()
        if response and response.data:
            return {"success": True}
    except Exception:
        # Stored procedure function absent in PostgreSQL schema cache; fallback to direct upsert
        pass

    # 2. Fallback Direct Supabase Table Operations
    try:
        study_map = {
            "30_min": (30, 0.5),
            "1_hour": (60, 1.0),
            "2_hours": (120, 2.0),
            "4_hours": (240, 4.0),
            "6_plus_hours": (360, 6.0),
        }
        goal_mins, goal_hrs = study_map.get(payload.dailyStudyTime, (30, 0.5))

        # Update user_onboarding
        supabase_client.table("user_onboarding").upsert({
            "user_id": user_id,
            "education": payload.education,
            "primary_goal": ", ".join(payload.primaryGoals) if payload.primaryGoals else "",
            "heard_from": payload.heardFrom,
            "interests": payload.interests,
            "subjects": payload.subjects,
            "next_exam": payload.nextExam if payload.nextExam else None,
            "completed": True,
            "completed_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        }).execute()

        # Update profiles
        supabase_client.table("profiles").upsert({
            "id": user_id,
            "profile_completion": 100,
            "last_active_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        }).execute()

        # Update user_preferences
        supabase_client.table("user_preferences").upsert({
            "user_id": user_id,
            "learning_style": payload.learningStyles[0] if payload.learningStyles else "visual",
            "daily_study_goal": goal_mins,
            "daily_study_hours": goal_hrs,
            "dashboard_focus": payload.dashboardFocus,
        }).execute()

        return {"success": True}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit onboarding data: {str(e)}"
        )
