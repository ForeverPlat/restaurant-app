import React from 'react';
import { View, Text } from 'react-native';
// import { useLocationSearchParams } from 'expo-router';
import { useLocalSearchParams } from 'expo-router'
// import RestaurantDetails from './restaurantDetails';

export default function RestaurantDetailsScreen() {
    const { id } = useLocalSearchParams();

    return (
        <View>
            {/*<RestaurantDetails restaurant={restaurant} />*/}
            <Text>{id}</Text>
        </View>
    )
}
