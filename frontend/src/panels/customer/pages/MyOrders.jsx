




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useSocketContext } from '../../../context/SocketContext';

// const BACKEND_URL = 'http://localhost:3000';

// const MyOrders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [cancellingId, setCancellingId] = useState(null);

//   const { socket, joinCustomerRoom } = useSocketContext();

//   const fetchMyOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await axios.get(`${BACKEND_URL}/api/orders/my-orders`, {
//         withCredentials: true,
//       });

//       if (res.data?.orders) {
//         setOrders(res.data.orders);
//       } else if (Array.isArray(res.data)) {
//         setOrders(res.data);
//       }
//     } catch (err) {
//       console.error('Failed to fetch customer orders:', err);
//       setError('Failed to load orders. Please make sure you are logged in.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyOrders();

//     const customerId = localStorage.getItem('userId') || localStorage.getItem('customerId');
//     if (socket && customerId) {
//       joinCustomerRoom(customerId);

//       socket.on('orderStatusUpdated', (data) => {
//         alert(data.message || '🏪 Your order status has been updated!');
//         fetchMyOrders();
//       });

//       socket.on('deliveryBoyAssigned', (data) => {
//         alert('🛵 ' + (data.message || 'Delivery rider assigned to your order!'));
//         fetchMyOrders();
//       });

//       return () => {
//         socket.off('orderStatusUpdated');
//         socket.off('deliveryBoyAssigned');
//       };
//     }
//   }, [socket, joinCustomerRoom]);

//   // ১ ঘণ্টার মধ্যে অর্ডার ক্যান্সেল করার হ্যান্ডলার
//   const handleCancelOrder = async (orderId) => {
//     if (!window.confirm('Are you sure you want to cancel this order?')) return;

//     try {
//       setCancellingId(orderId);
//       const res = await axios.patch(
//         `${BACKEND_URL}/api/orders/cancel/${orderId}`,
//         {},
//         { withCredentials: true }
//       );

//       if (res.data?.success) {
//         alert('✅ Order cancelled successfully!');
//         fetchMyOrders();
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to cancel order.');
//     } finally {
//       setCancellingId(null);
//     }
//   };

//   // ১ ঘণ্টা পার হয়েছে কিনা যাচাই করা
//   const isCancellable = (createdAt, status) => {
//     if (status === 'cancelled' || status === 'delivered') return false;
//     const diffMs = Date.now() - new Date(createdAt).getTime();
//     return diffMs <= 60 * 60 * 1000; // ৬০ মিনিট
//   };

//   const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'delivered':
//         return <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">✓ Delivered</span>;
//       case 'cancelled':
//         return <span className="bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full text-xs">✕ Cancelled</span>;
//       case 'out_for_delivery':
//         return <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs">🛵 Out for Delivery</span>;
//       case 'picked_up':
//       case 'assigned':
//         return <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs">📦 Rider Assigned</span>;
//       case 'ready_for_shipping':
//         return <span className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full text-xs">🏪 Packing by Store</span>;
//       default:
//         return <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full text-xs">⏳ Order Placed</span>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-3xl mx-auto px-4 py-20 text-center font-bold text-slate-500">
//         Loading your orders...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
//       <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
//         <div>
//           <h1 className="text-2xl font-black text-slate-900">📦 My Orders</h1>
//           <p className="text-xs text-slate-500 mt-1">Track all your previous and active grocery orders</p>
//         </div>
//         <button
//           onClick={fetchMyOrders}
//           className="text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 transition"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* ক্যান্সেলেশন রুল অ্যালার্ট */}
//       <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-3 font-semibold">
//         <span className="text-xl">⚠️</span>
//         <span>
//           <strong>Cancellation Policy:</strong> You can cancel any pending order within <strong>1 hour</strong> of placement. After 1 hour, the order is packed for dispatch and cannot be cancelled.
//         </span>
//       </div>

//       {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl">{error}</div>}

//       {orders.length === 0 ? (
//         <div className="bg-white rounded-3xl border p-12 text-center space-y-4 shadow-sm">
//           <div className="text-5xl">🛍️</div>
//           <h3 className="font-extrabold text-slate-800 text-lg">No orders placed yet</h3>
//           <p className="text-xs text-slate-500">You haven't ordered anything yet. Order groceries and get delivery within 1 hour!</p>
//           <button
//             onClick={() => navigate('/')}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
//           >
//             Start Shopping
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => {
//             const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
//               day: 'numeric',
//               month: 'short',
//               year: 'numeric',
//               hour: '2-digit',
//               minute: '2-digit',
//             });

//             const canCancel = isCancellable(order.createdAt, order.status);

//             return (
//               <div
//                 key={order._id}
//                 className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 hover:border-emerald-300 transition"
//               >
//                 <div className="flex justify-between items-center border-b pb-3">
//                   <div>
//                     <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
//                       Order #{order._id?.slice(-8).toUpperCase()}
//                     </span>
//                     <p className="text-[11px] text-slate-400 mt-1">{date}</p>
//                   </div>
//                   <div>{getStatusBadge(order.status)}</div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h4 className="font-extrabold text-slate-900 text-sm">
//                       {order.productName || order.productId?.productName || 'Grocery Item'} (x{order.quantity || 1})
//                     </h4>
//                     <p className="text-xs text-slate-500 mt-0.5">
//                       🏪 Store: {order.sellerId?.storeAddress || order.sellerId?.name || 'Local Grocery Store'}
//                     </p>
//                     <p className="text-xs text-slate-600 mt-1">
//                       💳 Payment: <strong className="uppercase">{order.paymentMethod || 'COD'}</strong> ({order.paymentStatus || 'Pending'})
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-xs text-slate-400 block">Total Amount</span>
//                     <span className="font-black text-slate-900 text-base">₹{order.totalAmount || order.price || 0}</span>
//                   </div>
//                 </div>

//                 <div className="pt-3 flex justify-between items-center border-t">
//                   <div>
//                     {order.status !== 'cancelled' && order.status !== 'delivered' && (
//                       <span className="text-[11px] text-slate-400 font-medium">
//                         {canCancel ? '⏳ Cancellation window active (within 1 hr)' : '🔒 Cancellation window closed (> 1 hr)'}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex gap-2">
//                     {/* ১ ঘণ্টার মধ্যে থাকলে Cancel Button সক্রিয় থাকবে */}
//                     {canCancel && (
//                       <button
//                         onClick={() => handleCancelOrder(order._id)}
//                         disabled={cancellingId === order._id}
//                         className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-xl text-xs transition border border-rose-200 disabled:opacity-50"
//                       >
//                         {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order ✕'}
//                       </button>
//                     )}

//                     {order.status !== 'cancelled' && (
//                       <button
//                         onClick={() => navigate(`/order-tracking/${order._id}`)}
//                         className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
//                       >
//                         Track Live GPS 📍
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrders;























import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../../context/SocketContext';

const BACKEND_URL = 'http://localhost:3000';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const { socket, joinCustomerRoom } = useSocketContext();

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${BACKEND_URL}/api/orders/my-orders`, {
        withCredentials: true,
      });

      if (res.data?.orders) {
        setOrders(res.data.orders);
      } else if (Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch customer orders:', err);
      setError('Failed to load orders. Please make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();

    const customerId = localStorage.getItem('userId') || localStorage.getItem('customerId');
    if (socket && customerId) {
      joinCustomerRoom(customerId);

      socket.on('orderStatusUpdated', (data) => {
        alert(data.message || '🏪 Your order status has been updated!');
        fetchMyOrders();
      });

      socket.on('deliveryBoyAssigned', (data) => {
        alert('🛵 ' + (data.message || 'Delivery rider assigned to your order!'));
        fetchMyOrders();
      });

      return () => {
        socket.off('orderStatusUpdated');
        socket.off('deliveryBoyAssigned');
      };
    }
  }, [socket, joinCustomerRoom]);

  // ৩০ মিনিটের মধ্যে এবং রাইডার অ্যাসাইন হওয়ার আগে ক্যান্সেল হ্যান্ডলার
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancellingId(orderId);
      const res = await axios.patch(
        `${BACKEND_URL}/api/orders/cancel/${orderId}`,
        {},
        { withCredentials: true }
      );

      if (res.data?.success) {
        alert('✅ Order cancelled successfully!');
        fetchMyOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  // ৩০ মিনিট ও রাইডার স্ট্যাটাস ভ্যালিডেশন
  const isCancellable = (order) => {
    if (order.status === 'cancelled' || order.status === 'delivered') return false;

    if (order.deliveryBoyId || ['assigned', 'picked_up', 'out_for_delivery'].includes(order.status)) {
      return false;
    }

    const diffMs = Date.now() - new Date(order.createdAt).getTime();
    return diffMs <= 30 * 60 * 1000; // ৩০ মিনিট
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">✓ Delivered</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full text-xs">✕ Cancelled</span>;
      case 'out_for_delivery':
        return <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs">🛵 Out for Delivery</span>;
      case 'picked_up':
      case 'assigned':
        return <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs">📦 Rider Assigned</span>;
      case 'ready_for_shipping':
        return <span className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full text-xs">🏪 Packing by Store</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full text-xs">⏳ Order Placed</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-bold text-slate-500">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">📦 My Orders</h1>
          <p className="text-xs text-slate-500 mt-1">Track all your previous and active grocery orders</p>
        </div>
        <button
          onClick={fetchMyOrders}
          className="text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ক্যান্সেলেশন ও নো-রিটার্ন পলিসি অ্যালার্ট */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-3 font-semibold">
        <span className="text-xl">⚠️</span>
        <span>
          <strong>Order Policy:</strong> Orders can be cancelled within <strong>30 minutes</strong> before a delivery partner is assigned. <strong>No Return Policy</strong> applies once delivered.
        </span>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl">{error}</div>}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border p-12 text-center space-y-4 shadow-sm">
          <div className="text-5xl">🛍️</div>
          <h3 className="font-extrabold text-slate-800 text-lg">No orders placed yet</h3>
          <p className="text-xs text-slate-500">You haven't ordered anything yet. Order groceries and get delivery within 1 hour!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const canCancel = isCancellable(order);

            return (
              <div
                key={order._id}
                className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 hover:border-emerald-300 transition"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                      Order #{order._id?.slice(-8).toUpperCase()}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{date}</p>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {order.productName || order.productId?.productName || 'Grocery Item'} (x{order.quantity || 1})
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      🏪 Store: {order.sellerId?.storeAddress || order.sellerId?.name || 'Local Grocery Store'}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      💳 Payment: <strong className="uppercase">{order.paymentMethod || 'COD'}</strong> ({order.paymentStatus || 'Pending'})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="font-black text-slate-900 text-base">₹{order.totalAmount || order.price || 0}</span>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center border-t">
                  <div>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {canCancel ? '⏳ Cancellation window active (within 30 mins)' : '🔒 Cancellation locked (Rider assigned or >30 mins)'}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-xl text-xs transition border border-rose-200 disabled:opacity-50"
                      >
                        {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order ✕'}
                      </button>
                    )}

                    {order.status !== 'cancelled' && (
                      <button
                        onClick={() => navigate(`/order-tracking/${order._id}`)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                      >
                        Track Live GPS 📍
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;