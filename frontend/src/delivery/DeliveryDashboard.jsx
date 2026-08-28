

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { useSocketContext } from '../../../context/SocketContext';
// import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';

// const BACKEND_URL = 'http://localhost:3000';

// const DeliveryDashboard = () => {
//   console.log('🚀 ACTIVE DELIVERY DASHBOARD MOUNTED');
//   const navigate = useNavigate();
//   const { socket, joinDeliveryRoom } = useSocketContext();

//   const [deliveryBoy, setDeliveryBoy] = useState(null);
//   const [isOnline, setIsOnline] = useState(false);
//   const [availableOrders, setAvailableOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   // ১. পেন্ডিং অর্ডার ফেচ
//   const fetchAvailableOrders = async () => {
//     try {
//       const res = await axios.get(`${BACKEND_URL}/api/delivery-boy/available-orders`, {
//         withCredentials: true,
//       }).catch(() =>
//         axios.get(`${BACKEND_URL}/api/orders/delivery/available`, { withCredentials: true })
//       );

//       console.log('📦 AVAILABLE ORDERS RESPONSE:', res?.data);
//       if (res?.data?.orders) {
//         setAvailableOrders(res.data.orders);
//       }
//     } catch (err) {
//       console.error('Failed to fetch available orders:', err);
//     }
//   };

//   // ২. অথেনটিকেশন ও সকেট ইনিশিয়ালাইজেশন
//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const authRes = await axios.get(`${BACKEND_URL}/api/delivery-boy/is-auth`, {
//         withCredentials: true,
//       });

//       const boy = authRes.data?.deliveryBoy;
//       if (boy) {
//         setDeliveryBoy(boy);
//         setIsOnline(boy.isOnline || false);

//         if (boy._id) {
//           if (typeof joinDeliveryRoom === 'function') {
//             joinDeliveryRoom(boy._id);
//           }
//           if (socket) {
//             socket.emit('joinDeliveryBoy', boy._id);
//           }
//         }
//       }

//       await fetchAvailableOrders();
//     } catch (err) {
//       console.error('Error loading dashboard:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, [socket]);

//   // ৩. সকেট লিসেনার
//   useEffect(() => {
//     if (!socket) return;

//     const handleNewOrder = (orderData) => {
//       console.log('🚨 NEW ORDER SOCKET EVENT:', orderData);
//       setAvailableOrders((prev) => {
//         const id = orderData._id || orderData.orderId;
//         const exists = prev.some((o) => (o._id || o.orderId) === id);
//         if (exists) return prev;
//         return [orderData, ...prev];
//       });
//     };

//     const handleOrderTaken = (data) => {
//       setAvailableOrders((prev) => prev.filter((o) => (o._id || o.orderId) !== data.orderId));
//     };

//     socket.on('newDeliveryOrder', handleNewOrder);
//     socket.on('orderAssigned', handleNewOrder);
//     socket.on('orderTaken', handleOrderTaken);

//     return () => {
//       socket.off('newDeliveryOrder', handleNewOrder);
//       socket.off('orderAssigned', handleNewOrder);
//       socket.off('orderTaken', handleOrderTaken);
//     };
//   }, [socket]);

//   // ৪. অনলাইন / অফলাইন টগল
//   const handleToggleOnline = async () => {
//     try {
//       setActionLoading(true);
//       if (isOnline) {
//         await axios.put(`${BACKEND_URL}/api/delivery-boy/offline`, {}, { withCredentials: true });
//         setIsOnline(false);
//       } else {
//         await axios.put(`${BACKEND_URL}/api/delivery-boy/online`, {}, { withCredentials: true });
//         setIsOnline(true);
//         fetchAvailableOrders();
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to update online status');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ৫. অর্ডার এক্সেপ্ট
//   const handleAcceptOrder = async (orderId) => {
//     try {
//       setActionLoading(true);
//       await axios.patch(`${BACKEND_URL}/api/delivery-boy/accept/${orderId}`, {}, { withCredentials: true });
//       navigate('/delivery/active', { state: { orderId } });
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to accept order.');
//       fetchAvailableOrders();
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 font-bold">
//         Loading Delivery Dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
//       {/* Top Header Card */}
//       <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div>
//           <h1 className="text-xl font-black text-slate-900">Delivery Partner Dashboard</h1>
//           <p className="text-xs text-slate-400 mt-1">
//             Partner: <strong className="text-slate-700">{deliveryBoy?.name || 'Active Rider'}</strong> ({deliveryBoy?.phone})
//           </p>
//         </div>

//         <button
//           onClick={handleToggleOnline}
//           disabled={actionLoading}
//           className={`px-6 py-2.5 rounded-full font-black text-xs transition shadow-md disabled:opacity-50 ${
//             isOnline
//               ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
//               : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
//           }`}
//         >
//           {isOnline ? '🟢 You are Online' : '🔴 You are Offline'}
//         </button>
//       </div>

//       {/* Orders List / Empty State */}
//       {availableOrders.length > 0 ? (
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
//               🚨 Available Delivery Requests ({availableOrders.length})
//             </h2>
//             <button
//               onClick={fetchAvailableOrders}
//               className="text-xs font-bold text-emerald-600 hover:underline"
//             >
//               🔄 Refresh
//             </button>
//           </div>

//           {availableOrders.map((order) => {
//             const orderId = order._id || order.orderId;
//             const displayAddress =
//               typeof order.shippingAddress === 'string'
//                 ? order.shippingAddress
//                 : order.shippingAddress?.address ||
//                   order.shippingAddress?.fullAddress ||
//                   order.address ||
//                   'Customer delivery address';

//             return (
//               <div
//                 key={orderId}
//                 className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 shadow-lg space-y-4"
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full">
//                     Order #{orderId?.slice(-6).toUpperCase()}
//                   </span>
//                   <OneHourDeliveryBadge />
//                 </div>

//                 <div>
//                   <h3 className="font-extrabold text-slate-800 text-sm">
//                     Item: {order.productName} (x{order.quantity || 1})
//                   </h3>
//                   <p className="text-xs text-slate-600 mt-1">
//                     📍 <strong>Delivery Address:</strong> {displayAddress}
//                   </p>
//                   <div className="flex gap-4 mt-2">
//                     <p className="text-xs font-black text-emerald-600">
//                       💰 Your Earning: ₹{order.deliveryBoyEarning || order.deliveryCharge || 0}
//                     </p>
//                     <p className="text-xs font-bold text-slate-700">
//                       📦 Collect from Customer: ₹{order.totalAmount || 0}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-2">
//                   <button
//                     onClick={() => handleAcceptOrder(orderId)}
//                     disabled={actionLoading}
//                     className="flex-1 bg-emerald-600 text-white font-extrabold py-2.5 rounded-xl text-xs hover:bg-emerald-700 shadow-md transition disabled:opacity-50 active:scale-95"
//                   >
//                     {actionLoading ? 'Accepting...' : 'Accept Order 🛵'}
//                   </button>

//                   <button
//                     onClick={() => setAvailableOrders((prev) => prev.filter((o) => (o._id || o.orderId) !== orderId))}
//                     disabled={actionLoading}
//                     className="px-4 bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-300 transition"
//                   >
//                     Skip
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="bg-white rounded-2xl border p-12 text-center space-y-2">
//           <div className="text-4xl">🛵</div>
//           <p className="text-slate-600 font-bold text-sm">
//             {isOnline
//               ? 'Waiting for new delivery requests...'
//               : 'Go online to start receiving instant delivery orders!'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeliveryDashboard;























