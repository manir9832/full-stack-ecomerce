import API from './axiosConfig';

// ১. Razorpay পেমেন্ট অর্ডার আইডি তৈরি করা
export const createRazorpayOrder = (amount) => API.post('/api/payment/razorpay-order', { amount });

// ২. পেমেন্ট কমপ্লিট হওয়ার পর ব্যাকএন্ডে Signature ভেরিফাই করা
export const verifyRazorpayPayment = (paymentData) => API.post('/api/payment/verify', paymentData);