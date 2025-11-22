import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

export default function Index() {

  const [description, setDescription]  = useState("");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

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
