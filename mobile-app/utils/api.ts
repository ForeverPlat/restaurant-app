// const API_URL = "http://localhost:8000";
// const API_URL = "http://192.168.x.x:8000";
const API_URL = "http://192.168.1.118:8000";

type Restaurant = {
    name: string,
    cuisine: string,
    priceRange: string, // this might need to be changed to price_range
    rating: number,
    tags: string,
    description: string
}

// this will later need to accept restaurant type
export const getRecommendations = async (description: string) => {
    
    // const query = new URLSearchParams(params).toString();
    // const res = await fetch(`${API_URL}/recommendations`, {
    const res = await fetch(`${API_URL}/recommendations-by-description`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
    });

    if (!res.ok) throw new Error("API error");

    return res.json();
}