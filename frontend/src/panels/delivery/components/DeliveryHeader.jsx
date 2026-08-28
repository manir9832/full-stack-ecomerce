import React from 'react';
import BrandLogo from '../../../components/logo/BrandLogo';

const DeliveryHeader = () => {
  return (
    <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
      <BrandLogo className="h-8 w-auto" variant="light" />

      <span className="text-xs font-bold text-emerald-400 bg-slate-800 px-3 py-1 rounded-full">
        🛵 Delivery Partner Portal
      </span>
    </div>
  );
};

export default DeliveryHeader;