from app.services import google_places
from app.models.user_preference import UserPreferences
from app.models.restaurant import Restaurant

user_preferences: UserPreferences = {
    'types': {},
    'price_levels': {}
}

def recommendation_score(restaurant: Restaurant, user_preferences: UserPreferences):

    type_score = 0

    # types score
    generic_types = {"restaurant", "food", "point_of_interest", "establishment", "store"}
    
    for rtype in restaurant.types:
        if rtype in generic_types:
            type_score += 0.1
        elif rtype in user_preferences.types:
            type_score += user_preferences.types[rtype] # adding based on user weight
        else:
            user_cuisine_name = user_preferences.types.keys()

            matching_weight = 0.0
            for cuisine_name in user_cuisine_name:
                if cuisine_name in rtype:
                    matching_weight = user_preferences.types[cuisine_name]
                    break
        
            if matching_weight > 0:
                type_score += matching_weight

        price_score = user_preferences["price_levels"].get(restaurant.price_level, 0)

        rating_score = restaurant.rating / 5.0

    final_score = (
        0.70 * type_score +
        0.15 * price_score +
        0.15 * rating_score
    )

    return final_score

async def get_recommendations(user_preferences, lat, lng):
    restaurants = await google_places.search_nearby(lat, lng)

    scored_restaurants = []

    for restaurant in restaurants:
        restaurant_score = {
            restaurant,
            recommendation_score(restaurant, user_preferences)
        }

        scored_restaurants.append(restaurant_score)

    return scored_restaurants