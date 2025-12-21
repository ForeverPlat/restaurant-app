const R = 6371000 // earth radius in meters

const toRadians = (degree: number) => degree * Math.PI / 180;

export const distance = (currLat: number, currLng: number, restLat: number, restLng: number) => {
    // Haversine formula T.T
    console.log(currLat);
    console.log(currLng);
    console.log(restLat);
    console.log("rest lng "+ restLng);
    
    const dLat = toRadians(restLat - currLat);
    const dLng = toRadians(restLng - currLng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(currLat)) * Math.cos(toRadians(restLat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c =  2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c); // distance in m
}