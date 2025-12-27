import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import * as Location from 'expo-location'
import { Restaurant, Restaurants, UserPreferences } from "@/types/swipe";
import SwipeDeck from "@/components/swipeDeck";

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.93;
const CARD_HEIGHT = height * 0.75;

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
    <View style={styles.container}>
      <SwipeDeck restaurants={restaurants} lat={lat} lng={lng} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    // justifyContent: "center",
    // alignItems: "center",
  },
});
