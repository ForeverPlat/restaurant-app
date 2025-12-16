from app.services import google_places
from app.models.user_preference import UserPreferences
from app.models.restaurant import Restaurant

user_preferences: UserPreferences = {
    'types': {},
    'price_levels': {}
}

def recommendation_score(restaurant: Restaurant, user_preferences: UserPreferences):

    score = 0

    generic_types = {"restaurant", "food", "point_of_interest", "establishment", "store"}
    
    for rtype in restaurant.types:
        if rtype in generic_types:
            score += 0.1
        elif rtype in user_preferences.types:
            score += user_preferences.types[rtype] # adding based on user weight
        else:
            user_cuisine_name = user_preferences.types.keys()

            matching_weight = 0.0
            for cuisine_name in user_cuisine_name:
                if cuisine_name in rtype:
                    matching_weight = user_preferences.types[cuisine_name]
                    break
        
            if matching_weight > 0:
                score += matching_weight




async def get_recommendations(user_preferences, lat, lng):
    restaurants = await google_places.search_nearby(lat, lng)

    scored_restaurants = []
    # recommendation logic


    return scored_restaurants