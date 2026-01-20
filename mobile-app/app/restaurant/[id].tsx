import React from "react";
import { View, Text } from "react-native";
// import { useLocationSearchParams } from 'expo-router';
import { useLocalSearchParams } from "expo-router";
import RestauantDetails from "@/components/restaurantDetails";

export default function RestaurantDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <RestauantDetails id={id} />

      <Text>{id}</Text>
    </View>
  );
}
