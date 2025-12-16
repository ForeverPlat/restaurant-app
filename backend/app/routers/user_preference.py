from fastapi import APIRouter

router = APIRouter(prefix='/api/user_preferences', tags=["Preferences"])

@router.get("/")
async def get_user_preference():
    return None

@router.get("")
async def add_user_preference():
    return None