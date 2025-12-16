from fastapi import APIRouter
from app.services import google_places

router = APIRouter(prefix="/api/restaurants", tags=["Restaurants"])

@router.get("/nearby")
async def get_nearby(lat: float, lng: float):
    return await google_places.search_nearby(lat, lng)

@router.get("/{id}")
async def get_restaurant(id: str):
    return await google_places.get_restaurant(id)