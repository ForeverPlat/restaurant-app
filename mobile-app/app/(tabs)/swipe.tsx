import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import Swiper from 'react-native-deck-swiper'
import * as Location from 'expo-location'
import { Restaurant, Restaurants, UserPreferences } from "@/types/swipe";
import { ImageBackground } from "expo-image";

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

const url = process.env.EXPO_PUBLIC_BACKEND_URL

export default function Swipe() {
  const [restaurants, setRestaurants] = useState<Restaurants>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState(0.0);
  const [lng, setLng] = useState(0.0);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>();
  
  const getRecommendations = async () => {
    try {
      // const res = await fetch(`${url}/api/recommendations?lat=${lat}&lng=${lng}`);
      console.log("Backend URL:", url);
      console.log("Lat/Lng:", lat, lng);    
      console.log("Fetching from:", `${url}/api/restaurants/nearby?lat=${lat}&lng=${lng}`);

      const res = await fetch(`${url}/api/restaurants/nearby?lat=${lat}&lng=${lng}`);

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const result = await res.json();
      setRestaurants(result.restaurants);

      // console.log("Fetched restaurants:", result.restaurants.length);
      // console.log("First fetched restaurant:", result.restaurants[0]);
    } catch (error) {
      setError("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("Restaurants updated:", restaurants.length);
  }, [restaurants]);

  // maybe runs every x # of swipes
  // referecne notes
  useEffect(() => {
    if (!lat || !lng) return;
    getRecommendations();
  }, [lat, lng]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false)
        return
      }

      const currLocation = await Location.getCurrentPositionAsync({});
      // setLat(currLocation.coords.latitude);
      // setLng(currLocation.coords.longitude);
      // testing using calgary
      setLat(51.0447);
      setLng(-114.0719);
    })();
  }, []);

  // card
  const renderCard = (restaurant: Restaurant) => {
    if (!restaurant) return null;

    return (
      <ImageBackground source={{ uri: restaurant.images[0] }} style={styles.background}>
        <View style={styles.card}>
          <Text style={styles.text}>
            { restaurant.name }
            { restaurant?.description }
          </Text>
        </View>
      </ImageBackground>
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
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },

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
    elevation: 5,
    shadowColor: "#000",
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