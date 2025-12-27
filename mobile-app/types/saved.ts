export type SavedRestaurant = {
    id: string
    name: string
    price_level?: number | null
    rating?: number // float
    images: string[]
    latitude: number // float
    longitude: number // float
}

export type SavedRestaurants = SavedRestaurant[]

export type SavedCardProps = {
  restaurant: SavedRestaurant
  lat: number
  lng: number
};