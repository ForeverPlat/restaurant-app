from fastapi import FastAPI
from pydantic import BaseModel

from recommender.recommend import recommend_by_restaurant 

# http://127.0.0.1:8000/docs#/default/
app = FastAPI()

class Restaurant(BaseModel):
    name: str
    cuisine: str
    price_range: str
    rating: float
    tags: str
    description: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/recommendations") 
def get_recommendations(restaurant: Restaurant):

    name = restaurant.name
    cuisine = restaurant.cuisine
    price_range = restaurant.price_range
    rating = restaurant.rating
    tags = restaurant.tags
    description = restaurant.description
    
    if name == "" or tags == "" or description == "":
        return "Missing params."

    restaurants = recommend_by_restaurant(restaurant.dict())
    return restaurants