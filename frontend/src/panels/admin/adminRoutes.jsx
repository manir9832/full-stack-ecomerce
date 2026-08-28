import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import VerifySellers from './pages/VerifySellers';
import VerifyDeliveryBoys from './pages/VerifyDeliveryBoys';
import AdminLogin from './pages/AdminLogin';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="verify-sellers" element={<VerifySellers />} />
      <Route path="verify-delivery" element={<VerifyDeliveryBoys />} />
    </Routes>
  );
};

export default AdminRoutes;