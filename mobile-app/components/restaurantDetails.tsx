import React from "react";
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const IMAGE_HEIGHT = width * 0.65;
const IMAGE_WIDTH = height * 0.33;

export default function RestauantDetails({ id }: { id: string | string[] }) {
  const handleDirections = () => {};

  const restaurant = { images: "", description: "" };

  const imageUri = restaurant.images[0];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imageUri ? { uri: imageUri } : undefined}
        style={[styles.image, !imageUri && { backgroundColor: "#111" }]}
        imageStyle={styles.imageRadius}
      >
        <Pressable style={styles.directionsButton} onPress={handleDirections}>
          <Ionicons name="navigate" size={20} color="#fff" />
        </Pressable>
      </ImageBackground>

      <Text style={styles.info}>123 Main Street · Closes 10pm</Text>
      <Text style={styles.heading}>About</Text>

      <Text style={styles.description}>{restaurant.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageRadius: {
    borderRadius: 24,
  },
  directionsButton: {
    position: "absolute",
    bottom: 14,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  info: {
    marginTop: 14,
    fontSize: 14,
    color: "#666",
  },
  heading: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
});
