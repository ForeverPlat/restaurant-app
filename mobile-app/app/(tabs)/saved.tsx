import SavedCard from "@/components/savedCard";
import { SavedRestaurant, SavedRestaurants } from "@/types/saved";
import { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

const url = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function Saved() {
  const [savedRestaurants, setSavedRestaurants] = useState<SavedRestaurants>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState(0.0);
  const [lng, setLng] = useState(0.0);

  const getSaved = async () => {
    try {
      const res = await fetch(`${url}/api/restaurants/saved`);

      if (!res.ok) {
        throw new Error("Failed to fetch saved restaurants");
      }

      const result = await res.json();
      console.log(result);
      
      setSavedRestaurants(result);
    } catch (error) {
      setError(`Something went wrong getting saved ${error}.`);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getSaved();
    }, [])
  )
  // useEffect(() => {
    // getSaved();
  // }, []);

  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const currLocation =
        await Location.getCurrentPositionAsync({});

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

  if (savedRestaurants.length === 0) { // add !savedRestaurants here
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>
          No saved places yet
        </Text>
        <Text style={styles.emptySubtitle}>
          Swipe right on a restaurant to see it here
        </Text>
      </View>
    );
  }

  return (
    // <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {savedRestaurants.map(
          (restaurant: SavedRestaurant) => (
            <SavedCard
              key={restaurant.id}
              restaurant={restaurant}
              lat={lat}
              lng={lng}
            />
          )
        )}
      </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
  },
  scroll: {
    // height: "100%",
    flex: 1,
    // backgroundColor: "#000000ff"
  },
  list: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    paddingBottom: 16,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
