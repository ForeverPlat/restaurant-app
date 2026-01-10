from fastapi import APIRouter
from app.services import google_places
from app.services import save 
from app.services import user_preference
from app.models.restaurant import Restaurant
from app.models.restaurant import Swipe, SwipeRequest
from app.utils.normalize import normalize_restaurant
from typing import Optional, List

router = APIRouter(prefix="/api/restaurants", tags=["Restaurants"])

@router.get("/nearby")
async def get_nearby(lat: float, lng: float, page_token: Optional[str] = None):
    result, next_token = await google_places.search_nearby(lat, lng, page_token=page_token)

    response_dict = result.dict()
    if next_token:
        response_dict['next_page_token'] = next_token
    
    return response_dict

@router.get("/saved")
async def get_saved(): # later move to user route
    """Get saved restaurants"""
    return save.csv_to_saved_restaurants();

@router.post("/swipe")
async def handle_swipe(request: SwipeRequest):
    """Handle user swipe action (like/dislike)"""
    restaurant = normalize_restaurant(request.swipes)

    user_preference.add_user_preference(request.swipes)
    
    # if swipes.action == "like":
    return save.restaurant_to_csv(request.swipes)
    
@router.get("/details/{place_id}")
async def get_details(place_id: str):
    return await google_places.get_details(place_id)

@router.get("/{id}")
async def get_restaurant(id: str):
    return await google_places.get_restaurant(id)
