import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import * as Haptics from 'expo-haptics';
import Swiper from 'react-native-deck-swiper';
import { Restaurant } from "@/types/swipe";
import { SwipeDeckProps } from "@/types/swipeDeck";
import RestaurantCard from "./restaurantCard";

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.93;
const CARD_HEIGHT = height * 0.75;

const url = process.env.EXPO_PUBLIC_BACKEND_URL

export default function SwipeDeck({ restaurants, lat, lng, onSwipeComplete }: SwipeDeckProps) {
    const [error, setError] = useState<string | null>(null);
    const [cardImages, setCardImages] = useState<Record<string, string[]>>({});
    const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
    const [initialLoading, setInitialLoading] = useState(true);
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
        if (action === 'like') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // will later need to send in the users or something
        // need to create endpoint
        console.log(restaurants[index]);
        console.log(action);
        
        
        const res = await fetch(`${url}/api/restaurants/swipe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            restaurant: restaurants[index],
            action
          })
        });

        if (res.ok && onSwipeComplete) {
          onSwipeComplete(index);
        }

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
          throw new Error("Failed to fetch images");
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
      const loadInitialImages = async () => {
        if (restaurants.length > 0) {
          
          // we wait for the first card images before loading swiper
          await getImages(restaurants[0]);

          const cardsToPreload = Math.min(3, restaurants.length);
          for (let i = 1; i < cardsToPreload; i++) {
            getImages(restaurants[i]); // we dont wait for these
          }

          setInitialLoading(false);
        }
      }

      loadInitialImages();
    }, [restaurants])

    // if (loading) {
    //   return (
    //     <View style={styles.container}>
    //       <ActivityIndicator size="large" />
    //     </View>
    //   );
    // }

    if (initialLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

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
            const next1 = restaurants[index + 1];
            const next2 = restaurants[index + 2];
            if (next1) getImages(next1);
            if (next2) getImages(next2);
          }}
          onSwipedLeft={(index) => handleSwipe(index, 'dislike')}
          onSwipedRight={(index) => handleSwipe(index, 'like')}
          cardHorizontalMargin={0}
          containerStyle={{ flex: 1 }}
          cardStyle={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
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
    backgroundColor: "#f8f8f8",
    // justifyContent: "center",
    // alignItems: "center",
  },
});