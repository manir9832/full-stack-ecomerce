
// // import API from './axiosConfig';

// // export const getAllProducts = () => API.get('/product');
// // export const getProductsByCategory = (category) => API.get(`/product/category/${category}`);
// // export const searchProducts = (query) => API.get(`/product/search?q=${query}`);
// // export const getProductById = (productId) => API.get(`/product/${productId}`);



// import API from './axiosConfig';

// // সব প্রোডাক্ট ফেচ করার জন্য
// export const getAllProducts = () => {
//   return API.get('/seller/products/all');
// };

// // ক্যাটাগরি অনুযায়ী প্রোডাক্ট ফিল্টার করার জন্য
// export const getProductsByCategory = (category) => {
//   return API.get(`/seller/products/all?category=${encodeURIComponent(category)}`);
// };

// export const searchProducts = (query) => {
//   return API.get(`/seller/products/all?search=${encodeURIComponent(query)}`);
// };

// export const getProductById = (productId) => {
//   return API.get(`/seller/products/${productId}`);
// };















import API from './axiosConfig';

// সব অ্যাক্টিভ প্রোডাক্ট ফেচ করার জন্য
export const getAllProducts = () => {
  return API.get('/products');
};

// ক্যাটাগরি অনুযায়ী প্রোডাক্ট ফেচ করার জন্য
export const getProductsByCategory = (category) => {
  return API.get(`/products/category/${encodeURIComponent(category)}`);
};

// সার্চ করার জন্য (keyword কুয়েরি প্যারাম দিয়ে)
export const searchProducts = (keyword) => {
  return API.get(`/products/search?keyword=${encodeURIComponent(keyword)}`);
};

// সিঙ্গেল প্রোডাক্ট ডিটেইলস পাওয়ার জন্য
export const getProductById = (productId) => {
  return API.get(`/products/${productId}`);
};