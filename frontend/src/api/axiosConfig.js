

import axios from 'axios';

const API = axios.create({
  // ব্যাকএন্ড পোর্ট ৪০০০ (index.js অনুসারে) নিশ্চিত করা হলো
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: টোকেন থাকলে স্বয়ংক্রিয়ভাবে Authorization হেডারে পাঠানো
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: ৪০১ আনঅথরাইজড হ্যান্ডলিং
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);

    if (error.response?.status === 401) {
      // সেশন এক্সপায়ার হলে ক্লিনআপ
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
    }

    return Promise.reject(error);
  }
);

export default API;