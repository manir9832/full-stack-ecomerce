









// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSocketContext } from '../../../context/SocketContext';
// import { getOrderDetails } from '../../../api/orderApi';
// import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';

// // ব্যাকএন্ড স্কিমার সাথে মিল রেখে স্ট্যাটাস ধাপসমূহ
// const STATUS_STEPS = [
//   { key: 'pending', label: 'Order Placed', icon: '📝' },
//   { key: 'ready_for_shipping', label: 'Packed & Ready', icon: '📦' },
//   { key: 'assigned', label: 'Rider Assigned', icon: '🛵' },
//   { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚀' },
//   { key: 'delivered', label: 'Delivered', icon: '✅' },
// ];

// const OrderTracking = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { socket, joinCustomerRoom } = useSocketContext();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ১. প্রাথমিক অর্ডার ডাটা ফেচ
//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await getOrderDetails(orderId);
//         if (res.data?.order || res.data?.success) {
//           setOrder(res.data.order || res.data);
//         }
//       } catch (err) {
//         console.error('Failed to fetch order tracking:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (orderId) fetchOrder();
//   }, [orderId]);

//   // ২. রিয়েল-টাইম সকেট ইভেন্ট লিসেনার
//   useEffect(() => {
//     if (socket && orderId) {
//       if (typeof joinCustomerRoom === 'function') {
//         joinCustomerRoom(orderId);
//       }

//       // স্ট্যাটাস আপডেট লিসেনার
//       socket.on('orderStatusUpdated', (updatedOrder) => {
//         if (updatedOrder._id === orderId) {
//           setOrder(updatedOrder);
//         }
//       });

//       // ডেলিভারি বয় অ্যাসাইন হওয়ার লাইভ ইভেন্ট
//       socket.on('deliveryBoyAssigned', (data) => {
//         if (data.orderId === orderId) {
//           setOrder((prev) => (prev ? { ...prev, status: 'assigned' } : prev));
//         }
//       });

//       return () => {
//         socket.off('orderStatusUpdated');
//         socket.off('deliveryBoyAssigned');
//       };
//     }
//   }, [socket, orderId, joinCustomerRoom]);

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
//         <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
//         <p className="text-sm font-bold text-slate-700">Loading live tracking...</p>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="max-w-md mx-auto py-16 text-center space-y-4">
//         <p className="text-slate-500 font-bold">Order not found!</p>
//         <button
//           onClick={() => navigate('/')}
//           className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow transition active:scale-95"
//         >
//           Go to Home
//         </button>
//       </div>
//     );
//   }

//   const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

//   // অ্যাড্রেস হ্যান্ডলিং (স্ট্রিং বা অবজেক্ট উভয়ের জন্য নিরাপদ)
//   const displayAddress =
//     typeof order.shippingAddress === 'string'
//       ? order.shippingAddress
//       : order.shippingAddress?.address ||
//         order.shippingAddress?.fullAddress ||
//         JSON.stringify(order.shippingAddress) ||
//         'Address provided during checkout';

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
//       {/* Top Header Card */}
//       <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div>
//           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
//             Order Reference
//           </span>
//           <h2 className="text-xl font-black text-slate-900">
//             #{order._id?.slice(-8).toUpperCase()}
//           </h2>
//           <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
//             <span>
//               Payment: <strong className="text-slate-800">{order.paymentMethod}</strong>
//             </span>
//             <span>•</span>
//             <span>
//               Status:{' '}
//               <strong className="text-emerald-600 uppercase font-black">
//                 {order.paymentStatus || 'Pending'}
//               </strong>
//             </span>
//           </div>
//         </div>

//         <OneHourDeliveryBadge />
//       </div>

//       {/* Real-time Order Progress Tracking */}
//       <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-6">
//         <div className="flex items-center justify-between border-b pb-3">
//           <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
//             Live Order Status 🛵
//           </h3>
//           <span className="text-xs font-black px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
//             {order.status?.replace(/_/g, ' ').toUpperCase()}
//           </span>
//         </div>

//         <div className="relative flex items-center justify-between">
//           {STATUS_STEPS.map((step, idx) => {
//             const isPassed = currentStepIndex >= idx;
//             const isCurrent = currentStepIndex === idx;

//             return (
//               <div
//                 key={step.key}
//                 className="flex flex-col items-center relative z-10 flex-1 text-center"
//               >
//                 <div
//                   className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
//                     isPassed
//                       ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 ring-4 ring-emerald-50'
//                       : 'bg-slate-100 text-slate-400 border'
//                   } ${isCurrent ? 'scale-110 animate-pulse' : ''}`}
//                 >
//                   {isPassed ? '✓' : idx + 1}
//                 </div>

//                 <span
//                   className={`text-[10px] sm:text-xs font-extrabold mt-2 ${
//                     isPassed ? 'text-slate-800' : 'text-slate-400'
//                   }`}
//                 >
//                   {step.label}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Delivery Address & Order Summary */}
//       <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
//         <div>
//           <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">
//             Delivery Destination
//           </h4>
//           <p className="text-xs font-medium text-slate-700 bg-slate-50 p-3.5 rounded-xl border leading-relaxed">
//             📍 {displayAddress}
//           </p>
//         </div>

//         <div className="border-t pt-4 space-y-2">
//           <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">
//             Order Summary
//           </h4>
//           <div className="flex justify-between text-xs font-medium text-slate-600">
//             <span>Item ({order.productName || 'Product'} x {order.quantity || 1})</span>
//             <span className="font-bold text-slate-900">₹{order.productTotal || order.price}</span>
//           </div>
//           <div className="flex justify-between text-xs font-medium text-slate-600">
//             <span>Delivery Charge</span>
//             <span className="font-bold text-slate-900">₹{order.deliveryCharge || 0}</span>
//           </div>
//           <div className="flex justify-between text-sm font-black text-slate-900 border-t pt-3 mt-2">
//             <span>Total Payable</span>
//             <span className="text-emerald-600 text-base">₹{order.totalAmount}</span>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default OrderTracking;
























import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../../context/SocketContext';
import { getOrderDetails } from '../../../api/orderApi';
import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📝' },
  { key: 'ready_for_shipping', label: 'Packed & Ready', icon: '📦' },
  { key: 'assigned', label: 'Rider Assigned', icon: '🛵' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚀' },
  { key: 'delivered', label: 'Delivered', icon: '✅' },
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { socket, joinCustomerRoom } = useSocketContext();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [riderLocation, setRiderLocation] = useState(null);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const directionsRendererRef = useRef(null);

  // ১. প্রাথমিক অর্ডার ডাটা ফেচ
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderDetails(orderId);
        if (res.data?.order || res.data?.success) {
          const currentOrder = res.data.order || res.data;
          setOrder(currentOrder);

          if (currentOrder.deliveryBoyId?.location) {
            setRiderLocation(currentOrder.deliveryBoyId.location);
          } else if (currentOrder.sellerLocation) {
            setRiderLocation(currentOrder.sellerLocation);
          }
        }
      } catch (err) {
        console.error('Failed to fetch order tracking:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  // ২. রিয়েল-টাইম সকেট ইভেন্ট ও রাইডার লোকেশন ট্র্যাকিং
  useEffect(() => {
    if (socket && orderId) {
      if (typeof joinCustomerRoom === 'function') {
        joinCustomerRoom(orderId);
      }

      socket.on('orderStatusUpdated', (updatedOrder) => {
        if (updatedOrder._id === orderId) {
          setOrder(updatedOrder);
        }
      });

      socket.on('deliveryBoyAssigned', (data) => {
        if (data.orderId === orderId) {
          setOrder((prev) => (prev ? { ...prev, status: 'assigned' } : prev));
        }
      });

      // রাইডারের লাইভ জিপিএস কোঅর্ডিনেট রিসিভ
      socket.on('riderLocationUpdated', (data) => {
        if (data.orderId === orderId && data.location) {
          setRiderLocation(data.location);

          // ম্যাপে বাইক মার্কার মুভ করা
          if (riderMarkerRef.current && window.google) {
            const newPos = new window.google.maps.LatLng(
              data.location.latitude,
              data.location.longitude
            );
            riderMarkerRef.current.setPosition(newPos);
          }
        }
      });

      return () => {
        socket.off('orderStatusUpdated');
        socket.off('deliveryBoyAssigned');
        socket.off('riderLocationUpdated');
      };
    }
  }, [socket, orderId, joinCustomerRoom]);

  // ৩. গুগল ম্যাপস স্ক্রিপ্ট লোড ও রেন্ডারিং
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !order || !mapRef.current) return;

    const renderMap = () => {
      if (!window.google || !mapRef.current) return;

      const storePos = {
        lat: Number(order.sellerLocation?.latitude || 22.6401),
        lng: Number(order.sellerLocation?.longitude || 88.6795),
      };

      const customerPos = {
        lat: Number(order.customerLocation?.latitude || 22.645),
        lng: Number(order.customerLocation?.longitude || 88.685),
      };

      const map = new window.google.maps.Map(mapRef.current, {
        center: storePos,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      mapInstanceRef.current = map;

      // স্টোর মার্কার (দোকান)
      new window.google.maps.Marker({
        position: storePos,
        map,
        title: 'Store Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        },
      });

      // কাস্টমার মার্কার (বাড়ি)
      new window.google.maps.Marker({
        position: customerPos,
        map,
        title: 'Delivery Address',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        },
      });

      // রাইডার মার্কার (বাইক)
      const initialRiderPos = riderLocation
        ? { lat: Number(riderLocation.latitude), lng: Number(riderLocation.longitude) }
        : storePos;

      riderMarkerRef.current = new window.google.maps.Marker({
        position: initialRiderPos,
        map,
        title: 'Delivery Rider',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });

      // লাইভ রুট ডিরেকশন আঁকা
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#059669',
          strokeWeight: 5,
        },
      });
      directionsRendererRef.current = directionsRenderer;

      directionsService.route(
        {
          origin: storePos,
          destination: customerPos,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          }
        }
      );
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = renderMap;
      document.head.appendChild(script);
    } else {
      renderMap();
    }
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-700">Loading live tracking...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <p className="text-slate-500 font-bold">Order not found!</p>
        <button
          onClick={() => navigate('/')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow transition active:scale-95"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  const displayAddress =
    typeof order.shippingAddress === 'string'
      ? order.shippingAddress
      : order.shippingAddress?.address ||
        order.shippingAddress?.fullAddress ||
        JSON.stringify(order.shippingAddress) ||
        'Address provided during checkout';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Order Reference
          </span>
          <h2 className="text-xl font-black text-slate-900">
            #{order._id?.slice(-8).toUpperCase()}
          </h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
            <span>
              Payment: <strong className="text-slate-800">{order.paymentMethod}</strong>
            </span>
            <span>•</span>
            <span>
              Status:{' '}
              <strong className="text-emerald-600 uppercase font-black">
                {order.paymentStatus || 'Pending'}
              </strong>
            </span>
          </div>
        </div>

        <OneHourDeliveryBadge />
      </div>

      {/* 🗺️ Google Maps Live Tracking View */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden space-y-3">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            Live GPS Route & Partner Movement
          </span>
          <span className="text-emerald-400">
            Distance: {order.distanceKm ? `${order.distanceKm} km` : 'Calculating...'}
          </span>
        </div>

        <div className="w-full h-80 bg-slate-100 relative" ref={mapRef}>
          {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-500 font-bold text-xs p-4 text-center">
              Please add VITE_GOOGLE_MAPS_API_KEY in frontend/.env to activate map view.
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t flex items-center justify-around text-[11px] font-bold text-slate-600">
          <span className="flex items-center gap-1.5">🟢 Store</span>
          <span className="flex items-center gap-1.5">🔵 Delivery Rider</span>
          <span className="flex items-center gap-1.5">🔴 Delivery Address</span>
        </div>
      </div>

      {/* Real-time Order Progress Tracking */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            Live Order Status 🛵
          </h3>
          <span className="text-xs font-black px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            {order.status?.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>

        <div className="relative flex items-center justify-between">
          {STATUS_STEPS.map((step, idx) => {
            const isPassed = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={step.key}
                className="flex flex-col items-center relative z-10 flex-1 text-center"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isPassed
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 ring-4 ring-emerald-50'
                      : 'bg-slate-100 text-slate-400 border'
                  } ${isCurrent ? 'scale-110 animate-pulse' : ''}`}
                >
                  {isPassed ? '✓' : idx + 1}
                </div>

                <span
                  className={`text-[10px] sm:text-xs font-extrabold mt-2 ${
                    isPassed ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Address & Order Summary */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
        <div>
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">
            Delivery Destination
          </h4>
          <p className="text-xs font-medium text-slate-700 bg-slate-50 p-3.5 rounded-xl border leading-relaxed">
            📍 {displayAddress}
          </p>
        </div>

        <div className="border-t pt-4 space-y-2">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">
            Order Summary
          </h4>
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Item ({order.productName || 'Product'} x {order.quantity || 1})</span>
            <span className="font-bold text-slate-900">₹{order.productTotal || order.price}</span>
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Delivery Charge</span>
            <span className="font-bold text-slate-900">₹{order.deliveryCharge || 0}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 border-t pt-3 mt-2">
            <span>Total Payable</span>
            <span className="text-emerald-600 text-base">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;