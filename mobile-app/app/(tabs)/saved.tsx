import SavedCard from "@/components/savedCard";
import { SavedRestaurant, SavedRestaurants } from "@/types/saved";
import { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

const url = process.env.EXPO_PUBLIC_BACKEND_URL;
// const key = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

// const result = [
//   {
//     id: "ChIJe30EeP1vcVMRhbZcLGFdVUk",
//     name: "Fairmont Palliser",
//     price_level: null,
//     rating: 4.4,
//     images: [
//       `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=AZLasHqBNJb5r0lKqs38rxDpRcJbshoVqyiSv-YiHKXcJ8I3MYai-S55n9mq16O3QnHyxaGGi5iUGydeZOJo00aKRQFhtDmChHx1qMoXnVf65Azxhkb6qCkFk5ugTyY_yopMRV2M2kNOwbXGRFzYXH05O-ht3AJ3o-1PwRLmFMW3CTFzA5STOsy1yPOvegNcBAzBH7wY8zUUusXi7LAC3fFkpKIMW3ese6rsFyJEdGuQ37ANcCnt8AA86p7_dNS4_PdD82TkTFNp5Pa9VNk8DbIKNPZtIC55Z6cSzJk416rDQclbtqsulKhbxGlK4jgL2nmBzRnTEyBgk8U&key=${key}`,
//     ],
//     latitude: 51.04433359999999,
//     longitude: -114.0649605,
//   },
//   {
//     id: "ChIJtaQjdftvcVMRgBA5-0sfRB0",
//     name: "The Keg Steakhouse + Bar - 4th Ave",
//     price_level: 3,
//     rating: 4.5,
//     images: [
//       `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=AZLasHpYdr1kNpcAhs_NDtTn5Q1ELZnpDMtHyY8VyNBA3k4aeEO7pqBWInuIqv0Uxsxok04q1ecIPqAi7AmBL5lOOjfTw9og1bb4MIJEckq8ZG1Ij2nXLzu-9Ecm5NC2DDJ5bLNt3oNb-K-nlK1F2etvW3j5e8Sr1ViFMvi6jZgwSa8jRHomL_xJ9x-8S05Vqp59cGSbTtEDAtWnCTmcY-B7XORuJ6F3Y2fBPjxAuLamUbntSgwr3LmOIB5O3g5qVKakSLPhyf8uGnN3bD8neOycFVbHpRM3N-R78ERDefkJveP_Ce_0UahJMGtkx-7PykcXrJDiAN_lmoyR_4mW6sx5pWjE3DCH_LiLmzrvVUIBY_W6bn9KTIljl8pVj8y4P32fmp-9JaCvkv7skjANKy8YXszdwp75557r89E4AwS3qjbYBcchXHqkO3vkWMs0NtWkILur1zjvW1bNEfjRiS_utZ7YLHpEbjU8pziGu1g4Gb-BSgtbVCAOipKU134bIf79Pl925XYCo9_TxpcEVLjfxBoR21ctpF6QkoKJHwmBlwfxNZsoRmFe7cHK-BlDkykDTI_ckjLrKpfTyythhcal8FlAe8397dokM4cI9JbbUiuXeuR0ZEK0yvpVl0qCofvGBBuetA&key=${key}`,
//     ],
//     latitude: 51.0496138,
//     longitude: -114.0690093,
//   },
//   {
//     id: "ChIJITgXvv1vcVMRNv7eusdftms",
//     name: "Annabelle's Kitchen Downtown",
//     price_level: 3,
//     rating: 4.2,
//     images: [
//       `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=AZLasHrBZdcYvHXZ46NRiPKe1pxJOvEkwpVo8QpuKCp7puY5pble6xBT4johR_FkohKbnOkGkgy6w3MrtV5vOw08_bwphNRUiCW5ZWQvAPf0LrYIcf0bMxMtedznSHVUI7W9q_PQr6VgcM1SHwRkF957N7uEL1R7rmyzs3RHqY7_28tW9tLZ2Kr12oGyhoJ450z-nL7EC-rdAiwG-Tt90rWPIEbqgzxgnJhyiRfY5FW1t8AzkXPGLKiTdMeBNrLLEcIZyRN_RpJ42zlafj9e7AhFiO2ghFSqa39tSCcN5Cd0FKL-UU7RHFB9k6FZ8ZfvNdE3hb9zwmmmb3qP9y6uFVgBDtXy3jA-B0uXnQQCJdzh1AxZoiDQkyuqkdCTHdP4tXjKF2LkQAQTFW8717jSgn2LR-egOYy_FmKzULpcfGN1-OG5vyW27hCf_E4Ya7_O_5kc-BCtjq0gNCcfBlbn6242AO9fbtKwMltlTVe9cQFCIn4ES5iY6tgyQTyM3Gqhh6g-kQkkmaFtARqfi8p_vtvz8sWoxrCvZsTd6YO-OJ3w5koerizU5g77Nh1gefA2DImSPhvClIlqyoYGuuWK4cplhsF6r6cI4OLLLEXCQBfAJK8UlzbpwGKbo1a2QIDI3wyPcIVyQBwH&key=${key}`,
//     ],
//     latitude: 51.0454301,
//     longitude: -114.0638026,
//   },
//   {
//     id: "ChIJbZUHzv1vcVMRLaDykBi7I3E",
//     name: "Palomino Smokehouse",
//     price_level: 2,
//     rating: 4.4,
//     images: [
//       `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=AZLasHrmWff9wy_DoWh_WV4I7LPg67RYCoh81Y5BDH28up-3BM3KD5G_TR2mOqna5vV4iC7yBlW2i_jzFg779Ub_hcCHfOlTIoup6QT-D5EDz1rlZsGFY10K1n1vVB1eS_sS_OjCTY7k63bTU0xXEqpTbn_wEWt7Lm8bS7NI04JuRHdOPdpc6iTt_HMAvsDAjwPoIWdc5qhXSpdqL6RHdPQ4LNs9hPJ4AeiYgtYdH3XJiRWtD4lzpgK6zd7JdzPJ2yqnaqCf8jGUNdard4bp65YPSUusBAoNHNRpeGEK2JEH41T05HZp5r9_AkZCwrRLsqVx_cN0PGUr6u5AVrnmX--Dy8uljj5sP7IcMMYUIwt8MSS9QHx5Ya85sezOdWFc1gmDa3HL6IemMfi1sQPO25StvEUdVpvixtj5T_BeOHXHco-1Ea6jFGfThmkwk_d5LOrekZ6SvtIqLs9ckFKt_HCgNby08VAEYRFeeIMJzW83ChNJfTAHX45S3B76X3c4Kcp3OhwLN9a5J22mv8JquMDdJseuKXzKgFBNwZyAP_lJPnVqtsgo3nhO5fpRW2cZQxQhAudKQh242XOP1_lLlBpbZMzSkCoqJdRHdd7L67d51cIzcRST2_MmBx9LW0dkzk-D&key=${key}`,
//     ],
//     latitude: 51.04637509999999,
//     longitude: -114.063591,
//   },
//   {
//     id: "ChIJ2R7QV-RvcVMRmMTHdFL5d2A",
//     name: "Sushi Hiro Japanese Restaurant",
//     price_level: 2,
//     rating: 4.5,
//     images: [
//       `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=AZLasHplq4sIwgquRkrxu6-cwOtsmfSXnmB_D5z5fRBQV5q95UoiTWMrcYABkajaEF27lqO6FVnp4Mo6P5HpD_tNAGSGKX-3DGtexi7L0bNs_0AhvdYUNGtbqRIoNP8ruO2H_TCDF6Z3UIld7nBMIE5nApmdEDkT-BO87XB4xZUsNCudiA5AreHiCB23F7yxt0WOidoE48Dj-9e8aySzdMCDgbCgVTbP0KrJXCTm_bgSAw0waV1hwGva4-G6UqWC_anzP6QSaqiFA6hPp5_ivUg6Js3wnRbFgANfQJX7iNnHvYQK6g6N7BvrnNpxl7666ZRzPMiepPss1yox5sbx4V5eUmM-72uSHTQOgjWz9PElHsRR5wTgxtZ-_B0ZtCO0kL65USp9U_Et3MrJVRM_zsvpuX5n_cstnoHpgHytxuITHuxhOFI_FzpZ4PmMTe9Q5JC6ys5w53BTwNU3Rfrn3HP0PLBCkmfTlqOqS292B2MUrQm_TxUN-1kwzuuz6sUUFXEG0GfKmfq40zt8u-AFCEAThWmyn5NTsNmqMyx3citpY45v4Yo7SBN6Bu2tgbg-fYezIgf8ujuY_BCbc8GQJ93ZDRBs_EjHguvBqe6cgNtkVrhO4JjaP_oo4pk6Lz8coi9w&key=${key}`,
//     ],
//     latitude: 51.04866089999999,
//     longitude: -114.0777422,
//   },
// ];

export default function Saved() {
  const [savedRestaurants, setSavedRestaurants] = useState<SavedRestaurants>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState(0.0);
  const [lng, setLng] = useState(0.0);

  const getSaved = async () => {
    try {
      const res = await fetch(`${url}/api/restaurants/saved`);

      if (!res.ok) {
        throw new Error("Failed to fetch saved restaurants");
      }

      const result = await res.json();
      console.log(result);
      
      setSavedRestaurants(result);
    } catch (error) {
      setError(`Something went wrong getting saved ${error}.`);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getSaved();
    }, [])
  )
  // useEffect(() => {
    // getSaved();
  // }, []);

  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const currLocation =
        await Location.getCurrentPositionAsync({});

      // setLat(currLocation.coords.latitude);
      // setLng(currLocation.coords.longitude);

      // testing using calgary
      setLat(51.0447);
      setLng(-114.0719);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (savedRestaurants.length === 0) { // add !savedRestaurants here
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>
          No saved places yet
        </Text>
        <Text style={styles.emptySubtitle}>
          Swipe right on a restaurant to see it here
        </Text>
      </View>
    );
  }

  return (
    // <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {savedRestaurants.map(
          (restaurant: SavedRestaurant) => (
            <SavedCard
              key={restaurant.id}
              restaurant={restaurant}
              lat={lat}
              lng={lng}
            />
          )
        )}
      </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
  },
  scroll: {
    // height: "100%",
    flex: 1,
    // backgroundColor: "#000000ff"
  },
  list: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    paddingBottom: 16,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
