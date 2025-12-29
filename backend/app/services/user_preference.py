import csv
import os
import tempfile

async def create_preferences():
    pass

def add_user_preference(restaurant, action):
    # types
    # price_levels

    # temp it will be based on only right swipes
    if (action == "dislikes"): return

    src = '../../data/preferences.csv'

    with open(src, 'r', newline='') as in_file, \
        tempfile.NamedTemporaryFile('w', delete=False, newline='') as out_file:

        reader = csv.reader(in_file)
        writer = csv.writer(out_file)

        for row in reader:
            if row[1] == "type" and row[2] in restaurant["types"]:
                row[3] = str(int(row[3]) + 1)
            writer.writerow(row)

    os.replace(out_file.name, src)

res = {
    "types": ["japanese", "asian", "seafood"],
    "price_level": 4
}

# add_user_preference(res, "like")