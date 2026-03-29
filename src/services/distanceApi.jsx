import axios from "axios";

const BASE_URL = "https://maps.googleapis.com/maps/api/distancematrix/json";

export const getDistance = async (origin, destination) => {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        origins: origin,
        destinations: destination,
        key: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
      },
    });

    const element = res.data.rows[0].elements[0];

    return {
      distance: element.distance.text,   // e.g. "12 km"
      duration: element.duration.text,   // e.g. "25 mins"
    };

  } catch (err) {
    console.error("Distance API error:", err);
    return { distance: "N/A", duration: "N/A" };
  }
};