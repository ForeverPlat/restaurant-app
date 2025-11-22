import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { getRecommendations } from "../utils/api";

export default function Results() {

    type Restaurant = {
        name: string,
        cuisine: string,
        priceRange: string, // this might need to be changed to price_range
        rating: number,
        tags: string,
        description: string
    }

    const { description } = useLocalSearchParams();
    const [recommendations, setRecommendations] = useState<Restaurant[]>([]);

    useEffect(() => {
        if (description) {
            getRecommendations(description.toString()).then(setRecommendations);
        }
    }, [description]);

    return (
        <View>
            <Text>{ description }</Text>

            <FlatList
                data={recommendations}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => <Text>{item.name}</Text>}
            />

            {/* {recommendations.map((recommendation, i) => (
                <Text key={i}>{recommendation.name}</Text>
            ))} */}

        </View>
    );
}