import React from 'react';

const OrderRequestCard = ({ order, onAccept, onReject }) => {
  return (
    <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-5 shadow-lg space-y-3">
      <h4 className="font-extrabold text-amber-900 text-xs uppercase">
        🚨 New Delivery Assignment
      </h4>

      <p className="text-xs text-slate-700">
        <strong>Delivery Address:</strong> {order?.address}
      </p>

      <p className="text-xs font-black text-emerald-600">
        <strong>Cash to Collect:</strong> ₹{order?.totalAmount}
      </p>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onAccept(order._id)}
          className="flex-1 bg-emerald-600 text-white font-extrabold py-2 rounded-xl text-xs shadow"
        >
          Accept Order
        </button>

        <button
          onClick={onReject}
          className="px-3 bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default OrderRequestCard;