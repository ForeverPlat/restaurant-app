import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

export default function Index() {

  const [cuisine, setCuisine]  = useState("");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <TextInput 
        onChangeText={newCuisine => setCuisine(newCuisine)}
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

      <Text>{ cuisine }</Text>

      <Button
        title="Search"
        onPress={() => router.push(`/results?cuisine=${cuisine}`)}
      >

      </Button>



    </View>
  );
}
