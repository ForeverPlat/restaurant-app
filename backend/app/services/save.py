import csv
from pathlib import Path

def restaurant_to_csv(restaurant):

    src = Path('data/saved.csv')
    src.parent.mkdir(parents=True, exist_ok=True)

    # check if file is empty or has no header
    needs_header = not src.exists() or src.stat().st_size == 0

    if src.exists() and src.stat().st_size > 0:
        # check if first line is header
        with open(src, 'r', encoding='utf-8') as f:
            first_line = f.readline().strip()
            if not first_line.startswith('id,name,price_level'):
                needs_header = True

    with open(src, 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)

        if needs_header:
            writer.writerow([
                'id',
                'name',
                'price_level',
                'rating',
                'image_reference',
                'latitude',
                'longitude'
            ])

        image_ref = ''
        if restaurant.images and len(restaurant.images) > 0:
            image_url = restaurant.images[0]

            # cut everything after key=
            if '&key=' in image_url:
                image_ref = image_url.split('&key=')[0]
            else:
                image_ref = image_url

        row_data = [
            restaurant.id,
            restaurant.name,
            restaurant.price_level or '',
            restaurant.rating or '',
            image_ref,
            restaurant.latitude or '',
            restaurant.longitude or ''
        ]

        writer.writerow(row_data)
        # print(f"Restaurant '{restaurant.name}' saved to CSV")