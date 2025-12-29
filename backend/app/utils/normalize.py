def normalize_restaurant(restaurant):
    restricted_types = {
        "restaurant",
        "food",
        "establishment",
        "point_of_interest"
    }

    if hasattr(restaurant, "types") and restaurant.types:
        restaurant.types = [
            t.strip().lower()
            for t in restaurant.types
            if t.strip().lower() not in restricted_types
        ]

    if hasattr(restaurant, "price_level"):
        if restaurant.price_level is None:
            restaurant.price_level = None
        else:
            restaurant.price_level = str(restaurant.price_level)

    return restaurant
