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
    const [imageIndexes, setImageIndexes] = useState<Record<number, number>>({});
    const [error, setError] = useState<string | null>(null);
    // const [loading, setLoading] = useState(true);

    const renderCard = (restaurant: Restaurant, cardIndex: number) => {
      if (!restaurant) return null;
      // if no image skip card
      // if (!restaurant.images?.length) return null;

      return (
        <RestaurantCard
          restaurant={restaurant}
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
          setImageIndexes(prev => {
            const copy = { ...prev };
            delete copy[index];
            return copy;
          });
      }
    }

    // if (loading) {
    //   return (
    //     <View style={styles.container}>
    //       <ActivityIndicator size="large" />
    //     </View>
    //   );
    // }

    useEffect(() => {
      console.log("imageIndex:", imageIndexes);
    }, [imageIndexes]);

    if (error) {
      return (
        <View style={styles.container}>
          <Text>{error}</Text>
        </View>
      );
    }

    const handleTap = (cardIndex: number) => {
      const images = restaurants[cardIndex]?.images;
      if (!images || images.length <= 1) return;

      setImageIndexes(prev => ({
        ...prev,
        [cardIndex]: ((prev[cardIndex] ?? 0) + 1) % images.length,
      }));
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
          onSwipedLeft={(index) => handleSwipe(index, 'dislike')}
          onSwipedRight={(index) => handleSwipe(index, 'like')}
          onTapCard={(index) => handleTap(index)}
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