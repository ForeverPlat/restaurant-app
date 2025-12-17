import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Swiper from 'react-native-deck-swiper'
import * as dotenv from 'dotenv'
import { Restaurant, Restaurants } from "@/types/swipe";

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

dotenv.config()
const url = process.env.BACKEND_URL;

export default function Swipe() {

  const [restaurants, setRestaurants] = useState<Restaurants>();
  const [userPreferences, setUserPreferences] = useState();
  const lat = 0.0;
  const lng = 0.0;
  // get lat and lng using expo-location
  // Location.getCurrentPositionAsync({})
  
  const getRecommendations = async () => {

    try {
      const res = await fetch(`${url}/api/recommendations`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPreferences, lat, lng })
      });

      const result = await res.json();
      setRestaurants(result);

      if (res.ok) {

      } else {

      }

    } catch (error) {
      
    }
  }

  // maybe runs every x # of swipes
  // referecne notes
  useEffect(() => {
    (async () => {
      await getRecommendations();
    })();
  }, [])

  // card
  const renderCard = (restaurant: Restaurant) => {
    return (
      <View style={styles.card}>
        <Text style={styles.text}>
          { restaurant.name }
        </Text>
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