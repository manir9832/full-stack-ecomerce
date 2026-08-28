import React from 'react';

const OrderStatusTracker = ({ currentStatus }) => {
  const steps = [
    { label: 'Order Confirmed', status: 'PLACED' },
    { label: 'Preparing Your Order', status: 'PREPARING' },
    { label: 'Out for Delivery', status: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', status: 'DELIVERED' },
  ];

  const getStepIndex = () => steps.findIndex((s) => s.status === currentStatus);
  const activeIndex = getStepIndex() === -1 ? 0 : getStepIndex();

  return (
    <div className="bg-slate-50 border rounded-2xl p-4 space-y-4">
      <h4 className="text-xs font-extrabold text-slate-700 uppercase">
        Delivery Tracking Status
      </h4>

      <div className="grid grid-cols-4 gap-2 text-center">
        {steps.map((step, idx) => (
          <div key={step.status} className="space-y-1">
            <div
              className={`h-2 rounded-full transition-all ${
                idx <= activeIndex ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            ></div>

            <span
              className={`text-[10px] font-bold block leading-tight ${
                idx <= activeIndex ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTracker;