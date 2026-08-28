


// import React, { useState, useEffect } from 'react';
// import AddProductModal from '../components/AddProductModal';
// import EditProductModal from '../components/EditProductModal';
// import { getSellerProducts } from '../../../api/sellerProductApi';
// import API from '../../../api/axiosConfig';
// import { useSocketContext } from '../../../context/SocketContext';

// // Notification Audio Beep
// const playNotificationSound = () => {
//   try {
//     const AudioContext = window.AudioContext || window.webkitAudioContext;
//     if (!AudioContext) return;
//     const ctx = new AudioContext();
//     if (ctx.state === 'suspended') ctx.resume();

//     const osc = ctx.createOscillator();
//     const gain = ctx.createGain();

//     osc.type = 'triangle';
//     osc.frequency.setValueAtTime(587.33, ctx.currentTime);
//     osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);

//     gain.gain.setValueAtTime(0.5, ctx.currentTime);
//     gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

//     osc.connect(gain);
//     gain.connect(ctx.destination);

//     osc.start();
//     osc.stop(ctx.currentTime + 0.6);
//   } catch (e) {
//     console.warn('Audio play error:', e);
//   }
// };

// const SellerDashboard = () => {
//   const [activeTab, setActiveTab] = useState('orders');
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [alertMessage, setAlertMessage] = useState(null);
//   const [stats, setStats] = useState({
//     totalEarnings: 0,
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalProducts: 0,
//     lowStockProducts: 0,
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [locationLoading, setLocationLoading] = useState(false);
//   const [storeLocation, setStoreLocation] = useState(null);
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [storeForm, setStoreForm] = useState({
//     shopName: '',
//     area: '',
//     pincode: '743424',
//     fullAddress: '',
//   });

//   const { socket, joinSellerRoom } = useSocketContext();

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       const fetchOrdersReq = API.get('/orders/seller-orders').catch(() =>
//         API.get('/order/seller-orders').catch(() => ({ data: { orders: [] } }))
//       );

//       const [prodRes, orderRes, statRes, authRes] = await Promise.all([
//         getSellerProducts().catch(() => ({ data: { products: [] } })),
//         fetchOrdersReq,
//         API.get('/seller/dashboard-stats').catch(() => ({ data: { stats: {} } })),
//         API.get('/seller/isAuth').catch(() => ({ data: { seller: null } })),
//       ]);

//       const fetchedOrders = orderRes.data?.orders || [];
//       const fetchedProducts = prodRes.data?.products || [];

//       setProducts(fetchedProducts);
//       setOrders(fetchedOrders);

//       if (statRes.data?.stats) {
//         setStats(statRes.data.stats);
//       } else {
//         const pendingCount = fetchedOrders.filter((o) => o.status === 'pending').length;
//         const totalRevenue = fetchedOrders
//           .filter((o) => o.status === 'delivered')
//           .reduce((sum, o) => sum + (o.productTotal || 0), 0);

//         setStats((prev) => ({
//           ...prev,
//           pendingOrders: pendingCount,
//           totalEarnings: totalRevenue,
//           totalProducts: fetchedProducts.length,
//           lowStockProducts: fetchedProducts.filter((p) => (p.stock ?? 50) < 10).length,
//         }));
//       }

//       if (authRes.data?.seller) {
//         const seller = authRes.data.seller;
//         const sId = String(seller._id || seller.id);
//         localStorage.setItem('sellerId', sId);

//         if (socket) {
//           joinSellerRoom(sId);
//         }

//         if (seller.location?.latitude) {
//           setStoreLocation(seller.location);
//         }
//         setStoreForm({
//           shopName: seller.name || '',
//           area: seller.storeAddress || '',
//           pincode: seller.pincode || '743424',
//           fullAddress: seller.storeAddress || '',
//         });
//       }
//     } catch (err) {
//       console.error('Failed to load dashboard data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // 🔔 Socket Listeners (Live Orders, Cancellations, View Updates)
//   useEffect(() => {
//     if (!socket) return;

//     const sId = localStorage.getItem('sellerId');
//     if (sId) {
//       joinSellerRoom(sId);
//     }

//     const onOrderReceived = (data) => {
//       playNotificationSound();
//       setAlertMessage({
//         productName: data?.productName || 'Grocery Product',
//         quantity: data?.quantity || 1,
//         total: data?.productTotal || 0,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       });
//       fetchDashboardData();
//     };

//     const onOrderCancelled = (data) => {
//       alert(data.message || '⚠️ An order was cancelled by customer');
//       fetchDashboardData();
//     };

//     // 👁️ কাস্টমার কোনো প্রডাক্ট ভিউ করলে লাইভ কাউন্টার আপডেট
//     const onProductViewUpdated = ({ productId, viewCount }) => {
//       setProducts((prev) =>
//         prev.map((p) => (p._id === productId ? { ...p, viewCount } : p))
//       );
//     };

//     socket.on('newOrderAlert', onOrderReceived);
//     socket.on('new_order_notification', onOrderReceived);
//     socket.on('globalNewOrder', onOrderReceived);
//     socket.on('orderCancelledAlert', onOrderCancelled);
//     socket.on('productViewUpdated', onProductViewUpdated);

//     return () => {
//       socket.off('newOrderAlert', onOrderReceived);
//       socket.off('new_order_notification', onOrderReceived);
//       socket.off('globalNewOrder', onOrderReceived);
//       socket.off('orderCancelledAlert', onOrderCancelled);
//       socket.off('productViewUpdated', onProductViewUpdated);
//     };
//   }, [socket, joinSellerRoom]);

//   const handlePincodeChange = (e) => {
//     setStoreForm((prev) => ({ ...prev, pincode: e.target.value.trim() }));
//   };

//   const handleSaveStoreAddress = async (e) => {
//     e.preventDefault();
//     if (!storeForm.pincode || !storeForm.area) {
//       return alert('Store area and pin code are required');
//     }
//     try {
//       setLocationLoading(true);
//       const res = await API.put('/seller/location', {
//         latitude: 22.6401,
//         longitude: 88.6795,
//         pincode: storeForm.pincode.trim(),
//         storeAddress: `${storeForm.shopName ? storeForm.shopName + ', ' : ''}${storeForm.area}, Pin: ${storeForm.pincode}`,
//       });
//       setStoreLocation(res.data?.location || { latitude: 22.6401, longitude: 88.6795 });
//       setShowAddressForm(false);
//       alert('✅ Store address set successfully!');
//     } catch (err) {
//       alert('Failed to save store address');
//     } finally {
//       setLocationLoading(false);
//     }
//   };

//   const handleAcceptOrder = async (orderId) => {
//     try {
//       await API.patch(`/orders/seller-accept/${orderId}`).catch(() =>
//         API.patch(`/order/seller-accept/${orderId}`)
//       );
//       alert('✅ Order accepted! Delivery partners have been notified.');
//       fetchDashboardData();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to accept order');
//     }
//   };

//   const handleEditClick = (product) => {
//     setSelectedProduct(product);
//     setIsEditModalOpen(true);
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (!window.confirm('Are you sure you want to delete this product?')) return;
//     try {
//       await API.delete(`/seller/products/delete/${productId}`);
//       fetchDashboardData();
//     } catch (err) {
//       alert('Failed to delete product');
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative">
//       {/* 🔔 Live New Order Notification Banner */}
//       {alertMessage && (
//         <div className="bg-emerald-600 border-2 border-white text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce">
//           <div className="flex items-center gap-3">
//             <span className="text-3xl bg-emerald-700 p-2 rounded-xl">🔔</span>
//             <div>
//               <h3 className="font-black text-sm">New Order Received! ({alertMessage.time})</h3>
//               <p className="text-xs text-emerald-100 mt-0.5">
//                 Product: <strong>{alertMessage.productName}</strong> (Qty: {alertMessage.quantity}) • Total: <strong>₹{alertMessage.total}</strong>
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => setAlertMessage(null)}
//             className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
//           >
//             ✕ Close
//           </button>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-lg">
//             G
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-slate-900">Seller Control Dashboard</h1>
//             <p className="text-xs text-slate-400">Track store performance, earnings, and incoming orders.</p>
//           </div>
//         </div>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-md transition active:scale-95"
//         >
//           + Add New Product
//         </button>
//       </div>

//       {/* Store Location Card */}
//       <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="text-2xl bg-emerald-50 text-emerald-700 p-2.5 rounded-xl border border-emerald-100">
//               🏪
//             </div>
//             <div>
//               <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
//                 Store Pickup Location
//                 {storeLocation?.latitude ? (
//                   <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
//                     Active & Ready for Pickup
//                   </span>
//                 ) : (
//                   <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
//                     Address Not Configured
//                   </span>
//                 )}
//               </h4>
//               <p className="text-xs text-slate-500 mt-0.5">
//                 {storeLocation?.latitude
//                   ? `Store Location: ${storeForm.area || 'Active Zone'} (Pin: ${storeForm.pincode})`
//                   : 'Set your shop address so delivery partners can arrive directly at your counter.'}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => setShowAddressForm(!showAddressForm)}
//             className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl transition"
//           >
//             {showAddressForm ? 'Close' : '✏️ Set / Edit Shop Address'}
//           </button>
//         </div>

//         {showAddressForm && (
//           <form onSubmit={handleSaveStoreAddress} className="border-t pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
//             <div>
//               <label className="block text-[11px] font-bold text-slate-600 mb-1">Store Name</label>
//               <input
//                 type="text"
//                 placeholder="e.g. Sarkar Grocery Store"
//                 value={storeForm.shopName}
//                 onChange={(e) => setStoreForm({ ...storeForm, shopName: e.target.value })}
//                 className="w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
//               />
//             </div>
//             <div>
//               <label className="block text-[11px] font-bold text-slate-600 mb-1">Area / Landmark</label>
//               <input
//                 type="text"
//                 placeholder="e.g. Berachampa Main Market"
//                 value={storeForm.area}
//                 onChange={(e) => setStoreForm({ ...storeForm, area: e.target.value })}
//                 className="w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-[11px] font-bold text-slate-600 mb-1">Postal Pincode</label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   maxLength={6}
//                   placeholder="743424"
//                   value={storeForm.pincode}
//                   onChange={handlePincodeChange}
//                   className="w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
//                   required
//                 />
//                 <button
//                   type="submit"
//                   disabled={locationLoading}
//                   className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow transition whitespace-nowrap disabled:opacity-50"
//                 >
//                   {locationLoading ? 'Saving...' : 'Save Address'}
//                 </button>
//               </div>
//             </div>
//           </form>
//         )}
//       </div>

//       {/* Analytics Overview Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-5 rounded-2xl shadow-sm space-y-1">
//           <div className="flex justify-between items-center opacity-90 text-xs font-bold uppercase tracking-wider">
//             <span>Total Earnings</span>
//             <span className="text-base">💰</span>
//           </div>
//           <div className="text-2xl font-black">₹{stats.totalEarnings || 0}</div>
//           <p className="text-[11px] text-emerald-100 font-medium">Real-time revenue</p>
//         </div>

//         <div className="bg-white border p-5 rounded-2xl shadow-sm space-y-1">
//           <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
//             <span>Live / Pending Orders</span>
//             <span className="text-base">⏳</span>
//           </div>
//           <div className="text-2xl font-black text-amber-600">
//             {orders.filter((o) => o.status === 'pending').length}
//           </div>
//           <p className="text-[11px] text-slate-400 font-medium">Awaiting your approval</p>
//         </div>

//         <div className="bg-white border p-5 rounded-2xl shadow-sm space-y-1">
//           <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
//             <span>Total Products</span>
//             <span className="text-base">📦</span>
//           </div>
//           <div className="text-2xl font-black text-slate-900">{products.length}</div>
//           <p className="text-[11px] text-slate-400 font-medium">In your catalogue</p>
//         </div>

//         <div className="bg-white border p-5 rounded-2xl shadow-sm space-y-1">
//           <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
//             <span>Low Stock Alert</span>
//             <span className="text-base">⚠️</span>
//           </div>
//           <div className="text-2xl font-black text-red-600">
//             {products.filter((p) => (p.stock ?? 50) < 10).length}
//           </div>
//           <p className="text-[11px] text-slate-400 font-medium">Stock below 10 units</p>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="flex gap-2 border-b">
//         <button
//           onClick={() => setActiveTab('orders')}
//           className={`pb-3 px-4 font-bold text-sm transition border-b-2 flex items-center gap-2 ${
//             activeTab === 'orders'
//               ? 'border-emerald-600 text-emerald-600'
//               : 'border-transparent text-slate-400 hover:text-slate-600'
//           }`}
//         >
//           Orders ({orders.length})
//           {orders.filter((o) => o.status === 'pending').length > 0 && (
//             <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
//               {orders.filter((o) => o.status === 'pending').length}
//             </span>
//           )}
//         </button>
//         <button
//           onClick={() => setActiveTab('inventory')}
//           className={`pb-3 px-4 font-bold text-sm transition border-b-2 ${
//             activeTab === 'inventory'
//               ? 'border-emerald-600 text-emerald-600'
//               : 'border-transparent text-slate-400 hover:text-slate-600'
//           }`}
//         >
//           Inventory ({products.length})
//         </button>
//       </div>

//       {/* Orders Tab */}
//       {activeTab === 'orders' ? (
//         <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
//           {orders.length === 0 ? (
//             <div className="text-center py-8 border border-dashed rounded-xl text-slate-500 text-sm">
//               No orders received yet.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm border-collapse">
//                 <thead>
//                   <tr className="border-b text-slate-400 text-xs uppercase">
//                     <th className="py-3">Order ID</th>
//                     <th className="py-3">Customer</th>
//                     <th className="py-3">Product</th>
//                     <th className="py-3">Qty</th>
//                     <th className="py-3">Revenue</th>
//                     <th className="py-3">Status</th>
//                     <th className="py-3 text-right">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((o) => (
//                     <tr key={o._id} className="border-b last:border-0 hover:bg-slate-50 transition">
//                       <td className="py-3 font-mono text-xs font-bold">#{o._id?.slice(-6).toUpperCase()}</td>
//                       <td className="py-3 font-medium text-slate-800">{o.customerId?.name || 'Customer'}</td>
//                       <td className="py-3 font-bold">{o.productName}</td>
//                       <td className="py-3">{o.quantity}</td>
//                       <td className="py-3 font-black text-emerald-600">₹{o.productTotal}</td>
//                       <td className="py-3">
//                         <span
//                           className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${
//                             o.status === 'pending'
//                               ? 'bg-amber-100 text-amber-800'
//                               : o.status === 'ready_for_shipping'
//                               ? 'bg-blue-100 text-blue-800'
//                               : o.status === 'delivered'
//                               ? 'bg-emerald-100 text-emerald-800'
//                               : o.status === 'cancelled'
//                               ? 'bg-rose-100 text-rose-800'
//                               : 'bg-slate-100 text-slate-700'
//                           }`}
//                         >
//                           {o.status?.replace(/_/g, ' ')}
//                         </span>
//                       </td>
//                       <td className="py-3 text-right">
//                         {o.status === 'pending' && (
//                           <button
//                             onClick={() => handleAcceptOrder(o._id)}
//                             className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow transition active:scale-95"
//                           >
//                             Accept & Pack 📦
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       ) : (
//         /* Inventory Tab */
//         <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
//           {loading ? (
//             <p className="text-slate-400 text-sm">Loading product list...</p>
//           ) : products.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm border-collapse">
//                 <thead>
//                   <tr className="border-b text-slate-400 text-xs uppercase">
//                     <th className="py-3">Image</th>
//                     <th className="py-3">Product Name</th>
//                     <th className="py-3">Category</th>
//                     <th className="py-3">Price</th>
//                     <th className="py-3">Stock</th>
//                     <th className="py-3">Views / Clicks</th>
//                     <th className="py-3 text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map((item) => (
//                     <tr key={item._id} className="border-b last:border-0 hover:bg-slate-50 transition">
//                       <td className="py-3">
//                         <img
//                           src={item.images?.[0] || item.image || 'https://placehold.co/60x60?text=No+Image'}
//                           alt=""
//                           className="w-12 h-12 object-contain rounded-lg bg-slate-100 border p-1"
//                         />
//                       </td>
//                       <td className="font-bold text-slate-800 py-3">{item.productName || item.title}</td>
//                       <td className="text-slate-500 text-xs py-3">{item.category}</td>
//                       <td className="font-black text-emerald-600 py-3">₹{item.price}</td>
//                       <td className="font-semibold text-slate-700 text-xs py-3">{item.stock ?? 50}</td>
//                       <td className="font-bold text-slate-700 text-xs py-3">
//                         👁️ {item.viewCount || 0} Clicks
//                       </td>
//                       <td className="py-3 text-right space-x-3">
//                         <button
//                           onClick={() => handleEditClick(item)}
//                           className="text-blue-600 hover:text-blue-800 font-bold text-xs"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteProduct(item._id)}
//                           className="text-red-500 hover:text-red-700 font-bold text-xs"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-8 border border-dashed rounded-xl">
//               <p className="text-slate-500 text-sm">No products in inventory.</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Modals */}
//       <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onProductAdded={fetchDashboardData} />
//       <EditProductModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         product={selectedProduct}
//         onProductUpdated={fetchDashboardData}
//       />
//     </div>
//   );
// };

// export default SellerDashboard;



























import React, { useState, useEffect } from 'react';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import { getSellerProducts } from '../../../api/sellerProductApi';
import API from '../../../api/axiosConfig';
import { useSocketContext } from '../../../context/SocketContext';

// Notification Audio Beep
const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
};

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [locationLoading, setLocationLoading] = useState(false);
  const [storeLocation, setStoreLocation] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [storeForm, setStoreForm] = useState({
    shopName: '',
    area: '',
    pincode: '743424',
    fullAddress: '',
  });

  const { socket, joinSellerRoom } = useSocketContext();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const fetchOrdersReq = API.get('/orders/seller-orders').catch(() =>
        API.get('/order/seller-orders').catch(() => ({ data: { orders: [] } }))
      );

      const [prodRes, orderRes, statRes, authRes] = await Promise.all([
        getSellerProducts().catch(() => ({ data: { products: [] } })),
        fetchOrdersReq,
        API.get('/seller/dashboard-stats').catch(() => ({ data: { stats: {} } })),
        API.get('/seller/isAuth').catch(() => ({ data: { seller: null } })),
      ]);

      const fetchedOrders = orderRes.data?.orders || [];
      const fetchedProducts = prodRes.data?.products || [];

      setProducts(fetchedProducts);
      setOrders(fetchedOrders);

      if (statRes.data?.stats) {
        setStats(statRes.data.stats);
      } else {
        const pendingCount = fetchedOrders.filter((o) => o.status === 'pending').length;
        // 💰 সেলারের আসল রেভিনিউ হিসাব (শুধুমাত্র পণ্যের মূল্য * পরিমাণ)
        const totalRevenue = fetchedOrders
          .filter((o) => o.status === 'delivered')
          .reduce((sum, o) => {
            const itemPrice = o.price || o.productId?.price || 0;
            const itemQty = o.quantity || 1;
            return sum + (itemPrice * itemQty);
          }, 0);

        setStats((prev) => ({
          ...prev,
          pendingOrders: pendingCount,
          totalEarnings: totalRevenue,
          totalProducts: fetchedProducts.length,
          lowStockProducts: fetchedProducts.filter((p) => (p.stock ?? 50) < 10).length,
        }));
      }

      if (authRes.data?.seller) {
        const seller = authRes.data.seller;
        const sId = String(seller._id || seller.id);
        localStorage.setItem('sellerId', sId);

        if (socket) {
          joinSellerRoom(sId);
        }

        if (seller.location?.latitude) {
          setStoreLocation(seller.location);
        }
        setStoreForm({
          shopName: seller.name || '',
          area: seller.storeAddress || '',
          pincode: seller.pincode || '743424',
          fullAddress: seller.storeAddress || '',
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 🔔 Socket Listeners
  useEffect(() => {
    if (!socket) return;

    const sId = localStorage.getItem('sellerId');
    if (sId) {
      joinSellerRoom(sId);
    }

    const onOrderReceived = (data) => {
      playNotificationSound();
      setAlertMessage({
        productName: data?.productName || 'Grocery Product',
        quantity: data?.quantity || 1,
        total: data?.productTotal || 0,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      fetchDashboardData();
    };

    const onOrderCancelled = (data) => {
      alert(data.message || '⚠️ An order was cancelled by customer');
      fetchDashboardData();
    };

    const onProductViewUpdated = ({ productId, viewCount }) => {
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, viewCount } : p))
      );
    };

    socket.on('newOrderAlert', onOrderReceived);
    socket.on('new_order_notification', onOrderReceived);
    socket.on('globalNewOrder', onOrderReceived);
    socket.on('orderCancelledAlert', onOrderCancelled);
    socket.on('productViewUpdated', onProductViewUpdated);

    return () => {
      socket.off('newOrderAlert', onOrderReceived);
      socket.off('new_order_notification', onOrderReceived);
      socket.off('globalNewOrder', onOrderReceived);
      socket.off('orderCancelledAlert', onOrderCancelled);
      socket.off('productViewUpdated', onProductViewUpdated);
    };
  }, [socket, joinSellerRoom]);

  const handlePincodeChange = (e) => {
    setStoreForm((prev) => ({ ...prev, pincode: e.target.value.trim() }));
  };

  const handleSaveStoreAddress = async (e) => {
    e.preventDefault();
    if (!storeForm.pincode || !storeForm.area) {
      return alert('Store area and pin code are required');
    }
    try {
      setLocationLoading(true);
      const res = await API.put('/seller/location', {
        latitude: 22.6401,
        longitude: 88.6795,
        pincode: storeForm.pincode.trim(),
        storeAddress: `${storeForm.shopName ? storeForm.shopName + ', ' : ''}${storeForm.area}, Pin: ${storeForm.pincode}`,
      });
      setStoreLocation(res.data?.location || { latitude: 22.6401, longitude: 88.6795 });
      setShowAddressForm(false);
      alert('✅ Store address set successfully!');
    } catch (err) {
      alert('Failed to save store address');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await API.patch(`/orders/seller-accept/${orderId}`).catch(() =>
        API.patch(`/order/seller-accept/${orderId}`)
      );
      alert('✅ Order accepted! Delivery partners have been notified.');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept order');
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/seller/products/delete/${productId}`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative">
      {alertMessage && (
        <div className="bg-emerald-600 border-2 border-white text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-emerald-700 p-2 rounded-xl">🔔</span>
            <div>
              <h3 className="font-black text-sm">New Order Received! ({alertMessage.time})</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Product: <strong>{alertMessage.productName}</strong> (Qty: {alertMessage.quantity}) • Total: <strong>₹{alertMessage.total}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setAlertMessage(null)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
          >
            ✕ Close
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-lg">
            G
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Seller Control Dashboard</h1>
            <p className="text-xs text-slate-400">Track store performance, earnings, and incoming orders.</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-md transition active:scale-95"
        >
          + Add New Product
        </button>
      </div>

      {/* Store Location Card */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl bg-emerald-50 text-emerald-700 p-2.5 rounded-xl border border-emerald-100">
              🏪
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                Store Pickup Location
                {storeLocation?.latitude ? (
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    Active & Ready for Pickup
                  </span>
                ) : (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    Address Not Configured
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {storeLocation?.latitude
                  ? `Store Location: ${storeForm.area || 'Active Zone'} (Pin: ${storeForm.pincode})`
                  : 'Set your shop address so delivery partners can arrive directly at your counter.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl transition"
          >
            {showAddressForm ? 'Close' : '✏️ Set / Edit Shop Address'}
          </button>
        </div>

        {showAddressForm && (
          <form onSubmit={handleSaveStoreAddress} className="border-t pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Store Name</label>
              <input
                type="text"
                placeholder="e.g. Sarkar Grocery Store"
                value={storeForm.shopName}
                onChange={(e) => setStoreForm({ ...storeForm, shopName: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Area / Landmark</label>
              <input
                type="text"
                placeholder="e.g. Berachampa Main Market"
                value={storeForm.area}
                onChange={(e) => setStoreForm({ ...storeForm, area: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Postal Pincode</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="743424"
                  value={storeForm.pincode}
                  onChange={handlePincodeChange}
                  className="w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="submit"
                  disabled={locationLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow transition whitespace-nowrap disabled:opacity-50"
                >
                  {locationLoading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center opacity-90 text-xs font-bold uppercase tracking-wider">
            <span>Total Earnings</span>
            <span className="text-base">💰</span>
          </div>
          <div className="text-2xl font-black">₹{stats.totalEarnings || 0}</div>
          <p className="text-[11px] text-emerald-100 font-medium">Real-time revenue</p>
        </div>

        <div className="bg-white border p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Live / Pending Orders</span>
            <span className="text-base">⏳</span>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {orders.filter((o) => o.status === 'pending').length}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Awaiting your approval</p>
        </div>

        <div className="bg-white border p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Products</span>
            <span className="text-base">📦</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{products.length}</div>
          <p className="text-[11px] text-slate-400 font-medium">In your catalogue</p>
        </div>

        <div className="bg-white border p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Low Stock Alert</span>
            <span className="text-base">⚠️</span>
          </div>
          <div className="text-2xl font-black text-red-600">
            {products.filter((p) => (p.stock ?? 50) < 10).length}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Stock below 10 units</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 font-bold text-sm transition border-b-2 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Orders ({orders.length})
          {orders.filter((o) => o.status === 'pending').length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {orders.filter((o) => o.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 font-bold text-sm transition border-b-2 ${
            activeTab === 'inventory'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Inventory ({products.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' ? (
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-xl text-slate-500 text-sm">
              No orders received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b text-slate-400 text-xs uppercase">
                    <th className="py-3">Order ID</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">Product</th>
                    <th className="py-3">Qty</th>
                    <th className="py-3">Product Revenue</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const singlePrice = o.price || o.productId?.price || 0;
                    const calculatedRevenue = singlePrice * (o.quantity || 1);

                    return (
                      <tr key={o._id} className="border-b last:border-0 hover:bg-slate-50 transition">
                        <td className="py-3 font-mono text-xs font-bold">#{o._id?.slice(-6).toUpperCase()}</td>
                        <td className="py-3 font-medium text-slate-800">{o.customerId?.name || 'Customer'}</td>
                        <td className="py-3 font-bold">{o.productName}</td>
                        <td className="py-3">{o.quantity}</td>
                        {/* 💰 ডেলিভারি চার্জ ছাড়া পণ্যের নিখুঁত রেভিনিউ */}
                        <td className="py-3 font-black text-emerald-600">₹{calculatedRevenue}</td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${
                              o.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : o.status === 'ready_for_shipping'
                                ? 'bg-blue-100 text-blue-800'
                                : o.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : o.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {o.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {o.status === 'pending' && (
                            <button
                              onClick={() => handleAcceptOrder(o._id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow transition active:scale-95"
                            >
                              Accept & Pack 📦
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Inventory Tab */
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
          {loading ? (
            <p className="text-slate-400 text-sm">Loading product list...</p>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b text-slate-400 text-xs uppercase">
                    <th className="py-3">Image</th>
                    <th className="py-3">Product Name</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Stock</th>
                    <th className="py-3">Views / Clicks</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item._id} className="border-b last:border-0 hover:bg-slate-50 transition">
                      <td className="py-3">
                        <img
                          src={item.images?.[0] || item.image || 'https://placehold.co/60x60?text=No+Image'}
                          alt=""
                          className="w-12 h-12 object-contain rounded-lg bg-slate-100 border p-1"
                        />
                      </td>
                      <td className="font-bold text-slate-800 py-3">{item.productName || item.title}</td>
                      <td className="text-slate-500 text-xs py-3">{item.category}</td>
                      <td className="font-black text-emerald-600 py-3">₹{item.price}</td>
                      <td className="font-semibold text-slate-700 text-xs py-3">{item.stock ?? 50}</td>
                      <td className="font-bold text-slate-700 text-xs py-3">
                        👁️ {item.viewCount || 0} Clicks
                      </td>
                      <td className="py-3 text-right space-x-3">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item._id)}
                          className="text-red-500 hover:text-red-700 font-bold text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-xl">
              <p className="text-slate-500 text-sm">No products in inventory.</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onProductAdded={fetchDashboardData} />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onProductUpdated={fetchDashboardData}
      />
    </div>
  );
};

export default SellerDashboard;