// import React from 'react';

// const DeliveryEarnings = () => {
//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
//       <h1 className="text-2xl font-black text-slate-900">
//         Your Earnings
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-md">
//           <span className="text-xs font-bold uppercase opacity-80">
//             Today's Total Earnings
//           </span>

//           <h2 className="text-3xl font-black mt-1">₹850</h2>

//           <p className="text-xs mt-2 opacity-90">
//             Completed Deliveries Today: 12
//           </p>
//         </div>

//         <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
//           <span className="text-xs font-bold uppercase opacity-80">
//             This Week's Total Earnings
//           </span>

//           <h2 className="text-3xl font-black mt-1">₹0</h2>

//           <p className="text-xs mt-2 text-emerald-400">
//             Bonus Earned: ₹0
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveryEarnings;



















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:3000';

const DeliveryEarnings = () => {
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState({
    today: { earnings: 0, deliveries: 0 },
    thisWeek: { earnings: 0, deliveries: 0, bonus: 0 },
    allTime: { earnings: 0, deliveries: 0 },
  });

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/delivery-boy/earnings`, {
        withCredentials: true,
      });

      if (res.data?.success) {
        setEarningsData({
          today: res.data.today || { earnings: 0, deliveries: 0 },
          thisWeek: res.data.thisWeek || { earnings: 0, deliveries: 0, bonus: 0 },
          allTime: res.data.allTime || { earnings: 0, deliveries: 0 },
        });
      }
    } catch (err) {
      console.error('Failed to load earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 font-bold">
        Loading earnings details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Your Earnings</h1>
        <button
          onClick={fetchEarnings}
          className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl transition"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Today's Earnings */}
        <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-md space-y-2">
          <span className="text-xs font-bold uppercase opacity-80">
            Today's Total Earnings
          </span>
          <h2 className="text-3xl font-black">₹{earningsData.today.earnings}</h2>
          <p className="text-xs opacity-90">
            Completed Deliveries Today: {earningsData.today.deliveries}
          </p>
        </div>

        {/* This Week's Earnings */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-2">
          <span className="text-xs font-bold uppercase opacity-80">
            This Week's Total Earnings
          </span>
          <h2 className="text-3xl font-black">₹{earningsData.thisWeek.earnings}</h2>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">
              Deliveries This Week: {earningsData.thisWeek.deliveries}
            </span>
            <span className="text-emerald-400 font-bold">
              Bonus Earned: ₹{earningsData.thisWeek.bonus}
            </span>
          </div>
        </div>
      </div>

      {/* Lifetime / All-Time Earnings Card */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">All-Time Total Revenue</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total Completed Deliveries: {earningsData.allTime.deliveries}
          </p>
        </div>
        <div className="text-2xl font-black text-emerald-600">
          ₹{earningsData.allTime.earnings}
        </div>
      </div>

      {/* Quick Navigation Link */}
      <div className="pt-2">
        <Link
          to="/delivery/dashboard"
          className="inline-block text-xs font-bold text-emerald-600 hover:underline"
        >
          ← Back to Delivery Dashboard
        </Link>
      </div>
    </div>
  );
};

export default DeliveryEarnings;