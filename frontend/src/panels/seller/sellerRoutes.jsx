import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerDashboard from './pages/SellerDashboard';
import SellerProducts from './pages/SellerProducts';
import SellerOrders from './pages/SellerOrders';
import SellerAuth from './pages/SellerAuth';

const SellerRoutes = () => {
  return (
    <Routes>
      <Route path="auth" element={<SellerAuth />} />
      <Route path="dashboard" element={<SellerDashboard />} />
      <Route path="products" element={<SellerProducts />} />
      <Route path="orders" element={<SellerOrders />} />
    </Routes>
  );
};

export default SellerRoutes;