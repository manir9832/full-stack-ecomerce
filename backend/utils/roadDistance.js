// const axios = require("axios");

// const getRoadDistance = async (
//     sellerLatitude,
//     sellerLongitude,
//     customerLatitude,
//     customerLongitude
// ) => {
//     try {
//         const url =
//             `https://router.project-osrm.org/route/v1/driving/` +
//             `${sellerLongitude},${sellerLatitude};` +
//             `${customerLongitude},${customerLatitude}` +
//             `?overview=false`;

//         const response = await axios.get(url);

//         if (
//             response.data.code !== "Ok" ||
//             !response.data.routes ||
//             response.data.routes.length === 0
//         ) {
//             throw new Error("Unable to calculate road distance");
//         }

//         // OSRM distance = meters
//         const distanceMeters =
//             response.data.routes[0].distance;

//         // Convert meters → kilometers
//         const distanceKm =
//             distanceMeters / 1000;

//         return Number(distanceKm.toFixed(2));

//     } catch (error) {
//         console.error(
//             "Road Distance Error:",
//             error.message
//         );

//         throw new Error(
//             "Unable to calculate road distance"
//         );
//     }
// };

// module.exports = getRoadDistance;
























const axios = require("axios");

const getRoadDistance = async (
  sellerLatitude,
  sellerLongitude,
  customerLatitude,
  customerLongitude
) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // ১. গুগল ডিসট্যান্স মেট্রিক্স এপিআই ট্রাই করা
  if (apiKey) {
    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${sellerLatitude},${sellerLongitude}&destinations=${customerLatitude},${customerLongitude}&mode=driving&key=${apiKey}`;

      const response = await axios.get(googleUrl);
      const data = response.data;

      if (
        data.status === "OK" &&
        data.rows?.[0]?.elements?.[0]?.status === "OK"
      ) {
        const distanceMeters = data.rows[0].elements[0].distance.value;
        const distanceKm = distanceMeters / 1000;
        return Number(distanceKm.toFixed(2));
      }
    } catch (gErr) {
      console.warn("Google Maps Distance API warning, switching to fallback:", gErr.message);
    }
  }

  // ২. ওএসআরএম (OSRM) ফলব্যাক
  try {
    const osrmUrl =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${sellerLongitude},${sellerLatitude};` +
      `${customerLongitude},${customerLatitude}` +
      `?overview=false`;

    const response = await axios.get(osrmUrl);

    if (
      response.data?.code === "Ok" &&
      response.data?.routes &&
      response.data.routes.length > 0
    ) {
      const distanceMeters = response.data.routes[0].distance;
      return Number((distanceMeters / 1000).toFixed(2));
    }
  } catch (osrmErr) {
    console.warn("OSRM Distance API warning:", osrmErr.message);
  }

  // ৩. সরাসরি ইউক্লিডিয়ান (Haversine) নিরাপদ ফলব্যাক
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // পৃথিবীর ব্যাসার্ধ (কিমি)
  const dLat = toRad(customerLatitude - sellerLatitude);
  const dLon = toRad(customerLongitude - sellerLongitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(sellerLatitude)) *
      Math.cos(toRad(customerLatitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const fallbackKm = R * c * 1.25; // রোড ফ্যাক্টর

  return Number(fallbackKm.toFixed(2));
};

module.exports = getRoadDistance;