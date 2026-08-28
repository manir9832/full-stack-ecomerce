import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentGatewayPage from './pages/PaymentGatewayPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

const PaymentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PaymentGatewayPage />} />
      <Route path="success" element={<PaymentSuccess />} />
      <Route path="failed" element={<PaymentFailed />} />
    </Routes>
  );
};

export default PaymentRoutes;