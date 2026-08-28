// import API from './axiosConfig';

// // ১. পেন্ডিং সেলার তালিকা
// export const getPendingSellers = () => API.get('/api/admin/pending-sellers');

// // ২. সেলার অনুমোদন করা
// export const approveSeller = (sellerId) => API.put(`/api/admin/approve-seller/${sellerId}`);

// // ৩. পেন্ডিং ডেলিভারি বয় তালিকা
// export const getPendingDeliveryBoys = () => API.get('/api/admin/pending-delivery-boys');

// // ৪. ডেলিভারি বয় অনুমোদন করা
// export const approveDeliveryBoy = (deliveryBoyId) => API.put(`/api/admin/approve-delivery-boy/${deliveryBoyId}`);



import API from './axiosConfig';

// ১. সকল সেলার তালিকা (GET /api/admin/sellers)
export const getAllSellersApi = () => API.get('/admin/sellers');

// ২. সেলার অনুমোদন করা (PATCH /api/admin/seller/:sellerId/approve)
export const approveSellerApi = (sellerId) => API.patch(`/admin/seller/${sellerId}/approve`);

// ৩. সকল ডেলিভারি বয় তালিকা (GET /api/admin/delivery-boys)
export const getAllDeliveryBoysApi = () => API.get('/admin/delivery-boys');

// ৪. ডেলিভারি বয় অনুমোদন করা (PATCH /api/admin/delivery-boy/:deliveryBoyId/approve)
export const approveDeliveryBoyApi = (deliveryBoyId) => API.patch(`/admin/delivery-boy/${deliveryBoyId}/approve`);

// ৫. সকল অর্ডার তালিকা (GET /api/admin/orders)
export const getAllOrdersApi = () => API.get('/admin/orders');