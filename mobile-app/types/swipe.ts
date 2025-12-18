export type Restaurant = {
    id: string
    name: string
    types: string[]
    price_level?: number
    rating?: number // float
    images: string[]
    description?: string
    address?: string
    latitude?: number // float
    longtitude?: number // float
}

export type Restaurants = Restaurant[]

export type UserPreferences = {
    type: object
    price_levels: object
}