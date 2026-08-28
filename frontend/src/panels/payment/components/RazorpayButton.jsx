import React from 'react';

const RazorpayButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-lg transition active:scale-95 disabled:bg-slate-400 flex items-center justify-center gap-2 text-sm"
    >
      <span>🔒</span>
      <span>
        {loading ? 'Processing...' : 'Pay Securely with Razorpay'}
      </span>
    </button>
  );
};

export default RazorpayButton;