from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class Restaurant(BaseModel):
    id: str
    name: str
    types: List[str] = Field(default_factory=list) # tags and cuisine
    price_level: Optional[int] = Field(None, ge=0, le=4)
    rating: Optional[float] = Field(None, ge=0, le=5)
    images: List[str] = Field(default_factory=list)
    description: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

Restaurants = List[Restaurant]
# class Restaurants(BaseModel):
    # restaurants: List[Restaurant]

class RestaurantsResponse(BaseModel): 
    restaurants: List[Restaurant]
    count: int

class Swipe(BaseModel):
    restaurant: Restaurant
    action: str

# SwipeRequest = List[SwipeData]
class SwipeRequest(BaseModel):
    swipes: List[Swipe]

class SavedRestaurant(BaseModel):
    id: str
    name: str
    price_level: Optional[int] = None
    rating: Optional[float] = None
    images: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None