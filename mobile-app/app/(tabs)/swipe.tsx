import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import Swiper from 'react-native-deck-swiper'
import { Restaurant, Restaurants, UserPreferences } from "@/types/swipe";


const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

const url = process.env.EXPO_BACKEND_URL;

export default function Swipe() {
  const [restaurants, setRestaurants] = useState<Restaurants>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>();

  const lat = 0.0;
  const lng = 0.0;
  
  const getRecommendations = async () => {

    try {
      const res = await fetch(`${url}/api/recommendations?lat=${lat}&lng=${lng}`);

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const result = await res.json();
      setRestaurants(result);
    } catch (error) {
      setError("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // maybe runs every x # of swipes
  // referecne notes
  useEffect(() => {
    getRecommendations();
  }, [])

  // card
  const renderCard = (restaurant: Restaurant) => {
    if (!restaurant) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.text}>
          { restaurant.name }
          { restaurant?.description }
        </Text>
      </View>
    );
  }

  if (loading) {
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
    <View style={styles.container} >

      <Swiper
        cards={restaurants}
        renderCard={renderCard}
        backgroundColor="transparent"
        stackSize={2}
        stackSeparation={15}
        swipeBackCard
        showSecondCard={true}
        verticalSwipe={false}
      />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "blue",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,        // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  text: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
  },
});