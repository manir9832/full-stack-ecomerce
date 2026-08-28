// ডেলিভারি যোগ্য পিনকোডের তালিকা (ভবিষ্যতে এখানে নতুন পিনকোড যোগ করতে পারবেন)
export const ALLOWED_DELIVERY_PINCODES = [
  '743424', // বর্তমান প্রাথমিক ডেলিভারি জোন
  // '743425',
  // '700001',
];

// পিনকোড চেক করার হেল্পার ফাংশন
export const isDeliveryAvailable = (pincode) => {
  if (!pincode) return false;
  const cleanPin = pincode.toString().trim();
  return ALLOWED_DELIVERY_PINCODES.includes(cleanPin);
};

// ডিফল্ট স্টোর/কাস্টমার কোঅর্ডিনেট (743424 এর জন্য ফলব্যাক জিপিএস)
export const DEFAULT_ZONE_COORDINATES = {
  latitude: 22.5726,
  longitude: 88.3639,
};