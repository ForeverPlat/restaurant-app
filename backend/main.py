from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.routers import restaurant, recommendation

app = FastAPI(title="Restaurant Finder API")

# like app.use() in express
app.include_router(restaurant.router)
app.include_router(recommendation.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Restaurant Finder API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
# from fastapi import FastAPI
# from pydantic import BaseModel

# from recommender.recommend import recommend_by_restaurant, recommend_by_tags, recommend_by_description

# # http://127.0.0.1:8000/docs#/default/
# app = FastAPI()

# class Restaurant(BaseModel):
#     name: str
#     cuisine: str
#     price_range: str
#     rating: float
#     tags: str
#     description: str

# class DescriptionRequest(BaseModel):
#     description: str

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}

# @app.post("/recommendations") 
# def get_recommendations(restaurant: Restaurant):

#     name = restaurant.name
#     cuisine = restaurant.cuisine
#     price_range = restaurant.price_range
#     rating = restaurant.rating
#     tags = restaurant.tags
#     description = restaurant.description
    
#     if not restaurant.name or not restaurant.tags or not restaurant.description:
#         return {"error": "Missing params."}

#     restaurants = recommend_by_restaurant(restaurant.dict())
#     return restaurants

# @app.post("/recommendations-by-description") 
# def get_recommendations_by_description(data: DescriptionRequest):

#     if not data.description or data.description.strip() == "":
#         return {"error": "Missing description parameter."}

#     restaurants = recommend_by_description(data.description)
#     return restaurants