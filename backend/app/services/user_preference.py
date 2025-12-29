import csv
import os
import tempfile
from pathlib import Path

async def create_preferences():
    pass

def add_user_preference(restaurant, action):
    # types
    # price_levels

    # temp it will be based on only right swipes
    # => UPDATE LATER
    if (action == "dislike"): return

    src = Path('data/preferences.csv')
    src.parent.mkdir(parents=True, exist_ok=True) 

    VALID_PRICE_LEVELS = {"1", "2", "3", "4"}

    price_level = getattr(restaurant, "price_level", None)

    if price_level not in VALID_PRICE_LEVELS:
        price_level = None

    existing_types = set()
    existing_price_levels = set()
    updated_rows = []

    if src.exists():
        with open(src, "r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # types
                if row["category"] == "type":
                    existing_types.add(row["value"])
                    if row["value"] in restaurant.types:
                        row["count"] = str(int(row["count"]) + 1)

                # price levels
                elif row["category"] == "price_level" and price_level is not None:
                    existing_price_levels.add(row["value"])
                    if row["value"] == price_level:
                        row["count"] = str(int(row["count"]) + 1)

                updated_rows.append(row)
    
    # find new types not in csv
    new_types = set(restaurant.types) - existing_types

    # add missing types
    for t in new_types:
        updated_rows.append({
            "user_id": 1,
            "category": "type",
            "value": t,
            "count": "1"
        })

    # add missing price level
    if price_level is not None and price_level not in existing_price_levels:
        updated_rows.append({
            "user_id": 1,
            "category": "price_level",
            "value": price_level,
            "count": "1"
        })

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

