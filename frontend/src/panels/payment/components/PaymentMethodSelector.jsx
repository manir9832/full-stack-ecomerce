import React from 'react';

const PaymentMethodSelector = ({ selectedMethod, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase">
        Select Payment Method
      </label>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange('ONLINE')}
          className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
            selectedMethod === 'ONLINE'
              ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
              : 'border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <span>💳</span>
          <span>Online (Razorpay)</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('COD')}
          className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
            selectedMethod === 'COD'
              ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
              : 'border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <span>💵</span>
          <span>Cash on Delivery</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;