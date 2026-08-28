




// import API from './axiosConfig';

// // ১. সেলারের নিজস্ব প্রোডাক্টের লিস্ট পাওয়া
// export const getSellerProducts = () => API.get('/seller/products/list');

// // ২. নতুন প্রোডাক্ট যুক্ত করা (Multer image upload support)
// export const addProduct = (formData) => 
//   API.post('/seller/products/add', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   });

// // ৩. সেলার কোনো প্রোডাক্টের স্টক অন/অফ বা আপডেট করা
// export const updateSellerProduct = (productId, data) => 
//   API.put(`/seller/products/update/${productId}`, data);


























// import API from "./axiosConfig";

// export const addProduct = (formData) => {
//   return API.post("/seller/products/add", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };





























import API from './axiosConfig';

// ১. সেলারের নিজস্ব প্রডাক্ট লিস্ট ফেচ করা
export const getSellerProducts = () => {
  return API.get('/seller/products/list');
};

// ২. নতুন প্রডাক্ট অ্যাড করা (Multipart Form Data)
export const addProduct = (formData) => {
  return API.post('/seller/products/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ৩. প্রডাক্ট আপডেট করা
export const updateProduct = (productId, formData) => {
  return API.put(`/seller/products/update/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ৪. প্রডাক্ট ডিলিট করা
export const deleteProduct = (productId) => {
  return API.delete(`/seller/products/delete/${productId}`);
};

// ৫. স্টক আপডেট করা
export const updateStock = (productId, data) => {
  return API.patch(`/seller/products/stock/${productId}`, data);
};

// ৬. স্ট্যাটাস অন/অফ করা
export const toggleProductStatus = (productId) => {
  return API.patch(`/seller/products/status/${productId}`);
};