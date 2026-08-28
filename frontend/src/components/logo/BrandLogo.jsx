import React from 'react';

const BrandLogo = ({ className = 'h-10 w-auto object-contain' }) => {
  return (
    <div className="flex items-center gap-2.5 cursor-pointer select-none">
      <img
        src="/assets/images/logo.jpeg"
        alt="grocera logo"
        className={`${className} rounded-md shadow-sm`}
        onError={(e) => {
          // If image fails to load, fallback text style handles it gracefully
          e.target.style.display = 'none';
        }}
      />
      <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 bg-clip-text text-transparent capitalize">
        grocera
      </span>
    </div>
  );
};

export default BrandLogo;