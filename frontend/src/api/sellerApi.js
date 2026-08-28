import API from './axiosConfig';

// ১. সেলার রেজিস্টার (Aadhaar & Shop details)
export const registerSeller = (formData) => API.post('/api/seller/register', formData);

// ২. সেলার প্রোফাইল ইনফরমেশন
export const getSellerProfile = () => API.get('/api/seller/me');