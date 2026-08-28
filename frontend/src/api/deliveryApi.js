import API from './axiosConfig';

// =====================================
// AUTH & REGISTRATION
// =====================================

// ডেলিভারি বয় রেজিস্ট্রেশন
export const registerDeliveryBoy = (formData) => 
  API.post('/delivery-boy/register', formData);

// ডেলিভারি বয় লগইন
export const loginDeliveryBoy = (credentials) => 
  API.post('/delivery-boy/login', credentials);

// ডেলিভারি বয় লগআউট
export const logoutDeliveryBoy = () => 
  API.post('/delivery-boy/logout');

// অথেনটিকেশন চেক
export const checkDeliveryBoyAuth = () => 
  API.get('/delivery-boy/is-auth');

// =====================================
// STATUS & LOCATION
// =====================================

// অনলাইন হওয়া
export const goOnline = () => 
  API.put('/delivery-boy/online');

// অফলাইন হওয়া
export const goOffline = () => 
  API.put('/delivery-boy/offline');

// অনলাইন / অফলাইন টগল (DeliveryDashboard ইত্যাদিতে সাপোর্টের জন্য)
export const toggleDeliveryStatus = (isOnline) => {
  return isOnline ? API.put('/delivery-boy/online') : API.put('/delivery-boy/offline');
};

// রিয়েল-টাইম জিপিএস লোকেশন আপডেট
export const updateDeliveryLocation = (latitude, longitude) => 
  API.put('/delivery-boy/location', { latitude, longitude });

// =====================================
// ORDER MANAGEMENT
// =====================================

// অর্ডার গ্রহণ করা
export const acceptDeliveryOrder = (orderId) => 
  API.patch(`/delivery-boy/accept/${orderId}`);

// পার্সেল পিকড আপ মার্ক করা
export const markOrderPickedUp = (orderId) => 
  API.patch(`/delivery-boy/picked-up/${orderId}`);

// আউট ফর ডেলিভারি মার্ক করা
export const markOrderOutForDelivery = (orderId) => 
  API.patch(`/delivery-boy/out-for-delivery/${orderId}`);

// ডেলিভারড সম্পন্ন মার্ক করা
export const markOrderDelivered = (orderId) => 
  API.patch(`/delivery-boy/delivered/${orderId}`);

// ডেলিভারি বয়ের অর্ডারের তালিকা ফেচ
export const getDeliveryBoyOrders = () => 
  API.get('/delivery-boy/orders');

// =====================================
// EARNINGS
// =====================================

// মোট আয় ফেচ
export const getDeliveryBoyEarnings = () => 
  API.get('/delivery-boy/earnings');

// আজকের আয় ফেচ
export const getTodayEarnings = () => 
  API.get('/delivery-boy/today-earnings');