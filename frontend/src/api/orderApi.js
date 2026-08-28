
import API from './axiosConfig';

// Order Endpoints
export const createOrder = (orderData) => API.post('/orders/create', orderData);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getOrderDetails = (orderId) => API.get(`/orders/${orderId}`);

// Payment Endpoints
export const createRazorpayOrder = (data) => API.post('/payment/create-order', data);
export const verifyRazorpayPayment = (data) => API.post('/payment/verify', data);