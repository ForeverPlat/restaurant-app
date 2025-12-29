from fastapi import APIRouter
from app.models.restaurant import Restaurant
from app.models.user_preference import PreferenceAction
from app.services.user_preference import add_user_preference

router = APIRouter(prefix='/api/user_preferences', tags=["Preferences"])

@router.get("/")
async def get_user_preference():
    return None

# @router.post("/save-swipe")
# async def add_user_preference(restaurant: Restaurant, action: PreferenceAction):
#     return add_user_preference(restaurant, action)