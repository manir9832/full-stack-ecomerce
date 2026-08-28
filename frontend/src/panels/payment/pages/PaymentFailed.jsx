import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
        ✕
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900">
          Payment Failed!
        </h1>
        <p className="text-xs text-slate-500">
          There was an issue with your bank account details, or the payment was cancelled.
        </p>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-lg transition"
      >
        Try Payment Again 🔄
      </button>
    </div>
  );
};

export default PaymentFailed;