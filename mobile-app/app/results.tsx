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

    const { cuisine } = useLocalSearchParams();
    const [recommendations, setRecommendations] = useState<Restaurant[]>([]);

    useEffect(() => {
        if (cuisine) {
            getRecommendations(cuisine.toString()).then(setRecommendations);
        }
    }, [cuisine]);

    return (
        <View>
            <Text>{ cuisine }</Text>

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