import React from 'react';
import { Routes, Route } from 'react-route-dom';
import DeliveryDashboard from './pages/DeliveryDashboard';
import ActiveDelivery from './pages/ActiveDelivery';
import DeliveryEarnings from './pages/DeliveryEarnings';
import DeliveryAuth from './pages/DeliveryAuth';

const DeliveryRoutes = () => {
  return (
    <Routes>
      <Route path="auth" element={<DeliveryAuth />} />
      <Route path="dashboard" element={<DeliveryDashboard />} />
      <Route path="active" element={<ActiveDelivery />} />
      <Route path="earnings" element={<DeliveryEarnings />} />
    </Routes>
  );
};

export default DeliveryRoutes;