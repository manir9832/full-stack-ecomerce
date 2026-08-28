
import axios from "axios";

// =====================================
// AXIOS INSTANCE
// =====================================

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================
// USER
// =====================================
// =====================================
// USER
// =====================================

export const registerUser = (data) =>
  api.post("/user/register", data);

export const verifyOTP = (data) =>
  api.post("/user/verify-otp", data);

export const resendOTP = (data) =>
  api.post("/user/resend-otp", data);

export const loginUser = (data) =>
  api.post("/user/login", data);

export const logoutUser = () =>
  api.post("/user/logout");

export const checkUserAuth = () =>
  api.get("/user/isAuth");

// =====================================
// PRODUCTS
// =====================================

export const getAllProducts = () =>
  api.get("/products");

export const getSingleProduct = (productId) =>
  api.get(`/products/${productId}`);

export const getProductsByCategory = (category) =>
  api.get(`/products/category/${category}`);

export const searchProducts = (keyword) =>
  api.get(`/products/search?keyword=${keyword}`);

// =====================================
// CART
// =====================================

export const addToCart = (data) =>
  api.post("/cart/add", data);

export const getCart = () =>
  api.get("/cart");

export const updateCartQuantity = (
  productId,
  quantity
) =>
  api.put(`/cart/${productId}`, {
    quantity,
  });

export const removeFromCart = (productId) =>
  api.delete(`/cart/${productId}`);

export const clearCart = () =>
  api.delete("/cart/clear");

// =====================================
// ORDERS
// =====================================

export const createOrder = (data) =>
  api.post("/orders/create", data);

export const getMyOrders = () =>
  api.get("/orders/my-orders");

// =====================================
// PAYMENT
// =====================================

// Backend expects { orderId }
export const createPaymentOrder = (data) =>
  api.post("/payment/create-order", data);

export const verifyPayment = (data) =>
  api.post("/payment/verify", data);

// =====================================
// SELLER
// =====================================

export const sellerLogin = (data) =>
  api.post("/seller/login", data);

export const sellerLogout = () =>
  api.post("/seller/logout");

export const sellerAuth = () =>
  api.get("/seller/is-auth");

export const getSellerProducts = () =>
  api.get("/seller/products");

export const addSellerProduct = (formData) =>
  api.post("/seller/products/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// =====================================
// DELIVERY BOY
// =====================================

export const deliveryBoyLogin = (data) =>
  api.post("/delivery-boy/login", data);

export const deliveryBoyLogout = () =>
  api.post("/delivery-boy/logout");

export const deliveryBoyAuth = () =>
  api.get("/delivery-boy/is-auth");

// =====================================
// ADMIN
// =====================================

export const adminLogin = (data) =>
  api.post("/admin/login", data);

export const adminLogout = () =>
  api.post("/admin/logout");

export const adminAuth = () =>
  api.get("/admin/is-auth");

export const getAllSellers = () =>
  api.get("/admin/sellers");

export const getAllDeliveryBoys = () =>
  api.get("/admin/delivery-boys");

export const getAllOrders = () =>
  api.get("/admin/orders");

export default api;