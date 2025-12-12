import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import Swiper from 'react-native-deck-swiper'

// temp
type Card = {
  text: string
}

const cards: Card[] = [
  { text: "hello" },
]

export default function Index() {

  const [description, setDescription]  = useState("");
  

  const renderCard = (card: Card ) => {
    <View>
      <Text>
        {card.text}
      </Text>
    </View>
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      

      <Swiper cards={cards} renderCard={renderCard} />


      <TextInput 
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

      </Button>



    </View>
  );
}
