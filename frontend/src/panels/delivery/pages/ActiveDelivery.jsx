

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';

// const BACKEND_URL = 'http://localhost:3000';

// const ActiveDelivery = () => {
//   const navigate = useNavigate();
//   const [activeOrders, setActiveOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   // ১. ডেলিভারি বয়ের অ্যাসাইন করা সব রানিং অর্ডার ফেচ করা
//   const fetchActiveDeliveries = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BACKEND_URL}/api/delivery-boy/orders`, {
//         withCredentials: true,
//       });

//       if (res.data?.orders) {
//         // শুধুমাত্র যে অর্ডারগুলো এখনও ডেলিভার্ড বা ক্যান্সেল হয়নি
//         const pendingRuns = res.data.orders.filter(
//           (o) => o.status === 'assigned' || o.status === 'picked_up' || o.status === 'out_for_delivery'
//         );
//         setActiveOrders(pendingRuns);
//       }
//     } catch (err) {
//       console.error('Failed to fetch active deliveries:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActiveDeliveries();
//   }, []);

//   // ২. পিকড-আপ / ডেলিভার্ড স্ট্যাটাস আপডেট হ্যান্ডলার
//   const handleUpdateStatus = async (orderId, nextStatus) => {
//     try {
//       setActionLoading(true);
//       let endpoint = '';
//       if (nextStatus === 'picked_up') endpoint = `/api/delivery-boy/picked-up/${orderId}`;
//       else if (nextStatus === 'out_for_delivery') endpoint = `/api/delivery-boy/out-for-delivery/${orderId}`;
//       else if (nextStatus === 'delivered') endpoint = `/api/delivery-boy/delivered/${orderId}`;

//       await axios.patch(`${BACKEND_URL}${endpoint}`, {}, { withCredentials: true });
//       alert(`Order updated to: ${nextStatus.replace(/_/g, ' ').toUpperCase()}!`);
//       fetchActiveDeliveries();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to update order status');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-md mx-auto px-4 py-16 text-center text-slate-500 font-bold">
//         Loading Active Deliveries...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-black text-slate-900">🛵 Active Deliveries</h1>
//           <p className="text-xs text-slate-500">Currently assigned tasks ({activeOrders.length})</p>
//         </div>
//         <Link
//           to="/delivery/dashboard"
//           className="text-xs font-bold bg-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-300 transition"
//         >
//           + Find More Orders
//         </Link>
//       </div>

//       {activeOrders.length === 0 ? (
//         <div className="bg-white rounded-3xl border p-12 text-center space-y-4 shadow-sm">
//           <div className="text-5xl">📦</div>
//           <h2 className="text-lg font-black text-slate-800">No active delivery tasks</h2>
//           <p className="text-xs text-slate-400">You have completed all your assigned orders.</p>
//           <button
//             onClick={() => navigate('/delivery/dashboard')}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {activeOrders.map((order) => {
//             const displayAddress =
//               typeof order.shippingAddress === 'string'
//                 ? order.shippingAddress
//                 : order.shippingAddress?.address ||
//                   order.shippingAddress?.fullAddress ||
//                   order.address ||
//                   'Customer delivery address';

//             return (
//               <div
//                 key={order._id}
//                 className="bg-white border rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden"
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="bg-slate-900 text-amber-400 font-mono font-bold text-xs px-3 py-1 rounded-full">
//                     Order #{order._id?.slice(-6).toUpperCase()}
//                   </span>
//                   <OneHourDeliveryBadge />
//                 </div>

//                 <div className="space-y-1">
//                   <h3 className="font-black text-slate-900 text-sm">
//                     Item: {order.productName || order.productId?.productName} (x{order.quantity || 1})
//                   </h3>
//                   <p className="text-xs text-slate-600">
//                     📍 <strong>Customer Address:</strong> {displayAddress}
//                   </p>
//                   <p className="text-xs text-slate-600">
//                     🏪 <strong>Seller Store:</strong> {order.sellerId?.storeAddress || 'Local Partner Store'}
//                   </p>
//                   <div className="flex gap-4 pt-1">
//                     <span className="text-xs font-black text-emerald-600">
//                       💰 Earning: ₹{order.deliveryBoyEarning || order.deliveryCharge || 40}
//                     </span>
//                     <span className="text-xs font-bold text-slate-700">
//                       📦 Collect: ₹{order.totalAmount || 0}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Workflow Buttons */}
//                 <div className="pt-2">
//                   {order.status === 'assigned' && (
//                     <button
//                       onClick={() => handleUpdateStatus(order._id, 'picked_up')}
//                       disabled={actionLoading}
//                       className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow-md transition text-xs"
//                     >
//                       Step 1: Pick Up from Store 🏪
//                     </button>
//                   )}

//                   {order.status === 'picked_up' && (
//                     <button
//                       onClick={() => handleUpdateStatus(order._id, 'out_for_delivery')}
//                       disabled={actionLoading}
//                       className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl shadow-md transition text-xs"
//                     >
//                       Step 2: Out for Delivery 🛵
//                     </button>
//                   )}

//                   {order.status === 'out_for_delivery' && (
//                     <button
//                       onClick={() => handleUpdateStatus(order._id, 'delivered')}
//                       disabled={actionLoading}
//                       className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition text-xs"
//                     >
//                       Step 3: Confirm Delivered ✓
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActiveDelivery;



























import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useSocketContext } from '../../../context/SocketContext';
import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';
import DeliveryLiveMap from '../components/DeliveryLiveMap';

const BACKEND_URL = 'http://localhost:3000';

const ActiveDelivery = () => {
  const navigate = useNavigate();
  const { socket } = useSocketContext();

  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);

  // ১. রাইডারের লাইভ GPS ট্র্যাকিং
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setRiderLocation(coords);

        // লাইভ লোকেশন ব্যাকএন্ড ও সকেটে পাঠানো
        if (socket) {
          socket.emit('updateDeliveryLocation', {
            latitude: coords.lat,
            longitude: coords.lng,
          });
        }
      },
      (err) => console.warn('Geolocation Error:', err.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket]);

  // ২. রানিং অর্ডার ফেচ করা
  const fetchActiveDeliveries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/delivery-boy/orders`, {
        withCredentials: true,
      });

      if (res.data?.orders) {
        const pendingRuns = res.data.orders.filter(
          (o) => o.status === 'assigned' || o.status === 'picked_up' || o.status === 'out_for_delivery'
        );
        setActiveOrders(pendingRuns);
      }
    } catch (err) {
      console.error('Failed to fetch active deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveDeliveries();
  }, []);

  // ৩. অর্ডার স্ট্যাটাস আপডেট হ্যান্ডলার
  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      setActionLoading(true);
      let endpoint = '';
      if (nextStatus === 'picked_up') endpoint = `/api/delivery-boy/picked-up/${orderId}`;
      else if (nextStatus === 'out_for_delivery') endpoint = `/api/delivery-boy/out-for-delivery/${orderId}`;
      else if (nextStatus === 'delivered') endpoint = `/api/delivery-boy/delivered/${orderId}`;

      await axios.patch(`${BACKEND_URL}${endpoint}`, {}, { withCredentials: true });
      alert(`Order updated to: ${nextStatus.replace(/_/g, ' ').toUpperCase()}!`);
      fetchActiveDeliveries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-slate-500 font-bold">
        Loading Active Deliveries...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">🛵 Active Deliveries</h1>
          <p className="text-xs text-slate-500">Currently assigned tasks ({activeOrders.length})</p>
        </div>
        <Link
          to="/delivery/dashboard"
          className="text-xs font-bold bg-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-300 transition"
        >
          + Find More Orders
        </Link>
      </div>

      {activeOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border p-12 text-center space-y-4 shadow-sm">
          <div className="text-5xl">📦</div>
          <h2 className="text-lg font-black text-slate-800">No active delivery tasks</h2>
          <p className="text-xs text-slate-400">You have completed all your assigned orders.</p>
          <button
            onClick={() => navigate('/delivery/dashboard')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {activeOrders.map((order) => {
            const displayAddress =
              typeof order.shippingAddress === 'string'
                ? order.shippingAddress
                : order.shippingAddress?.address ||
                  order.shippingAddress?.fullAddress ||
                  order.address ||
                  'Customer delivery address';

            // সেলার ও কাস্টমারের লোকেশন কোঅর্ডিনেট
            const sellerLocation = {
              lat: order.sellerId?.location?.latitude || 22.6306,
              lng: order.sellerId?.location?.longitude || 88.6646,
              name: order.sellerId?.name || 'Seller Store',
            };

            const customerLocation = {
              lat: order.shippingAddress?.latitude || 22.6350,
              lng: order.shippingAddress?.longitude || 88.6700,
              address: displayAddress,
            };

            const distanceKm = order.distance || order.distanceKm || 1.8;

            return (
              <div
                key={order._id}
                className="bg-white border rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden"
              >
                <div className="flex justify-between items-center">
                  <span className="bg-slate-900 text-amber-400 font-mono font-bold text-xs px-3 py-1 rounded-full">
                    Order #{order._id?.slice(-6).toUpperCase()}
                  </span>
                  <OneHourDeliveryBadge />
                </div>

                {/* গুগল ম্যাপ ভিউ */}
                <DeliveryLiveMap
                  riderLoc={riderLocation}
                  sellerLoc={sellerLocation}
                  customerLoc={customerLocation}
                  distanceKm={distanceKm}
                />

                <div className="space-y-1 pt-2">
                  <h3 className="font-black text-slate-900 text-sm">
                    Item: {order.productName || order.productId?.productName} (x{order.quantity || 1})
                  </h3>
                  <p className="text-xs text-slate-600">
                    📍 <strong>Customer Address:</strong> {displayAddress}
                  </p>
                  <p className="text-xs text-slate-600">
                    🏪 <strong>Seller Store:</strong> {order.sellerId?.storeAddress || 'Local Partner Store'}
                  </p>
                  <div className="flex gap-4 pt-1">
                    <span className="text-xs font-black text-emerald-600">
                      💰 Earning: ₹{order.deliveryBoyEarning || order.deliveryCharge || 20}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      📦 Collect: ₹{order.totalAmount || 0}
                    </span>
                  </div>
                </div>

                {/* স্টেপ অ্যাকশন বাটনসমূহ */}
                <div className="pt-2">
                  {order.status === 'assigned' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order._id, 'picked_up')}
                      disabled={actionLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow-md transition text-xs disabled:opacity-50"
                    >
                      Step 1: Pick Up from Store 🏪
                    </button>
                  )}

                  {order.status === 'picked_up' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order._id, 'out_for_delivery')}
                      disabled={actionLoading}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl shadow-md transition text-xs disabled:opacity-50"
                    >
                      Step 2: Out for Delivery 🛵
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order._id, 'delivered')}
                      disabled={actionLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition text-xs disabled:opacity-50"
                    >
                      Step 3: Confirm Delivered ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveDelivery;