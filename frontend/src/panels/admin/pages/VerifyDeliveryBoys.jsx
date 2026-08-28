// import React, { useEffect, useState } from 'react';
// import { getPendingDeliveryBoys, approveDeliveryBoy } from '../../../api/adminApi';

// const VerifyDeliveryBoys = () => {
//   const [deliveryBoys, setDeliveryBoys] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPendingBoys = async () => {
//     try {
//       const res = await getPendingDeliveryBoys();
//       setDeliveryBoys(res.data?.deliveryBoys || []);
//     } catch (err) {
//       console.error('Failed to fetch pending delivery partners:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPendingBoys();
//   }, []);

//   const handleApprove = async (id) => {
//     try {
//       await approveDeliveryBoy(id);
//       alert('Delivery partner approved successfully!');
//       fetchPendingBoys();
//     } catch (err) {
//       console.error('Approval failed:', err);
//       alert('Failed to approve delivery partner.');
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
//       <h1 className="text-2xl font-black text-slate-900">
//         Delivery Partner Verification Panel
//       </h1>

//       <div className="bg-white rounded-2xl border p-6 shadow-sm">
//         {loading ? (
//           <p className="text-slate-400 text-sm">
//             Loading pending applications...
//           </p>
//         ) : deliveryBoys.length > 0 ? (
//           <div className="space-y-4">
//             {deliveryBoys.map((boy) => (
//               <div
//                 key={boy._id}
//                 className="flex items-center justify-between border-b pb-4 last:border-0"
//               >
//                 <div>
//                   <h3 className="font-bold text-slate-800">{boy.name}</h3>
//                   <p className="text-xs text-slate-500">
//                     Phone: {boy.phone} | Vehicle: {boy.vehicleNumber}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => handleApprove(boy._id)}
//                   className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-emerald-700"
//                 >
//                   Approve
//                 </button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-slate-500 text-sm">
//             No pending delivery partner applications found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyDeliveryBoys;

















import React, { useState, useEffect } from 'react';
import { getAllDeliveryBoysApi, approveDeliveryBoyApi } from '../../../api/adminApi';

const VerifyDeliveryBoys = () => {
  const [pendingBoys, setPendingBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await getAllDeliveryBoysApi();
      const allBoys = res.data?.deliveryBoys || [];

      // অপ্রমাণিত (isApproved: false) ডেলিভারি বয়দের ফিল্টার করা
      const pending = allBoys.filter((boy) => !boy.isApproved);
      setPendingBoys(pending);
    } catch (err) {
      console.error('Failed to fetch delivery boys:', err);
      setError(
        err.response?.data?.message ||
        'Failed to load delivery partners. Please ensure you are logged in as Admin.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const handleApprove = async (boyId) => {
    try {
      const res = await approveDeliveryBoyApi(boyId);
      alert(res.data?.message || 'Delivery partner approved successfully!');
      
      setPendingBoys((prev) => prev.filter((b) => b._id !== boyId));
    } catch (err) {
      console.error('Approval failed:', err);
      alert(err.response?.data?.message || 'Failed to approve delivery partner.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Delivery Partner Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5">Review and approve new delivery boy applications</p>
        </div>
        <button
          onClick={fetchDeliveryBoys}
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
      ) : pendingBoys.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm shadow-sm">
          No pending delivery partner applications found.
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingBoys.map((boy) => (
            <div
              key={boy._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-800">{boy.name}</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    Pending Approval
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">📞 Phone: {boy.phone}</p>
                <p className="text-xs text-slate-400">
                  Applied on: {new Date(boy.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleApprove(boy._id)}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm active:scale-95"
                >
                  Approve Partner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyDeliveryBoys;