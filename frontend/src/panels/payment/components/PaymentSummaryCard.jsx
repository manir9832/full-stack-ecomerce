import React from 'react';

const PaymentSummaryCard = ({ subTotal, deliveryCharge, grandTotal }) => {
  return (
    <div className="bg-white border rounded-2xl p-5 space-y-3 shadow-sm">
      <h3 className="font-extrabold text-slate-900 border-b pb-2 text-sm">
        Payment Summary
      </h3>

      <div className="space-y-2 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-bold text-slate-900">₹{subTotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Fee (OSRM Distance)</span>
          <span className="font-bold text-emerald-600">
            {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}
          </span>
        </div>

        <div className="border-t pt-2 flex justify-between text-sm font-black text-slate-900">
          <span>Total Amount</span>
          <span className="text-emerald-600">₹{grandTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;