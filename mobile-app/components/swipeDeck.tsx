import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Swiper from 'react-native-deck-swiper';
import { Restaurant } from "@/types/swipe";
import { SwipeDeckProps } from "@/types/swipeDeck";
import RestaurantCard from "./restaurantCard";

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.93;
// const CARD_HEIGHT = height * 0.75;

const url = process.env.EXPO_PUBLIC_BACKEND_URL

export default function SwipeDeck({ restaurants, lat, lng }: SwipeDeckProps) {
    const [error, setError] = useState<string | null>(null);
    const [cardImages, setCardImages] = useState<Record<string, string[]>>({});
    const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
    // const [loading, setLoading] = useState(true);

    const renderCard = (restaurant: Restaurant) => {
      if (!restaurant) return null;
      // if no image skip card
      // if (!restaurant.images?.length) return null;

      // const images = cardImages.get()

      return (
        <RestaurantCard
          restaurant={restaurant}
          images={cardImages[restaurant.id]}
          lat={lat}
          lng={lng}
        />
      );
    };

    const handleSwipe = async (index: number, action: 'like' | 'dislike') => {
      try {
        // // will later need to send in the users or something
        // // need to create endpoint
        // const res = await fetch(`${url}/api/user_preferences/save-swipe`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     restaurant: restaurants[index],
        //     action
        //   })
        // });

      } catch (error) {
        setError("Something went wrong");
        console.error(error);
      } finally {
        // setLoading(false);
      }
    }

    const getImages = async (restaurant: Restaurant) => {
      const id = restaurant.id;

      if (cardImages[id]) return;
      if (loadingImages[id]) return;

      // mark as loading
      setLoadingImages((prev) => ({
        ...prev,
        [id]: true 
      }));

      try {
        const res = await fetch(`${url}/api/restaurants/details/${restaurant.id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        
        const result = await res.json();

        setCardImages((prev) => ({
          ...prev,
          [restaurant.id]: result.images
        }));
      } catch (error) {
        setError("Error fetching images")
      } finally {
        setLoadingImages((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    }

    useEffect(() => {
      if (restaurants.length > 0) {
        getImages(restaurants[0]);
      }
    }, [restaurants]);

    // if (loading) {
    //   return (
    //     <View style={styles.container}>
    //       <ActivityIndicator size="large" />
    //     </View>
    //   );
    // }

    if (error) {
      return (
        <View style={styles.container}>
          <Text>{error}</Text>
        </View>
      );
    }

    return (
      <View>
        <Swiper
          cards={restaurants}
          renderCard={renderCard}
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={12}
          swipeBackCard
          showSecondCard
          verticalSwipe={false}
          onSwiped={(index) => {
            const next = restaurants[index + 1];
            if (next) getImages(next)
          }}
          onSwipedLeft={(index) => handleSwipe(index, 'dislike')}
          onSwipedRight={(index) => handleSwipe(index, 'like')}
          cardHorizontalMargin={0}
          containerStyle={{ flex: 1 }}
          cardStyle={{
            top: height * 0.025,
            left: (width - CARD_WIDTH) / 2,
          }}
        />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    // justifyContent: "center",
    // alignItems: "center",
  },
});