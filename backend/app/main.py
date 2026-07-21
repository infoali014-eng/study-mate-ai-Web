from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.onboarding import router as onboarding_router

app = FastAPI(
    title="StudyMate AI",
    description="Learn Smarter. Revise Faster. Prepare Better.",
    version="0.1.0",
)

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(onboarding_router, prefix="/api/v1")
