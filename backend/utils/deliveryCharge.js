// const calculateDeliveryCharge = (distanceKm) => {
//     if (distanceKm <= 2) {
//         return 10;
//     }

//     if (distanceKm <= 5) {
//         return 20;
//     }

//     if (distanceKm <= 8) {
//         return 30;
//     }

//     if (distanceKm <= 12) {
//         return 40;
//     }

//     if (distanceKm <= 15) {
//         return 50;
//     }

//     return 60;
// };

// module.exports = calculateDeliveryCharge;
















/**
 * ডেলিভারি চার্জ ক্যালকুলেশন স্ল্যাব:
 * 0 - 2 km   => ₹20
 * 2 - 5 km   => ₹30
 * 5 - 8 km   => ₹40
 * 8 - 12 km  => ₹50
 * 12 - 15 km => ₹60
 * 15 km+     => ₹60 + প্রতি কিমিতে ₹10
 */
const calculateDeliveryCharge = (distanceKm) => {
  const dist = Number(distanceKm) || 0;

  if (dist <= 2) {
    return 20;
  } else if (dist <= 5) {
    return 30;
  } else if (dist <= 8) {
    return 40;
  } else if (dist <= 12) {
    return 50;
  } else if (dist <= 15) {
    return 60;
  } else {
    return 60 + Math.ceil(dist - 15) * 10;
  }
};

module.exports = calculateDeliveryCharge;