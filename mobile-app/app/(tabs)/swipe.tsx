import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import Swiper from 'react-native-deck-swiper'

// temp
type Card = {
  text: string
}

// get this info from an api call
const cards: Card[] = [
  { text: "hello" },
  { text: "to" },
  { text: "the" },
  { text: "world" }
]

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

export default function Swipe() {

  // const [description, setDescription]  = useState("");

  // card
  const renderCard = (card: Card) => {
    return (
      <View style={styles.card}>
        <Text style={styles.text}>
          {card.text}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} >

      <Swiper
        cards={cards}
        renderCard={renderCard}
        backgroundColor="transparent"
        stackSize={2}
        stackSeparation={15}
        swipeBackCard
        showSecondCard={true}
        verticalSwipe={false}
      />

      {/* <TextInput 
        onChangeText={newDescription => setDescription(newDescription)}
        style={{
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          width: 200
        }}
        placeholder="Search..."
      >
      </TextInput>

      <Text>{ description }</Text>

      <Button
        title="Search"
        onPress={() => router.push(`/results?description=${description}`)}
      >
      </Button> */}
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