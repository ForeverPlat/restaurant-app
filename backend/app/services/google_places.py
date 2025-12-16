from fastapi import FastAPI, HTTPException, Query
import httpx
from app.config import GOOGLE_API_KEY
from dotenv import load_dotenv
import os
from app.models.restaurant import Restaurant, RestaurantsResponse

PLACES_NEARBY_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

async def search_nearby(lat, lng, radius=1500):
    # google api logic to get nearby here

    if not GOOGLE_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Google Places API key not configured"
        )


    params = {
        'location': f"{lat},{lng}",
        'radius': radius,
        'type': 'restaurant',
        'key': GOOGLE_API_KEY
    }

    restaurants = []

    async with httpx.AsyncClient() as client:

        try:
            response = await client.get(PLACES_NEARBY_URL, params=params, timeout=10.0) # keep an eye on the timeout
            response.raise_for_status() # checking if an error occured
            data = response.json()

            if data.get('status') not in ['OK', 'ZERO_RESULTS']:
                raise HTTPException(
                    status_code=500,
                    detail=f"Google Places API error: {data.get('status')}"
                )
            
            results = data.get('results', [])

            for place in results:
                types = place.get('types', [])
                photos = place.get('photos', [])
                geometry = place.get('geometry', {})
                location = geometry.get('location', {})

                # for description later on something like
                # description = await get_place_details(place.get('place_id'))

                restaurant = Restaurant(
                    id = place.get('place_id'),
                    name = place.get('name'),
                    types = types,
                    price_range=place.get('price_level'),
                    rating = place.get('rating'),
                    images = [],
                    # images = get_photo_url(photos), # do later
                    description = None,
                    address = place.get('vicinity'),
                    latitude = location.get('lat'),
                    longitude = location.get('lng')
                )

                restaurants.append(restaurant)
        
        except httpx.HTTPError as error:
            raise HTTPException(
                status_code=500,
                detail=f"Error connecting to Google Places: {str(error)}"
            )
    return RestaurantsResponse (
        restaurants=restaurants,
        count=len(restaurants)
    )
    
async def get_restaurant(id):
    # google api logic to get restaurnat
    pass