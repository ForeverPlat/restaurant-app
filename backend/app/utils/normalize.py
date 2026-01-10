def normalize_restaurant(swipes):
    # list of maps, {restaurnt, action}

    restricted_types = {
        "restaurant",
        "food",
        "establishment",
        "point_of_interest"
    }

    for swipe in swipes:

        if hasattr(swipe.restaurant, "types") and swipe.restaurant.types:
            swipe.restaurant.types = [
                t.strip().lower()
                for t in swipe.restaurant.types
                if t.strip().lower() not in restricted_types
            ]

        if hasattr(swipe.restaurant, "price_level"):
            if swipe.restaurant.price_level is None:
                swipe.restaurant.price_level = None
            else:
                swipe.restaurant.price_level = str(swipe.restaurant.price_level)

    return swipes 
