import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native'
import React from 'react'
import { SavedCardProps } from '@/types/saved';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { distance } from '@/utils/distance';
import RestaurantDetails from './restaurantDetails';

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.93;
const CARD_HEIGHT = height * 0.33;

export default function SavedCard({ restaurant, lat, lng }: SavedCardProps) {

  const imageUri = restaurant.images[0];
  const router = useRouter();

  const handlePress = () => {
    // return <RestaurantDetails restaurant={restaurant} />
    router.push({
        pathname: '/restaurant/[id]',
        params: {
            id: restaurant.id
        },
    });
  }

  return (
    <View style={styles.card}>
      <Pressable 
        onPress={handlePress}
        style={({ pressed }) => [ // temp press response
            { flex: 1 },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
      >
        <ImageBackground
          source={imageUri ? {uri: imageUri} : undefined} 
          style={[ styles.image, !imageUri && {  backgroundColor: "#111"  } ]}
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
          </View>

        </ImageBackground>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
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
    marginBottom: 12
  },
  image: {
    flex: 1,
    justifyContent: "flex-end"
  },
  imageRadius: {
    borderRadius: 24
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
  },
  content: {
    padding: 20,
  },
  name: {
    color: "#fff",
    fontSize: 22,
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
});
