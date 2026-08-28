

import API from './axiosConfig';

// ১. রেজিস্ট্রেশন (নাম, ফোন, পাসওয়ার্ড) -> OTP পাঠাবে
export const registerUser = async (userData) => {
  return await API.post('/user/register', userData);
};

// ২. OTP ভেরিফিকেশন (ফোন, OTP) -> টোকেন কুকি সেট হবে
export const verifyUserOTP = async (verifyData) => {
  return await API.post('/user/verify-otp', verifyData);
};

// ৩. নতুন OTP পাঠানো (ফোন)
export const resendUserOTP = async (phone) => {
  return await API.post('/user/resend-otp', { phone });
};

// ৪. লগইন (ফোন, পাসওয়ার্ড)
export const loginUser = async (credentials) => {
  return await API.post('/user/login', credentials);
};

// ৫. লগইন চেক (Protected - আপনার রাউটের /isAuth পাথ অনুযায়ী)
export const checkUserAuth = async () => {
  return await API.get('/user/isAuth');
};

// ৬. লগআউট (Protected)
export const logoutUser = async () => {
  return await API.post('/user/logout');
};

// ৭. ইউজার লোকেশন আপডেট (Protected - আপনার রাউটের PUT /location অনুযায়ী)
export const updateUserLocation = async (coords) => {
  return await API.put('/user/location', coords);
};