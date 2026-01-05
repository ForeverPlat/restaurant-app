import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Restaurant } from '@/types/swipe';
import { ImageBackground } from 'expo-image';
import { distance } from '@/utils/distance';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.93;
const CARD_HEIGHT = height * 0.75;
const CARD_MIDDLE = CARD_WIDTH / 2;

export default function RestaurantCard({restaurant, lat, lng, images}: {restaurant: Restaurant, lat: number, lng: number, images: string[]}) {
    const [imageIndex, setImageIndex] = useState(0);

    // const imageUri = images[imageIndex];
    const displayImages = images?.length
        ? images
        : (restaurant.images || []);

    // for safety....
    // use effects have to be before returns or something
    useEffect(() => {
        if (imageIndex >= displayImages.length) {
            setImageIndex(0);
        }
    }, [displayImages, imageIndex]);

     // return early if no images
    if (!displayImages || displayImages.length === 0) {
        return (
          <View style={styles.card}>
            <View style={[styles.image, { backgroundColor: "#111" }]}>
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.85)"]}
                locations={[0, 1]}
                style={styles.gradient}
              />
              <View style={styles.content}>
                <Text style={styles.name}>{restaurant.name}</Text>
                <View style={styles.row}>
                  <Text style={styles.distance}>📍 {distance(lat, lng, restaurant.latitude, restaurant.longitude)} meters away</Text>
                </View>
                <Text style={styles.description}>
                  {restaurant.description ?? "Small plates & seafood mains, plus cocktails & beer on tap presented in an eco-chic space."}
                </Text>
              </View>
            </View>
          </View>
        );
    }

    const imageUri = displayImages[imageIndex];

    const handleTap = (event: any) => {
        // if (!restaurant.images || restaurant.images.length <= 1) return;
        // setImageIndex((prev) => (prev + 1) % restaurant.images.length)
        if (!displayImages || displayImages.length <= 1) return;

        const { locationX } = event.nativeEvent;
        const tapPosition = locationX;

        // left side
        if (tapPosition < CARD_MIDDLE) {
          setImageIndex(prev => 
            prev === 0 ? displayImages.length - 1 : (prev - 1) % displayImages.length
          );

        } else if (tapPosition >= CARD_MIDDLE) { // right side and middle
          setImageIndex(prev => (prev + 1) % displayImages.length);

        }

    }

    // useEffect(() => {
    //     setImageIndex(0);
    // }, [images]); 

   

  return (
    <View style={styles.card}>
        <Pressable onPress={handleTap} style={{ flex: 1 }}>
            <ImageBackground
                source={imageUri ? { uri: imageUri } : undefined}
                style={[ styles.image, !imageUri && { backgroundColor: "#111" }, ]}
                imageStyle={styles.imageRadius}
            >
                <View style={styles.imageIndexBarContainer}>
                    {displayImages.map((_, index) => (
                      <View 
                          style={[
                              styles.imageIndexBar, 
                              index === imageIndex && styles.imageIndexBarActive
                          ]}
                          key={index}
                      ></View>
                    ))}
                </View>
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
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({

  card: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },

  imageIndexBarContainer: {
    position: "absolute",
    top: 12,
    left: 16,
    right: 16,
    height: 5,
    flexDirection: "row",
    gap: 6,
    zIndex: 10
  },

  imageIndexBar: {
    flex: 1,
    height: 5,
    backgroundColor: "#ffffff4d",
    borderRadius: 2,
  },

  imageIndexBarActive: {
    backgroundColor: "#fff",
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