


// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// import { getMyOrders } from "../services/api";

// import OrderCard from "../components/OrderCard";
// import EmptyState from "../components/EmptyState";
// import Loader from "../components/Loader";

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ==========================
//   // FETCH ORDERS
//   // ==========================

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);

//       const res = await getMyOrders();

//       setOrders(res.data.orders || []);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to fetch orders"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================
//   // INITIAL LOAD
//   // ==========================

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // ==========================
//   // LOADER
//   // ==========================

//   if (loading) {
//     return <Loader />;
//   }

//   // ==========================
//   // EMPTY STATE
//   // ==========================

//   if (orders.length === 0) {
//     return (
//       <EmptyState
//         title="No Orders Yet"
//         description="You haven't placed any order yet."
//         buttonText="Shop Now"
//         buttonLink="/products"
//       />
//     );
//   }

//   return (
//     <section className="max-w-7xl mx-auto px-4 py-10">

//       {/* Header */}

//       <div className="flex justify-between items-center mb-8">

//         <h1 className="text-3xl font-bold">
//           My Orders
//         </h1>

//         <button
//           onClick={fetchOrders}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
//         >
//           Refresh
//         </button>

//       </div>

//       {/* Orders */}

//       <div className="space-y-6">

//         {orders.map((order) => (
//           <OrderCard
//             key={order._id}
//             order={order}
//           />
//         ))}

//       </div>

//     </section>
//   );
// };

// export default MyOrders;





















import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:3000';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token') || localStorage.getItem('userToken');

      const res = await axios.get(`${BACKEND_URL}/api/orders/my-orders`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      } else if (Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch customer orders:', err);
      setError(err.response?.data?.message || 'Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">✓ Delivered</span>;
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-bold text-slate-500">
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
        <div className="flex gap-2">
          <Link
            to="/"
            className="text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl transition"
          >
            ← Back to Shop
          </Link>
          <button
            onClick={fetchMyOrders}
            className="text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl">
          {error}
        </div>
      )}

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
                      🏪 Store: {order.sellerId?.name || 'Local Grocery Store'}
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

                <div className="pt-2 flex justify-end gap-3 border-t">
                  <button
                    onClick={() => navigate(`/order-tracking/${order._id}`)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                  >
                    Track Live GPS 📍
                  </button>
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