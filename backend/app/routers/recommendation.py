from fastapi import APIRouter
from app.services import recommendation
from app.models.restaurant import Restaurant 
from app.models.user_preference import UserPreferences 

router = APIRouter(prefix="/api/recommendations", tags=["Recommendation"])

@router.get("/")
async def get_recommendations(user_preferences: UserPreferences, lat: float, lng: float):
    return await recommendation.get_recommendations(user_preferences, lat, lng)