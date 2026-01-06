import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import * as Location from 'expo-location'
import { Restaurant, Restaurants, UserPreferences } from "@/types/swipe";
import SwipeDeck from "@/components/swipeDeck";

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.93;
const CARD_HEIGHT = height * 0.75;

const url = process.env.EXPO_PUBLIC_BACKEND_URL

const BUFFER_SIZE = 5; // need at least this much to re sort
const SWIPES_BEFORE_RESORT = 3;

export default function Swipe() {
  const [restaurants, setRestaurants] = useState<Restaurants>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState(0.0);
  const [lng, setLng] = useState(0.0);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isResorting, setIsResorting] = useState(false);
  const [lastResortIndex, setLastResortIndex] = useState(0);
  
  const getRestaurants = async () => {
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

  const getRecommendations = async (remainingRestaurants: Restaurants) => {
    try {
      const res = await fetch(`${url}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          restaurants: remainingRestaurants, // prob want to cut the restaurants before curr
          user_id: 1 // eventaully send actual user id
        })
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const result = await res.json();
      return result;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to re-sort recommendations");
      return remainingRestaurants;
    }  finally {
      setIsResorting(false);
    }
  }

  const handleSwipeComplete = async (swipedIndex: number) => {
    const newIndex = swipedIndex + 1;
    setCurrentIndex(newIndex);
    
    const remainingCards = restaurants.length - newIndex;
    const swipesSinceLastResort = newIndex - lastResortIndex;
    
    // Check if we should re-sort:
    // We have enough remaining cards to make it worthwhile
    // We've swiped enough cards since last resort
    // We're not already resorting
    if (
      remainingCards > (BUFFER_SIZE + 3) &&
      swipesSinceLastResort >= SWIPES_BEFORE_RESORT &&
      !isResorting
    ) {
      console.log(`Re-sorting: ${remainingCards} cards remaining, ${swipesSinceLastResort} swipes since last resort`);
      
      const unswiped = restaurants.slice(newIndex + 3);
      
      const result = await getRecommendations(unswiped);
      
      setRestaurants(prev => [
        ...prev.slice(0, newIndex + 3), // Keep already swiped cards
        ...result.restaurants // Replace remaining with sorted
      ]);
      
      setLastResortIndex(newIndex);
    }
    
    // eventaully something to get more
    // need to figure out what that system will look like
    // if (remainingCards < 3 && !isResorting) {
      // console.log("Running low on restaurants, fetching more...");
      // await getMoreRestaurants();
    // }
  }

  useEffect(() => {
    console.log("Restaurants updated:", restaurants.length);
  }, [restaurants]);

  // maybe runs every x # of swipes
  // referecne notes
  useEffect(() => {
    if (!lat || !lng) return;
    getRestaurants();
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
      <SwipeDeck restaurants={restaurants} lat={lat} lng={lng} onSwipeComplete={handleSwipeComplete} />
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
