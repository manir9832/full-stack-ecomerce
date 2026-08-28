import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from '../../../components/logo/BrandLogo';

const SellerSidebar = () => {
  const location = useLocation();

  const menu = [
    { path: '/seller/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/seller/products', label: 'Product Inventory', icon: '📦' },
    { path: '/seller/orders', label: 'Live Orders', icon: '🛒' },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 space-y-6">
      <BrandLogo className="h-9 w-auto" />
      <nav className="space-y-1">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              location.pathname === item.path
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SellerSidebar;