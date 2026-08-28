import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerHome from './pages/CustomerHome';
import ProductDetails from './pages/ProductDetails';
import CartCheckout from './pages/CartCheckout';
import OrderTracking from './pages/OrderTracking';
import CustomerLogin from './pages/CustomerLogin';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerHome />} />
      <Route path="product/:id" element={<ProductDetails />} />
      <Route path="checkout" element={<CartCheckout />} />
      <Route path="order-tracking/:orderId" element={<OrderTracking />} />
      <Route path="login" element={<CustomerLogin />} />
    </Routes>
  );
};

export default CustomerRoutes;

