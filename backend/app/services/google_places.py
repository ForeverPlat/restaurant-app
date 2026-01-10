from fastapi import FastAPI, HTTPException, Query
import httpx
from app.config import GOOGLE_API_KEY
from dotenv import load_dotenv
import os
from app.models.restaurant import Restaurant, RestaurantsResponse, RestaurantDetails
from typing import List, Optional, Dict
import asyncio

PLACES_NEARBY_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
PLACE_PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo"
PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"

DETAILS_CACHE: dict[str, RestaurantDetails] = {}
PAGE_TOKEN_CACHE: dict[str, str] = {}

# helper method
def get_photo_url(photo_references: List[dict], max_photos: int = 5) -> List[str]:
    """Convert photo refrence to actual urls"""
    urls = []
    for photo in photo_references[:max_photos]:
        photo_ref = photo.get('photo_reference')

        if photo_ref:
            url = f"{PLACE_PHOTO_URL}?maxwidth=800&photo_reference={photo_ref}&key={GOOGLE_API_KEY}"
            urls.append(url)
    return urls

def build_fallback_description(result):
    types = result.get("types", [])
    if types:
        return f"A {types[0].replace('_', ' ')}"
    return None

async def get_details(place_id: str):
    """Get details of a restaurnant"""

    if place_id in DETAILS_CACHE:
        return DETAILS_CACHE[place_id]

    params = {
        "place_id": place_id,
        # "fields": "photos, editorialSummary", # check if editorialSummary is description
        "fields": "photos,editorial_summary",
        "key": GOOGLE_API_KEY,
    }

    async with httpx.AsyncClient() as client:

        try:
            response = await client.get(PLACE_DETAILS_URL, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()

            # if data.get('status') not in ['OK', 'ZERO_RESULTS']:
            #     raise HTTPException(
            #         status_code=500,
            #         detail=f"Google Place Details API error: {data.get('status')}"
            #     )

            # soft fail
            print(f"Place {place_id} status:", data.get("status"))
            if data.get("status") != "OK":
                DETAILS_CACHE[place_id] = {
                    "images": [],
                    "description": ""
                }
                # print(data.get("status"))
                return DETAILS_CACHE[place_id]

            result = data.get('result', {})

            images = get_photo_url(result.get('photos', []))
            editorial = result.get('editorial_summary', {}).get("overview")
            # reviews = result.get("reviews", [])
            # review_snippet = reviews[0]["text"] if reviews else None

            description = (
                editorial
                # or review_snippet
                or build_fallback_description(result)
            )

            details = {
                "images": images,
                "description": description or ""
            }

            DETAILS_CACHE[place_id] = details

            return details

        except httpx.HTTPError as error:
            raise HTTPException(
                status_code=500,
                detail=f"Error connecting to Google Places: {str(error)}"
            )


async def search_nearby(lat, lng, radius=1500, page_token=None):
    # google api logic to get nearby here

    if not GOOGLE_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Google Places API key not configured"
        )

    if page_token:
        params = {
            'key': GOOGLE_API_KEY,
            'pagetoken': page_token
        }
        # google requires a short delay before using page token
        await asyncio.sleep(2)
    else:
        params = {
            'location': f"{lat},{lng}",
            'radius': radius,
            'type': 'restaurant',
            'key': GOOGLE_API_KEY
        }

    restaurants = []
    next_page_token = None

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
            
            results = data.get('results', {})
            next_page_token = data.get('next_page_token')

            # store the token for this location
            if next_page_token:
                location_key = f"{lat},{lng},{radius}"
                PAGE_TOKEN_CACHE[location_key] = next_page_token

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
                    price_level = place.get('price_level'),
                    rating = place.get('rating'),
                    # images = [],
                    images = get_photo_url(photos),
                    description = None,
                    address = place.get('vicinity'),
                    latitude = location.get('lat'),
                    longitude = location.get('lng')
                )

                # if len(restaurant.images) == 1:
                    # restaurant.images = restaurant.images * 3

                restaurants.append(restaurant)
        
        except httpx.HTTPError as error:
            raise HTTPException(
                status_code=500,
                detail=f"Error connecting to Google Places: {str(error)}"
            )
    return RestaurantsResponse (
        restaurants=restaurants,
        count=len(restaurants)
    ), next_page_token
    
def get_cached_page_token(lat, lng, radius): 
    """Get the next page token for a location if it exists"""
    location_key = f"{lat},{lng},{radius}"
    return PAGE_TOKEN_CACHE.get(location_key)

async def get_restaurant(id):
    # google api logic to get restaurnat
    pass