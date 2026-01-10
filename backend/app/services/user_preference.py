import csv
import os
import tempfile
from pathlib import Path
from app.models.user_preference import UserPreferences


async def create_preferences():
    pass

def get_user_preferences(user_id: int = 1):
    """Read user preferences from CSV and convert to UserPreferences format"""
    preferences: UserPreferences = {
        'types': {},
        'price_levels': {}
    }
    
    csv_path = Path('data/preferences.csv')
    
    if not csv_path.exists():
        return preferences
    
    type_counts = {}
    price_counts = {}
    
    with open(csv_path, 'r', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if int(row['user_id']) != user_id:
                continue
                
            category = row['category']
            value = row['value']
            count = int(row['count'])
            
            if category == 'type':
                type_counts[value] = count
            elif category == 'price_level':
                price_counts[value] = count
    
    # convert counts to weights
    if type_counts:
        max_type_count = max(type_counts.values())
        
        # research dictionary comprehension later (slight speed imporvement)
        for cuisine_type, count in type_counts.items():
            normalized_weight = count / max_type_count
            preferences['types'][cuisine_type] = normalized_weight

    if price_counts:
        max_price_count = max(price_counts.values())
        
        for price_level, count in price_counts.items():
            normalized_weight = count / max_price_count
            preferences['price_levels'][price_level] = normalized_weight
    
    return preferences

def add_user_preference(swipes):
    src = Path('data/preferences.csv')
    src.parent.mkdir(parents=True, exist_ok=True) 

    VALID_PRICE_LEVELS = {"1", "2", "3", "4"}

    existing_types = set()
    existing_price_levels = set()
    updated_rows = []

    if src.exists():
        with open(src, "r", newline="") as f:
            reader = csv.DictReader(f)
            updated_rows = list(reader)
            for row in updated_rows:
                # types
                if row["category"] == "type":
                    existing_types.add(row["value"])
                # price levels
                elif row["category"] == "price_level":
                    existing_price_levels.add(row["value"])

    for swipe in swipes:
        # types
        # price_levels

        # temp it will be based on only right swipes
        # => UPDATE LATER
        if (swipe.action == "dislike"): continue 

        price_level = getattr(swipe.restaurant, "price_level", None)

        if price_level not in VALID_PRICE_LEVELS:
            price_level = None

       # Update counts for types
        for restaurant_type in swipe.restaurant.types:
            found = False
            for row in updated_rows:
                if row["category"] == "type" and row["value"] == restaurant_type:
                    row["count"] = str(int(row["count"]) + 1)
                    found = True
                    break
            
            if not found and restaurant_type not in existing_types:
                updated_rows.append({
                    "user_id": 1,
                    "category": "type",
                    "value": restaurant_type,
                    "count": "1"
                })
                existing_types.add(restaurant_type) 

        # Update count for price_level
        if price_level is not None:
            found = False
            for row in updated_rows:
                if row["category"] == "price_level" and row["value"] == price_level:
                    row["count"] = str(int(row["count"]) + 1)
                    found = True
                    break
            
            if not found and price_level not in existing_price_levels:
                updated_rows.append({
                    "user_id": 1,
                    "category": "price_level",
                    "value": price_level,
                    "count": "1"
                })
                existing_price_levels.add(price_level)

    with tempfile.NamedTemporaryFile("w", delete=False, newline="") as temp:
        writer = csv.DictWriter(
            temp,
            fieldnames=["user_id", "category", "value", "count"]
        )
        writer.writeheader()
        writer.writerows(updated_rows)

    os.replace(temp.name, src)

    # res = {
    #     "types": ["japanese", "asian", "seafood"],
    #     "price_level": 4
    # }

    # add_user_preference(res, "like")

