from fastapi import APIRouter
from app.services import recommendation
from app.models import restaurant

router = APIRouter(prefix="/api/recommendations", tags=["Recommendation"])

@router.get("/")
async def get_recommendations(user_preferences: restaurant.UserPreferences, lat: float, lng: float):
    return await recommendation.get_recommendations(user_preferences, lat, lng)