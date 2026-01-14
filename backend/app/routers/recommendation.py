from fastapi import APIRouter
from pydantic import BaseModel 
from typing import List, Optional
from app.services import recommendation
from app.models.restaurant import Restaurant, Restaurants 
from app.models.user_preference import UserPreferences 

router = APIRouter(prefix="/api/recommendations", tags=["Recommendation"])

class RecommendationRequest(BaseModel):
    restaurants: List[Restaurant]
    user_id: int = 1  # default to user 1 for now
    

@router.post("")
async def get_recommendations(request: RecommendationRequest): # eventyally send in user id as well so u get a specific user preferences
    return await recommendation.get_recommendations(request.restaurants, request.user_id)