user_likes = {
    "cuisines": {},
    "price_levels": {},
    "tags": {}
}

restaurants = {
    1: {
        "id": 1,
        "name": "Cozy Thai",
        "cuisines": ["Thai"],
        "tags": ["Quick Bite", "Spicy"],
        "price": 2,
        "rating": 4.6
    },
    2: {
        "id": 2,
        "name": "Burger Bros",
        "cuisines": ["Burgers", "American"],
        "tags": ["Fast Food"],
        "price": 1,
        "rating": 4.4
    },
    3: {
        "id": 3,
        "name": "Sushi Zen",
        "cuisines": ["Sushi", "Japanese"],
        "tags": ["Seafood"],
        "price": 3,
        "rating": 4.2
    },
    4: {
        "id": 4,
        "name": "Bean House Cafe",
        "cuisines": ["Coffee", "Bakery"],
        "tags": ["Study Spot"],
        "price": 1,
        "rating": 4.5
    },
    5: {
        "id": 5,
        "name": "Shawarma King",
        "cuisines": ["Middle Eastern"],
        "tags": ["Halal", "Quick Bite"],
        "price": 2,
        "rating": 4.3
    },
    6: {
        "id": 6,
        "name": "Pasta Palace",
        "cuisines": ["Italian"],
        "tags": ["Family"],
        "price": 2,
        "rating": 4.1
    },
    7: {
        "id": 7,
        "name": "Taco Town",
        "cuisines": ["Mexican"],
        "tags": ["Spicy", "Street Food"],
        "price": 1,
        "rating": 4.0
    },
    8: {
        "id": 8,
        "name": "Dragon Wok",
        "cuisines": ["Chinese"],
        "tags": ["Noodles"],
        "price": 2,
        "rating": 4.2
    }
}

swipes = [
    {"restaurant_id": 1, "direction": "right"},  # Thai
    {"restaurant_id": 5, "direction": "right"},  # Middle Eastern
    {"restaurant_id": 2, "direction": "right"},  # Burgers
    {"restaurant_id": 4, "direction": "right"},  # Coffee/Bakery
    {"restaurant_id": 7, "direction": "right"},  # Mexican

    {"restaurant_id": 3, "direction": "left"},   # Sushi
    {"restaurant_id": 6, "direction": "left"},   # Italian
    {"restaurant_id": 8, "direction": "left"}    # Chinese
]

def build_user_profile(swipes, restaurants):

    for swipe in swipes:

        # for revamp add for dislikes as well
        # slight decrease in score wehn things included in dislikes
        if swipe["direction"] == "right":

            restaurant = restaurants[swipe["restaurant_id"]]

            for c in restaurant["cuisines"]:
                user_likes["cuisines"][c] = user_likes["cuisines"].get(c, 0) + 1

            price = restaurant["price"]
            user_likes["price_levels"][price] = user_likes["price_levels"].get(price, 0) + 1

            for t in restaurant["tags"]:
                user_likes["tags"][t] = user_likes["tags"].get(t, 0) + 1
            

def recommendation_score(user_likes, restaurant):
    
    # would include some sort of distance scoring

    cuisine_score = sum(
        user_likes["cuisines"].get(c, 0)
        for c in restaurant["cuisines"]
    )

    price_score = user_likes["price_levels"].get(restaurant["price"], 0)
    
    tag_score = sum(
        user_likes["tags"].get(t, 0)
        for t in restaurant["tags"]
    )

    rating_score = restaurant['rating'] / 5.0

    final_score = (
        0.30 * rating_score +
        0.35 * cuisine_score +
        0.10 * price_score +
        0.25 * tag_score
    )

    return final_score

def recommend_restaurants(user_likes, restaurants):

    recs = []

    for index, restaurant in restaurants.items():
        rec = recommendation_score(user_likes, restaurant)
        recs.append((rec, restaurant))
        
    recs.sort(reverse=True, key=lambda x: x[0])

    return recs 


build_user_profile(swipes, restaurants)
print(user_likes)

recs = recommend_restaurants(user_likes, restaurants)

for score, r in recs:
    print(round(score, 3), "-", r["name"])