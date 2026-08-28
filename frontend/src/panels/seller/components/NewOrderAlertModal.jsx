import React from 'react';

const NewOrderAlertModal = ({ isOpen, order, onAccept, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border-2 border-emerald-500 animate-bounce">
        <div className="text-center space-y-1">
          <span className="text-3xl">🔔</span>
          <h3 className="font-black text-slate-900 text-lg">
            New Customer Order Received!
          </h3>
          <p className="text-xs text-slate-500">
            ID: #{order._id?.slice(-6)}
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border text-xs space-y-1 text-slate-700">
          <p>
            <strong>Total Amount:</strong> ₹{order.totalAmount}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onAccept(order._id)}
            className="flex-1 bg-emerald-600 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md"
          >
            Accept Order
          </button>

          <button
            onClick={onClose}
            className="px-3 bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderAlertModal;