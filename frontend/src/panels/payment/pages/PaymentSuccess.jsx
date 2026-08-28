import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner animate-bounce">
        ✓
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900">
          Order Placed Successfully!
        </h1>

        <p className="text-xs text-slate-500">
          Thank you! Your order has been sent to the seller and delivery partner.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <OneHourDeliveryBadge />
        <p className="text-xs text-emerald-800 font-medium mt-2">
          Our delivery partner will reach your address within{" "}
          <strong>60 minutes</strong>.
        </p>
      </div>

      <button
        onClick={() => navigate(`/order-tracking/${orderId || ''}`)}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl shadow-lg transition"
      >
        Track Your Order Live 🛵
      </button>
    </div>
  );
};

export default PaymentSuccess;