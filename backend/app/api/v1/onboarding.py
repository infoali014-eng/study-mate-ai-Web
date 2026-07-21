from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from supabase import Client
from app.infrastructure.supabase.client import get_supabase_client
from app.dependencies.auth import get_current_user_id

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

class OnboardingSubmitRequest(BaseModel):
    education: str = Field(..., description="User's primary field of study")
    subjects: List[str] = Field(..., description="List of subjects currently being studied")
    primaryGoals: List[str] = Field(..., description="Achievement goals for using StudyMate AI")
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
    Submits onboarding responses, validating data parameters and updating
    profiles, preferences, and onboarding tables transactionally using PostgreSQL RPC.
    """
    # Map parameters to match PostgreSQL rpc signature
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

    try:
        # Call single transaction stored procedure
        response = supabase_client.rpc("submit_onboarding", params).execute()
        
        # Check if RPC execution was successful
        if not response or not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Stored transaction procedure failed to update record states."
            )
        return {"success": True}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database transaction error: {str(e)}"
        )
