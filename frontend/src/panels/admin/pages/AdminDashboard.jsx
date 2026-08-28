import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../../components/logo/BrandLogo';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-9 w-auto" />
          <div>
            <h1 className="text-xl font-black text-slate-900">
              Super Admin Panel
            </h1>
            <p className="text-xs text-slate-400">
              Complete control over the grocera platform
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <Link
          to="/admin/verify-sellers"
          className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-2 group"
        >
          <div className="text-3xl">🏪</div>
          <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-600">
            Seller Verification
          </h3>
          <p className="text-xs text-slate-500">
            Verify Aadhaar and documents of new sellers before approval.
          </p>
        </Link>

        <Link
          to="/admin/verify-delivery"
          className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-2 group"
        >
          <div className="text-3xl">🛵</div>
          <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-600">
            Delivery Partner Verification
          </h3>
          <p className="text-xs text-slate-500">
            Review delivery partner applications and activate their accounts.
          </p>
        </Link>

        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-2 opacity-75">
          <div className="text-3xl">📊</div>
          <h3 className="font-extrabold text-slate-900">
            Live Sales Report
          </h3>
          <p className="text-xs text-slate-500">
            View total transactions and profit margin statistics.
          </p>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;