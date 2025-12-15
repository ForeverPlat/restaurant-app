from app.services import google_places

async def get_recommendations(user_preferences, lat, lng):
    restaurants = await google_places.search_nearby(lat, lng)

    scored_restaurants = []
    # recommendation logic
    return scored_restaurants