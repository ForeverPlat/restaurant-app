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

class RestaurantsResponse(BaseModel): 
    restaurants: List[Restaurant]
    count: int

class SwipeRequest(BaseModel):
    restaurant: Restaurant
    action: str