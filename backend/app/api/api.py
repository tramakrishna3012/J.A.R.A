from fastapi import APIRouter
from app.api.endpoints import user, resume, jobs as jobs_router, email as email_router, inbox

api_router = APIRouter()
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
api_router.include_router(jobs_router.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(email_router.router, prefix="/email", tags=["email"])
api_router.include_router(inbox.router, prefix="/inbox", tags=["inbox"])


