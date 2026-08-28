// import React, { useEffect, useState } from 'react';
// import API from '../../../api/axiosConfig';

// const VerifySellers = () => {
//   const [sellers, setSellers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPendingSellers = async () => {
//     try {
//       setLoading(true);

//       // Fetch all sellers
//       const res = await API.get('/api/admin/sellers');

//       // Filter pending sellers
//       if (res.data?.sellers) {
//         const pending = res.data.sellers.filter((s) => !s.isApproved);
//         setSellers(pending);
//       } else {
//         setSellers([]);
//       }
//     } catch (err) {
//       console.error('Failed to load pending sellers:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPendingSellers();
//   }, []);

//   const handleApprove = async (id) => {
//     try {
//       await API.patch(`/api/admin/seller/${id}/approve`);
//       alert('Seller approved successfully!');
//       fetchPendingSellers();
//     } catch (err) {
//       console.error('Approval error:', err);
//       alert(err.response?.data?.message || 'Failed to approve seller!');
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-black text-slate-900">
//           Seller Verification
//         </h1>

//         <button
//           onClick={fetchPendingSellers}
//           className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition"
//         >
//           Refresh 🔄
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl border p-6 shadow-sm">
//         {loading ? (
//           <p className="text-slate-400 text-sm">
//             Loading seller applications...
//           </p>
//         ) : sellers.length > 0 ? (
//           <div className="space-y-4">
//             {sellers.map((seller) => (
//               <div
//                 key={seller._id}
//                 className="flex items-center justify-between border-b pb-4 last:border-0"
//               >
//                 <div>
//                   <h3 className="font-bold text-slate-800">
//                     {seller.name || 'Shop Name'}
//                   </h3>

//                   <p className="text-xs text-slate-500 mt-0.5">
//                     Phone: <span className="font-semibold">{seller.phone}</span>
//                   </p>

//                   <p className="text-xs text-amber-600 font-bold mt-1">
//                     ● Pending Approval
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => handleApprove(seller._id)}
//                   className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
//                 >
//                   Approve
//                 </button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-slate-500 text-sm">
//             No pending seller applications found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifySellers;











import React, { useState, useEffect } from 'react';
import { getAllSellersApi, approveSellerApi } from '../../../api/adminApi';

const VerifySellers = () => {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await getAllSellersApi();
      const allSellers = res.data?.sellers || [];

      // শুধুমাত্র যেসব সেলার অ্যাপ্রুভ হয়নি (isApproved: false) তাদের ফিল্টার করা
      const pending = allSellers.filter((seller) => !seller.isApproved);
      setPendingSellers(pending);
    } catch (err) {
      console.error('Failed to fetch sellers:', err);
      setError(
        err.response?.data?.message ||
        'Failed to load sellers. Make sure you are logged in as Admin.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleApprove = async (sellerId) => {
    try {
      const res = await approveSellerApi(sellerId);
      alert(res.data?.message || 'Seller approved successfully!');
      
      // স্টেট থেকে রিমুভ করা
      setPendingSellers((prev) => prev.filter((s) => s._id !== sellerId));
    } catch (err) {
      console.error('Approve failed:', err);
      alert(err.response?.data?.message || 'Failed to approve seller.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Seller Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5">Review and approve new store requests</p>
        </div>
        <button
          onClick={fetchSellers}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
        >
          Refresh 🔄
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-400">Loading applications...</div>
      ) : pendingSellers.length === 0 ? (
        <div className="bg-white border rounded-2xl p-8 text-center text-slate-500 text-sm shadow-sm">
          No pending seller applications found.
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingSellers.map((seller) => (
            <div
              key={seller._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-800">{seller.name}</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    Pending Approval
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">📞 Phone: {seller.phone}</p>
                <p className="text-xs text-slate-400">
                  Applied on: {new Date(seller.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleApprove(seller._id)}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm active:scale-95"
                >
                  Approve Store
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifySellers;











