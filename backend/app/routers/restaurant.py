from fastapi import APIRouter
from app.services import google_places
from app.services import save 
from app.services import user_preference
from app.models.restaurant import Restaurant
from app.models.restaurant import SwipeRequest 
from app.utils.normalize import normalize_restaurant

router = APIRouter(prefix="/api/restaurants", tags=["Restaurants"])

@router.get("/nearby")
async def get_nearby(lat: float, lng: float):
    return await google_places.search_nearby(lat, lng)

@router.get("/details/{place_id}")
async def get_details(place_id: str):
    return await google_places.get_details(place_id)

@router.get("/{id}")
async def get_restaurant(id: str):
    return await google_places.get_restaurant(id)

@router.post("/swipe")
async def handle_swipe(swipe_data: SwipeRequest):
    """Handle user swipe action (like/dislike)"""
    restaurant = normalize_restaurant(swipe_data.restaurant)

    user_preference.add_user_preference(restaurant, swipe_data.action)
    
    if swipe_data.action == "like":
        return save.restaurant_to_csv(restaurant)
    
