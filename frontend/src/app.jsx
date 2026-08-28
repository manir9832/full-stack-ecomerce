import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import API from './api/axiosConfig';

// 1. Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// 2. Customer Pages
import CustomerHome from './panels/customer/pages/CustomerHome';
import ProductDetails from './panels/customer/pages/ProductDetails';
import CartCheckout from './panels/customer/pages/CartCheckout';
import OrderTracking from './panels/customer/pages/OrderTracking';
import CustomerLogin from './panels/customer/pages/CustomerLogin';
import AboutUs from './panels/customer/pages/AboutUs';
import MyOrders from './panels/customer/pages/MyOrders';

// 3. Payment Pages
import PaymentGatewayPage from './panels/payment/pages/PaymentGatewayPage';
import PaymentSuccess from './panels/payment/pages/PaymentSuccess';
import PaymentFailed from './panels/payment/pages/PaymentFailed';

// 4. Seller Pages
import SellerDashboard from './panels/seller/pages/SellerDashboard';
import SellerProducts from './panels/seller/pages/SellerProducts';
import SellerOrders from './panels/seller/pages/SellerOrders';
import SellerAuth from './panels/seller/pages/SellerAuth';

// 5. Delivery Boy Pages
import DeliveryDashboard from './panels/delivery/pages/DeliveryDashboard';
import ActiveDelivery from './panels/delivery/pages/ActiveDelivery';
import DeliveryEarnings from './panels/delivery/pages/DeliveryEarnings';
import DeliveryAuth from './panels/delivery/pages/DeliveryAuth';

// 6. Super Admin Pages
import AdminDashboard from './panels/admin/pages/AdminDashboard';
import VerifySellers from './panels/admin/pages/VerifySellers';
import VerifyDeliveryBoys from './panels/admin/pages/VerifyDeliveryBoys';
import AdminLogin from './panels/admin/pages/AdminLogin';

function App() {
  // অ্যাপ লোড হওয়ার সাথে সাথে ব্যাকএন্ড থেকে ইউজার সেশন রি-ভেরিফাই করা
  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('userToken');
        if (token) {
          const res = await API.get('/user/is-auth');
          if (res.data?.user) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        }
      } catch (err) {
        console.warn('User session not active');
      }
    };

    verifyUserSession();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* গ্লোবাল নেভিগেশন বার */}
      <Navbar />

      {/* Main Routing Body */}
      <main className="flex-1">
        <Routes>
          {/* ==================== 🛒 CUSTOMER ROUTES ==================== */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<CartCheckout />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/about" element={<AboutUs />} />

          {/* ==================== 💳 PAYMENT ROUTES ==================== */}
          <Route path="/payment" element={<PaymentGatewayPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />

          {/* ==================== 🏪 SELLER ROUTES ==================== */}
          <Route path="/seller/auth" element={<SellerAuth />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/orders" element={<SellerOrders />} />

          {/* ==================== 🛵 DELIVERY BOY ROUTES ==================== */}
          <Route path="/delivery/auth" element={<DeliveryAuth />} />
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/active" element={<ActiveDelivery />} />
          <Route path="/delivery/earnings" element={<DeliveryEarnings />} />

          {/* ==================== 👑 SUPER ADMIN ROUTES ==================== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/verify-sellers" element={<VerifySellers />} />
          <Route path="/admin/verify-delivery" element={<VerifyDeliveryBoys />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}

export default App;