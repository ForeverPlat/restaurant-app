import { Restaurant } from "./swipe"

export type SwipeAction = 'like' | 'dislike'

export type SwipeDeckProps = {
    restaurants: Restaurant[]
    lat: number
    lng: number
    onSwipeComplete?: (index: number) => void
}

export type SwipeData = {
    restaurant: Restaurant
    action: SwipeAction 
}

export type CardDetails = {
  images: string[]
  description: string
}