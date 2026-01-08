from app.services import google_places
from app.services import user_preference 
from app.models.user_preference import UserPreferences
from app.models.restaurant import Restaurant, RestaurantsResponse

# user_preferences: UserPreferences = {
    # 'types': {},
    # 'price_levels': {}
# }

def recommendation_score(restaurant: Restaurant, user_preferences: UserPreferences):

    type_score = 0

    # types score
    generic_types = {"restaurant", "food", "point_of_interest", "establishment", "store"}
    
    for rtype in restaurant.types:
        if rtype in generic_types:
            type_score += 0.1
        elif rtype in user_preferences["types"]:
            type_score += user_preferences["types"][rtype] # adding based on user weight
        else:
            user_cuisine_name = user_preferences["types"].keys()

            matching_weight = 0.0
            for cuisine_name in user_cuisine_name:
                if cuisine_name in rtype:
                    matching_weight = user_preferences["types"][cuisine_name]
                    break
        
            if matching_weight > 0:
                type_score += matching_weight

    price_score = user_preferences['price_levels'].get(str(restaurant.price_level), 0.0)
    
    rating_score = restaurant.rating / 5.0 if restaurant.rating else 0.5

    final_score = (
        0.70 * type_score +
        0.15 * price_score +
        0.15 * rating_score
    )

    return final_score

async def get_recommendations(restaurants, user_id):
    # restaurants = await google_places.search_nearby(lat, lng)

    user_preferences = user_preference.get_user_preferences(user_id)

    scored_restaurants = []

    for restaurant in restaurants:
        restaurant_score = {
            'restaurant': restaurant,
            'score': recommendation_score(restaurant, user_preferences)
        }
        scored_restaurants.append(restaurant_score)

    scored_restaurants.sort(key=lambda x: x['score'], reverse=True)
    sorted_restaurants = [item['restaurant'] for item in scored_restaurants]

    return RestaurantsResponse(
        restaurants = sorted_restaurants,
        count = len(scored_restaurants)
    )