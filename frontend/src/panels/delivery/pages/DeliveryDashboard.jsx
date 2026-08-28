
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { useSocketContext } from '../../../context/SocketContext';

// const BACKEND_URL = 'http://localhost:3000';

// // 🔔 ১০০% গ্যারান্টেড অটোমেটিক অডিও সাউন্ড (ব্রাউজার পলিসি বাইপাস মেকানিজম)
// const playRiderNotificationSound = () => {
//   try {
//     const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
//     audio.volume = 1.0;
    
//     const playPromise = audio.play();
//     if (playPromise !== undefined) {
//       playPromise.catch(() => {
//         // ফলব্যাক হিসেবে সরাসরি অসিলেটর বীপ সাউন্ড
//         try {
//           const AudioContextClass = window.AudioContext || window.webkitAudioContext;
//           if (AudioContextClass) {
//             const ctx = new AudioContextClass();
//             if (ctx.state === 'suspended') ctx.resume();
            
//             const osc = ctx.createOscillator();
//             const gain = ctx.createGain();
//             osc.type = 'triangle';
//             osc.frequency.setValueAtTime(880, ctx.currentTime);
//             gain.gain.setValueAtTime(0.9, ctx.currentTime);
//             gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
//             osc.connect(gain);
//             gain.connect(ctx.destination);
//             osc.start();
//             osc.stop(ctx.currentTime + 0.5);
//           }
//         } catch (fallbackErr) {
//           console.warn('Audio fallback error:', fallbackErr);
//         }
//       });
//     }
//   } catch (err) {
//     console.warn('Audio play failed:', err);
//   }
// };

// const DeliveryDashboard = () => {
//   const navigate = useNavigate();
//   const { socket, joinDeliveryRoom } = useSocketContext();

//   const [deliveryBoy, setDeliveryBoy] = useState(null);
//   const [isOnline, setIsOnline] = useState(false);
//   const [availableOrders, setAvailableOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusToggling, setStatusToggling] = useState(false);
//   const [acceptingOrderId, setAcceptingOrderId] = useState(null);
//   const [newOrderAlert, setNewOrderAlert] = useState(null);

//   // ১. পেন্ডিং অর্ডার ফেচ করা
//   const fetchAvailableOrders = async () => {
//     try {
//       const res = await axios.get(`${BACKEND_URL}/api/delivery-boy/available-orders`, {
//         withCredentials: true,
//       });
//       if (res.data?.orders) {
//         setAvailableOrders(res.data.orders);
//       }
//     } catch (err) {
//       console.error('Failed to fetch available orders:', err);
//     }
//   };

//   // ২. প্রোফাইল লোড ও রুম জয়েন
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
//         const boyId = String(boy._id || boy.id);
//         localStorage.setItem('deliveryBoyId', boyId);

//         if (socket) {
//           joinDeliveryRoom(boyId);
//         }
//       }

//       await fetchAvailableOrders();
//     } catch (err) {
//       console.error('Failed to fetch dashboard data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // 🔔 ৩. রিয়েল-টাইম সকেট ইভেন্ট ও নোটিফিকেশন হ্যান্ডলার
//   useEffect(() => {
//     if (!socket) return;

//     const boyId = localStorage.getItem('deliveryBoyId');
//     if (boyId) {
//       joinDeliveryRoom(boyId);
//     }

//     const handleIncomingDeliveryOrder = (orderData) => {
//       console.log('⚡ [DELIVERY DASHBOARD] NEW DELIVERY NOTIFICATION:', orderData);

//       // ১. কোনো ক্লিক ছাড়াই সাথে সাথে অটোমেটিক সাউন্ড বাজবে
//       playRiderNotificationSound();

//       // ২. স্ক্রিনে নোটিফিকেশন ব্যানার শো করা
//       setNewOrderAlert({
//         productName: orderData.productName || 'Grocery Package',
//         earning: orderData.deliveryBoyEarning || orderData.deliveryCharge || 40,
//         address:
//           typeof orderData.shippingAddress === 'string'
//             ? orderData.shippingAddress
//             : 'Customer Delivery Address',
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       });

//       // ৩. লিস্টে রিয়েল-টাইমে অর্ডার যোগ করা
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

//     socket.on('newDeliveryOrder', handleIncomingDeliveryOrder);
//     socket.on('orderAssigned', handleIncomingDeliveryOrder);
//     socket.on('orderTaken', handleOrderTaken);

//     return () => {
//       socket.off('newDeliveryOrder', handleIncomingDeliveryOrder);
//       socket.off('orderAssigned', handleIncomingDeliveryOrder);
//       socket.off('orderTaken', handleOrderTaken);
//     };
//   }, [socket, joinDeliveryRoom]);

//   // ৪. অনলাইন / অফলাইন টগল
//   const handleToggleOnline = async () => {
//     try {
//       setStatusToggling(true);
//       if (isOnline) {
//         await axios.put(`${BACKEND_URL}/api/delivery-boy/offline`, {}, { withCredentials: true });
//         setIsOnline(false);
//       } else {
//         await axios.put(`${BACKEND_URL}/api/delivery-boy/online`, {}, { withCredentials: true });
//         setIsOnline(true);
//         if (deliveryBoy?._id && socket) {
//           joinDeliveryRoom(deliveryBoy._id);
//         }
//         fetchAvailableOrders();
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to toggle status');
//     } finally {
//       setStatusToggling(false);
//     }
//   };

//   // ৫. অর্ডার এক্সেপ্ট করা
//   const handleAcceptOrder = async (e, orderId) => {
//     e.stopPropagation();
//     if (!orderId || acceptingOrderId) return;

//     try {
//       setAcceptingOrderId(orderId);
//       const res = await axios.patch(
//         `${BACKEND_URL}/api/delivery-boy/accept/${orderId}`,
//         {},
//         { withCredentials: true }
//       );

//       if (res.status === 200 || res.data?.success) {
//         navigate('/delivery/active', { state: { orderId } });
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to accept order.');
//       fetchAvailableOrders();
//     } finally {
//       setAcceptingOrderId(null);
//     }
//   };

//   const handleSkipOrder = (e, orderId) => {
//     e.stopPropagation();
//     setAvailableOrders((prev) => prev.filter((o) => (o._id || o.orderId) !== orderId));
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 font-bold">
//         Loading Delivery Dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 relative">
//       {/* 🔔 লাইভ নোটিফিকেশন পপআপ ব্যানার */}
//       {newOrderAlert && (
//         <div className="bg-emerald-600 border-2 border-white text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce">
//           <div className="flex items-center gap-3">
//             <span className="text-3xl bg-emerald-700 p-2 rounded-xl">🛵</span>
//             <div>
//               <h3 className="font-black text-sm">New Delivery Request! ({newOrderAlert.time})</h3>
//               <p className="text-xs text-emerald-100 mt-0.5">
//                 Item: <strong>{newOrderAlert.productName}</strong> • Earning: <strong>₹{newOrderAlert.earning}</strong>
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => setNewOrderAlert(null)}
//             className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
//           >
//             ✕ Dismiss
//           </button>
//         </div>
//       )}

//       {/* Rider Header Card */}
//       <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div>
//           <h1 className="text-xl font-black text-slate-900">Delivery Partner Dashboard</h1>
//           <p className="text-xs text-slate-400 mt-1">
//             Partner: <strong className="text-slate-700">{deliveryBoy?.name || 'Active Rider'}</strong> ({deliveryBoy?.phone})
//           </p>
//         </div>

//         <button
//           onClick={handleToggleOnline}
//           disabled={statusToggling}
//           className={`px-6 py-2.5 rounded-full font-black text-xs transition shadow-md disabled:opacity-50 ${
//             isOnline
//               ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
//               : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
//           }`}
//         >
//           {statusToggling ? 'Updating...' : isOnline ? '🟢 You are Online' : '🔴 You are Offline'}
//         </button>
//       </div>

//       {/* Orders List */}
//       {availableOrders.length > 0 ? (
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
//               🚨 Ready for Pickup Orders ({availableOrders.length})
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
//             const isThisOrderAccepting = acceptingOrderId === orderId;

//             const displayAddress =
//               typeof order.shippingAddress === 'string'
//                 ? order.shippingAddress
//                 : order.shippingAddress?.address ||
//                   order.shippingAddress?.fullAddress ||
//                   order.address ||
//                   'Customer delivery address';

//             const productName =
//               order.productId?.productName ||
//               order.productName ||
//               (order.items && order.items[0]?.name) ||
//               'Grocery Item';

//             return (
//               <div
//                 key={orderId}
//                 className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 shadow-md space-y-4"
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full font-mono">
//                     Order #{orderId?.slice(-6).toUpperCase()}
//                   </span>
//                   <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
//                     ⚡ 1-Hour Delivery
//                   </span>
//                 </div>

//                 <div>
//                   <h3 className="font-extrabold text-slate-800 text-sm">
//                     Item: {productName} (x{order.quantity || 1})
//                   </h3>
//                   <p className="text-xs text-slate-600 mt-1">
//                     📍 <strong>Delivery Address:</strong> {displayAddress}
//                   </p>
//                   <div className="flex gap-4 mt-2">
//                     <p className="text-xs font-black text-emerald-600">
//                       💰 Rider Earning: ₹{order.deliveryBoyEarning || order.deliveryCharge || 40}
//                     </p>
//                     <p className="text-xs font-bold text-slate-700">
//                       📦 Collect Cash: ₹{order.totalAmount || order.totalPrice || 0}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={(e) => handleAcceptOrder(e, orderId)}
//                     disabled={Boolean(acceptingOrderId)}
//                     className="flex-1 bg-emerald-600 text-white font-extrabold py-2.5 rounded-xl text-xs hover:bg-emerald-700 shadow-md transition disabled:opacity-50 active:scale-95"
//                   >
//                     {isThisOrderAccepting ? 'Accepting this order...' : 'Accept Order 🛵'}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={(e) => handleSkipOrder(e, orderId)}
//                     disabled={Boolean(acceptingOrderId)}
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

//       {/* Quick Navigation Links */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
//         <Link
//           to="/delivery/active"
//           className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center text-blue-800 font-bold hover:bg-blue-100 transition text-xs"
//         >
//           📦 View Active Delivery
//         </Link>
//         <Link
//           to="/delivery/earnings"
//           className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-bold hover:bg-emerald-100 transition text-xs"
//         >
//           💰 View My Earnings
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default DeliveryDashboard;
































import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useSocketContext } from '../../../context/SocketContext';

const BACKEND_URL = 'http://localhost:3000';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const { socket, joinDeliveryRoom } = useSocketContext();

  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusToggling, setStatusToggling] = useState(false);
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  // 🔊 রিয়েল অডিও রেফারেন্স (ডমের সাথে সার্বক্ষণিক যুক্ত থাকবে)
  const audioRef = useRef(null);

  const triggerSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn('Audio play auto-trigger notice:', err.message);
      });
    }
  };

  // ১. পেন্ডিং অর্ডার ফেচ করা
  const fetchAvailableOrders = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/delivery-boy/available-orders`, {
        withCredentials: true,
      });
      if (res.data?.orders) {
        setAvailableOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch available orders:', err);
    }
  };

  // ২. প্রোফাইল লোড ও রুম জয়েন
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const authRes = await axios.get(`${BACKEND_URL}/api/delivery-boy/is-auth`, {
        withCredentials: true,
      });

      const boy = authRes.data?.deliveryBoy;
      if (boy) {
        setDeliveryBoy(boy);
        setIsOnline(boy.isOnline || false);
        const boyId = String(boy._id || boy.id);
        localStorage.setItem('deliveryBoyId', boyId);

        if (socket) {
          joinDeliveryRoom(boyId);
        }
      }

      await fetchAvailableOrders();
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 🔔 ৩. রিয়েল-টাইম সকেট ইভেন্ট ও ইনস্ট্যান্ট সাউন্ড ট্রিগার
  useEffect(() => {
    if (!socket) return;

    const boyId = localStorage.getItem('deliveryBoyId');
    if (boyId) {
      joinDeliveryRoom(boyId);
    }

    const handleIncomingDeliveryOrder = (orderData) => {
      console.log('⚡ [DELIVERY DASHBOARD] NOTIFICATION RECEIVED:', orderData);

      // ১. সরাসরি ডম অডিও থেকে সাউন্ড প্লে
      triggerSound();

      // ২. স্ক্রিনে নোটিফিকেশন ব্যানার শো
      setNewOrderAlert({
        productName: orderData.productName || 'Grocery Package',
        earning: orderData.deliveryBoyEarning || orderData.deliveryCharge || 40,
        address:
          typeof orderData.shippingAddress === 'string'
            ? orderData.shippingAddress
            : 'Customer Delivery Address',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      // ৩. স্টেট আপডেট
      setAvailableOrders((prev) => {
        const id = orderData._id || orderData.orderId;
        const exists = prev.some((o) => (o._id || o.orderId) === id);
        if (exists) return prev;
        return [orderData, ...prev];
      });
    };

    const handleOrderTaken = (data) => {
      setAvailableOrders((prev) => prev.filter((o) => (o._id || o.orderId) !== data.orderId));
    };

    socket.on('newDeliveryOrder', handleIncomingDeliveryOrder);
    socket.on('orderAssigned', handleIncomingDeliveryOrder);
    socket.on('orderTaken', handleOrderTaken);

    return () => {
      socket.off('newDeliveryOrder', handleIncomingDeliveryOrder);
      socket.off('orderAssigned', handleIncomingDeliveryOrder);
      socket.off('orderTaken', handleOrderTaken);
    };
  }, [socket, joinDeliveryRoom]);

  // ৪. অনলাইন / অফলাইন টগল
  const handleToggleOnline = async () => {
    try {
      setStatusToggling(true);
      if (isOnline) {
        await axios.put(`${BACKEND_URL}/api/delivery-boy/offline`, {}, { withCredentials: true });
        setIsOnline(false);
      } else {
        await axios.put(`${BACKEND_URL}/api/delivery-boy/online`, {}, { withCredentials: true });
        setIsOnline(true);
        if (deliveryBoy?._id && socket) {
          joinDeliveryRoom(deliveryBoy._id);
        }
        fetchAvailableOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    } finally {
      setStatusToggling(false);
    }
  };

  // ৫. অর্ডার এক্সেপ্ট করা
  const handleAcceptOrder = async (e, orderId) => {
    e.stopPropagation();
    if (!orderId || acceptingOrderId) return;

    try {
      setAcceptingOrderId(orderId);
      const res = await axios.patch(
        `${BACKEND_URL}/api/delivery-boy/accept/${orderId}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200 || res.data?.success) {
        navigate('/delivery/active', { state: { orderId } });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept order.');
      fetchAvailableOrders();
    } finally {
      setAcceptingOrderId(null);
    }
  };

  const handleSkipOrder = (e, orderId) => {
    e.stopPropagation();
    setAvailableOrders((prev) => prev.filter((o) => (o._id || o.orderId) !== orderId));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 font-bold">
        Loading Delivery Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 relative">
      {/* 🔊 হিডেন অডিও ট্যাগ (সাউন্ড প্লে নিশ্চিত করার জন্য) */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
        preload="auto"
      />

      {/* 🔔 লাইভ নোটিফিকেশন পপআপ ব্যানার */}
      {newOrderAlert && (
        <div className="bg-emerald-600 border-2 border-white text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-emerald-700 p-2 rounded-xl">🛵</span>
            <div>
              <h3 className="font-black text-sm">New Delivery Request! ({newOrderAlert.time})</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Item: <strong>{newOrderAlert.productName}</strong> • Earning: <strong>₹{newOrderAlert.earning}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setNewOrderAlert(null)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* Rider Header Card */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Delivery Partner Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Partner: <strong className="text-slate-700">{deliveryBoy?.name || 'Active Rider'}</strong> ({deliveryBoy?.phone})
          </p>
        </div>

        <button
          onClick={handleToggleOnline}
          disabled={statusToggling}
          className={`px-6 py-2.5 rounded-full font-black text-xs transition shadow-md disabled:opacity-50 ${
            isOnline
              ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          {statusToggling ? 'Updating...' : isOnline ? '🟢 You are Online' : '🔴 You are Offline'}
        </button>
      </div>

      {/* Orders List */}
      {availableOrders.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              🚨 Ready for Pickup Orders ({availableOrders.length})
            </h2>
            <button
              onClick={fetchAvailableOrders}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              🔄 Refresh
            </button>
          </div>

          {availableOrders.map((order) => {
            const orderId = order._id || order.orderId;
            const isThisOrderAccepting = acceptingOrderId === orderId;

            const displayAddress =
              typeof order.shippingAddress === 'string'
                ? order.shippingAddress
                : order.shippingAddress?.address ||
                  order.shippingAddress?.fullAddress ||
                  order.address ||
                  'Customer delivery address';

            const productName =
              order.productId?.productName ||
              order.productName ||
              (order.items && order.items[0]?.name) ||
              'Grocery Item';

            return (
              <div
                key={orderId}
                className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 shadow-md space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full font-mono">
                    Order #{orderId?.slice(-6).toUpperCase()}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
                    ⚡ 1-Hour Delivery
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    Item: {productName} (x{order.quantity || 1})
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    📍 <strong>Delivery Address:</strong> {displayAddress}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <p className="text-xs font-black text-emerald-600">
                      💰 Rider Earning: ₹{order.deliveryBoyEarning || order.deliveryCharge || 40}
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      📦 Collect Cash: ₹{order.totalAmount || order.totalPrice || 0}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={(e) => handleAcceptOrder(e, orderId)}
                    disabled={Boolean(acceptingOrderId)}
                    className="flex-1 bg-emerald-600 text-white font-extrabold py-2.5 rounded-xl text-xs hover:bg-emerald-700 shadow-md transition disabled:opacity-50 active:scale-95"
                  >
                    {isThisOrderAccepting ? 'Accepting this order...' : 'Accept Order 🛵'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSkipOrder(e, orderId)}
                    disabled={Boolean(acceptingOrderId)}
                    className="px-4 bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-300 transition"
                  >
                    Skip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border p-12 text-center space-y-2">
          <div className="text-4xl">🛵</div>
          <p className="text-slate-600 font-bold text-sm">
            {isOnline
              ? 'Waiting for new delivery requests...'
              : 'Go online to start receiving instant delivery orders!'}
          </p>
        </div>
      )}

      {/* Quick Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <Link
          to="/delivery/active"
          className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center text-blue-800 font-bold hover:bg-blue-100 transition text-xs"
        >
          📦 View Active Delivery
        </Link>
        <Link
          to="/delivery/earnings"
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-bold hover:bg-emerald-100 transition text-xs"
        >
          💰 View My Earnings
        </Link>
      </div>
    </div>
  );
};

export default DeliveryDashboard;