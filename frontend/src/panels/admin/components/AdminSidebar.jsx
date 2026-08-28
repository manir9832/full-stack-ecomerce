import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from '../../../components/logo/BrandLogo';

const AdminSidebar = () => {
  const location = useLocation();

  const links = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/verify-sellers', label: 'Seller Verification', icon: '🏪' },
    { path: '/admin/verify-delivery', label: 'Delivery Verification', icon: '🛵' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 space-y-6 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-2">
          <BrandLogo className="h-8 w-auto" variant="light" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mt-1">
            Super Admin
          </span>
        </div>

        <nav className="space-y-1">
          {links.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4 px-2">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/admin/login';
          }}
          className="w-full text-left text-xs font-bold text-red-400 hover:text-red-300 transition flex items-center gap-2"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;