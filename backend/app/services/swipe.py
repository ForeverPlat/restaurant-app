import csv

def save_swipe(restaurant, action):
    if (action == "dislike"): return

    src = '../../data/saved.csv'

    with open(src, 'w', newline='') as file:
        # writer = csv.writer(file)
        fieldnames = ['id', 'name', 'price_level', 'rating', 'image', 'latitude', 'longitude']
        writer = csv.DictWriter(file)
        writer.writerow(restaurant)

def get_saved():
    src = '../../data/saved.csv'

    data = []
    with open(src, 'r', newline='') as file:
        reader = csv.DictReader(file)

        for row in reader:
            data.append(row)

    return data