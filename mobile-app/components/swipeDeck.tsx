import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import Swiper from 'react-native-deck-swiper';
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Restaurant } from "@/types/swipe";
import { distance } from "@/utils/distance";
import { SwipeDeckProps } from "@/types/swipeDeck";

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.93;
const CARD_HEIGHT = height * 0.75;

const url = process.env.EXPO_PUBLIC_BACKEND_URL

export default function SwipeDeck({ restaurants, lat, lng }: SwipeDeckProps) {
    const [error, setError] = useState<string | null>(null);
    // const [loading, setLoading] = useState(true);

    const renderCard = (restaurant: Restaurant) => {
      if (!restaurant) return null;
      // if no image skip card
      // if (!restaurant.images?.length) return null;

      const imageUri = restaurant.images?.[0];

      return (
        <View style={styles.card}>
          <ImageBackground
            source={imageUri ? { uri: imageUri } : undefined}
            style={[ styles.image, !imageUri && { backgroundColor: "#111" }, ]}
            imageStyle={styles.imageRadius}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.85)"]}
              locations={[0, 1]}
              style={styles.gradient}
            />

            {/* Text content */}
            <View style={styles.content}>
              <Text style={styles.name}>{restaurant.name}</Text>

              <View style={styles.row}>
                <Text style={styles.distance}>📍 { distance(lat, lng, restaurant.latitude, restaurant.longitude) } meters away</Text>
              </View>

              <Text style={styles.description}>
                {restaurant.description ?? "Small plates & seafood mains, plus cocktails & beer on tap presented in an eco-chic space."}
              </Text>
            </View>
          </ImageBackground>
        </View>
      );
    };

    const handleSwipe = async (index: number, action: 'like' | 'dislike') => {
      try {
        // will later need to send in the users or something
        // need to create endpoint
        const res = await fetch(`${url}/api/user_preferences/save-swipe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            restaurant: restaurants[index],
            action
          })
        });

      } catch (error) {
        setError("Something went wrong");
        console.error(error);
      } finally {
        // setLoading(false);
      }
    }

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
          // onSwipedLeft={(index) => handleSwipe(index, 'dislike')}
          // onSwipedRight={(index) => handleSwipe(index, 'like')}
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

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },

  image: {
    flex: 1,
    justifyContent: "flex-end",
  },

  imageRadius: {
    borderRadius: 24,
  },

  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },

  content: {
    padding: 20,
  },

  name: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  distance: {
    color: "#eee",
    fontSize: 14,
    opacity: 0.9,
  },

  description: {
    color: "#eee",
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.95,
  },
});