import React from 'react';

const OneHourDeliveryBadge = () => {
  return (
    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-bold text-xs sm:text-sm shadow-sm animate-pulse">
      <span className="text-base">⚡</span>
      <span>Delivery in 1 hour!</span>
      <span className="text-xs bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono">
        60 MINS
      </span>
    </div>
  );
};

export default OneHourDeliveryBadge;