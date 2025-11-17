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

@app.get("/recommendations") 
def get_recommendations(restaurant: Restaurant):

    name, cuisine, price_range, rating, tags, description = restaurant

    if name == "" or tags == "" or description == "":
        return "Missing params."

    restaurants = recommend_by_restaurant(restaurant)
    return restaurants